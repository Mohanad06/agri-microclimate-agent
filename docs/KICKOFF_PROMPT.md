# KICKOFF PROMPT

## Purpose

This document is the control prompt for any AI agent working on the
`Agri Microclimate Agent` project.

The agent must use this document together with the project documentation
and the actual repository state to determine what work is currently allowed.

---

# 1. Start Here

At the beginning of every new chat or development session, the agent MUST:

1. Inspect the repository.
2. Read `docs/PROJECT_STATE.md`.
3. Read `docs/RULES.md`.
4. Read `docs/GOALS.md`.
5. Read `docs/SPECIFICATIONS.md`.
6. Read `docs/DESIGN.md`.
7. Read `docs/FRONTEND_DESIGN.md`.
8. Read `docs/BACKEND_DESIGN.md`.
9. Read `docs/UI_UX_ARCHITECTURE.md`.
10. Inspect relevant existing files before making changes.

Do not assume that the documentation is more current than the repository.

The agent must compare the documented state with the actual repository state.

---

# 2. Determine Current State

Before performing implementation work, determine:

- Current phase.
- Current task.
- Completed work.
- Pending work.
- Blockers.
- Last approved phase.
- User approval status.
- Existing implementation that must be preserved.

The source of truth for project progress is:

```text
docs/PROJECT_STATE.md
