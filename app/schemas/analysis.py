"""
Phase 4.1 — Pydantic request and response schemas.

These schemas are derived EXACTLY from the AgentOrchestrator.execute_goal()
return dict.  No fields have been invented; all field names and types are
verified against orchestrator.py and trace.py.

AnalysisRequest mirrors the information needed to construct a natural-language
goal for the existing GoalParser.  The API layer combines these fields into a
goal string and passes it directly to AgentOrchestrator — no second planner
is introduced.

AnalysisResponse wraps the exact dict returned by execute_goal() in a typed
model, preserving all nested structures.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


# ─── Request ─────────────────────────────────────────────────────────────────

class AnalysisRequest(BaseModel):
    """Input schema for POST /analyze.

    Fields mirror the information the GoalParser extracts from a NL goal.
    Providing them as structured fields lets the frontend send clean data
    instead of constructing a sentence; the API layer merges them into a
    goal string before calling the orchestrator.
    """

    location: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Farm or field location (city, address, or lat/lon description).",
        examples=["Phoenix, AZ", "Fresno, CA"],
    )
    crop: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Target crop name (must match a supported crop in the knowledge base).",
        examples=["Tomato", "Almond"],
    )
    crop_stage: Optional[str] = Field(
        default=None,
        max_length=50,
        description="Growth stage of the crop (e.g. 'flowering', 'planting', 'irrigation').",
        examples=["flowering", "planting"],
    )
    question: str = Field(
        ...,
        min_length=5,
        max_length=500,
        description="Natural-language agricultural question or goal.",
        examples=["Is it safe to plant tomatoes now?", "Assess heat risk during flowering."],
    )

    @field_validator("location", "crop", "question", mode="after")
    @classmethod
    def validate_non_whitespace(cls, v: str, info) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError(f"{info.field_name.capitalize()} must not be empty or whitespace only.")
        return trimmed

    @field_validator("crop_stage", mode="after")
    @classmethod
    def validate_crop_stage(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Crop stage must not be empty or whitespace only if provided.")
            return trimmed
        return v


# ─── Error Schemas ───────────────────────────────────────────────────────────

class ErrorDetail(BaseModel):
    """Field-level error detail."""
    field: str
    message: str


class ErrorContent(BaseModel):
    """Top-level structured error envelope content."""
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class ErrorResponse(BaseModel):
    """Standard error response format for all API errors."""
    error: ErrorContent


# ─── Response sub-models ─────────────────────────────────────────────────────

class LocationInfo(BaseModel):
    """Resolved geographic location from the GeocodingTool."""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None


class Finding(BaseModel):
    """A single metric comparison result from the DecisionLayer."""
    description: str
    metric: str
    observed: Optional[Any] = None
    threshold: Optional[Any] = None
    status: str  # "violated" | "safe"
    chunk_id: Optional[str] = None


class RiskAssessment(BaseModel):
    """Overall risk verdict from the DecisionLayer."""
    level: str  # "LOW" | "HIGH" | "INSUFFICIENT_EVIDENCE"
    reasoning: str


class Recommendation(BaseModel):
    """A source-bound recommendation derived from agronomic evidence."""
    text: str
    source_type: str  # "derived_conclusion" | "agronomic_evidence"
    reference_id: Optional[str] = None


class Source(BaseModel):
    """A cited data or knowledge source."""
    type: str  # "environmental" | "agronomic"
    name: str
    # Environmental tool fields
    source: Optional[str] = None
    reference: Optional[str] = None
    # Agronomic evidence fields
    document: Optional[str] = None
    section: Optional[str] = None
    chunk_id: Optional[str] = None


class ToolCall(BaseModel):
    """A single tool invocation log entry from the orchestrator."""
    tool: str
    status: str  # "success" | "failed"
    source: Optional[str] = None
    reference: Optional[str] = None
    error: Optional[str] = None


# ─── Response ─────────────────────────────────────────────────────────────────

class AnalysisResponse(BaseModel):
    """Output schema for POST /analyze.

    Every field maps 1-to-1 to a key in the dict returned by
    AgentOrchestrator.execute_goal().  The 'inputs' field of each tool_call
    is intentionally excluded — it contains internal goal_params dicts that
    are not useful to an API consumer.
    """

    goal: str = Field(description="The natural-language goal that was processed.")
    status: str = Field(description="'completed' or 'partial' (when one or more tools failed).")
    location: LocationInfo
    plan: List[str] = Field(description="Ordered list of tool names executed.")
    tool_calls: List[ToolCall] = Field(description="Per-tool invocation log.")
    findings: List[Finding] = Field(description="Individual metric findings from the decision layer.")
    risk_assessment: RiskAssessment
    recommendations: List[Recommendation]
    sources: List[Source] = Field(description="All cited data and knowledge sources.")
    audit_trace: str = Field(description="Human-readable safe execution trace.")
