# Dev Agent Autopilot Demo

This repository is a small end-to-end validation project for **Dev Agent Autopilot**.

Main project: https://github.com/iammurtaza53/dev-agent-autopilot

It started as the public Todo demo bundled with Dev Agent Autopilot and was copied into its own repository so the complete workflow could be tested against a real GitHub repository and pull request.

## What this repo validates

The first real run successfully exercised the full workflow:

```text
NEXT_TASK.md
  -> Codex plans in a read-only sandbox
  -> Claude Code implements
  -> deterministic tests run
  -> Codex independently reviews
  -> Claude fixes review findings
  -> pull request opens
  -> GitHub CI runs
  -> human merge gate
  -> owner merges
  -> post-merge tests run
```

Autopilot did **not** merge the pull request itself.

## Validation result

The first end-to-end run completed successfully in:

- PR #1: https://github.com/iammurtaza53/dev-autopilot-demo/pull/1
- merged commit: `fefeb82441a692b236213e693262fb1c2105f3d7`

The task added:

- todo filtering by status;
- todo removal;
- todo summary counts;
- regression tests for the new behavior and error paths.

Codex produced the implementation plan before coding, found one issue during review, Claude fixed it, a fresh Codex review passed, CI was green, and the owner performed the merge.

## Run the demo locally

Requirements:

- Node.js
- Git
- GitHub CLI
- Claude Code
- Codex CLI
- Dev Agent Autopilot

Install dependencies are not required for this tiny demo because it has no external runtime dependencies.

Run the test suite with:

```bash
npm test
```

## Re-running the Autopilot demo

For a fresh end-to-end run, use the maintained demo source in the main Dev Agent Autopilot repository:

https://github.com/iammurtaza53/dev-agent-autopilot/tree/main/examples/demo-todo-app

That version contains the current onboarding instructions.

Dev Agent Autopilot v0.3.1 also ignores Claude background-session worktrees under `.claude/worktrees/`, so those local worktrees do not make the project appear dirty.

## Purpose

This is intentionally a tiny demo application, not a production Todo product. Its purpose is to provide a concrete, inspectable example of the Autopilot workflow and its human merge boundary.

**Codex plans. Claude Code builds. Codex reviews. You merge.**
