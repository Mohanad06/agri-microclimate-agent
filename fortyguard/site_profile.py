from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional

class SiteProfileValidationError(Exception):
    """Raised when SiteProfile creation fails due to structural or validation issues."""
    pass

@dataclass
class LocationProfile:
    latitude: float
    longitude: float
    matched_address: Optional[str] = None

    def __post_init__(self) -> None:
        if not (-90.0 <= self.latitude <= 90.0):
            raise SiteProfileValidationError(f"Latitude must be between -90 and 90. Got: {self.latitude}")
        if not (-180.0 <= self.longitude <= 180.0):
            raise SiteProfileValidationError(f"Longitude must be between -180 and 180. Got: {self.longitude}")

@dataclass
class FortyGuardStats:
    analytic_type: str
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    mean_value: Optional[float] = None
    units: Optional[str] = None
    threshold: Optional[float] = None
    direction: Optional[str] = None
    source: str = "FortyGuard"

@dataclass
class FortyGuardProfile:
    heatmap_tcm: Optional[FortyGuardStats] = None
    heatmap_exceedance: Optional[FortyGuardStats] = None
    heatmap_persistence: Optional[FortyGuardStats] = None
    raw_env_params: Dict[str, Any] = field(default_factory=dict)
    source: str = "FortyGuard"

@dataclass
class NasaPowerProfile:
    precipitation: Dict[str, Optional[float]] = field(default_factory=dict) # date -> mm/day
    root_zone_wetness: Dict[str, Optional[float]] = field(default_factory=dict) # date -> ratio 0-1
    relative_humidity: Dict[str, Optional[float]] = field(default_factory=dict) # date -> %
    surface_zone_wetness: Dict[str, Optional[float]] = field(default_factory=dict) # date -> ratio 0-1
    source: str = "NASA_POWER"

@dataclass
class SiteProfile:
    location: LocationProfile
    fortyguard: Optional[FortyGuardProfile] = None
    nasa_power: Optional[NasaPowerProfile] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    data_quality_status: str = "COMPLETE" # "COMPLETE", "PARTIAL", "INCOMPLETE"

    def __post_init__(self) -> None:
        # Validate that at least one data source is included
        if self.fortyguard is None and self.nasa_power is None:
            raise SiteProfileValidationError("SiteProfile must contain at least one valid data source (FortyGuard or NASA POWER).")
        
        # Verify internally consistent date ranges if both are present
        if self.start_date and self.end_date:
            try:
                start_val = int(self.start_date.replace("-", ""))
                end_val = int(self.end_date.replace("-", ""))
                if start_val > end_val:
                    raise SiteProfileValidationError(f"Start date {self.start_date} is after end date {self.end_date}.")
            except ValueError:
                pass # Accept date string validation failures gracefully

        # Dynamically evaluate data quality status
        if self.fortyguard is None or self.nasa_power is None:
            self.data_quality_status = "PARTIAL"
        else:
            has_nulls = False
            for param_dict in [self.nasa_power.precipitation, self.nasa_power.root_zone_wetness, self.nasa_power.relative_humidity]:
                if any(v is None for v in param_dict.values()):
                    has_nulls = True
                    break
            if has_nulls:
                self.data_quality_status = "PARTIAL"
            else:
                self.data_quality_status = "COMPLETE"


def normalize_fortyguard_heatmap(raw_response: Dict[str, Any], analytic_type: str, threshold: Optional[float] = None, direction: Optional[str] = None) -> FortyGuardStats:
    """Normalize raw FortyGuard heatmap response stats into a common representation."""
    if not raw_response:
        raise SiteProfileValidationError("FortyGuard raw heatmap response cannot be empty.")
        
    # The client can return {"activity_id": ..., "result": result}
    result = raw_response.get("result", raw_response)
    stats = result.get("stats_data", {})
    
    if not stats:
        # Check if tcm stats exists under temperature_stats
        stats = result.get("temperature_stats", {})
        
    if not stats:
        raise SiteProfileValidationError(f"No statistical data found in FortyGuard response for: {analytic_type}")

    # Map raw parameters depending on TCM vs analysis heatmaps
    if analytic_type == "tcm":
        return FortyGuardStats(
            analytic_type=analytic_type,
            min_value=stats.get("min_temperature") or stats.get("min"),
            max_value=stats.get("max_temperature") or stats.get("max"),
            mean_value=stats.get("mean_temperature") or stats.get("mean"),
            units=stats.get("units", "C")
        )
    else:
        return FortyGuardStats(
            analytic_type=analytic_type,
            min_value=stats.get("min"),
            max_value=stats.get("max"),
            mean_value=stats.get("mean"),
            units=stats.get("units", "hour"),
            threshold=threshold,
            direction=direction
        )

def normalize_nasa_power(raw_normalized_response: Dict[str, Any]) -> NasaPowerProfile:
    """Construct a NasaPowerProfile from the normalized fetch_nasa_power_daily output."""
    if not raw_normalized_response:
        raise SiteProfileValidationError("NASA POWER input response cannot be empty.")
        
    parameters = raw_normalized_response.get("parameters", {})
    
    return NasaPowerProfile(
        precipitation=parameters.get("PRECTOTCORR", {}),
        root_zone_wetness=parameters.get("GWETROOT", {}),
        relative_humidity=parameters.get("RH2M", {}),
        surface_zone_wetness=parameters.get("GWETTOP", {})
    )

def build_site_profile(
    latitude: float,
    longitude: float,
    matched_address: Optional[str] = None,
    fortyguard_raw_heatmaps: Optional[Dict[str, Dict[str, Any]]] = None,
    nasa_power_normalized: Optional[Dict[str, Any]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> SiteProfile:
    """Assemble a complete normalized SiteProfile from individual data layer inputs."""
    location = LocationProfile(latitude=latitude, longitude=longitude, matched_address=matched_address)
    
    fg_profile = None
    if fortyguard_raw_heatmaps:
        tcm_stats = None
        exceed_stats = None
        persist_stats = None
        
        if "tcm" in fortyguard_raw_heatmaps:
            tcm_stats = normalize_fortyguard_heatmap(fortyguard_raw_heatmaps["tcm"], "tcm")
        if "exceedance" in fortyguard_raw_heatmaps:
            exceed_stats = normalize_fortyguard_heatmap(
                fortyguard_raw_heatmaps["exceedance"], 
                "exceedance", 
                threshold=fortyguard_raw_heatmaps["exceedance"].get("threshold"),
                direction=fortyguard_raw_heatmaps["exceedance"].get("direction")
            )
        if "persistence" in fortyguard_raw_heatmaps:
            persist_stats = normalize_fortyguard_heatmap(
                fortyguard_raw_heatmaps["persistence"], 
                "persistence",
                threshold=fortyguard_raw_heatmaps["persistence"].get("threshold"),
                direction=fortyguard_raw_heatmaps["persistence"].get("direction")
            )
            
        fg_profile = FortyGuardProfile(
            heatmap_tcm=tcm_stats,
            heatmap_exceedance=exceed_stats,
            heatmap_persistence=persist_stats
        )
        
    nasa_profile = None
    if nasa_power_normalized:
        nasa_profile = normalize_nasa_power(nasa_power_normalized)
        
    return SiteProfile(
        location=location,
        fortyguard=fg_profile,
        nasa_power=nasa_profile,
        start_date=start_date,
        end_date=end_date
    )

