"""
Phase 4.3 — Demo Data & Mock ToolResult Factories.

Provides deterministic, scenario-aware mock data objects for FortyGuard,
NASA POWER, and Geocoding tools. These factories populate ToolResult instances
that can be injected directly into AgentOrchestrator.execute_goal(goal, mock_data=...).

This enables reliable, offline demo execution without spending FortyGuard credits
or requiring an active internet connection.
"""
from typing import Dict, Any
from agent.tool_registry import ToolResult


def get_demo_geocoding_result(location: str = "Phoenix, AZ") -> ToolResult:
    """Deterministic Geocoding mock result."""
    return ToolResult(
        tool="GeocodingTool",
        status="success",
        inputs={"location": location},
        data={
            "latitude": 33.4484,
            "longitude": -112.0740,
            "matched_address": f"{location} (Demo Verified Coordinates)"
        },
        source="US Census Geocoder (Demo Cache)",
        reference="Census Bureau geocoder/locations/onelineaddress"
    )


def get_demo_fortyguard_result() -> ToolResult:
    """Deterministic FortyGuard mock result with peak temperature of 34.5°C."""
    return ToolResult(
        tool="FortyGuardTool",
        status="success",
        inputs={
            "analytic_type": "exceedance",
            "threshold": 32.0,
            "direction": "above"
        },
        data={
            "heatmap": {
                "stats_data": {
                    "max": 34.5,
                    "mean": 32.1,
                    "min": 29.8,
                    "units": "celsius"
                },
                "analytic_type": "exceedance"
            },
            "env_params": {
                "heat_index_celsius": {
                    "14:00": 34.5
                }
            }
        },
        source="FortyGuard (Demo Cache)",
        reference="Simulated Hyperlocal Thermal Surface Layer (34.5°C peak)"
    )


def get_demo_nasa_power_result() -> ToolResult:
    """Deterministic NASA POWER mock result with root zone soil wetness proxy."""
    return ToolResult(
        tool="NasaPowerTool",
        status="success",
        inputs={"parameters": ["PRECTOTCORR", "GWETROOT"]},
        data={
            "parameters": {
                "PRECTOTCORR": {"20240710": 0.0},
                "GWETROOT": {"20240710": 0.18}
            }
        },
        source="NASA POWER (Demo Cache)",
        reference="Simulated NASA Climatology API"
    )


def build_demo_mock_payload() -> Dict[str, ToolResult]:
    """Compile standard mock dictionary for AgentOrchestrator."""
    return {
        "GeocodingTool": get_demo_geocoding_result(),
        "FortyGuardTool": get_demo_fortyguard_result(),
        "NasaPowerTool": get_demo_nasa_power_result()
    }
