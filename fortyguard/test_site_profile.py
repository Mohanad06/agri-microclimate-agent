import unittest

from fortyguard.site_profile import (
    LocationProfile,
    FortyGuardStats,
    FortyGuardProfile,
    NasaPowerProfile,
    SiteProfile,
    SiteProfileValidationError,
    normalize_fortyguard_heatmap,
    normalize_nasa_power,
    build_site_profile
)

class TestSiteProfileService(unittest.TestCase):
    
    def test_fortyguard_normalization(self):
        # 1. Test FortyGuard TCM and Exceedance normalization
        raw_tcm = {
            "result": {
                "stats_data": {
                    "min": 15.0,
                    "max": 35.0,
                    "mean": 25.0,
                    "units": "C"
                }
            }
        }
        tcm_stats = normalize_fortyguard_heatmap(raw_tcm, "tcm")
        self.assertEqual(tcm_stats.analytic_type, "tcm")
        self.assertEqual(tcm_stats.min_value, 15.0)
        self.assertEqual(tcm_stats.mean_value, 25.0)
        self.assertEqual(tcm_stats.units, "C")
        self.assertEqual(tcm_stats.source, "FortyGuard")

        raw_exceed = {
            "result": {
                "stats_data": {
                    "min": 0.5,
                    "max": 6.0,
                    "mean": 2.4,
                    "units": "hour"
                }
            }
        }
        exceed_stats = normalize_fortyguard_heatmap(raw_exceed, "exceedance", threshold=32.0, direction="above")
        self.assertEqual(exceed_stats.analytic_type, "exceedance")
        self.assertEqual(exceed_stats.max_value, 6.0)
        self.assertEqual(exceed_stats.threshold, 32.0)
        self.assertEqual(exceed_stats.direction, "above")

    def test_nasa_power_normalization(self):
        # 2. Test NASA POWER normalization
        raw_nasa = {
            "source": "NASA_POWER",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "start_date": "20240710",
            "end_date": "20240711",
            "parameters": {
                "PRECTOTCORR": {"20240710": 0.0, "20240711": 0.5},
                "GWETROOT": {"20240710": 0.48, "20240711": 0.47},
                "RH2M": {"20240710": 18.5, "20240711": 17.2}
            }
        }
        nasa_profile = normalize_nasa_power(raw_nasa)
        self.assertEqual(nasa_profile.source, "NASA_POWER")
        self.assertEqual(nasa_profile.precipitation["20240711"], 0.5)
        self.assertEqual(nasa_profile.root_zone_wetness["20240710"], 0.48)
        self.assertEqual(nasa_profile.relative_humidity["20240711"], 17.2)

    def test_site_profile_construction_and_preservation(self):
        # 3, 4, 5. Test SiteProfile construction, coordinate preservation, and source attribution
        loc = LocationProfile(latitude=36.7378, longitude=-119.7871, matched_address="Fresno, CA")
        self.assertEqual(loc.latitude, 36.7378)
        self.assertEqual(loc.longitude, -119.7871)
        self.assertEqual(loc.matched_address, "Fresno, CA")
        
        fg_stats = FortyGuardStats(analytic_type="tcm", min_value=15.0, max_value=35.0, mean_value=25.0)
        fg_profile = FortyGuardProfile(heatmap_tcm=fg_stats)
        
        profile = SiteProfile(location=loc, fortyguard=fg_profile)
        self.assertEqual(profile.location.latitude, 36.7378)
        self.assertEqual(profile.fortyguard.heatmap_tcm.source, "FortyGuard")
        self.assertEqual(profile.data_quality_status, "PARTIAL") # Partial because NASA data is missing

    def test_nasa_missing_value_preservation(self):
        # 6. Test NASA missing values (None) preservation
        raw_nasa = {
            "source": "NASA_POWER",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "start_date": "20240710",
            "end_date": "20240711",
            "parameters": {
                "PRECTOTCORR": {"20240710": None, "20240711": 0.5},
                "GWETROOT": {"20240710": 0.48, "20240711": None},
                "RH2M": {"20240710": 18.5, "20240711": 17.2}
            }
        }
        nasa_profile = normalize_nasa_power(raw_nasa)
        self.assertIsNone(nasa_profile.precipitation["20240710"])
        self.assertIsNone(nasa_profile.root_zone_wetness["20240711"])
        
        # Test status goes to PARTIAL when null values exist in core params
        loc = LocationProfile(latitude=36.7378, longitude=-119.7871)
        profile = SiteProfile(location=loc, nasa_power=nasa_profile)
        self.assertEqual(profile.data_quality_status, "PARTIAL")

    def test_date_range_handling(self):
        # 7. Date range validation
        loc = LocationProfile(latitude=36.7378, longitude=-119.7871)
        fg_profile = FortyGuardProfile()
        
        # Valid date range
        profile = SiteProfile(location=loc, fortyguard=fg_profile, start_date="20240710", end_date="20240715")
        self.assertEqual(profile.start_date, "20240710")
        
        # Invalid date range
        with self.assertRaises(SiteProfileValidationError):
            SiteProfile(location=loc, fortyguard=fg_profile, start_date="20240715", end_date="20240710")

    def test_invalid_coordinates(self):
        # 8. Test coordinate out of bound checks
        with self.assertRaises(SiteProfileValidationError):
            LocationProfile(latitude=95.0, longitude=-119.7871)
        with self.assertRaises(SiteProfileValidationError):
            LocationProfile(latitude=36.7378, longitude=-190.0)

    def test_missing_required_structural_data(self):
        # 9. Test missing both FortyGuard and NASA profiles
        loc = LocationProfile(latitude=36.7378, longitude=-119.7871)
        with self.assertRaises(SiteProfileValidationError):
            SiteProfile(location=loc, fortyguard=None, nasa_power=None)

    def test_combined_profile_construction(self):
        # 10. Test combined FortyGuard + NASA POWER profile building
        raw_tcm = {
            "result": {
                "stats_data": {
                    "min": 15.0,
                    "max": 35.0,
                    "mean": 25.0,
                    "units": "C"
                }
            }
        }
        raw_nasa = {
            "source": "NASA_POWER",
            "latitude": 36.7378,
            "longitude": -119.7871,
            "start_date": "20240710",
            "end_date": "20240711",
            "parameters": {
                "PRECTOTCORR": {"20240710": 0.0, "20240711": 0.0},
                "GWETROOT": {"20240710": 0.48, "20240711": 0.48},
                "RH2M": {"20240710": 18.5, "20240711": 17.2}
            }
        }
        
        profile = build_site_profile(
            latitude=36.7378,
            longitude=-119.7871,
            matched_address="Fresno, CA",
            fortyguard_raw_heatmaps={"tcm": raw_tcm},
            nasa_power_normalized=raw_nasa,
            start_date="20240710",
            end_date="20240711"
        )
        
        self.assertEqual(profile.location.matched_address, "Fresno, CA")
        self.assertEqual(profile.fortyguard.heatmap_tcm.mean_value, 25.0)
        self.assertEqual(profile.nasa_power.precipitation["20240711"], 0.0)
        self.assertEqual(profile.data_quality_status, "COMPLETE") # Complete because no nulls exist and both sources are present

if __name__ == '__main__':
    unittest.main()
