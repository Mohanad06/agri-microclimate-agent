# System Specifications

## 1. Purpose

This document defines the functional and non-functional specifications for the `Agri Microclimate Agent`.

It describes what the system must do, what data it requires, what it should return, and the constraints that must be respected.

This document defines requirements, not implementation details.

---

## 2. Product Scope

The system is an AI-powered agricultural microclimate decision engine.

The MVP focuses on agricultural decisions related to:

* Irrigation timing
* Planting timing
* Heat-risk assessment

The system combines:

* FortyGuard hyperlocal temperature data
* Supplementary environmental data
* Agronomic knowledge
* Agentic tool orchestration

to generate grounded agricultural recommendations.

---

## 3. Primary User Input

The system should support the following conceptual inputs:

### Required

* Location
* Crop
* User goal/question

### Optional

* Crop growth stage
* Specific date or time period
* Additional context provided by the user

The exact API request schema will be finalized during implementation.

---

## 4. Location Requirements

The coordinates used for environmental analysis must represent the exact location of the farm. 

The farmer is not required to manually enter numerical coordinates. Instead, a future frontend interactive map allows the farmer to manually navigate to their field and place a pin on the exact location to capture `latitude` and `longitude`.

The map may include an optional location search bar as a navigation helper (e.g. searching for `"Fresno, CA"`):
* The place-name search service is used to move/pan the map to the searched area.
* **Important**: The resulting city centroid coordinates must never be automatically used as the final farm coordinates. They are exclusively for map navigation.
* The final farm coordinates must come from the user's manual pin placement. This ensures high accuracy because FortyGuard resolves hyperlocal microclimate temperature layers.

Coordinates must be handled correctly according to the relevant external API requirements. For GeoJSON-based FortyGuard requests, coordinates must follow standard GeoJSON order:
```text
[longitude, latitude]
```
not:
```text
[latitude, longitude]
```

The existing US Census Geocoder is kept as an optional geocoding utility for full street address resolution or as a future search helper, but is not the primary source of the farm coordinates.


---

## 5. Geographic Scope

The current project targets US agricultural locations.

The initial pilot region is not finalized.

The agent must not assume a specific city, county, or region until it has been explicitly selected and documented.

---

## 6. Crop Requirements

The MVP should initially support only a small number of crops.

Target:

```text
1–2 crops
```

The initial crops are not finalized.

Possible examples include:

* Tomato
* Almond

These are examples only and must not be treated as final product requirements until explicitly approved.

---

## 7. Crop Stage

Crop growth stage should be supported when it materially affects the agricultural decision.

Possible stages may include:

* Planting
* Germination
* Vegetative
* Flowering
* Fruiting
* Harvest

The final supported stages depend on the selected crops and agronomic sources.

The system must not invent crop-stage thresholds.

---

## 8. FortyGuard Requirements

FortyGuard is the primary environmental data source required by the hackathon.

The MVP should initially focus on:

```text
POST /v1/heatmap
POST /v1/env_params
```

Other FortyGuard endpoints are considered optional and should only be added when a clear requirement exists.

Potential endpoints available in the existing Quickstart template include:

```text
POST /v1/heatmap
POST /v1/env_params
POST /v1/satellite
POST /v1/streetview
POST /v1/heat_intelligence
```

The exact request and response schemas must be verified against official FortyGuard documentation and/or verified API responses before implementation.

---

## 9. FortyGuard Heatmap Analytics

The project should use relevant FortyGuard heatmap analytics for agricultural heat analysis.

Important analysis types include:

### Exceedance

Represents the number of hours during which temperature exceeds a specified threshold.

Example conceptual result:

```text
6 hours above 35°C
```

The value represents hours, not degree-hours.

### Persistence

Represents the longest continuous period during which temperature remains above a specified threshold.

Example:

```text
4.5 consecutive hours above threshold
```

Both analyses may require:

* Threshold
* Direction

The exact API parameter structure must be verified before implementation.

---

## 10. FortyGuard Environmental Parameters

The system may use:

```text
POST /v1/env_params
```

for relevant environmental parameters.

Potential information may include:

* Heat index
* Air-quality-related information
* Solar irradiance
* Hourly environmental parameters

The actual supported fields and interpretation must be verified from the official API documentation and/or API responses.

The system must not treat an environmental parameter as a forecast unless the underlying data actually represents a forecast.

---

## 11. FortyGuard Asynchronous Processing

FortyGuard analysis requests may operate asynchronously.

The conceptual workflow is:

```text
POST Request
↓
Activity ID
↓
Status Polling
↓
Processing
↓
Completed
↓
Result
```

