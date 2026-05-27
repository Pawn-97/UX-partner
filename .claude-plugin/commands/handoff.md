---
description: Generate design-brief.md for a project — short, KB-grounded handoff package optimized for downstream design skills (huashu-design, frontend-design, Figma).
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

You are running the `/ux-project:handoff` command. Activate the `ux-discovery` skill's principles.

## Arguments

`$ARGUMENTS` — optional `<project-name>`. If omitted, ask the designer which project to hand off.

## Steps

### 1. Identify the project

If `<project-name>` provided, verify `projects/<project-name>/` exists. If multiple projects could match (omitted arg or ambiguous reference), list them via `AskUserQuestion` and let designer pick.

### 2. Verify phase 3 is confirmed (rule 25)

Read `projects/<project-name>/state.md` frontmatter:
- `phase_3_confirmed_at` MUST be set (not `null`) — phase 3 confirm gate must have passed (cite-check + draft→ref promote complete)

If `phase_3_confirmed_at` is null:
```
Phase 3 还没收尾，handoff 需要建立在 confirmed onepage 上。先跑 /ux-project:refine <project-name> 走完 phase 3 确认 gate 再回来。
```
…and stop.

Also verify `projects/<project-name>/ux-onepage.md` body has NO remaining `[^d` or `[^a` markers (those should have been promoted at phase 3 confirm). If any found, instruct designer to re-run `/ux-project:refine` phase 3 confirm gate.

### 3. Read source material

- `projects/<project-name>/ux-onepage.md` (full)
- `projects/<project-name>/state.md` (for current phase / last update)

### 4. Locate template

Use Glob: `**/.claude-plugin/templates/design-brief.template.md`. Read it.

### 5. Synthesize the brief

The brief must be **short** — total file < 50 lines, with the meat in 8–15 lines. Optimize for **downstream skill consumption**, not human reading.

Pull from ux-onepage.md:

- **In one sentence**: Combine sections 1 (Final Goal) + 4 (Target Users) + 6 (JTBD) into one sentence: `<who> needs to <do what> in <which context>, so that <why>.`
- **Primary user**: section 4 Primary, plus key motivation
- **Primary JTBD**: section 6 Primary
- **Must-cover scenarios**: top 3–5 from section 7
- **Hard constraints**: top 3–5 from section 8 (with source ref)
- **States to consider**: lift the standard list — default / empty / loading / success / error / permission-restricted / edge — and remove any that don't apply
- **Don't design yet**: from section 12 (Design Direction Hypothesis) — list 2–4 things downstream should NOT explore yet, with reason
- **Suggested first design exploration prompt**: write a single prompt block (3–8 lines) the designer can paste into `huashu-design`, `frontend-design`, or Figma skill. Format like: "Build a [type] for [user] doing [JTBD]. Cover [scenarios]. Respect [constraints]. Don't include [non-goals]."

### 6. Preserve refs from onepage

Constraints and JTBD lifted from ux-onepage should keep their `[ref: ...]` citations. The downstream skill might want to verify or expand.

### 7. Write design-brief.md

Write `projects/<project-name>/design-brief.md` using the template. Keep it tight.

### 8. Update state.md

Edit `projects/<project-name>/state.md`:
- `phase: handoff-ready`
- `last_updated: <today>`

### 9. Closing message

```
✅ design-brief.md generated: projects/<project-name>/design-brief.md

Length: <N> lines
First exploration prompt ready for: huashu-design / frontend-design / Figma

复制 "Suggested first design exploration prompt" 块，进入下游 skill 启动设计探索。
```

## Failure modes

- phase_3_confirmed_at == null → stop, suggest `/ux-project:refine <name>` to walk phase 3 confirm gate first. ux-onepage.md always exists from `/ux-project:start` (stub), so the check moved to phase confirmation status.
- ux-onepage.md has unresolved cite-check or outdated warnings (`⚠️` markers) → flag them; **confirm via `AskUserQuestion`** (SKILL.md § Question UI contract): `options: [✅ Continue / ❌ Stop / ✏️ Fix-first]`, `allow_other: true`. Don't silently propagate.
- Template not found → fall back to inline structure (see template content); warn that the plugin install may be incomplete.

## What NOT to do

- Don't expand the brief beyond ~50 lines. Brevity is the point.
- Don't include UI specifics (button text, layout, colors). The brief constrains direction, not pixels.
- Don't drop the `[ref: ...]` citations from constraints — downstream skills may need them.
- Don't auto-trigger any downstream skill. The designer chooses when and which.
- Don't update any other project file beyond design-brief.md and state.md.
