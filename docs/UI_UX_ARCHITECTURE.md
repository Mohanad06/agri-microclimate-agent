# UI/UX Architecture

## 1. Purpose

This document defines the user experience architecture for the `Agri Microclimate Agent`.

The goal is to make the product feel like an **AI agricultural decision assistant**, not a traditional weather dashboard.

The interface should guide the user from:

```text
Agricultural Goal
↓
Data Collection
↓
Agent Activity
↓
Environmental Findings
↓
Agronomic Evidence
↓
Decision
↓
Recommended Action
```

---

## 2. Core UX Principle

The product should answer three questions clearly:

```text
What is happening?
↓
Why does it matter?
↓
What should I do?
```

The user should not need to interpret raw environmental data to understand the final recommendation.

---

## 3. Primary User Journey

The primary UX flow is:

```text
Landing / Analysis Screen
↓
Enter Location
↓
Select Crop
↓
Select Crop Stage
↓
Ask Agricultural Question
↓
Start Analysis
↓
Agent Analysis State
↓
Decision
↓
Evidence
↓
Recommended Action
↓
Supporting Data
```

---

## 4. Main Screen Architecture

The main application experience should conceptually contain:

```text
┌──────────────────────────────────────────────┐
│ Header / Product Identity                   │
├──────────────────────────────────────────────┤
│                                              │
│ Ask About Your Field                        │
│                                              │
│ Location                                     │
│ Crop                                         │
│ Crop Stage                                   │
│ Agricultural Question                        │
│                                              │
│              [ Analyze ]                     │
│                                              │
├──────────────────────────────────────────────┤
│ Analysis / Decision Results                 │
│                                              │
│ Decision                                     │
│ Explanation                                  │
│ Evidence                                     │
│ Map                                          │
│ Charts                                       │
│ Sources                                      │
│ Agent Activity                               │
└──────────────────────────────────────────────┘
```

The exact visual layout will be refined during frontend implementation.

---

## 5. Input Experience

The input experience should be simple enough that a user with no technical background can use it.

Required concepts:

### Location

Example:

```text
Fresno, CA
```

### Crop

Example:

```text
Tomato
```

### Crop Stage

Example:

```text
Flowering
```

### Question

Example:

```text
Should I irrigate today?
```

The user should not need to understand APIs, environmental parameters, or agricultural terminology to start an analysis.

---

## 6. Location UX

The user is not required to manually enter coordinates (Latitude/Longitude).

Instead, the primary user experience flow for selecting a location is:
1. The frontend presents an interactive map.
2. The user navigates to their farm area and places a pin on the exact location of their farm field.
3. The system captures the precise coordinates (latitude and longitude) of the pin.

To aid navigation, the map provides an optional search box (e.g., "Search location: Fresno, CA"):
* The user inputs a general place name or city.
* The map navigates/pans to that general region using a place-name search service.
* **Important**: The city centroid coordinates from the search result are for navigation only and must never automatically become the final farm coordinates.
* The final farm coordinates are always the exact coordinates of the pin placed by the farmer. This is critical because FortyGuard retrieves hyperlocal microclimate temperature layers.


---

## 7. Crop Selection UX

Only currently supported crops should be presented.

The UI should avoid presenting crops that the backend cannot reliably analyze.

If the project initially supports only one or two crops, the interface should keep the selection intentionally small.

---

## 8. Crop Stage UX

Crop stage should be optional when the selected analysis does not require it.

When crop stage materially affects the agronomic recommendation, the UI should encourage the user to provide it.

The available stages should be based on verified agronomic knowledge.

---

## 9. Natural Language Question

The user should be able to ask questions naturally.

Examples:

```text
Should I irrigate today?
```

```text
Is this field ready for planting?
```

```text
Is the current heat dangerous for my tomatoes?
```

The system should interpret the user's goal instead of forcing the user to select from a large list of predefined questions.

---

## 10. Analysis Transition

When the user clicks Analyze, the interface should transition from:

```text
Input Mode
```

to:

```text
Analysis Mode
```

The user should immediately receive feedback that the request is being processed.

---

## 11. Analysis State

The analysis state should communicate progress without exposing internal chain-of-thought.

Example:

```text
Analyzing your field...

✓ Location resolved
✓ Hyperlocal heat data retrieved
● Checking environmental conditions
○ Retrieving agronomic evidence
○ Preparing recommendation
```

Only actual backend/tool activity should be displayed.

The UI must never fabricate progress steps.

---

## 12. Agent Activity

The Agentic nature of the project should be visible.

A dedicated section may show:

