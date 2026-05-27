---
description: Render finalized ux-onepage.md to ux-onepage.html for the current project. Pure markdown → HTML conversion via ux-onepage.html.template (17 placeholders). Pre-condition: phase_3_confirmed_at != null in state.md. Cite-check / iteration cite-check / memory status / outdated check / draft→ref promote all happen earlier (during /ux-project:refine phase 3 confirm gate, rule 25). This command is purely mechanical.
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

You are running the `/ux-project:export-html` command. Activate the `ux-discovery` skill's principles (especially rule 25 Living Onepage).

## Arguments

`$ARGUMENTS` — optional `<project-name>`. If omitted and ambiguous, ask via `AskUserQuestion` which project to export.

## Steps

### 1. Identify the project

- If `<project-name>` provided, verify `projects/<project-name>/` exists.
- If not provided and conversation references one specific project, confirm via `AskUserQuestion`: "为 `<inferred-name>` 导 HTML 吗？"
- If multiple projects could match, list them via `AskUserQuestion` and let designer pick.

### 2. Verify phase 3 is confirmed

Read `projects/<project-name>/state.md` frontmatter. Check:
- `phase_3_confirmed_at` is set (not `null`)
- `phase: ready_for_onepage` (or later)

If not, stop with (plain Chinese, rule 22):
> "Phase 3 还没收尾。先跑 `/ux-project:refine <project-name>` 走完三阶段，确认完 phase 3 gate 之后再来导 HTML。"

### 3. Verify no draft / assumption tags remain in ux-onepage.md

Read `projects/<project-name>/ux-onepage.md` body. Grep for `[^d` and `[^a` markers (these are draft / assumption footnote references — see rule 25).

If any found, stop with:
> "ux-onepage.md 里还有 N 个 [^d...] / [^a...] 标记。说明 phase 3 confirm gate 的 cite-check + promote 没跑完。回去 `/ux-project:refine <project-name>` 走完 phase 3 confirm gate 再来。"

### 4. Locate HTML template

Glob: `**/.claude-plugin/templates/ux-onepage.html.template`.

If not found, surface:
> "找不到 HTML 模板文件 `.claude-plugin/templates/ux-onepage.html.template`。插件可能没装好，跑 `/ux-project:update` 重装一下。"

### 5. Render placeholders from ux-onepage.md

Read `projects/<project-name>/ux-onepage.md` and `state.md`. Substitute placeholders in the HTML template per this mapping:

| Placeholder | Source |
|---|---|
| `{{PROJECT_NAME}}` | frontmatter `project` |
| `{{GOAL_STATEMENT}}` | §1 statement（短，≤ 40 字最好；strip cite markup） |
| `{{PROBLEM_FRAMING}}` | §2 现状+真正要解决的事（1–2 短句；strip cite markup） |
| `{{PRIMARY_USER}}` / `{{SECONDARY_USERS}}` | §4 短标签 |
| `{{BASELINE_BULLETS_HTML}}` | each active `memory/baseline.md` entry → `<li>content</li>`（**不带 sup ref**，纯文本） |
| `{{SCENARIO_ROWS_HTML}}` | §14 rows; KEEP → `td.decision-keep`, CUT → `td.decision-cut`; lens label in `<span class="lens-tag">`（标签短到 4 字以内：时机 / 跨场景 / 用户 / 边界 / 出错）。iteration 项目额外一列 `<span class="change-tag change-new\|change-mod\|change-existing">★新增/改造/复用</span>` |
| `{{IA_TREE_HTML}}` (iteration / refactor) | 节点前缀 `★NEW` 用 `<span class="ia-new">★NEW</span>`，`(改造)` 用 `<span class="ia-mod">改造</span>`，`(已有)` 用 `<span class="ia-existing">已有</span>`。CSS 已内置在模板（IKB Swiss：新增=IKB 蓝、改造=黑加粗、已有=灰）；不要在 `<style>` 里另写 |
| `{{MERMAID_FLOW_SRC}}` (iteration / refactor) | 原样保留 `classDef new / modified / existing` 定义 + 节点的 `:::class` 标注。Mermaid 自动渲染三色——HTML 端不要剥离这些标记 |
| `{{NOT_DOING_BULLETS_HTML}}` | §15 list → `<li><b>S<n>: name</b> — reason</li>`（无 ref） |
| `{{JTBD_CARDS_HTML}}` | §6 cards. Primary → `<div class="jtbd-card primary">`（IKB 高亮 priority chip）；Secondary → `<div class="jtbd-card">`（中性）；Anti → `<div class="jtbd-card anti">`（灰底）。卡片 body: `<div class="id">需求 N · 核心</div><div class="text">短句, b 标签包关键动作</div><span class="priority">S1 · S3</span>`（priority chip 只放对应场景 ID，不写"对应场景："前缀） |
| `{{IA_TREE_HTML}}` | §16 嵌套 `<ul><li>name <span class="purpose">— purpose</span></li></ul>`。purpose 文字短，≤ 20 字 |
| `{{IA_COVERAGE_HTML}}` | `<li>需求 N → 路径</li>` 系列（短） |
| `{{MERMAID_FLOW_SRC}}` | §17 raw mermaid source（保留 indentation；do NOT escape HTML chars inside — Mermaid handles its own parsing）。节点名要短 |
| `{{FLOW_COVERAGE_HTML}}` | `<li>需求 N → 路径</li>` 系列（短） |
| `{{CONSTRAINTS_BULLETS_HTML}}` | §8 top 3 constraints（每条 ≤ 25 字，无 ref） |
| `{{ASSUMPTIONS_BULLETS_HTML}}` | §10 active assumptions top 3（每条 ≤ 25 字，无 ref） |
| `{{OPEN_QUESTIONS_HTML}}` | §11 blocking questions（每条 ≤ 25 字，无 ref） |
| `{{STALE_BANNER_HTML}}` | Always empty string. Per-phase stale tracking lives in `state.md` (`stale_phase_N`); Living Onepage doesn't carry a body stale banner anymore. If any `stale_phase_N=true` and phase_3 is still confirmed, user should re-run `/ux-project:refine` to address (not block export, but warn in step 7 closing) |

