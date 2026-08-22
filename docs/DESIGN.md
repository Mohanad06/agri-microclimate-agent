# System Design

## 1. Purpose

This document defines the high-level architecture and system design of the `Agri Microclimate Agent`.

The goal is to establish clear responsibilities between the frontend, backend, agent orchestration layer, external data sources, agronomic knowledge base, and decision layer.

This document describes the intended architecture without locking the project into unnecessary implementation details.

---

## 2. Architectural Principle

The system transforms:

```text
Hyperlocal Environmental Data
+
Agronomic Knowledge
+
Agentic Tool Selection
```

into:

```text
Agricultural Decision
+
Explanation
+
Evidence
+
Action
```

The product should behave as an agricultural decision assistant rather than a weather dashboard.

---

## 3. High-Level Architecture

The target architecture is:

```text
User
  ↓
Frontend
  ↓
FastAPI Backend
  ↓
Agent Orchestrator
  ├── Geocoding Tool
  ├── FortyGuard Tool
  ├── NASA POWER Tool
  ├── Optional Forecast Tool
  └── Agronomic RAG Tool
          ↓
    Agronomic Knowledge Base
  ↓
Normalized Site Profile
  ↓
Decision / Recommendation Layer
  ↓
Grounded Recommendation
  ↓
Frontend
```

---

## 4. Architectural Layers

The system is divided into the following logical layers:

### Layer 1 — Presentation

Responsible for user interaction and visualization.

Main responsibility:

```text
User Input
↓
Display Analysis
↓
Display Decision
```

The frontend must not contain protected API credentials or directly access external protected APIs.

---

### Layer 2 — Backend API

The backend provides the application API between the frontend and the decision system.

Responsibilities include:

* Receiving user requests.
* Validating input.
* Starting analysis.
* Returning analysis results.
* Handling errors.
* Protecting secrets.
* Coordinating with the agent layer.

FastAPI is the planned backend framework.

---

### Layer 3 — Agent Orchestration

The agent is responsible for deciding what information is required for the user's goal.

Responsibilities include:

* Understanding user intent.
* Determining required evidence.
* Selecting tools.
* Ordering tool calls.
* Requesting relevant data.
* Requesting relevant agronomic evidence.
* Passing normalized information to the decision layer.

The agent should not blindly call every available tool.

---

### Layer 4 — Data Tools

Data tools provide external information to the agent.

Planned categories:

```text
Geocoding
FortyGuard
NASA POWER
Optional Forecast
```

Each tool should have a clear responsibility and normalized output.

---

### Layer 5 — Knowledge / RAG

The RAG layer provides trusted agronomic evidence.

Conceptually:

```text
User Goal
+
Crop
+
Crop Stage
+
Relevant Conditions
↓
Retriever
↓
Agronomic Evidence
```

The knowledge layer should remain independent from external environmental APIs.

---

### Layer 6 — Normalization

Different data providers may return different formats, units, timestamps, and structures.

A normalization layer should convert verified external information into a common internal representation.

The main conceptual object is:

```text
SiteProfile
```

This should act as the normalized source of truth for downstream reasoning.

---

### Layer 7 — Decision Layer

The decision layer evaluates the normalized environmental information together with relevant agronomic evidence.

Conceptually:

```text
SiteProfile
+
Agronomic Evidence
+
User Goal
↓
Decision
↓
Recommendation
```

The decision layer should be explainable and grounded.

---

## 5. Frontend Architecture

The frontend is responsible for presenting the agricultural decision workflow.

Conceptual flow:

```text
Location
↓
Crop
↓
Crop Stage
↓
User Goal
↓
Analyze
↓
Agent Activity
↓
Decision
↓
Evidence
↓
Visualization
```

The frontend may use:

* React
* Vite
* Axios
* Tailwind CSS
* Leaflet / React-Leaflet
* Recharts

These are planned technologies and may be adjusted if necessary.

---

## 6. Backend Architecture

The backend acts as the central application boundary.

Conceptually:

```text
Frontend
   ↓
FastAPI
   ↓
Request Validation
   ↓
Agent Orchestrator
   ↓
Tools / RAG
   ↓
Data Normalization
   ↓
Decision
   ↓
Response
```

The backend must remain independent from frontend implementation details.

---

## 7. Agent Architecture

The agent is not simply an LLM chatbot.

It is an orchestration component that can select tools according to the user's goal.

Example:

```text
User:
Should I irrigate my tomato field today?

Agent:
1. Resolve location.
2. Retrieve relevant FortyGuard heat conditions.
3. Retrieve relevant environmental context.
4. Retrieve tomato agronomic evidence.
5. Evaluate whether additional forecast information is required.
6. Build normalized site profile.
7. Generate decision.
8. Return evidence-backed recommendation.
```

The exact agent framework is not finalized and should be selected during the agent implementation phase.

---

## 8. Tool Architecture

Each external capability should be exposed to the agent through a well-defined tool interface.

Conceptually:

```text
Agent
 ├── geocode_location()
 ├── get_fortyguard_data()
 ├── get_nasa_power_data()
 ├── get_forecast_data()
 └── retrieve_agronomic_evidence()
```

The exact function names and schemas are implementation details and should not be treated as final API contracts.

---

## 9. FortyGuard Integration

FortyGuard is the primary hackathon data source.

The existing:

```text
fortyguard/client.py
```

should remain the primary integration layer.

The architecture should reuse the existing asynchronous request/polling behavior provided by the template.

Conceptually:

