<!--
  AGENTS.md — the operating contract for AI agents working in this repository.

  Sections marked [PORTABLE] are behavioral rules and can be kept as-is.
  Sections marked [FILL] describe THIS repository and must be replaced with real,
  verified commands and paths. A wrong command here is worse than no section:
  the agent will trust it and burn a whole turn on a failing command.

  Rule of thumb: every claim in this file must be something you have actually run.
  Delete these HTML comments once the file is filled in.
-->

# Think Before Coding

<!-- [PORTABLE] -->

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

# Simplicity First

<!-- [PORTABLE] -->

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

# Surgical Changes

<!-- [PORTABLE] -->

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

# Goal-Driven Execution

<!-- [PORTABLE] -->

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

# Writing Comments

<!-- [PORTABLE] — keep; the full guidance lives in .agents/skills/writing-comments/ -->

These rules apply to **every** comment you write, including ones added incidentally while fixing a bug.

- Write for a contributor reading the code at HEAD, months later, with no access to this conversation, the PR, or the diff.
- Never narrate change history ("now", "previously", "no longer") and never address the reviewer ("this correctly handles...").
- Deletion test: a comment must state something the reader cannot recover from the code. If names or types already carry it, don't write it.
- `/** */` docs state the contract (behavior, params, returns, throws); `//` comments carry rationale only. Anchor a workaround to the issue or PR that motivates it.
- When your change alters documented behavior, extend or correct the existing prose — never replace specific docs with generic text.

# Style Guide

<!-- [FILL] Name the formatter and linter, and the exact commands. Do not describe style in prose
     that a tool already enforces — point at the tool. -->

- Follow the conventions and patterns you detect in the surrounding code.
- Formatting rules live in `<CONFIG FILE>`, enforced by `<TOOL>`.
- Run `<FORMAT COMMAND>` to auto-format the repository.
- Run `<LINT COMMAND>` to lint the repository.

# Environment Guide

<!-- [FILL] Runtime versions, package manager, and hard constraints of the sandbox.
     Include the negative rules — what NOT to reach for. -->

- Runtime: `<node >=X / python >=X / ...>`
- Package manager: `<pnpm@X / uv / cargo>`. Do not use a different one; the lockfile is authoritative.
- Use `<preferred scripting tool>` for ad-hoc scripting, not `<the one that is absent>`.
- `<Any required env var, service, or credential, and how to obtain it.>`

# Repository Structure

<!-- [FILL] A map, not an inventory. Only the directories an agent must know to place a change
     correctly. If your build emits artifacts, map the artifact path back to source — this single
     mapping saves an agent from editing generated files. -->

```
<dir>/            # <what lives here, and what must never live here>
<dir>/
```

Build output maps back to source as:

- `<dist/...>` → `<src/...>`

Edits to source take effect after rebuilding via `<BUILD COMMAND>`.

# Running Tests

<!-- [FILL] The single most valuable section. Give the narrow commands, not just the full suite —
     an agent that only knows the full suite will run it for a one-line change. -->

- Full suite (slow): `<COMMAND>`
- Single package: `<COMMAND>`
- Single file: `<COMMAND>`
- Filter by test name: `<COMMAND>`
- Key flags: `<--watch, --match, --timeout, ...>`

# Quick Reference

<!-- [FILL] The project's own CLI/scripts, with the negative rules attached.
     "Do not use X instead" is often the highest-value line in this file. -->

- `<COMMAND>` — <what it does>. Do not substitute `<common wrong alternative>`.
- Full docs: <URL>

# Background Processes

<!-- [FILL] How an agent starts something long-running without orphaning it.
     If your tooling has no supervised mode, say so and give the safe fallback. -->

1. `<start command>` — start in the background
2. `<logs command>` — read logs
3. `<status command>` — check state
4. `<stop command>` — stop when work is complete

Do not start detached processes with `&`.

# Deep Dives

<!-- [FILL] An index of long reference documents, each with a trigger condition.
     A pointer without a trigger ("read this when X happens") will not be read. -->

## <Subsystem>

When <specific symptom or task>, read [`<path>`](path) before changing anything. <One sentence on
what the document contains and why the naive approach fails without it.>
