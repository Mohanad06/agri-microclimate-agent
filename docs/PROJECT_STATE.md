# PROJECT STATE

## Project

**Agri Microclimate Agent**

AI-powered agricultural microclimate decision engine for planting and irrigation timing.

---

## Current Phase

**Phase 2 — Agronomic Knowledge & RAG**

---

## Status

**COMPLETED**

---

## Last Approved Phase

**Phase 2 — Agronomic Knowledge & RAG**

---

## Current Task

None (Phase 2 is fully verified and completed)

---

## Next Task

Phase 3 — Agentic Orchestration / Goal-Driven Heat Agent

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
- **Task 4 (Traceability & Testing)**: Created comprehensive tests in `tests/test_rag.py` (6 tests passing) and a manual verification trace tool in `knowledge/manual_verification.py`. Verified that all 4 baseline queries return correct, semantic, and source-cited matches (e.g. Mild stress SWP of -1.0 to -1.4 MPa).

### Existing Repository Structure

```text
agri-microclimate-agent/
│
├── assets/
├── data/
├── docs/
├── fortyguard/
├── notebooks/
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```
