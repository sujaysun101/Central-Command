---
name: feature-factory
description: Orchestrates a complete feature build end to end. Runs codebase-researcher, story-writer, spec-writer, backend-builder, frontend-builder, test-verifier, implementation-validator, and pr-reviewer in sequence with human approval points after the story and the brief. Loops back on critical findings. Use this skill when the user asks to build, ship, or implement a feature end to end. Triggers on: "build a feature", "ship a feature", "run the factory", "feature factory", "/feature-factory".
---

## What this skill does

Runs the full eight-agent chain with three human approval gates. You type one prompt. The chain runs. You approve or refine at the story, the brief, and the final review. The rest is automated.

## Chain order

1. **codebase-researcher** -- map the area of code involved. Pass: feature idea + relevant area.
2. **story-writer** -- produce a user story. Pass: feature idea + researcher findings.
3. **[PAUSE] Story approval** -- show the story. Ask: "Approved / request changes / reject?"
   - Approved: go to 4.
   - Changes: re-run story-writer with feedback. Repeat 3.
   - Rejected: stop. Summarise what was explored.
4. **spec-writer** -- produce the technical brief. Pass: approved story + researcher findings.
5. **[PAUSE] Brief approval** -- show the brief. Ask: "Approved / request changes / reject?"
   - Approved: go to 6.
   - Changes: re-run spec-writer with feedback. Repeat 5.
   - Rejected: stop. Keep the approved story for a future run.
6. **backend-builder** -- implement backend + unit tests. Pass: brief + researcher findings.
7. **frontend-builder** -- implement frontend + component tests. Pass: brief + researcher findings + backend summary.
8. **test-verifier** -- write acceptance tests against the story. Pass: story + brief + both builder summaries.
9. **implementation-validator** -- compare implementation to story and brief. Pass: story + brief + test report + files on disk.
10. **Fix loop** -- if critical findings: route to the right builder, re-run test-verifier, re-run validator. Repeat until clean or user decides to proceed.
11. **pr-reviewer** -- review the full diff against the project checklist.
12. **[PAUSE] Final approval** -- show validator and PR-reviewer findings. Ask: "Ready to open the PR?"

## Rules

- Never skip the approval gates.
- Never run frontend-builder before backend-builder finishes.
- Never run test-verifier before both builders finish.
- Never run the validator before test-verifier runs.
- For backend-only features: skip step 7.
- For frontend-only tasks: skip step 6.
- Each agent gets minimum viable context -- only the inputs it needs, not the full conversation.
- If any agent cannot complete its task: surface the agent name and reason. Stop. Do not silently retry.
