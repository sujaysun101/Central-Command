import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const TEAM_PATH = path.join(REPO_ROOT, 'TEAM.md');
const CHANGELOG_PATH = path.join(REPO_ROOT, 'CHANGELOG.md');
const TEST_PATH = path.join(REPO_ROOT, 'tests', 'docs.test.mjs');

const OWNED_FILES = [
  { name: 'TEAM.md', filePath: TEAM_PATH },
  { name: 'CHANGELOG.md', filePath: CHANGELOG_PATH },
  { name: 'tests/docs.test.mjs', filePath: TEST_PATH }
];

const EXPECTED_H2_HEADINGS = [
  '## Outcome',
  '## Prerequisites',
  '## Step 1 - Connect This Machine',
  '## Step 2 - Enable Linked Environments',
  '## Step 3 - Copy the MCP URL',
  '## Step 4 - Connect Grok Bot (OAuth)',
  '## Machines',
  '## Team Roster',
  '## Routing Rules',
  '## Worktree Isolation',
  '## Thread Brief Format',
  '## Approval Gates',
  '## Verification',
  '## Failure Modes',
  '## Cost Economics',
  '## Project Catalog'
];

const REQUIRED_LITERALS = [
  'npx t3 connect',
  'Settings -> Labs -> Linked environments',
  'Settings -> Environments -> Copy MCP URL',
  '<T3_WEBHOOK_URL_FROM_SETTINGS>',
  'a6e93700-f43f-4781-bba6-5fe25afc2ba5',
  '3100 + (crc16(branch) % 800)',
  '.runtime/<branch-slug>.db',
  'LAPTOP-7RFE16FO',
  'CRC-16/CCITT-FALSE',
  '4000-4075',
  '< 10 GB',
  '< 5 GB',
  '$0',
  '$8/$40',
  '$4/$20',
  '$3/$15',
  'node --test tests/fleet-cli.test.mjs',
  'node --test tests/playbooks.test.mjs',
  'node --test tests/docs.test.mjs',
  'node --test "tests/*.test.mjs"'
];

const EXPECTED_TIER_1 = [
  'CRaMer---Custom-CRM-',
  'Sparky',
  'sujaysun101',
  'BorderMath',
  'BorderMath-backend',
  'BorderMath-middleware',
  'galactus-airspace',
  'InvestoDash',
  'PDEfficiency-UI',
  'PDEfficiency-Backend',
  'Modernality',
  'ownspace-voice-orbit',
  'ConcretePOA',
  'MoneySimp',
  'startup-finance-copilot',
  'esg-reporting-assistant',
  'hr-policy-bot',
  'legalops-copilot',
  'medical-billing-agent',
  'construction-safety-agent',
  'sales-call-coach',
  'hotel-concierge-ai',
  'shopify-listing-optimiser',
  'podcast-summaries-hub',
  'Beautify',
  'Central-Command',
  'PartSeven',
  'Daily-AI-Revenue-Run',
  'Freedback-',
  'AI-Trading-Bot',
  'AI-Memory',
  'OrchestratorSujay',
  'EscapeHatch'
];

const EXPECTED_TIER_2 = [
  'sujay-sundar-portfolio',
  'Forge',
  'MultiDomainLandingPage',
  'act-autonomy-command',
  'claude-builders-bounty',
  'multi-podcast-daily-briefing-emails',
  'screeps-bounty-arena',
  'RunBurn',
  'TaxLawApp',
  'gittensor-ui',
  'free-claude-code',
  'ai-webinar-producer',
  'symphony-orchestrator-mvp',
  'sujays-agent',
  'ACTAutonomyOSMVP',
  'ClaraVeil',
  'deal-vault',
  'HomeRoom',
  'ai-coding-tutor'
];

const EXPECTED_TIER_3 = [
  'Sahana-Sundar-Site',
  'Sahana-Sundar-Website',
  'sphinx-nav-fiber',
  'openclaw-render-template',
  'alphaclaw',
  'Poperatio-OS',
  'remix-of-gofaculty-autopilot-restaurant',
  'Eventful',
  'Freedback',
  'Personal-Portfolio',
  'web-refresh-revive',
  'VSCoDefender',
  'ReplaceHolly',
  'ElectThemNOW-',
  'SuitUp',
  'Copani-CSV-PDF-UI',
  'Copani-Master-Portal-UI',
  'FBLA-State-2020-',
  'Riemann-Sum-Calculations---AP-Calculus-AB-',
  'CS-UY-2124-OOP-Coursework',
  'CSE116-Coursework',
  'C-Programming-Exercises',
  'GHub',
  'web-ifc-three'
];

