import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, Any, Optional, List
import datetime

# Import actual Phase 1 & Phase 2 modules
from fortyguard.geocoding import geocode_us_location
from fortyguard.client import FortyGuardClient
from fortyguard.nasa_power import fetch_nasa_power_daily
from knowledge.evidence_tool import retrieve_agronomic_evidence

@dataclass
class ToolResult:
    tool: str
    status: str  # "success" | "partial" | "failed"
    inputs: Dict[str, Any]
    data: Dict[str, Any]
    source: str
    reference: str
    error: Optional[str] = None

class BaseTool(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @abstractmethod
    def execute(self, **kwargs) -> ToolResult:
        pass

class GeocodingTool(BaseTool):
    @property
    def name(self) -> str:
        return "GeocodingTool"

    @property
    def description(self) -> str:
        return "Resolves a textual US location name into lat/lon coordinates."

    def execute(self, location: str) -> ToolResult:
        inputs = {"location": location}
        try:
            res = geocode_us_location(location)
            return ToolResult(
                tool=self.name,
                status="success",
                inputs=inputs,
                data={
                    "latitude": res["latitude"],
                    "longitude": res["longitude"],
                    "matched_address": res["matched_address"]
                },
                source="US Census Geocoder",
                reference="Census Bureau geocoder/locations/onelineaddress"
            )
        except Exception as e:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="US Census Geocoder",
                reference="Census Bureau geocoder",
                error=str(e)
            )

class FortyGuardTool(BaseTool):
    @property
    def name(self) -> str:
        return "FortyGuardTool"

    @property
    def description(self) -> str:
        return "Retrieves hyperlocal heatmaps (exceedance, persistence, TCM) and environmental parameters."

    def _make_square_aoi(self, latitude: float, longitude: float, size_degrees: float = 0.07) -> Dict[str, Any]:
        """Build a ~7km x ~7km GeoJSON FeatureCollection polygon around a point.

        FortyGuard's heatmap endpoint expects FeatureCollection format matching
        the samples.py schema, and requires a minimum polygon area of ~1 km².
        """
        half = size_degrees / 2.0
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [longitude - half, latitude - half],
                            [longitude + half, latitude - half],
                            [longitude + half, latitude + half],
                            [longitude - half, latitude + half],
                            [longitude - half, latitude - half],
                        ]],
                    },
                }
            ],
        }

    @staticmethod
    def _fmt_date(date_str: str) -> str:
        """Convert YYYYMMDD → YYYY-MM-DD if needed (FortyGuard API requirement)."""
        if isinstance(date_str, str) and len(date_str) == 8 and date_str.isdigit():
            return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}"
        return date_str

    def execute(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: Optional[str] = None,
        analytic_type: str = "tcm",
        threshold: Optional[float] = None,
        direction: Optional[str] = None,
        run_env_params: bool = False,
        temperature: float = 30.0
    ) -> ToolResult:
        inputs = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "analytic_type": analytic_type,
            "threshold": threshold,
            "direction": direction,
            "run_env_params": run_env_params,
            "temperature": temperature
        }
        
        # Build client - check if API key exists. If not, fail gracefully (to support keyless validation)
        api_key = os.getenv("FORTYGUARD_API_KEY")
        if not api_key:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="FortyGuard API",
                reference="Enterprise API Connection",
                error="FORTYGUARD_API_KEY environment variable is not configured."
            )

        try:
            client = FortyGuardClient()
            data = {}
            
            # Determine date filter type: 3 = single day, 4 = range of days
            filter_type = 4 if end_date else 3
            
            if run_env_params:
                # Call environmental parameters (optional enrichment)
                try:
                    env_res = client.environmental_parameters(
                        latitude=latitude,
                        longitude=longitude,
                        temperature=temperature,
                        start_date=start_date,
                        filter_type=filter_type,
                        end_date=end_date
                    )
                    # Unwrap wait_for result
                    if isinstance(env_res, dict):
                        data["env_params"] = env_res.get("result", env_res)
                    else:
                        data["env_params"] = env_res
                except Exception:
                    # Non-fatal: if FortyGuard env_params endpoint fails (e.g. HTTP 500 for single day),
                    # allow create_heatmap to proceed and retrieve primary thermal data.
                    pass

            # Call heatmap creation — convert dates to YYYY-MM-DD format
            polygon_aoi = self._make_square_aoi(latitude, longitude)
            fmt_start = self._fmt_date(start_date)
            fmt_end = self._fmt_date(end_date) if end_date else None

            heatmap_res = client.create_heatmap(
                polygon_aoi=polygon_aoi,
                start_date=fmt_start,
                filter_type=filter_type,
                end_date=fmt_end,
                analytic_type=analytic_type,
                threshold=threshold,
                direction=direction,
                verbose=False
            )

            if isinstance(heatmap_res, dict):
                data["heatmap"] = heatmap_res.get("result", heatmap_res)
            else:
                data["heatmap"] = heatmap_res
                
            return ToolResult(
                tool=self.name,
                status="success",
                inputs=inputs,
                data=data,
                source="FortyGuard",
                reference=f"Task API /v1/heatmap ({analytic_type})"
            )
        except Exception as e:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="FortyGuard",
                reference="Task API",
                error=str(e)
            )

