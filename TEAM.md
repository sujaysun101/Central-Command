# Fleet Team Manual

## Outcome

This manual configures and operates the `Central-Command` Fleet HQ on `LAPTOP-7RFE16FO` using T3 Code. When complete, you have:

- Your primary workstation connected to T3 Code (`npx t3 connect`) with remote MCP access and OAuth enabled for `Grok Bot`.
- A 7-role autonomous engineering roster with clear routing rules, read-only playtest review (`GPT-6.2 Astra`), and bounded fallback chains.
- Deterministic worktree isolation (`3100 + (crc16(branch) % 800)` and `.runtime/<branch-slug>.db`) plus disk and RAM guardrails that protect the host from resource exhaustion.
- Explicit human approval gates for every destructive, financial, schema, or deployment action, backed by concise phone pings (`<what> | <where> | <diff or PR link>`).
- A complete, tiered catalog of all 76 fleet projects (71 GitHub repositories, 1 extra GitHub repository, and 4 local-only T3 projects).

## Prerequisites

Before following the setup steps, verify that `LAPTOP-7RFE16FO` meets all baseline requirements:

- **T3 Code** installed and signed into your workspace account.
- **Node.js `v20+`** (verified on `v24.22.0`). Fleet tooling uses Node built-ins only (`node:fs`, `node:path`, `node:os`, `node:child_process`, `node:net`, `node:url`, `node:test`, `node:assert/strict`) and global `fetch`. Do not add a `package.json` or run `npm install` in `Central-Command`.
- **Git** and **GitHub CLI (`gh` `2.72.0+`)** authenticated to `sujaysun101`.
- **Windows PowerShell 5.1+** for the host wrapper scripts.
- **Worktree discipline**: `C:\Users\sujay\Central-Command` is the HQ root checkout and must stay clean of branch work. Every feature, playbook, or docs change runs in its own T3-managed git worktree.
- **Disk headroom**: Check `C:` free space before starting builds (`>= 10 GB` is `ok`, `5-10 GB` is `warn`, `< 5 GB` is `block`).
- **Notification environment variables (optional, never committed)**: Set `NTFY_TOPIC`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `DISCORD_WEBHOOK_URL`, or `FLEET_OUTBOX` in your local environment if you want live phone pings in addition to the local JSONL outbox.

## Step 1 - Connect This Machine

Bring `LAPTOP-7RFE16FO` online in T3 Code so remote dispatchers and threads can target this host:

```powershell
npx t3 connect
```

1. Run `npx t3 connect` from a PowerShell terminal on `LAPTOP-7RFE16FO`.
2. Complete the sign-in confirmation in T3 Code and verify the host registers under environment ID `a6e93700-f43f-4781-bba6-5fe25afc2ba5`.
3. Keep the T3 Connect daemon active (`t3Connect: "on"`) whenever autonomous triage, scheduled morning reports, or remote dispatches are running.

## Step 2 - Enable Linked Environments

When you are ready to connect additional machines alongside `LAPTOP-7RFE16FO`, enable linked environments in T3 Code:

1. Open T3 Code on the host.
2. Navigate to `Settings -> Labs -> Linked environments`.
3. Toggle **Linked environments** on so cross-machine checks and delegated threads can route by `environmentId`.
4. Note: `LAPTOP-7RFE16FO` starts with `linkedEnvironmentsEnabled: false` until a second host is onboarded.

## Step 3 - Copy the MCP URL

Expose the T3 Code environment to your remote dispatcher over MCP:

1. Open T3 Code on `LAPTOP-7RFE16FO`.
2. Navigate to `Settings -> Environments -> Copy MCP URL`.
3. Keep the copied URL in your password manager or runtime settings only. Never paste or commit a live MCP or webhook URL into any repository file.

## Step 4 - Connect Grok Bot (OAuth)

Connect `Grok Bot` as your 24/7 no-code dispatcher using the MCP URL copied in Step 3:

