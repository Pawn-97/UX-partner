# /ux-project:export-html

Render the confirmed `ux-onepage.md` into stakeholder HTML.

## Arguments

- `project_name`: optional. Use the active project if the conversation has one clear project.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/export-html.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Keep this command mechanical: render existing `ux-onepage.md` to HTML, then run the canonical self-checks.
