# /ux-project:resume

Resume a UX discovery project.

## Arguments

- `project_name`: required unless the active project is unambiguous.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/resume.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Keep resume lightweight: read `state.md` first, then only read other project files if the designer chooses that path.
