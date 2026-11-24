import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const SPEC = 'SPEC.md';
const DECISIONS = 'DECISIONS.md';
const DISPATCHER = 'playbooks/GROK_DISPATCHER.md';
const BRIEF = 'playbooks/THREAD_BRIEF_TEMPLATE.md';
const RUBRIC = 'playbooks/ASTRA_PLAYTEST_RUBRIC.md';
const MORNING = 'playbooks/MORNING_REPORT_TEMPLATE.md';
const MARKDOWN_FILES = [SPEC, DECISIONS, DISPATCHER, BRIEF, RUBRIC, MORNING];
const OWNED_FILES = [...MARKDOWN_FILES, 'tests/playbooks.test.mjs'];

const BRIEF_LABELS = [
  'goal:',
  'files in scope:',
  'files out of scope:',
  'done-when:',
  'budget:',
  'who reviews:',
];

const ROUTES = [
  ['New feature', 'Fable 5.2', 'Opus 5.5', 'cursor/claude-fable-5-2', 'cursor/claude-opus-5-5', 'antigravity/claude-opus-5-5'],
  ['Code, tests, refactors', 'Opus 5.5', 'cursor/claude-opus-5-5', 'antigravity/claude-opus-5-5'],
  ['Every diff', 'GPT-6.2 Astra', 'codex/gpt-6.2-astra'],
  ['Docs, README, release notes', 'Gemini 4 Neon', 'antigravity/gemini-4-neon'],
  ['Checks across machines', 'gemini-3.8-flash', 'antigravity/gemini-3.8-flash'],
  ['Questions, summaries, plans', 'Grok Bot', 'grok/grok-4.7'],
];

const MORNING_HEADINGS = [
  '# Morning Report - <YYYY-MM-DD>',
  '## Fleet Health',
  '## PR Triage',
  '## Needs Approval',
  '## Blocked',
  '## Next Up',
  '## Phone Line',
];

const REQUIRED_DECISIONS = [
  'Scope',
  'Disk Guardrail',
  'Provider Mapping',
  'PR Bottleneck Triage',
  'Phone Channel',
  'Reclaimable Worktree Bloat',
  'Safe Repo Hygiene',
  'Lead Provider Fallback',
  'Lead Provider Fallback #2',
  'Three Disjoint Branches',
  'PR Count Correction',
  'No package.json, no tracked .gitignore',
];

const SECRET_PATTERNS = [
  /discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/i,
  /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/,          // Telegram bot token
  /\bghp_[A-Za-z0-9]{36}\b/, /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/, /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /ntfy\.sh\/(?!<)[A-Za-z0-9_-]{6,}/,          // concrete ntfy topic
  /https?:\/\/[^\s)'"`]*\/(?:webhooks?|hooks)\/[^\s)'"`<]+/i // concrete webhook URL
];

function readOwnedFile(file) {
  return readFileSync(join(import.meta.dirname, '..', file), 'utf8').replace(/\r\n/g, '\n');
}

function firstFencedBlock(file) {
  const block = readOwnedFile(file).match(/^```[^\n]*\n([\s\S]*?)^```$/m);
  assert.ok(block, file + ' must contain a fenced block');
  return block[1];
}

test('all six owned Markdown files exist and are non-empty', () => {
  for (const file of MARKDOWN_FILES) {
    assert.ok(readOwnedFile(file).trim(), file + ' must be non-empty');
  }
});

test('each Markdown file has its required headings in order', () => {
  const headingsByFile = {
    [SPEC]: [
      '# SPEC.md - Fleet HQ Infrastructure Split (3 Disjoint PR Branches)',
      '## 0. Ground Truth From Inspection (read-only)',
      '## 1. Global Rules (apply to every branch)',
      '## 2. File Ownership Matrix (exhaustive, zero overlap)',
      '## 3. Shared Algorithms (normative; B1 implements, B2/B3 document identically)',
      '## 4. Branch Specifications',
      '### 4.2 Branch 2 - `feat/fleet-playbooks` (Opus 5.5 #2)',
      '#### 4.2.1 `SPEC.md`',
      '#### 4.2.2 `DECISIONS.md`',
      '#### 4.2.3 `playbooks/GROK_DISPATCHER.md`',
      '#### 4.2.4 `playbooks/THREAD_BRIEF_TEMPLATE.md`',
      '#### 4.2.5 `playbooks/ASTRA_PLAYTEST_RUBRIC.md`',
      '#### 4.2.6 `playbooks/MORNING_REPORT_TEMPLATE.md`',
      '#### 4.2.7 `tests/playbooks.test.mjs` (required assertions)',
      '## 5. Canonical Constants (duplicate verbatim as literals in tests)',
      '## 6. Secret Scan (identical helper in all 3 test files)',
      '## 7. Verification and Handoff',
    ],
    [DECISIONS]: ['# Fleet Decisions Log'],
    [DISPATCHER]: [
      '# Grok Dispatcher Playbook', '## Role', '## Intake', '## Routing Table',
      '## Dispatch Procedure', '## Approval Gates', '## Stuck Thread Watchdog',
      '## Escalation', '## Phone Pings',
    ],
    [BRIEF]: [
      '# Thread Brief Template', '## Field Rules',
      ...BRIEF_LABELS.map((label) => '### ' + label),
      '## Example',
    ],
    [RUBRIC]: [
      '# Astra Playtest Rubric', '## Checklist', '## Output Format',
      '## Loop Rules', '## Read-Only Guarantee',
    ],
    [MORNING]: ['# Morning Report Template', ...MORNING_HEADINGS, '## Generation'],
  };

  for (const [file, headings] of Object.entries(headingsByFile)) {
    const lines = readOwnedFile(file).split('\n');
    assert.equal(lines[0], headings[0], file + ' title');
    let previousIndex = 0;
    for (const heading of headings.slice(1)) {
      const index = lines.indexOf(heading, previousIndex + 1);
      assert.ok(index > previousIndex, file + ' missing or out of order: ' + heading);
      previousIndex = index;
    }
  }
});

