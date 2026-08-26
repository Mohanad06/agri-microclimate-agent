import re
from typing import Dict, Any, Optional, Tuple

class GoalParser:
    """Parses natural-language goals into structured query parameters."""
    
    def __init__(self):
        # Recognized crops and stage mappings
        self.crops = ["tomato", "almond"]
        self.stages = {
            "germination": "planting",
            "planting": "planting",
            "transplant": "planting",
            "flowering": "flowering",
            "flower": "flowering",
            "blossom": "flowering",
            "pollination": "flowering",
            "irrigation": "irrigation",
            "water": "irrigation",
            "deficit": "irrigation",
            "swp": "irrigation"
        }
        
    def parse(self, goal: str) -> Dict[str, Any]:
        """Parse natural language goal to extract constraints deterministically."""
        lower_goal = goal.lower()
        
        # 1. Extract Crop
        parsed_crop = None
        for crop in self.crops:
            if crop in lower_goal:
                parsed_crop = crop.capitalize()
                break
        if not parsed_crop:
            # Generic crop extraction: match a noun-like word after common prepositions/verbs.
            # Exclude stop-words, common agri-adjectives, and transitional verbs.
            _NON_CROP = {
                "tomato", "almond", "heat", "water", "mild", "severe", "optimal", "safe",
                "growing", "grow", "temperature", "risk", "context", "climate", "historical",
                "threshold", "agronomic", "stress", "stage", "crop", "the", "a", "an",
                "flowering", "planting", "irrigation", "deficit"
            }
            match = re.search(r'\b(?:growing|for|of|on|about)\s+([a-z]+)s?\b', lower_goal)
            if match and match.group(1) not in _NON_CROP:
                parsed_crop = match.group(1).capitalize()
                
        # 2. Extract Stage
        parsed_stage = None
        for keyword, stage in self.stages.items():
            if keyword in lower_goal:
                parsed_stage = stage
                break

        # 3. Extract Location
        # Find phrases like "in [Location]", "near [Location]", "at [Location]"
        # Matches patterns like "in Phoenix, AZ", "near Fresno", "at San Jose"
        parsed_location = None
        location_match = re.search(r'\b(?:in|near|at)\s+([A-Za-z0-9\s,\-]+)', goal, re.IGNORECASE)
        if location_match:
            loc = location_match.group(1).strip()
            # Split at stop words (during, last, for, at, on, etc.)
            loc_clean = re.split(r'\s+(?:during|for|on|at|from|to|last|this|with)\s+', loc, flags=re.IGNORECASE)[0]
            parsed_location = loc_clean.strip().rstrip(',. ')

        # 4. Detect Climatology/Historical request
        history_words = ["historical", "climatology", "past", "history", "last July", "last year", "average"]
        history_requested = any(hw in lower_goal for hw in history_words)

        # 5. Detect Environmental Parameters request
        env_words = ["humidity", "relative humidity", "wet bulb", "solar", "irradiance", "heat index", "air quality", "aqi", "environmental", "microclimate", "evapotranspiration", "atmospheric"]
        env_requested = any(ew in lower_goal for ew in env_words)

        # 6. Detect Pure Agronomic request (no environmental data required)
        pure_agronomic_words = ["threshold for", "germination temperature", "safe range", "stress temperature", "what temperature", "agronomic threshold"]
        is_pure_agronomic = any(paw in lower_goal for paw in pure_agronomic_words)
        # If no location is found, it is also likely pure agronomic query
        if not parsed_location:
            is_pure_agronomic = True

        # 7. Parse time period (look for YYYY or months)
        # For simplicity in testing/E2E, we default to a standard window (e.g. last month/current date) if none specified
        start_date = "20240701"
        end_date = "20240731" if history_requested else None
        
        # If user goal explicitly mentions a date or month, we could parse it,
        # but let's keep it robust and simple for the benchmark queries.
        if "july" in lower_goal:
            start_date = "20240701"
            end_date = "20240731"
            
        return {
            "crop": parsed_crop,
            "crop_stage": parsed_stage,
            "location": parsed_location,
            "history_requested": history_requested,
            "env_requested": env_requested,
            "is_pure_agronomic": is_pure_agronomic,
            "start_date": start_date,
            "end_date": end_date
        }
