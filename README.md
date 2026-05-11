# UX Partner

A Claude Code plugin that turns raw PM PRDs into KB-grounded `ux-onepage.md` and `design-brief.md` through structured multi-round discovery. Built for UX designers; produces deliverables that downstream design skills (`huashu-design`, `frontend-design`, Figma) consume directly.

> **Does NOT generate UI / wireframes / Figma / hi-fi mockups.** UI generation is the next skill's job. This plugin is exclusively for the discovery phase: problem framing, user/JTBD analysis, multi-round discussion, and structured handoff.

## Why this exists

Designers receive PRDs that often jump straight to a UI solution before the underlying user problem is well-framed. This plugin provides a structured discovery partner that:

- Reads the PRD and surfaces **possible solution bias**
- Drives **multi-round focused discussion** (3–5 questions per round, with WHY each matters)
- Maintains **project-level memory** across sessions (state.md as resume gateway)
- Enforces **cite-or-die** on the final onepage (every claim has `[ref: source]`)
- Detects **outdated PRD references** via frontmatter `valid_to`
- Hands off a **clean design brief** to downstream design skills

## Architecture

```
~/Phone-KnowledgeBase/                # external KB (640+ markdown docs)
        │
        │  indexed once via index-to-context-mode.js
        ▼
    context-mode (FTS5 + source quality tags)
        │
        │  ctx_search at discovery time
        ▼
┌─────────────────────────────────────────────────┐
│  ux-project plugin (this repo)                  │
│                                                 │
│   .claude-plugin/                               │
│   ├── skills/ux-discovery/SKILL.md              │
│   │     description-triggered, holds principles │
│   ├── commands/                                 │
│   │   ├── start.md     /ux-project:start        │
│   │   ├── resume.md    /ux-project:resume       │
│   │   ├── onepage.md   /ux-project:onepage      │
│   │   └── handoff.md   /ux-project:handoff      │
│   ├── templates/        7 lazy-created files    │
│   └── scripts/          KB indexing helper      │
│                                                 │
│   ux-kb-curated/                                │
│   ├── glossary.md       term + synonym map      │
│   └── design-principles.md  team principles     │
│                                                 │
│   projects/<name>/      runtime, lazy-created   │
│   ├── pm-source.md      PRD + frontmatter       │
│   ├── state.md          resume gateway          │
│   ├── decisions.md      append-only log         │
│   ├── assumptions.md    active/validated/...    │
│   ├── questions.md      open/answered           │
│   ├── ux-onepage.md     final deliverable       │
│   └── design-brief.md   downstream handoff      │
└─────────────────────────────────────────────────┘
        │
        │  design-brief.md feeds into
        ▼
    huashu-design / frontend-design / Figma
```

## Workspace Organization

The plugin assumes one **workspace root** (call it `A`) that holds all projects + curated KB + plugin code. Multiple design requirements live as **subfolders under `projects/`**, not as top-level siblings.

### The cwd rule

**Always run commands from `A` (the workspace root).** Don't `cd projects/<name>/` and run there.

```bash
cd ~/Design-partner            # ✅ workspace root, where .claude-plugin/ lives

/ux-project:start alternate-routing /path/to/prd.md
# → creates projects/alternate-routing/

/ux-project:resume sms-improvements
# → switches to that project; you do NOT cd anywhere

/ux-project:onepage
# → operates on the active project
```

Why not cd into a project folder:

1. **Templates lookup breaks.** `Glob **/.claude-plugin/templates/...` walks DOWN from cwd, not up. From `projects/<name>/`, it can't find `A/.claude-plugin/`.
2. **`ux-kb-curated/` lookup breaks** for the same reason.
3. **`/ux-project:start` mis-creates** the project, nesting it like `projects/B/projects/<name>/`.

Switch projects by **name**, not by `cd`. `state.md` is the resume gateway; the skill loads it for whichever project name you give.

### Sharing semantics

**Auto-shared across all projects** (no action needed):

| Resource | Where | Notes |
|---|---|---|
| KB index | context-mode (FTS5, user-global) | `ctx_search` hits the same store from any project |
| `glossary.md` | `A/ux-kb-curated/glossary.md` | Read on every skill activation |
| `design-principles.md` | `A/ux-kb-curated/design-principles.md` | Read on every skill activation |

**Not auto-shared** (each project is independent context):

| Resource | Where |
|---|---|
| `decisions.md` / `assumptions.md` / `questions.md` / `state.md` | `projects/<name>/` |
| `pm-source.md` (the PRD) | `projects/<name>/` |
| `ux-onepage.md` / `design-brief.md` | `projects/<name>/` |

### Promoting a project decision to "universal"

