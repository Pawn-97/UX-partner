---
project: <project-name>
prd_source: ./pm-source.md
created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
phase: intake
auto_propose: true
auto_propose_mode: batched
---

<!--
phase enum: intake | analysis | discussion | closure-check | onepage-generated | handoff-ready

★ v0.2 SIZE CAP: state.md body ≤ 30 lines / < 1k tokens (excluding frontmatter and HTML comments).
On overflow, the skill demotes the oldest Memory Index entries (entries stay in memory/<file>.md;
only the state.md index pointer drops). The "# Recommended Next Step" section is NEVER demoted.

This file is the resume gateway. Update on every meaningful state change.
Other project files (decisions/assumptions/questions/memory/*) are read on demand only.

★ v0.2 auto-propose config:
- auto_propose: true (default) | false → controls whether the skill auto-proposes memory entries from conversation
- auto_propose_mode: batched (default, every 5 rounds) | per-utterance (high noise, not recommended)
-->

# Current Understanding

<one paragraph, < 150 chars: what is this project trying to do for whom>

# Confirmed Decisions (top 3-5)

<!-- - D1: Primary user is the admin, not the end user. → see decisions.md -->

# Active Assumptions (top 3)

<!-- - A1: Activation is needed during urgent operational situations (not routine). → see assumptions.md -->

# Open Questions (blocking only)

<!-- - Q1: Should activation require a confirmation step? (owner: PM, blocking: yes) → see questions.md -->

# Memory Index (top 3 ids per file)

<!--
★ v0.2 — Pointer-only index into memory/*.md. Do NOT inline content here — keep state.md small.
Only list ids; full content lives in the memory file. Update when /ux-project:add-context writes new entries.

- Stakeholders:  m-stk-001 / m-stk-002 / m-stk-003 → see memory/stakeholders.md
- Constraints:   m-cst-001 / m-cst-002 → see memory/constraints.md
- Terminology:   m-trm-001 → see memory/terminology.md
- History:       m-hst-001 → see memory/history.md
- Preferences:   m-prf-001 → see memory/preferences.md
-->

# Recommended Next Step

<one sentence: what should the designer or AI do next>
