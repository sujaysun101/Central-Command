# Morning Report Template

One report per day for `LAPTOP-7RFE16FO`, generated before work starts. Headings are fixed and in this exact order.

```markdown
# Morning Report - <YYYY-MM-DD>

## Fleet Health
- [OK|WARN|BLOCK|ERROR] disk: <freeGb> GB free on C:\ (<status>)
- [OK|WARN] ram: <freeGb> / <totalGb> GB free
- [OK|BLOCK] node: <version>
- [OK|WARN] gh: <available>
- [OK|ERROR] registry: <projects> projects
- overall: <ok|warn|block|error>

## PR Triage
- Total: <total> open PRs across <repos> repos
- P0: <p0> | P1: <p1> | P2: <p2> | P3: <p3>
- AutoDev groups: <autodevGroups> (candidate kept, rest close-after-human-approval)

## Needs Approval
- <item awaiting human sign-off: deletes, merges, migrations, deploys, spend>

## Blocked
- <item blocked by guardrail or failure, with reason>

## Next Up
- <next queued item from fleet/BACKLOG.md Single-Thread Queue>

## Phone Line
morning-report <YYYY-MM-DD> | LAPTOP-7RFE16FO | disk <freeGb> GB <status>, <total> open PRs (<p0count> P0) https://github.com/sujaysun101/Central-Command/pulls
```

## Generation

- Generate with `node scripts/fleet-cli.mjs morning-report` (add `--json` for machine output, `--notify` to send the Phone Line via notify-phone logic).
- Offline / test input: `node scripts/fleet-cli.mjs morning-report --triage-input <gh-json-file>`.
- Exit codes: 0 ok, 3 disk blocked (report still printed), 4 `gh` failure.
- The Phone Line is built with `formatPing` and follows `<what> | <where> | <diff or PR link>`, max 280 chars.
