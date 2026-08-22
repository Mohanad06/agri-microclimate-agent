# Project Rules

## 1. Purpose

This document defines the mandatory rules for developing and maintaining the `agri-microclimate-agent` project.

These rules apply to every AI agent, developer, and future development session working on this repository.

---

## 2. Phase-Based Development

The project must be developed incrementally.

The development order is:

1. Phase 0 — Project Setup & Documentation
2. Phase 1 — Data Layer
3. Phase 2 — Agronomic Knowledge & RAG
4. Phase 3 — Agent Orchestration
5. Phase 4 — Application & UI
6. Phase 5 — Integration, Testing & Hardening
7. Phase 6 — Submission & Demo

The agent MUST work only on the current approved phase.

The agent MUST NOT start a future phase without explicit user approval.

---

## 3. User Approval

Each phase follows this workflow:

**Implementation → Testing → User Review → Explicit Approval → Update PROJECT_STATE.md → Next Phase**

The agent must never assume approval.

The agent must stop after completing the current task and wait for the user to review the work.

Only an explicit approval from the user allows progression to the next phase.

---

## 4. Documentation First

The `/docs` directory is the project's documentation source of truth.

Before making any major architectural or implementation change, the agent MUST inspect the relevant documentation.

The agent must keep the documentation synchronized with the actual implementation.

Any major architectural decision must be documented.

---

## 5. Repository Safety

The existing FortyGuard Quickstart Template is part of the project.

The agent MUST NOT:

* Delete existing template files without justification.
* Rename existing template files without justification.
* Replace the existing FortyGuard client unnecessarily.
* Rebuild the FortyGuard API client from scratch.
* Remove existing notebooks or documentation simply because they are not currently used.

Existing template code should be reused whenever appropriate.

---

## 6. FortyGuard API Accuracy

FortyGuard API information must never be invented.

The agent must rely on one or more of:

* Official FortyGuard documentation.
* Existing official/adapted FortyGuard Quickstart code in the repository.
* Verified API responses.

If an API behavior, endpoint, parameter, response field, limitation, or constraint has not been verified, mark it as:

`TBD — Requires FortyGuard API Documentation / Verification`

Do not guess.

This rule applies especially to:

* Endpoints
* Authentication
* Request parameters
* Response schemas
* API limits
* Rate limits
* Pricing
* Supported coverage
* Data availability

---

## 7. Existing FortyGuard Client

The existing:

`fortyguard/client.py`

is the primary FortyGuard integration layer.

Do not create a replacement client unless there is a clear technical reason.

Reuse the existing asynchronous task submission and polling mechanism whenever it is suitable.

---

## 8. Security

Secrets must never be committed to the repository.

API keys must remain server-side.

Never expose the FortyGuard API key to the frontend.

Never hardcode API keys, tokens, passwords, or other secrets into source code.

The `.env` file must remain uncommitted.

---

## 9. Architecture Separation

The system must maintain clear separation between:

**Frontend → Backend → Agent/Services → External APIs & Knowledge Base**

The frontend must not directly call FortyGuard or other protected backend services.

Backend responsibilities include:

* API orchestration
* Agent execution
* External API calls
* RAG retrieval
* Decision generation
* Validation
* Security

Frontend responsibilities include:

* User interaction
* Visualization
* Map display
* Charts
* Decision presentation
* Evidence presentation
* Safe agent activity/status display

---

## 10. Agricultural Decision Quality

The product is not a simple weather dashboard.

The core objective is to transform:

**Microclimate Data + Agronomic Knowledge + Agentic Tool Use**

into:

**Agricultural Decision + Explanation + Evidence + Action**

Recommendations must be explainable and grounded in actual data and agronomic evidence.

The system must never invent:

* Temperature values
* Rainfall values
* Crop thresholds
* Heat-stress thresholds
* Soil conditions
* Agronomic recommendations
* Citations

---

## 11. RAG Grounding

Agronomic recommendations should be grounded in trusted agricultural sources.

Potential sources include:

