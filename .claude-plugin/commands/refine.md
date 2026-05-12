---
description: ★ v0.4 — Run the 3-phase gated UX discovery workflow (Understand & Expand → Evaluate & Converge → Sharpen & Ship). Each phase ends with a mandatory AskUserQuestion confirmation gate. Phase 3 closure triggers /ux-project:onepage to produce ux-onepage.md + ux-onepage.html (一图流).
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

You are running the `/ux-project:refine` command. Activate the `ux-discovery` skill's principles (especially rules 18–21).

This is the **3-phase gated refinement workflow** — the primary entry point for v0.4 discovery work.

## Arguments

`$ARGUMENTS` — optional `<project-name>`. If omitted, infer from `state.md` last active project, or ask via `AskUserQuestion` when ambiguous.

## Phase entry

### Step 1 — Identify the project & resume point

1. If `<project-name>` provided, verify `projects/<project-name>/` exists. If not, instruct: "先 `/ux-project:start <name> <prd-path>` 建项目。"
2. Read `projects/<project-name>/state.md`. Extract:
   - `phase` (current phase)
   - `phase_1_confirmed_at`, `phase_2_confirmed_at`, `phase_3_confirmed_at`
3. Determine resume point:
   - `intake` → start Phase 1 from scratch
   - `phase_1_expand` + not confirmed → continue Phase 1
   - `phase_2_converge` → start/continue Phase 2
   - `phase_3_ship` → start/continue Phase 3
   - `ready_for_onepage` → all 3 phases confirmed; recommend `/ux-project:onepage`
   - `onepage-generated` → onepage already shipped; ask if designer wants to regenerate (set phase back) or `/ux-project:handoff`

4. Surface resume state to designer (single line summary):
   ```
   Project <name>: phase = <X>. Phase 1 gate: <date|—>. Phase 2 gate: <date|—>. Phase 3 gate: <date|—>.
   ```

   Then continue into the appropriate phase.

---

## Phase 1 — Understand & Expand (Divergent)

**Goal**: Lock task goal + background + online-behavior baseline; expand 6–12 plausibly-relevant user scenarios.

### Step 2 — Restate goal

Read `pm-source.md` (header + first 80 lines max — use Read with `limit`, not full bulk-load).

Draft a one-line "How Might We" statement + 2–3 sentence problem framing. Cite to PRD.

Show to designer; ask via `AskUserQuestion`:

```
question: "这样理解这次的目标，对吗？"
options:
  - "✅ 对，可以"     / "理解准确，继续往下"
  - "✏️ 要改几个字"   / "大方向对，但有几句要修"
  - "❌ 整体重提"     / "理解偏了，需要重新说"
options always include Other.
```

### Step 3 — Background gathering (3–5 focused rounds)

For each topic below, fire ONE `AskUserQuestion` (rule 17 / Question UI contract):

1. **Primary user** — who is this for, specifically? (offer 2–4 personas from PRD or memory; allow Other)
2. **Success criteria** — what does success look like? (quantitative metric / qualitative outcome / both)
3. **Constraints** — time / tech / compliance / team boundaries? (cross-ref `memory/constraints.md` if exists)
4. **Online behavior baseline** ★ v0.4 — How do users solve this today? Current metrics? Pain points? Workarounds?
   - If designer doesn't know → write entry to `questions.md` as blocking; propose to ask PM/Eng/analytics.
   - If designer knows → propose entries for `memory/baseline.md` using the standard memory write gate (rule 9).
5. **Prior attempts** — what's been tried? (cross-ref `memory/history.md`)

After each round, the standard auto-propose memory pipeline runs (rule 11). Confirmed entries → `memory/*.md`.

### Step 4 — Expand scenarios via lenses (rule 19)

Pick 2–4 of the 5 lenses based on what fits this project:
- **Persona shift**
- **Journey stage shift**
- **Edge case lens**
- **Error & recovery lens**
- **Cross-context lens**

Generate **6–12 scenarios** (hard cap 15). For each scenario:
- Name (short noun phrase)
- One-line description
- Lens label
- Initial cite

Output as a table in chat:

```
| # | Scenario | Lens | One-line | Cite |
|---|----------|------|----------|------|
| S1 | <name> | Persona shift | <description> | [ref: ...] |
| ... |
```

### Step 5 — Phase 1 Gate

Fire the gate (must use plain Chinese — rule 22):

```
AskUserQuestion({
  question: "用户场景都列得差不多了。下一步是一起判断哪些值得做、哪些先不做，可以开始吗？",
  options: [
    { label: "✅ 可以下一步",   description: "场景列得够全，背景也清楚了" },
    { label: "✏️ 还要改一下",    description: "有场景需要补充或修改" },
    { label: "➕ 想展开某个场景", description: "有一条场景还想再细看" },
    { label: "⏸ 先暂停",        description: "等等再继续（比如等 PM / 工程回信）" }
  ],
  allow_other: true
})
```

