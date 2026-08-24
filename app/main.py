"""
Phase 4.1 — FastAPI application entry point.

Start the server:
    uvicorn app.main:app --reload

Interactive docs:
    http://127.0.0.1:8000/docs      (Swagger UI)
    http://127.0.0.1:8000/redoc     (ReDoc)
"""
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from app.api.errors import AgentError, agent_error_handler, validation_exception_handler
from app.api.routes import router

app = FastAPI(
    title="Agri Microclimate Agent API",
    description=(
        "Goal-driven agricultural heat-risk decision engine. "
        "Combines FortyGuard hyperlocal environmental data, "
        "NASA POWER historical climatology, and agronomic RAG "
        "to produce grounded, citation-backed agricultural recommendations."
    ),
    version="0.4.0",
    contact={
        "name": "FortyGuard Hackathon '26",
        "url": "https://github.com/Mohanad06/agri-microclimate-agent",
    },
    license_info={"name": "MIT"},
)

# Register structured exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(AgentError, agent_error_handler)

# Mount all Phase 4 routes (no prefix — /health, /crops, /analyze live at root)
app.include_router(router)
