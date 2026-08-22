import unittest
from unittest.mock import patch, MagicMock
import requests

from fortyguard.geocoding import (
    geocode_us_location,
    GeocodingError,
    GeocodingTimeoutError,
    GeocodingNotFoundError
)

class TestGeocodingService(unittest.TestCase):
    
    @patch('requests.get')
    def test_geocode_success(self, mock_get):
        # Mock a successful API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "result": {
                "addressMatches": [
                    {
                        "matchedAddress": "Fresno, CA, 93721",
                        "coordinates": {
                            "x": -119.7871,
                            "y": 36.7378
                        }
                    }
                ]
            }
        }
        mock_get.return_value = mock_response
        
        result = geocode_us_location("Fresno, CA")
        self.assertEqual(result["input_location"], "Fresno, CA")
        self.assertEqual(result["latitude"], 36.7378)
        self.assertEqual(result["longitude"], -119.7871)
        self.assertEqual(result["matched_address"], "Fresno, CA, 93721")

    @patch('requests.get')
    def test_geocode_not_found(self, mock_get):
        # Mock empty search results
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "result": {
                "addressMatches": []
            }
        }
        mock_get.return_value = mock_response
        
        with self.assertRaises(GeocodingNotFoundError):
            geocode_us_location("Nonexistent Location, ZZ")

    @patch('requests.get')
    def test_geocode_timeout(self, mock_get):
        # Mock a request timeout
        mock_get.side_effect = requests.Timeout("Connection timed out")
        
        with self.assertRaises(GeocodingTimeoutError):
            geocode_us_location("Fresno, CA")

    @patch('requests.get')
    def test_geocode_invalid_json(self, mock_get):
        # Mock response that raises ValueError on .json()
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.side_effect = ValueError("Invalid JSON format")
        mock_get.return_value = mock_response
        
        with self.assertRaises(GeocodingError):
            geocode_us_location("Fresno, CA")

    @patch('requests.get')
    def test_geocode_missing_coordinates(self, mock_get):
        # Mock a response where coordinates are missing
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "result": {
                "addressMatches": [
                    {
                        "matchedAddress": "Malformed Address",
                        "coordinates": {}
                    }
                ]
            }
        }
        mock_get.return_value = mock_response
        
        with self.assertRaises(GeocodingError):
            geocode_us_location("Fresno, CA")

if __name__ == '__main__':
    unittest.main()
