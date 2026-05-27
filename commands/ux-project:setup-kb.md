# /ux-project:setup-kb

Set up the KB index for UX Partner.

## Arguments

- `kb_path`: required path to the markdown KB root.

## Workflow

1. Read `skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/commands/setup-kb.md`.
3. Execute the canonical command with the user arguments, applying the Codex adapter rules.
4. If `ctx_index` is unavailable in this Codex session, stop and report that KB indexing needs the context-mode MCP/tooling before continuing.
