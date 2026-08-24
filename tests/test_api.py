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
