---
description: Generate ux-onepage.md for the current project. Enforces cite-or-die + outdated-check + memory status check + closure readiness. If a previous onepage exists and is stale, produces a diff. Designer must explicitly approve before writing.
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
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
- `projects/<project-name>/state.md`
- `projects/<project-name>/pm-source.md` (header + `valid_to` only; don't bulk-load body)
- `projects/<project-name>/decisions.md` (if exists)
- `projects/<project-name>/assumptions.md` (if exists)
- `projects/<project-name>/questions.md` (if exists)
- `projects/<project-name>/memory/*.md` (★ v0.2 — read all that exist)
- `projects/<project-name>/ux-onepage.md` (★ v0.2 — if exists, save as `previous` for diff)

★ v0.2 — When you read any memory file, internally check (per Operating Principle #16): is there anything to add/update/correct based on current discussion? If yes, propose now BEFORE drafting. Don't proceed to draft if there are pending unconfirmed proposals.

### 3. Locate templates

Use Glob: `**/.claude-plugin/templates/ux-onepage.template.md`. Read the template — it has 13 sections + v0.2 frontmatter (stale/last_regen/regen_count).

### 4. Draft the onepage

Fill each section using the project state. **Every claim must end with `[ref: <path>]`** to:
- `pm-source.md:L<line>` for PRD-sourced facts
- `decisions.md:D<id>` for decisions
- `assumptions.md:A<id>` for assumptions
- `questions.md:Q<id>` for open questions
- `memory/<type>.md#m-<id>` ★ v0.2 — for context-memory citations
- `<kb-path>` for KB facts (use the path that ctx_search returned)

Sections like "Design Direction Hypothesis" that are inferences should be tagged `(inference)` after the ref-less point. Concrete claims need refs.

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

确认收尾并生成 ux-onepage.md 吗？(yes / no / hold)
```

### 9. Wait for designer approval

Do **not** proceed without explicit "yes" / "确认" / "close" / "go" or equivalent.

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

c. Show diff to designer; ask: "Diff 看起来对吗？approve 写入吗？(yes / no)"

If "no", iterate. If "yes", proceed to step 11.

If no previous (first generation), skip step 10.

### 11. Write ux-onepage.md

Once approved, write `projects/<project-name>/ux-onepage.md`:
- Use template structure (13 sections)
- Frontmatter:
  - `project`, `generated: <today>`, `prd_source: ./pm-source.md`, `prd_version: <v>`
  - ★ v0.2 — `stale: false`, `stale_reason: null`, `last_regen: <today>`, `regen_count: <previous_count + 1>` (or `0` if first gen)
- Body: copy in the draft (with all refs preserved, including outdated markers if any)
- ★ v0.2 — If banner from a stale state existed in `previous`, do NOT carry it over (regen clears stale)

### 12. Update state.md

Edit `projects/<project-name>/state.md`:
- `phase: onepage-generated`
- `last_updated: <today>`
- Verify size cap (≤30 body lines); demote if needed.

### 13. Closing message

```
✅ ux-onepage.md generated: projects/<project-name>/ux-onepage.md

Stats:
- Sections filled: <N>/13
- Citations: <count> total (PRD: <a>, KB: <b>, memory: <c>, decisions/assumptions: <d>)
- Outdated refs: <count>
- Open questions deferred: <count>
- ★ v0.2 — Regen count: <regen_count> (<first generation | regenerated from stale>)

下一步: /ux-project:handoff 生成给下游 design skill 的 brief。
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