1. In Grok Bot, add T3 Code as a **remote MCP server** with **OAuth** authentication.
2. Paste the MCP URL obtained from `Settings -> Environments -> Copy MCP URL` and complete the OAuth consent flow.
3. For inbound webhook triggers (scheduled nudges, PR events, or phone escalations), configure the webhook destination using your live secret stored in T3 Settings. In all documentation, templates, and prompts checked into git, reference the webhook strictly by its literal placeholder:

```text
<T3_WEBHOOK_URL_FROM_SETTINGS>
```

4. Confirm `Grok Bot` can list projects and inspect thread state without write/code permissions (`no-code` scope).

## Machines

| Label | Environment ID | Role | OS | CPU | RAM | Disk Free (Setup / Inspection) | T3 Connect | Linked Environments |
|---|---|---|---|---|---|---|---|---|
| `LAPTOP-7RFE16FO` | `a6e93700-f43f-4781-bba6-5fe25afc2ba5` | `primary-host-and-memory-owner` | `windows-x64` | AMD Ryzen 5 7520U with Radeon Graphics | 15.2 GB | 8.7 GB / 7.68 GB (`warn` band) | `on` | `false` |

### Host Guardrails

- **Disk warning threshold**: `< 10 GB` free (`diskWarnGb: 10`) -> limits concurrent `npm install` runs to `1`.
- **Disk block threshold**: `< 5 GB` free (`diskBlockGb: 5`) -> blocks new worktree allocations, clones, and `npm install` runs (`0` allowed).
- **RAM warning threshold**: `< 2 GB` free (`ramWarnFreeGb: 2`) -> warns only; never blocks.
- **Concurrency limits**: `maxConcurrentWorktrees: 3`; `maxConcurrentNpmInstalls`: `2` (`ok`), `1` (`warn`), `0` (`block`); `stuckThreadMinutes: 20`.

### Good At

- PR triage and GitHub CLI dispatch
- Specs, playbooks, documentation, lightweight JS/TS/Python patches
- `node --test` and `tsc --noEmit` verification
- Scheduled morning reports and webhook orchestration

### Prohibited Workloads

- Concurrent `npm install` across multiple worktrees when `C:` free `< 10 GB`
- Heavy Rust/Docker/3D release builds (`BorderMath-backend` cargo release, `web-ifc-three`)
- Unapproved DB migrations, production deploys, destructive deletes, or spend
- Cloning `sphinx-nav-fiber` (~610 MB) on this machine

## Team Roster

| Role ID | Agent | Provider / Model | Options | Fallbacks | Permissions | Scope |
|---|---|---|---|---|---|---|
| `dispatcher` | `Grok Bot` | `grok/grok-4.7` | `reasoningEffort: "high"` | `grok/grok-4.6` | `no-code` | 24/7 triage, briefs, memory, follow-ups; never writes code |
| `lead` | `Fable 5.2` | `cursor/claude-fable-5-2` | `effort: "high"`, `contextWindow: "1m"` | `opencode/github-copilot/claude-fable-5.2`, `antigravity/claude-opus-5-5` | `write-spec` | Writes SPEC.md, splits work, delegates (Supervised) |
| `builder-1` | `Opus 5.5` | `cursor/claude-opus-5-5` | `effort: "high"`, `contextWindow: "1m"` | `antigravity/claude-opus-5-5`, `codex/gpt-6.2-sol` | `write-worktree` | Own git worktree; implements and pastes test output |
| `builder-2` | `Opus 5.5` | `antigravity/claude-opus-5-5` | `thought_level: "high"` | `cursor/claude-opus-5-5`, `codex/gpt-6.2-sol` | `write-worktree` | Own git worktree; implements and pastes test output |
| `playtester` | `GPT-6.2 Astra` | `codex/gpt-6.2-astra` | `reasoningEffort: "high"` | `codex/gpt-6.2-sol` | `read-only` | Read-only review of every diff before human |
| `copywriter` | `Gemini 4 Neon` | `antigravity/gemini-4-neon` | `thought_level: "high"` | `cursor/gemini-4-neon` | `write-docs` | TEAM.md, README.md, CHANGELOG.md, PR copy |
| `ops` | `Cheapest Model` (`gemini-3.8-flash`) | `antigravity/gemini-3.8-flash` | `thought_level: "low"` | `opencode/opencode/beam-free` | `read-only` | Disk, RAM, test runs, deps, 20-min stuck-thread checks |

