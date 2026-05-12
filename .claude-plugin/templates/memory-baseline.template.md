---
project: <project-name>
type: baseline
last_updated: <YYYY-MM-DD>
---

<!--
★ v0.4 — Project-level context-memory: online behavior baseline.

This captures what currently exists in production / in the real world today, BEFORE the new PRD ships.
The skill MUST gather this in Phase 1 (Understand & Expand). Without baseline, scenario expansion is grounded in guesses, not reality.

Sources to record:
- Existing product features / workflows that users currently use (cite to internal docs / screenshots / KB)
- Current quantitative metrics (DAU/MAU, conversion, retention, latency — whatever's relevant)
- Existing user workarounds (how users solve this today WITHOUT the planned feature)
- Competitor / adjacent product behaviors (if relevant — cite to comp analysis or KB)
- Known pain points / support tickets / NPS verbatims about the current state

Each entry must include: id, content, source, confidence, prd_version_at_write, status, date.

Status values: active | archived | superseded-by:<id>
ID prefix: m-bsl-<n>

When ux-onepage.md cites a baseline entry with status != active, cite-check blocks generation.

Why this matters:
- Avoids designing in a vacuum (over-correcting from PM's framing alone)
- Surfaces "current users already do X workaround" — that's the real competitor, not nothing
- Makes Phase 2 evaluation rubric (User Value × Impl Cost × Strategic Fit) grounded in reality
- Feeds the "Current Behavior" section of ux-onepage.md
-->

# Active

<!-- Sample entries:
- id: m-bsl-001
  content: 当前线上版本无 status 提示，用户通过反复刷新页面判断任务是否完成；平均刷新 3.2 次/任务
  source: "product-analytics:dashboard-2026-04, support-tickets:Q1-2026"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-12

- id: m-bsl-002
  content: 现有 admin workflow 完成一次任务平均耗时 4 分 17 秒；70% 时间花在切换 tab 上
  source: "user-research:admin-shadowing-2026-03-15"
  confidence: high
  prd_version_at_write: v1
  status: active
  date: 2026-05-12

- id: m-bsl-003
  content: 35% 用户在第一次失败后放弃，不再重试 — 没有错误信息引导
  source: "product-analytics:funnel-2026-Q1"
  confidence: medium
  prd_version_at_write: v1
  status: active
  date: 2026-05-12

- id: m-bsl-004
  content: 竞品 X 在同样场景下提供 inline 进度条 + 可撤销操作；NPS 在该 surface +18 vs 我方
  source: "competitive-brief:2026-Q1-feature-comparison"
  confidence: medium
  prd_version_at_write: v1
  status: active
  date: 2026-05-12
-->

# Archived / Superseded

<!-- Move entries here when superseded by a newer baseline observation, or when the baseline situation itself changes (e.g., a prior version of the product shipped and the metric is now obsolete). -->
