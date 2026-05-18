---
description: One-shot KB setup. Runs the indexing script on a KB folder, then indexes every classified markdown file into context-mode (FTS5 + source quality tag prefixes). Idempotent; safe to re-run after KB changes.
argument-hint: <kb-root-path>
allowed-tools: Bash, Read, Write, Glob, Grep
---

You are running the `/ux-project:setup-kb` command. This is a one-shot operation that:
1. Walks a markdown KB and classifies every file
2. Indexes each file into `context-mode` via `ctx_index` with quality-tagged `source` labels

## Arguments

`$ARGUMENTS` — should be a single path to the KB root directory.

If missing, ask the designer for the KB path. Don't guess.

## Steps

### 1. Detect KB type and validate

Check for zoomkb-builder wiki/ structure:

```bash
test -d "<kb-path>/wiki" && test -f "<kb-path>/wiki/index.md" && echo "zoomkb-wiki" || echo "generic"
```

If `zoomkb-wiki`: confirm the structure looks right:

```bash
ls -d <kb-path>/wiki/concepts/ <kb-path>/wiki/task-flows/ <kb-path>/wiki/user-roles/ <kb-path>/wiki/constraints/ <kb-path>/wiki/ux-patterns/ 2>&1
```

Then tell the designer:

```
检测到 zoomkb-builder wiki 结构:
  concepts/ task-flows/ user-roles/ constraints/ ux-patterns/

分类 tag:
  CONCEPT TASK-FLOW USER-ROLE CONSTRAINT UX-PATTERN RAW-SOURCE META
```

If generic KB (no wiki/index.md), proceed as normal.

If path missing → stop, ask for correction.

### 2. Run the classification script

Locate the script:

```bash
ls .claude-plugin/scripts/index-to-context-mode.js 2>&1
```

If found, run it:

```bash
node .claude-plugin/scripts/index-to-context-mode.js "<kb-path>"
```

The script writes `kb-classification.md` and `kb-index-manifest.json` into the current working directory (which is the design-partner project root). Both are gitignored — local artifacts only.

### 3. Show classification summary

Read `kb-classification.md` and surface the counts table to the designer:

```
KB classification:
- PRODUCT-DOC: <n>
- TEMPLATE: <n>
- PLAYBOOK: <n>
- META: <n>
- OUTDATED: <n>
- UNCATEGORIZED: <n>
Total: <n> markdown files
```

If `UNCATEGORIZED` is non-zero, list the file paths. **★ v0.3 — fire `AskUserQuestion`** (SKILL.md § Question UI contract):

```
AskUserQuestion({
  question: "<n> 个文件未分类。怎么处理？",
  options: [
    { label: "▶️ Continue",   description: "按 UNCATEGORIZED 入库，索引继续" },
    { label: "⏸ Wait for rules", description: "我先在 .claude-plugin/scripts/index-to-context-mode.js 加规则，再重跑" },
    { label: "⊘ Skip uncategorized", description: "只索引已分类文件，UNCATEGORIZED 跳过" }
  ],
  allow_other: true
})
```

### 4. Confirm before bulk indexing

Show plain-text stats:
```
即将调用 ctx_index <total> 次（每文件一次）。
- 估时: ~1-2 分钟 (取决于网络和文件大小)
- 幂等: 重复跑不会重复入库（ctx_index 用内容哈希去重）
```

**★ v0.3 — Then fire `AskUserQuestion`** (SKILL.md § Question UI contract):

```
AskUserQuestion({
  question: "Bulk index <total> 个文件，继续吗？",
  options: [
    { label: "✅ Go",    description: "开始 ctx_index" },
    { label: "❌ Cancel", description: "取消，不索引" }
  ],
  allow_other: true
})
```

### 5. Read the manifest

```
Read: kb-index-manifest.json
```

It has structure:
```json
{
  "kb_root": "...",
  "total_files": <n>,
  "counts": { "PRODUCT-DOC": <n>, ... },
  "files": [
    { "path": "...", "relative_path": "...", "quality": "...", "source_label": "[QUALITY] relative_path", ... },
    ...
  ]
}
```

### 6. Index in batches

For each entry in `manifest.files`, call:

```
mcp__plugin_context-mode_context-mode__ctx_index({
  path: <entry.path>,
  source: <entry.source_label>
})
```

**Process in batches of 50** to make progress visible. After each batch, print:
```
Indexed <50*n>/<total> ...
```

If any single ctx_index call fails (returns error), log the path + error to a list but **continue with the rest**. Don't let one bad file abort the whole batch.

### 7. Report final stats

After all files processed:

```markdown
## ✅ KB indexing complete

- Total files: <n>
- Successfully indexed: <n>
- Failed: <n>
- Skipped (no-op, already indexed with same content): <approx, if visible>

Duration: <m>m <s>s

Failures (if any):
- <path>: <error>
- ...

KB is now searchable via ctx_search. Try:
> ctx_search 一下 "<some keyword from your domain>"
```

### 8. Save a setup-stamp file (optional, for tooling)

Write `.kb-setup-stamp` to project root so future commands know KB is set up:
```
last_indexed: <YYYY-MM-DD HH:MM>
total_files: <n>
kb_root: <path>
```

(Add `.kb-setup-stamp` to `.gitignore` if not already.)

## Failure modes

- KB path missing → stop, ask for correction
- Script not found in `.claude-plugin/scripts/` → tell designer the plugin install may be incomplete
- `node` not available → suggest `brew install node` or equivalent
- ctx_index failures > 5% of total → stop and surface; likely indicates a config issue
- Designer says "no" at confirm → stop, no indexing happens

## What NOT to do

- Don't bulk-load file CONTENTS into context. ctx_index reads files itself when given `path`.
- Don't try to embed all 640 files into the prompt — that defeats the purpose of indexing.
- Don't silently skip files. Log every failure.
- Don't run if confirmation is unclear. "yes" / "确认" / "go" required.