If a decision in project A turns out to apply to all future projects (e.g., "Phone admin UIs always require a confirmation step before destructive actions"), copy that line into `ux-kb-curated/design-principles.md` manually. The skill **does not auto-promote**. Promotion is the designer's explicit act — it's how curated KB stays high-quality.

### Mental model: "one folder per requirement"

If you naturally think "I want a folder per design task at the top level (B/C/D/E side-by-side)", that maps to:

```
projects/B/   projects/C/   projects/D/   projects/E/
```

Not to `B/ C/ D/ E/` directly under `A/`. The `projects/` prefix is what tells the plugin "these are projects, not random folders". Don't manually create top-level folders for projects — `/ux-project:start <name>` does it correctly.

You CAN add other top-level folders for non-project content (e.g., `A/docs/`, `A/scripts/`, `A/references/`) — those are ignored by the plugin.

## Install

### Option A — Marketplace (recommended)

```bash
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

Restart Claude Code. The `ux-discovery` skill auto-triggers on phrases like "需求拆解 / JTBD 梳理 / PRD 分析 / ux discovery", and the `/ux-project:*` slash commands appear in the menu.

### Option B — Local clone (for development)

```bash
git clone git@github.com:Pawn-97/UX-partner.git "Design-partner"
cd "Design-partner"
claude plugin add "$(pwd)"
```

Restart Claude Code.

### Index your KB (one-shot)

In Claude Code:

```
/ux-project:setup-kb /path/to/your/KB
```

This classifies every markdown file in your KB by `source_quality`, then indexes each into `context-mode` so onepage citations have something to ground in. Idempotent — safe to re-run after KB changes.

Edit `QUALITY_RULES` in `.claude-plugin/scripts/index-to-context-mode.js` if your KB layout differs from the default (Johnny-Decimal-style numbered folders).

## Slash Commands

| Command | Purpose |
|---|---|
| `/ux-project:setup-kb <kb-path>` | One-shot KB indexing: classify + ctx_index every markdown file (idempotent) |
| `/ux-project:start <name> <prd-path>` | Initialize project workspace from a PRD; runs initial KB analysis; proposes 3–5 first questions |
| `/ux-project:resume <name>` | Restore project context across sessions (reads only `state.md`) |
| `/ux-project:onepage` | Generate `ux-onepage.md` (cite-check + outdated-check enforced; designer must approve) |
| `/ux-project:handoff` | Generate `design-brief.md` for downstream design skills |

## Operating Principles (enforced)

1. **PRD is the entry.** Always read it first.
2. **Don't jump to solutions.** Reframe the user problem before discussing UI.
3. **Cite or die.** Every onepage claim must have `[ref: path]`. Missing refs block close.
4. **Outdated source detection.** PRD `valid_to < today` triggers warning before close.
5. **Designer is the final judge.** LLM recommends closure; designer confirms explicitly.
6. **Lazy file creation.** Project memory grows on demand.
7. **Use ctx_search before reading.** KB is large; never bulk-load.
8. **3–5 focused questions per round**, each with WHY it matters.
9. **Memory write gate.** Never silently write decisions/assumptions/questions — show the proposed entry first and ask "记入吗？" before appending.

## Phase 0 defaults (overridable)

- **PRD format**: markdown only. Other formats (.docx, 飞书) require manual conversion first.
- **`source_quality` enum**: `PRODUCT-DOC` | `TEMPLATE` | `PLAYBOOK` | `META` | `OUTDATED`
- **`confidence` enum**: `high` | `medium` | `low`
- **PRD ref granularity**: line-number (`pm-source.md:L12-15`)

Override by editing `.claude-plugin/skills/ux-discovery/SKILL.md`.

## Status — v0.1

- ✅ Plugin scaffold (`plugin.json`, `marketplace.json`)
- ✅ `ux-discovery` skill with 9 operating principles
- ✅ 4 slash commands
- ✅ 7 lazy templates
- ✅ KB indexing script (smoke-tested on 640-file KB)
- ✅ Curated glossary + design-principles seeds
- ⏳ Validation: assumption #2 (huashu-design ingestion), assumption #3 (FTS5 + glossary recall ≥ 60%)

## v0.2 candidates (deferred)

- `claude-context` MCP integration (semantic retrieval — only if FTS5 + glossary fails recall threshold)
- KB lint command (find stale `last_reviewed > 90 days`)
- Cross-project decision search
- `valid_to` aging report on PRD frontmatter

## Documents

- [`ux-discovery-skill-v0.1-onepager.md`](ux-discovery-skill-v0.1-onepager.md) — design rationale, MVP scope, assumptions to validate
- [`ux_discovery_partner_skill_创建文档.md`](ux_discovery_partner_skill_创建文档.md) — original creation proposal (Chinese, historical context)
- [`.claude-plugin/README.md`](.claude-plugin/README.md) — plugin internals

## License

MIT
