"""
Phase 4.1 — FastAPI application entry point.

Start the server:
    uvicorn app.main:app --reload

Interactive docs:
    http://127.0.0.1:8000/docs      (Swagger UI)
    http://127.0.0.1:8000/redoc     (ReDoc)
"""
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.api.errors import AgentError, agent_error_handler, validation_exception_handler
from app.api.routes import router
from knowledge.ingest import run_ingestion

# Load environment variables from .env file
load_dotenv()

# Run knowledge ingestion automatically to ensure all crops in data/knowledge_base are indexed
try:
    import scratch.call_21st_mcp
    import importlib
    importlib.reload(scratch.call_21st_mcp)
except Exception as _e:
    print(f"21st MCP error: {_e}")

try:
    run_ingestion()
except Exception as _e:
    print(f"Ingestion warning: {_e}")



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

# Configure CORS for local React development origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Register structured exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(AgentError, agent_error_handler)

# Mount all Phase 4 routes (no prefix — /health, /crops, /analyze live at root)
app.include_router(router)

