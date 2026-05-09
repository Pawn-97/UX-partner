# UX Project — Claude Code Plugin

UX discovery partner for designers. Turns a raw PM PRD into a KB-grounded `ux-onepage.md` and `design-brief.md` through multi-round discovery, with project-level memory and cite-or-die enforcement.

**Does NOT generate UI / wireframes / Figma.** That's downstream — handed off to `huashu-design` / `frontend-design` / Figma skills.

## Installation

### Marketplace (recommended)

```bash
claude plugin marketplace add Pawn-97/UX-partner
claude plugin install --scope user ux-project
```

### Local Clone (for development)

```bash
git clone git@github.com:Pawn-97/UX-partner.git
cd UX-partner
claude plugin add "$(pwd)"
```

After install, restart Claude Code (or reload plugins). The skill auto-triggers on UX-discovery keywords; the slash commands appear under `/ux-project:*`.

## Slash Commands

| Command | Purpose |
|---|---|
| `/ux-project:setup-kb <kb-path>` | One-shot KB setup: classify + index every markdown file into context-mode (idempotent) |
| `/ux-project:start <project-name> <prd-path>` | Initialize project workspace, copy PRD, run KB analysis |
| `/ux-project:resume <project-name>` | Restore project context from `state.md` (gateway file) |
| `/ux-project:add-context <project-name> <text-or-path>` | ★ v0.2 — Append context, classify, propose memory writes, mark onepage stale |
| `/ux-project:onepage` | Generate `ux-onepage.md` (cite-check + memory status check + outdated-check + diff on regen; designer must approve) |
| `/ux-project:handoff` | Generate `design-brief.md` for downstream design skills |

## How It's Triggered

The bundled `ux-discovery` skill auto-activates when you mention: "ux discovery", "需求拆解", "需求理解", "JTBD 梳理", "PRD 分析", "ux-onepage", "design brief", or invoke any `/ux-project:*` command.

## Operating Principles (enforced)

1. PRD is the entry. Always read it first.
2. Don't jump to solutions. Reframe before discussing UI.
3. **Cite or die.** Every onepage claim must have `[ref: path]` to a source.
4. **Outdated source detection.** PRD `valid_to < today` → warning before close.
5. Designer is the final judge. LLM recommends closure; designer confirms.
6. Lazy file creation. Project memory grows on demand.
7. Use `ctx_search` before reading. KB is large; never bulk-load.
8. Each round = 3–5 focused questions, with WHY each matters.
9. Memory write rule: never silently write decisions/assumptions/questions/memory/* — always show the proposed entry first and ask "记入吗？"

### ★ v0.2 additions

10. **First response is structured understanding.** `/ux-project:start` outputs a < 200-char structured task summary; designer confirms before it's written to `state.md`.
11. **Continuous context absorption.** `/ux-project:add-context` + auto-propose batched (every 5 rounds) write project memory; designer confirms each entry.
12. **Citation priority**: PRD > KB > project memory > assumptions. Memory cites must have `status: active`.
13. **Stale ≠ invalid.** New context marks `ux-onepage.md` stale; designer triggers regen.
14. **PRD upgrade default lazy** with hybrid prompt ("现在 review / 稍后").
15. **state.md size cap**: body ≤ 30 lines / < 1k tokens; oldest Memory Index entries demote on overflow.
16. **Read-triggered propose**: when reading any memory file mid-discussion, internally check for needed updates.

## Files & Layout

```
Design-partner/                ← workspace root (A); cd here, run all commands here
  .claude-plugin/
    plugin.json
    marketplace.json
    README.md                  ← you are here
    skills/ux-discovery/SKILL.md
    commands/
      setup-kb.md              → /ux-project:setup-kb
      start.md                 → /ux-project:start
      resume.md                → /ux-project:resume
      add-context.md           → /ux-project:add-context  (★ v0.2)
      onepage.md               → /ux-project:onepage
      handoff.md               → /ux-project:handoff
    templates/                 (13 templates: pm-source/state/decisions/assumptions/questions/ux-onepage/design-brief
                               + ★ v0.2: memory-stakeholders/memory-constraints/memory-terminology/memory-history/memory-preferences/background)
    scripts/
      index-to-context-mode.js ← KB indexing helper
  ux-kb-curated/
    glossary.md                ← user-curated, shared by all projects, < 100 lines
    design-principles.md       ← user-curated, shared by all projects, < 100 lines
    designer-preferences.md    ← ★ v0.2 — cross-project designer prefs (Always-on / On-demand)
  projects/
    <project-name>/            ← runtime workspace, lazy-created per project
      pm-source.md             PRD + frontmatter (read-only)
      state.md                 resume gateway (≤ 30 body lines)
      decisions.md / assumptions.md / questions.md   (lazy discussion log)
      ux-onepage.md            final deliverable + stale flag
      design-brief.md          downstream handoff
      background.md            ★ v0.2 — append-only raw context audit trail
      memory/                  ★ v0.2 — context-memory by type
        stakeholders.md / constraints.md / terminology.md / history.md / preferences.md
```

## Workspace Rules

**Cwd rule**: always work from the workspace root (`A`). Never `cd projects/<name>/` and run commands there — Glob lookups for `.claude-plugin/templates/` and `ux-kb-curated/` walk DOWN from cwd, not up, so they fail from a project subfolder. Switch active project by **name** via `/ux-project:resume <name>`, not by changing directory.

**Shared automatically**: KB index (context-mode user-global), `ux-kb-curated/glossary.md`, `ux-kb-curated/design-principles.md`, `ux-kb-curated/designer-preferences.md` (★ v0.2 — Always-on tier always loaded).

**Not shared**: `decisions.md`, `assumptions.md`, `questions.md`, `state.md`, `pm-source.md`, `ux-onepage.md`, `design-brief.md`, `background.md` (★ v0.2), `memory/*.md` (★ v0.2) — all project-scoped. To make a decision universal, manually copy it into `ux-kb-curated/design-principles.md` (the skill does NOT auto-promote). For preferences seen in ≥ 2 projects, the skill MAY propose promotion to `ux-kb-curated/designer-preferences.md`; designer confirms.

See the root [README.md](../README.md) for the full Workspace Organization section with examples.

## KB Setup (one-time)

Before the first project, index your existing KB into context-mode:

```bash
node "/Users/GuanchengDing/Claude Code-works/AI-projects/Design-partner/.claude-plugin/scripts/index-to-context-mode.js" \
  "/Users/GuanchengDing/Phone-KnowledgeBase/Phone- KnowledgeBase"
```

Then seed `ux-kb-curated/glossary.md` and `ux-kb-curated/design-principles.md` with the project's anchor terms and principles (ask the skill to draft a candidate from your KB).

## Source of Truth

- v0.1 design rationale: [`../ux-discovery-skill-v0.1-onepager.md`](../ux-discovery-skill-v0.1-onepager.md)
- ★ v0.2 design rationale: [`../ux-discovery-skill-v0.2-onepager.md`](../ux-discovery-skill-v0.2-onepager.md) — context-memory + `/add-context` + stale onepage + state.md size cap + read-triggered propose
