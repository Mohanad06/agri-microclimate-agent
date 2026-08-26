from typing import Dict, Any, List

class Planner:
    """Plans tool sequencing based on parsed goal requirements."""
    
    def generate_plan(self, params: Dict[str, Any]) -> List[str]:
        """Sequence tools dynamically based on parameter flags."""
        plan = []
        
        # Scenario C: Pure agronomic query (if is_pure_agronomic and no explicit coordinates provided)
        if params.get("is_pure_agronomic", False) and not params.get("has_explicit_coords", False):
            plan.append("AgronomicEvidenceTool")
            return plan
            
        # 1. Geocoding (if location string is present)
        if params.get("location"):
            plan.append("GeocodingTool")
            
        # 2. Agronomic Knowledge (if crop is present)
        if params.get("crop"):
            plan.append("AgronomicEvidenceTool")
            
        # 3. Environmental Data
        if params.get("history_requested", False):
            # Historical climatology path: NASA POWER only (long-term context)
            plan.append("NasaPowerTool")
        else:
            # Standard analysis path: FortyGuard hyperlocal heat + NASA POWER precip/soil
            plan.append("FortyGuardTool")
            plan.append("NasaPowerTool")

        # 4. Point Environmental Parameters (if environmental context is explicitly requested)
        if params.get("env_requested", False):
            plan.append("FortyGuardEnvTool")
            
        return plan

