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
| `/ux-project:onepage` | Generate `ux-onepage.md` (cite-check + outdated-check enforced; designer must approve) |
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
9. Memory write rule: never silently write decisions/assumptions/questions — always show the proposed entry first and ask "记入吗？"

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
      onepage.md               → /ux-project:onepage
      handoff.md               → /ux-project:handoff
    templates/                 (7 templates: pm-source/state/decisions/assumptions/questions/onepage/brief)
    scripts/
      index-to-context-mode.js ← KB indexing helper
  ux-kb-curated/
    glossary.md                ← user-curated, shared by all projects, < 100 lines
    design-principles.md       ← user-curated, shared by all projects, < 100 lines
  projects/
    <project-name>/            ← runtime workspace, lazy-created per project
```

## Workspace Rules

**Cwd rule**: always work from the workspace root (`A`). Never `cd projects/<name>/` and run commands there — Glob lookups for `.claude-plugin/templates/` and `ux-kb-curated/` walk DOWN from cwd, not up, so they fail from a project subfolder. Switch active project by **name** via `/ux-project:resume <name>`, not by changing directory.

**Shared automatically**: KB index (context-mode user-global), `ux-kb-curated/glossary.md`, `ux-kb-curated/design-principles.md`.

**Not shared**: `decisions.md`, `assumptions.md`, `questions.md`, `state.md`, `pm-source.md`, `ux-onepage.md`, `design-brief.md` — all project-scoped. To make a decision universal, manually copy it into `ux-kb-curated/design-principles.md` (the skill does NOT auto-promote).

See the root [README.md](../README.md) for the full Workspace Organization section with examples.

## KB Setup (one-time)

Before the first project, index your existing KB into context-mode:

```bash
node "/Users/GuanchengDing/Claude Code-works/AI-projects/Design-partner/.claude-plugin/scripts/index-to-context-mode.js" \
  "/Users/GuanchengDing/Phone-KnowledgeBase/Phone- KnowledgeBase"
```

Then seed `ux-kb-curated/glossary.md` and `ux-kb-curated/design-principles.md` with the project's anchor terms and principles (ask the skill to draft a candidate from your KB).

## Source of Truth

The full v0.1 design rationale lives in [`../ux-discovery-skill-v0.1-onepager.md`](../ux-discovery-skill-v0.1-onepager.md).