Branch:
- ✅ 可以下一步 → update `state.md`: `phase: phase_2_converge`, `phase_1_confirmed_at: <today>`. Continue to Phase 2.
- ✏️ 还要改一下 → ask which scenario(s); regenerate; re-fire gate.
- ➕ 想展开某个场景 → ask which scenario; apply more lenses to that one specifically; re-fire gate.
- ⏸ 先暂停 → save state; exit cleanly. Designer can resume later via `/ux-project:refine` or `/ux-project:resume`.

---

## Phase 2 — Evaluate & Converge (Convergent)

**Goal**: Apply rubric → KEEP / CUT scenarios → JTBD list + Not Doing list.

### Step 6 — Apply rubric to each scenario (rule 20)

For each Phase 1 scenario, draft a row:

```
| # | Scenario | User Value | Impl Cost | Strategic Fit | Decision (your draft) |
|---|----------|-----------|-----------|---------------|----------------------|
| S1 | <name> | High | Medium | Core | KEEP |
| S2 | <name> | Low | High | Edge | CUT |
| ... |
```

**Be honest, not supportive** (per SKILL.md). Push back on weak scenarios:
- "Low frequency vitamin — recommend CUT"
- "Looks core but Impl Cost High this quarter — propose deferring to v2"

For each draft decision, fire `AskUserQuestion` (one per scenario, or batched 3–4 obviously-similar). Use plain Chinese in user-facing text (rule 22):

```
question: "场景 S<n>「<name>」—— 我建议<要做 / 不做>，理由：<一句话>。你同意吗？"
options:
  - "✅ 要做"           / "保留，进入用户需求清单"
  - "🚫 不做"           / "放进'明确不做'，写明理由"
  - "✏️ 理由要改"       / "决定可能对，但理由需要修"
```

### Step 7 — Build the Not Doing list

Every CUT must have a one-line reason. Format:

```
- **S<n>: <scenario name>** — <one-line reason> [ref: ...]
```

Reasons should be specific: scope decision, frequency too low, owned by adjacent team, technical blocker, etc.

### Step 8 — Convert KEEP set to JTBD

For each KEEP scenario, format as JTBD:

```
JTBD-<n>: When <situation>, I want to <action>, so I can <outcome>. [ref: ...]
```

Cluster into:
- **Primary JTBD** (the core 1–3 jobs)
- **Secondary JTBD** (supporting jobs)
- **Anti-JTBD** (what user does NOT want — at least 1)

### Step 9 — Render Phase 2 HTML preview (optional, for designer review)

If designer wants a visual preview before gate, generate a minimal HTML snippet showing:
- Rubric table
- JTBD cards (KEEP set)
- Not Doing list

This is a preview only — full HTML is generated at Phase 3 close via `/ux-project:onepage`.

### Step 10 — Phase 2 Gate

```
AskUserQuestion({
  question: "保留下来的用户需求和'不做'清单都看过了吗？下一步开始画结构和流程，可以开始吗？",
  options: [
    { label: "✅ 可以下一步",  description: "保留和不做的决定都对，开始画信息架构和流程" },
    { label: "✏️ 还要改一下",   description: "有要做 / 不做的决定要调，或需求描述要改" },
    { label: "⏸ 先暂停",       description: "先停一下，暂时不开始下一步" }
  ],
  allow_other: true
})
```

Branch:
- ✅ 可以下一步 → `state.md`: `phase: phase_3_ship`, `phase_2_confirmed_at: <today>`. Continue to Phase 3.
- ✏️ 还要改一下 → loop back to step 6 / 7 / 8.
- ⏸ 先暂停 → save state; exit.

---

## Phase 3 — Sharpen & Ship (Concrete)

**Goal**: IA structure + interaction flow → final `ux-onepage.md` + `ux-onepage.html`.

### Step 11 — Draft IA structure (rule 21)

Build a nested container hierarchy. **Purpose labels only.** Forbidden: button / dropdown / modal / color / typography.

Show as a tree:

```
<App entry point>
├── <Top-level area 1>
│   ├── <Section A> — <purpose label>
│   ├── <Section B> — <purpose label>
│   └── <Section C> — <purpose label>
├── <Top-level area 2>
│   └── <Section D> — <purpose label>
└── ...
```

Then fire `AskUserQuestion` per top-level area (or one gate-of-confirmation if simple). Use plain Chinese in the user-facing question:

