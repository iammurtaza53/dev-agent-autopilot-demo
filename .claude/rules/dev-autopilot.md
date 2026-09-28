# Dev Agent Autopilot v0.3.0

This repository uses a two-agent workflow. The thin local `dev-autopilot` launcher only starts Claude Code background sessions; it does not implement its own agent loop.

- **Codex CLI is the architect and reviewer.** It plans the task before code is written and reviews the branch before it is finalized. Codex never edits files.
- **Claude Code is the developer.** It owns implementation, tests, Git, the pull request and CI.

## Start of every Autopilot task

1. Read `.autopilot/config.json`.
2. Read the configured task file and relevant context files.
3. Respect all existing repository instructions, especially `CLAUDE.md` and `AGENTS.md`.
4. Stay within the stated task/phase scope. Make reasonable engineering decisions that do not change product scope.
5. Do not change model selection. Do not invoke `/model`, do not request a Claude model override, and do not pass `--model` or model config overrides to Codex. Use the user's configured/default models.

## Plan with Codex (architect)

Do this step only when `planner.enabled` is `true` in `.autopilot/config.json`.

- Before writing code, ask Codex for an architecture and implementation plan using the native Codex CLI in a read-only sandbox: `codex exec --sandbox read-only "<planning prompt>" < /dev/null`.
- The planning prompt must tell Codex to read the task file and the configured context files, inspect the relevant code, and return a concise plan: approach, files/modules to change, interfaces and data shapes, risks and edge cases, a test plan, and ordered implementation steps. Tell Codex not to write code or edit files.
- Do not add `--model`; Codex must use the user's configured/default model.
- Check the plan against the task and the repository rules, then implement it. You own the final decisions: if you deviate from the plan, say why in the pull request.
- Add a short "Plan (Codex)" summary to the pull-request description.

## Implementation loop (Claude)

- Implement the current task end-to-end.
- Run the deterministic checks listed in `.autopilot/config.json`.
- Repair check failures when they are caused by the task.

## Review with Codex (reviewer)

- Before finalizing, run a FRESH independent Codex review using the native Codex CLI, not MCP.
- Review the current task branch against the configured base branch with: `codex review --base <baseBranch> < /dev/null`.
- Do not add `--model`; Codex must use the user's configured/default model.
- Treat Codex as a reviewer only. Do not ask Codex to edit files.
- Fix actionable findings, rerun relevant deterministic checks, and run another fresh Codex review when appropriate. Stop after `reviewer.maxRounds` and report a blocker rather than looping forever.

## Git and GitHub

- Work on a non-base branch. Claude Code background-session worktree isolation may create/manage that branch automatically.
- You may commit and push the task branch and create/update a pull request.
- Never force-push protected/base branches.
- Never merge the pull request.
- After opening the PR, watch CI. If CI fails for task-related reasons, fix it, rerun checks, push, and re-check CI.
- Finish when the PR is ready for human review/merge or a genuine human gate is reached.

## Human gates

Stop and clearly report the gate instead of guessing when the work requires any item listed under `safety.humanGates` in `.autopilot/config.json`. This includes production/store actions, purchases, identity/2FA, legal/financial actions, production secrets, destructive production changes, DNS changes, and physical-device validation.

## Agent boundaries

Codex plans and reviews; it is not the writer. Use `codex exec --sandbox read-only` for planning and `codex review` for review. Claude owns implementation and decides how to act on Codex's plan and findings while respecting repository policy and the task.
