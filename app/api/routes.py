"""
Phase 4.1 — API routes.

All three endpoints in Phase 4.1:
  GET  /health   — liveness check
  GET  /crops    — supported crop list from the live knowledge base
  POST /analyze  — full agricultural analysis via AgentOrchestrator
"""
import os
from typing import List

from fastapi import APIRouter

from agent.orchestrator import AgentOrchestrator
from app.api.errors import AgentError
from app.demo_data import build_demo_mock_payload
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResponse,
    Finding,
    LocationInfo,
    Recommendation,
    RiskAssessment,
    Source,
    ToolCall,
)
from knowledge.evidence_tool import get_known_crops, get_vector_store

router = APIRouter()

# Shared orchestrator instance — created once at module load.
# AuditLogger is instantiated fresh inside each execute_goal() call,
# so this is safe for concurrent requests at hackathon scale.
_orchestrator = AgentOrchestrator()


# ─── GET /health ──────────────────────────────────────────────────────────────

@router.get("/health", tags=["system"])
def health() -> dict:
    """Liveness check — returns 200 when the API is running."""
    return {"status": "ok"}


# ─── GET /crops ───────────────────────────────────────────────────────────────

@router.get("/crops", tags=["system"])
def list_crops() -> dict:
    """Return the crops currently present in the agronomic knowledge base.

    Derived dynamically from the vector store so the list updates
    automatically whenever new documents are ingested.
    """
    store = get_vector_store()
    known = sorted(get_known_crops(store))   # e.g. {"almond", "tomato"} → sorted
    # Capitalise for consistent display ("Tomato", "Almond")
    return {"crops": [c.capitalize() for c in known]}


# ─── POST /analyze ────────────────────────────────────────────────────────────

def _build_goal_string(req: AnalysisRequest) -> str:
    """Construct a natural-language goal from structured AnalysisRequest fields.

    The GoalParser (Phase 3) expects a plain English sentence.  We assemble
    one deterministically from the structured request fields.

    If the question is explicitly a pure agronomic threshold request or already
    contains location context, we preserve its natural phrasing.
    """
    question = req.question.strip()
    
    # If the question already contains the location (e.g. "... in Phoenix ..."),
    # we don't need to append an artificial "Tomato in Phoenix" suffix.
    if req.location and req.location.lower() in question.lower():
        return question

    # For pure agronomic threshold queries, preserve the pure query:
    pure_agri_keywords = ["threshold for", "germination temperature", "safe range", "stress temperature", "what temperature", "agronomic threshold"]
    if any(k in question.lower() for k in pure_agri_keywords):
        return question

    # Otherwise assemble structured fields into a natural goal string
    parts = [question.rstrip(". ")]
    parts.append(f"{req.crop} in {req.location}")
    if req.crop_stage:
        parts.append(f"during {req.crop_stage}")
    return ". ".join(parts) + "."


def _map_response(raw: dict) -> AnalysisResponse:
    """Map the raw orchestrator dict to the typed AnalysisResponse model."""
    # Location
    loc_raw = raw.get("location", {})
    location = LocationInfo(
        latitude=loc_raw.get("latitude"),
        longitude=loc_raw.get("longitude"),
        address=loc_raw.get("address"),
    )

    # Findings
    findings = [
        Finding(
            description=f.get("description", ""),
            metric=f.get("metric", ""),
            observed=f.get("observed"),
            threshold=f.get("threshold"),
            status=f.get("status", ""),
            chunk_id=f.get("chunk_id"),
        )
        for f in raw.get("findings", [])
    ]

    # Risk assessment
    ra_raw = raw.get("risk_assessment", {})
    risk_assessment = RiskAssessment(
        level=ra_raw.get("level", "INSUFFICIENT_EVIDENCE"),
        reasoning=ra_raw.get("reasoning", ""),
    )

    # Recommendations
    recommendations = [
        Recommendation(
            text=r.get("text", ""),
            source_type=r.get("source_type", ""),
            reference_id=r.get("reference_id"),
        )
        for r in raw.get("recommendations", [])
    ]

    # Sources
    sources = [
        Source(
            type=s.get("type", ""),
            name=s.get("name", ""),
            source=s.get("source"),
            reference=s.get("reference"),
            document=s.get("document"),
            section=s.get("section"),
            chunk_id=s.get("chunk_id"),
        )
        for s in raw.get("sources", [])
    ]

    # Tool calls (exclude 'inputs' — internal goal_params, not useful externally)
    tool_calls = [
        ToolCall(
            tool=tc.get("tool", ""),
            status=tc.get("status", ""),
            source=tc.get("source"),
            reference=tc.get("reference"),
            error=tc.get("error"),
        )
        for tc in raw.get("tool_calls", [])
    ]

    return AnalysisResponse(
        goal=raw.get("goal", ""),
        status=raw.get("status", "completed"),
        location=location,
        plan=raw.get("plan", []),
        tool_calls=tool_calls,
        findings=findings,
        risk_assessment=risk_assessment,
        recommendations=recommendations,
        sources=sources,
        audit_trace=raw.get("audit_trace", ""),
    )


@router.post("/analyze", response_model=AnalysisResponse, tags=["analysis"])
def analyze(request: AnalysisRequest) -> AnalysisResponse:
    """Run a full agricultural analysis for the given location, crop, and question.

    The request fields are assembled into a natural-language goal string and
    passed directly to the Phase 3 AgentOrchestrator.  No agent logic is
    duplicated here — this endpoint is a pure adapter.

    When DEMO_MODE=true, injects deterministic ToolResult fixtures from
    app.demo_data to support offline execution without FortyGuard API credits.
    """
    goal = _build_goal_string(request)

    demo_mode = os.getenv("DEMO_MODE", "false").lower() in ("true", "1")
    mock_payload = build_demo_mock_payload() if demo_mode else None

    try:
        raw_result = _orchestrator.execute_goal(goal, mock_data=mock_payload)
    except Exception as exc:
        # Surface unexpected orchestrator errors via safe AgentError handler (HTTP 500)
        # Internal traceback/implementation details are never leaked.
        raise AgentError("The analysis could not be completed.") from exc

    return _map_response(raw_result)
