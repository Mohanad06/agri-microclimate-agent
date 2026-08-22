# Frontend Design

## 1. Purpose

This document defines the frontend design direction for the `Agri Microclimate Agent`.

The frontend should present the product as an agricultural decision assistant rather than a traditional weather dashboard.

Its primary purpose is to help the user move from:

**Agricultural Question → Analysis → Decision → Evidence → Action**

---

## 2. Frontend Goals

The frontend should:

* Make the main agricultural workflow simple.
* Allow users to provide their location and crop information.
* Allow users to describe their agricultural goal.
* Clearly communicate that analysis is being performed.
* Display the final recommendation prominently.
* Explain why the recommendation was made.
* Show relevant environmental evidence.
* Show agronomic evidence and citations.
* Provide useful map and chart visualizations.
* Show a safe agent activity trace.
* Handle loading, errors, and insufficient evidence clearly.
* Work well on desktop and responsive layouts.

---

## 3. Frontend Technology Direction

The planned frontend stack is:

* React
* Vite
* Axios
* Tailwind CSS
* Leaflet / React-Leaflet
* Recharts

These technologies are the current direction, not immutable requirements.

They may be changed if there is a clear technical reason and the change is documented.

---

## 4. Application Structure

The frontend should conceptually contain:

```text id="x0t5ml"
Application
│
├── Input / Analysis View
│
├── Analysis State
│
└── Results View
    ├── Decision Card
    ├── Evidence
    ├── Map
    ├── Charts
    └── Agent Activity
```

The exact React component structure will be determined during implementation.

---

## 5. Main User Flow

The primary user journey should be:

```text id="p3byc1"
Open Application
↓
Enter Location
↓
Select Crop
↓
Select Crop Stage (if applicable)
↓
Enter Agricultural Question
↓
Click Analyze
↓
View Agent Activity
↓
View Decision
↓
Review Evidence
↓
Review Map / Charts
```

The workflow should remain short and understandable.

---

## 6. Input Area

The primary analysis interface should contain:

### Location

Example:

```text id="x4j0c8"
Fresno, CA
```

The user should not be required to manually enter latitude and longitude.

---

### Crop

The user selects a supported crop.

Example:

```text id="o0ypkq"
Tomato
```

Only crops actually supported by the MVP should appear.

---

### Crop Stage

If crop stage materially affects the decision, the interface should allow the user to select it.

Example:

```text id="rjj0t4"
Planting
Vegetative
Flowering
Fruiting
```

The exact values depend on the selected crop and approved agronomic knowledge.

---

### User Goal / Question

The user should be able to express the agricultural goal naturally.

Example:

```text id="8z9kqk"
Should I irrigate today?
```

Another example:

```text id="5y5k9b"
Is this field ready for planting?
```

The system should support natural-language questions rather than forcing the user into complicated forms.

---

## 7. Analyze Action

The primary action should be visually clear.

Example:

```text id="d7nqgc"
Analyze Conditions
```

When clicked, the application should:

1. Validate the input.
2. Send the request to the backend.
3. Display an analysis state.
4. Show safe activity updates.
5. Display the final result.

The frontend must not directly call FortyGuard.

---

## 8. Loading / Analysis State

Analysis may involve multiple external API calls and asynchronous FortyGuard processing.

Therefore, the frontend must provide a clear progress state.

Example:

```text id="6e7y0x"
Analyzing your field...

✓ Location resolved
✓ Heat conditions retrieved
● Retrieving environmental context
○ Retrieving agronomic evidence
○ Generating recommendation
```

The exact progress information should represent actual backend activity and must not be fabricated.

---

## 9. Decision Card

The decision should be the most prominent result on the page.

Conceptual structure:

```text id="k1qynf"
┌─────────────────────────────────┐
│        DECISION                 │
│                                 │
│     DELAY IRRIGATION            │
│                                 │
│  Heat exposure is elevated      │
│  and available moisture         │
│  indicators are low.            │
└─────────────────────────────────┘
```

The card should communicate:

* Decision
* Short summary
* Main reason
* Confidence/evidence status when appropriate
* Important limitations

The design must avoid implying certainty when evidence is incomplete.

---

## 10. Decision States

The interface should support clear decision states.

Potential states include:

* Irrigate
* Delay irrigation
* Plant now
* Delay planting
* Monitor
* High heat risk
* Low heat risk
* Insufficient evidence

The final set will depend on the approved MVP use cases.

---

## 11. Evidence Section

The evidence section should answer:

> Why did the system reach this decision?

It should display relevant verified values.

Example:

```text id="r3d04f"
Heat Exposure
6.5 hours above threshold

Heat Persistence
3.2 consecutive hours

Rainfall
Verified value

Soil Wetness Proxy
Verified value
```

Only data actually retrieved by the system should be displayed.

---

## 12. Agronomic Evidence

The interface should distinguish environmental data from agronomic knowledge.

Example:

```text id="zrrmps"
Agronomic Evidence

Tomato heat-stress guidance indicates
that prolonged exposure to elevated
temperatures can affect crop performance.

Source:
University Extension reference
```

Citations must link to or identify actual sources.

The frontend must never display fabricated references.

---

## 13. Source Presentation

Sources should be easy to identify.

The interface may group them into:

