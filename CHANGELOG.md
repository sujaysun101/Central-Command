# Changelog

All notable changes to the `Central-Command` Fleet HQ infrastructure are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Branch 1 (`feat/fleet-ops-and-registry`)**: Core fleet registry, host/routing configs, backlog, Node.js CLI, PowerShell wrappers, and unit tests:
  - `fleet/PROJECTS_REGISTRY.json`
  - `fleet/MACHINES.json`
  - `fleet/ROUTING_RULES.json`
  - `fleet/BACKLOG.md`
  - `scripts/fleet-cli.mjs`
  - `scripts/ops-health.ps1`
  - `scripts/triage-prs.ps1`
  - `scripts/notify-phone.ps1`
  - `scripts/ensure-project.ps1`
  - `tests/fleet-cli.test.mjs`
- **Branch 2 (`feat/fleet-playbooks`)**: Authoritative architecture spec, decisions log, operational playbooks, and playbook verification tests:
  - `SPEC.md`
  - `DECISIONS.md`
  - `playbooks/GROK_DISPATCHER.md`
  - `playbooks/THREAD_BRIEF_TEMPLATE.md`
  - `playbooks/ASTRA_PLAYTEST_RUBRIC.md`
  - `playbooks/MORNING_REPORT_TEMPLATE.md`
  - `tests/playbooks.test.mjs`
- **Branch 3 (`docs/fleet-team-manual`)**: End-to-end fleet operations manual, changelog, and documentation verification tests:
  - `TEAM.md`
  - `CHANGELOG.md`
  - `tests/docs.test.mjs`

### Changed

- **Open PR triage baseline (D-011)**: Corrected the fleet open PR count from the stale figure (`100` open PRs across `14` repos) to the verified live snapshot of **226 open PRs across 18 repositories** (captured `2026-11-23T21:24:00-05:00`: `InvestoDash` at 200 search-capped, `ConcretePOA` at 10, and 1 open PR each across 16 additional repositories), with `node scripts/fleet-cli.mjs triage-prs` designated as the live source of truth.
