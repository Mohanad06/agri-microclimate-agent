# PROJECT STATE

## Project

**Agri Microclimate Agent**

AI-powered agricultural microclimate decision engine for planting and irrigation timing.

---

## Current Phase

**Phase 4 — Integration, Full Stack Web UI, & Final Hackathon Verification**

---

## Status

**COMPLETED AND APPROVED**

---

## Last Approved Phase

**Phase 4 — Integration, Full Stack Web UI, & Final Hackathon Verification**

---

## Current Task

None (Phase 4 is fully verified and ready for hackathon demonstration)

---

## Next Task

Hackathon Demo & Final Presentation Video

---

## Completed

### Repository Setup

- GitHub repository created using the FortyGuard Temperature API Quickstart Template.
- Repository cloned locally.
- Repository opened and inspected.
- Existing FortyGuard client identified.
- Existing notebooks inspected.
- Existing documentation structure identified.
- Phase 0 documentation audited and approved.

### Phase 1 Tasks completed

- **Task 1 (FortyGuard Client Inspection)**: Inspected and validated the existing FortyGuard client structure, parameters, endpoints, and exceptions.
- **Task 2 (FortyGuard API Verification)**: Verified the required FortyGuard API endpoints, parameter requirements, exceedance/persistence definitions, and `heat_index_celsius` behavior.
- **Task 3 (FortyGuard Authenticated Live Smoke Test)**: Completed live smoke testing of heatmaps, env_params, exceedance, and persistence endpoints using local `.env` authentication.
- **Task 4 (Geocoding Investigation & Integration)**: Designed and implemented a lightweight, reusable US Census Geocoder wrapper in `fortyguard/geocoding.py` with full unit test coverage in `fortyguard/test_geocoding.py`.
- **Task 5 (NASA POWER Investigation & Integration Design)**: Evaluated parameters, authentication, latency, and endpoints. Verified that NASA POWER is a reanalysis model/climatology product with 2-3 day latency, not a forecast service. Determined it will supply broad-scale meteorological context (`PRECTOTCORR`, `GWETROOT`, `RH2M`) to support hyperlocal temperature metrics.
- **Task 6 (NASA POWER Implementation)**: Designed and implemented a reusable NASA POWER data service in `fortyguard/nasa_power.py` with full unit test coverage in `fortyguard/test_nasa_power.py`. Verified that all 7 tests covering 10 scenarios passed, and the live API connects successfully.
- **Task 7 (Data Normalization & Site Profile Design + Implementation)**: Created the normalization layer in `fortyguard/site_profile.py` with accompanying unit tests in `fortyguard/test_site_profile.py`.
  - *Implemented*: Defined standard dataclasses `LocationProfile`, `FortyGuardStats`, `FortyGuardProfile`, `NasaPowerProfile`, and `SiteProfile` to isolate data source structures and enforce source authority.
  - *Data Normalization*: Implemented `normalize_fortyguard_heatmap()`, `normalize_nasa_power()`, and `build_site_profile()` to compile raw JSON responses into a single cohesive profile.
  - *Error Handling & Data Quality*: Enforces coordinate checks, date consistency, and preserves `-999.0` NASA POWER fill values as `None` (flagging data quality status as `PARTIAL` when missing values occur).
  - *Tests*: Resolved constructor bypass issues by centralizing quality status resolution in the `SiteProfile.__post_init__` hook. All 8 tests (testing 10 scenarios) pass successfully.

### Phase 2 Tasks completed

- **Task 1 (Source Ingestion & Chunking)**: Designed a modular markdown parser in `knowledge/ingest.py` that extracts document-level metadata (crop, source, URL) and splits guides into semantic chunks based on headers and paragraphs.
- **Task 2 (Vector Database & Embeddings)**: Built `knowledge/vector_store.py` with custom TF-IDF/cosine similarity calculations for keyless fallback, supporting offline execution and dynamic API key embedding overrides.
- **Task 3 (Evidence Tool Abstraction)**: Implemented the clean evidence retrieval contract `retrieve_agronomic_evidence()` in `knowledge/evidence_tool.py` returning source-traceable metadata and relevance scores.
  - Added **Crop Scope Guard** (Phase 3 hardening): `crop=None` or unsupported crops return `[]` immediately, preventing cross-crop citation leakage.
