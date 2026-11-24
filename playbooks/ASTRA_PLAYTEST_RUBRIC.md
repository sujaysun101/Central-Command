# Astra Playtest Rubric

Reviewer: `GPT-6.2 Astra` (`codex/gpt-6.2-astra`, `reasoningEffort: "high"`, fallback `codex/gpt-6.2-sol`). Astra reviews every diff before a human sees it.

## Checklist

Check every item against the diff and the thread brief. Cite file and line for every finding.

- [ ] **Auth gaps**: new or changed endpoints, scripts, or handlers missing authentication or authorization checks.
- [ ] **Data loss**: destructive file, branch, DB, or GitHub operations (`rm -rf`, `Remove-Item -Recurse`, `git push --force`, `gh pr close`, `gh pr merge`, `gh repo delete`) or overwrites without backups.
- [ ] **Race conditions**: concurrent writes to shared state (`.runtime/ports.json`, outbox files), check-then-act on ports or files.
- [ ] **Tenant isolation**: one project, branch, or machine reading or writing another's data, ports, or DB files.
- [ ] **Secrets exposure**: real tokens, webhook URLs, or ntfy topics committed anywhere; env values printed in logs or errors. Only env var names and the placeholder `<T3_WEBHOOK_URL_FROM_SETTINGS>` are allowed.
- [ ] **Scope creep**: any file outside the brief's `files in scope:` list is CRITICAL.
- [ ] **Tests pasted verbatim**: the PR body contains the complete, unedited output of the brief's `done-when:` command, and it exits 0.
- [ ] **Port/DB isolation**: worktree ports come from `3100 + (crc16(branch) % 800)` and DBs from `.runtime/<branch-slug>.db`; nothing hardcodes a shared port or DB path.
- [ ] **No new deps**: no `package.json`, no lockfile, no `npm install`, no non-`node:*` imports.

## Output Format

Astra's review must use exactly this format (identical to `codex/AGENTS.md`):

```
CRITICAL (block merge):
- <finding> [file:line]

IMPORTANT (fix before merge):
- <finding> [file:line]

MINOR:
- <finding> [file:line]

VERDICT: BLOCK | APPROVE
```

- Never skip the VERDICT line.
- BLOCK if any CRITICAL finding exists.
- Do not invent findings. If clean, say APPROVE.

## Loop Rules

- Max 3 rounds per PR.
- Round N `VERDICT: BLOCK` -> findings go back to the builder in the same thread; the builder fixes and re-pastes test output.
- Each re-check is a new read-only review, not a continuation.
- After round 3 without `VERDICT: APPROVE`, escalate to the Lead (`Fable 5.2`) with all three reviews.
- `VERDICT: APPROVE` hands the PR to human approval; Astra never merges.

## Read-Only Guarantee

- Astra runs with `read-only` permissions: it never edits files, commits, pushes, comments on behalf of the builder, closes, or merges.
- Astra may read the diff, the brief, `SPEC.md`, and run read-only commands (`git diff`, `git log`, `node --test`).
- Any fix Astra suggests is applied by the builder, not by Astra.
