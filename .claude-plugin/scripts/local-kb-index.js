#!/usr/bin/env node

// Builds a local, dependency-free KB search index from kb-index-manifest.json.
// This is the Cursor fallback when context-mode ctx_index is not available.

const fs = require('fs');
const path = require('path');

const CHUNK_LINES = 80;
const OVERLAP_LINES = 10;

function usage() {
  console.error('Usage: node .claude-plugin/scripts/local-kb-index.js <kb-index-manifest.json> [output-path]');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function chunkFile(entry, idStart) {
  let text;
  try {
    text = fs.readFileSync(entry.path, 'utf8').replace(/\r\n/g, '\n');
  } catch (error) {
    return { chunks: [], error: `${entry.path}: ${error.message}` };
  }

  const lines = text.split('\n');
  const chunks = [];
  let id = idStart;

  for (let start = 0; start < lines.length; start += CHUNK_LINES - OVERLAP_LINES) {
    const slice = lines.slice(start, start + CHUNK_LINES);
    const body = slice.join('\n').trim();
    if (!body) continue;

    chunks.push({
      id: `chunk-${String(id++).padStart(6, '0')}`,
      path: entry.path,
      relative_path: entry.relative_path,
      quality: entry.quality,
      source_label: entry.source_label,
      line_start: start + 1,
      line_end: Math.min(start + slice.length, lines.length),
      text: body,
    });
  }

  return { chunks, error: null };
}

function main() {
  const manifestPath = process.argv[2];
  const outputPath = process.argv[3] || path.resolve(process.cwd(), '.kb-local-index.json');

  if (!manifestPath) {
    usage();
    process.exit(1);
  }

  const manifest = readJson(path.resolve(manifestPath));
  if (!Array.isArray(manifest.files)) {
    console.error('Invalid manifest: expected a files array.');
    process.exit(1);
  }

  const chunks = [];
  const failures = [];

  for (const entry of manifest.files) {
    const result = chunkFile(entry, chunks.length + 1);
    chunks.push(...result.chunks);
    if (result.error) failures.push(result.error);
  }

  const index = {
    kind: 'ux-partner-local-kb-index',
    generated: new Date().toISOString(),
    kb_root: manifest.kb_root,
    total_files: manifest.total_files,
    total_chunks: chunks.length,
    counts: manifest.counts,
    chunking: {
      chunk_lines: CHUNK_LINES,
      overlap_lines: OVERLAP_LINES,
    },
    chunks,
  };

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));

  console.log(`Local KB index: ${outputPath}`);
  console.log(`Files: ${manifest.files.length}`);
  console.log(`Chunks: ${chunks.length}`);
  if (failures.length > 0) {
    console.log(`Failures: ${failures.length}`);
    for (const failure of failures.slice(0, 10)) console.log(`- ${failure}`);
  }
}

main();
