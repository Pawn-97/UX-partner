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

**★ v0.3 — Then fire `AskUserQuestion` with each project as an option** (SKILL.md § Question UI contract):

```
AskUserQuestion({
  question: "Resume 哪个项目？",
  options: [
    { label: "<project-name-A>", description: "<phase from state.md frontmatter>" },
    { label: "<project-name-B>", description: "<phase>" },
    ...
  ],
  allow_other: true
})
```

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

After the summary, **★ v0.3 — fire `AskUserQuestion`** (SKILL.md § Question UI contract):

```
AskUserQuestion({
  question: "接下来想做什么？",
  options: [
    { label: "💬 Continue discussion",   description: "继续 round-N 讨论（按 state.md 推荐下一步）" },
    { label: "📋 Read decisions.md",     description: "看完整决策列表" },
    { label: "📋 Read assumptions.md",   description: "看完整假设列表" },
    { label: "📋 Read questions.md",     description: "看 open / answered questions" },
    { label: "✍️ /ux-project:onepage",   description: "直接走收尾，生成 ux-onepage.md" },
    { label: "➕ /ux-project:add-context", description: "补背景再继续" }
  ],
  allow_other: true
})
```

Branch on the picker result. Only then read additional files.

## Failure modes

- If `state.md` is missing or malformed → tell the designer the project workspace looks broken and offer to re-run `/ux-project:start <name> <prd-path>`.
- If `state.md` references files that don't exist (e.g., decisions.md not yet created) → that's normal for a young project. Just note "decisions.md 还没创建" and move on.

## What NOT to do

- Don't read pm-source.md unless the designer specifically asks for the PRD contents.
- Don't run ctx_search on resume — pure restoration, no new analysis.
- Don't suggest next steps that aren't grounded in `Recommended Next Step` from state.md (avoid drift).
- Don't write to any file. This is read-only.
