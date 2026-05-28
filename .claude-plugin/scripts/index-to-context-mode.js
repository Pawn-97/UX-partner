#!/usr/bin/env node

// index-to-context-mode.js
//
// Walks a markdown knowledge base, classifies each file by source_quality,
// and emits two artifacts:
//
//   1. kb-classification.md  — human-readable report (counts, sample paths per bucket)
//   2. kb-index-manifest.json — machine-readable manifest used by Claude to call
//                                ctx_index on each file with the right quality tag
//
// Run this once per KB. Re-running is safe (idempotent) — ctx_index uses content
// hashes, so unchanged files are no-ops on the indexing side.
//
// Usage:
//   node index-to-context-mode.js <kb-root> [output-dir]
//
// Example:
//   node index-to-context-mode.js "/Users/GuanchengDing/Phone-KnowledgeBase/Phone- KnowledgeBase"
//
// Next step (after this script runs):
//   Open Claude Code in the design-partner directory and say:
//     "Index the KB using kb-index-manifest.json — call ctx_index for each
//      entry with source label '[<quality>] <relative-path>', batching every
//      ~50 calls."
//   Claude will read the manifest, walk the entries, and call the
//   mcp__plugin_context-mode_context-mode__ctx_index tool with each file's
//   path + quality-tagged source label.
//
// Cursor fallback:
//   node .claude-plugin/scripts/local-kb-index.js kb-index-manifest.json
//   node .claude-plugin/scripts/local-kb-search.js "<query>" 5