```text
Agent
↓
FortyGuard Tool
↓
Existing FortyGuard Client
↓
FortyGuard API
↓
Result
```

The project should initially focus on the relevant `heatmap` and `env_params` functionality.

---

## 10. External Data Architecture

The system may combine multiple external sources.

Conceptually:

```text
                 ┌── FortyGuard
                 │
User Goal ─ Agent ├── NASA POWER
                 │
                 ├── Optional Forecast
                 │
                 └── Agronomic RAG
```

The agent determines which sources are needed.

Not every request requires every source.

---

## 11. Data Fusion

External data should not be passed directly into the final recommendation without normalization.

Conceptually:

```text
FortyGuard Data
       +
NASA Data
       +
Forecast Data
       ↓
Data Normalization
       ↓
SiteProfile
```

The Site Profile should provide a consistent representation for downstream decision-making.

---

## 12. Site Profile Architecture

The Site Profile is the central normalized representation of the analyzed agricultural site.

Conceptually:

```text
SiteProfile
├── location
├── crop
├── crop_stage
├── environmental_conditions
├── heat_metrics
├── rainfall
├── humidity
├── soil_wetness_proxy
├── historical_context
├── timestamp
└── sources
```

The exact schema will be finalized after verifying actual data availability.

---

## 13. Knowledge Architecture

The agronomic knowledge system should be separated into:

```text
Source Documents
↓
Document Processing
↓
Chunking
↓
Embeddings
↓
Vector Store
↓
Retriever
↓
Evidence
```

The knowledge base should remain small and high quality during the MVP.

Potential vector stores:

* Chroma
* FAISS

The final selection is deferred to the RAG phase.

---

## 14. Decision Architecture

The decision process should follow:

```text
User Goal
+
Site Profile
+
Agronomic Evidence
↓
Decision Logic
↓
Recommendation
```

The recommendation must include enough context for the user to understand why the decision was made.

The decision layer must not create unsupported thresholds.

---

## 15. Recommendation Architecture

A conceptual recommendation object may contain:

```text
Recommendation
├── decision
├── summary
├── reasons
├── evidence
├── agronomic_context
├── sources
└── limitations
```

This is conceptual and does not define the final API response schema.

---

## 16. Explainability Architecture

The system should provide two types of explanation:

### User-Facing Explanation

A concise explanation of:

* What was found.
* Why it matters.
* What the user should do.

### Safe Activity Trace

A record of high-level system actions.

Example:

```text
Location resolved
FortyGuard data retrieved
Environmental context retrieved
Agronomic evidence retrieved
Conditions evaluated
Recommendation generated
```

The system must never expose private chain-of-thought.

---

## 17. Data Source Hierarchy

The intended priority is:

### Environmental Data

```text
FortyGuard
↓
Supplementary environmental sources
↓
Optional forecast source
```

### Agronomic Evidence

```text
Trusted agricultural institutions
↓
Agronomic knowledge base
↓
Retrieved evidence
```

The exact hierarchy may change if verification shows that a different source is more appropriate for a specific data requirement.

---

## 18. Error Architecture

Errors should be handled at the appropriate layer.

Conceptually:

```text
External API Error
↓
Tool Layer
↓
Agent / Backend
↓
Safe Application Error
↓
Frontend
```

The frontend should receive a useful user-facing error rather than raw stack traces or secrets.

Examples include:

* Location not found.
* External data unavailable.
* Analysis timed out.
* Agronomic evidence unavailable.
* Insufficient evidence.

---

## 19. Security Architecture

Security boundaries are:

```text
Frontend
   ↓
Backend
   ↓
External APIs
```

API keys and protected credentials remain exclusively on the backend.

The frontend should never receive the FortyGuard API key.

The `.env` file must not be committed.

---

## 20. Caching Architecture

Caching may be introduced to improve:

* Reliability
* Demo stability
* API usage
* Response speed
* Repeated requests

A conceptual location is:

```text
data/cache/
```

Caching design is intentionally deferred until the appropriate implementation phase.

The system should not introduce a complex caching infrastructure unnecessarily.

---

## 21. Deployment Architecture

The final deployment architecture is not yet finalized.

The MVP should favor:

* Simple deployment
* Low operational complexity
* Reliable demo behavior
* Secure environment variables
* Clear separation between frontend and backend

Deployment decisions will be made during the integration/submission phases.

---

## 22. Architecture Constraints

The architecture must respect the following constraints:

* FortyGuard remains central to the hackathon use case.
* Existing FortyGuard client should be reused.
* External API behavior must be verified.
* Frontend and backend remain separated.
* Secrets remain server-side.
* Agronomic decisions must be grounded.
* RAG must use trusted sources.
* The system should remain hackathon-appropriate.
* The MVP must remain small.
* No future phase should be implemented prematurely.

---

## 23. Deferred Decisions

The following architecture decisions remain open:

* Exact agent framework.
* Exact LLM provider/model.
* Final vector database.
* Final geocoding provider.
* Optional forecast provider.
* Final backend route structure.
* Final SiteProfile schema.
* Final recommendation schema.
* Deployment platform.
* Caching implementation.

These decisions should be made only when the corresponding phase requires them.

---

## 24. Architecture Evolution

The architecture should evolve based on verified requirements and actual implementation findings.

The project should avoid premature architectural commitments.

Any significant architecture change must:

1. Have a clear reason.
2. Be documented.
3. Be reviewed by the user.
4. Be reflected in the relevant documentation.
5. Not violate the project rules.

