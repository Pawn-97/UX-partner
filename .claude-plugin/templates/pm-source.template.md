---
project: <project-name>
prd_version: v1
valid_from: <YYYY-MM-DD>
valid_to: null
superseded_by: null
source_format: md      # ★ v0.4.4 — md | docx
source_file: null      # ★ v0.4.4 — DOCX 输入时填原始 .docx 路径；MD 输入留 null
assets_dir: null       # ★ v0.4.4 — DOCX 输入时填 ./pm-source-assets；MD 输入留 null
---

<!--
PRD body goes below this line. Do NOT edit anything above the second --- (it's the frontmatter).

Frontmatter rules:
- prd_version: bump to v2, v3, ... when PM provides a new revision. Each version gets its own pm-source-vN.md file.
- valid_from: date PRD became active.
- valid_to: keep null while active. When superseded, fill with date the new version took over.
- superseded_by: when valid_to is set, this should point to the new version's filename, e.g. "./pm-source-v2.md".
- ★ v0.4.4 — source_format: md | docx — DOCX 是经 pandoc 转换后的 markdown，原文档保留只读
- ★ v0.4.4 — source_file: DOCX 输入时记原始路径，方便审计 / re-convert
- ★ v0.4.4 — assets_dir: DOCX 输入时抽出来的图片目录（相对 pm-source.md 的路径）

DO NOT edit the PRD body once written — it's the source of truth. New PM revisions go to a new file.
-->

# <PRD title>

<PRD content here, verbatim from source>
