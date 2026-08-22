import requests
import re
from typing import Dict, Any, List, Optional, Iterable

class NasaPowerError(Exception):
    """Base exception for NASA POWER data service errors."""
    pass

class NasaPowerTimeoutError(NasaPowerError):
    """Raised when the NASA POWER API request times out."""
    pass

class NasaPowerValidationError(NasaPowerError):
    """Raised when inputs (coordinates, dates) fail validation."""
    pass

def validate_coordinates(latitude: float, longitude: float) -> None:
    """Validate that coordinates are within standard ranges."""
    try:
        lat = float(latitude)
        lon = float(longitude)
    except (ValueError, TypeError) as e:
        raise NasaPowerValidationError(f"Coordinates must be numeric: {e}")
        
    if not (-90.0 <= lat <= 90.0):
        raise NasaPowerValidationError(f"Latitude must be between -90 and 90. Got: {latitude}")
    if not (-180.0 <= lon <= 180.0):
        raise NasaPowerValidationError(f"Longitude must be between -180 and 180. Got: {longitude}")

def validate_dates(start_date: str, end_date: str) -> None:
    """Validate that dates follow YYYYMMDD format and start_date <= end_date."""
    date_pattern = re.compile(r"^\d{8}$")
    if not date_pattern.match(start_date):
        raise NasaPowerValidationError(f"start_date must follow YYYYMMDD format. Got: {start_date}")
    if not date_pattern.match(end_date):
        raise NasaPowerValidationError(f"end_date must follow YYYYMMDD format. Got: {end_date}")
        
    try:
        start_val = int(start_date)
        end_val = int(end_date)
    except ValueError:
        raise NasaPowerValidationError("Failed to parse start_date or end_date as numeric values.")
        
    if start_val > end_val:
        raise NasaPowerValidationError(f"start_date ({start_date}) must be before or equal to end_date ({end_date}).")

def fetch_nasa_power_daily(
    latitude: float,
    longitude: float,
    start_date: str,
    end_date: str,
    parameters: Optional[Iterable[str]] = None,
    timeout: float = 15.0
) -> Dict[str, Any]:
    """Retrieve daily meteorological/climatological context from NASA POWER API.
    
    Args:
        latitude: float (-90 to 90)
        longitude: float (-180 to 180)
        start_date: str (YYYYMMDD)
        end_date: str (YYYYMMDD)
        parameters: Optional list of parameter names. Defaults to ["PRECTOTCORR", "GWETROOT", "RH2M"]
        timeout: float, maximum request duration in seconds
        
    Returns:
        A normalized dictionary containing coordinates, date range, parameters list, 
        and date-keyed parameter measurements (with -999.0 fill values replaced with None).
    """
    validate_coordinates(latitude, longitude)
    validate_dates(start_date, end_date)
    
    if parameters is None:
        param_list = ["PRECTOTCORR", "GWETROOT", "RH2M"]
    else:
        param_list = list(parameters)
        if not param_list:
            raise NasaPowerValidationError("Parameters list cannot be empty.")
            
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "parameters": ",".join(param_list),
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": start_date,
        "end": end_date,
        "format": "JSON"
    }
    
    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
    except requests.Timeout as e:
        raise NasaPowerTimeoutError(f"NASA POWER request timed out after {timeout} seconds: {e}")
    except requests.RequestException as e:
        raise NasaPowerError(f"Failed to communicate with NASA POWER API: {e}")
        
    try:
        data = response.json()
    except ValueError as e:
        raise NasaPowerError(f"Malformed API response (invalid JSON): {e}")
        
    properties = data.get("properties", {})
    raw_params = properties.get("parameter", {})
    
    # Normalize returned data structure
    normalized_params: Dict[str, Dict[str, Optional[float]]] = {}
    
    for param in param_list:
        if param not in raw_params:
            raise NasaPowerError(f"Requested parameter '{param}' was missing from the API response.")
            
        raw_values = raw_params[param]
        normalized_values: Dict[str, Optional[float]] = {}
        
        for date_key, val in raw_values.items():
            if val is None or val == -999.0 or val == -999:
                normalized_values[date_key] = None
            else:
                try:
                    normalized_values[date_key] = float(val)
                except (ValueError, TypeError):
                    normalized_values[date_key] = None
                    
        normalized_params[param] = normalized_values
        
    return {
        "source": "NASA_POWER",
        "latitude": float(latitude),
        "longitude": float(longitude),
        "start_date": start_date,
        "end_date": end_date,
        "parameters": normalized_params
    }