const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────────────────────────────────────
// Classification rules — edit these to match your KB layout.
// First match wins. Files that match no rule are tagged UNCATEGORIZED.
// ──────────────────────────────────────────────────────────────────────────────
const QUALITY_RULES = [
  // ── zoomkb-builder wiki/ output ── first match wins ────────────────
  { pattern: /\/wiki\/index\.md$/, quality: 'META' },
  { pattern: /\/wiki\/concepts\//, quality: 'CONCEPT' },
  { pattern: /\/wiki\/task-flows\//, quality: 'TASK-FLOW' },
  { pattern: /\/wiki\/user-roles\//, quality: 'USER-ROLE' },
  { pattern: /\/wiki\/constraints\//, quality: 'CONSTRAINT' },
  { pattern: /\/wiki\/ux-patterns\//, quality: 'UX-PATTERN' },
  // ── zoomkb-builder raw/ source articles ────────────────────────────
  { pattern: /\/raw\//, quality: 'RAW-SOURCE' },
  // ── zoomkb builder report files ────────────────────────────────────
  { pattern: /\/(crawl|ingest|lint|validate|build)-report\.md$/, quality: 'META' },
  { pattern: /\/log\.md$/, quality: 'META' },
  // ── Phone-KnowledgeBase legacy rules ───────────────────────────────
  { pattern: /\/20-Zoom-Phone-Features\//, quality: 'PRODUCT-DOC' },
  { pattern: /\/40-Templates\//, quality: 'TEMPLATE' },
  { pattern: /\/30-Agent-Playbooks\//, quality: 'PLAYBOOK' },
  { pattern: /\/00-Home\//, quality: 'META' },
  { pattern: /\/10-LLM-Wiki\//, quality: 'META' },
  { pattern: /\/90-Maintenance\//, quality: 'META' },
  // Root-level home/index files (e.g., "Zoom Phone Knowledge Base.md")
  { pattern: /Knowledge Base\.md$/i, quality: 'META' },
];

// Directories to skip entirely.
const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.obsidian',
  '.tools',
  '.trash',
  'dist',
  'build',
  'extraction-queue',
]);

// File patterns to skip (won't be indexed).
const SKIP_FILE_PATTERNS = [
  /\.gitignore$/,
];

// Optional: paths matching this pattern get OUTDATED (still indexable but flagged).
const OUTDATED_PATTERNS = [
  /\/archive\//i,
  /\bdeprecated\b/i,
];

// ──────────────────────────────────────────────────────────────────────────────

function inferQuality(filePath) {
  for (const p of OUTDATED_PATTERNS) {
    if (p.test(filePath)) return 'OUTDATED';
  }
  for (const rule of QUALITY_RULES) {
    if (rule.pattern.test(filePath)) return rule.quality;
  }
  return 'UNCATEGORIZED';
}

function walkMarkdown(rootDir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(rootDir, { withFileTypes: true });
  } catch (e) {
    console.error(`Cannot read directory: ${rootDir} — ${e.message}`);
    return results;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') && !entry.isFile()) {
      // Hidden directories — skip (covers .git, .obsidian, etc.)
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      if (entry.isDirectory()) continue;
    }
    if (SKIP_DIR_NAMES.has(entry.name)) continue;

    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      walkMarkdown(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (SKIP_FILE_PATTERNS.some(p => p.test(entry.name))) continue;
      results.push(fullPath);
    }
  }

  return results;
}

function bytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function main() {
  const kbRoot = process.argv[2];
  const outputDir = process.argv[3] || process.cwd();

  if (!kbRoot) {
    console.error('Usage: node index-to-context-mode.js <kb-root> [output-dir]');
    process.exit(1);
  }

  const absKbRoot = path.resolve(kbRoot);
  if (!fs.existsSync(absKbRoot) || !fs.statSync(absKbRoot).isDirectory()) {
    console.error(`KB root does not exist or is not a directory: ${absKbRoot}`);
    process.exit(1);
  }

  console.log(`Walking ${absKbRoot}...`);
  const files = walkMarkdown(absKbRoot);
  console.log(`Found ${files.length} markdown files.\n`);

  const manifest = files.map(filePath => {
    const stat = fs.statSync(filePath);
    const quality = inferQuality(filePath);
    const relPath = path.relative(absKbRoot, filePath);
    return {
      path: filePath,
      relative_path: relPath,
      quality,
      source_label: `[${quality}] ${relPath}`,
      size_bytes: stat.size,
      last_modified: stat.mtime.toISOString(),
    };
  });

  // Counts by quality
  const counts = {};
  let totalBytes = 0;
  for (const m of manifest) {
    counts[m.quality] = (counts[m.quality] || 0) + 1;
    totalBytes += m.size_bytes;
  }

  // Sample 3 files per quality bucket
  const samples = {};
  for (const m of manifest) {
    if (!samples[m.quality]) samples[m.quality] = [];
    if (samples[m.quality].length < 3) {
      samples[m.quality].push(m.relative_path);
    }
  }

  // Write classification report
  const reportLines = [];
  reportLines.push('# KB Classification Report');
  reportLines.push('');
  reportLines.push(`- KB root: \`${absKbRoot}\``);
  reportLines.push(`- Total markdown files: **${manifest.length}**`);
  reportLines.push(`- Total size: ${bytes(totalBytes)}`);
  reportLines.push(`- Generated: ${new Date().toISOString()}`);
  reportLines.push('');
  reportLines.push('## Counts by quality bucket');
  reportLines.push('');
  reportLines.push('| Quality | Count | Sample paths |');
  reportLines.push('|---|---|---|');
  for (const [q, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    const sampleList = (samples[q] || []).map(p => `\`${p}\``).join('<br>');
    reportLines.push(`| ${q} | ${count} | ${sampleList} |`);
  }
  reportLines.push('');
  reportLines.push('## What each tag means');
  reportLines.push('');
  reportLines.push('- **CONCEPT** — product concepts/features, high confidence, cite as fact');
  reportLines.push('- **TASK-FLOW** — user task steps and dependencies, cite for workflow');
  reportLines.push('- **USER-ROLE** — role/permission definitions, cite for access constraints');
  reportLines.push('- **CONSTRAINT** — design constraints and limitations, cite for feasibility');
  reportLines.push('- **UX-PATTERN** — reusable interaction patterns, cite as design precedent');
  reportLines.push('- **RAW-SOURCE** — original support article, ground truth (cite for authority)');
  reportLines.push('- **PRODUCT-DOC** — high confidence, treat as fact (still cite)');
  reportLines.push('- **TEMPLATE** — structural reference, not factual');
  reportLines.push('- **PLAYBOOK** — process knowledge, not factual');
  reportLines.push('- **META** — maintenance/index info, low value for citing');
  reportLines.push('- **OUTDATED** — do NOT cite without designer approval');
  reportLines.push('- **UNCATEGORIZED** — needs review (consider adding a rule for these paths)');
  reportLines.push('');
  reportLines.push('## Next step');
  reportLines.push('');
  reportLines.push('Open Claude Code in the design-partner directory. Say:');
  reportLines.push('');
  reportLines.push('> Index the KB using `kb-index-manifest.json`. For each entry, call `ctx_index` with the entry\'s `path` and `source` set to `source_label`. Process in batches of 50.');
  reportLines.push('');
  reportLines.push('Claude will read the manifest and call the `mcp__plugin_context-mode_context-mode__ctx_index` tool for each file. ctx_index uses content hashes, so re-indexing unchanged files is a no-op.');
  reportLines.push('');
  reportLines.push('Cursor fallback when context-mode is unavailable:');
  reportLines.push('');
  reportLines.push('```bash');
  reportLines.push('node .claude-plugin/scripts/local-kb-index.js kb-index-manifest.json');
  reportLines.push('node .claude-plugin/scripts/local-kb-search.js "<query>" 5');
  reportLines.push('```');
  reportLines.push('');

  const reportPath = path.join(outputDir, 'kb-classification.md');
  fs.writeFileSync(reportPath, reportLines.join('\n'));
  console.log(`Classification report: ${reportPath}`);

  // Write manifest JSON
  const manifestPath = path.join(outputDir, 'kb-index-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    kb_root: absKbRoot,
    generated: new Date().toISOString(),
    total_files: manifest.length,
    counts,
    files: manifest,
  }, null, 2));
  console.log(`Manifest: ${manifestPath}`);

  console.log('\n--- Summary ---');
  for (const [q, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${q.padEnd(15)} ${count}`);
  }
  console.log('');
  console.log('Next: ask Claude to read kb-index-manifest.json and index each entry via ctx_index.');
  console.log('Cursor fallback: node .claude-plugin/scripts/local-kb-index.js kb-index-manifest.json');
}

main();