- **Task 4 (Traceability & Testing)**: Created comprehensive tests in `tests/test_rag.py` (7 tests passing, including crop scope guard regression) and a manual verification trace tool in `knowledge/manual_verification.py`. Verified that all 4 baseline queries return correct, semantic, and source-cited matches (e.g. Mild stress SWP of -1.0 to -1.4 MPa).

### Phase 3 Tasks completed

Phase 3 implemented the first real agentic layer: a **Goal-Driven Heat Agent** that accepts a natural-language agricultural goal and autonomously parses, plans, executes tools, aggregates evidence, and evaluates risk — with a fully auditable execution trace.

#### Architecture

The Phase 3 agentic loop follows the policy:
```
Goal → Parse → Plan (dynamic) → Tool Execution → Evidence Aggregation → Decision → Auditable Result
```

Data source boundaries are strictly enforced:
- **RAG / Agronomic Knowledge**: Static, trusted thresholds and crop-stage evidence only.
- **FortyGuard**: Primary runtime source for hyperlocal heat/exceedance conditions.
- **NASA POWER**: Historical/climatological context only when the goal requires it.

#### Modules implemented

- **`agent/tool_registry.py`**: Standard `ToolResult` dataclass and `BaseTool` abstract base class. Concrete wrappers: `GeocodingTool`, `FortyGuardTool`, `NasaPowerTool`, `AgronomicEvidenceTool`. Central `ToolRegistry` for registration and lookup.
- **`agent/goal_parser.py`**: Deterministic keyword-based natural-language goal parser. Extracts `crop`, `crop_stage`, `location`, `history_requested`, and `is_pure_agronomic` flags. Designed to support optional LLM enhancement in future phases.
- **`agent/planner.py`**: Dynamic tool sequencer. Selects only the tools required by the parsed goal — no fixed pipeline. Examples:
  - `"Find the agronomic threshold for tomatoes..."` → `[AgronomicEvidenceTool]` only
  - `"Assess tomato heat risk in Phoenix..."` → `[GeocodingTool, AgronomicEvidenceTool, FortyGuardTool]`
  - `"Historical climate context..."` → `[GeocodingTool, AgronomicEvidenceTool, NasaPowerTool]`
- **`agent/decision.py`**: Two-component decision layer:
  - `EvidenceParser`: Extracts numeric thresholds from RAG text (e.g. `32°C`, `-1.0 to -1.4 MPa`, `GWETROOT below 0.20`) using deterministic regex patterns.
  - `DecisionLayer`: Compares observed environmental values against parsed thresholds. Includes a mandatory **Evidence Sufficiency Gate** (`comparisons_made` counter): if no actual metric comparison was executed (no observed data available or cross-crop mismatch), the result is `INSUFFICIENT_EVIDENCE` — never a speculative `LOW`/`HIGH`.
- **`agent/trace.py`**: `AuditLogger` records all steps, tool invocations, inputs, and results in a user-facing safe trace. Private keys, system prompts, and internal chain-of-thought are never exposed.
- **`agent/orchestrator.py`**: Central `AgentOrchestrator` coordinates the full loop. Dynamically injects RAG-extracted temperature thresholds into FortyGuard exceedance queries. Handles partial tool failures gracefully. Outputs structured JSON result with findings, risk assessment, cited sources, and audit trace.
- **`agent/manual_verification.py`**: E2E scenario runner for manual trace inspection.

#### Evidence policies enforced

- **No fabricated agronomic recommendations**: Every recommendation is bound to a `reference_id` (chunk ID) from the RAG store.
- **Cross-crop citation leakage blocked**: The Crop Scope Guard in `evidence_tool.py` prevents tomato/almond chunks from being cited for unknown crops.
- **Evidence Sufficiency Gate**: Risk level requires at least one successful observation-vs-threshold comparison. No comparison → `INSUFFICIENT_EVIDENCE`.
- **Partial failure support**: If a tool fails (e.g. FortyGuard API timeout), the orchestrator marks status as `partial`, logs the error in the audit trace, and continues with available data.

#### Verification results (Phase 3 Approval)

| Test Suite | Tests | Result |
|---|---|---|
| Phase 1 (`fortyguard/test_site_profile.py`) | 8 | ✅ ALL PASS |
| Phase 2 (`tests/test_rag.py`) | 7 | ✅ ALL PASS |
| Phase 3 (`tests/test_agent.py`) | 9 | ✅ ALL PASS |
| Full suite (`discover -s tests`) | 16 | ✅ ALL PASS |