test('the thread brief block has exactly the six field labels in order', () => {
  const block = firstFencedBlock(BRIEF);
  const labels = block.match(/^[^:\n]+:/gm);
  assert.deepEqual(labels, BRIEF_LABELS);
});

test('the routing table covers all six triggers and canonical models', () => {
  const lines = readOwnedFile(DISPATCHER).split('\n');
  const start = lines.indexOf('| Trigger | Route To | Provider/Model | Fallback |');
  assert.ok(start >= 0, 'routing table header');

  for (const [index, [trigger, ...canonicalStrings]] of ROUTES.entries()) {
    const row = lines[start + 2 + index];
    assert.ok(row?.startsWith('| ' + trigger + ' | '), 'routing row for ' + trigger);
    for (const literal of canonicalStrings) {
      assert.ok(row.includes(literal), trigger + ' is missing ' + literal);
    }
  }
  assert.ok(!lines[start + 2 + ROUTES.length]?.startsWith('|'), 'exactly six routing rows');
});

test('the dispatcher and spec include the approval gates and phone format', () => {
  for (const file of [DISPATCHER, SPEC]) {
    const content = readOwnedFile(file);
    for (const gate of ['supervised', 'migrations', 'deploys', 'deletes', 'spend']) {
      assert.ok(content.toLowerCase().includes(gate), file + ' is missing ' + gate);
    }
    assert.ok(content.includes('Auto runtime mode allowed only inside an isolated worktree'));
    assert.ok(content.includes('<what> | <where> | <diff or PR link>'));
  }
});

test('the Astra review block uses the exact output format', () => {
  const expected = [
    'CRITICAL (block merge):',
    '- <finding> [file:line]',
    '',
    'IMPORTANT (fix before merge):',
    '- <finding> [file:line]',
    '',
    'MINOR:',
    '- <finding> [file:line]',
    '',
    'VERDICT: BLOCK | APPROVE',
    '',
  ].join('\n');
  assert.equal(firstFencedBlock(RUBRIC), expected);
});

test('the morning report block has exactly seven canonical headings', () => {
  assert.deepEqual(firstFencedBlock(MORNING).match(/^#{1,6} .+$/gm), MORNING_HEADINGS);
});

test('the decisions log has ordered IDs and required fields', () => {
  const [, ...sections] = readOwnedFile(DECISIONS).split(/^## /m);
  assert.ok(sections.length >= REQUIRED_DECISIONS.length, 'required decisions are missing');

  for (const [index, section] of sections.entries()) {
    const id = 'D-' + String(index + 1).padStart(3, '0');
    const [heading, decision, why, status, ...remainingLines] = section.trimEnd().split('\n');
    const fields = heading.match(/^(D-\d{3}) \| \d{4}-\d{2}-\d{2} \| (.+)$/);
    assert.equal(fields?.[1], id, 'decision heading: ' + heading);
    if (index < REQUIRED_DECISIONS.length) {
      assert.equal(fields[2], REQUIRED_DECISIONS[index], id + ' title');
    }
    assert.match(decision ?? '', /^- \*\*Decision\*\*: \S/, id);
    assert.match(why ?? '', /^- \*\*Why\*\*: \S/, id);
    assert.match(status ?? '', /^- \*\*Status\*\*: (Accepted|Superseded|Pending-Approval)$/, id);
    assert.deepEqual(remainingLines, [], id + ' has exactly three bullets');
    if (id === 'D-006') {
      assert.equal(status, '- **Status**: Pending-Approval');
    }
  }
});

test('the spec includes the canonical CRC vector, port formula, and branches', () => {
  const spec = readOwnedFile(SPEC);
  for (const literal of [
    '0x29B1', '3100 + (crc16(branch) % 800)',
    'feat/fleet-ops-and-registry', 'feat/fleet-playbooks', 'docs/fleet-team-manual',
  ]) {
    assert.ok(spec.includes(literal), SPEC + ' is missing ' + literal);
  }
});

test('the seven owned files contain no secrets', () => {
  for (const file of OWNED_FILES) {
    const content = readOwnedFile(file);
    for (const pattern of SECRET_PATTERNS) {
      assert.ok(!pattern.test(content), file + ' matches secret pattern ' + pattern);
    }
  }
});
