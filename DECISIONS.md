# Fleet Decisions Log

Source log: `C:\Users\sujay\AI-Memory\fleet\DECISIONS.md` (Chief-of-Staff working log). This file is the canonical, numbered record for Fleet HQ, formatted per `SPEC.md` section 4.2.2. Status values: `Accepted`, `Superseded`, `Pending-Approval`.

## D-001 | 2026-11-23 | Scope
- **Decision**: Fleet HQ covers 76 projects: 71 `sujaysun101/*` GitHub repos + `ai-coding-tutor` (github-extra, not returned by `gh repo list`) + 4 local T3 projects (`AI-Trading-Bot`, `AI-Memory`, `OrchestratorSujay`, `EscapeHatch`), anchored on `Central-Command` (`C:\Users\sujay\Central-Command`) as HQ.
- **Why**: The source log counted 75 (71 + 4); inspection found `C:\Users\sujay\ai-coding-tutor` with a `sujaysun101` origin, so it is added as the 76th project (tiers 33/19/24 per `SPEC.md` section 5.2).
- **Status**: Accepted

## D-002 | 2026-11-23 | Disk Guardrail
- **Decision**: `LAPTOP-7RFE16FO` disk thresholds are `ok` at `>= 10 GB` free, `warn` at `5 <= free < 10 GB` (no concurrent `npm install`), and `block` at `< 5 GB`. Existing local clones are registered at zero disk cost; only lightweight active repos are shallow-cloned without `npm install`; `Sahana-Sundar-Site` (59 MB) and the Tier 3 legacy/coursework repos are JIT-cloned via `scripts/ensure-project.ps1` only when free disk is `>= 5 GB`.
- **Why**: `C:` had 8.7 GB free at setup and 7.68 GB at spec inspection, which is already in the `warn` band.
- **Status**: Accepted

## D-003 | 2026-11-23 | Provider Mapping
- **Decision**: Lead `Fable 5.2` routes to `cursor/claude-fable-5-2` (`effort: "high"`, fallback `opencode/github-copilot/claude-fable-5.2`). Builders `Opus 5.5` x2 route to `cursor/claude-opus-5-5` (`effort: "high"`) and `antigravity/claude-opus-5-5` (`thought_level: "high"`), with `codex/gpt-6.2-sol` as the usage-limit fallback.
- **Why**: Standalone `claudeAgent` is disabled in T3 Code (`Provider instance is disabled`), so it must never be routed to.
- **Status**: Accepted

## D-004 | 2026-11-23 | PR Bottleneck Triage
- **Decision**: Collapse duplicate `InvestoDash` `[AutoDev]` PRs to the latest candidate (highest number) for human sign-off, with zero destructive auto-close, and prioritize the unauthenticated-API security lockdown PRs first (P0).
- **Why**: Duplicate AutoDev PRs bury real work; security fixes carry the highest risk. The original figure of "100 open PRs across 14 repos" came from a `--limit 100` snapshot and is superseded by D-011.
- **Status**: Accepted

## D-005 | 2026-11-23 | Phone Channel
- **Decision**: Phone pings use T3 Connect remote webhook dispatch (referenced only as `<T3_WEBHOOK_URL_FROM_SETTINGS>`) plus `scripts/notify-phone.ps1`, which reads `NTFY_TOPIC`, `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`, or `DISCORD_WEBHOOK_URL` from env vars at runtime, and always appends to the local outbox `C:\Users\sujay\AI-Memory\fleet\phone-outbox.jsonl`. Every approval ping is one line: `<what> | <where> | <diff or PR link>`.
- **Why**: One-line pings keep approvals actionable from a phone; env-var-only secrets keep tokens out of git.
- **Status**: Accepted

## D-006 | 2026-11-23 | Reclaimable Worktree Bloat
- **Decision**: Flag, but do not delete, `OrchestratorSujay\.workspaces-conformance-*` (17 folders) and `ConcretePOA\.claude\worktrees\*` (~2+ GB estimated) for human cleanup sign-off before adding heavy concurrent worktrees.
- **Why**: Deletes always wait for human approval. Reclaiming this space would help restore free disk toward the 10 GB threshold.
- **Status**: Pending-Approval

