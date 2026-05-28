# /ux-project:refine

Continue the gated UX onepage flow.

## Arguments

- `project_name`: optional. Use the active project if the conversation has one clear project.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/refine.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Do not advance any approval point without explicit designer approval through Cursor `AskQuestion`.
6. Use context-mode `ctx_search` when available; otherwise use `node .claude-plugin/scripts/local-kb-search.js "<query>" 5`.