## Routing Rules

| Rule ID | Trigger | Route To | Human OK Required | Notes |
|---|---|---|---|---|
| `new-feature` | `New feature` | `lead`, `builder-1`, `builder-2` | Yes | Lead writes SPEC.md first; human OK; builders in isolated worktrees |
| `code-tests-refactors` | `Code, tests, refactors` | `builder-1`, `builder-2` | No | `t3_thread_launch` / `delegate_task` in isolated worktree |
| `every-diff` | `Every diff` | `playtester` | No | Bugs back to lead; max 3 rounds |
| `docs` | `Docs, README, release notes` | `copywriter` | No | Documentation, manuals, changelog, and PR copy |
| `cross-machine` | `Checks across machines` | `ops` | No | One thread per machine, then `t3_thread_wait` |
| `questions` | `Questions, summaries, plans` | `dispatcher` | No | Triage, thread briefs, memory updates, and follow-ups |

## Worktree Isolation

Every code or docs branch runs in a dedicated T3 worktree with deterministic port and SQLite database isolation so parallel threads never collide:

- **Port formula**: `3100 + (crc16(branch) % 800)` (range `3100-3899`).
- **Hash specification**: `CRC-16/CCITT-FALSE` (poly `0x1021`, init `0xFFFF`, no input/output reflection, xorout `0x0000`, computed over the raw UTF-8 bytes of the branch name).
- **Collision handling**: If the computed base port is already assigned to another branch in `.runtime/ports.json` or fails a loopback TCP probe (`127.0.0.1`, `EADDRINUSE`), linear-probe `port + 1` wrapping `3899 -> 3100`. Exhausting all 800 ports exits with code `5`. Re-allocating the same branch is idempotent.
- **Database isolation**: `.runtime/<branch-slug>.db` (relative to the worktree root, with `.runtime/.gitignore` set to `*`). `<branch-slug>` lowercases the branch, replaces runs outside `[a-z0-9]` with `-`, trims leading/trailing `-`, truncates to 64 chars, trims trailing `-` again, and falls back to `default`.
- **Project default ports**: `4000-4075` (`4000 + index` across the sorted 76-project registry), completely disjoint from the worktree port range `3100-3899`.
- **Disk guardrails** (`GB = 1024^3`):
  - `>= 10 GB` free -> `ok`
  - `< 10 GB` free (`5 <= freeGb < 10`) -> `warn` (adds warning, limits concurrent `npm install` to 1)
  - `< 5 GB` free -> `block` (aborts allocation and clones with exit code `3`, writes nothing)

### Verified Port Vectors

| Input | `CRC-16/CCITT-FALSE` | Worktree Port (`3100 + (crc16(branch) % 800)`) |
|---|---|---|
| `123456789` | `0x29B1` (10673) | `3373` |
| `feat/fleet-ops-and-registry` | `0xD557` (54615) | `3315` |
| `feat/fleet-playbooks` | `0x1037` (4151) | `3251` |
| `docs/fleet-team-manual` | `0x751C` (29980) | `3480` |
| `main` | `0x7415` (29717) | `3217` |

## Thread Brief Format

Every delegated task or launched thread brief MUST include these 6 labels at the start of their own lines, in exact order:

```text
goal:
files in scope:
files out of scope:
done-when:
budget:
who reviews:
```

- `goal:` Single concrete outcome for the thread.
- `files in scope:` Exact paths the worker owns and may create or modify.
- `files out of scope:` Explicit exclusions; modifying any path outside `files in scope` triggers a `CRITICAL` scope-creep block during `GPT-6.2 Astra` review.
- `done-when:` Verifiable exit-0 test command(s) and PR handoff criteria.
- `budget:` Time cap, thought/effort level, and workspace isolation mode.
- `who reviews:` Named reviewer (default: `GPT-6.2 Astra (read-only) before human approval`).