**Tightening guidelines** (apply when filling placeholders):
- 删掉所有"这样 / 这是 / 这一节"等指代废话
- 删掉 "需要" / "应该" 等说教语气，直接陈述
- 数字 / 比例直接写，不加 "大约 / 大概"
- 路径用 → 不写"然后"
- 能 12 字别用 20 字

**HTML escape rule**: escape `<`, `>`, `&` in 所有 designer-provided content slot（goal, framing, scenarios, JTBD text, baseline bullets, etc.）EXCEPT inside `{{MERMAID_FLOW_SRC}}` (Mermaid needs verbatim) 和 `{{IA_TREE_HTML}}` (which IS html).

### 6. Self-test + write

After substituting, verify:
- `<title>UX 设计单页 — <name></title>` present
- Grep `{{` returns 0 matches (no un-rendered placeholders)
- Mermaid `<pre class="mermaid">` block is non-empty
- Grep `<sup class="ref">` → 0 matches (rule 22: no inline refs in HTML)
- Grep `class="footnotes"` → 0 matches
- Grep `class="phase-tag"` → 0 matches
- Grep `class="lede"` → 0 matches

If any check fails, surface the failure list and STOP — do NOT write broken HTML.

Write the rendered output to `projects/<project-name>/ux-onepage.html`.

### 7. Closing message

Check `state.md` for any `stale_phase_N=true`. If found, warn:
> "⚠️ 注意：state.md 显示 phase N 有未消化的 context（stale_phase_<N>=true）。HTML 已基于当前 ux-onepage.md 导出，但内容可能滞后。要 fresh，去 `/ux-project:refine` re-walk 一下 phase N。"

Then:

```
✅ ux-onepage.html 已生成: projects/<project-name>/ux-onepage.html

文件结构:
- ux-onepage.md   (source-of-truth；cite-or-die 完整)
- ux-onepage.html (网页一图流；精简版，供 stakeholder 看)

下一步:
- 双击 ux-onepage.html 在浏览器看效果
- /ux-project:handoff <project-name>  生成给下游设计的简报
```

## Failure modes

- Phase 3 not confirmed (`phase_3_confirmed_at == null`) → stop with "去 `/ux-project:refine` 走完 phase 3"
- Draft / assumption tags `[^d]` / `[^a]` remain in body → stop, designer must re-run refine phase 3 to promote them
- Template file not found → stop, suggest `/ux-project:update` to reinstall
- Mermaid syntax error in §17 source → catch, surface, do NOT write broken HTML
- Placeholder substitution leaves `{{...}}` markers → fail self-test, do NOT write
- HTML escape rule violation in non-Mermaid content → catch, fix, retry

## What NOT to do

- **Don't run cite-check / iteration cite-check / memory status check / outdated check / closure readiness check here.** Those are phase 3 confirm gate's job in `/ux-project:refine` (rule 25). Moving them here would duplicate work and reintroduce end-only validation.
- **Don't promote `[^d]` / `[^a]` tags here.** Same as above — that's phase 3 confirm gate's job.
- **Don't generate or modify `ux-onepage.md` content.** This command ONLY renders the existing `.md` to `.html`. The `.md` is now the source-of-truth Living Onepage, edited only during `/ux-project:refine` phases.
- Don't include UI controls / colors / unsupported syntax in Mermaid output.
- Don't include header meta row (PRD version / generated date / regen count) or phase confirmation strip in HTML output (rule 22).
- Don't render `<sup class="ref">`, `<div class="footnotes">`, `<span class="phase-tag">`, `<p class="lede">` in HTML body (rule 22).
- Don't escape HTML chars inside `{{MERMAID_FLOW_SRC}}` — Mermaid parses raw text inside `<pre class="mermaid">`.
- Don't update `state.md` `phase` field (e.g., to `onepage-generated`). Leave `phase: ready_for_onepage` after phase 3 confirm and never advance it from this command.
