---
project: <project-name>
type: constraints
last_updated: <YYYY-MM-DD>
---

<!--
Project-level context-memory: hard constraints binding this project.

Sources to record:
- KB-derived (product limits surfaced via ctx_search)
- Engineering feedback (API limits, perf budgets, platform restrictions)
- Policy / legal / compliance (data retention, region rules, privacy)
- PRD-stated hard requirements (always cite to pm-source.md too)

Each entry must include: id, content, source, confidence, prd_version_at_write, status, date.

Status values: active | archived | superseded-by:<id>
ID prefix: m-cst-<n>

When ux-onepage.md cites a constraint with status != active, cite-check blocks generation.
-->

# Active

<!-- Sample:
- id: m-cst-001
  content: API 不支持 list view 分页，前端必须使用无限滚动
  source: "eng-feedback-2026-05-08-slack"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-08

- id: m-cst-002
  content: 数据保留 ≤90 天（合规要求）
  source: "compliance-doc:retention-policy-2025"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-08
-->

# Archived / Superseded
