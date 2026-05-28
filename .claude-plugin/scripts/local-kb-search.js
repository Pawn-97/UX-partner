#!/usr/bin/env node

// Searches .kb-local-index.json. This is a Cursor fallback for ctx_search.

const fs = require('fs');
const path = require('path');

const QUALITY_WEIGHT = {
  CONCEPT: 1.25,
  'TASK-FLOW': 1.25,
  'USER-ROLE': 1.2,
  CONSTRAINT: 1.2,
  'UX-PATTERN': 1.15,
  'RAW-SOURCE': 1.1,
  'PRODUCT-DOC': 1.05,
  TEMPLATE: 0.7,
  PLAYBOOK: 0.75,
  META: 0.3,
  OUTDATED: 0.2,
  UNCATEGORIZED: 0.8,
};

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'how', 'in',
  'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'what', 'when',
  'where', 'who', 'why', 'with',
]);

function usage() {
  console.error('Usage: node .claude-plugin/scripts/local-kb-search.js "<query>" [limit] [index-path]');
}

function tokenize(input) {
  const raw = input.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) || [];
  const tokens = [];

  for (const token of raw) {
    if (STOP_WORDS.has(token)) continue;
    tokens.push(token);

    // Basic CJK support without external segmentation.
    if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(token)) {
      for (let i = 0; i < token.length - 1; i++) {
        tokens.push(token.slice(i, i + 2));
      }
    }
  }

  return [...new Set(tokens)];
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) !== -1) {
    count += 1;
    index += needle.length;
  }
  return count;
}

function excerpt(text, terms) {
  const lower = text.toLowerCase();
  const firstHit = terms
    .map(term => lower.indexOf(term))
    .filter(index => index >= 0)
    .sort((a, b) => a - b)[0];

  const start = firstHit >= 0 ? Math.max(0, firstHit - 220) : 0;
  const end = Math.min(text.length, start + 700);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.slice(start, end).trim()}${suffix}`.replace(/\n{3,}/g, '\n\n');
}

function scoreChunk(chunk, query, terms) {
  const text = chunk.text.toLowerCase();
  const pathText = `${chunk.relative_path} ${chunk.source_label}`.toLowerCase();
  let score = 0;

  if (text.includes(query)) score += 8;
  if (pathText.includes(query)) score += 4;

  for (const term of terms) {
    score += countOccurrences(text, term);
    score += countOccurrences(pathText, term) * 2;
  }

  return score * (QUALITY_WEIGHT[chunk.quality] || 1);
}

function main() {
  const queryArg = process.argv[2];
  const limit = Number.parseInt(process.argv[3] || '5', 10);
  const indexPath = path.resolve(process.argv[4] || '.kb-local-index.json');

  if (!queryArg) {
    usage();
    process.exit(1);
  }

  if (!fs.existsSync(indexPath)) {
    console.error(`Local KB index not found: ${indexPath}`);
    console.error('Run /ux-project:setup-kb first, or build it with local-kb-index.js.');
    process.exit(2);
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const query = queryArg.toLowerCase();
  const terms = tokenize(queryArg);

  const results = (index.chunks || [])
    .map(chunk => ({ chunk, score: scoreChunk(chunk, query, terms) }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Number.isFinite(limit) ? limit : 5);

  console.log(`# Local KB Search`);
  console.log(`Query: ${queryArg}`);
  console.log(`Results: ${results.length}`);
  console.log('');

  for (const [i, result] of results.entries()) {
    const chunk = result.chunk;
    console.log(`## ${i + 1}. ${chunk.source_label}`);
    console.log(`- Path: ${chunk.path}`);
    console.log(`- Lines: ${chunk.line_start}-${chunk.line_end}`);
    console.log(`- Score: ${result.score.toFixed(2)}`);
    console.log('');
    console.log(excerpt(chunk.text, terms));
    console.log('');
  }
}

main();
