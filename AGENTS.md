# AGENTS.md

Guidance for Codex when working in this repository.

## What This Repo Is

This is UX Partner, a plugin repository that supports both Claude Code and Codex.

- `.claude-plugin/` is the canonical Claude Code plugin source.
- `.codex-plugin/plugin.json` is the Codex plugin manifest.
- `skills/` and `commands/` are Codex adapters that point back to `.claude-plugin/`.
- `ux-kb-curated/` is shared curated knowledge.
- `projects/<name>/` is runtime project data and is mostly gitignored.

There is no build, lint, or test runner. The deliverables are markdown, JSON, HTML templates, and one Node indexing script.

## Commands

```bash
node .claude-plugin/scripts/index-to-context-mode.js <kb-root> [output-dir]
python3 /Users/GuanchengDing/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py .
```

Codex local install check:

```bash
codex plugin marketplace add "$(pwd)"
codex plugin add ux-project@design-partner
```

Claude Code local install check, from inside the Claude REPL:

```text
/plugin marketplace add "$(pwd)"
/plugin install ux-project@design-partner
/reload-plugins
```

## Architecture

Keep one source of truth for workflow rules:

- Edit `.claude-plugin/skills/ux-discovery/SKILL.md` for behavior.
- Edit `.claude-plugin/commands/*.md` for command procedure.
- Keep Codex adapter files thin. They should load the adapter skill, then read and follow the matching canonical command file.

The Codex adapter maps host-specific behavior:

- `AskUserQuestion` means Codex structured question UI when available; otherwise ask a concise labelled-option question and wait.
- Claude tool names map to equivalent Codex file and shell tools.
- `ctx_search` and `ctx_index` are required KB tools. If unavailable, stop and report the missing capability instead of bulk-reading the KB.

## Runtime Layout

```text
projects/<name>/
  pm-source.md
  state.md
  ux-onepage.md
  ux-onepage.html
  design-brief.md
  background.md
  decisions.md / assumptions.md / questions.md
  memory/
```

Files are lazy-created. Do not pre-create memory files or empty templates.

## Rules Not To Break

- Always work from the repository root. Do not run plugin workflows from `projects/<name>/`.
- Do not silently write memory, decisions, assumptions, or questions.
- Do not advance approval points without explicit designer confirmation.
- Keep `state.md` as the small resume gateway.
- Use `ctx_search` before reading large KB content.
- Keep citations complete in `ux-onepage.md`.
- Keep HTML as a clean stakeholder view derived from the markdown onepage.
- Do not generate hi-fi UI, Figma artifacts, visual design, or frontend code.
- Keep `.claude/` local settings out of git.

## Version Noise Policy

Manifest release fields stay because plugin managers require them. Do not put release labels or changelog notes in skill instructions, command text, templates, README prose, or user-facing update reports.
