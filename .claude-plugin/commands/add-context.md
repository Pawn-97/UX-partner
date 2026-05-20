---
description: ★ v0.6 — Append context to current project. Classify input and propose memory writes (stakeholder / constraint / terminology / history / preference / decision / assumption / baseline). After confirm, write to memory/<file>.md and append raw to background.md. Mark per-phase stale flags (stale_phase_N) on state.md based on which phase(s) the context affects (rule 25). Living Onepage is edited in place — no regeneration.
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

If a claim could fit two types, prefer the more specific one (constraint > stakeholder; terminology > preference). **★ v0.3 — When truly ambiguous, ask via `AskUserQuestion` (SKILL.md § Question UI contract):**

```
AskUserQuestion({
  question: "这条记到哪一类 memory？  ‹excerpt of the claim›",
  options: [
    { label: "Stakeholder", description: "人 / 团队 / 角色相关" },
    { label: "Constraint",  description: "硬约束、deadline、技术/合规限制" },
    { label: "Terminology", description: "项目特定术语、缩写、产品名" },
    { label: "History",     description: "之前发生过的事、试过的方案、教训" },
    { label: "Preference",  description: "设计师/团队偏好" },
    { label: "Decision",    description: "已确认的设计决策（v0.1 decisions.md）" },
    { label: "Assumption",  description: "未确认的工作假设（v0.1 assumptions.md）" },
    { label: "Skip",        description: "不分类，跳过这条" }
  ],
  allow_other: true
})
```

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

```

**★ v0.3 — Then fire the confirm gate via `AskUserQuestion`:**

```
AskUserQuestion({
  question: "记入 memory/<type>.md 吗？",
  options: [
    { label: "✅ Yes",  description: "按 proposal 写入" },
    { label: "✏️ Edit", description: "content / confidence / type 改一下再写" },
    { label: "❌ Skip", description: "不记入，丢弃这条" }
  ],
  allow_other: true
})
```

ID generation: `m-<prefix>-<6 chars from hash(content + date)>`. Prefixes:
- stakeholder → m-stk
- constraint → m-cst
- terminology → m-trm
- history → m-hst
- preference → m-prf
- decision → D<n> (v0.1 numbering — read decisions.md last D<n> + 1)
- assumption → A<n> (v0.1 numbering — read assumptions.md last A<n> + 1)

Branch on the picker result:
- ✅ Yes → write
- ❌ Skip → drop, move to next
- ✏️ Edit → ask via another `AskUserQuestion` which field to edit (content / confidence / type / source), then collect new value via Other; re-propose, re-confirm.

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

### 9. ★ v0.6 — Mark affected phase(s) stale in state.md (rule 25)

> **v0.6 supersedes v0.2-v0.5**: whole-file `stale` / `stale_reason` fields on `ux-onepage.md` were REMOVED. Stale tracking moved to per-phase booleans on `state.md`. The Living Onepage is edited in place (no regeneration concept).

Classify each confirmed memory entry by **which phase(s)** of the onepage it most likely affects, using this heuristic:

| Memory type / content cue | Likely affected phase(s) |
|---|---|
| `stakeholder` / about target users / new persona | Phase 1 |
| `baseline` / current behavior / online metric | Phase 1 |
| `constraint` / hard limit / Eng / compliance | Phase 2 |
| `decision` (D<n>) | Phase 2 |
| `assumption` (A<n>) | Phase 2 |
| `terminology` / new term shaping framing | Phase 1 + Phase 2 |
| `history` / past attempt / lesson | Phase 2 |
| `preference` / design direction signal | Phase 2 + Phase 3 |
| Content about IA / flow / structure | Phase 3 |
| Free-form raw blob with unclear mapping | **All three** (conservative) |

Surface the proposed classification to designer via `AskUserQuestion` (rule 9 memory write gate — same pattern as memory proposals; do NOT silently update state.md):

```
AskUserQuestion({
  question: "新加的 context 影响了 phase <list of N>。在 state.md 里标对应的 stale_phase_<N>=true 吗？这样下次 /ux-project:refine 进来时会提示你 re-walk 那些 phase。",
  options: [
    { label: "✅ 标，按提议",         description: "认可分类，写入 state.md" },
    { label: "✏️ 改一下影响的 phase",    description: "重选哪些 phase 受影响（multiSelect）" },
    { label: "🚫 不标",                description: "新 context 不影响已确认 phase 的内容" }
  ],
  allow_other: true
})
```

Branch:
- **✅ 按提议** → Edit `projects/<project-name>/state.md` frontmatter: set `stale_phase_<N>: true` for each affected phase. Only set; never clear `false` here (clearing happens in `/ux-project:refine` after re-walk).
- **✏️ 改一下** → fire a second `AskUserQuestion` with `multiSelect: true` and options `[Phase 1, Phase 2, Phase 3]`; apply the designer's selection.
- **🚫 不标** → skip; state.md stale fields unchanged.

**Edge case**: if the relevant `phase_<N>_confirmed_at` is still `null` (that phase hasn't been confirmed yet), don't mark stale_phase_N — the phase will absorb the new context naturally on its first walk-through. Only mark stale for phases with `phase_N_confirmed_at != null`.

### 10. Closing message

```
✅ Context added to project: <name>
- New memory entries: <N> across <list of files>
- background.md block: <YYYY-MM-DD HH:MM>
- state.md last_updated: <today>
- state.md stale flags: [unchanged | stale_phase_<list>=true based on classification]  ★ v0.6

下一步：继续讨论；或 `/ux-project:refine <name>` re-walk 标了 stale 的 phase（onepage 直接编辑，不需要 regen）。
```

## Failure modes

- File path doesn't exist → stop, ask for correction.
- Empty input → stop, ask for content.
- All entries rejected by designer → don't create empty memory files; raw stays in background.md with `(none)` trace.
- Memory type genuinely ambiguous → fire the 8-choice `AskUserQuestion` (step 4); never auto-pick.
- state.md size cap can't be satisfied even after demotion → warn but still write; do NOT block.

## What NOT to do

- Don't bypass per-entry confirm. Each proposed entry needs explicit yes/edit/skip.
- Don't write to memory/ without confirming type assignment with the designer.
- Don't auto-promote a preference to ux-kb-curated/designer-preferences.md (that's a separate flow, not this command's job).
- ★ v0.6 — Don't write whole-file stale flags to `ux-onepage.md` (those fields removed in v0.6 per rule 25). Instead write per-phase stale flags to `state.md` (`stale_phase_N`). Don't auto-run `/ux-project:refine` — designer chooses when to re-walk the stale phase(s). The Living Onepage is edited in place; no regeneration concept exists.
- Don't extrapolate beyond the raw content. If something is implied, ask before classifying.
- Don't silently overwrite existing memory entries — if a new entry conflicts with an existing one, propose `superseded-by:<old-id>` explicitly.
