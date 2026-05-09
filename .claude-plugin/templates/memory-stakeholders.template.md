---
project: <project-name>
type: stakeholders
last_updated: <YYYY-MM-DD>
---

<!--
Project-level context-memory: WHO matters in this project and what they've said.

Write trigger paths:
- /ux-project:add-context (manual, primary entry)
- auto-propose batched (default every 5 discussion rounds, see SKILL.md)
- read-triggered propose (when the skill reads this file mid-discussion)

Each entry must include: id, content, source, confidence, prd_version_at_write, status, date.
The skill must propose each entry to the designer and get explicit confirm before writing.

Status values: active | archived | superseded-by:<id>
- active   → can be cited in ux-onepage.md
- archived → designer rejected or no longer relevant; readable, NOT citable
- superseded-by:<new-id> → replaced by a newer entry; readable, NOT citable

ID prefix: m-stk-<n>
-->

# Active

<!-- Sample:
- id: m-stk-001
  content: PM Alice 强调 mobile-first，desktop 推到 v2
  source: "conv-2026-05-08"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-08
-->

# Archived / Superseded

<!-- Sample:
- id: m-stk-002
  content: Eng lead Bob 早期说 API 支持分页 → 2026-05-10 推翻
  source: "eng-feedback-2026-05-08"
  confidence: medium
  prd_version_at_write: v1
  status: superseded-by:m-stk-005
  date: 2026-05-08
-->
