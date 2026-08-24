"""
Phase 4.1 — API tests.

Uses FastAPI's TestClient (from httpx) to exercise the three endpoints
without starting a real server.  The existing Phase 3 mock_data injection
mechanism is NOT available through the HTTP layer, so FortyGuard/NASA POWER
calls will fail gracefully (partial status) — the test assertions focus on
response structure and field presence, not exact risk values.

Run with:
    python -m unittest tests/test_api.py
"""
import unittest

try:
    from fastapi.testclient import TestClient
    from app.main import app
    _FASTAPI_AVAILABLE = True
except ImportError:
    _FASTAPI_AVAILABLE = False


@unittest.skipUnless(_FASTAPI_AVAILABLE, "fastapi/httpx not installed — skipping API tests")
class TestAPIEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app, raise_server_exceptions=False)

    # ── Test 1: GET /health ───────────────────────────────────────────────────
    def test_health_returns_ok(self):
        """GET /health must return 200 with status='ok'."""
        resp = self.client.get("/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("status", data)
        self.assertEqual(data["status"], "ok")

    # ── Test 2: GET /crops ────────────────────────────────────────────────────
    def test_crops_returns_known_crops(self):
        """GET /crops must return a non-empty list containing known crops."""
        resp = self.client.get("/crops")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("crops", data)
        self.assertIsInstance(data["crops"], list)
        # The knowledge base contains at least Tomato and Almond
        self.assertIn("Tomato", data["crops"])
        self.assertIn("Almond", data["crops"])

    # ── Test 3: POST /analyze — valid request ─────────────────────────────────
    def test_analyze_valid_request_structure(self):
        """POST /analyze with a valid Scenario-A payload must return 200 with all required fields."""
        payload = {
            "location": "Phoenix, AZ",
            "crop": "Tomato",
            "crop_stage": "flowering",
            "question": "Assess tomato heat risk during flowering.",
        }
        resp = self.client.post("/analyze", json=payload)
        # Should be 200 (completed) or 200 (partial — when live APIs are unavailable)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        # Verify all required top-level fields are present
        required_fields = [
            "goal", "status", "location", "plan",
            "tool_calls", "findings", "risk_assessment",
            "recommendations", "sources", "audit_trace",
        ]
        for field in required_fields:
            self.assertIn(field, data, f"Missing required field: '{field}'")

        # Risk assessment must always have level and reasoning
        self.assertIn("level", data["risk_assessment"])
        self.assertIn("reasoning", data["risk_assessment"])

        # Status must be one of the known values
        self.assertIn(data["status"], {"completed", "partial"})

        # Plan must reference known tools
        known_tools = {
            "GeocodingTool", "AgronomicEvidenceTool",
            "FortyGuardTool", "NasaPowerTool",
        }
        for tool_name in data["plan"]:
            self.assertIn(tool_name, known_tools)

        # Audit trace must be a non-empty string
        self.assertIsInstance(data["audit_trace"], str)
        self.assertGreater(len(data["audit_trace"]), 0)

    # ── Test 4: POST /analyze — missing required field ────────────────────────
    def test_analyze_missing_location_returns_422(self):
        """POST /analyze without 'location' must return HTTP 422."""
        payload = {
            # 'location' deliberately omitted
            "crop": "Tomato",
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)

    def test_analyze_missing_crop_returns_422(self):
        """POST /analyze without 'crop' must return HTTP 422."""
        payload = {
            "location": "Phoenix, AZ",
            # 'crop' deliberately omitted
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)

    def test_analyze_missing_question_returns_422(self):
        """POST /analyze without 'question' must return HTTP 422."""
        payload = {
            "location": "Phoenix, AZ",
            "crop": "Tomato",
            # 'question' deliberately omitted
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)

    def test_analyze_empty_location_returns_422(self):
        """POST /analyze with an empty 'location' string must return HTTP 422 (min_length=1)."""
        payload = {
            "location": "",
            "crop": "Tomato",
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertIn("error", data)
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")

    # ── Phase 4.2: Structured Validation & Error Handling Tests ───────────────

    def test_analyze_whitespace_location_returns_structured_422(self):
        """Whitespace-only location must return HTTP 422 with VALIDATION_ERROR code."""
        payload = {
            "location": "   ",
            "crop": "Tomato",
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertIn("error", data)
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")
        self.assertIn("details", data["error"])
        fields = [d["field"] for d in data["error"]["details"]]
        self.assertIn("location", fields)

    def test_analyze_empty_crop_returns_422(self):
        """Empty or whitespace-only crop must return HTTP 422."""
        payload = {
            "location": "Phoenix, AZ",
            "crop": "   ",
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")
        fields = [d["field"] for d in data["error"]["details"]]
        self.assertIn("crop", fields)

    def test_analyze_whitespace_question_returns_422(self):
        """Whitespace-only question must return HTTP 422."""
        payload = {
            "location": "Phoenix, AZ",
            "crop": "Tomato",
            "question": "       ",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")

    def test_analyze_question_too_short_returns_422(self):
        """Question under 5 chars must return HTTP 422."""
        payload = {
            "location": "Phoenix, AZ",
            "crop": "Tomato",
            "question": "Hi",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")

    def test_analyze_excessive_length_returns_422(self):
        """Excessively long inputs must return HTTP 422."""
        payload = {
            "location": "A" * 201,  # max is 200
            "crop": "Tomato",
            "question": "Assess heat risk.",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 422)
        data = resp.json()
        self.assertEqual(data["error"]["code"], "VALIDATION_ERROR")

    def test_analyze_unexpected_exception_returns_structured_500(self):
        """An unhandled AgentOrchestrator exception must return structured 500 with no traceback leaked."""
        from unittest.mock import patch
        from app.api import routes

        with patch.object(routes._orchestrator, "execute_goal", side_effect=RuntimeError("Internal system failure")):
            payload = {
                "location": "Phoenix, AZ",
                "crop": "Tomato",
                "question": "Assess heat risk.",
            }
            resp = self.client.post("/analyze", json=payload)
            self.assertEqual(resp.status_code, 500)
            data = resp.json()
            self.assertIn("error", data)
            self.assertEqual(data["error"]["code"], "INTERNAL_ERROR")
            self.assertEqual(data["error"]["message"], "The analysis could not be completed.")
            # Verify no tracebacks, file paths, or private details leaked
            self.assertNotIn("Traceback", resp.text)
            self.assertNotIn("RuntimeError", resp.text)
            self.assertNotIn("Internal system failure", resp.text)

    def test_analyze_partial_agent_result_returns_200(self):
        """A partial result from the agent must return HTTP 200 preserving the status."""
        from unittest.mock import patch
        from app.api import routes

        mock_partial_result = {
            "goal": "Assess tomato heat risk. Tomato in Phoenix, AZ.",
            "status": "partial",
            "location": {"latitude": 33.4484, "longitude": -112.0740, "address": "Phoenix, AZ"},
            "plan": ["GeocodingTool", "AgronomicEvidenceTool", "FortyGuardTool"],
            "tool_calls": [
                {"tool": "GeocodingTool", "status": "success", "source": "Census", "reference": "Geo"},
                {"tool": "FortyGuardTool", "status": "failed", "source": "FG", "reference": "API", "error": "Timeout"},
            ],
            "findings": [],
            "risk_assessment": {"level": "INSUFFICIENT_EVIDENCE", "reasoning": "Missing metrics due to failure in: ['FortyGuardTool']"},
            "recommendations": [],
            "sources": [],
            "audit_trace": "Trace mock details",
        }

        with patch.object(routes._orchestrator, "execute_goal", return_value=mock_partial_result):
            payload = {
                "location": "Phoenix, AZ",
                "crop": "Tomato",
                "question": "Assess heat risk.",
            }
            resp = self.client.post("/analyze", json=payload)
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["status"], "partial")
            self.assertEqual(data["risk_assessment"]["level"], "INSUFFICIENT_EVIDENCE")

    # ── Test 5: Unknown crop → INSUFFICIENT_EVIDENCE ─────────────────────────
    def test_analyze_unknown_crop_returns_insufficient_evidence(self):
        """POST /analyze for an unsupported crop must return INSUFFICIENT_EVIDENCE."""
        payload = {
            "location": "Miami, FL",
            "crop": "Pineapple",
            "question": "What is the optimal temperature for pineapples?",
        }
        resp = self.client.post("/analyze", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["risk_assessment"]["level"], "INSUFFICIENT_EVIDENCE")
        # No unrelated sources should be cited
        agronomic_sources = [s for s in data["sources"] if s["type"] == "agronomic"]
        self.assertEqual(len(agronomic_sources), 0, "Unknown crop must not cite agronomic evidence.")


if __name__ == "__main__":
    unittest.main()
