# /ux-project:update

Update UX Partner when running from Cursor.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Do not run Claude Code or Codex plugin-manager commands.
3. Check whether this repository has local changes.
4. Ask the designer before pulling remote updates.
5. If approved, update the repository with normal git operations while preserving:
   - `projects/`
   - `ux-kb-curated/`
   - KB index artifacts
   - local Cursor settings/state
6. Report only whether the update completed. Do not show release identifiers, cache paths, or commit hashes.
