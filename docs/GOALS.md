# Project Goals

## 1. Project Vision

`Agri Microclimate Agent` is an AI-powered agricultural microclimate decision engine that transforms hyperlocal environmental data and trusted agronomic knowledge into actionable agricultural recommendations.

The system is designed to help users answer practical questions such as:

* Should I irrigate today?
* Is it safe to plant this crop now?
* Are current heat conditions risky for my crop?
* Should I delay planting?
* What environmental conditions are driving the recommendation?

The product is not intended to be a simple weather dashboard.

Its primary purpose is to support agricultural decisions.

---

## 2. Core Value Proposition

The core value proposition is:

> **Turn hyperlocal climate data into explainable agricultural decisions.**

The system combines:

**FortyGuard Hyperlocal Temperature Data**

*

**Additional Environmental Data**

*

**Agronomic Knowledge**

*

**Agentic Tool Selection**

to produce:

**Decision + Explanation + Evidence + Action**

---

## 3. Problem

Agricultural decisions such as irrigation and planting timing are affected by highly local environmental conditions.

General weather information may not adequately represent conditions at a specific agricultural site.

Farmers and agricultural decision-makers need to understand:

* Local heat exposure
* Heat persistence
* Temperature conditions
* Rainfall
* Humidity
* Soil moisture-related indicators
* Crop-specific thresholds
* Crop growth stage
* Historical context

The challenge is not simply obtaining environmental data.

The challenge is turning multiple data sources and agricultural knowledge into a clear decision.

---

## 4. Target Users

The initial target users include:

### Primary Users

* Farmers
* Farm managers
* Agricultural operators

### Secondary Users

* Agronomists
* Agricultural consultants
* Agricultural decision-support teams
* Researchers working with agricultural climate risk

The MVP should prioritize simplicity and usefulness for users who need an actionable answer rather than raw technical data.

---

## 5. Core Product Goal

The system should answer:

> **"What should I do, why, and what data/evidence supports this decision?"**

Instead of only answering:

> "What is the temperature?"

---

## 6. Core Use Cases

The MVP should focus on a small number of high-value agricultural decisions.

### Use Case 1 — Irrigation Timing

Example:

> Should I irrigate my tomato field today?

The system evaluates available environmental conditions and relevant crop knowledge, then produces an explainable recommendation.

Possible outcomes include:

* Irrigate today
* Delay irrigation
* Monitor conditions
* Insufficient evidence

---

### Use Case 2 — Planting Timing

Example:

> Is this field ready for tomato planting?

The system compares site conditions with relevant crop requirements and produces a recommendation.

Possible outcomes include:

* Plant now
* Delay planting
* Monitor conditions
* Insufficient evidence

---

### Use Case 3 — Heat Risk Assessment

Example:

> Is my crop currently exposed to dangerous heat conditions?

The system evaluates heat exposure and persistence together with crop-specific agronomic evidence.

Possible outcomes include:

* Low risk
* Moderate risk
* High risk
* Insufficient evidence

---

## 7. Agentic Product Goal

The system should demonstrate genuine agentic behavior.

The agent should:

1. Understand the user's agricultural goal.
2. Identify the information required.
3. Select appropriate tools.
4. Execute the required tool calls.
5. Retrieve relevant environmental data.
6. Retrieve relevant agronomic evidence.
7. Combine the information.
8. Evaluate the conditions.
9. Produce an explainable decision.
10. Provide supporting evidence and citations.

The agent should not simply pass the user's question to an LLM and generate an unsupported answer.

---

## 8. Hackathon Positioning

The project is primarily positioned for the:

**Agentic Track**

The core technical story is:

**FortyGuard + External Environmental Data + Agronomic RAG + Agentic Orchestration**

The project should demonstrate that FortyGuard data can be transformed into a useful agricultural decision workflow rather than being displayed as raw temperature information.

---

## 9. MVP Goals

The MVP should demonstrate the complete decision pipeline:

