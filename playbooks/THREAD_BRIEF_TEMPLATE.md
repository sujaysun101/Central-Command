# Thread Brief Template

Every delegated thread gets exactly one brief in this shape. Copy the block, fill every field, and keep it short enough to read on a phone.

```text
goal: <one sentence outcome>
files in scope: <exhaustive list of paths the thread may create or edit>
files out of scope: <paths and actions the thread must never touch>
done-when: <single verifiable command and its expected result>
budget: <max minutes, model effort, worktree isolation>
who reviews: <reviewer role, then human approval>
```

## Field Rules

### goal:
- One sentence, outcome-focused, naming the branch and repo.
- No implementation steps; those belong in `SPEC.md`.

### files in scope:
- Exhaustive list of paths. A file outside this list is scope creep (Astra CRITICAL).
- Must not overlap with any open thread or PR; if it does, the thread waits for that PR to merge.

### files out of scope:
- Name the shared and pre-existing paths to protect (for example `README.md`, `.gitignore`, `package.json`).
- Name forbidden actions: `npm install`, destructive GitHub actions, real secrets.

### done-when:
- One command with an objective result, such as `node --test tests/<name>.test.mjs` exits 0.
- The builder pastes the verbatim output into the PR body and ends with `PR <url>, head <SHA>, checks and reviews <state>`.

### budget:
- Max wall-clock minutes (a thread past 20 min with no progress is cancelled and re-briefed).
- Model effort (`effort: "high"` or `thought_level: "high"`) and `isolated worktree`.

### who reviews:
- Always GPT-6.2 Astra (read-only, max 3 rounds), then human approval.
- Escalation target after 3 rounds: Lead.

## Example

Filled brief for Branch 1 of `SPEC.md`:

```text
goal: Implement feat/fleet-ops-and-registry in Central-Command so fleet registry, routing data, and fleet-cli ops tooling ship as one draft PR.
files in scope: fleet/PROJECTS_REGISTRY.json, fleet/MACHINES.json, fleet/ROUTING_RULES.json, fleet/BACKLOG.md, scripts/fleet-cli.mjs, scripts/ops-health.ps1, scripts/triage-prs.ps1, scripts/notify-phone.ps1, scripts/ensure-project.ps1, tests/fleet-cli.test.mjs
files out of scope: README.md, .gitignore, index.html, skills.json, skill-sections.js, setup.sh, agents/**, codex/**, cursor-rules/**, hooks/**, skills/**, all B2 and B3 files, package.json; no npm install, no real tokens or webhook URLs.
done-when: node --test tests/fleet-cli.test.mjs exits 0 and the verbatim output is pasted in the draft PR body.
budget: 20 minutes, cursor/claude-opus-5-5 effort high (fallback antigravity/claude-opus-5-5), isolated worktree from base 48423a4.
who reviews: GPT-6.2 Astra (read-only, max 3 rounds) before human approval.
```
