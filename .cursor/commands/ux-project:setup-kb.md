# /ux-project:setup-kb

Set up the KB index for UX Partner in Cursor.

## Arguments

- `kb_path`: required path to the markdown KB root.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/setup-kb.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Prefer context-mode `ctx_index` when available. If unavailable, run:
   - `node .claude-plugin/scripts/index-to-context-mode.js "<kb_path>"`
   - `node .claude-plugin/scripts/local-kb-index.js kb-index-manifest.json`
6. Never bulk-read the KB into chat.
