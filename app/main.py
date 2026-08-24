"""
Phase 4.1 — FastAPI application entry point.

Start the server:
    uvicorn app.main:app --reload

Interactive docs:
    http://127.0.0.1:8000/docs      (Swagger UI)
    http://127.0.0.1:8000/redoc     (ReDoc)
"""
from fastapi import FastAPI

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

# Mount all Phase 4.1 routes (no prefix — /health, /crops, /analyze live at root)
app.include_router(router)
