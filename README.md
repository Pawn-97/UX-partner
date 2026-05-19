# UX Partner

A Claude Code plugin that turns raw PM PRDs into KB-grounded `ux-onepage.md` + HTML 一图流 through a **3-phase gated discovery workflow** (Understand & Expand → Evaluate & Converge → Sharpen & Ship). Built for UX designers; produces deliverables that downstream design skills (`huashu-design`, `frontend-design`, Figma) consume directly.

## Scope boundary (★ v0.4 reframed)

**In-scope (upstream design artifacts):**
- ✅ Problem framing, JTBD analysis, user scenario expansion + convergence
- ✅ **Information Architecture (IA) structure** — conceptual, no UI controls
- ✅ **Interaction flow** — black & white flow diagrams, no visual styling
- ✅ Container-level wireframes (boxes labelled by purpose, not by UI control)

**Out-of-scope (downstream skills' job):**
- ❌ Hi-fi UI / component-level wireframes / visual design / color / typography
- ❌ Figma artifacts / hi-fi mockups / interactive prototypes
- ❌ Frontend code

> v0.4 reframes the boundary: IA + flow are **upstream design assets** (this plugin's job). UI styling and Figma stay downstream (`huashu-design`, `frontend-design`, Figma).

## Why this exists

Designers receive PRDs that often jump straight to a UI solution before the underlying user problem is well-framed. This plugin provides a structured discovery partner that:

- Reads the PRD and surfaces **possible solution bias**
- Drives **3 gated phases** with explicit designer confirmation between each
- Expands user scenarios via **5 ideation lenses** (persona / journey / edge / error / cross-context)
- Evaluates scenarios with a **User Value × Impl Cost × Strategic Fit rubric** and forces a "Not Doing" list
- Captures **online behavior baseline** (current production state, existing solutions, metrics) as context-memory
- Maintains **project-level memory** across sessions (state.md as resume gateway)
- Enforces **cite-or-die** on the final onepage (every claim has `[ref: source]`)
- Produces both `ux-onepage.md` (engineering / handoff) **and** `ux-onepage.html` (stakeholder-facing 一图流)
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
| `/ux-project:refine` ★ v0.4 | Run the 3-phase gated workflow (Understand & Expand → Evaluate & Converge → Sharpen & Ship). Each phase ends with an explicit confirmation gate via `AskUserQuestion`. Final output: `ux-onepage.md` + `ux-onepage.html` |
| `/ux-project:add-context` | Append context, classify, propose memory writes, mark onepage stale |
| `/ux-project:onepage` | Generate `ux-onepage.md` + `ux-onepage.html` (cite-check + outdated-check + memory status check; designer must approve) |
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

## Status — v0.4

- ✅ Plugin scaffold (`plugin.json`, `marketplace.json`)
- ✅ `ux-discovery` skill with 21 operating principles (v0.1 1–9 + v0.2 10–16 + v0.3 17 + v0.4 18–21)
- ✅ 7 slash commands (including new `/ux-project:refine` 3-phase orchestrator)
- ✅ 14 lazy templates (including `memory-baseline` and `ux-onepage.html`)
- ✅ KB indexing script (smoke-tested on 640-file KB)
- ✅ Curated glossary + design-principles seeds
- ✅ ★ v0.4 — 3-phase gated workflow with strong confirmation gates
- ✅ ★ v0.4 — HTML 一图流 output (self-contained, Mermaid CDN)
- ✅ ★ v0.4 — Scenario expansion lenses + JTBD evaluation rubric
- ✅ ★ v0.4 — IA structure + interaction flow (B&W, no UI details)

## Documents

- [`.claude-plugin/README.md`](.claude-plugin/README.md) — plugin internals

## License

MIT
