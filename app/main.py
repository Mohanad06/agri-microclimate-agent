"""
Phase 4.1 — FastAPI application entry point.

Start the server:
    uvicorn app.main:app --reload

Interactive docs:
    http://127.0.0.1:8000/docs      (Swagger UI)
    http://127.0.0.1:8000/redoc     (ReDoc)
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

from app.api.errors import AgentError, agent_error_handler, validation_exception_handler
from app.api.routes import router
from knowledge.ingest import run_ingestion

# Load environment variables from .env file
load_dotenv()

# Run knowledge ingestion automatically to ensure all crops in data/knowledge_base are indexed
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register structured exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(AgentError, agent_error_handler)

# Mount all Phase 4 API routes (/health, /crops, /analyze)
app.include_router(router)

# Mount Frontend Static SPA if dist directory exists, otherwise handle root gracefully
dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
assets_dir = os.path.join(dist_dir, "assets")

if os.path.exists(dist_dir):
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(dist_dir, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path in ["health", "crops", "docs", "openapi.json", "redoc"]:
            return None
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/")
    def root():
        return RedirectResponse(url="/docs")


