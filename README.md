# Central Command

Software factory for Claude Code, Cursor, and Codex. One prompt ships a complete feature: research, story, spec, backend, frontend, tests, validation, PR review.

## What's here

```
agents/          Claude Code global agents (9 factory + 4 utility)
skills/          Claude Code skills (/feature-factory, /build-with-tests)
hooks/           pre-commit-gate.sh -- blocks .env/.key/.pem commits
cursor-rules/    .mdc rules for Cursor (factory workflow + conventions)
codex/           AGENTS.md for Codex CLI (adversarial review gate)
setup.sh         installs everything into ~/.claude
```

## Install

```bash
git clone https://github.com/sujaysun101/Central-Command.git
cd Central-Command
bash setup.sh
```

Restart Claude Code. Done.

## Usage

```
/feature-factory
I want to add <describe the feature>.
```

The chain runs automatically:
1. Codebase researcher maps relevant code
2. Story writer produces user story -- **you approve**
3. Spec writer produces technical brief -- **you approve**
4. Backend builder implements + unit tests
5. Frontend builder implements + component tests
6. Test verifier writes acceptance tests
7. Implementation validator reports gaps
8. PR reviewer checks the diff
9. **You approve** and open the PR

## Cursor

Copy `cursor-rules/*.mdc` into `.cursor/rules/` in any project (setup.sh does this automatically when run from inside a project).

## Codex

Copy `codex/AGENTS.md` into any project root. Codex CLI reads it automatically.

Use Codex as the adversarial review gate after Claude Code builds:
```bash
codex "adversarial-review the changes in this diff: $(git diff main...HEAD)"
```

## Agents

| Agent | Tools | Model | Job |
|---|---|---|---|
| codebase-researcher | Read, Grep, Glob | haiku | Map codebase, read-only |
| story-writer | Read | sonnet | Feature idea to user story |
| spec-writer | Read, Grep, Glob | sonnet | Story to technical brief |
| backend-builder | Read, Edit, Write, Bash | sonnet | Backend + unit tests |
| frontend-builder | Read, Edit, Write, Bash | sonnet | Frontend + component tests |
| test-verifier | Read, Edit, Write, Bash | sonnet | Acceptance tests |
| implementation-validator | Read, Grep, Glob | sonnet | Gap report |
| pr-reviewer | Read, Grep, Glob, Bash | sonnet | PR checklist |
| feature-orchestrator | Read, Bash | sonnet | Runs the full chain |
