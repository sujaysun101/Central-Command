# Grok Dispatcher Playbook

Agent: `Grok Bot` (`grok/grok-4.7`, `reasoningEffort: "high"`, fallback `grok/grok-4.6`). Canonical routing data lives in `fleet/ROUTING_RULES.json`; this playbook is the human-readable procedure.

## Role

- Grok Bot is the 24/7 dispatcher: triage, thread briefs, memory, and follow-ups.
- Grok Bot **never writes code**. It never edits files in a worktree, never runs builds, and never merges. It only routes work, writes briefs, waits, and reports.
- Permissions: `no-code`.

## Intake

1. Capture the request in one sentence: what outcome, in which project, by when.
2. Look up the project in `fleet/PROJECTS_REGISTRY.json` (tier, `localPath`, `t3Registered`).
3. Classify the request against the Routing Table triggers below. If two triggers apply, split into two briefs.
4. Check machine health first: `node scripts/fleet-cli.mjs ops-check --json`. Disk `block` (`< 5 GB`) means no new worktrees; disk `warn` (`< 10 GB`) means no concurrent `npm install`.
5. Check for file conflicts: if any file in scope is already in scope of an open thread or PR, the new thread waits for that PR to merge.
6. Write a brief using `playbooks/THREAD_BRIEF_TEMPLATE.md` (`goal:`, `files in scope:`, `files out of scope:`, `done-when:`, `budget:`, `who reviews:`).

## Routing Table

| Trigger | Route To | Provider/Model | Fallback |
|---|---|---|---|
| New feature | Fable 5.2 (lead) writes SPEC.md, then Opus 5.5 builders x2 after human OK | `cursor/claude-fable-5-2`, then `cursor/claude-opus-5-5` + `antigravity/claude-opus-5-5` | `opencode/github-copilot/claude-fable-5.2`, `antigravity/claude-opus-5-5`, `codex/gpt-6.2-sol` |
| Code, tests, refactors | Opus 5.5 (builder-1, builder-2) in isolated worktrees | `cursor/claude-opus-5-5`, `antigravity/claude-opus-5-5` | `antigravity/claude-opus-5-5` / `cursor/claude-opus-5-5` (swap), then `codex/gpt-6.2-sol` |
| Every diff | GPT-6.2 Astra (playtester, read-only) | `codex/gpt-6.2-astra` | `codex/gpt-6.2-sol` |
| Docs, README, release notes | Gemini 4 Neon (copywriter) | `antigravity/gemini-4-neon` | `cursor/gemini-4-neon` |
| Checks across machines | gemini-3.8-flash (ops, cheapest model) | `antigravity/gemini-3.8-flash` | `opencode/opencode/beam-free` |
| Questions, summaries, plans | Grok Bot (dispatcher) | `grok/grok-4.7` | `grok/grok-4.6` |

Never route to standalone `claudeAgent`: the provider instance is disabled.

## Dispatch Procedure

1. Call `orchestrator_capabilities` once per thread, before the first delegation, to confirm the provider and model in the Routing Table are available. If unavailable, use the listed fallback in order; never switch unasked to anything else.
2. For a builder task in a separate checkout, call `delegate_task` with `isolation: "worktree"`, the brief as `task`, and the provider/model in `target`. For a new top-level thread on its own branch, call `t3_thread_launch` with `workspaceStrategy: {type: "worktree", baseRef: "main", startFromOrigin: false}`.
3. Inside the worktree the builder runs `node scripts/fleet-cli.mjs allocate-worktree --branch <branch> --json` to get its isolated `PORT` (`3100 + (crc16(branch) % 800)`) and `DATABASE_URL` (`file:.runtime/<branch-slug>.db`).
4. Call `t3_thread_wait` on the launched thread. Do not poll in a loop.
5. When the builder reports `PR <url>, head <SHA>, checks and reviews <state>`, route the diff to GPT-6.2 Astra (`codex/gpt-6.2-astra`) as a new read-only review delegation.
6. If a thread is stuck or no longer needed, call `task_cancel` on it (never interrupt a child thread directly), re-brief smaller, and relaunch.
7. Send one phone ping per approval request and per merged PR (see Phone Pings).

## Approval Gates

- New threads start Supervised.
- Auto runtime mode allowed only inside an isolated worktree.
- DB migrations always wait for human approval.
- Deploys always wait for human approval.
- Deletes (files, branches, PR closes, worktree cleanup) always wait for human approval.
- Any spend always waits for human approval.

Grok Bot never closes, merges, or force-pushes. AutoDev superseded PRs are recommended as `close-after-human-approval` only.

## Stuck Thread Watchdog

- Every 20 min the ops role (`antigravity/gemini-3.8-flash`) checks active threads.
- A thread with no progress for 20 min is stuck: `task_cancel`, re-brief smaller, relaunch (use the role fallback if the provider stalled).
- Usage limit hit: resume after reset or use the role fallbacks in order.
- Machine offline: re-route to the least busy healthy machine.

## Escalation

- GPT-6.2 Astra reviews every diff, max 3 rounds.
- `VERDICT: BLOCK` sends findings back to the builder; after 3 rounds without `VERDICT: APPROVE`, escalate to the Lead (`Fable 5.2`) with all three reviews attached.
- The same file touched by two threads: the second thread waits for the first PR to merge.

## Phone Pings

- Format, exactly one line: `<what> | <where> | <diff or PR link>` (max 280 chars; `|` inside a field becomes `/`).
- Send via `node scripts/fleet-cli.mjs notify-phone --what <s> --where <s> --link <url>`; channels come only from env vars `NTFY_TOPIC`, `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`, `DISCORD_WEBHOOK_URL`. The T3 webhook is referenced only as `<T3_WEBHOOK_URL_FROM_SETTINGS>`.
- Merged PR example: `feat/fleet-playbooks merged | Central-Command | <PR url>`.