const LOCAL_T3_PROJECTS = new Set([
  'AI-Trading-Bot',
  'AI-Memory',
  'OrchestratorSujay',
  'EscapeHatch'
]);

const EXPECTED_PROJECTS = [
  ...EXPECTED_TIER_1.map((name) => ({
    name,
    tier: '1',
    source: LOCAL_T3_PROJECTS.has(name) ? 'local-t3' : 'github'
  })),
  ...EXPECTED_TIER_2.map((name) => ({
    name,
    tier: '2',
    source: name === 'ai-coding-tutor' ? 'github-extra' : 'github'
  })),
  ...EXPECTED_TIER_3.map((name) => ({
    name,
    tier: '3',
    source: 'github'
  }))
];

const EXPECTED_ROLES = [
  { id: 'dispatcher', agent: 'Grok Bot', model: 'grok/grok-4.7' },
  { id: 'lead', agent: 'Fable 5.2', model: 'cursor/claude-fable-5-2' },
  { id: 'builder-1', agent: 'Opus 5.5', model: 'cursor/claude-opus-5-5' },
  { id: 'builder-2', agent: 'Opus 5.5', model: 'antigravity/claude-opus-5-5' },
  { id: 'playtester', agent: 'GPT-6.2 Astra', model: 'codex/gpt-6.2-astra' },
  { id: 'copywriter', agent: 'Gemini 4 Neon', model: 'antigravity/gemini-4-neon' },
  { id: 'ops', agent: 'gemini-3.8-flash', model: 'antigravity/gemini-3.8-flash' }
];

const EXPECTED_TRIGGERS = [
  'New feature',
  'Code, tests, refactors',
  'Every diff',
  'Docs, README, release notes',
  'Checks across machines',
  'Questions, summaries, plans'
];

const EXPECTED_BRIEF_LABELS = [
  'goal:',
  'files in scope:',
  'files out of scope:',
  'done-when:',
  'budget:',
  'who reviews:'
];

const SECRET_PATTERNS = [
  /discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/i,
  /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/,
  /\bghp_[A-Za-z0-9]{36}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /ntfy\.sh\/(?!<)[A-Za-z0-9_-]{6,}/,
  /https?:\/\/[^\s)'"`]*\/(?:webhooks?|hooks)\/[^\s)'"`<]+/i
];

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

function stripFencedCodeBlocks(markdown) {
  const lines = normalizeNewlines(markdown).split('\n');
  const out = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out.join('\n');
}

function getSection(markdown, heading) {
  const lines = normalizeNewlines(markdown).split('\n');
  const start = lines.findIndex((line) => line.trim() === heading);
  assert.notEqual(start, -1, `Missing section heading: ${heading}`);
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n');
}

test('1. TEAM.md contains # Fleet Team Manual and all 16 ## headings in exact order', () => {
  const content = normalizeNewlines(fs.readFileSync(TEAM_PATH, 'utf8'));
  assert.ok(content.startsWith('# Fleet Team Manual\n'), 'TEAM.md must start with # Fleet Team Manual');

  const outsideFences = stripFencedCodeBlocks(content);
  const actualH2 = outsideFences
    .split('\n')
    .filter((line) => line.startsWith('## '));

  assert.deepEqual(actualH2, EXPECTED_H2_HEADINGS);
});

test('2. TEAM.md includes all required setup, isolation, verification, and economics literals', () => {
  const content = fs.readFileSync(TEAM_PATH, 'utf8');
  for (const literal of REQUIRED_LITERALS) {
    assert.ok(content.includes(literal), `TEAM.md is missing required literal: ${literal}`);
  }
});

