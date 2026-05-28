# UX Partner

UX Partner turns a raw PM PRD into KB-grounded UX discovery files:

- `ux-onepage.md` — cited source of truth for review and audit
- `ux-onepage.html` — clean stakeholder onepager
- `design-brief.md` — handoff for downstream UI, Figma, or frontend work

It supports Claude Code, Codex, and Cursor. The Claude Code plugin remains the canonical source under `.claude-plugin/`; Codex and Cursor use thin adapters that point back to the same rules.

**English** · [中文](README_CN.md)

## Scope

In scope: problem framing, JTBD, user scenarios, IA structure, interaction flow, and container-level conceptual wireframes.

Out of scope: hi-fi UI, component-level wireframes, Figma files, visual styling, and frontend code. Those belong to downstream design or implementation tools.

## Install In Claude Code

Inside the Claude Code REPL:

```text
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

Restart Claude Code or reload plugins.

## Install In Codex

From Codex:

```bash
codex plugin marketplace add Pawn-97/UX-partner
codex plugin add ux-project@design-partner
```

For local development:

```bash
git clone git@github.com:Pawn-97/UX-partner.git Design-partner
cd Design-partner
codex plugin marketplace add "$(pwd)"
codex plugin add ux-project@design-partner
```

## Use In Cursor

Open this repository in Cursor. The project skill at `.cursor/skills/ux-discovery/SKILL.md` makes Cursor Agent recognize the same workflow.

```bash
git clone git@github.com:Pawn-97/UX-partner.git Design-partner
cd Design-partner
cursor .
```

Then type the same command-like prompts in Cursor chat:

```text
/ux-project:setup-kb /path/to/kb
/ux-project:start <name> <prd-path>
/ux-project:refine
```

Cursor slash commands are provided under `.cursor/commands/`, so they should appear in the `/` menu when the repository is open in Cursor. The command files are thin adapters: they load the Cursor skill, then read the matching canonical command file and map Claude/Codex tool behavior to Cursor tools.

For KB search, Cursor uses context-mode tools when available. If they are not available, the adapter falls back to the local scripts in `.claude-plugin/scripts/local-kb-index.js` and `.claude-plugin/scripts/local-kb-search.js`, so the workflow can still search indexed KB chunks without bulk-loading the KB into chat.

## Workflow

```text
/ux-project:setup-kb /path/to/kb
/ux-project:start <name> <prd-path>
/ux-project:refine
/ux-project:add-context <name> <text-or-path>
/ux-project:export-html
/ux-project:handoff
```

## Commands

| Command | Purpose |
|---|---|
| `/ux-project:setup-kb <kb-path>` | Classify and index a markdown KB |
| `/ux-project:start <name> <prd-path>` | Create `projects/<name>/`, copy the PRD, and create the initial onepage stub |
| `/ux-project:resume <name>` | Resume from `state.md` |
| `/ux-project:refine` | Continue the gated discovery flow and fill `ux-onepage.md` |
| `/ux-project:add-context <name> <text-or-path>` | Add context, propose memory writes, and mark affected sections for review |
| `/ux-project:export-html` | Render `ux-onepage.md` to `ux-onepage.html` |
| `/ux-project:handoff` | Generate `design-brief.md` |
| `/ux-project:update` | Refresh the installed plugin |

## Conventions

Always run from the repo root. Do not `cd projects/<name>/` for plugin work, because template and curated KB lookup starts from the current directory.

Project memory is lazy-created. Do not pre-create `decisions.md`, `assumptions.md`, `questions.md`, or `memory/*`.

The plugin never silently writes memory. It proposes entries first, then waits for explicit confirmation.

Every substantive claim in `ux-onepage.md` needs a source. Missing or inactive sources block close.

## Layout

```text
.
├── .claude-plugin/        # canonical Claude Code plugin source
├── .codex-plugin/         # Codex plugin manifest
├── .cursor/               # Cursor slash commands, project skill, and rules
├── commands/              # Codex slash-command adapters
├── skills/                # Codex skill adapters
├── ux-kb-curated/         # shared glossary, principles, preferences
└── projects/<name>/       # project-scoped runtime files
```

## License

MIT