class FortyGuardEnvTool(BaseTool):
    @property
    def name(self) -> str:
        return "FortyGuardEnvTool"

    @property
    def description(self) -> str:
        return "Retrieves point environmental parameters (relative humidity, wet-bulb temperature, heat index, solar irradiance) from FortyGuard."

    def execute(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: Optional[str] = None,
        temperature: float = 30.0,
        analysis: Optional[List[str]] = None
    ) -> ToolResult:
        inputs = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "temperature": temperature,
            "analysis": analysis
        }

        api_key = os.getenv("FORTYGUARD_API_KEY")
        if not api_key:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="FortyGuard API",
                reference="Enterprise API Connection /v1/env_params",
                error="FORTYGUARD_API_KEY environment variable is not configured."
            )

        try:
            client = FortyGuardClient()
            filter_type = 4 if end_date else 3

            # Standardize YYYY-MM-DD format if passed as 8-digit YYYYMMDD
            s_date = start_date
            if isinstance(start_date, str) and len(start_date) == 8 and start_date.isdigit():
                s_date = f"{start_date[:4]}-{start_date[4:6]}-{start_date[6:]}"

            e_date = end_date
            if isinstance(end_date, str) and len(end_date) == 8 and end_date.isdigit():
                e_date = f"{end_date[:4]}-{end_date[4:6]}-{end_date[6:]}"

            agri_analysis = analysis or [
                "heat_index_celsius",
                "apparent_temperature_celsius",
                "wet_bulb_temperature_celsius",
                "relative_humidity_percent",
                "solar_irradiance"
            ]

            env_res = client.environmental_parameters(
                latitude=latitude,
                longitude=longitude,
                temperature=temperature,
                start_date=s_date,
                filter_type=filter_type,
                end_date=e_date,
                analysis=agri_analysis
            )

            res_data = env_res.get("result", env_res) if isinstance(env_res, dict) else env_res

            return ToolResult(
                tool=self.name,
                status="success",
                inputs=inputs,
                data={"env_params": res_data},
                source="FortyGuard",
                reference="Task API /v1/env_params"
            )
        except Exception as e:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="FortyGuard",
                reference="Task API /v1/env_params",
                error=str(e)
            )

class NasaPowerTool(BaseTool):
    @property
    def name(self) -> str:
        return "NasaPowerTool"

    @property
    def description(self) -> str:
        return "Fetches daily historical environmental data (precipitation, root zone wetness, humidity) from NASA POWER."

    def execute(
        self,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str,
        parameters: Optional[List[str]] = None
    ) -> ToolResult:
        inputs = {
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "parameters": parameters
        }
        try:
            res = fetch_nasa_power_daily(
                latitude=latitude,
                longitude=longitude,
                start_date=start_date,
                end_date=end_date,
                parameters=parameters
            )
            return ToolResult(
                tool=self.name,
                status="success",
                inputs=inputs,
                data=res,
                source="NASA POWER",
                reference="climatology API temporal/daily/point"
            )
        except Exception as e:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={},
                source="NASA POWER",
                reference="climatology API",
                error=str(e)
            )

class AgronomicEvidenceTool(BaseTool):
    @property
    def name(self) -> str:
        return "AgronomicEvidenceTool"

    @property
    def description(self) -> str:
        return "Retrieves trusted agronomic evidence and thresholds (temperatures, stages, stress metrics) from the RAG store."

    def execute(
        self,
        query: str,
        crop: Optional[str] = None,
        crop_stage: Optional[str] = None,
        topic: Optional[str] = None,
        top_k: int = 3
    ) -> ToolResult:
        inputs = {
            "query": query,
            "crop": crop,
            "crop_stage": crop_stage,
            "topic": topic,
            "top_k": top_k
        }
        try:
            res = retrieve_agronomic_evidence(
                query=query,
                crop=crop,
                crop_stage=crop_stage,
                topic=topic,
                top_k=top_k
            )
            return ToolResult(
                tool=self.name,
                status="success",
                inputs=inputs,
                data={"evidence": res},
                source="Agronomic RAG Store",
                reference="knowledge_store.json vector index"
            )
        except Exception as e:
            return ToolResult(
                tool=self.name,
                status="failed",
                inputs=inputs,
                data={"evidence": []},
                source="Agronomic RAG Store",
                reference="knowledge_store.json vector index",
                error=str(e)
            )

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        # Auto-register core tools
        self.register(GeocodingTool())
        self.register(FortyGuardTool())
        self.register(FortyGuardEnvTool())
        self.register(NasaPowerTool())
        self.register(AgronomicEvidenceTool())

    def register(self, tool: BaseTool) -> None:
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> BaseTool:
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' is not registered in registry.")
        return self._tools[name]

    def list_tools(self) -> List[Dict[str, str]]:
        return [{"name": name, "description": t.description} for name, t in self._tools.items()]

