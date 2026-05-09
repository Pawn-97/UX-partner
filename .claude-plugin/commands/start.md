---
description: Initialize a UX discovery project from a PRD path. Creates projects/<name>/ workspace, copies PRD with version frontmatter, runs initial KB analysis, outputs a < 200-char structured task summary, and waits for designer confirm before writing state.md.
argument-hint: <project-name> <prd-file-path>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

You are running the `/ux-project:start` command. Activate the `ux-discovery` skill's principles (find SKILL.md via Glob `**/.claude-plugin/skills/ux-discovery/SKILL.md` if not already active).

## Arguments

`$ARGUMENTS`

Parse into: `<project-name>` (single token, kebab-case) and `<prd-file-path>` (absolute or relative path to a markdown PRD).

If arguments are missing or malformed, ask the designer to provide them in this exact form: `/ux-project:start <name> <path>`.

## Steps

### 1. Validate inputs

- Check the PRD path exists and is `.md`. If not markdown, **stop** and tell the designer to convert first (Phase 0 default: markdown only).
- Check `projects/<project-name>/` does NOT already exist. If it does, ask: "项目 `<name>` 已存在。要 `/ux-project:resume <name>` 接着用，还是用别的名字开新项目？"

### 2. Locate plugin templates and curated KB

Use Glob:
- Templates: `**/.claude-plugin/templates/*.template.md`
- Curated KB: `**/ux-kb-curated/glossary.md`, `**/ux-kb-curated/design-principles.md`, `**/ux-kb-curated/designer-preferences.md`

Read all three curated KB files now — they're your anchor knowledge for this session. For `designer-preferences.md`, load the **Always-on** section into context; the **On-demand** section stays unread until a keyword triggers it.

### 3. Create workspace + PRD copy

```
mkdir -p projects/<project-name>/
```

Read the source PRD. Then write `projects/<project-name>/pm-source.md`:

- Use `pm-source.template.md` as the frontmatter shape.
- Set `project: <project-name>`, `prd_version: v1`, `valid_from: <today YYYY-MM-DD>`, `valid_to: null`, `superseded_by: null`.
- Append the source PRD body verbatim under the frontmatter.

### 4. Initialize state.md (skeleton only)

Write `projects/<project-name>/state.md` from `state.template.md`:
- `project: <project-name>`
- `prd_source: ./pm-source.md`
- `created: <today>`, `last_updated: <today>`
- `phase: intake`
- `auto_propose: true`, `auto_propose_mode: batched`
- Leave `Current Understanding` empty for now (will fill in step 8 after designer confirms the summary).
- Leave `Memory Index` empty (no memory entries yet).

### 5. Run initial KB analysis (ctx_search)

Extract 3–5 top keywords from the PRD title + first headings. Run `ctx_search` queries against the indexed KB. Capture only the top 5 chunks per query — never bulk-load files.

Use the source-quality prefix tags (`[PRODUCT-DOC]`, `[TEMPLATE]`, etc.) to weight relevance.

### 6. ★ v0.2 — Output structured task summary (< 200 chars) + 3–5 questions

Output this structure to the designer **exactly**:

```markdown
## 我对这个任务的初步理解（< 200 字）

- **核心问题**：<one line — what user problem is this trying to solve>
- **目标用户**：<one line — primary user role>
- **PM 给的 ask**：<one line — verbatim or near-verbatim from PRD, no extrapolation>
- **可能的 solution bias**：<one line — what assumption did PRD jump to; what alternative framings exist>
- **关键模糊点**：<one line — biggest unclear thing>

## Relevant KB context (top 5 chunks, optional reading)

- <chunk title> [ref: <kb-path>] (confidence: <h/m/l>)
- ...

## 我理解对吗？

请 confirm / 修订 / 重提。confirm 后我会把这段写入 `state.md#Current Understanding`。

## 接下来想问你的 3-5 个问题

1. **<question>** — Why this matters: <one line>
2. **<question>** — Why this matters: <one line>
3. **<question>** — Why this matters: <one line>
```

**Strictly enforce the < 200-char cap on the 5 bullet lines combined.** If you cannot fit, drop "可能的 solution bias" first (it's the easiest to discuss in round 1 instead).

### 7. ★ v0.2 — Wait for designer confirm/edit/reject

**Do NOT write to state.md yet.** Stop here and wait for the designer's response. Possible responses:

- **confirm / yes / 对 / 没问题** → proceed to step 8 with the summary as-is
- **edit / 修订 / 改一下** → designer rewrites one or more bullets; re-output the corrected summary, ask "再 confirm 一次？"
- **reject / 不对 / 重提** → ask 1–2 clarifying questions, then re-do step 6 from updated understanding

Loop until designer explicitly confirms.

### 8. Update state.md after confirm

Edit `projects/<project-name>/state.md`:
- Fill `# Current Understanding` with the confirmed 5-bullet summary collapsed to ≤ 150-char prose paragraph.
- Set `# Recommended Next Step`: "Discuss the 3–5 questions above with the designer."
- Verify body is ≤ 30 lines (will be on first write — empty memory index).

### 9. Closing message

```
项目 **<project-name>** 已初始化。

文件位置：`projects/<project-name>/`
- pm-source.md (PRD v1, valid_from <today>)
- state.md (phase: intake, auto_propose: true/batched)

下一步：直接回答上面的 3–5 个问题开始讨论；或 `/ux-project:resume <project-name>` 随时查看状态；或 `/ux-project:add-context <text|path>` 补充背景。
```

## Failure modes

- PRD path doesn't exist → stop, ask for correction.
- PRD is empty or 1 line → stop, suggest the designer paste actual PRD content.
- `projects/` directory can't be created → check working directory, surface path issue.
- `ctx_search` returns nothing useful → continue without KB facts; flag in chat as "KB 未命中相关条目，本次分析仅靠 PRD 内容"。
- Designer keeps rejecting summary → after 3 rejections, switch to a longer back-and-forth: ask designer for THEIR phrasing of the 5 fields and write that.

## What NOT to do

- Don't generate UI ideas, layout suggestions, or flow diagrams. This is discovery only.
- Don't write to `decisions.md` / `assumptions.md` / `questions.md` / `memory/*` yet — those are lazy-created when designer answers and approves.
- Don't write `state.md#Current Understanding` until designer confirms the structured summary.
- Don't ask 10+ questions. Cap at 5. Pick the highest-leverage ones.
- Don't extrapolate "what PM probably meant" without flagging it as inference.
- Don't exceed 200 chars on the 5 summary bullets. The cap is a forcing function for clarity.