```text
Agent Activity

✓ Location resolved
✓ FortyGuard analysis completed
✓ Environmental context retrieved
✓ Agronomic evidence retrieved
✓ Conditions evaluated
✓ Recommendation prepared
```

This demonstrates tool usage to both users and hackathon judges.

---

## 13. Safe Reasoning Presentation

The system should communicate **what actions the agent performed**, not its private reasoning.

Allowed:

```text
Retrieved hyperlocal heat exposure data.
Retrieved crop-specific agronomic evidence.
Compared site conditions against verified guidance.
```

Not allowed:

```text
Private chain-of-thought
Internal hidden reasoning
Private prompts
Model deliberation
```

---

## 14. Decision Presentation

The decision should be the strongest visual element after analysis.

Example:

```text
⚠️ DELAY IRRIGATION

Conditions indicate elevated heat exposure
and limited available moisture indicators.
```

The decision should be immediately understandable.

---

## 15. Decision Hierarchy

The results should follow:

```text
Decision
↓
One-sentence explanation
↓
Key evidence
↓
Recommended action
↓
Detailed supporting information
```

This prevents the user from having to read large amounts of data before understanding the result.

---

## 16. Recommendation Section

The recommendation should answer:

> What should I do now?

Example:

```text
Recommended Action

Delay irrigation for now and monitor
conditions closely.

Reason:
Heat exposure is elevated while available
moisture indicators remain limited.
```

Recommendations must remain grounded in available evidence.

---

## 17. Evidence Architecture

Evidence should be grouped into understandable categories.

### Environmental Evidence

Examples:

```text
Heat Exposure
6.5 hours above threshold

Heat Persistence
3.2 consecutive hours

Rainfall
Verified value

Humidity
Verified value
```

### Agronomic Evidence

Example:

```text
Tomato guidance indicates that prolonged
high-temperature exposure can increase
heat stress risk.

Source:
Verified agricultural reference
```

---

## 18. Evidence Priority

Not every retrieved metric needs to be shown.

The UI should prioritize evidence that directly influenced the recommendation.

Example:

If irrigation is the decision, prioritize:

```text
Heat conditions
Rainfall
Moisture indicators
Relevant crop threshold
```

Avoid overwhelming the user with unrelated metrics.

---

## 19. Map Experience

The map should provide geographic context.

It may display:

* User location.
* Relevant heat information.
* Risk area.
* Spatial context.

The map should support the decision rather than become the primary purpose of the application.

The product must not turn into a generic map dashboard.

---

## 20. Chart Experience

Charts should answer meaningful questions.

Examples:

### Heat Exposure

> How long has the site exceeded the selected threshold?

### Persistence

> How long was the longest continuous exposure?

### Rainfall

> Has meaningful rainfall occurred or is forecast?

### Temperature

> How are relevant temperatures changing?

Charts should be visually simple and readable.

---

## 21. Sources and Citations

The user should be able to identify where the information came from.

Sources should be presented clearly.

Conceptually:

```text
Environmental Sources
• FortyGuard
• NASA POWER

Agronomic Sources
• USDA
• University Extension
• Other approved sources
```

The actual sources must correspond to retrieved data and documents.

---

## 22. Trust UX

The interface should visually distinguish:

```text
OBSERVED DATA
```

from:

```text
AGRONOMIC EVIDENCE
```

and:

```text
AI RECOMMENDATION
```

This separation helps users understand that the recommendation is derived from data and evidence rather than being an unsupported AI opinion.

---

## 23. Confidence and Uncertainty

The system should not present false certainty.

If the available evidence is incomplete, the UI should communicate that.

Example:

```text
Limited evidence

Some required environmental data was unavailable,
so a reliable recommendation cannot be made.
```

Avoid displaying an arbitrary numerical confidence score unless there is a validated methodology behind it.

---

## 24. Error UX

Errors should be understandable and actionable.

### Location Error

```text
We couldn't find this location.
Please check the location and try again.
```

### Data Error

```text
Some environmental data is temporarily unavailable.
Please try again.
```

### Insufficient Evidence

```text
There isn't enough verified evidence
to make a reliable recommendation.
```

### System Error

```text
Something went wrong while analyzing the field.
Please try again.
```

Avoid technical stack traces in the user interface.

---

## 25. Empty State

Before analysis, the interface should explain the product value.

Example:

```text
Understand your field.
Make better timing decisions.

Enter a location, choose a crop,
and ask what you want to know.
```

The empty state should be concise.

---

## 26. Loading UX

The interface should never appear frozen during API processing.

Loading states should include:

* Visible progress.
* Disabled duplicate submission.
* Clear current activity.
* Ability to retry if the operation fails.

The exact progress behavior depends on the backend implementation.

---

## 27. Responsive UX

The experience should work across:

