# /ux-project:start

Create a UX discovery project from a PRD.

## Arguments

- `project_name`: required kebab-case project name.
- `prd_path`: required `.md` or `.docx` PRD path.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/start.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Do not write confirmed understanding into `state.md` until the designer explicitly approves the summary.
