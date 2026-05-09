---
project: <project-name>
created: <YYYY-MM-DD>
---

<!--
Append-only raw context supplements. NEVER edit past entries.

Purpose: full audit trail of every context supplement, BEFORE classification.
memory/<file>.md holds the structured/confirmed entries. background.md holds the raw originals.

Each block records:
- Timestamp + source (manual /ux-project:add-context vs auto-propose batch)
- Raw content from designer (or upstream/downstream colleague feedback)
- Which memory entries were extracted from it (for traceability)

Block format:

# <YYYY-MM-DD HH:MM> — 来自 <source>

原始内容：
> <verbatim raw text or file excerpt>

提取的 memory 条目：
- <id> → memory/<file>.md (one-line content)

---

If no memory entries were extracted (designer rejected all proposed classifications), still
keep the raw block — the audit trail matters even when nothing got structured.
-->

<!-- Sample block:

# 2026-05-08 14:32 — 来自 /ux-project:add-context

原始内容：
> 刚和 PM Alice 聊完。她明确说 mobile-first 是 v1 唯一目标，desktop 推到 v2。
> Eng 反馈 API 不支持 list view 分页，需要前端做无限滚动。

提取的 memory 条目（已 confirm）：
- m-stk-001 → memory/stakeholders.md (PM Alice mobile-first 偏好)
- m-cst-001 → memory/constraints.md (API 不支持分页)

---
-->