The existing `fortyguard/client.py` should be used as the primary integration mechanism.

The project should not unnecessarily reimplement this polling mechanism.

---

## 12. NASA POWER Requirements

NASA POWER may supplement FortyGuard with environmental and historical context.

Potential target parameters include:

```text
PRECTOTCORR
RH2M
GWETROOT
GWETTOP
T2M
T2M_MAX
T2M_MIN
```

Potential uses include:

* Rainfall
* Humidity
* Soil wetness proxy
* Temperature cross-check
* Historical baseline/context

The exact parameter selection will be finalized after validating the requirements of the selected agricultural use cases.

---

## 13. NASA POWER Freshness Constraint

NASA POWER should not automatically be treated as a true near-real-time weather source.

Some meteorological parameters may have a latency of approximately several days.

Therefore:

* NASA POWER may provide historical/contextual information.
* It should not be assumed to provide real-time rainfall forecasts.
* Forecast-dependent decisions may require another source.

---

## 14. Optional Forecast Source

Open-Meteo may be used if the MVP requires short-term forecast information, particularly for rainfall over the next 24–48 hours.

Open-Meteo is optional.

It must not be added unless a clear product requirement justifies it.

The selected forecast source and exact parameters must be verified before implementation.

---

## 15. Agronomic Knowledge Requirements

The system must use a trusted agronomic knowledge base to support crop-specific reasoning.

The initial knowledge base should contain approximately:

```text
5–8 high-quality references
```

The system should prioritize source quality and correctness.

Potential sources include:

* USDA
* University Extension Services
* UC Davis / UC ANR
* Texas A&M AgriLife
* Other credible US agricultural institutions

The exact documents will be selected and documented during the RAG phase.

---

## 16. RAG Requirements

The RAG system should retrieve agronomic evidence based on relevant context.

Conceptually:

```text
Crop
+
Crop Stage
+
User Goal
+
Relevant Conditions
↓
Retriever
↓
Relevant Agronomic Evidence
```

The retrieved evidence should support:

* Crop requirements
* Relevant thresholds
* Heat-stress information
* Planting conditions
* Irrigation considerations
* Other crop-specific decision factors

The system must not generate unsupported agricultural thresholds.

---

## 17. Vector Store

A lightweight vector database may be used.

Potential options include:

* Chroma
* FAISS

The final choice will be made during the RAG phase based on simplicity, reliability, and hackathon requirements.

---

## 18. Agent Requirements

The agent should perform meaningful orchestration.

Given a user request, it should be capable of:

1. Understanding the user's goal.
2. Identifying required information.
3. Selecting relevant tools.
4. Calling the tools in an appropriate sequence.
5. Retrieving environmental data.
6. Retrieving agronomic evidence.
7. Combining the available evidence.
8. Evaluating the conditions.
9. Producing a decision.
10. Explaining the decision.
11. Providing supporting sources.

The agent must not blindly call every available tool for every question.

Tool selection should depend on the user's goal and required evidence.

---

## 19. Tool Categories

The system may expose the following tool categories to the agent:

### Location Tool

Resolves a human-readable location into coordinates.

### FortyGuard Tool

Retrieves relevant hyperlocal temperature and environmental data.

### NASA POWER Tool

Retrieves historical/environmental context.

### Forecast Tool

Optional short-term forecast provider.

### Agronomic RAG Tool

Retrieves crop-specific evidence from the knowledge base.

The exact tool interfaces will be defined during the implementation phases.

---

## 20. Site Profile

The system should create a normalized internal representation of the analyzed site.

Conceptual structure:

```text
SiteProfile

location
crop
crop_stage
temperature
heat_exposure_hours
persistence_hours
heat_index
solar_irradiance
rainfall
humidity
soil_wetness_proxy
historical_baseline
timestamp
sources
```

This is a conceptual model only.

Fields must be validated and finalized after reviewing the actual API responses and use-case requirements.

The Site Profile should become the normalized source of truth for downstream decision logic.

---

## 21. Decision Requirements

The final decision should be based on available environmental evidence and relevant agronomic evidence.

Possible decisions include:

```text
IRRIGATE
DELAY_IRRIGATION
PLANT_NOW
DELAY_PLANTING
MONITOR
HIGH_HEAT_RISK
LOW_HEAT_RISK
INSUFFICIENT_EVIDENCE
```

The final decision vocabulary must be finalized according to the supported MVP use cases.

The system must not produce a confident recommendation when the available evidence is insufficient.

---

## 22. Recommendation Requirements

Every recommendation should communicate:

### Decision

What the user should do.

### Reason

