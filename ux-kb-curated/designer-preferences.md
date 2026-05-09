---
type: cross-project designer preference
last_updated: 2026-05-08
---

<!--
Designer-level preferences observed across multiple projects.
This file lives in ux-kb-curated/ — shared by all projects (NOT project-scoped).

Two-tier structure (inspired by GenericAgent's L1 hard cap pattern):
- Always-on:  high-frequency preferences. The skill loads these into every discussion.
- On-demand:  low-frequency keyword stubs. Only loaded when a keyword triggers.

Promotion rule: a preference graduates here when seen consistently in ≥2 projects.
The skill proposes promotion (e.g., "你在 3 个项目里都倾向 mermaid，要 promote 吗？"); designer confirms.

Each entry: id (p-<n>), content, source (project ids or conversation refs), date.

Maintenance: keep Always-on small (< 30 lines) so it doesn't bloat the system prompt.
On-demand can grow larger — only the keyword stubs ship by default.
-->

# Always-on

<!-- Examples (uncomment and edit when promoted):

- id: p-001
  content: 倾向用 mermaid 可视化用户流（对比文字描述）
  source: ["alternate-routing", "conv-2026-04-20"]
  date: 2026-04-20

- id: p-002
  content: ux-onepage 偏好简洁，避免冗长背景叙述（200 字内）
  source: ["conv-2026-05-02", "conv-2026-05-08"]
  date: 2026-05-02

-->

# On-demand

<!--
Keyword stubs — full content lives in this file, only the keyword line gets injected normally.
Format: <keyword> :: <one-line summary>

Examples:
- "table-vs-card" :: 数据密度高的场景倾向 table，密度低用 card；详见 stub-table-vs-card 段
- "modal-vs-page" :: 简单决策用 modal，多步骤用 page；详见 stub-modal-vs-page 段

## stub-table-vs-card

(详细内容写在这里，只有当对话提到 "table"、"card"、"data display" 等关键词时被加载)

## stub-modal-vs-page

(详细内容写在这里)
-->
