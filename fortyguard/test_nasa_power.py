import unittest
from unittest.mock import patch, MagicMock
import requests

from fortyguard.nasa_power import (
    fetch_nasa_power_daily,
    NasaPowerError,
    NasaPowerTimeoutError,
    NasaPowerValidationError
)

class TestNasaPowerService(unittest.TestCase):
    
    @patch('requests.get')
    def test_fetch_success_and_normalization(self, mock_get):
        # 1, 2, 3. Mock a successful API response and verify request parameters & normalization
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "properties": {
                "parameter": {
                    "PRECTOTCORR": {"20240710": 0.0, "20240711": 0.5},
                    "GWETROOT": {"20240710": 0.48, "20240711": 0.47},
                    "RH2M": {"20240710": 18.5, "20240711": 17.2}
                }
            }
        }
        mock_get.return_value = mock_response
        
        result = fetch_nasa_power_daily(
            latitude=36.7378,
            longitude=-119.7871,
            start_date="20240710",
            end_date="20240711"
        )
        
        # Verify request parameters
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        params = kwargs.get("params", {})
        self.assertEqual(params["community"], "AG")
        self.assertEqual(params["latitude"], 36.7378)
        self.assertEqual(params["longitude"], -119.7871)
        self.assertEqual(params["start"], "20240710")
        self.assertEqual(params["end"], "20240711")
        self.assertEqual(params["parameters"], "PRECTOTCORR,GWETROOT,RH2M")
        
        # Verify response normalization
        self.assertEqual(result["source"], "NASA_POWER")
        self.assertEqual(result["latitude"], 36.7378)
        self.assertEqual(result["longitude"], -119.7871)
        self.assertEqual(result["start_date"], "20240710")
        self.assertEqual(result["end_date"], "20240711")
        self.assertEqual(result["parameters"]["PRECTOTCORR"]["20240710"], 0.0)
        self.assertEqual(result["parameters"]["GWETROOT"]["20240711"], 0.47)

    @patch('requests.get')
    def test_fill_value_normalization(self, mock_get):
        # 4. Verify -999.0 fill value handling
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "properties": {
                "parameter": {
                    "PRECTOTCORR": {"20240710": -999.0, "20240711": 0.0},
                    "GWETROOT": {"20240710": 0.48, "20240711": -999.0},
                    "RH2M": {"20240710": -999, "20240711": 18.0}
                }
            }
        }
        mock_get.return_value = mock_response
        
        result = fetch_nasa_power_daily(
            latitude=36.7378,
            longitude=-119.7871,
            start_date="20240710",
            end_date="20240711"
        )
        self.assertIsNone(result["parameters"]["PRECTOTCORR"]["20240710"])
        self.assertEqual(result["parameters"]["PRECTOTCORR"]["20240711"], 0.0)
        self.assertIsNone(result["parameters"]["GWETROOT"]["20240711"])
        self.assertIsNone(result["parameters"]["RH2M"]["20240710"])

    def test_invalid_coordinates(self):
        # 5, 6. Verify invalid coordinates validation
        with self.assertRaises(NasaPowerValidationError):
            fetch_nasa_power_daily(latitude=95.0, longitude=-119.7871, start_date="20240710", end_date="20240711")
        with self.assertRaises(NasaPowerValidationError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-190.0, start_date="20240710", end_date="20240711")

    def test_invalid_dates_and_ranges(self):
        # 7. Verify invalid date/range validation
        with self.assertRaises(NasaPowerValidationError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-119.7871, start_date="2024-07-10", end_date="20240711")
        with self.assertRaises(NasaPowerValidationError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-119.7871, start_date="20240715", end_date="20240710")

    @patch('requests.get')
    def test_http_error(self, mock_get):
        # 8. Verify HTTP error propagation
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("Internal Server Error")
        mock_get.return_value = mock_response
        
        with self.assertRaises(NasaPowerError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-119.7871, start_date="20240710", end_date="20240711")

    @patch('requests.get')
    def test_timeout_error(self, mock_get):
        # 9. Verify Timeout propagation
        mock_get.side_effect = requests.Timeout("Connection timed out")
        
        with self.assertRaises(NasaPowerTimeoutError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-119.7871, start_date="20240710", end_date="20240711")

    @patch('requests.get')
    def test_malformed_response(self, mock_get):
        # 10. Verify malformed/unexpected response handling
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"something": "unexpected"}
        mock_get.return_value = mock_response
        
        with self.assertRaises(NasaPowerError):
            fetch_nasa_power_daily(latitude=36.7378, longitude=-119.7871, start_date="20240710", end_date="20240711")


def run_live_smoke_test():
    """Optional live smoke test helper function."""
    print("Running Live NASA POWER Smoke Test...")
    try:
        res = fetch_nasa_power_daily(
            latitude=36.7378,
            longitude=-119.7871,
            start_date="20240710",
            end_date="20240715",
            parameters=["PRECTOTCORR", "GWETROOT", "RH2M"]
        )
        print("Success! Live response sample:")
        print("Source:", res["source"])
        print("Location: lat =", res["latitude"], "lon =", res["longitude"])
        for param, values in res["parameters"].items():
            print(f"  {param}: {list(values.items())[:2]}...")
    except Exception as e:
        print("Live Smoke Test Failed:", e)

if __name__ == '__main__':
    unittest.main()
