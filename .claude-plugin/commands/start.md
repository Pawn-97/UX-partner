---
description: Initialize a UX discovery project from a PRD path. Creates projects/<name>/ workspace, copies PRD with version frontmatter, runs initial KB analysis, and proposes 3–5 first discussion questions.
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
- Curated KB: `**/ux-kb-curated/glossary.md` and `**/ux-kb-curated/design-principles.md`

Read both curated KB files now — they're your anchor knowledge for this session.

### 3. Create workspace + PRD copy

```
mkdir -p projects/<project-name>/
```

Read the source PRD. Then write `projects/<project-name>/pm-source.md`:

- Use `pm-source.template.md` as the frontmatter shape.
- Set `project: <project-name>`, `prd_version: v1`, `valid_from: <today YYYY-MM-DD>`, `valid_to: null`, `superseded_by: null`.
- Append the source PRD body verbatim under the frontmatter.

### 4. Initialize state.md

Write `projects/<project-name>/state.md` from `state.template.md`:
- `project: <project-name>`
- `prd_source: ./pm-source.md`
- `created: <today>`, `last_updated: <today>`
- `phase: intake`
- Leave the body sections empty for now (you'll fill `Current Understanding` in step 7).

### 5. Run initial KB analysis (ctx_search)

Extract 3–5 top keywords from the PRD title + first headings. Run `ctx_search` queries against the indexed KB. Capture only the top 5 chunks per query — never bulk-load files.

Use the source-quality prefix tags in the chunks (`[PRODUCT-DOC]`, `[TEMPLATE]`, etc.) to weight relevance.

### 6. Produce the requirement analysis (in chat)

Output this structure to the designer:

```markdown
# Requirement Analysis: <project-name>

## PM original ask
<1–2 sentences, faithful to the PRD; no extrapolation>

## Possible underlying user problem
<reframed in user's language; clearly tag this as inference, not fact>

## Possible solution bias
<what assumption did the PRD jump to? what alternative framings exist?>

## Relevant KB knowledge
- <fact 1> [ref: <kb path>] (confidence: <high/medium/low>)
- <fact 2> [ref: <kb path>] (confidence: ...)

## Affected user roles (initial guess)
- Primary: ...
- Secondary: ...
- Impacted: ...

## Initial JTBD hypotheses
- Primary: When... I want to... so I can...
- (only if the PRD strongly suggests it)

## Key ambiguities
- <thing 1>
- <thing 2>

## Risks / dependencies
- <risk 1>
- <dependency 1>

## Suggested first discussion questions (3–5)

1. **<question>** — Why this matters: <one line>
2. **<question>** — Why this matters: <one line>
3. **<question>** — Why this matters: <one line>
```

### 7. Update state.md

Edit `projects/<project-name>/state.md`:
- Fill `Current Understanding` with a < 150-character summary of the PM ask + reframed user problem
- Add `Recommended Next Step`: "Discuss the 3–5 questions above with the designer"

### 8. Closing message

Show:

> 项目 **<project-name>** 已初始化。
>
> 文件位置：`projects/<project-name>/`
> - `pm-source.md` (PRD v1, valid_from <today>)
> - `state.md` (phase: intake)
>
> 下一步：直接回答上面的 3–5 个问题开始讨论；或 `/ux-project:resume <project-name>` 随时查看状态。

## Failure modes

- If PRD path doesn't exist → stop, ask for correction.
- If PRD is empty or 1 line → stop, suggest the designer paste the actual PRD content.
- If `projects/` directory can't be created → check working directory, surface the path issue.
- If `ctx_search` returns nothing useful → continue without KB facts; flag in chat as "KB 未命中相关条目，本次分析仅靠 PRD 内容"。

## What NOT to do

- Don't generate UI ideas, layout suggestions, or flow diagrams. This is discovery only.
- Don't write to `decisions.md` / `assumptions.md` / `questions.md` yet — those are lazy-created when the designer answers and approves.
- Don't ask 10+ questions. Cap at 5. Pick the highest-leverage ones.
- Don't extrapolate "what PM probably meant" without flagging it as inference.
