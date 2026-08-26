import unittest
from agent import AgentOrchestrator, ToolResult, GoalParser, Planner, EvidenceParser

class TestAgentOrchestrator(unittest.TestCase):

    def test_goal_parser(self):
        parser = GoalParser()
        
        # Test Scenario A parser
        params_a = parser.parse("Assess tomato heat risk in Phoenix during flowering.")
        self.assertEqual(params_a["crop"], "Tomato")
        self.assertEqual(params_a["crop_stage"], "flowering")
        self.assertEqual(params_a["location"], "Phoenix")
        self.assertFalse(params_a["history_requested"])
        self.assertFalse(params_a["is_pure_agronomic"])

        # Test Scenario B parser
        params_b = parser.parse("What was the historical climate context for tomato heat risk in Phoenix last July?")
        self.assertEqual(params_b["crop"], "Tomato")
        self.assertTrue(params_b["history_requested"])
        
        # Test Scenario C parser
        params_c = parser.parse("Find the agronomic heat threshold for tomatoes during flowering.")
        self.assertEqual(params_c["crop"], "Tomato")
        self.assertEqual(params_c["crop_stage"], "flowering")
        self.assertTrue(params_c["is_pure_agronomic"])
        
        # Test Scenario D parser
        params_d = parser.parse("What is the optimal temperature for growing pineapples?")
        self.assertEqual(params_d["crop"], None)

    def test_planner_sequencing(self):
        planner = Planner()
        
        # Scenario A planning
        plan_a = planner.generate_plan({
            "crop": "Tomato", "crop_stage": "flowering", "location": "Phoenix, AZ",
            "history_requested": False, "is_pure_agronomic": False
        })
        self.assertEqual(plan_a, ["GeocodingTool", "AgronomicEvidenceTool", "FortyGuardTool"])
        
        # Scenario B planning
        plan_b = planner.generate_plan({
            "crop": "Tomato", "crop_stage": "flowering", "location": "Phoenix, AZ",
            "history_requested": True, "is_pure_agronomic": False
        })
        self.assertEqual(plan_b, ["GeocodingTool", "AgronomicEvidenceTool", "NasaPowerTool"])

        # Scenario C planning
        plan_c = planner.generate_plan({
            "crop": "Tomato", "crop_stage": "flowering", "location": None,
            "history_requested": False, "is_pure_agronomic": True
        })
        self.assertEqual(plan_c, ["AgronomicEvidenceTool"])

    def test_rag_threshold_extraction(self):
        parser = EvidenceParser()
        evidence = [
            {
                "evidence_text": "Temperatures consistently exceeding 32°C during flowering lead to blossom drop.",
                "crop": "Tomato", "crop_stage": "flowering", "chunk_id": "c1", "document": "doc1.md", "source": "UC Davis"
            }
        ]
        thresholds = parser.parse_thresholds(evidence)
        self.assertEqual(len(thresholds), 1)
        self.assertEqual(thresholds[0]["metric"], "temperature")
        self.assertEqual(thresholds[0]["value"], 32.0)
        self.assertEqual(thresholds[0]["operator"], "gt")

    def test_partial_tool_failure(self):
        orchestrator = AgentOrchestrator()
        
        # Mock geocoding success but FortyGuard failure
        mock_data = {
            "GeocodingTool": ToolResult(
                tool="GeocodingTool", status="success", inputs={}, 
                data={"latitude": 33.44, "longitude": -112.07, "matched_address": "Phoenix, AZ"},
                source="Geocoder", reference="Test"
            ),
            "AgronomicEvidenceTool": ToolResult(
                tool="AgronomicEvidenceTool", status="success", inputs={},
                data={"evidence": [
                    {
                        "evidence_text": "Temperatures consistently exceeding 32°C during flowering lead to blossom drop.",
                        "crop": "Tomato", "crop_stage": "flowering", "chunk_id": "tomato_chunk_01",
                        "document": "ucdavis_tomato_growing.md", "source": "UC Davis", "page_or_section": "Flowering"
                    }
                ]},
                source="RAG", reference="Test"
            ),
            "FortyGuardTool": ToolResult(
                tool="FortyGuardTool", status="failed", inputs={}, data={},
                source="FortyGuard", reference="Test", error="API Timeout Error"
            )
        }
        
        res = orchestrator.execute_goal("Assess tomato heat risk in Phoenix during flowering.", mock_data=mock_data)
        
        # Verify orchestrator marks as partial and reports failure cleanly
        self.assertEqual(res["status"], "partial")
        self.assertEqual(res["tool_calls"][2]["status"], "failed")
        self.assertIn("API Timeout Error", res["tool_calls"][2]["error"])
        # Should still output geocoding coordinates and RAG references
        self.assertEqual(res["location"]["latitude"], 33.44)
        self.assertEqual(len(res["sources"]), 2) # Geocoder + RAG

    def test_e2e_almond_mild_stress_grounding(self):
        orchestrator = AgentOrchestrator()
        
        # Mock geocoding, RAG, and NASA POWER outcomes
        mock_data = {
            "GeocodingTool": ToolResult(
                tool="GeocodingTool", status="success", inputs={},
                data={"latitude": 36.73, "longitude": -119.78, "matched_address": "Fresno, CA"},
                source="Geocoder", reference="Test"
            ),
            "AgronomicEvidenceTool": ToolResult(
                tool="AgronomicEvidenceTool", status="success", inputs={},
                data={"evidence": [
                    {
                        "evidence_text": "Deficit strategy: Irrigation is managed to maintain stem water potential (SWP) between -1.4 and -1.8 MPa. GWETROOT below 0.20 indicates critically dry conditions during RDI.",
                        "crop": "Almond", "crop_stage": "irrigation", "chunk_id": "almond_chunk_02",
                        "document": "ucdavis_almond_irrigation.md", "source": "UC Davis", "page_or_section": "Deficit"
                    }
                ]},
                source="RAG", reference="Test"
            ),
            "NasaPowerTool": ToolResult(
                tool="NasaPowerTool", status="success", inputs={},
                data={"parameters": {
                    "PRECTOTCORR": {"20240710": 0.0},
                    "GWETROOT": {"20240710": 0.18} # Low soil moisture
                }},
                source="NASA POWER", reference="Test"
            )
        }
        
        res = orchestrator.execute_goal("What was the historical climate context for almond water deficit in Fresno last July?", mock_data=mock_data)
        self.assertEqual(res["status"], "completed")
        self.assertEqual(len(res["findings"]), 1)
        # Should report low soil moisture violation against the 0.20 RAG deficit boundary
        self.assertEqual(res["findings"][0]["status"], "violated")
        self.assertEqual(res["risk_assessment"]["level"], "HIGH")
        self.assertEqual(res["recommendations"][0]["reference_id"], "almond_chunk_02")

    def test_negative_unknown_crop(self):
        orchestrator = AgentOrchestrator()
        res = orchestrator.execute_goal("What is the optimal temperature for growing pineapples?")
        
        # Ensure no fabricated data or thresholds are returned
        self.assertEqual(res["status"], "completed")
        self.assertEqual(res["risk_assessment"]["level"], "INSUFFICIENT_EVIDENCE")
        self.assertEqual(len(res["findings"]), 0)
        self.assertEqual(len(res["recommendations"]), 0)

    # ── Regression test B: known crop, evidence list is empty ─────────────────
    def test_negative_known_crop_no_evidence(self):
        from agent.decision import DecisionLayer
        dl = DecisionLayer()
        result = dl.evaluate(evidence=[], observed_data={"max_temperature": 35.0})
        self.assertEqual(result["risk_assessment"]["level"], "INSUFFICIENT_EVIDENCE")
        self.assertEqual(len(result["findings"]), 0)

    # ── Regression test C: evidence present but no parseable numeric threshold ─
    def test_negative_prose_only_evidence(self):
        from agent.decision import DecisionLayer
        dl = DecisionLayer()
        evidence = [{
            "evidence_text": "Tomatoes should be grown in warm climates with good drainage and sunlight.",
            "crop": "Tomato", "crop_stage": "general", "chunk_id": "tomato_prose_01",
            "document": "generic_guide.md", "source": "Generic Guide", "page_or_section": "Intro"
        }]
        result = dl.evaluate(evidence=evidence, observed_data={"max_temperature": 35.0})
        # No numeric threshold found → INSUFFICIENT_EVIDENCE
        self.assertEqual(result["risk_assessment"]["level"], "INSUFFICIENT_EVIDENCE")

    # ── Regression test D: known crop + threshold + observation → valid verdict ─
    def test_positive_valid_threshold_and_observation(self):
        from agent.decision import DecisionLayer
        dl = DecisionLayer()
        evidence = [{
            "evidence_text": "Temperatures consistently exceeding 32°C during flowering lead to blossom drop.",
            "crop": "Tomato", "crop_stage": "flowering", "chunk_id": "tomato_chunk_02",
            "document": "ucdavis_tomato_growing.md", "source": "UC ANR", "page_or_section": "Flowering"
        }]
        # Observed 34°C — above the 32°C threshold
        result = dl.evaluate(evidence=evidence, observed_data={"max_temperature": 34.0})
        self.assertEqual(result["risk_assessment"]["level"], "HIGH")
        self.assertEqual(len(result["findings"]), 1)
        self.assertEqual(result["findings"][0]["status"], "violated")
        # Observed 28°C — below the 32°C threshold
        result_safe = dl.evaluate(evidence=evidence, observed_data={"max_temperature": 28.0})
        self.assertEqual(result_safe["risk_assessment"]["level"], "LOW")
        self.assertEqual(result_safe["findings"][0]["status"], "safe")

    # ── FortyGuardEnvTool Specific Unit Tests ─────────────────────────────────
    def test_fortyguard_env_tool_structure_and_no_key_failure(self):
        from agent.tool_registry import FortyGuardEnvTool
        tool = FortyGuardEnvTool()
        self.assertEqual(tool.name, "FortyGuardEnvTool")
        self.assertIn("environmental parameters", tool.description.lower())
        
        # Test failure when FORTYGUARD_API_KEY is unset/mocked empty
        import os
        orig_key = os.environ.pop("FORTYGUARD_API_KEY", None)
        try:
            res = tool.execute(latitude=33.44, longitude=-112.07, start_date="2024-07-01")
            self.assertEqual(res.status, "failed")
            self.assertEqual(res.tool, "FortyGuardEnvTool")
            self.assertIn("FORTYGUARD_API_KEY environment variable is not configured", res.error)
            self.assertEqual(res.source, "FortyGuard API")
            # Verify secret key is NOT present anywhere in res
            self.assertNotIn("secret", str(res).lower())
        finally:
            if orig_key:
                os.environ["FORTYGUARD_API_KEY"] = orig_key

    def test_environmental_context_planning(self):
        planner = Planner()
        # Environmental parameter goal
        plan_env = planner.generate_plan({
            "crop": "Tomato", "crop_stage": "flowering", "location": "Phoenix, AZ",
            "history_requested": False, "env_requested": True, "is_pure_agronomic": False
        })
        self.assertEqual(plan_env, ["GeocodingTool", "AgronomicEvidenceTool", "FortyGuardTool", "FortyGuardEnvTool"])

    def test_e2e_demo_mode_with_env_params(self):
        from app.demo_data import build_demo_mock_payload
        orchestrator = AgentOrchestrator()
        mock_payload = build_demo_mock_payload()
        
        goal = "Assess humidity, heat index, and solar irradiance for tomato heat risk in Phoenix during flowering."
        res = orchestrator.execute_goal(goal, mock_data=mock_payload)
        
        self.assertEqual(res["status"], "completed")
        self.assertIn("FortyGuardEnvTool", res["plan"])
        # Verify ToolResult demo cache source tag
        env_tool_call = [tc for tc in res["tool_calls"] if tc["tool"] == "FortyGuardEnvTool"][0]
        self.assertEqual(env_tool_call["status"], "success")
        self.assertEqual(env_tool_call["source"], "FortyGuard (Demo Cache)")

if __name__ == "__main__":
    unittest.main()

