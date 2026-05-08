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

Same as `/ux-project:onepage`. If multiple projects could match, list and ask.

### 2. Verify ux-onepage.md exists

Check `projects/<project-name>/ux-onepage.md`. If missing:

```
ux-onepage.md 还没生成。先跑 /ux-project:onepage 再 /ux-project:handoff。
```

…and stop.

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

- ux-onepage.md missing → stop, suggest /ux-project:onepage first.
- ux-onepage.md has unresolved cite-check or outdated warnings (`⚠️` markers) → flag them in the brief output, ask designer if they want to continue. Don't silently propagate them.
- Template not found → fall back to inline structure (see template content); warn that the plugin install may be incomplete.

## What NOT to do

- Don't expand the brief beyond ~50 lines. Brevity is the point.
- Don't include UI specifics (button text, layout, colors). The brief constrains direction, not pixels.
- Don't drop the `[ref: ...]` citations from constraints — downstream skills may need them.
- Don't auto-trigger any downstream skill. The designer chooses when and which.
- Don't update any other project file beyond design-brief.md and state.md.
