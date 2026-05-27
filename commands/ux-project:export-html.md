# /ux-project:export-html

Render the confirmed `ux-onepage.md` into stakeholder HTML.

## Arguments

- `project_name`: optional. Use the active project if the conversation has one clear project.

## Workflow

1. Read `skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/commands/export-html.md`.
3. Execute the canonical command with the user arguments, applying the Codex adapter rules.
4. Keep this command mechanical: render existing `ux-onepage.md` to HTML, then run the canonical self-checks.