## Approval Gates

All 6 approval gates are enforced across every branch and playbook:

1. **Supervised default (`supervised-default`)**: New threads start in Supervised mode.
2. **Worktree-scoped auto (`auto-only-in-worktree`)**: Auto runtime mode is allowed only inside an isolated git worktree, never in the root checkout.
3. **Migrations (`migrations`)**: Database migrations always wait for human approval.
4. **Deploys (`deploys`)**: Production or staging deploys always wait for human approval.
5. **Deletes (`deletes`)**: Deletes (files, branches, PR closes, worktree cleanup) always wait for human approval.
6. **Spend (`spend`)**: Any financial spend always waits for human approval.

When an approval gate is reached or a PR merges, send a single-line phone ping (max 280 characters) in the format:

```text
<what> | <where> | <diff or PR link>
```

## Verification

Each fleet branch is independently verifiable with zero cross-branch coupling. Run the branch test suite in the branch worktree and paste the complete verbatim output into the draft PR body before requesting `GPT-6.2 Astra` review:

```powershell
# Branch 1 (feat/fleet-ops-and-registry)
node --test tests/fleet-cli.test.mjs

# Branch 2 (feat/fleet-playbooks)
node --test tests/playbooks.test.mjs

# Branch 3 (docs/fleet-team-manual)
node --test tests/docs.test.mjs

# Post-merge combined suite (after all 3 branches merge to main)
node --test "tests/*.test.mjs"
```

Every branch test exits `0`, includes the shared secret scan over its owned files, and must receive `VERDICT: APPROVE` from `GPT-6.2 Astra` before human merge.

## Failure Modes

| Failure Mode | Trigger | Standard Recovery |
|---|---|---|
| **Usage limit hit** | Provider quota or rate limit reached | Resume after reset window or switch to the role's configured `fallbacks` in exact priority order |
| **Thread stuck 20 min** | No progress for `stuckThreadMinutes` (20 minutes) | Run `task_cancel`, narrow the scope into a smaller brief, and relaunch in a fresh worktree/turn |
| **Same file touched twice** | Two active threads need edits to the same path | Second thread waits for the first PR to merge before continuing; prevent upfront via disjoint ownership |
| **Machine offline** | Target host unreachable or T3 Connect dropped | Re-route the work to the least busy healthy linked machine |
| **Provider disabled** | Route targets `claudeAgent` standalone | `claudeAgent` standalone is disabled; never route to it and use the canonical `cursor` / `antigravity` / `codex` / `grok` mapping |

## Cost Economics

- **T3 Code orchestration layer**: `$0`
- **Reference model rates (per 1M input / output tokens)**:
  - `Fable 5.2`: `$8/$40`
  - `Opus 5.5`: `$4/$20`
  - `GPT-6.2 Astra`: `$8/$40`
  - `Gemini 4 Neon`: `$3/$15`
- **Routine ops discipline**: Route health checks, disk/RAM probes, and stuck-thread monitoring to `Cheapest Model` (`antigravity/gemini-3.8-flash`, fallback `opencode/opencode/beam-free`) to keep recurring overhead near zero.

## Project Catalog

All 76 fleet projects are partitioned into three tiers (`33` Tier 1, `19` Tier 2, `24` Tier 3) across `71` GitHub repos (`github`), `1` extra GitHub repo (`github-extra`), and `4` local-only T3 projects (`local-t3`):

- **Tier 1 (33)**: Pushed on or after `2026-11-01`, or currently has open PRs, or is a core HQ/local T3 project.
- **Tier 2 (19)**: Secondary active repositories.
- **Tier 3 (24)**: Legacy, coursework, or large repositories deferred to JIT clone only due to ~8 GB free disk on `LAPTOP-7RFE16FO`.

