# UX Partner

A Claude Code plugin that turns raw PM PRDs into KB-grounded UX discovery artifacts — `ux-onepage.md`, `ux-onepage.html` (一图流), and `design-brief.md` — through a 3-phase gated workflow.

Built for UX designers. Output is consumed directly by downstream design tools (huashu-design, frontend-design, Figma).

**English** · [中文](README_CN.md)

## What you get

- **`ux-onepage.md`** — engineering-ready discovery doc with cite-or-die enforcement
- **`ux-onepage.html`** — stakeholder-facing 一图流, Swiss IKB visual system, self-contained, print-friendly
- **`design-brief.md`** — clean handoff for downstream design tools
- **Project memory** — `decisions / assumptions / questions / memory/*` that survives across sessions

## Scope boundary

**In scope** (upstream design assets):
problem framing · JTBD · scenario expand/converge · IA structure · interaction flow (B&W) · container-level wireframes

**Out of scope** (downstream tools' job):
hi-fi UI · component-level wireframes · Figma artifacts · color/typography · frontend code

## Install

### From marketplace (recommended)

Inside the Claude Code REPL:

```
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

Restart Claude Code. The `ux-discovery` skill auto-triggers on phrases like "需求拆解 / JTBD 梳理 / PRD 分析 / ux discovery".

### Local clone (for development)

```bash
git clone git@github.com:Pawn-97/UX-partner.git Design-partner
cd Design-partner
claude
```

Then in the REPL:

```
/plugin marketplace add "$(pwd)"
/plugin install ux-project@design-partner
```

### One-time KB indexing

```
/ux-project:setup-kb /path/to/your/KB
```

Classifies every markdown in your KB by `source_quality` and indexes into context-mode. Idempotent. If your KB layout isn't Johnny-Decimal-style, edit `QUALITY_RULES` in [`.claude-plugin/scripts/index-to-context-mode.js`](.claude-plugin/scripts/index-to-context-mode.js).

## Workflow

```
/ux-project:start <name> <prd-path>   →  create projects/<name>/ + initial KB analysis
/ux-project:refine                    →  3-phase gated discovery
/ux-project:onepage                   →  generate ux-onepage.md + .html
/ux-project:handoff                   →  generate design-brief.md
```

### The 3 phases

| Phase | What happens | Output |
|---|---|---|
| **Understand & Expand** | Read PRD · KB-first background scan · 5-lens scenario expansion · online behavior baseline | Scenario map · baseline memory |
| **Evaluate & Converge** | JTBD rubric (User Value × Impl Cost × Strategic Fit) · KEEP / CUT decisions · Not Doing list | Final scenarios · JTBD list |
| **Sharpen & Ship** | IA structure (conceptual) · interaction flow (Mermaid B&W) · cite-check · designer approval | `ux-onepage.md` + `ux-onepage.html` |

Each phase ends with an explicit `AskUserQuestion` gate (Approve / Revise / Drill-down / Hold). The skill never auto-advances.

## Slash commands

| Command | What it does |
|---|---|
| `/ux-project:setup-kb <kb-path>` | One-shot KB classify + index (idempotent) |
| `/ux-project:start <name> <prd-path>` | New project from a PRD (`.md` or `.docx`) |
| `/ux-project:resume <name>` | Switch active project by name (reads `state.md`) |
| `/ux-project:refine` | The 3-phase gated workflow |
| `/ux-project:add-context <name> <text-or-path>` | Append context, propose memory writes, mark onepage stale |
| `/ux-project:onepage` | Generate `ux-onepage.md` + `.html` (cite-check + memory-status + outdated gates) |
| `/ux-project:handoff` | Generate `design-brief.md` |
| `/ux-project:update` | Upgrade the plugin from marketplace |

## Conventions

**Workspace root rule.** Always run commands from the repo root (where `.claude-plugin/` lives). Never `cd projects/<name>/` — `Glob` walks down from cwd, so templates and `ux-kb-curated/` become unreachable from inside a project folder. Switch active projects by **name** via `/ux-project:resume`, never by directory.

**Lazy file creation.** Project memory grows on demand. `decisions.md / assumptions.md / questions.md / memory/*` are only created when first needed — don't pre-create them.

**Cite-or-die.** Every claim in `ux-onepage.md` must have `[ref: path]`. Cite priority: PRD > KB > project memory > assumptions. Missing or stale (`status != active`) cites block onepage generation.

**Memory write gate.** The skill never silently writes to memory files — every entry is proposed via `AskUserQuestion`, and you confirm before it's appended.

Full operating principles live in [`.claude-plugin/skills/ux-discovery/SKILL.md`](.claude-plugin/skills/ux-discovery/SKILL.md).

## Layout

```
.
├── .claude-plugin/        # plugin code (skill + commands + templates + KB indexer)
├── ux-kb-curated/         # shared across projects (glossary, design-principles)
└── projects/<name>/       # one folder per requirement, lazy-created
    ├── pm-source.md
    ├── state.md           # resume gateway
    ├── ux-onepage.md / .html
    └── memory/, decisions.md, ...
```

Shared across all projects: the context-mode KB index (user-global) + `ux-kb-curated/*`.
Project-scoped: everything under `projects/<name>/`.

## License

MIT — see [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json).
