import requests
from typing import Dict, Any, Tuple, Optional

class GeocodingError(Exception):
    """Base exception for geocoding errors."""
    pass

class GeocodingTimeoutError(GeocodingError):
    """Raised when the geocoding API request times out."""
    pass

class GeocodingNotFoundError(GeocodingError):
    """Raised when the location is not found."""
    pass

def geocode_us_location(location: str, timeout: float = 15.0) -> Dict[str, Any]:
    """Query the US Census Geocoder to resolve a location string to coordinates.
    
    Args:
        location: A human-readable US address or city string (e.g. "Fresno, CA").
        timeout: Maximum duration in seconds to wait for the API response.
        
    Returns:
        A dictionary containing:
            - "input_location": str (original input)
            - "latitude": float
            - "longitude": float
            - "matched_address": str (normalized address from Census API)
            
    Raises:
        GeocodingNotFoundError: If no address match is found.
        GeocodingTimeoutError: If the API request times out.
        GeocodingError: For other HTTP or parsing errors.
    """
    if not location or not location.strip():
        raise GeocodingError("Location query cannot be empty.")

    url = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress"
    params = {
        "address": location,
        "benchmark": "Public_AR_Current",
        "format": "json"
    }
    
    try:
        response = requests.get(url, params=params, timeout=timeout)
        response.raise_for_status()
    except requests.Timeout as e:
        raise GeocodingTimeoutError(f"Geocoding request timed out after {timeout} seconds: {e}")
    except requests.RequestException as e:
        raise GeocodingError(f"Failed to communicate with Geocoding API: {e}")

    try:
        data = response.json()
    except ValueError as e:
        raise GeocodingError(f"Malformed API response (invalid JSON): {e}")

    result = data.get("result", {})
    address_matches = result.get("addressMatches", [])
    
    if not address_matches:
        raise GeocodingNotFoundError(f"No coordinates found for location: '{location}'")
        
    first_match = address_matches[0]
    coordinates = first_match.get("coordinates", {})
    
    # x corresponds to longitude, y corresponds to latitude
    lon = coordinates.get("x")
    lat = coordinates.get("y")
    matched_address = first_match.get("matchedAddress", "")
    
    if lat is None or lon is None:
        raise GeocodingError("API response coordinates are missing or incomplete.")
        
    try:
        return {
            "input_location": location,
            "latitude": float(lat),
            "longitude": float(lon),
            "matched_address": matched_address
        }
    except (ValueError, TypeError) as e:
        raise GeocodingError(f"Failed to parse coordinates as floats: {e}")