```text
User Goal
↓
Location Resolution
↓
Agent Tool Selection
↓
FortyGuard Data
↓
Supplementary Environmental Data
↓
Agronomic Knowledge Retrieval
↓
Condition Analysis
↓
Agricultural Decision
↓
Explanation
↓
Evidence / Citations
```

The MVP should prioritize a complete working flow over a large number of features.

---

## 10. Data Goals

FortyGuard should remain the primary environmental data source for the project.

The initial data focus should include relevant signals such as:

* Temperature-related conditions
* Heat exceedance
* Heat persistence
* Environmental parameters

Additional sources may supplement FortyGuard where necessary.

NASA POWER may provide:

* Rainfall
* Humidity
* Soil wetness proxies
* Temperature context
* Historical environmental context

Open-Meteo may optionally provide short-term forecast information if required by the MVP.

---

## 11. Agronomic Knowledge Goals

The project should create a small but reliable agronomic knowledge base.

The initial knowledge base should prioritize approximately:

**5–8 high-quality references**

rather than a large collection of weak sources.

Sources should preferably come from trusted agricultural institutions such as:

* USDA
* University Extension Services
* UC Davis / UC ANR
* Texas A&M AgriLife
* Other credible US agricultural institutions

The knowledge base should provide evidence for crop-specific requirements, thresholds, and recommendations where applicable.

---

## 12. Explainability Goal

Every important recommendation should be explainable.

The system should clearly communicate:

### What happened?

Example:

* Heat exposure exceeded a relevant threshold.
* Rainfall conditions are low.
* Soil wetness proxy is low.

### Why does it matter?

The system connects these observations to relevant agronomic knowledge.

### What should the user do?

The system provides an actionable recommendation.

### What supports the recommendation?

The system provides data values and citations.

---

## 13. Trust Goal

The project should prioritize trustworthy recommendations over impressive-looking outputs.

The system must:

* Ground environmental values in actual data.
* Ground agronomic recommendations in trusted sources.
* Clearly identify uncertainty.
* Avoid unsupported claims.
* Avoid fabricated citations.
* Avoid fabricated thresholds.
* Say when available evidence is insufficient.

If the system cannot confidently support a recommendation, it should communicate that limitation instead of guessing.

---

## 14. User Experience Goal

The user should be able to move from:

**Question → Analysis → Decision**

with minimal friction.

The interface should prioritize:

* Clear location input
* Crop selection
* Crop stage when relevant
* Natural-language agricultural question
* Visible analysis status
* Clear decision card
* Supporting evidence
* Map and useful visualizations
* Safe agent activity trace

The experience should feel like an agricultural decision assistant rather than a weather dashboard.

---

## 15. Technical Goals

The project should demonstrate:

* Practical use of FortyGuard
* Agentic tool orchestration
* Retrieval-Augmented Generation
* Multi-source environmental data fusion
* Grounded recommendations
* Explainable decision-making
* Clean frontend/backend separation
* Reliable API integration
* Hackathon-appropriate architecture

---

## 16. Non-Goals

The following are NOT initial goals of the MVP:

* Building a complete farm-management platform.
* Supporting every crop.
* Supporting every country.
* Building a full agricultural ERP.
* Replacing professional agronomists.
* Providing guaranteed agricultural outcomes.
* Building a complex multi-agent system without a clear need.
* Training or fine-tuning a custom LLM.
* Building a massive agricultural knowledge base.
* Implementing every FortyGuard endpoint.
* Building advanced satellite or street-view analysis unless required later.
* Creating unnecessary infrastructure or microservices.

---

## 17. Success Criteria

The MVP should be considered successful when a user can provide:

**Location + Crop + Goal**

and receive:

**A useful agricultural recommendation**

supported by:

* Relevant FortyGuard data
* Relevant environmental information
* Crop-specific agronomic evidence
* Clear explanation
* Citations
* A visible safe activity/tool trace

The final demo should make the following transformation obvious:

> **Hyperlocal Climate Data → Agricultural Intelligence → Actionable Decision**