* USDA
* University Extension Services
* UC Davis / UC ANR
* Texas A&M AgriLife
* Other credible US public agricultural institutions

The project prioritizes correctness and source quality over the number of documents.

Do not add large amounts of weak or unverified content just to increase the size of the knowledge base.

---

## 12. Agentic Behavior

The agent must perform meaningful tool selection and orchestration.

The agent should be capable of determining which information is required for a user's agricultural goal.

Potential tools include:

* Geocoding
* FortyGuard
* NASA POWER
* Optional Open-Meteo
* Agronomic RAG

The system should demonstrate the sequence of tool/activity calls without exposing private chain-of-thought.

Only a safe, user-facing activity trace should be shown.

Example:

* Location resolved
* FortyGuard data retrieved
* NASA data retrieved
* Agronomic evidence retrieved
* Conditions compared
* Recommendation generated

---

## 13. No Overengineering

The architecture must remain appropriate for a hackathon MVP.

Prefer:

* Simple
* Modular
* Testable
* Explainable
* Reliable

Avoid unnecessary:

* Microservices
* Complex infrastructure
* Premature abstractions
* Unnecessary dependencies
* Large frameworks
* Features outside the MVP

Build the smallest reliable system that demonstrates the core value.

---

## 14. MVP First

The core MVP must be completed before advanced features are added.

Do not add optional features simply because they are technically interesting.

The core product is:

**Agricultural Microclimate Decision Engine**

focused initially on agricultural decisions such as:

* Planting timing
* Irrigation timing
* Heat-risk assessment

---

## 15. Data Source Rules

FortyGuard is the primary hackathon data source.

NASA POWER may supplement information that FortyGuard does not provide.

Open-Meteo is optional and must only be added if there is a clear MVP requirement.

Do not add external data sources without documenting:

* Why the source is needed.
* What data it provides.
* Why FortyGuard cannot provide the required information.
* How the data will be validated.

---

## 16. Location and Coverage

The project currently targets US agricultural locations because of the planned FortyGuard coverage.

The initial pilot region and crops are NOT finalized.

The agent must not assume a specific city, county, or crop until explicitly approved and documented.

---

## 17. Documentation Synchronization

Whenever an important decision changes, update the relevant documentation.

Examples:

* Architecture changes → `DESIGN.md`
* Backend changes → `BACKEND_DESIGN.md`
* Frontend changes → `FRONTEND_DESIGN.md`
* Requirements changes → `SPECIFICATIONS.md`
* Project status changes → `PROJECT_STATE.md`
* Agent behavior changes → `KICKOFF_PROMPT.md`

Documentation must reflect the actual state of the project.

---

## 18. Testing

Every implementation phase must include appropriate testing before being considered complete.

The agent must report:

* What was tested.
* How it was tested.
* Test results.
* Known limitations.
* Any remaining issues.

The agent must not claim a phase is complete if important functionality has not been tested.

---

## 19. Change Discipline

The agent should make the smallest reasonable change required to complete the current task.

Do not modify unrelated files.

Do not refactor working code unless the refactor is necessary for the current phase.

Avoid creating unnecessary files.

---

## 20. Phase Completion

When the current phase is complete, the agent must:

1. Summarize what was implemented.
2. List created and modified files.
3. Explain important decisions.
4. Report tests performed.
5. Report known issues or limitations.
6. Update `PROJECT_STATE.md` only when the user explicitly approves the phase.
7. Stop and wait for the user's next instruction.

---

## 21. Current Project Rule

At the beginning of the project, the current phase is:

**Phase 0 — Project Setup & Documentation**

The immediate objective is to establish and review the project's documentation and architecture.

No Phase 1 implementation should begin until Phase 0 has been explicitly approved by the user.

---

## 22. Golden Rule

> **One Phase → Implementation → Testing → User Review → Explicit Approval → Update PROJECT_STATE → Next Phase**

Never skip a phase.

Never assume approval.

Never invent technical information.

Never build features that have not been approved.

