# Agri Microclimate Agent — FortyGuard Hackathon '26 Finalist Project

[![FortyGuard Hackathon '26](https://img.shields.io/badge/FortyGuard%20Hackathon-'26%20Finalist-2E9F45?style=for-the-badge&logo=sprout)](https://api.fortyguard.com)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-176B35?style=for-the-badge&logo=python)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React + Vite](https://img.shields.io/badge/React-18.2--Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-45%2F45%20Passing-2E9F45?style=for-the-badge)](tests/)

**Agri Microclimate Agent** is an autonomous agricultural microclimate decision engine designed for farmers, agronomists, and irrigation managers. It combines parcel-scale thermal surface grids from **FortyGuard**, satellite reanalysis climatology from **NASA POWER**, and grounded agronomic research extension guides from **UC Davis, TAMU, and USDA** to generate explainable, citation-backed heat risk assessments and multi-step field action plans.

---

## 🌟 Key Platform Features

### 1. Multi-Source Environmental Data Fusion
- **FortyGuard Thermal API**: Parcel-scale (60m–100m tile resolution) thermal surface heatmaps, measuring daily mean, peak exceedances, and thermal persistence statistics over 30-mile urban & agricultural areas.
- **NASA POWER Satellite Climatology**: Daily precipitation (`PRECTOTCORR`), root-zone soil wetness index (`GWETROOT`), and relative humidity (`RH2M`) for deep moisture and drought context.
- **US Census Geocoder**: Lightweight, high-reliability geocoding service converting city/address locations into exact field latitude/longitude coordinates.

### 2. Grounded Vector RAG & Crop Knowledge Store
- **5 Major US Crop Knowledge Bases**: Indexed extension research for **Tomato**, **Almond**, **Corn**, **Grape**, and **Cotton**.
- **Crop Scope Guard**: Hardened RAG retrieval layer ensuring no cross-crop citation leakage occurs (e.g., almond stress thresholds will never be cited for tomato assessments).
- **Extension Citation Traceability**: Every recommendation and threshold boundary links directly back to a verified publication chunk ID.

### 3. Autonomous Agentic Orchestration Architecture
- **Natural Language Goal Parser**: Deterministically parses crop, growth stage, location name, coordinates, and historical context flags.
- **Dynamic Planner**: Sequences only the required tools per query (`GeocodingTool`, `AgronomicEvidenceTool`, `FortyGuardTool`, `NasaPowerTool`) rather than running a rigid pipeline.
- **Evidence Sufficiency Gate**: Compares live environmental observations against parsed agronomic thresholds. If runtime data is missing or incompatible, the agent outputs `INSUFFICIENT_EVIDENCE` instead of hallucinating speculative risk levels.
- **Full Audit Logger**: Records every tool step, payload, and API status in a safe, non-leaking user-facing execution trace.

---

## 🎨 Commercial Web Dashboard (Phase 5 Visual Identity & Custom Artwork)

The frontend features a commercial-grade agricultural SaaS user interface reverse-engineered from premium AgriTech design principles:

- **Organic Green Brushstroke Artwork**: Custom vertical green paint brush background artwork (`RealWhiteBrushBackground.jsx`) creating a distinct, high-end organic brand aesthetic.
- **Glassmorphic Navigation Bar**: High-contrast dark emerald glass topbar (`rgba(8, 28, 22, 0.86)`) with `backdrop-filter: blur(20px)`, emerald glow borders, and crystal-clear white active tab styling (`#FFFFFF`).
- **High-Resolution Crop Photography**: Real agricultural field photography for **Tomato**, **Almond**, **Corn**, **Grape**, and **Cotton** knowledge base cards.
- **Fresh Agricultural Design Tokens**: Primary Emerald Green (`#10B981`), Deep Forest Green (`#047857`), Fresh Mint (`#34D399`), and Deep Organic Background (`#0E3529`).
- **Typography Pairings**: Google Font `Inter` for primary UI hierarchy and `JetBrains Mono` for tabular numerical metrics, coordinates, and units.
- **Card Depth & Motion Language**: Elevated glass cards with soft ambient green shadows, hover lift (`translateY(-4px)`), and 3D card flip transitions.
- **BrandIntro Splash Screen**: Translucent backdrop blur (`backdrop-filter: blur(20px)`), blur-to-sharp logo reveal, and `sessionStorage` single-play memory (`agri_intro_played`) so the splash executes once per browser session.
- **21st.dev Metric Cards**: Integrated `MetricCard21st` components for environmental observation displays.
- **Interactive Leaflet Map Pin Selector**: Drag-and-drop map pin selector allowing growers to click directly on field locations.
- **4-Step Decision Console (`/analyze`)**: Structured form workflow (`STEP 01` Field Location -> `STEP 02` Crop & Stage -> `STEP 03` Goal -> `STEP 04` Execute).
- **4-Tab Decision Report (`/results`)**: Organized decision dashboard (`OVERVIEW`, `EVIDENCE`, `ACTIONS`, `AGENT TRACE`) with risk verdict banners and actionable mitigation steps.

---

## 🔒 FortyGuard Data Compliance & API Governance

This project adheres strictly to **FortyGuard Intellectual Property & Data Licensing Guidelines**:

1. **Live On-Demand API Integration**:
   The application communicates with the FortyGuard tOS Enterprise API (`https://api.fortyguard.com`) dynamically at runtime. All thermal surface heatmaps, statistics, and parcel metrics are fetched live upon user query execution.

2. **Zero Raw Dataset Redistribution**:
   In compliance with FortyGuard IP rules, **no raw downloaded FortyGuard heatmap tiles, raster datasets, or proprietary spatial files are committed or redistributed in this repository**. All raw spatial data is kept out of version control via `.gitignore`.

3. **Secure API Key Management**:
   API keys (`FORTYGUARD_API_KEY`) are managed strictly server-side via environment variables (`.env`) and are never exposed in repository commits or client-side JavaScript assets.

4. **Example FortyGuard API Data Contract**:
   Below is a sample request payload and redacted response shape illustrating the client integration:

```json
// POST /v1/thermal/analysis
// Header: api-key: fg_live_xxxxxxxxxxxxxxxx
{
  "latitude": 37.3352,
  "longitude": -121.8811,
  "radius_km": 1.5,
  "metrics": ["mean_temp", "peak_exceedance", "persistence_index"]
}

// Response (Redacted/Sample Payload for Documentation)
{
  "status": "completed",
  "activity_id": "act_sample_789412",
  "result": {
    "parcel_id": "diridon_zone_01",
    "mean_surface_temp_c": 38.4,
    "peak_heat_duration_hours": 6.5,
    "thermal_persistence_score": 0.82,
    "spatial_resolution_m": 60
  }
}
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Python 3.10+** (for FastAPI backend & Python SDK)
- **Node.js 18+ & npm** (for React + Vite frontend dashboard)
- A valid **FortyGuard API Key**

---

### 1. Clone & Environment Setup

```bash
git clone https://github.com/Mohanad06/agri-microclimate-agent.git
cd agri-microclimate-agent

# Create & activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Paste your FortyGuard API credentials into `.env`:

```env
FORTYGUARD_API_KEY=fg_live_xxxxxxxxxxxxxxxx
FORTYGUARD_BASE_URL=https://api.fortyguard.com
```

---

### 3. Run the Backend API Server (FastAPI)

In your main terminal window:

```bash
python -m uvicorn app.main:app --reload
```

- **Backend REST API**: `http://127.0.0.1:8000`
- **Swagger Interactive API Docs**: `http://127.0.0.1:8000/docs`
- **API Health Check**: `http://127.0.0.1:8000/health`

---

### 4. Run the Web Dashboard Frontend (React + Vite)

Open a **second terminal window** and navigate to `frontend/`:

```bash
cd agri-microclimate-agent/frontend

# Install npm dependencies (first time setup)
npm install

# Launch Vite development server
npm run dev
```

- **Web Dashboard Application**: **`http://localhost:5173`**

---

## 🧪 Testing & Verification

The project maintains a full automated unit and integration test suite covering site profiles, geocoding, NASA POWER reanalysis, vector RAG retrieval, crop scope guards, and agent decision orchestration.

To run the complete test suite:

```bash
python -m unittest discover -s tests
```

### Test Suite Results

```text
======================================================================
Ran 45 tests in 2.14s

OK (45/45 passing, 0 failures, 0 errors)
```

| Test Module | Tests | Status |
|---|---|---|
| FortyGuard & Site Profile (`fortyguard/test_site_profile.py`) | 8 | ✅ ALL PASS |
| Geocoding Unit Tests (`fortyguard/test_geocoding.py`) | 5 | ✅ ALL PASS |
| NASA POWER Unit Tests (`fortyguard/test_nasa_power.py`) | 7 | ✅ ALL PASS |
| RAG Vector Store Tests (`tests/test_rag.py`) | 7 | ✅ ALL PASS |
| Agent Orchestration Tests (`tests/test_agent.py`) | 18 | ✅ ALL PASS |
| **Total Test Suite** | **45** | **✅ 45 PASSING** |

---

## 📂 Project Architecture & Repository Layout

```text
agri-microclimate-agent/
│
├── agent/                        # Autonomous Agentic Orchestration Layer
│   ├── decision.py               # EvidenceParser + DecisionLayer (sufficiency gate)
│   ├── goal_parser.py            # Natural language goal parser
│   ├── orchestrator.py           # AgentOrchestrator (central execution loop)
│   ├── planner.py                # Dynamic tool sequencer
│   ├── tool_registry.py          # ToolResult, BaseTool, concrete wrappers, registry
│   └── trace.py                  # AuditLogger (safe user-facing execution trace)
│
├── app/                          # FastAPI Backend Application Server
│   ├── main.py                   # FastAPI REST endpoints (/health, /crops, /analyze)
│   └── schemas.py                # Pydantic request/response payload schemas
│
├── data/
│   ├── knowledge_base/           # Extension research markdown documents
│   └── knowledge_store.json      # TF-IDF vector index
│
├── docs/                         # Architecture & Specification Documents
│   ├── BACKEND_DESIGN.md
│   ├── FRONTEND_DESIGN.md
│   ├── GOALS.md
│   ├── PROJECT_STATE.md
│   └── UI_UX_ARCHITECTURE.md
│
├── fortyguard/                   # FortyGuard Client & Meteorological Services
│   ├── client.py                 # FortyGuardClient API wrapper
│   ├── geocoding.py              # US Census Geocoder wrapper
│   ├── nasa_power.py             # NASA POWER satellite reanalysis service
│   └── site_profile.py           # Data normalization & SiteProfile builders
│
├── frontend/                     # Commercial React + Vite Web Dashboard
│   ├── src/
│   │   ├── api/agentApi.js       # Axios API client
│   │   ├── components/
│   │   │   ├── common/           # Header, BrandIntro, StatusPill, LoadingSpinner
│   │   │   ├── form/             # AnalysisForm, CropSelect, MapPinSelector
│   │   │   ├── map/              # InteractiveMap (Leaflet)
│   │   │   ├── results/          # RiskBanner, FindingsGrid, MetricCard21st, RecommendationsList, SourcesList
│   │   │   └── trace/            # AgentActivityTrace, AuditTraceModal
│   │   ├── hooks/useAgent.js     # Central state & backend integration hook
│   │   ├── pages/                # DashboardPage, AnalyzePage, ResultsPage, AgentIntelligencePage
│   │   ├── App.css               # Commercial AgriTech component stylesheet
│   │   ├── App.jsx               # Client-side router & App shell
│   │   └── index.css             # Light-first agricultural design system tokens
│   └── package.json
│
├── knowledge/                    # Vector RAG Engine
│   ├── evidence_tool.py          # Crop Scope Guard + evidence retrieval contract
│   ├── ingest.py                 # Markdown document parser & chunker
│   └── vector_store.py           # Vector database implementation
│
├── notebooks/                    # Jupyter Walkthrough & Use-Case Notebooks
│
├── tests/                        # Automated Unit & Integration Test Suite
│   ├── test_agent.py
│   └── test_rag.py
│
├── .env.example
├── LICENSE
├── README.md
└── requirements.txt
```

---

## 📜 License & Acknowledgments

This project is open-source under the **MIT License**.

Built for the **FortyGuard Hackathon '26**. Special thanks to the FortyGuard team for providing access to the FortyGuard tOS Enterprise API, NASA POWER for satellite reanalysis data, and UC Davis, Texas A&M AgriLife, and USDA Agricultural Research Service for agronomic extension publications.
