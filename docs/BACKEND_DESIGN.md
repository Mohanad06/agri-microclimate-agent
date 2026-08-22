# Backend Design

## 1. Purpose

This document defines the backend architecture and responsibilities for the `Agri Microclimate Agent`.

The backend is the secure application layer between the frontend, the agent, external data providers, and the agronomic knowledge system.

The backend should remain modular, simple, testable, and appropriate for the hackathon MVP.

---

## 2. Backend Goals

The backend should:

* Provide a secure API for the frontend.
* Validate user requests.
* Orchestrate the agricultural analysis workflow.
* Provide tools to the agent.
* Integrate with FortyGuard.
* Integrate with supplementary environmental sources.
* Integrate with the agronomic RAG system.
* Normalize external data.
* Generate grounded recommendations.
* Handle errors safely.
* Keep secrets server-side.
* Provide safe activity information to the frontend.

---

## 3. Backend Technology

The planned backend framework is:

**FastAPI**

The exact supporting libraries and architecture will be finalized during implementation.

The backend should avoid unnecessary frameworks and infrastructure.

---

## 4. High-Level Backend Flow

The conceptual backend flow is:

```text
Frontend Request
↓
FastAPI
↓
Request Validation
↓
Agent Orchestrator
↓
Tool Selection
↓
External Data / RAG
↓
Data Normalization
↓
Site Profile
↓
Decision
↓
Recommendation
↓
API Response
```

---

## 5. Backend Responsibilities

The backend owns:

### API Layer

Receives requests from the frontend and returns structured responses.

### Validation Layer

Validates user-provided information.

### Orchestration Layer

Coordinates the analysis process.

### Tool Layer

Provides controlled access to external services.

### Knowledge Layer

Provides access to the agronomic RAG system.

### Decision Layer

Produces the final agricultural recommendation.

### Security Layer

Protects API keys and internal configuration.

---

## 6. Proposed Backend Structure

The target structure is conceptually:

```text
app/
├── main.py
├── api/
├── schemas/
├── services/
├── agent/
├── tools/
└── decision/
```

This is a design direction, not an instruction to create all directories immediately.

Files and folders should be created only during the relevant implementation phase.

---

## 7. Application Entry Point

The backend application should have a clear FastAPI entry point.

Conceptually:

```text
app/main.py
```

Responsibilities should remain limited to application setup and routing.

Business logic should not be placed directly inside the application entry point.

---

## 8. API Layer

The API layer should expose the minimum endpoints required by the frontend.

The exact route structure is intentionally not finalized.

Potential conceptual operations include:

```text
Analyze agricultural conditions
Health/status check
```

Additional endpoints should only be introduced when required.

---

## 9. Analysis Request

The backend should conceptually receive:

```text
AnalysisRequest

location
crop
crop_stage
question
```

Optional fields may include:

```text
date
time_range
additional_context
```

The exact schema must be finalized during implementation.

---

## 10. Analysis Response

The backend should eventually return a structured result containing information conceptually similar to:

```text
AnalysisResponse

decision
summary
evidence
agronomic_context
sources
site_profile
activity_trace
limitations
```

The exact response schema will be defined after the SiteProfile and decision requirements are validated.

---

## 11. Request Validation

The backend should validate:

* Required fields.
* Supported crops.
* Supported crop stages.
* Location format.
* Question length.
* Date/time formats when applicable.

Invalid input should produce clear errors.

The backend must not silently accept invalid data.

---

## 12. Agent Orchestrator

The agent orchestrator is responsible for coordinating the analysis.

Conceptually:

```text
User Request
↓
Understand Goal
↓
Determine Required Evidence
↓
Select Tools
↓
Execute Tools
↓
Normalize Results
↓
Retrieve Agronomic Evidence
↓
Evaluate Conditions
↓
Generate Recommendation
```

The exact agent framework and implementation are deferred to Phase 3.

---

## 13. Tool Layer

External capabilities should be isolated behind tool interfaces.

Conceptually:

```text
tools/
├── geocoding
├── fortyguard
├── nasa_power
├── forecast
└── agronomic_rag
```

These are logical responsibilities, not final file names.

---

## 14. Geocoding Service

The geocoding service exists as a search helper or address geocoding utility.

The primary farm coordinates (latitude and longitude) will come directly from the frontend map pin placement. A place-name geocoder (such as Nominatim or a custom helper) may optionally be used to parse general location search queries (like `"Fresno, CA"`) to pan/navigate the map to the correct area.

