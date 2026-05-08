---
description: Restore a UX discovery project's context across sessions. Reads only state.md (gateway file) by default; other project files loaded on demand.
argument-hint: <project-name>
allowed-tools: Bash, Read, Glob, Grep
---

You are running the `/ux-project:resume` command. Activate the `ux-discovery` skill's principles.

## Arguments

`$ARGUMENTS` — should be a single token: the `<project-name>`.

If missing, list available projects:

```bash
ls -d projects/*/ 2>/dev/null
```

…and ask the designer which one to resume.

## Steps

### 1. Locate the project

- Check `projects/<project-name>/state.md` exists. If not, surface the path and ask whether they meant a different name (offer to list projects).

### 2. Read state.md ONLY

This is the gateway. **Do not** read decisions.md / assumptions.md / questions.md / pm-source.md unless the designer asks. The point is fast resume with minimal token cost.

### 3. Print resume summary

Output exactly this structure:

```markdown
# Project Resumed: <project-name>

**Phase:** <current phase>  •  **Last updated:** <date>  •  **PRD:** v<version>, valid_from <date>

## Current Understanding
<from state.md "Current Understanding" section, verbatim>

## Confirmed Decisions (top 3-5 from state.md)
- D1: ... → see decisions.md
- D2: ...

## Active Assumptions (top 3 from state.md)
- A1: ...

## Open Questions (blocking only)
- Q1: ... (owner: ...)

## Recommended Next Step
<from state.md>
```

### 4. Suggest the next move

After the summary, ask:

> 想继续讨论 / 看完整 [decisions / assumptions / questions] / 直接 `/ux-project:onepage` 收尾？

Wait for the designer's choice. Only then read additional files.

## Failure modes

- If `state.md` is missing or malformed → tell the designer the project workspace looks broken and offer to re-run `/ux-project:start <name> <prd-path>`.
- If `state.md` references files that don't exist (e.g., decisions.md not yet created) → that's normal for a young project. Just note "decisions.md 还没创建" and move on.

## What NOT to do

- Don't read pm-source.md unless the designer specifically asks for the PRD contents.
- Don't run ctx_search on resume — pure restoration, no new analysis.
- Don't suggest next steps that aren't grounded in `Recommended Next Step` from state.md (avoid drift).
- Don't write to any file. This is read-only.