#### E2E Manual Verification

| Scenario | Plan | Result |
|---|---|---|
| A — Tomato flowering heat risk in Phoenix | `Geocoding → RAG → FortyGuard` | ✅ PASS — 34.5°C > 32°C → HIGH risk, UC ANR cited |
| B — Historical climate context in Phoenix | `Geocoding → RAG → NASA POWER` | ✅ PASS — NASA POWER correctly triggered for historical request |
| C — RAG-only agronomic threshold query | `RAG only` | ✅ PASS — INSUFFICIENT_EVIDENCE (no runtime data to compare) |
| D — Unknown crop (Pineapple) | `RAG only` | ✅ PASS — INSUFFICIENT_EVIDENCE, zero citations, no cross-crop leakage |

### Phase 4 Tasks completed

Phase 4 delivered the complete full-stack web application, live FortyGuard API integration, NASA POWER climatology fusion, multi-crop expansion, and interactive frontend dashboard.

#### Key Accomplishments

- **FastAPI Server (`app/`)**: Built REST API endpoints (`/health`, `/crops`, `/analyze`) with Pydantic validation, CORS middleware, and structured exception handling.
- **Frontend Dashboard (`frontend/`)**: Modern React + Vite application featuring an interactive Leaflet map pin selector, goal submission form, risk banner, observation metrics grid, structured agronomic action plan, grounded citations, and full agent execution trace modal.
- **FortyGuard Live API Integration (`fortyguard/` & `agent/tool_registry.py`)**:
  - Implemented dynamic recent 7-day date window handling.
  - Standardized heatmap calls on `analytic_type="tcm"`.
  - Configured GeoJSON `FeatureCollection` square polygon AOI (~7 km²).
  - Normalized temperature extraction from FortyGuard `stats_data.temperature_stats` (°C).
- **NASA POWER Integration**: Integrated daily precipitation (`PRECTOTCORR`) and root-zone soil wetness (`GWETROOT`) into the decision pipeline alongside FortyGuard thermal forecasting.
- **Multi-Crop RAG Expansion**: Indexed 5 major US crops in `data/knowledge_store.json` (Tomato, Almond, Corn, Grape, Cotton) with trusted agronomic extension references (UC Davis, TAMU, USDA).
- **Narrative & Action Plan Synthesis**: `DecisionLayer` generates crop/stage-specific multi-step action plans and a natural-language farmer executive summary narrative.
- **Human-Readable UI Explanations**: `FindingsGrid` converts raw observation metrics into intuitive farmer explanations (e.g., low rainfall warnings, soil wetness status).

---

### Existing Repository Structure

```text
agri-microclimate-agent/
│
├── agent/                        # Phase 3 — Agentic Orchestration
│   ├── __init__.py
│   ├── decision.py               # EvidenceParser + DecisionLayer (sufficiency gate)
│   ├── goal_parser.py            # Deterministic NL goal parser
│   ├── manual_verification.py    # E2E scenario runner
│   ├── orchestrator.py           # AgentOrchestrator (central execution loop)
│   ├── planner.py                # Dynamic tool sequencer
│   ├── tool_registry.py          # ToolResult, BaseTool, concrete wrappers, registry
│   └── trace.py                  # AuditLogger (safe user-facing trace)
│
├── assets/
├── data/
│   ├── knowledge_base/           # Phase 2 — Verified agronomic markdown documents
│   └── knowledge_store.json      # Phase 2 — TF-IDF vector index
│
├── docs/
│   ├── BACKEND_DESIGN.md
│   ├── GOALS.md
│   └── PROJECT_STATE.md
│
├── fortyguard/                   # Phase 1 — Data Layer
│   ├── client.py
│   ├── geocoding.py
│   ├── nasa_power.py
│   ├── samples.py
│   ├── site_profile.py
│   ├── test_geocoding.py
│   ├── test_nasa_power.py
│   └── test_site_profile.py
│
├── knowledge/                    # Phase 2 — RAG Layer
│   ├── evidence_tool.py          # Crop Scope Guard + retrieve_agronomic_evidence()
│   ├── ingest.py
│   ├── manual_verification.py
│   └── vector_store.py
│
├── notebooks/
├── tests/
│   ├── test_agent.py             # Phase 3 — 9 tests (planning, decision, regression)
│   └── test_rag.py               # Phase 2 — 7 tests (including crop scope guard)
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```