**Important**: Coordinates returned by place-name geocoders must never automatically define the final farm location. They are for map navigation only. The exact farm coordinate model must come from the user's explicit manual pin placement.

The existing U.S. Census Geocoder is retained as an optional utility for full U.S. street address lookup, but is not the primary geocoding source for the farm location coordinates.


---

## 15. FortyGuard Service

FortyGuard is the primary external environmental service.

The backend should use the existing:

```text
fortyguard/client.py
```

rather than creating a new client unnecessarily.

Conceptually:

```text
FortyGuard Tool
↓
Existing FortyGuard Client
↓
FortyGuard API
↓
Result
```

The initial MVP should focus on verified functionality for:

* Heatmap
* Environmental parameters

---

## 16. FortyGuard Async Handling

FortyGuard analysis requests may be asynchronous.

The existing client is responsible for the appropriate submission and polling mechanism.

The backend should treat the client as an integration abstraction rather than duplicating its internal implementation.

The backend must correctly handle:

* Submission failures.
* Processing failures.
* Timeouts.
* Invalid responses.
* Completed results.

---

## 17. NASA POWER Service

NASA POWER may provide supplementary environmental information.

Potential responsibilities include retrieving:

* Rainfall
* Humidity
* Soil wetness proxies
* Temperature context
* Historical context

NASA POWER should not automatically be considered a real-time forecast source.

The service must preserve the actual freshness characteristics of the retrieved data.

---

## 18. Forecast Service

A forecast service may be introduced if the MVP requires short-term forecast information.

Open-Meteo is currently the primary candidate.

However, the forecast service is optional.

It must not be implemented unless the approved use case requires forecast information.

---

## 19. Agronomic RAG Service

The RAG service provides crop-specific agronomic evidence.

Conceptually:

```text
Crop
+
Crop Stage
+
Question
↓
Retriever
↓
Relevant Documents / Chunks
↓
Evidence
```

The RAG service must return traceable evidence.

It must not return unsupported agricultural claims.

---

## 20. Knowledge Base

The knowledge base should initially remain small and high quality.

Target:

```text
5–8 trusted references
```

Potential sources include:

* USDA
* University Extension Services
* UC Davis / UC ANR
* Texas A&M AgriLife
* Other approved agricultural institutions

The exact documents will be selected during Phase 2.

---

## 21. Data Normalization

External providers may return different formats and units.

The backend should normalize verified data into a common internal representation.

Conceptually:

```text
FortyGuard
NASA POWER
Forecast
↓
Normalization
↓
SiteProfile
```

Normalization should handle appropriate:

* Units
* Timestamps
* Geographic coordinates
* Missing values
* Provider metadata
* Source references

---

## 22. Site Profile Service

The Site Profile should represent the current analyzed agricultural site.

Conceptually:

```text
SiteProfile
├── location
├── crop
├── crop_stage
├── temperature
├── heat_exposure_hours
├── persistence_hours
├── heat_index
├── solar_irradiance
├── rainfall
├── humidity
├── soil_wetness_proxy
├── historical_baseline
├── timestamp
└── sources
```

This structure is conceptual.

The final schema must be based on actual verified API data.

---

## 23. Decision Service

The decision service combines:

```text
User Goal
+
SiteProfile
+
Agronomic Evidence
```

to produce:

```text
Decision
+
Explanation
+
Evidence
+
Limitations
```

The decision layer should be deterministic where possible for clearly defined agricultural rules.

LLMs should not be trusted to invent numerical thresholds.

---

## 24. LLM Responsibilities

The LLM may be used for tasks such as:

* Understanding natural-language user goals.
* Selecting appropriate tools.
* Interpreting retrieved evidence.
* Producing user-friendly explanations.
* Structuring recommendations.

The LLM must not invent:

* Environmental measurements.
* Crop thresholds.
* API responses.
* Citations.
* Unsupported agronomic facts.

Retrieved and verified data should constrain the final output.

---

## 25. Grounding

The backend should enforce grounding between:

```text
Decision
↓
Environmental Evidence
+
Agronomic Evidence
```

A recommendation should not be produced as a confident answer when required evidence is missing.

The system should support an:

```text
INSUFFICIENT_EVIDENCE
```

state.

---

## 26. Source Tracking

Every important external or knowledge-base value should retain source information where practical.

Conceptually:

```text
Evidence
├── value
├── unit
├── source
├── timestamp
└── metadata
```

