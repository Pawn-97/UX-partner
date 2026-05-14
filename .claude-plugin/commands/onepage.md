---
description: Generate ux-onepage.md AND ux-onepage.html (★ v0.4 一图流) for the current project. Enforces cite-or-die + outdated-check + memory status check + closure readiness. If a previous onepage exists and is stale, produces a diff. Designer must explicitly approve before writing. Typically invoked at the end of `/ux-project:refine` Phase 3 gate.
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

You are running the `/ux-project:onepage` command. Activate the `ux-discovery` skill's principles.

## Arguments

`$ARGUMENTS` — optional `<project-name>`. If omitted, ask the designer which project to close.

## Steps

### 1. Identify the project

- If `<project-name>` provided, verify `projects/<project-name>/` exists.
- If not provided and the conversation references one specific project, confirm: "要为 `<inferred-name>` 生成 onepage 吗？"
- If multiple projects could match, list them and ask.

### 2. Read project state

Read these files (now you can — onepage assembly needs full context):
- `projects/<project-name>/state.md` — **note the `change_type` frontmatter field**（new_feature / iteration / refactor / unknown）. 如果 unknown，停下来 fire AskUserQuestion 让设计师确认（rule 24）后再继续
- `projects/<project-name>/pm-source.md` (header + `valid_to` only; don't bulk-load body)
- `projects/<project-name>/decisions.md` (if exists)
- `projects/<project-name>/assumptions.md` (if exists)
- `projects/<project-name>/questions.md` (if exists)
- `projects/<project-name>/memory/*.md` (★ v0.2 — read all that exist)
- `projects/<project-name>/ux-onepage.md` (★ v0.2 — if exists, save as `previous` for diff)

★ v0.2 — When you read any memory file, internally check (per Operating Principle #16): is there anything to add/update/correct based on current discussion? If yes, propose now BEFORE drafting. Don't proceed to draft if there are pending unconfirmed proposals.

### 3. Locate templates

Use Glob to find BOTH templates:
- `**/.claude-plugin/templates/ux-onepage.template.md` — markdown deliverable; ★ v0.4 has 17 sections (1–13 classic + 14–17: Scenario Map / Not Doing / IA / Flow) + frontmatter (stale, last_regen, regen_count, phase_N_confirmed_at, html_companion).
- `**/.claude-plugin/templates/ux-onepage.html.template` ★ v0.4 — self-contained HTML 一图流 with `{{PLACEHOLDER}}` slots. See template header comments for the full placeholder list.

### 4. Draft the onepage

Fill each section using the project state. **Every claim must end with `[ref: <path>]`** to:
- `pm-source.md:L<line>` for PRD-sourced facts
- `decisions.md:D<id>` for decisions
- `assumptions.md:A<id>` for assumptions
- `questions.md:Q<id>` for open questions
- `memory/<type>.md#m-<id>` ★ v0.2 — for context-memory citations (includes `memory/baseline.md#m-bsl-<id>` ★ v0.4)
- `<kb-path>` for KB facts (use the path that ctx_search returned)

Sections like "Design Direction Hypothesis" that are inferences should be tagged `(inference)` after the ref-less point. Concrete claims need refs.

★ v0.4 — Fill the new sections:
- **§5 Current (Online Baseline)**: pull from `memory/baseline.md` entries; cite each fact.
- **§14 Scenario Map**: 6–12 rows from Phase 1; for each, the Phase 2 rubric scores + KEEP/CUT decision + cite. ★ v0.4.3 — `change_type ∈ {iteration, refactor}` 时多一列"类型"（★新增 / 改造 / 复用）。
- **§15 Not Doing**: every CUT scenario from §14, one-line reason each.
- **§16 IA Structure**: nested tree (purpose labels, NOT UI controls). Use ASCII tree in markdown. ★ v0.4.3 — iteration / refactor 时每个节点前必须带 `★NEW` / `(改造)` / `(已有)` 前缀（rule 24）。new_feature 时不带前缀。
- **§17 Interaction Flow**: Mermaid code block (flowchart / stateDiagram-v2 / sequenceDiagram). ★ v0.4.3 — iteration / refactor 时必须包含 `classDef new / modified / existing` 三色定义 + 每节点 `:::class` 标注（rule 24）。new_feature 时不带 classDef。
- **JTBD → coverage maps**: each KEEP JTBD must trace to ≥1 IA branch (§16 coverage map) AND ≥1 flow path (§17 coverage map). If gaps, flag in step 8 readiness check. ★ v0.4.3 — iteration / refactor 时每条 trace 都标节点类型。

### 5. Run cite-check

Walk the draft section-by-section:

```
For each line that asserts a fact:
  - If it ends with [ref: <path>], OK.
  - If not, mark BLOCKED.
```

If any BLOCKED items exist, **stop**. Output:

```markdown
## ⚠️ Cite-check failed

Missing refs:
1. Section <X>, claim: "..." — please provide ref or remove
2. Section <Y>, claim: "..." — please provide ref or remove

Onepage 未生成。补完 ref 后重跑 `/ux-project:onepage`。
```

Do not write the file when blocked.

### 5b. ★ v0.4.3 — Iteration cite-check（rule 24）

仅在 `change_type ∈ {iteration, refactor}` 时跑：

1. 扫 §16 IA 树和 §17 Mermaid 图，统计每个 `(已有)` / `(改造)` 节点 / `:::existing` / `:::modified` 节点。
2. 每个标 `(已有)` 或 `:::existing` 的节点**必须**对应 `memory/baseline.md` 的某条 active 条目（按内容语义匹配，不要求字面相等）。
3. 如果发现孤立的 `(已有)` 节点（baseline 没有对应锚点），BLOCK：

```markdown
## ⚠️ Iteration 标记锚点缺失

下列节点标了 (已有) 或 :::existing 但 `memory/baseline.md` 没有对应条目：

1. §16 "Section A" — 没找到锚点
2. §17 "已有终点 Recovery" — 没找到锚点

要么补 baseline 条目，要么改标记为 ★NEW。Onepage 未生成。
```

类似地，`★NEW` / `:::new` 节点必须能 trace 到某条 KEEP JTBD 或 PRD 新需求 cite；`(改造)` / `:::modified` 必须同时 trace 到 baseline + 新 cite。

如果 `change_type == new_feature` 但 §16 / §17 里出现 `(已有)` / `(改造)` / `:::existing` / `:::modified` 标记，也 BLOCK（要么改类型，要么删标记）。

### 6. ★ v0.2 — Run memory status check

For every `[ref: memory/<type>.md#m-<id>]` cite:

a. Read the corresponding memory entry from `memory/<type>.md`.
b. Check `status` field.
c. If `status != active`:
   - Mark in draft: `⚠️ memory cite blocked: m-<id> has status: <archived|superseded-by:...>`
   - Block onepage generation.

If any blocked memory cites exist, output:

```markdown
## ⚠️ Memory status check failed

Blocked cites:
1. Section <X>, cite: memory/constraints.md#m-cst-005 — status: superseded-by:m-cst-009
   Suggestion: update cite to m-cst-009 or remove the claim.
2. ...

Onepage 未生成。
```

Wait for designer to update cites or remove claims, then re-run.

### 7. Run outdated-check (PRD)

For every `[ref: pm-source.md:...]` cite:
- Read the PRD's `valid_to` from frontmatter.
- If `valid_to != null` AND `valid_to < <today>`:
  - Mark citation: `⚠️ outdated — see superseded_by: <path>`
  - Surface to designer:

```
## ⚠️ Outdated PRD references

Citation in section <X> uses pm-source.md, but its valid_to is <date>.
Superseded by: <path or "(none specified)">

Continue with outdated ref / update ref to superseded version / abort?
```

Wait for designer decision before continuing.

### 8. Run closure readiness check

Output this summary:

```markdown
## Closure Readiness — <project-name>

| Dimension | Status | Notes |
|---|---|---|
| Goal clarity | ✅/⚠/❌ | ... |
| User clarity | ✅/⚠/❌ | ... |
| Behavior clarity | ✅/⚠/❌ | ... |
| JTBD clarity | ✅/⚠/❌ | ... |
| Risk clarity | ✅/⚠/❌ | ... |
| Handoff readiness | ✅/⚠/❌ | ... |

**Recommendation**: [continue discussion / close with caveats / ready to close]
```

**★ v0.3 — Then fire the closure gate via `AskUserQuestion` (SKILL.md § Question UI contract):**

```
AskUserQuestion({
  question: "确认收尾并生成 ux-onepage.md 吗？",
  options: [
    { label: "✅ Close",        description: "6 个维度都够 sharp，生成 onepage" },
    { label: "⚠️ Close w/ caveats", description: "带 caveats 收尾，未完善维度记入 questions.md" },
    { label: "⏸ Hold",          description: "暂不收尾，先回去补讨论" },
    { label: "❌ No",            description: "ready check 不通过，重 review" }
  ],
  allow_other: true
})
```

### 9. Branch on closure decision

- ✅ Close / ⚠️ Close w/ caveats → proceed to step 10 (diff if previous exists)
- ⏸ Hold / ❌ No → stop. Do NOT write onepage. If caveats listed, write them as `# Open Questions` entries (one `AskUserQuestion` per caveat to confirm — see add-context.md § 5 pattern).

If "no" or "hold" → stop. Suggest what to clarify before retrying.

### 10. ★ v0.2 — If regenerating (previous exists), produce diff

If step 2 found a `previous` ux-onepage.md:

a. Compare new draft vs previous, section by section.
b. Produce a diff summary:

```markdown
## Onepage diff (regen #<N+1>)

### Added sections / claims
- §X.Y: <one-line>

### Removed sections / claims
- §A.B: <one-line>

### Changed claims
- §C.D: <old claim ref> → <new claim ref>

### New cites
- memory/stakeholders.md#m-stk-005 (was not cited before)

### Replaced cites
- pm-source.md:L23 → pm-source-v2.md:L19 (PRD upgrade)

### Unchanged sections
<count>/13
```

c. Show diff to designer; **★ v0.3 — fire `AskUserQuestion` (SKILL.md § Question UI contract):**

```
AskUserQuestion({
  question: "Diff 看起来对吗？approve 写入吗？",
  options: [
    { label: "✅ Approve",  description: "diff 看完了，写入 ux-onepage.md" },
    { label: "✏️ Iterate", description: "diff 里某条不对，改一下再 review" },
    { label: "⏸ Hold",     description: "暂缓 regen，先回去讨论" }
  ],
  allow_other: true
})
```

- ✅ Approve → step 11
- ✏️ Iterate → ask which section/cite to revise (Other free-text); regenerate that part; re-diff; re-fire the gate
- ⏸ Hold → stop without writing

If no previous (first generation), skip step 10.

### 11. Write ux-onepage.md

Once approved, write `projects/<project-name>/ux-onepage.md`:
- Use template structure (★ v0.4 — 17 sections, including new §14–§17)
- Frontmatter:
  - `project`, `generated: <today>`, `prd_source: ./pm-source.md`, `prd_version: <v>`
  - ★ v0.2 — `stale: false`, `stale_reason: null`, `last_regen: <today>`, `regen_count: <previous_count + 1>` (or `0` if first gen)
  - ★ v0.4 — `phase_1_confirmed_at`, `phase_2_confirmed_at`, `phase_3_confirmed_at` (copy from state.md), `html_companion: ./ux-onepage.html`
- ★ v0.4.3 — `change_type` (copy from state.md — drives §14/§16/§17 rendering convention)
- Body: copy in the draft (with all refs preserved, including outdated markers if any)
- ★ v0.2 — If banner from a stale state existed in `previous`, do NOT carry it over (regen clears stale)

### 11b. ★ v0.4 — Render ux-onepage.html (stakeholder-facing minimal view)

> **重要 (rule 22)**: HTML 是给 stakeholder 看的精简版，不是审计版。引用 / 阶段时间戳 / 流程标签 / 长说明段 全部不显示。完整 cite 链路留在 `ux-onepage.md` 里。

Read `**/.claude-plugin/templates/ux-onepage.html.template`. 已大幅精简的 placeholder 列表：

| Placeholder | Source |
|---|---|
| `{{PROJECT_NAME}}` | frontmatter `project` |
| `{{GOAL_STATEMENT}}` | §1 statement（短，≤ 40 字最好；strip cite markup） |
| `{{PROBLEM_FRAMING}}` | §2 现状+真正要解决的事（1–2 短句；strip cite markup） |
| `{{PRIMARY_USER}}` / `{{SECONDARY_USERS}}` | §4 短标签 |
| `{{BASELINE_BULLETS_HTML}}` | each active `memory/baseline.md` entry → `<li>content</li>`（**不带 sup ref**，纯文本） |
| `{{SCENARIO_ROWS_HTML}}` | §14 rows; KEEP → `td.decision-keep`, CUT → `td.decision-cut`; lens label in `<span class="lens-tag">`（标签短到 4 字以内：时机 / 跨场景 / 用户 / 边界 / 出错）。★ v0.4.3 — iteration 项目额外一列 `<span class="change-tag change-new\|change-mod\|change-existing">★新增/改造/复用</span>` |
| `{{IA_TREE_HTML}}` (iteration / refactor) | 节点前缀 `★NEW` 用 `<span class="ia-new">★NEW</span>`，`(改造)` 用 `<span class="ia-mod">改造</span>`，`(已有)` 用 `<span class="ia-existing">已有</span>`。★ v0.5 — CSS 已内置在模板（IKB Swiss：新增=IKB 蓝、改造=黑加粗、已有=灰）；不要在 `<style>` 里另写。 |
| `{{MERMAID_FLOW_SRC}}` (iteration / refactor) | 原样保留 `classDef new / modified / existing` 定义 + 节点的 `:::class` 标注。Mermaid 会自动渲染三色——HTML 端不要剥离这些标记 |
| `{{NOT_DOING_BULLETS_HTML}}` | §15 list → `<li><b>S<n>: name</b> — reason</li>`（无 ref） |
| `{{JTBD_CARDS_HTML}}` | §6 cards. ★ v0.5 — Primary → `<div class="jtbd-card primary">`（IKB 高亮 priority chip）；Secondary → `<div class="jtbd-card">`（中性）；Anti → `<div class="jtbd-card anti">`（灰底）。卡片 body: `<div class="id">需求 N · 核心</div><div class="text">短句, b 标签包关键动作</div><span class="priority">S1 · S3</span>`（priority chip 只放对应场景 ID，不写"对应场景："前缀） |
| `{{IA_TREE_HTML}}` | §16 嵌套 `<ul><li>name <span class="purpose">— purpose</span></li></ul>`。purpose 文字短，≤ 20 字 |
| `{{IA_COVERAGE_HTML}}` | `<li>需求 N → 路径</li>` 系列（短） |
| `{{MERMAID_FLOW_SRC}}` | §17 raw mermaid source (preserve indentation; do NOT escape HTML chars inside — Mermaid handles its own parsing). 节点名要短 |
| `{{FLOW_COVERAGE_HTML}}` | `<li>需求 N → 路径</li>` 系列（短） |
| `{{CONSTRAINTS_BULLETS_HTML}}` | §8 top 3 constraints（每条 ≤ 25 字，无 ref） |
| `{{ASSUMPTIONS_BULLETS_HTML}}` | §10 active assumptions top 3（每条 ≤ 25 字，无 ref） |
| `{{OPEN_QUESTIONS_HTML}}` | §11 blocking questions（每条 ≤ 25 字，无 ref） |
| `{{STALE_BANNER_HTML}}` | empty string when not stale; otherwise `<div class="stale-banner">⚠️ 已 stale：<reason></div>` |

**已从 HTML 移除的内容**（rule 22 + 用户反馈）：
- header meta 行 (PRD version / generated / regen count)
- phase 确认条 (背景理清 ✓ / 需求收敛 ✓ / 结构成型 ✓)
- 每个 section h2 后的 `<span class="phase-tag">` 小标签
- 每个 section h2 下的 `<p class="lede">` 描述段
- 底部 `<div class="footnotes">` 引用区
- 正文里所有 `<sup class="ref">` 标记

**Tightening guidelines** (apply when filling placeholders):
- 删掉所有"这样 / 这是 / 这一节"等指代废话
- 删掉 "需要" / "应该" 等说教语气，直接陈述
- 数字 / 比例直接写，不加 "大约 / 大概"
- 路径用 → 不写"然后"
- 能 12 字别用 20 字

**HTML escape rule**: escape `<`, `>`, `&` in 所有 designer-provided content slot（goal, framing, scenarios, JTBD text, baseline bullets, etc.） EXCEPT inside `{{MERMAID_FLOW_SRC}}`（Mermaid needs its own markup verbatim）和 `{{IA_TREE_HTML}}`（which IS html）。

Write the rendered output to `projects/<project-name>/ux-onepage.html`.

**Self-test**: after writing, verify the HTML file:
- Contains `<title>UX 设计单页 — <name></title>`
- All `{{PLACEHOLDER}}` markers are replaced (grep for `{{` should return 0 matches)
- Mermaid `<pre class="mermaid">` block is non-empty
- Grep `<sup class="ref">` → 0 matches（rule 22：不带 ref 在 HTML 里）
- Grep `class="footnotes"` → 0 matches（已移除）
- Grep `class="phase-tag"` → 0 matches（已移除）
- Grep `class="lede"` → 0 matches（已移除）

### 12. Update state.md

Edit `projects/<project-name>/state.md`:
- `phase: onepage-generated`
- `last_updated: <today>`
- Verify size cap (≤30 body lines); demote if needed.

### 13. Closing message

```
✅ ux-onepage.md generated: projects/<project-name>/ux-onepage.md
✅ ux-onepage.html generated: projects/<project-name>/ux-onepage.html  ★ v0.4

Stats:
- Sections filled: <N>/17  ★ v0.4
- Citations: <count> total (PRD: <a>, KB: <b>, memory: <c>, decisions/assumptions: <d>, baseline: <e> ★ v0.4)
- Scenarios mapped: <N_total> (<N_keep> KEEP, <N_cut> CUT)  ★ v0.4
- JTBD: <N_primary> Primary / <N_secondary> Secondary / <N_anti> Anti  ★ v0.4
- IA top-level areas: <N>  ★ v0.4
- Flow diagram type: <flowchart | stateDiagram-v2 | sequenceDiagram>  ★ v0.4
- Outdated refs: <count>
- Open questions deferred: <count>
- ★ v0.2 — Regen count: <regen_count> (<first generation | regenerated from stale>)

下一步:
- 在浏览器打开 ux-onepage.html 看 一图流 (双击或拖入浏览器)
- /ux-project:handoff 生成给下游 design skill 的 brief
```

## Failure modes

- Cite-check fails → don't write, list missing refs.
- ★ v0.2 — Memory status check fails → don't write, list blocked cites with suggestions.
- Outdated check fails AND designer doesn't approve override → don't write.
- Closure check shows red dimensions → flag, ask designer.
- Designer says "no" / "hold" on closure or diff → don't write.

## What NOT to do

- Don't write the onepage without explicit designer approval.
- Don't fabricate refs to make cite-check pass.
- Don't auto-update assumptions / decisions / memory during onepage generation. The onepage is a snapshot, not a reshape.
- Don't include UI suggestions in section 12 (Design Direction Hypothesis). Direction = scope/mode/edge-cases, not screens.
- ★ v0.2 — Don't carry the stale banner into the regenerated file. Regen clears stale.
- ★ v0.2 — Don't skip the diff when a previous onepage exists. Designer needs to see what changed.
- ★ v0.4 — Don't include UI controls / colors / pixel layouts in §16 IA or §17 flow. Purpose labels only. Hi-fi UI is downstream.
- ★ v0.4 — Don't ship `ux-onepage.html` with un-rendered `{{PLACEHOLDER}}` markers. Always grep `{{` after rendering — must be 0 matches.
- ★ v0.4 — Don't escape HTML chars inside `{{MERMAID_FLOW_SRC}}` — Mermaid parses raw text inside `<pre class="mermaid">`.
- ★ v0.4 — Don't generate `ux-onepage.html` if `ux-onepage.md` cite-check failed. HTML must reflect the validated markdown source.
- ★ v0.4 — Don't put `<sup class="ref">` markers in HTML body, don't render `<div class="footnotes">`, don't render `<span class="phase-tag">`, don't render `<p class="lede">` sections. HTML is the stakeholder minimal view; cite trail lives in .md (rule 22).
- ★ v0.4 — Don't include header meta row (PRD version / date / regen count) or phase confirmation strip in HTML. 单一 h1 标题足够 (rule 22)。
- ★ v0.4.3 — Don't render `★NEW / (改造) / (已有)` markers when `change_type == new_feature` (rule 24). Conversely, don't omit them when `change_type ∈ {iteration, refactor}`.
- ★ v0.4.3 — Don't strip Mermaid `classDef` / `:::class` annotations when piping `{{MERMAID_FLOW_SRC}}` — they carry the new/existing visual signal.
