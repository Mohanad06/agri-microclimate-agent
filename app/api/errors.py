"""
Phase 4.2 — Structured exception types and global exception handlers.

Design:
  - RequestValidationError (Pydantic/FastAPI 422) → structured VALIDATION_ERROR JSON
  - AgentError (raised explicitly by routes.py when orchestrator fails) → structured INTERNAL_ERROR JSON

Nothing in this module knows about agent logic, RAG, or FortyGuard.
The Phase 3 engine remains framework-independent.
"""
from __future__ import annotations

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


# ─── Custom application exception ─────────────────────────────────────────────

class AgentError(Exception):
    """Raised by API routes when AgentOrchestrator.execute_goal() raises an
    unexpected exception.  Carrying a safe, user-facing message only.
    Never carry raw exception details here.
    """
    def __init__(self, safe_message: str = "The analysis could not be completed."):
        self.safe_message = safe_message
        super().__init__(safe_message)


# ─── 422 handler — RequestValidationError ────────────────────────────────────

async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Convert FastAPI/Pydantic validation errors into the project's structured
    error schema.  Never exposes internal field paths beyond the field name.
    """
    details = []
    for err in exc.errors():
        loc = err.get("loc", ())
        # loc is a tuple like ("body", "location") — take the last meaningful part
        field_parts = [str(p) for p in loc if p != "body" and p != "query" and p != "path"]
        field = ".".join(field_parts) if field_parts else "request"
        msg = err.get("msg", "Invalid value.")
        # Pydantic v2 prefixes messages with "Value error, " — strip it
        if msg.startswith("Value error, "):
            msg = msg[len("Value error, "):]
        details.append({"field": field, "message": msg})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed.",
                "details": details,
            }
        },
    )


# ─── 500 handler — AgentError ─────────────────────────────────────────────────

async def agent_error_handler(request: Request, exc: AgentError) -> JSONResponse:
    """Return a safe, structured 500 response for unexpected orchestrator failures.
    The safe_message on AgentError is the only detail that reaches the client.
    No stack traces, no file paths, no API keys.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": exc.safe_message,
            }
        },
    )
