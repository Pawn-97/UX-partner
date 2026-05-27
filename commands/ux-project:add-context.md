# /ux-project:add-context

Append new context to a project and propose memory writes.

## Arguments

- `project_name`: optional when there is one active project.
- `text_or_path`: required inline context or file path.

## Workflow

1. Read `skills/ux-discovery/SKILL.md`.
2. Read `.claude-plugin/commands/add-context.md`.
3. Execute the canonical command with the user arguments, applying the Codex adapter rules.
4. Never append to memory, decisions, assumptions, or questions until the designer explicitly confirms each proposed entry.