The final schema will be defined during implementation.

---

## 27. Activity Trace

The backend should generate a safe activity trace that can be returned to the frontend.

Example:

```text
Location resolved
FortyGuard data retrieved
NASA POWER data retrieved
Agronomic evidence retrieved
Site profile created
Conditions evaluated
Recommendation generated
```

The trace should contain high-level actions only.

It must not contain:

* Hidden chain-of-thought.
* Private prompts.
* API keys.
* Secrets.
* Sensitive internal information.

---

## 28. Error Handling

The backend should handle failures at the service/tool boundary.

Examples:

```text
Geocoding Failure
External API Failure
FortyGuard Timeout
NASA POWER Failure
RAG Failure
LLM Failure
Invalid Input
Insufficient Evidence
```

Errors should be converted into safe application-level responses.

Raw stack traces should not be returned to the frontend in production.

---

## 29. Partial Data Handling

External services may occasionally fail independently.

The system should distinguish between:

### Critical Missing Data

The missing data prevents a reliable recommendation.

Result:

```text
INSUFFICIENT_EVIDENCE
```

### Non-Critical Missing Data

The recommendation can still be supported using available evidence.

The response should communicate the limitation.

The exact criticality rules will be defined after the supported use cases are finalized.

---

## 30. Caching

Caching may be added to improve:

* Reliability.
* API usage.
* Demo stability.
* Repeated analysis performance.

A conceptual location is:

```text
data/cache/
```

Caching should be introduced during the appropriate implementation phase.

The MVP should avoid complex distributed caching infrastructure.

---

## 31. Configuration

Environment-specific configuration should be kept outside source code.

The project already uses:

```text
.env.example
```

The actual `.env` file must not be committed.

Potential configuration includes:

* FortyGuard API key.
* FortyGuard base URL.
* LLM configuration.
* External service configuration.

Exact configuration values should not be hardcoded.

---

## 32. Security

The backend is the security boundary for external API credentials.

Requirements:

* Never expose API keys to the frontend.
* Never commit secrets.
* Validate inputs.
* Avoid logging secrets.
* Avoid returning credentials in responses.
* Avoid exposing private prompts or internal reasoning.

---

## 33. Logging

The backend should provide useful operational logging for:

* Request lifecycle.
* Tool execution.
* External API failures.
* Timeouts.
* Validation errors.
* Unexpected exceptions.

Logs should not contain:

* API keys.
* Passwords.
* Tokens.
* Private credentials.
* Sensitive user information.

---

## 34. Testing Strategy

Backend testing should eventually cover:

### Unit Tests

* Data normalization.
* Validation.
* Decision logic.
* Tool wrappers.

### Integration Tests

* FortyGuard client integration.
* NASA POWER integration.
* RAG integration.
* Agent orchestration.

### End-to-End Tests

```text
Frontend Request
↓
Backend
↓
Agent
↓
Tools
↓
Decision
↓
Response
```

The exact testing structure will be implemented during the relevant phase.

---

## 35. Backend / Frontend Boundary

The backend should return application-level results rather than raw external API responses whenever possible.

The frontend should receive structured information appropriate for:

* Decision display.
* Evidence display.
* Visualization.
* Activity trace.
* Error handling.

The frontend should not need to understand the internal implementation of FortyGuard, NASA POWER, or the RAG system.

---

## 36. Backend Scope for MVP

The MVP backend should focus on:

* One core analysis workflow.
* Secure external API integration.
* FortyGuard integration.
* Required supplementary data.
* Agronomic evidence retrieval.
* SiteProfile creation.
* Decision generation.
* Grounded response.
* Safe activity trace.
* Error handling.

Additional backend services should be deferred unless required.

---

## 37. Deferred Backend Decisions

The following remain open:

* Exact API route names.
* Exact request/response schemas.
* Agent framework.
* LLM provider/model.
* Final tool interfaces.
* Final SiteProfile schema.
* Final decision schema.
* Vector database.
* Forecast provider.
* Caching implementation.
* Deployment architecture.

These decisions should be made during the corresponding implementation phase.

---

## 38. Backend Design Principle

The backend should follow this principle:

```text
Validate
↓
Orchestrate
↓
Retrieve
↓
Normalize
↓
Ground
↓
Decide
↓
Explain
↓
Respond
```

The backend exists to turn multiple data and knowledge sources into a reliable, secure, and explainable agricultural decision.

