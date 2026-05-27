---
name: ux-discovery
description: UX discovery partner for designers. Use when a PM PRD needs to become a cited ux-onepage.md, ux-onepage.html, or design-brief.md before downstream UI, Figma, or frontend work. Also use for /ux-project:* commands, 需求拆解, 需求理解, JTBD 梳理, PRD 分析, ux-onepage, ux 一图流, IA 架构, 交互流程, design brief, or discovery partner requests.
---

# UX Discovery Partner — Codex Adapter

This is the Codex entrypoint. The canonical workflow, operating principles, templates, and command procedures live under `.claude-plugin/` so Claude Code and Codex stay aligned. When this skill is invoked:

1. Read `.claude-plugin/skills/ux-discovery/SKILL.md` before doing substantive work.
2. Follow the canonical rules there, with these Codex compatibility mappings:
   - Treat `AskUserQuestion` as "use Codex's structured question UI when available; otherwise ask one concise question with the same labelled options and wait for the user's explicit choice."
   - Treat Claude tool names (`Read`, `Write`, `Edit`, `Glob`, `Grep`, `Bash`) as the equivalent Codex file and shell tools.
   - Treat `ctx_search` / `ctx_index` as required KB tools. If the current Codex session does not expose them, stop and report the missing tool instead of silently bulk-reading the KB.
   - Keep all commands rooted at the repository root. Do not `cd projects/<name>/` for plugin work.
3. For a slash command, read the matching canonical command file in `.claude-plugin/commands/` and execute it through this adapter.

Never loosen the core workflow: no silent memory writes, no auto-advance through approval points, no hi-fi UI/Figma/frontend output, and no uncited claims in `ux-onepage.md`.
