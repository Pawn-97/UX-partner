---
name: ux-discovery
description: UX discovery partner for Cursor. Use for /ux-project:* command-like requests, PM PRD analysis, UX discovery, 需求拆解, 需求理解, JTBD 梳理, PRD 分析, ux-onepage, UX 一图流, IA 架构, 交互流程, design brief, or discovery partner requests. Produces KB-grounded ux-onepage.md, ux-onepage.html, and design-brief.md while staying upstream of hi-fi UI, Figma, and frontend work.
---

# UX Discovery Partner — Cursor Adapter

This is the Cursor entrypoint. The canonical workflow, command procedures, templates, and operating principles live under `.claude-plugin/`. Cursor must stay a thin adapter so Claude Code, Codex, and Cursor keep the same behavior.

## Activation

When this skill is invoked:

1. Read `.claude-plugin/skills/ux-discovery/SKILL.md` before substantive work.
2. If the user typed a command-like request, read the matching canonical command file:
   - `/ux-project:setup-kb` → `.claude-plugin/commands/setup-kb.md`
   - `/ux-project:start` → `.claude-plugin/commands/start.md`
   - `/ux-project:resume` → `.claude-plugin/commands/resume.md`
   - `/ux-project:refine` → `.claude-plugin/commands/refine.md`
   - `/ux-project:add-context` → `.claude-plugin/commands/add-context.md`
   - `/ux-project:export-html` → `.claude-plugin/commands/export-html.md`
   - `/ux-project:handoff` → `.claude-plugin/commands/handoff.md`
   - `/ux-project:update` → see "Cursor update behavior" below.
3. Execute the canonical procedure with the Cursor mappings below.

## Cursor Mappings

- `AskUserQuestion` → Cursor `AskQuestion` when available. Preserve the same decision point and 2-5 concrete options. Cursor's picker has no true free-text fallback, so include an `other` option like "其他，我补充"; if selected, ask one concise follow-up and wait.
- `Read` → `ReadFile`.
- `Write` / `Edit` → `ApplyPatch` for hand-written edits, or the narrowest available file-editing tool.
- `Glob` → `Glob`.
- `Grep` → `rg`.
- `Bash` → `Shell`, always from the repository root.
- `ctx_search` / `ctx_index` → prefer context-mode MCP/tools when available. If unavailable in Cursor, use the local fallback scripts below instead of bulk-reading the KB.

## Local KB Fallback For Cursor

Use this only when Cursor does not expose context-mode `ctx_search` / `ctx_index`.

- During `/ux-project:setup-kb`, run the canonical classifier first:
  `node .claude-plugin/scripts/index-to-context-mode.js "<kb-path>"`
- Then build the local index:
  `node .claude-plugin/scripts/local-kb-index.js kb-index-manifest.json`
- Treat local index build as the Cursor equivalent of `ctx_index`.
- For every canonical `ctx_search` call, run:
  `node .claude-plugin/scripts/local-kb-search.js "<query>" 5`
- Use the returned `source_label`, path, line range, and excerpt as the search hit. Keep the same source-quality rules from the canonical skill.
- If `.kb-local-index.json` is missing when search is required, stop and ask the designer to run `/ux-project:setup-kb <kb-path>`.

## Cursor Command Behavior

Cursor slash commands live in `.cursor/commands/*.md`. The repository provides thin command files for `/ux-project:*` so they can appear in Cursor's `/` menu. If the user types `/ux-project:*` as plain chat text, treat it as the same invocation and run the mapped canonical command.

For `/ux-project:update` in Cursor, do not run Claude Code or Codex plugin-manager commands. Cursor uses this repository directly. Instead:

1. Check whether the repository has local changes.
2. Ask the designer before pulling remote updates.
3. If approved, update the repository with normal git operations, preserving `projects/`, `ux-kb-curated/`, KB index artifacts, and local settings.
4. Report only whether the update completed; do not expose cache paths, commit hashes, or release labels in the user-facing report.

## Rules Not To Loosen

- Always work from the repository root; never run plugin workflows from `projects/<name>/`.
- Do not silently write memory, decisions, assumptions, or questions.
- Do not advance approval points without explicit designer confirmation.
- Keep `state.md` as the small resume gateway.
- Use `ctx_search` before reading large KB content.
- Keep `ux-onepage.md` source-grounded and HTML as a clean stakeholder view derived from it.
- Do not generate hi-fi UI, Figma artifacts, visual design, or frontend code.
