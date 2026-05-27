# /ux-project:handoff

Generate `design-brief.md` for downstream design work.

## Arguments

- `project_name`: optional. Use the active project if the conversation has one clear project.

## Workflow

1. Read `skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/commands/handoff.md`.
3. Execute the canonical command with the user arguments, applying the Codex adapter rules.
4. Require confirmed `ux-onepage.md` content before writing the handoff.