```
question: "这一块的内容这样组织，对吗？"
options:
  - "✅ 可以"        / "结构合理"
  - "✏️ 要改"        / "某个区块要改名或调整层级"
  - "➕ 还要补一块"  / "缺少一个区块"
  - "🚫 删掉一块"    / "有区块多余"
```

### Step 12 — Draft interaction flow

Pick the right diagram type based on the flow's nature:
- **State-heavy** (entity moves through states): `stateDiagram-v2`
- **Branch-heavy** (decision paths): `flowchart`
- **Multi-actor**: `sequenceDiagram`

Write the Mermaid source. Include:
- Entry points
- Major branches (decisions)
- Terminal states (success + error paths)
- Recovery paths (from rule 19's Error & recovery lens output)

Show the raw Mermaid to designer; fire `AskUserQuestion` (use plain Chinese):

```
question: "用户走的主路径，这样画对吗？"
options:
  - "✅ 可以"         / "主路径对"
  - "✏️ 主路径要改"   / "主路径上某一步要调整"
  - "➕ 还要加一条分支" / "缺少一条情况（如错误恢复）"
  - "🚫 删掉一条分支" / "有分支多余"
```

### Step 13 — JTBD ↔ IA/flow coverage check

For each KEEP JTBD, verify it maps to ≥1 IA branch AND ≥1 flow path. If any JTBD has no coverage, flag it and ask the designer how to address (add an IA section? Flow branch? Demote the JTBD?).

### Step 14 — Phase 3 Gate (final approval)

```
AskUserQuestion({
  question: "信息架构和流程都看过了。可以生成最终的 UX 设计单页（md + 网页）了吗？",
  options: [
    { label: "✅ 可以生成",      description: "结构、流程、用户需求都对" },
    { label: "✏️ 还要改一下",     description: "结构或流程某段需要调整" },
    { label: "⚠️ 带保留意见生成", description: "整体可以，但有几个未确定的点要单独记到问题清单" },
    { label: "⏸ 先暂停",        description: "先不生成" }
  ],
  allow_other: true
})
```

Branch:
- ✅ 可以生成 → set `phase_3_confirmed_at: <today>`, `phase: ready_for_onepage`. Run `/ux-project:onepage` next.
- ⚠️ 带保留意见生成 → write caveats to `questions.md` (one `AskUserQuestion` per caveat to confirm); then proceed as approve.
- ✏️ 还要改一下 → loop back to step 11 / 12 / 13.
- ⏸ 先暂停 → save state; exit.

---

## Step 15 — Trigger `/ux-project:onepage`

On Ship: call `/ux-project:onepage` (the cite-check + final generation primitive). The onepage command will:
- Run cite-check, memory status check, outdated check
- Run closure readiness check
- Generate `ux-onepage.md` (markdown deliverable)
- Generate `ux-onepage.html` (HTML 一图流 — see `ux-onepage.html.template`)
- Update `state.md`: `phase: onepage-generated`

When `/ux-project:onepage` completes, surface the closing message (use plain Chinese, no "Phase" jargon):

```
✅ 全部完成。UX 设计单页已经生成：
   - ux-onepage.md   （markdown 版，给开发 / 评审用）
   - ux-onepage.html （网页版一图流，可以直接发给协作方看）

下一步可以：
- 双击 ux-onepage.html 在浏览器里看效果
- /ux-project:handoff  生成给下一步设计环节的简报
```

---

## Failure modes

- Designer pushes UI specifics in Phase 3 → redirect: "this belongs to downstream UI design (`huashu-design` / `frontend-design` / Figma)."
- Phase 1 produces >15 scenarios → STOP. Cap at 15 per rule 19. Force convergence before scaling.
- Phase 2 has no CUT scenarios → push back. If all KEEP, scope is probably too narrow OR convergence didn't actually happen.
- Phase 3 IA contains UI controls ("Submit button", "Dropdown") → STOP. Rewrite to purpose labels ("Confirmation action", "Filter selector").
- Skipping a phase gate via plain text → BLOCKED. All gate transitions MUST use `AskUserQuestion` (rule 18).
- Mermaid syntax error in flow → catch and ask designer to revise; do not generate broken HTML.

## What NOT to do

- Don't auto-advance phases. Designer Approves each gate explicitly.
- Don't bulk-load `pm-source.md`. Use `limit` parameter on Read.
- Don't propose memory entries silently. Use the standard write gate (rule 9).
- Don't generate `ux-onepage.html` directly here — let `/ux-project:onepage` own that. This command orchestrates the 3 phases; onepage primitive generates the deliverables.
- Don't break the cite-or-die discipline. Every scenario / JTBD / IA block / flow node that asserts a fact needs a `[ref: ...]`.
