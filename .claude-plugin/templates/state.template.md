---
project: <project-name>
prd_source: ./pm-source.md
created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
phase: intake
phase_1_confirmed_at: null
phase_2_confirmed_at: null
phase_3_confirmed_at: null
auto_propose: true
auto_propose_mode: batched
change_type: unknown
---

<!--
phase enum ★ v0.4: intake | phase_1_expand | phase_2_converge | phase_3_ship | ready_for_onepage | onepage-generated | handoff-ready
  (legacy v0.2 values "analysis | discussion | closure-check" map to phase_1_expand / phase_2_converge / phase_3_ship)

★ v0.4 phase gate state contract:
- phase advances only when designer Approves the gate AskUserQuestion (SKILL.md rule 18)
- phase_N_confirmed_at is set on Approve and never silently cleared
- /ux-project:resume <name> reads `phase` and `phase_N_confirmed_at` to pick up at the right place
- Regression (designer goes back to earlier phase): set phase backward, append a decisions.md entry as audit trail; preserve confirmed-at timestamps

★ v0.2 SIZE CAP: state.md body ≤ 30 lines / < 1k tokens (excluding frontmatter and HTML comments).
On overflow, the skill demotes the oldest Memory Index entries (entries stay in memory/<file>.md;
only the state.md index pointer drops). The "# Recommended Next Step" section is NEVER demoted.

This file is the resume gateway. Update on every meaningful state change.
Other project files (decisions/assumptions/questions/memory/*) are read on demand only.

★ v0.2 auto-propose config:
- auto_propose: true (default) | false → controls whether the skill auto-proposes memory entries from conversation
- auto_propose_mode: batched (default, every 5 rounds) | per-utterance (high noise, not recommended)

★ v0.4.3 change_type ★:
- new_feature: 全新功能，没有已有流程要保留 → IA / 流程不需要区分新旧
- iteration:   在已有功能基础上的增量改动 → IA / 流程必须标 "★ NEW / (改造) / (已有)"
- refactor:    重组已有流程，无新用户可见行为 → 同 iteration，标记侧重 (改造) 和 (已有)
- unknown:     默认初值，Phase 1 baseline 收集后必须由设计师确认（不能跨过 Phase 1 gate 仍 unknown）
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
- Baseline:      m-bsl-001 / m-bsl-002 → see memory/baseline.md   ★ v0.4
-->

# Recommended Next Step

<one sentence: what should the designer or AI do next>
