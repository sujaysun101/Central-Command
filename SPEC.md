# SPEC.md - Fleet HQ Infrastructure Split (3 Disjoint PR Branches)

- **Repo**: `C:\Users\sujay\Central-Command` (`https://github.com/sujaysun101/Central-Command`)
- **Base commit**: `48423a4` (`main` == `origin/main` at inspection, 2026-11-23T21:27-05:00)
- **Author**: Lead (fallback chain -> `antigravity/claude-opus-5-5`, per DECISIONS 2026-11-23 Lead Fallback #2)
- **Reviewers**: Chief of Staff (Orchestrator) -> Opus 5.5 builders -> GPT-6.2 Astra (read-only)
- **Runtime**: Node `v24.22.0` (uses `fs.statfsSync`, global `fetch`, `node:test`), `gh 2.72.0`, Windows PowerShell 5.1

---

## 0. Ground Truth From Inspection (read-only)

| Fact | Value |
|---|---|
| Tracked files on `main` | `README.md`, `index.html`, `skills.json`, `skill-sections.js`, `setup.sh`, `agents/*.md` (13), `codex/AGENTS.md`, `cursor-rules/*.mdc` (2), `hooks/pre-commit-gate.sh`, `skills/*/SKILL.md` (2) |
| Root checkout dirty state (MUST stay untouched) | `M skill-sections.js`; untracked `.gitignore`, `index.broken-backup.html`, `patch.js`, `patch2.js`, `patch3.js`, `skills.159-backup.json` |
| Pre-existing paths that do NOT exist | `fleet/`, `scripts/`, `tests/`, `playbooks/`, `SPEC.md`, `DECISIONS.md`, `TEAM.md`, `CHANGELOG.md`, `package.json` |
| GitHub repos (`gh repo list sujaysun101`) | **71** |
| Open PRs (live, `gh search prs --owner sujaysun101 --state open`) | **226** across **18** repos: InvestoDash=200 (search-capped, at least 200), ConcretePOA=10, and 1 each in Beautify, BorderMath, Daily-AI-Revenue-Run, Freedback-, MoneySimp, PartSeven, construction-safety-agent, esg-reporting-assistant, hotel-concierge-ai, hr-policy-bot, legalops-copilot, medical-billing-agent, podcast-summaries-hub, sales-call-coach, shopify-listing-optimiser, startup-finance-copilot |
| DECISIONS.md PR figure | "100 open PRs across 14 repos" -> **stale; superseded by live count** (see D-011) |
| `C:` free | `8,248,725,504` bytes = **7.68 GB** (GB = 1024^3 throughout this spec) -> currently **warn** band |
| Local-only T3 projects | `C:\Users\sujay\AI-Trading-Bot`, `C:\Users\sujay\AI-Memory`, `C:\Users\sujay\OrchestratorSujay`, `C:\Users\sujay\EscapeHatch` (T3 `repositoryIdentity: null`) |
| Extra repo | `C:\Users\sujay\ai-coding-tutor` -> origin `https://github.com/sujaysun101/ai-coding-tutor.git` (not returned by `gh repo list`) |
| Hook | `hooks/pre-commit-gate.sh` blocks `.env*`, `.key`, `.pem`, `secrets.json`, `credentials.json`, `.npmrc`, `.netrc` |
| Review format | `codex/AGENTS.md`: `CRITICAL / IMPORTANT / MINOR / VERDICT: BLOCK \| APPROVE` |

---

## 1. Global Rules (apply to every branch)

1. Each branch is created by T3 in its **own worktree** from base `48423a4`. Never work in the root checkout.
2. **Zero file overlap.** A builder may create ONLY the files listed for its branch in section 2. Touching any other path fails review (Astra "Scope creep" = CRITICAL).
3. **Never touch**: `README.md`, `.gitignore`, `index.html`, `skills.json`, `skill-sections.js`, `setup.sh`, `agents/**`, `codex/**`, `cursor-rules/**`, `hooks/**`, `skills/**`, `.vercel/**`, `.env*`, and every untracked backup or patch file.
4. **No `package.json` and no npm dependencies.** Only Node built-ins (`node:fs`, `node:path`, `node:os`, `node:child_process`, `node:net`, `node:url`, `node:test`, `node:assert/strict`) and global `fetch`.
5. **No secrets.** Every real webhook, bot token, or topic is read from env vars at runtime. Docs use the literal placeholder `<T3_WEBHOOK_URL_FROM_SETTINGS>`. Every branch test includes the secret scan in section 6.
6. **No destructive GitHub actions** in code: no `gh pr close`, `gh pr merge`, `gh repo delete`, `git push --force`, `rm -rf`, or `Remove-Item -Recurse` on project paths.
7. ASCII hyphens only in headings and strings that tests match. Line endings are LF. Encoding is UTF-8 without a BOM.
8. **Cross-branch independence.** Each test file reads ONLY files owned by its own branch. Shared facts are duplicated as literals from section 5 (Canonical Constants). This means each branch passes alone and in any merge order.
9. `done-when` per branch: its single test command exits 0. The builder pastes the verbatim output into the PR body.

---

## 2. File Ownership Matrix (exhaustive, zero overlap)

| Path | B1 `feat/fleet-ops-and-registry` | B2 `feat/fleet-playbooks` | B3 `docs/fleet-team-manual` |
|---|:-:|:-:|:-:|
| `fleet/PROJECTS_REGISTRY.json` | **OWN** | - | - |
| `fleet/MACHINES.json` | **OWN** | - | - |
| `fleet/ROUTING_RULES.json` | **OWN** | - | - |
| `fleet/BACKLOG.md` | **OWN** | - | - |
| `scripts/fleet-cli.mjs` | **OWN** | - | - |
| `scripts/ops-health.ps1` | **OWN** | - | - |
| `scripts/triage-prs.ps1` | **OWN** | - | - |
| `scripts/notify-phone.ps1` | **OWN** | - | - |
| `scripts/ensure-project.ps1` | **OWN** | - | - |
| `tests/fleet-cli.test.mjs` | **OWN** | - | - |
| `SPEC.md` (this document, verbatim) | - | **OWN** | - |
| `DECISIONS.md` | - | **OWN** | - |
| `playbooks/GROK_DISPATCHER.md` | - | **OWN** | - |
| `playbooks/THREAD_BRIEF_TEMPLATE.md` | - | **OWN** | - |
| `playbooks/ASTRA_PLAYTEST_RUBRIC.md` | - | **OWN** | - |
| `playbooks/MORNING_REPORT_TEMPLATE.md` | - | **OWN** | - |
| `tests/playbooks.test.mjs` | - | **OWN** | - |
| `TEAM.md` | - | - | **OWN** |
| `CHANGELOG.md` | - | - | **OWN** |
| `tests/docs.test.mjs` | - | - | **OWN** |

Directory notes: `tests/` is shared but each branch creates a different file in it, so git merges it cleanly. `fleet/`, `scripts/` (B1) and `playbooks/` (B2) each belong to one branch only.

**Assignment** (dispatch via `delegate_task` / `t3_thread_launch` with `workspaceStrategy: {type:"worktree", baseRef:"main", startFromOrigin:false}`):

| Branch | Builder | Provider/model |
|---|---|---|
| B1 | Opus 5.5 #1 | `cursor/claude-opus-5-5` (`effort:"high"`), fallback `codex/gpt-6.2-sol` |
| B2 | Opus 5.5 #2 | `antigravity/claude-opus-5-5` (`thought_level:"high"`), fallback `cursor/claude-opus-5-5` |
| B3 | Gemini 4 Neon | `antigravity/gemini-4-neon` (`thought_level:"high"`), fallback `cursor/gemini-4-neon` |

Merge order: any. Recommended order is B1, then B2, then B3. No rebase is needed because the branches share no files.

---

## 3. Shared Algorithms (normative; B1 implements, B2/B3 document identically)

### 3.1 CRC16
- Variant: **CRC-16/CCITT-FALSE**. poly `0x1021`, init `0xFFFF`, no input/output reflection, xorout `0x0000`, computed over the **UTF-8 bytes** of the raw, un-normalized branch name.
- Reference implementation:
  ```js
  export function crc16(str) {
    let c = 0xFFFF;
    for (const b of Buffer.from(str, 'utf8')) {
      c ^= b << 8;
      for (let i = 0; i < 8; i++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
    }
    return c;
  }
  ```
- Test vectors (verified):

| input | crc16 | `3100 + crc16 % 800` |
|---|---|---|
| `123456789` | `0x29B1` (10673) | 3373 |
| `feat/fleet-ops-and-registry` | `0xD557` (54615) | 3315 |
| `feat/fleet-playbooks` | `0x1037` (4151) | 3251 |
| `docs/fleet-team-manual` | `0x751C` (29980) | 3480 |
| `main` | `0x7415` (29717) | 3217 |

### 3.2 Port allocation
- `basePort = 3100 + (crc16(branch) % 800)`. Range is `[3100, 3899]`.
- Collision handling: if `basePort` is already assigned to a *different* branch in `<repo>/.runtime/ports.json`, or (unless `--no-probe`) it fails a TCP probe (`net.createServer().listen(port, '127.0.0.1')` errors with `EADDRINUSE`), linear-probe `port + 1`, wrapping `3899 -> 3100`. Give up after 800 tries with exit 5.
- Re-allocating the same branch returns its existing entry (idempotent).

### 3.3 Branch slug and DB isolation
- `slug(branch)`: lowercase, replace every run of characters outside `[a-z0-9]` with a single `-`, trim leading and trailing `-`, truncate to 64 chars, trim a trailing `-` again. Empty result becomes `default`.
  - `feat/fleet-ops-and-registry` -> `feat-fleet-ops-and-registry`
  - `Feat/Fleet Playbooks!!` -> `feat-fleet-playbooks`
- `dbPath = .runtime/<slug>.db`, relative to the worktree root. POSIX separators in JSON output.

### 3.4 Disk and RAM thresholds
- `freeGb = statfsSync(path).bavail * statfsSync(path).bsize / 1024**3`, rounded to 2 decimals.
- Disk status: `ok` if `freeGb >= 10`; `warn` if `5 <= freeGb < 10`; `block` if `freeGb < 5`.
- RAM: `freeRamGb = os.freemem()/1024**3`. Status `warn` if `< 2`, else `ok` (RAM never blocks).
- Test hooks (documented and supported, used only by tests): env `FLEET_FAKE_FREE_GB=<number>` overrides disk free; env `FLEET_FAKE_FREE_RAM_GB=<number>` overrides RAM.

### 3.5 Phone ping line
- Format: `<what> | <where> | <link>`.
- Sanitize each field: replace `\r` and `\n` with a space, replace `|` with `/`, collapse whitespace, trim. Truncate the whole line to 280 chars, with `...` as the last 3 chars if truncated.
- Empty `what`, `where`, or `link` -> exit 2.

---

## 4. Branch Specifications

### 4.1 Branch 1 - `feat/fleet-ops-and-registry` (Opus 5.5 #1)

**done-when**: `node --test tests/fleet-cli.test.mjs` exits 0.

#### 4.1.1 `fleet/PROJECTS_REGISTRY.json`
```json
{
  "schemaVersion": "1.0.0",
  "generatedAt": "<ISO-8601 with offset>",
  "owner": "sujaysun101",
  "hq": "Central-Command",
  "counts": { "total": 76, "github": 71, "githubExtra": 1, "localT3": 4, "tier1": 33, "tier2": 19, "tier3": 24 },
  "openPrSnapshot": { "takenAt": "2026-11-23T21:24:00-05:00", "total": 226, "repos": 18 },
  "projects": [ /* 76 Project objects, sorted (see below) */ ]
}
```
**Project object**:

| key | type | required | rule |
|---|---|:-:|---|
| `name` | string | Y | GitHub repo name with exact case; local projects use their folder name |
| `repoUrl` | string \| null | Y | `https://github.com/sujaysun101/<name>` (no `.git`). `null` for the 4 `local-t3` projects |
| `localPath` | string | Y | If a dir `C:\Users\sujay\<X>` has `git remote get-url origin` matching the repo (case-insensitive, `.git` stripped), use that dir. Otherwise use the planned path `C:\Users\sujay\<name>` |
| `tier` | 1\|2\|3 | Y | From section 5.2 lists exactly |
| `t3Registered` | boolean | Y | `true` iff `localPath` equals (case-insensitive) a `workspaceRoot` returned by T3 `t3_project_list` at authoring time. Builder MUST query it. Confirmed `true` at inspection: AI-Trading-Bot, AI-Memory, OrchestratorSujay, EscapeHatch, ConcretePOA, ClaraVeil, RunBurn, InvestoDash, sales-call-coach, hr-policy-bot, construction-safety-agent, hotel-concierge-ai, shopify-listing-optimiser, podcast-summaries-hub |
| `defaultPort` | integer | Y | `4000 + index` in the sorted `projects` array, giving `4000..4075`. This is disjoint from the worktree range 3100-3899 |
| `source` | `"github"`\|`"github-extra"`\|`"local-t3"` | Y | `github-extra` = ai-coding-tutor only |
| `localClone` | boolean | Y | `true` iff `localPath` exists on disk |
| `lastPushed` | `YYYY-MM-DD` \| null | N | From `gh repo list ... pushedAt` |
| `sizeKb` | integer \| null | N | From `gh repo list ... diskUsage` |
| `openPrs` | integer | N | From the snapshot, otherwise 0 |
| `notes` | string | N | For example, `"JIT clone only; 59 MB"` |

Sort order: ascending by `name.toLowerCase()` using plain code-unit comparison (`<`). No other keys are allowed.

#### 4.1.2 `fleet/MACHINES.json`
```json
{
  "schemaVersion": "1.0.0",
  "machines": [{
    "label": "LAPTOP-7RFE16FO",
    "environmentId": "a6e93700-f43f-4781-bba6-5fe25afc2ba5",
    "role": "primary-host-and-memory-owner",
    "os": "windows-x64",
    "cpu": "AMD Ryzen 5 7520U with Radeon Graphics",
    "ramGb": 15.2,
    "diskFreeGbAtSetup": 8.7,
    "t3Connect": "on",
    "linkedEnvironmentsEnabled": false,
    "guardrails": {
      "diskWarnGb": 10,
      "diskBlockGb": 5,
      "ramWarnFreeGb": 2,
      "maxConcurrentNpmInstalls": { "ok": 2, "warn": 1, "block": 0 },
      "maxConcurrentWorktrees": 3,
      "stuckThreadMinutes": 20
    },
    "goodAt": ["PR triage and GitHub CLI dispatch", "Specs, playbooks, documentation, lightweight JS/TS/Python patches", "node --test and tsc --noEmit verification", "Scheduled morning reports and webhook orchestration"],
    "prohibitedWorkloads": [
      "Concurrent npm install across multiple worktrees when C: free < 10 GB",
      "Heavy Rust/Docker/3D release builds (BorderMath-backend cargo release, web-ifc-three)",
      "Unapproved DB migrations, production deploys, destructive deletes, or spend",
      "Cloning sphinx-nav-fiber (~610 MB) on this machine"
    ]
  }]
}
```

#### 4.1.3 `fleet/ROUTING_RULES.json`
```json
{
  "schemaVersion": "1.0.0",
  "roles": [
    { "id": "dispatcher", "agent": "Grok Bot", "providerInstanceId": "grok", "model": "grok-4.7", "options": {"reasoningEffort":"high"}, "fallbacks": ["grok/grok-4.6"], "permissions": "no-code", "scope": "24/7 triage, briefs, memory, follow-ups; never writes code" },
    { "id": "lead", "agent": "Fable 5.2", "providerInstanceId": "cursor", "model": "claude-fable-5-2", "options": {"effort":"high","contextWindow":"1m"}, "fallbacks": ["opencode/github-copilot/claude-fable-5.2", "antigravity/claude-opus-5-5"], "permissions": "write-spec", "scope": "Writes SPEC.md, splits work, delegates (Supervised)" },
    { "id": "builder-1", "agent": "Opus 5.5", "providerInstanceId": "cursor", "model": "claude-opus-5-5", "options": {"effort":"high","contextWindow":"1m"}, "fallbacks": ["antigravity/claude-opus-5-5", "codex/gpt-6.2-sol"], "permissions": "write-worktree", "scope": "Own git worktree; implements and pastes test output" },
    { "id": "builder-2", "agent": "Opus 5.5", "providerInstanceId": "antigravity", "model": "claude-opus-5-5", "options": {"thought_level":"high"}, "fallbacks": ["cursor/claude-opus-5-5", "codex/gpt-6.2-sol"], "permissions": "write-worktree", "scope": "Own git worktree; implements and pastes test output" },
    { "id": "playtester", "agent": "GPT-6.2 Astra", "providerInstanceId": "codex", "model": "gpt-6.2-astra", "options": {"reasoningEffort":"high"}, "fallbacks": ["codex/gpt-6.2-sol"], "permissions": "read-only", "scope": "Read-only review of every diff before human" },
    { "id": "copywriter", "agent": "Gemini 4 Neon", "providerInstanceId": "antigravity", "model": "gemini-4-neon", "options": {"thought_level":"high"}, "fallbacks": ["cursor/gemini-4-neon"], "permissions": "write-docs", "scope": "TEAM.md, README.md, CHANGELOG.md, PR copy" },
    { "id": "ops", "agent": "Cheapest Model", "providerInstanceId": "antigravity", "model": "gemini-3.8-flash", "options": {"thought_level":"low"}, "fallbacks": ["opencode/opencode/beam-free"], "permissions": "read-only", "scope": "Disk, RAM, test runs, deps, 20-min stuck-thread checks" }
  ],
  "rules": [
    { "id": "new-feature", "trigger": "New feature", "routeTo": ["lead", "builder-1", "builder-2"], "requiresHumanOk": true, "notes": "Lead writes SPEC.md first; human OK; builders in isolated worktrees" },
    { "id": "code-tests-refactors", "trigger": "Code, tests, refactors", "routeTo": ["builder-1", "builder-2"], "requiresHumanOk": false, "notes": "t3_thread_launch / delegate_task in isolated worktree" },
    { "id": "every-diff", "trigger": "Every diff", "routeTo": ["playtester"], "requiresHumanOk": false, "notes": "Bugs back to lead; max 3 rounds" },
    { "id": "docs", "trigger": "Docs, README, release notes", "routeTo": ["copywriter"], "requiresHumanOk": false, "notes": "" },
    { "id": "cross-machine", "trigger": "Checks across machines", "routeTo": ["ops"], "requiresHumanOk": false, "notes": "One thread per machine, then t3_thread_wait" },
    { "id": "questions", "trigger": "Questions, summaries, plans", "routeTo": ["dispatcher"], "requiresHumanOk": false, "notes": "" }
  ],
  "worktreeIsolation": { "portBase": 3100, "portSpan": 800, "portFormula": "3100 + (crc16(branch) % 800)", "crc16Variant": "CRC-16/CCITT-FALSE", "dbPathTemplate": ".runtime/<branch-slug>.db", "projectDefaultPortBase": 4000 },
  "reviewLoop": { "reviewer": "playtester", "maxRounds": 3, "escalateTo": "lead" },
  "approvalGates": [
    { "id": "supervised-default", "rule": "New threads start Supervised" },
    { "id": "auto-only-in-worktree", "rule": "Auto runtime mode allowed only inside an isolated worktree" },
    { "id": "migrations", "rule": "DB migrations always wait for human approval" },
    { "id": "deploys", "rule": "Deploys always wait for human approval" },
    { "id": "deletes", "rule": "Deletes (files, branches, PR closes, worktree cleanup) always wait for human approval" },
    { "id": "spend", "rule": "Any spend always waits for human approval" }
  ],
  "phonePing": { "format": "<what> | <where> | <diff or PR link>", "maxChars": 280 },
  "failureModes": {
    "usageLimitHit": "Resume after reset or use role fallbacks in order",
    "threadStuck20Min": "task_cancel, re-brief smaller, relaunch",
    "sameFileTouchedTwice": "Second thread waits for first PR merge",
    "machineOffline": "Re-route to least busy healthy machine",
    "providerDisabled": "claudeAgent standalone is disabled; never route to it"
  }
}
```

#### 4.1.4 `fleet/BACKLOG.md`
These headings are required, in this exact order:
1. `# Fleet Backlog`
2. `## Single-Thread Queue`: numbered list. Each item is one line: `N. [P0|P1|P2|P3] <repo> - <task> (owner: <role id>)`. The first items MUST be the security lockdown PRs (P0), then `InvestoDash [AutoDev] collapse -> keep latest, human sign-off to close rest` (P1), then `ConcretePOA 10 open PRs review` (P1).
3. `## Open PR Triage Snapshot`: states the 226 / 18 live snapshot with timestamp and per-repo table (`| Repo | Open PRs | Tier |`). Notes that DECISIONS' "100 across 14" is superseded and that `node scripts/fleet-cli.mjs triage-prs` is the source of truth.
4. `## Deferred Backlog`: the Tier 3 list plus `Sahana-Sundar-Site (59 MB) JIT clone via scripts/ensure-project.ps1 when free >= 5 GB`.
5. `## Pending Human Approvals`: reclaimable worktree bloat (`OrchestratorSujay\.workspaces-conformance-*` 17 folders; `ConcretePOA\.claude\worktrees\*` ~2+ GB). Flag only, never delete.

#### 4.1.5 `scripts/fleet-cli.mjs`
- Shebang `#!/usr/bin/env node`. ESM. Main guard: `if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) process.exitCode = await main(process.argv.slice(2));`
- **Named exports (tests import these)**: `crc16`, `slugify`, `basePort`, `allocatePort(branch, {repo, probe})`, `diskStatus(freeGb)`, `getFreeGb(path)`, `formatPing({what, where, link})`, `triagePrs(prs, {registry})`, `buildMorningReport(data)`, `main(argv)`.
- Global flags: `--json` (machine output on stdout, exactly one JSON document), `--help` / `-h` (usage, exit 0). Diagnostics go to stderr only. Unknown subcommand or flag -> exit 2.
- Paths resolve relative to the repo root, computed as `path.resolve(dirname(fileURLToPath(import.meta.url)), '..')`.

**Exit codes**

| code | meaning |
|---|---|
| 0 | success / all ok |
| 1 | warning (non-blocking): `ops-check` with any `warn` |
| 2 | usage error (bad or missing flags, unknown subcommand) |
| 3 | blocked by guardrail (disk `< 5 GB`) |
| 4 | external dependency failure (`gh` missing / unauthenticated / network; notify channel failed) |
| 5 | data / config error (invalid or missing registry/JSON, port range exhausted) |

**Subcommands**

1. `ops-check [--path <dir>=C:\] [--registry <file>=fleet/PROJECTS_REGISTRY.json] [--machines <file>=fleet/MACHINES.json] [--json]`
   - Checks: disk (3.4); RAM (3.4); `node` major >= 20; `gh --version` via `spawnSync` (missing = `warn`, never fatal); registry parses and has `counts.total === projects.length`; machines parses.
   - JSON: `{"command":"ops-check","machine":"LAPTOP-7RFE16FO","timestamp":ISO,"disk":{"path":str,"freeGb":num,"status":"ok|warn|block"},"ram":{"freeGb":num,"totalGb":num,"status":"ok|warn"},"node":{"version":str,"status":"ok|block"},"gh":{"available":bool,"status":"ok|warn"},"registry":{"projects":int,"status":"ok|error"},"overall":"ok|warn|block|error"}`
   - Exit: `error` -> 5. `block` -> 3. `warn` -> 1. Otherwise 0.
   - Text: one line per check, `[OK|WARN|BLOCK|ERROR] <check>: <detail>`, then `overall: <status>`.
2. `triage-prs [--input <gh-json-file>] [--owner sujaysun101] [--limit 1000] [--registry <file>] [--out <file>] [--json]`
   - Without `--input`: spawn `gh search prs --owner <owner> --state open --limit <limit> --json repository,number,title,url,isDraft,createdAt`. Failure -> exit 4. With `--input`: read the same JSON shape (offline, used by tests).
   - Rules, in order:
     - **P0 security**: title matches `/\b(security|auth|unauthenticated|lockdown|vuln\w*|cve|secret\w*|xss|csrf|injection)\b/i`.
     - **AutoDev collapse**: in each repo, all titles matching `/^\s*\[AutoDev\]/i` form one group. `candidate` = highest `number`. Others are `superseded` with recommendation `close-after-human-approval`.
     - Remaining PRs: priority by repo tier from the registry. Tier 1 = P1, Tier 2 = P2, Tier 3 or unknown = P3.
     - Drafts are flagged `isDraft:true`; their priority does not change.
   - JSON: `{"command":"triage-prs","timestamp":ISO,"total":int,"repos":int,"byRepo":{"<repo>":int},"p0":[PR],"p1":[PR],"p2":[PR],"p3":[PR],"autodev":[{"repo":str,"candidate":int,"superseded":[int],"recommendation":"close-after-human-approval"}]}`, where `PR = {"repo","number","title","url","isDraft","priority"}`. A superseded AutoDev PR appears only in `autodev`, never in the p-lists.
   - Never mutates GitHub. `--out` writes the JSON to a file. Exit 0.
3. `allocate-worktree --branch <name> [--repo <dir>=cwd] [--dry-run] [--no-probe] [--json]`
   - Missing `--branch` -> 2. Disk `block` -> exit 3, no writes, JSON `status:"blocked"`.
   - Unless `--dry-run`: `mkdir <repo>/.runtime`, write `<repo>/.runtime/.gitignore` = `*\n` if absent, upsert `<repo>/.runtime/ports.json` (`{"<branch>":{"port":int,"slug":str,"dbPath":str,"allocatedAt":ISO}}`). Does NOT run `git worktree add` (T3 owns worktree creation).
   - JSON: `{"command":"allocate-worktree","branch":str,"slug":str,"crc16":int,"port":int,"dbPath":".runtime/<slug>.db","env":{"PORT":"<port>","DATABASE_URL":"file:.runtime/<slug>.db"},"disk":{"freeGb":num,"status":str},"warnings":[str],"status":"allocated|dry-run|blocked"}`. A `warn` disk adds the warning `"Disk below 10 GB: no concurrent npm install"`.
   - Exit 0 (allocated or dry-run, including warn), 3 (blocked), 5 (range exhausted).
4. `notify-phone --what <s> --where <s> --link <url> [--outbox <file>] [--dry-run] [--json]`
   - Outbox default is env `FLEET_OUTBOX`, else `C:\Users\sujay\AI-Memory\fleet\phone-outbox.jsonl`. Always append one JSONL record: `{"ts":ISO,"line":str,"channels":[str],"dryRun":bool}`.
   - Channels (skipped on `--dry-run`, fired in this order if env vars are present):
     - `NTFY_TOPIC`: POST `https://ntfy.sh/<topic>`, body = line.
     - `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`: POST `https://api.telegram.org/bot<token>/sendMessage`, JSON `{chat_id,text}`.
     - `DISCORD_WEBHOOK_URL`: POST JSON `{content}`.
   - Never print env values. Errors are redacted to the channel name.
   - JSON: `{"command":"notify-phone","line":str,"outbox":str,"channels":[{"name":"ntfy|telegram|discord","ok":bool}],"status":"sent|outbox-only|dry-run|partial-failure"}`
   - Exit 0, 2 (empty field), or 4 (any configured channel failed; the outbox is still written).
5. `morning-report [--triage-input <file>] [--registry <file>] [--notify] [--outbox <file>] [--json]`
   - Composes ops-check + triage-prs (`--triage-input` passed through as `--input`).
   - Text output headings, exact and in order:
     - `# Morning Report - <YYYY-MM-DD>`
     - `## Fleet Health`
     - `## PR Triage`
     - `## Needs Approval`
     - `## Blocked`
     - `## Next Up`
     - `## Phone Line`
   - Phone line: `morning-report <YYYY-MM-DD> | LAPTOP-7RFE16FO | disk <freeGb> GB <status>, <total> open PRs (<p0count> P0) https://github.com/sujaysun101/Central-Command/pulls`, built via `formatPing` with `what`=`morning-report <date>`, `where`=`LAPTOP-7RFE16FO`, `link`=`disk ... /pulls`.
   - `--notify` sends that line via notify-phone logic.
   - JSON: `{"command":"morning-report","date":str,"health":<ops-check JSON>,"triage":{"total","repos","p0":int,"p1":int,"p2":int,"p3":int,"autodevGroups":int},"needsApproval":[str],"blocked":[str],"nextUp":[str],"phoneLine":str}`
   - Exit 0, or 3 if disk is blocked (the report is still printed), or 4 on gh failure.

#### 4.1.6 PowerShell wrappers (PS 5.1 compatible, `$ErrorActionPreference='Stop'`)

| File | Signature | Body contract |
|---|---|---|
| `scripts/ops-health.ps1` | `param([switch]$Json)` | `node "$PSScriptRoot\fleet-cli.mjs" ops-check @(if($Json){'--json'})`, then `exit $LASTEXITCODE` |
| `scripts/triage-prs.ps1` | `param([string]$Input, [string]$Out, [switch]$Json)` | Forwards to `triage-prs` (`--input`, `--out`, `--json`). Exit passthrough |
| `scripts/notify-phone.ps1` | `param([Parameter(Mandatory)][string]$What, [Parameter(Mandatory)][string]$Where, [Parameter(Mandatory)][string]$Link, [switch]$DryRun)` | Forwards to `notify-phone`. Exit passthrough |
| `scripts/ensure-project.ps1` | `param([Parameter(Mandatory)][string]$Name, [switch]$DryRun)` | Look up `$Name` in `fleet\PROJECTS_REGISTRY.json` (case-insensitive). Not found -> exit 5. `localPath` exists -> print `present` and exit 0. `repoUrl` null -> exit 5. Run `ops-check --json`; `disk.status -eq 'block'` -> exit 3. Else (unless `-DryRun`) `git clone --depth 1 --single-branch <repoUrl> <localPath>` (exit 4 on failure). **Never** runs `npm install` |

Note: inside `triage-prs.ps1` rename `$Input` to `$InputFile`, because `$Input` is a PowerShell automatic variable. The flag stays `-InputFile`.

#### 4.1.7 `tests/fleet-cli.test.mjs` (required assertions)
Tests import from `../scripts/fleet-cli.mjs` and spawn the CLI with `process.execPath`. Temp files go only under `fs.mkdtempSync(os.tmpdir())`.
1. `crc16('123456789') === 0x29B1`, plus the four branch vectors and their ports from 3.1.
2. `basePort` stays in [3100,3899] for 500 random strings.
3. `slugify('feat/fleet-ops-and-registry') === 'feat-fleet-ops-and-registry'`, `slugify('Feat/Fleet Playbooks!!') === 'feat-fleet-playbooks'`, `slugify('///') === 'default'`, length <= 64.
4. `diskStatus(12)==='ok'`, `diskStatus(10)==='ok'`, `diskStatus(9.99)==='warn'`, `diskStatus(5)==='warn'`, `diskStatus(4.99)==='block'`.
5. CLI `allocate-worktree --branch feat/fleet-playbooks --repo <tmp> --no-probe --json` with `FLEET_FAKE_FREE_GB=7`: exit 0, `port===3251`, `dbPath==='.runtime/feat-fleet-playbooks.db'`, `warnings.length===1`, `<tmp>/.runtime/.gitignore` content `*\n`, and `ports.json` has the entry. Re-running returns the same port (idempotent).
6. Port collision: pre-seed `ports.json` with another branch on 3251. The allocation returns 3252.
7. `FLEET_FAKE_FREE_GB=4` gives exit 3, `status==='blocked'`, and no `.runtime` dir created.
8. `ops-check --json` with `FLEET_FAKE_FREE_GB=12` + `FLEET_FAKE_FREE_RAM_GB=8` gives exit 0 when `gh` is available (else 1); with `7` gives exit 1; with `4` gives exit 3.
9. `formatPing({what:'a|b', where:'x\ny', link:'L'}) === 'a/b | x y | L'`. 300-char input gives length 280, ending `...`. Empty field gives CLI exit 2.
10. `notify-phone --dry-run --outbox <tmp>/o.jsonl` with all channel env vars deleted from the child env: exit 0, `status==='dry-run'`, exactly 1 JSONL line.
11. `triage-prs --input <fixture>`. The fixture is written by the test and holds 5 InvestoDash `[AutoDev]` PRs (#124,#150,#201,#199,#130), 1 `Lock down unauthenticated API` PR, and 1 normal ConcretePOA PR. Expect: `autodev[0].candidate===201`, `superseded` sorted and has length 4, `p0.length===1`, ConcretePOA lands in `p1`, `total===7`.
12. Registry checks:
    - `projects.length===76`, `counts` match, and names are unique case-insensitively.
    - Sorted per 4.1.1, and `defaultPort[i]===4000+i`.
    - Tier membership equals the section 5.2 lists exactly; tier counts are 33/19/24.
    - The 4 `local-t3` entries have `repoUrl===null` and `t3Registered===true`.
    - Every github `repoUrl` matches `^https://github\.com/sujaysun101/[A-Za-z0-9._-]+$`.
    - Only the allowed keys are present.
13. MACHINES checks: the `environmentId` value, `diskWarnGb===10`, `diskBlockGb===5`.
14. ROUTING checks: 7 role ids, 6 rule ids, 6 approval gate ids exactly as in 4.1.3, `portFormula` string, `reviewLoop.maxRounds===3`.
15. Static source checks on `fleet-cli.mjs`: no `import` of anything except `node:*` specifiers; no occurrence of `pr close`, `pr merge`, `--force`, or `rm -rf`.
16. Secret scan (section 6) over all 10 B1-owned files.

---

### 4.2 Branch 2 - `feat/fleet-playbooks` (Opus 5.5 #2)

**done-when**: `node --test tests/playbooks.test.mjs` exits 0.

#### 4.2.1 `SPEC.md`
This document, committed verbatim. Its first line MUST be `# SPEC.md - Fleet HQ Infrastructure Split (3 Disjoint PR Branches)`.

#### 4.2.2 `DECISIONS.md`
- Heading `# Fleet Decisions Log`.
- One `## D-NNN | YYYY-MM-DD | <Title>` section per decision, each with the bullets `- **Decision**:`, `- **Why**:`, `- **Status**:` (`Accepted|Superseded|Pending-Approval`).
- Required entries:

| ID | Title | Content |
|---|---|---|
| D-001 | Scope | 76 projects (71 + ai-coding-tutor + 4 local) |
| D-002 | Disk Guardrail | — |
| D-003 | Provider Mapping | — |
| D-004 | PR Bottleneck Triage | — |
| D-005 | Phone Channel | — |
| D-006 | Reclaimable Worktree Bloat | Pending-Approval |
| D-007 | Safe Repo Hygiene | — |
| D-008 | Lead Provider Fallback | — |
| D-009 | Lead Provider Fallback #2 | — |
| D-010 | Three Disjoint Branches | Ownership matrix |
| D-011 | PR Count Correction | 226 live supersedes 100 |
| D-012 | No package.json, no tracked .gitignore | Rationale: untracked root `.gitignore` would block pull |

#### 4.2.3 `playbooks/GROK_DISPATCHER.md`
Required headings, in order:
- `# Grok Dispatcher Playbook`
- `## Role`: never writes code.
- `## Intake`
- `## Routing Table`: a table with columns `| Trigger | Route To | Provider/Model | Fallback |` and one row per section 5.3 rule.
- `## Dispatch Procedure`: steps naming `orchestrator_capabilities`, `delegate_task`, `t3_thread_launch`, `t3_thread_wait`, `task_cancel`.
- `## Approval Gates`
- `## Stuck Thread Watchdog`: 20 min.
- `## Escalation`: Astra max 3 rounds, then Lead.
- `## Phone Pings`

#### 4.2.4 `playbooks/THREAD_BRIEF_TEMPLATE.md`
- Heading `# Thread Brief Template`.
- A fenced block containing exactly these six labels, each at the start of its own line, in order: `goal:`, `files in scope:`, `files out of scope:`, `done-when:`, `budget:`, `who reviews:`.
- `## Field Rules`: one `### <label>` subsection per field.
- `## Example`: a filled example for B1 of this spec.

#### 4.2.5 `playbooks/ASTRA_PLAYTEST_RUBRIC.md`
- Heading `# Astra Playtest Rubric`.
- `## Checklist`: auth gaps, data loss, race conditions, tenant isolation, secrets exposure, scope creep (file outside brief = CRITICAL), tests pasted verbatim, port/DB isolation, no new deps.
- `## Output Format`: a fenced block exactly matching the `codex/AGENTS.md` format (`CRITICAL (block merge):`, `IMPORTANT (fix before merge):`, `MINOR:`, `VERDICT: BLOCK | APPROVE`).
- `## Loop Rules`: max 3 rounds.
- `## Read-Only Guarantee`

#### 4.2.6 `playbooks/MORNING_REPORT_TEMPLATE.md`
- Heading `# Morning Report Template`.
- A fenced template that uses the exact 7 headings from 4.1.5 `morning-report` (`# Morning Report - <YYYY-MM-DD>` through `## Phone Line`).
- `## Generation`: names `node scripts/fleet-cli.mjs morning-report`. That is a documentation reference only; the B2 tests don't execute it.

#### 4.2.7 `tests/playbooks.test.mjs` (required assertions)
1. All 6 owned markdown files exist and are non-empty.
2. Each file contains its required headings in the specified order (index ascending).
3. THREAD_BRIEF_TEMPLATE has all 6 brief labels, matched as `^<label>` per line in multiline mode, in order.
4. Routing coverage: GROK_DISPATCHER contains every agent name (`Grok Bot`, `Fable 5.2`, `Opus 5.5`, `GPT-6.2 Astra`, `Gemini 4 Neon`, `gemini-3.8-flash`), every provider/model string from 5.3, and all 6 triggers.
5. Approval gates: GROK_DISPATCHER and SPEC.md contain (case-insensitive) `supervised`, `migrations`, `deploys`, `deletes`, `spend`, and the literal `<what> | <where> | <diff or PR link>`.
6. ASTRA rubric contains the 4 output-format lines verbatim.
7. The MORNING template's 7 headings equal the 4.1.5 list (literal array in the test).
8. DECISIONS.md has D-001..D-012 in ascending order, and each has Decision/Why/Status.
9. SPEC.md contains the CRC vector `0x29B1`, `3100 + (crc16(branch) % 800)`, and all three branch names.
10. Secret scan (section 6) over the 7 B2-owned files.

---

### 4.3 Branch 3 - `docs/fleet-team-manual` (Gemini 4 Neon)

**done-when**: `node --test tests/docs.test.mjs` exits 0.

#### 4.3.1 `TEAM.md`
Required `##` headings, in this exact order, under `# Fleet Team Manual`:
1. `## Outcome`
2. `## Prerequisites`
3. `## Step 1 - Connect This Machine`: `npx t3 connect`.
4. `## Step 2 - Enable Linked Environments`: `Settings -> Labs -> Linked environments`.
5. `## Step 3 - Copy the MCP URL`: `Settings -> Environments -> Copy MCP URL`.
6. `## Step 4 - Connect Grok Bot (OAuth)`: add as remote MCP server with OAuth. The webhook is referenced only as `<T3_WEBHOOK_URL_FROM_SETTINGS>`.
7. `## Machines`: table with `LAPTOP-7RFE16FO` and `a6e93700-f43f-4781-bba6-5fe25afc2ba5`, the specs, good-at, and prohibited workloads.
8. `## Team Roster`: 7 roles, same strings as 5.3.
9. `## Routing Rules`: 6 rules.
10. `## Worktree Isolation`: port formula, CRC-16/CCITT-FALSE, `.runtime/<branch-slug>.db`, project default ports 4000-4075, disk thresholds `< 10 GB` warn / `< 5 GB` block.
11. `## Thread Brief Format`: the 6 labels.
12. `## Approval Gates`
13. `## Verification`: the three `node --test` commands plus `node --test "tests/*.test.mjs"` after merge.
14. `## Failure Modes`: usage limit, stuck 20 min, same file twice, machine offline, provider disabled.
15. `## Cost Economics`: T3 `$0`; per 1M in/out: Fable `$8/$40`, Opus `$4/$20`, Astra `$8/$40`, Neon `$3/$15`.
16. `## Project Catalog`: one table `| # | Project | Tier | Source |` with all 76 rows from section 5.2.

#### 4.3.2 `CHANGELOG.md`
- Follows Keep a Changelog: `# Changelog`, then `## [Unreleased]`.
- `### Added` lists the three branches and their files.
- `### Changed` lists the PR count correction (226).

#### 4.3.3 `tests/docs.test.mjs` (required assertions)
1. TEAM.md headings are present in the exact order of 4.3.1.
2. Literal strings present: `npx t3 connect`, `Settings -> Labs -> Linked environments`, `Settings -> Environments -> Copy MCP URL`, `<T3_WEBHOOK_URL_FROM_SETTINGS>`, `a6e93700-f43f-4781-bba6-5fe25afc2ba5`, `3100 + (crc16(branch) % 800)`, `.runtime/<branch-slug>.db`.
3. Every one of the 76 names from section 5.2 appears inside the Project Catalog section. The catalog has exactly 76 data rows.
4. All 7 agent names and all 6 brief labels are present.
5. CHANGELOG has `## [Unreleased]` and mentions all three branch names.
6. Secret scan (section 6) over the 3 B3-owned files. There is no `https://` URL containing `webhook` or `hooks` in TEAM.md.

---

## 5. Canonical Constants (duplicate verbatim as literals in tests)

### 5.1 Branch names and ports
`feat/fleet-ops-and-registry` -> 3315; `feat/fleet-playbooks` -> 3251; `docs/fleet-team-manual` -> 3480.

### 5.2 Project tiers (76)
**Tier 1 (33)**: CRaMer---Custom-CRM-, Sparky, sujaysun101, BorderMath, BorderMath-backend, BorderMath-middleware, galactus-airspace, InvestoDash, PDEfficiency-UI, PDEfficiency-Backend, Modernality, ownspace-voice-orbit, ConcretePOA, MoneySimp, startup-finance-copilot, esg-reporting-assistant, hr-policy-bot, legalops-copilot, medical-billing-agent, construction-safety-agent, sales-call-coach, hotel-concierge-ai, shopify-listing-optimiser, podcast-summaries-hub, Beautify, Central-Command, PartSeven, Daily-AI-Revenue-Run, Freedback-, AI-Trading-Bot*, AI-Memory*, OrchestratorSujay*, EscapeHatch*

Rule: pushed on or after 2026-11-01, OR has open PRs, OR is a core app (HQ plus the 4 local T3 projects).

**Tier 2 (19)**: sujay-sundar-portfolio, Forge, MultiDomainLandingPage, act-autonomy-command, claude-builders-bounty, multi-podcast-daily-briefing-emails, screeps-bounty-arena, RunBurn, TaxLawApp, gittensor-ui, free-claude-code, ai-webinar-producer, symphony-orchestrator-mvp, sujays-agent, ACTAutonomyOSMVP, ClaraVeil, deal-vault, HomeRoom, ai-coding-tutor**

**Tier 3 (24)**: Sahana-Sundar-Site, Sahana-Sundar-Website, sphinx-nav-fiber, openclaw-render-template, alphaclaw, Poperatio-OS, remix-of-gofaculty-autopilot-restaurant, Eventful, Freedback, Personal-Portfolio, web-refresh-revive, VSCoDefender, ReplaceHolly, ElectThemNOW-, SuitUp, Copani-CSV-PDF-UI, Copani-Master-Portal-UI, FBLA-State-2020-, Riemann-Sum-Calculations---AP-Calculus-AB-, CS-UY-2124-OOP-Coursework, CSE116-Coursework, C-Programming-Exercises, GHub, web-ifc-three

Rule: legacy, coursework, or large repos deferred because of the ~8 GB free disk on LAPTOP-7RFE16FO; JIT clone only.

`*` = `source:"local-t3"`, `repoUrl:null`. `**` = `source:"github-extra"`, `repoUrl:"https://github.com/sujaysun101/ai-coding-tutor"`. Every other entry is `source:"github"`.

### 5.3 Roster strings
`Grok Bot` (`grok/grok-4.7`), `Fable 5.2` (`cursor/claude-fable-5-2`), `Opus 5.5` (`cursor/claude-opus-5-5`, `antigravity/claude-opus-5-5`), `GPT-6.2 Astra` (`codex/gpt-6.2-astra`), `Gemini 4 Neon` (`antigravity/gemini-4-neon`), `gemini-3.8-flash` (`antigravity/gemini-3.8-flash`).

Triggers: `New feature`, `Code, tests, refactors`, `Every diff`, `Docs, README, release notes`, `Checks across machines`, `Questions, summaries, plans`.

### 5.4 Brief labels
`goal:`, `files in scope:`, `files out of scope:`, `done-when:`, `budget:`, `who reviews:`

---

## 6. Secret Scan (identical helper in all 3 test files)
Fail if any owned file matches any of:
```js
const SECRET_PATTERNS = [
  /discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/i,
  /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/,          // Telegram bot token
  /\bghp_[A-Za-z0-9]{36}\b/, /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/, /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /ntfy\.sh\/(?!<)[A-Za-z0-9_-]{6,}/,          // concrete ntfy topic
  /https?:\/\/[^\s)'"`]*\/(?:webhooks?|hooks)\/[^\s)'"`<]+/i // concrete webhook URL
];
```
Allowed: env var names (`NTFY_TOPIC`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `DISCORD_WEBHOOK_URL`), the placeholder `<T3_WEBHOOK_URL_FROM_SETTINGS>`, and template literals like `` `https://ntfy.sh/${topic}` ``. The `(?!<)` and `${` forms do not match.

---

## 7. Verification and Handoff

| Step | Command | Expected |
|---|---|---|
| B1 builder | `node --test tests/fleet-cli.test.mjs` | exit 0, verbatim output in PR |
| B2 builder | `node --test tests/playbooks.test.mjs` | exit 0 |
| B3 builder | `node --test tests/docs.test.mjs` | exit 0 |
| Overlap check (Orchestrator) | `git diff --name-only 48423a4...<branch>` for each branch, then intersect | empty intersection; every path is in the section 2 column for that branch |
| Astra | read-only review per `playbooks/ASTRA_PLAYTEST_RUBRIC.md` format | `VERDICT: APPROVE` |
| Post-merge (all 3) | `node --test tests/*.test.mjs` | exit 0 |
| Root checkout | `git -C C:\Users\sujay\Central-Command status --short` | still exactly: `M skill-sections.js`, plus the 6 untracked files |

Each PR body ends with: `PR <url>, head <SHA>, checks and reviews <state>`. Phone ping per merged PR: `<branch> merged | Central-Command | <PR url>`.
