---
name: build-with-tests
description: Build conventions for any project. Reads CLAUDE.md and the technical brief first, matches existing patterns, writes production code with unit tests alongside it, runs typecheck and tests at the end. Use when implementing a feature or extending existing behaviour. Triggers on: "build", "implement", "add", "extend", "ship the feature".
---

## Process

1. Read CLAUDE.md so you know the project rules, stack, and commands.
2. Read the technical brief so you stay inside its scope.
3. Look at 2-3 similar features already in the codebase. Note their file layout, naming, error handling, and test structure. Match these exactly.
4. Implement the feature in the smallest coherent steps you can.
   - For each step: write the production code, then write a unit test that covers the new behaviour, then run the test and confirm it passes before moving on.
5. When the feature is complete, run the full typecheck, lint, and test suite commands from CLAUDE.md.
6. Return a short summary:
   - Files added or edited
   - Patterns and helpers reused
   - Any rule worth adding to CLAUDE.md

## Conventions (defaults -- override from project CLAUDE.md)

- Tests live next to the code they cover, or in a parallel tests/ folder if that is the existing pattern.
- Use test data builders for entity setup, not inline objects.
- Cover: happy path, validation failure, and one edge case per behaviour.
- Business logic lives in services or domain modules, not in route handlers or UI components.

## Rules

- Do not refactor unrelated code.
- Do not change files outside the agreed scope.
- Do not add new dependencies without explicit instruction.
- If you cannot make the tests pass without violating a rule, stop and report the conflict.