## D-007 | 2026-11-23 | Safe Repo Hygiene
- **Decision**: Leave Sujay's pre-existing uncommitted work in the `Central-Command` root checkout (`M skill-sections.js` plus untracked backup and patch files) untouched, and isolate all Fleet HQ changes in clean T3 `git worktree` branches opened as Astra-reviewed PRs.
- **Why**: Fleet work must never clobber in-progress human edits.
- **Status**: Accepted

## D-008 | 2026-11-23 | Lead Provider Fallback
- **Decision**: After `cursor/claude-fable-5-2` stalled silently for 4 minutes after `run.start` with no active worker process, interrupt the thread and switch Lead (`Fable 5.2`) to `opencode/github-copilot/claude-fable-5.2` (`variant: "high"`).
- **Why**: The stuck-thread rule requires re-routing instead of waiting on a silent provider.
- **Status**: Superseded

## D-009 | 2026-11-23 | Lead Provider Fallback #2
- **Decision**: After `opencode/github-copilot/claude-fable-5.2` failed on the Lead spec, fall back to `antigravity/claude-opus-5-5` (`thought_level: "high"`) per the plan fallback chain. `SPEC.md` was authored on this provider.
- **Why**: Second link in the Lead fallback chain; keeps the spec on a high-reasoning model.
- **Status**: Accepted

## D-010 | 2026-11-23 | Three Disjoint Branches
- **Decision**: Split Fleet HQ infrastructure into three PR branches with a zero-overlap file ownership matrix (`SPEC.md` section 2): `feat/fleet-ops-and-registry` (B1: `fleet/`, `scripts/`, `tests/fleet-cli.test.mjs`), `feat/fleet-playbooks` (B2: `SPEC.md`, `DECISIONS.md`, `playbooks/`, `tests/playbooks.test.mjs`), and `docs/fleet-team-manual` (B3: `TEAM.md`, `CHANGELOG.md`, `tests/docs.test.mjs`).
- **Why**: Disjoint files let builders work in parallel isolated worktrees and merge in any order without rebases; each branch test reads only its own files.
- **Status**: Accepted

## D-011 | 2026-11-23 | PR Count Correction
- **Decision**: The live count of 226 open PRs across 18 repos (`InvestoDash` = 200, search-capped) supersedes the earlier "100 open PRs across 14 repos". `node scripts/fleet-cli.mjs triage-prs` computes counts live and is the source of truth.
- **Why**: The earlier figure was capped by `--limit 100`; hardcoded counts go stale.
- **Status**: Accepted

## D-012 | 2026-11-23 | No package.json, no tracked .gitignore
- **Decision**: Fleet HQ ships no `package.json` and no npm dependencies (Node built-ins and global `fetch` only), and no branch adds a tracked `.gitignore`. Runtime state goes under `.runtime/`, which self-ignores via a generated `.runtime/.gitignore` containing `*`.
- **Why**: The root checkout has an untracked `.gitignore`; a tracked `.gitignore` arriving on `main` would block `git pull` there. Zero dependencies also means zero `npm install` disk cost on a machine in the `warn` band.
- **Status**: Accepted

## D-013 | 2026-11-23 | Builder 1 Provider
- **Decision**: Because `cursor` stalled silently in Lead 4A, route Builder 1 (`Opus 5.5 #1`) directly to `antigravity/claude-opus-5-5` (`thought_level: "high"`) per the plan fallback rule.
- **Why**: Avoid re-hitting a provider that already stalled during this run.
- **Status**: Superseded

## D-014 | 2026-11-23 | Builder 2 Quota Fallback
- **Decision**: Route Builder 2 (`feat/fleet-playbooks`) to `codex/gpt-6.2-sol` (`reasoningEffort: "high"`).
- **Why**: `antigravity/claude-opus-5-5` reached its individual quota on Branch 2.
- **Status**: Accepted

## D-015 | 2026-11-23 | Builder 1 Quota Fallback
- **Decision**: Route Builder 1 (`feat/fleet-ops-and-registry`) to `codex/gpt-6.2-sol` (`reasoningEffort: "high"`).
- **Why**: `antigravity/claude-opus-5-5` reached its individual quota on Branch 1.
- **Status**: Accepted