* Desktop
* Laptop
* Tablet
* Mobile

On smaller screens:

```text
Decision
↓
Recommendation
↓
Evidence
↓
Charts
↓
Map
↓
Sources
```

should remain easy to scan.

---

## 28. Accessibility

The interface should aim to provide:

* Clear labels.
* Keyboard navigation.
* Readable typography.
* Sufficient contrast.
* Visible focus states.
* Descriptive buttons.
* Accessible form controls.
* Error messages associated with their fields.

Risk states should not rely only on color.

---

## 29. Visual Language

The visual design should communicate:

* Agriculture
* Intelligence
* Trust
* Data
* Environmental awareness

The design should remain professional and modern.

Avoid making the interface look like:

* A generic weather application.
* A generic AI chatbot.
* A complex enterprise analytics dashboard.

---

## 30. Information Density

The UI should prioritize important information.

The user should see:

```text
What should I do?
```

before:

```text
All available environmental metrics.
```

Detailed information should remain available without dominating the primary experience.

---

## 31. Mobile Priority

On mobile-sized screens, the primary decision should remain immediately accessible.

The layout should avoid requiring excessive scrolling before the user can understand the recommendation.

---

## 32. User Flow for Irrigation

Example:

```text
User enters:
Location → Fresno, CA
Crop → Tomato
Stage → Flowering
Question → Should I irrigate today?

↓
Analyze

↓
Agent Activity

✓ Location resolved
✓ FortyGuard data retrieved
✓ Environmental data retrieved
✓ Agronomic evidence retrieved

↓

Decision

DELAY IRRIGATION

↓

Why?

Heat exposure is elevated.
Available moisture indicators are limited.
Rainfall evidence does not support immediate relief.

↓

Evidence

Heat exposure
Persistence
Rainfall
Moisture indicator
Agronomic guidance

↓

Recommended Action

Monitor conditions and reassess according
to the available evidence.
```

The actual recommendation and values must always come from verified data.

---

## 33. User Flow for Planting

Example:

```text
User enters:
Location → California location
Crop → Supported crop
Stage → Planting
Question → Is it safe to plant now?

↓
Analyze

↓
Agent retrieves required evidence

↓

Decision

DELAY PLANTING

↓

Why?

Current conditions are outside the
verified suitable range for the crop.

↓

Evidence

Environmental measurements
+
Agronomic threshold/source

↓

Recommended Action

Wait and reassess when conditions
return to the supported range.
```

The exact thresholds must come from verified agronomic sources.

---

## 34. Hackathon Demo UX

The demo should make the following sequence visually obvious:

```text
USER QUESTION
↓
AGENT SELECTS TOOLS
↓
FORTYGUARD DATA
↓
SUPPLEMENTARY DATA
↓
RAG EVIDENCE
↓
DATA FUSION
↓
DECISION
↓
EVIDENCE
↓
ACTION
```

The most important demo moment should be:

```text
Recommendation
+
Exact evidence that supports it
```

---

## 35. Judge-Facing Clarity

A judge unfamiliar with the project should understand within seconds:

1. What the user asked.
2. What the agent checked.
3. What data was retrieved.
4. What evidence was used.
5. What decision was produced.
6. Why that decision was made.

The UI should make the Agentic workflow visible without requiring technical explanation.

---

## 36. UX Anti-Patterns

Avoid:

* Raw API response dumps.
* Excessive charts.
* Excessive technical terminology.
* Long AI-generated paragraphs.
* Generic chatbot interfaces.
* Unsupported confidence scores.
* Fake citations.
* Fake tool activity.
* Hidden recommendation logic.
* Color-only risk indicators.
* Unnecessary configuration screens.

---

## 37. MVP UX Scope

The MVP should contain:

```text
Input
↓
Analysis
↓
Agent Activity
↓
Decision
↓
Evidence
↓
Recommendation
↓
Map
↓
Relevant Charts
↓
Sources
```

This is sufficient to demonstrate the core product concept.

---

## 38. Deferred UX Features

The following are intentionally deferred:

* User accounts.
* Saved farms.
* Notifications.
* Automated alerts.
* Multi-farm dashboards.
* Advanced analytics.
* Historical reports.
* Farm portfolio management.
* Social features.
* Complex settings.

These should only be added if the core MVP is complete and there is enough time.

---

## 39. UX Design Principle

The final UX should make this transformation obvious:

```text
Raw Environmental Data
        +
Agronomic Knowledge
        +
Agentic Tool Use
        ↓
Agricultural Decision
        ↓
Actionable Recommendation
```

The interface succeeds if a farmer can understand the recommendation and its supporting evidence without needing to understand the underlying technology.

