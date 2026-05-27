# /ux-project:update

Update the UX Partner Codex plugin from its configured marketplace.

## Workflow

1. Run `codex plugin marketplace upgrade design-partner`.
2. Remove and re-add the plugin only if the marketplace refresh does not update the installed cache:
   - `codex plugin remove ux-project@design-partner`
   - `codex plugin add ux-project@design-partner`
3. Do not touch `projects/`, `ux-kb-curated/`, or any KB index files.
4. Report only whether the update completed. Do not show release identifiers, cache paths, or commit hashes.

For Claude Code, use the canonical update procedure in `.claude-plugin/commands/update.md` instead.
