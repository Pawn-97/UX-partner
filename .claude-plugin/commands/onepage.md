---
description: Generate ux-onepage.md for the current project. Enforces cite-or-die + outdated-check + closure readiness. Designer must explicitly approve before writing.
argument-hint: [<project-name>]  (optional; uses last active if omitted)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

You are running the `/ux-project:onepage` command. Activate the `ux-discovery` skill's principles.

## Arguments

`$ARGUMENTS` — optional `<project-name>`. If omitted, ask the designer which project to close.

## Steps

### 1. Identify the project

- If `<project-name>` provided, verify `projects/<project-name>/` exists.
- If not provided and the conversation references one specific project, confirm with the designer: "要为 `<inferred-name>` 生成 onepage 吗？"
- If multiple projects could match, list them and ask.

### 2. Read project state

Read these files (now you can — onepage assembly needs full context):
- `projects/<project-name>/state.md`
- `projects/<project-name>/pm-source.md` (header + `valid_to` only; don't bulk-load body)
- `projects/<project-name>/decisions.md` (if exists)
- `projects/<project-name>/assumptions.md` (if exists)
- `projects/<project-name>/questions.md` (if exists)

### 3. Locate templates

Use Glob: `**/.claude-plugin/templates/ux-onepage.template.md`. Read the template — it has 13 sections.

### 4. Draft the onepage

Fill each section using the project state. **Every claim must end with `[ref: <path>]`** to:
- `pm-source.md:L<line>` for PRD-sourced facts
- `decisions.md:D<id>` for decisions
- `assumptions.md:A<id>` for assumptions
- `questions.md:Q<id>` for open questions
- `<kb-path>` for KB facts (use the path that ctx_search returned, not just a label)

Sections like "Design Direction Hypothesis" that are inferences should be tagged `(inference)` after the ref-less point — but those are summary-level statements, not claims. Concrete claims need refs.

### 5. Run cite-check

Walk the draft section-by-section:

```
For each line that asserts a fact:
  - If it ends with [ref: <path>], OK.
  - If not, mark it BLOCKED.
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

### 6. Run outdated-check

For every `[ref: pm-source.md:...]` cite:
- Read the PRD's `valid_to` from frontmatter.
- If `valid_to != null` AND `valid_to < <today>`:
  - Mark the citation in the draft with `⚠️ outdated — see superseded_by: <path>`
  - Surface to designer:

```
## ⚠️ Outdated PRD references

Citation in section <X> uses pm-source.md, but its valid_to is <date>.
Superseded by: <path or "(none specified)">

Continue with outdated ref / update ref to superseded version / abort?
```

Wait for designer decision before continuing.

### 7. Run closure readiness check

Output this summary using the data you've assembled:

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

### 8. Wait for designer approval

Do **not** proceed without explicit "yes" / "确认" / "close" / "go" or equivalent.

If "no" or "hold" → stop. Suggest what to clarify before retrying.

### 9. Write ux-onepage.md

Once approved, write `projects/<project-name>/ux-onepage.md`:
- Use the template structure
- Include the frontmatter (project, generated date, prd_source)
- Copy in the draft (with all refs preserved)
- Outdated refs keep their `⚠️ outdated` markers in the file

### 10. Update state.md

Edit `projects/<project-name>/state.md`:
- `phase: onepage-generated`
- `last_updated: <today>`

### 11. Closing message

```
✅ ux-onepage.md generated: projects/<project-name>/ux-onepage.md

Stats:
- Sections filled: <N>/13
- Citations: <count>
- Outdated refs: <count>
- Open questions deferred: <count>

下一步: /ux-project:handoff 生成给下游 design skill 的 brief。
```

## Failure modes

- Cite-check fails → don't write, list missing refs.
- Outdated check fails AND designer doesn't approve override → don't write.
- Closure check shows red dimensions → flag, ask designer if they want to continue or close discussion gaps first.
- Designer says "no" / "hold" → don't write.

## What NOT to do

- Don't write the onepage without explicit designer approval, even if everything looks good.
- Don't fabricate refs to make cite-check pass. If a claim has no source, ask the designer to drop it or provide one.
- Don't auto-update assumptions / decisions during onepage generation. The onepage is a snapshot, not a reshape.
- Don't include UI suggestions in section 12 (Design Direction Hypothesis). Direction = scope/mode/edge-cases, not screens.
