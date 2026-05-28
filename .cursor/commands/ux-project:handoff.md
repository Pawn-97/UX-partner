# /ux-project:handoff

Generate `design-brief.md` for downstream UI, Figma, or frontend work.

## Arguments

- `project_name`: optional. Use the active project if the conversation has one clear project.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/handoff.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Do not auto-trigger downstream design skills. The designer chooses when and which downstream path to use.