| # | Project | Tier | Source |
|---|---|---|---|
| 1 | CRaMer---Custom-CRM- | 1 | github |
| 2 | Sparky | 1 | github |
| 3 | sujaysun101 | 1 | github |
| 4 | BorderMath | 1 | github |
| 5 | BorderMath-backend | 1 | github |
| 6 | BorderMath-middleware | 1 | github |
| 7 | galactus-airspace | 1 | github |
| 8 | InvestoDash | 1 | github |
| 9 | PDEfficiency-UI | 1 | github |
| 10 | PDEfficiency-Backend | 1 | github |
| 11 | Modernality | 1 | github |
| 12 | ownspace-voice-orbit | 1 | github |
| 13 | ConcretePOA | 1 | github |
| 14 | MoneySimp | 1 | github |
| 15 | startup-finance-copilot | 1 | github |
| 16 | esg-reporting-assistant | 1 | github |
| 17 | hr-policy-bot | 1 | github |
| 18 | legalops-copilot | 1 | github |
| 19 | medical-billing-agent | 1 | github |
| 20 | construction-safety-agent | 1 | github |
| 21 | sales-call-coach | 1 | github |
| 22 | hotel-concierge-ai | 1 | github |
| 23 | shopify-listing-optimiser | 1 | github |
| 24 | podcast-summaries-hub | 1 | github |
| 25 | Beautify | 1 | github |
| 26 | Central-Command | 1 | github |
| 27 | PartSeven | 1 | github |
| 28 | Daily-AI-Revenue-Run | 1 | github |
| 29 | Freedback- | 1 | github |
| 30 | AI-Trading-Bot | 1 | local-t3 |
| 31 | AI-Memory | 1 | local-t3 |
| 32 | OrchestratorSujay | 1 | local-t3 |
| 33 | EscapeHatch | 1 | local-t3 |
| 34 | sujay-sundar-portfolio | 2 | github |
| 35 | Forge | 2 | github |
| 36 | MultiDomainLandingPage | 2 | github |
| 37 | act-autonomy-command | 2 | github |
| 38 | claude-builders-bounty | 2 | github |
| 39 | multi-podcast-daily-briefing-emails | 2 | github |
| 40 | screeps-bounty-arena | 2 | github |
| 41 | RunBurn | 2 | github |
| 42 | TaxLawApp | 2 | github |
| 43 | gittensor-ui | 2 | github |
| 44 | free-claude-code | 2 | github |
| 45 | ai-webinar-producer | 2 | github |
| 46 | symphony-orchestrator-mvp | 2 | github |
| 47 | sujays-agent | 2 | github |
| 48 | ACTAutonomyOSMVP | 2 | github |
| 49 | ClaraVeil | 2 | github |
| 50 | deal-vault | 2 | github |
| 51 | HomeRoom | 2 | github |
| 52 | ai-coding-tutor | 2 | github-extra |
| 53 | Sahana-Sundar-Site | 3 | github |
| 54 | Sahana-Sundar-Website | 3 | github |
| 55 | sphinx-nav-fiber | 3 | github |
| 56 | openclaw-render-template | 3 | github |
| 57 | alphaclaw | 3 | github |
| 58 | Poperatio-OS | 3 | github |
| 59 | remix-of-gofaculty-autopilot-restaurant | 3 | github |
| 60 | Eventful | 3 | github |
| 61 | Freedback | 3 | github |
| 62 | Personal-Portfolio | 3 | github |
| 63 | web-refresh-revive | 3 | github |
| 64 | VSCoDefender | 3 | github |
| 65 | ReplaceHolly | 3 | github |
| 66 | ElectThemNOW- | 3 | github |
| 67 | SuitUp | 3 | github |
| 68 | Copani-CSV-PDF-UI | 3 | github |
| 69 | Copani-Master-Portal-UI | 3 | github |
| 70 | FBLA-State-2020- | 3 | github |
| 71 | Riemann-Sum-Calculations---AP-Calculus-AB- | 3 | github |
| 72 | CS-UY-2124-OOP-Coursework | 3 | github |
| 73 | CSE116-Coursework | 3 | github |
| 74 | C-Programming-Exercises | 3 | github |
| 75 | GHub | 3 | github |
| 76 | web-ifc-three | 3 | github |
