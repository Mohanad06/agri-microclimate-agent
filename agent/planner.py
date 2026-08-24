from typing import Dict, Any, List

class Planner:
    """Plans tool sequencing based on parsed goal requirements."""
    
    def generate_plan(self, params: Dict[str, Any]) -> List[str]:
        """Sequence tools dynamically based on parameter flags."""
        plan = []
        
        # Scenario C: Pure agronomic query
        if params.get("is_pure_agronomic", False) and not params.get("location"):
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
            # Climatology and rainfall context
            plan.append("NasaPowerTool")
        else:
            # Current hyperlocal heat index/exceedance
            plan.append("FortyGuardTool")
            
        return plan
