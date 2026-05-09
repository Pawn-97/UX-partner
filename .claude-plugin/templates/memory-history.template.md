---
project: <project-name>
type: history
last_updated: <YYYY-MM-DD>
---

<!--
Project-level context-memory: timeline of significant events affecting this project.

Examples worth recording:
- PRD version bump (v1 → v2)
- Scope change (feature added or cut)
- Major decision reversal
- Stakeholder change (new PM, new Eng lead)
- External constraint surfacing
- Onepage regeneration with substantial diff

Each entry must include: id, content, source, confidence, prd_version_at_write, status, date.

Status values: active | archived (rare for history; events don't typically get superseded)
ID prefix: m-hst-<n>
-->

# Active

<!-- Sample:
- id: m-hst-001
  content: PRD v1 → v2，PM 删除 calling 集成场景，主用户从 admin 改为 end-user
  source: "pm-source-v2.md frontmatter + conv-2026-05-15"
  confidence: high
  prd_version_at_write: v2
  status: active
  date: 2026-05-15

- id: m-hst-002
  content: Eng team confirmed API 不会在 v1 实现 list view → 设计转向 stream view
  source: "eng-meeting-2026-05-12"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-12
-->

# Archived / Superseded
