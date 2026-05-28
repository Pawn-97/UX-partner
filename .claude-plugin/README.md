# UX Project — Claude Code Plugin

This directory is the canonical Claude Code plugin source for UX Partner. Codex and Cursor use adapter files outside this directory, but those adapters point back here so the workflow stays in one place.

## What It Does

UX Partner turns a PM PRD into:

- `ux-onepage.md`
- `ux-onepage.html`
- `design-brief.md`
- project-scoped memory under `projects/<name>/`

It stays upstream of hi-fi UI, Figma, and frontend code.

## Install

Inside Claude Code:

```text
/plugin marketplace add Pawn-97/UX-partner
/plugin install ux-project@design-partner
```

Then reload plugins or restart Claude Code.

## Commands

| Command | Purpose |
|---|---|
| `/ux-project:setup-kb <kb-path>` | Classify and index a markdown KB |
| `/ux-project:start <project-name> <prd-path>` | Create the project workspace, copy the PRD, and create the initial onepage stub |
| `/ux-project:resume <project-name>` | Restore project context from `state.md` |
| `/ux-project:refine [<project-name>]` | Continue discovery and fill the living onepage |
| `/ux-project:add-context <project-name> <text-or-path>` | Add context, propose memory writes, and mark affected sections for review |
| `/ux-project:export-html [<project-name>]` | Render the confirmed markdown onepage to HTML |
| `/ux-project:handoff [<project-name>]` | Generate the downstream design brief |
| `/ux-project:update` | Refresh the installed plugin |

## Canonical Files

```text
.claude-plugin/
  plugin.json
  marketplace.json
  skills/ux-discovery/SKILL.md
  commands/
  templates/
  scripts/index-to-context-mode.js
  scripts/local-kb-index.js
  scripts/local-kb-search.js
  vendor/guizang-ppt-skill/
```

Adapters outside this directory:

```text
.codex-plugin/plugin.json
skills/ux-discovery/SKILL.md
commands/ux-project:*.md
.cursor/commands/ux-project:*.md
.cursor/skills/ux-discovery/SKILL.md
.cursor/rules/ux-partner.mdc
```

## Rules To Preserve

- PRD first.
- Reframe the problem before UI talk.
- Use `ctx_search` before reading large KB sources.
- Ask 3-5 focused questions per round.
- Never silently write memory, decisions, assumptions, or questions.
- Do not advance through approval points without explicit designer confirmation.
- Keep `state.md` small and use it as the resume gateway.
- Keep citations complete in `ux-onepage.md`.
- Render HTML only from the existing markdown onepage.
- Do not produce hi-fi UI, Figma files, or frontend code.
