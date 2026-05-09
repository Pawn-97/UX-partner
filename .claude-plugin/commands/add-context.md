---
description: Append context to current project — classify input and propose memory writes (stakeholder / constraint / terminology / history / preference / decision / assumption). After confirm, write to memory/<file>.md and append raw to background.md. Marks ux-onepage.md as stale if it exists.
argument-hint: <project-name> <text-or-file-path>
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

You are running the `/ux-project:add-context` command. Activate the `ux-discovery` skill's principles (find SKILL.md via Glob `**/.claude-plugin/skills/ux-discovery/SKILL.md` if not already active).

## Arguments

`$ARGUMENTS` — `<project-name>` `<text-or-file-path>`

- If only one arg given AND a project is already active in conversation, treat the arg as `<text-or-file-path>` and infer project.
- If `<text-or-file-path>` looks like a path (starts with `./` `/` `~` or contains `.md` `.txt` `.markdown`), treat as file. Otherwise treat as inline text.
- Multiple sources separated by literal `, ` are allowed and processed in turn.

If arguments are missing or malformed, ask:
> 用法：`/ux-project:add-context <project-name> <text-or-file-path>`
> 或者在 active project 里直接：`/ux-project:add-context <text-or-file-path>`

## Steps

### 1. Validate project

- Verify `projects/<project-name>/` exists.
- If not, stop and ask: "项目 `<name>` 不存在。先 `/ux-project:start <name> <prd>` 创建？"

### 2. Resolve raw content

- If file path: Read the file. If file > 500 lines, ctx_index it first then ctx_search top 5 chunks (don't bulk-load).
- If inline text: use as-is.
- Multi-source: process each in turn (steps 3–7 per source, then step 8 once at the end).

### 3. Append raw to background.md

Locate template: Glob `**/.claude-plugin/templates/background.template.md`.

If `projects/<project-name>/background.md` doesn't exist, create from template (substitute `<project-name>` and `<YYYY-MM-DD>`).

Append a new block:

```
# <YYYY-MM-DD HH:MM> — 来自 /ux-project:add-context

原始内容：
> <full raw text or file excerpt — verbatim>

提取的 memory 条目（待 confirm 后填）：
- <pending>

---
```

### 4. Classify

Read the raw content. For each distinct claim/fact, classify into ONE of:

| Type | Target file | Use when |
|---|---|---|
| stakeholder | memory/stakeholders.md | who said what, who cares about what |
| constraint | memory/constraints.md | hard limits (API / policy / regulatory / Eng-imposed) |
| terminology | memory/terminology.md | project-specific term definitions |
| history | memory/history.md | event in project timeline (PRD revision / scope change) |
| preference | memory/preferences.md | project-internal design preference |
| decision | decisions.md (v0.1) | confirmed design decision |
| assumption | assumptions.md (v0.1) | unconfirmed working hypothesis |

If a claim could fit two types, prefer the more specific one (constraint > stakeholder; terminology > preference). Don't auto-pick when truly ambiguous — ask the designer.

### 5. Propose memory entries (one at a time)

For each classified claim, present the proposal:

```
Proposed entry for memory/<type>.md:
- id: m-<type-prefix>-<short-hash>
- type: <type>
- content: <one-line content>
- source: "<background.md block ref or file excerpt>"
- confidence: <high/medium/low>
- prd_version_at_write: <current PRD version from pm-source.md>
- status: active
- date: <today YYYY-MM-DD>

记入 memory/<type>.md 吗？(yes / edit / skip)
```

ID generation: `m-<prefix>-<6 chars from hash(content + date)>`. Prefixes:
- stakeholder → m-stk
- constraint → m-cst
- terminology → m-trm
- history → m-hst
- preference → m-prf
- decision → D<n> (v0.1 numbering — read decisions.md last D<n> + 1)
- assumption → A<n> (v0.1 numbering — read assumptions.md last A<n> + 1)

Wait for designer response per entry:
- yes / 记入 / save → write
- no / skip → drop, move to next
- edit → designer rewrites content; re-propose, then write

### 6. Write confirmed entries

For each confirmed entry:
- If target memory file doesn't exist: create from `memory-<type>.template.md`
- Append entry to `# Active` section (preserve YAML-like list format from template)
- Update target file's frontmatter `last_updated` to today

For decisions/assumptions: append to existing v0.1 file (decisions.md / assumptions.md) using v0.1 entry format.

### 7. Update background.md trace

Edit the block written in step 3 — replace `<pending>` with confirmed list:

```
提取的 memory 条目（已 confirm）：
- m-stk-001 → memory/stakeholders.md (one-line content snippet)
- m-cst-002 → memory/constraints.md (one-line content snippet)
```

If all entries rejected, replace `<pending>` with `(none — designer skipped all proposals)`. Keep the raw block.

### 8. Update state.md (after all sources processed)

Read `projects/<project-name>/state.md`. Then:

- Bump `last_updated` to today.
- For each NEW memory file type (first stakeholder / first constraint / etc.) that appeared this run: ensure the `# Memory Index` section has a pointer line for that file.
- For any file with new entries: update its pointer line to show top-3 most recent ids.

**Size cap check** (state.md body ≤ 30 lines, excluding frontmatter and HTML comments):
- Count body lines.
- If > 30: demote oldest Memory Index entries (the entries STAY in their memory/<file>.md — only the index pointer in state.md drops). Never demote `# Recommended Next Step`.
- If still > 30 after demotion: warn designer:
  > ⚠️ state.md still exceeds 30-line cap after demotion. Consider archiving old decisions/assumptions/questions.

### 9. Mark onepage stale (if exists)

If `projects/<project-name>/ux-onepage.md` exists:

a. Edit its frontmatter:
   - `stale: true`
   - `stale_reason: "added <list of new m-ids>"`

b. Add or update banner at top of body (right after the `# UX Onepage: <name>` heading):
   ```
   > ⚠️ This onepage is stale. Reason: added m-stk-001, m-cst-002 (2026-05-08).
   > Run `/ux-project:onepage` to regenerate (will produce a diff).
   ```

If banner already exists from a previous /add-context, append the new m-ids to its reason line (don't duplicate banner).

### 10. Closing message

```
✅ Context added to project: <name>
- New memory entries: <N> across <list of files>
- background.md block: <YYYY-MM-DD HH:MM>
- state.md last_updated: <today>
- ux-onepage.md: [unchanged | marked stale (reason: …)]

下一步：继续讨论；或 `/ux-project:onepage` 重新生成（如已 stale）。
```

## Failure modes

- File path doesn't exist → stop, ask for correction.
- Empty input → stop, ask for content.
- All entries rejected by designer → don't create empty memory files; raw stays in background.md with `(none)` trace.
- Memory type genuinely ambiguous → ask designer to choose, don't auto-pick.
- state.md size cap can't be satisfied even after demotion → warn but still write; do NOT block.

## What NOT to do

- Don't bypass per-entry confirm. Each proposed entry needs explicit yes/edit/skip.
- Don't write to memory/ without confirming type assignment with the designer.
- Don't auto-promote a preference to ux-kb-curated/designer-preferences.md (that's a separate flow, not this command's job).
- Don't auto-regen ux-onepage.md. Only mark stale; designer triggers regen via `/ux-project:onepage`.
- Don't extrapolate beyond the raw content. If something is implied, ask before classifying.
- Don't silently overwrite existing memory entries — if a new entry conflicts with an existing one, propose `superseded-by:<old-id>` explicitly.
