# /ux-project:add-context

Append new context to a UX discovery project and propose memory writes.

## Arguments

- `project_name`: optional when there is one active project.
- `text_or_path`: required inline context or file path.

## Workflow

1. Read `.cursor/skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/skills/ux-discovery/SKILL.md`.
3. Read `.claude-plugin/commands/add-context.md`.
4. Execute the canonical command with the user arguments, applying the Cursor adapter rules.
5. Never append to memory, decisions, assumptions, or questions until the designer explicitly confirms each proposed entry.