Why the system reached this conclusion.

### Evidence

The environmental values or conditions that influenced the decision.

### Agronomic Context

The relevant crop-specific knowledge.

### Sources

Citations or references supporting the information.

### Uncertainty

Any important limitations or missing information.

---

## 23. Example Recommendation Structure

Conceptually:

```text
Decision:
Delay irrigation.

Why:
Heat exposure is elevated and soil wetness indicators are low.

Evidence:
- Heat exposure: [verified value]
- Heat persistence: [verified value]
- Rainfall: [verified value]
- Soil wetness proxy: [verified value]

Agronomic evidence:
[Relevant crop-specific evidence]

Sources:
[Verified citations]

Confidence / limitations:
[Explanation]
```

The actual values must always come from verified data.

---

## 24. Citation Requirements

Citations must correspond to actual sources.

The system must distinguish between:

### Environmental Data Sources

Examples:

* FortyGuard
* NASA POWER
* Forecast provider

### Agronomic Sources

Examples:

* USDA
* University Extension
* Other verified agricultural references

The system must never fabricate citations or source URLs.

---

## 25. Agent Activity Trace

The frontend should eventually expose a safe activity trace.

Example:

```text
Location resolved
↓
FortyGuard heat data retrieved
↓
Environmental data retrieved
↓
Agronomic evidence retrieved
↓
Conditions analyzed
↓
Recommendation generated
```

The system must NOT expose private chain-of-thought or hidden reasoning.

Only safe tool/activity information should be displayed.

---

## 26. Backend API Requirements

The backend should provide a clean API between the frontend and the agent.

The exact routes and schemas will be defined during the backend design and implementation phases.

The frontend must not directly access protected external API credentials.

---

## 27. Frontend Requirements

The eventual frontend should support:

* Location input
* Crop selection
* Crop-stage selection when applicable
* User agricultural question
* Analyze action
* Loading/progress state
* Decision display
* Evidence display
* Map visualization
* Relevant charts
* Safe agent activity trace
* Error handling
* Responsive layout

These are product requirements, not final component names.

---

## 28. Error Handling Requirements

The system must handle cases including:

* Invalid location
* Unsupported location
* External API failure
* API timeout
* Missing environmental data
* Missing agronomic evidence
* Invalid crop
* Unsupported crop stage
* Insufficient evidence
* LLM failure
* RAG retrieval failure

The system should fail safely.

When evidence is insufficient, the recommendation should indicate:

```text
INSUFFICIENT_EVIDENCE
```

rather than inventing an answer.

---

## 29. Security Requirements

The system must:

* Keep API keys server-side.
* Never expose secrets to the frontend.
* Never commit `.env` files.
* Validate user inputs.
* Avoid exposing internal credentials or sensitive configuration.
* Avoid exposing private LLM reasoning.

---

## 30. Performance and Reliability

The MVP should prioritize reliable responses over maximum speed.

Important considerations include:

* API latency
* Asynchronous FortyGuard processing
* External API failures
* Caching
* Demo reliability

Caching may later be implemented under:

```text
data/cache/
```

but the caching architecture will be designed during the appropriate implementation phase.

---

## 31. Data Freshness

Every external data source should be interpreted according to its actual freshness characteristics.

The system must distinguish between:

* Historical data
* Current/recent observations
* Forecast data
* Derived indicators

The system must never present historical or delayed data as real-time forecast data.

---

## 32. Scope Control

The MVP should remain intentionally small.

The initial implementation should avoid:

* Supporting many crops.
* Supporting many regions.
* Implementing every FortyGuard endpoint.
* Complex satellite analysis.
* Street-view analysis.
* Large-scale infrastructure.
* Multi-agent architectures without a demonstrated need.

Additional functionality may be added only after the core MVP is working and approved.

---

## 33. Verification Rule

Any requirement involving external APIs must be verified before implementation.

If a required technical detail is unknown, use:

`TBD — Requires FortyGuard API Documentation / Verification`

instead of making assumptions.

This applies especially to:

* Request schemas
* Response schemas
* Parameter names
* Units
* Supported values
* Limits
* Authentication
* Availability
* Data freshness

---

## 34. Current Specification Status

The specifications in this document represent the current product direction.

Some technical details intentionally remain open until the relevant implementation phase.

The following are currently not finalized:

* Pilot location
* Final crop selection
* Final crop stages
* Exact SiteProfile schema
* Exact FortyGuard request schemas
* Exact FortyGuard response schemas
* Final geocoding provider
* Final vector store
* Optional forecast provider
* Final backend API contracts

These decisions must be made through documented verification and explicit project approval.