test('3. TEAM.md Project Catalog has exactly 76 rows matching all canonical projects, tiers, and sources', () => {
  assert.equal(EXPECTED_PROJECTS.length, 76);

  const content = fs.readFileSync(TEAM_PATH, 'utf8');
  const catalog = getSection(content, '## Project Catalog');
  const tableLines = catalog
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  assert.ok(tableLines.length >= 3, 'Project Catalog table is missing');
  assert.equal(tableLines[0], '| # | Project | Tier | Source |');
  assert.match(tableLines[1], /^\|(?:\s*-+\s*\|){4}$/);

  const dataRows = tableLines.slice(2);
  assert.equal(dataRows.length, 76, `Expected 76 catalog rows, found ${dataRows.length}`);

  const parsed = dataRows.map((row, idx) => {
    const cells = row
      .slice(1, -1)
      .split('|')
      .map((cell) => cell.trim());
    assert.equal(cells.length, 4, `Row ${idx + 1} should have 4 columns: ${row}`);
    return {
      num: Number(cells[0]),
      name: cells[1],
      tier: cells[2],
      source: cells[3]
    };
  });

  const byName = new Map();
  for (let i = 0; i < parsed.length; i++) {
    assert.equal(parsed[i].num, i + 1, `Row numbering mismatch at index ${i}`);
    assert.ok(!byName.has(parsed[i].name), `Duplicate project in catalog: ${parsed[i].name}`);
    byName.set(parsed[i].name, parsed[i]);
  }

  for (const expected of EXPECTED_PROJECTS) {
    const actual = byName.get(expected.name);
    assert.ok(actual, `Missing project in Project Catalog: ${expected.name}`);
    assert.equal(actual.tier, expected.tier, `Wrong tier for ${expected.name}`);
    assert.equal(actual.source, expected.source, `Wrong source for ${expected.name}`);
  }
});

test('4. TEAM.md documents all 7 roster roles/agents, 6 routing triggers, and 6 brief labels in order', () => {
  const content = fs.readFileSync(TEAM_PATH, 'utf8');

  const rosterSection = getSection(content, '## Team Roster');
  for (const role of EXPECTED_ROLES) {
    assert.ok(rosterSection.includes(role.id), `Team Roster missing role id: ${role.id}`);
    assert.ok(rosterSection.includes(role.agent), `Team Roster missing agent: ${role.agent}`);
    assert.ok(rosterSection.includes(role.model), `Team Roster missing provider/model: ${role.model}`);
  }
  assert.ok(rosterSection.includes('Cheapest Model'), 'Team Roster missing Cheapest Model label');

  const routingSection = getSection(content, '## Routing Rules');
  for (const trigger of EXPECTED_TRIGGERS) {
    assert.ok(routingSection.includes(trigger), `Routing Rules missing trigger: ${trigger}`);
  }

  const briefSection = getSection(content, '## Thread Brief Format');
  let lastIdx = -1;
  for (const label of EXPECTED_BRIEF_LABELS) {
    const re = new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
    const match = re.exec(briefSection);
    assert.ok(match, `Thread Brief Format missing line starting with "${label}"`);
    assert.ok(match.index > lastIdx, `Thread Brief label out of order: ${label}`);
    lastIdx = match.index;
  }
});

test('5. CHANGELOG.md follows Keep a Changelog with [Unreleased], all 3 branches, and 226 PR correction', () => {
  const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const idxTitle = content.indexOf('# Changelog');
  const idxUnreleased = content.indexOf('## [Unreleased]');
  const idxAdded = content.indexOf('### Added');
  const idxChanged = content.indexOf('### Changed');

  assert.ok(idxTitle === 0, 'CHANGELOG.md must start with # Changelog');
  assert.ok(idxUnreleased > idxTitle, 'CHANGELOG.md missing ## [Unreleased]');
  assert.ok(idxAdded > idxUnreleased, 'CHANGELOG.md missing ### Added under ## [Unreleased]');
  assert.ok(idxChanged > idxAdded, 'CHANGELOG.md missing ### Changed after ### Added');

  for (const branch of [
    'feat/fleet-ops-and-registry',
    'feat/fleet-playbooks',
    'docs/fleet-team-manual'
  ]) {
    assert.ok(content.includes(branch), `CHANGELOG.md missing branch name: ${branch}`);
  }

  const changedSection = content.slice(idxChanged);
  assert.ok(changedSection.includes('226'), 'CHANGELOG.md ### Changed must record the 226 open PRs correction');
});

test('6. Secret scan, webhook URL ban, and UTF-8 without BOM across all B3 files', () => {
  for (const { name, filePath } of OWNED_FILES) {
    const raw = fs.readFileSync(filePath);
    assert.ok(
      !(raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf),
      `${name} must not have a UTF-8 BOM`
    );

    const text = raw.toString('utf8');
    for (const pattern of SECRET_PATTERNS) {
      assert.equal(pattern.test(text), false, `${name} matched secret pattern: ${pattern}`);
    }
  }

  const teamText = fs.readFileSync(TEAM_PATH, 'utf8');
  assert.equal(
    /https:\/\/[^\s)'"`]*(?:webhook|hooks)/i.test(teamText),
    false,
    'TEAM.md must not contain any https:// URL with webhook or hooks'
  );
});