### Environmental Data

* FortyGuard
* NASA POWER
* Forecast provider, if used

### Agronomic Sources

* USDA
* University Extension
* Other approved sources

The final citation UI should remain readable and not overwhelm the user.

---

## 14. Map

The application should eventually provide a map showing the analyzed location and relevant spatial information.

The map may include:

* Selected location
* Relevant FortyGuard heat information
* Risk visualization
* Geographic context

Leaflet / React-Leaflet is the current technology direction.

The exact visualization depends on the data returned by the verified FortyGuard API.

The frontend must not invent spatial data.

---

## 15. Charts

Charts should be used only when they help the user understand the decision.

Potential charts include:

### Heat Exposure

```text id="h7j8gr"
Hours above threshold
```

### Heat Persistence

```text id="f4y8or"
Longest continuous period above threshold
```

### Rainfall

Historical or forecast rainfall when a verified source is available.

### Temperature

Relevant historical/current/forecast temperature information when supported.

Charts should prioritize decision-relevant information instead of displaying every available metric.

---

## 16. Agent Activity Trace

Because the project targets the Agentic track, the interface should expose a safe high-level activity trace.

Example:

```text id="f0j7h6"
Agent Activity

✓ Location resolved
✓ FortyGuard heat data retrieved
✓ Environmental data retrieved
✓ Agronomic evidence retrieved
✓ Conditions evaluated
✓ Recommendation generated
```

This trace demonstrates that the system is using tools.

It must NOT expose:

* Chain-of-thought
* Hidden reasoning
* Private prompts
* API keys
* Internal credentials

---

## 17. Error States

The frontend should provide clear user-facing errors.

Examples:

### Invalid Location

```text id="9g7a6s"
We couldn't find this location.
Please check the location and try again.
```

### External Data Failure

```text id="u6skc8"
Some environmental data could not be retrieved.
Please try again.
```

### Insufficient Evidence

```text id="0ndz0k"
There is not enough verified evidence
to make a reliable recommendation.
```

The UI should not expose raw backend stack traces.

---

## 18. Empty State

Before the first analysis, the interface should clearly communicate what the user needs to provide.

Example:

```text id="hr7h1v"
Analyze your field conditions

Enter a location, select your crop,
and tell us what you want to know.
```

The empty state should guide the user without adding unnecessary complexity.

---

## 19. Responsive Design

The application should support:

* Desktop
* Laptop
* Tablet
* Mobile-sized layouts

The primary decision should remain visible and readable on smaller screens.

Charts and maps should adapt to available screen space.

---

## 20. Visual Hierarchy

The visual hierarchy should prioritize:

1. Decision
2. Main explanation
3. Evidence
4. Recommended action
5. Map / charts
6. Detailed sources
7. Activity trace

The user should understand the recommendation without needing to inspect every chart.

---

## 21. User Trust

The frontend should visually distinguish:

### Data

What the system observed.

### Evidence

What trusted agricultural sources say.

### Recommendation

What the system suggests based on the available evidence.

This distinction is important for transparency.

---

## 22. Recommendation Language

The frontend should avoid presenting recommendations as guaranteed outcomes.

Prefer:

> Conditions suggest delaying irrigation.

Instead of:

> You must delay irrigation.

When evidence is incomplete, the UI should explicitly communicate uncertainty.

---

## 23. Accessibility

The frontend should aim for:

* Readable typography
* Sufficient contrast
* Clear labels
* Keyboard accessibility
* Meaningful button labels
* Non-color-only status indicators
* Clear error messages

Color should not be the only way to communicate risk or decision state.

---

## 24. Performance

The frontend should avoid unnecessary complexity.

Important considerations include:

* Loading states
* API latency
* Map rendering
* Chart rendering
* Large response handling
* Repeated requests

The UI should remain responsive while analysis is running.

---

## 25. Frontend / Backend Boundary

The frontend communicates only with the application backend.

Conceptually:

```text id="kq0v8m"
React Frontend
      ↓
Application API
      ↓
Agent / Backend
      ↓
External APIs
```

The frontend must not:

* Store FortyGuard secrets.
* Call protected FortyGuard endpoints directly.
* Implement agricultural decision logic independently.
* Duplicate backend data-processing logic.

---

## 26. MVP Frontend Scope

The initial frontend should focus on:

* One main analysis workflow.
* Location input.
* Crop selection.
* Optional crop stage.
* User question.
* Analysis action.
* Decision card.
* Evidence section.
* Basic map.
* Relevant charts.
* Safe agent activity trace.
* Error and loading states.

Advanced dashboard features should be deferred until the core workflow is working.

---

## 27. Deferred Frontend Features

Potential future features include:

* Multiple farm management.
* Saved analyses.
* Historical user reports.
* Advanced map layers.
* Notifications.
* Automated alerts.
* Farm portfolios.
* Advanced analytics.
* User accounts.

These are outside the initial MVP unless explicitly approved.

---

## 28. Frontend Design Principle

The frontend should make the following transformation visually obvious:

```text id="7b1q0j"
User Question
↓
What the Agent Checked
↓
What the Data Shows
↓
What the Agronomic Evidence Says
↓
What You Should Do
```

The final experience should feel like an intelligent agricultural decision assistant, not a weather visualization tool.

