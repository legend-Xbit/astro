# Skill evals

Live-model tests for the skills in `.agents/skills`. They are deliberately **not** part of the normal
test suite and not wired into CI: every case spends provider tokens and is nondeterministic.

## Structural validation (free)

Run this on every commit — it catches the failures that would otherwise surface halfway through a
paid eval run:

```sh
node .agents/tools/validate-skills.mjs
```

## Live runs (paid)

Dependencies (dev): `vitest`, `valibot`, `@flue/runtime`, `@earendil-works/pi-ai`.

```jsonc
// package.json
"scripts": {
  "eval:skills": "vitest run --config vitest.skills.config.ts",
  "eval:skills:validate": "vitest list --config vitest.skills.config.ts"
}
```

```sh
pnpm eval:skills:validate                                   # load every manifest, call no model
ANTHROPIC_API_KEY=... pnpm eval:skills                      # every case
ANTHROPIC_API_KEY=... pnpm eval:skills -t "<skill>"         # one skill
ANTHROPIC_API_KEY=... pnpm eval:skills -t "<skill> #1"      # one case
```

Each case costs one subject-model run plus one judge-model run. Defaults are
`anthropic/claude-sonnet-4-6` (subject) and `anthropic/claude-haiku-4-5` (judge); override with
`SKILL_EVAL_MODEL` and `SKILL_EVAL_JUDGE_MODEL`. `SKILL_EVAL_VERBOSE=1` prints passing outputs and
judge summaries. `SKILL_EVAL_MIN_CASES` (default 3) sets how many cases a manifest must carry.

## How a case runs

1. A temporary workspace is created and the manifest's `files` are copied into it. It is deleted
   afterward.
2. The subject agent is started with **every** skill mounted and told to activate the target skill.
   The run fails if it never activates — a skill that does not fire is a broken `description`, and
   this is the check that catches it.
3. The prompt is dispatched. Tool calls are recorded as they stream.
4. The workspace is snapshotted after the run.
5. A judge model receives the prompt, expected output, numbered assertions, the agent's text, its
   tool calls, and the resulting files, then grades each assertion with evidence via a single
   structured tool call.
6. Any failed assertion fails the test, printing the judge's evidence.

The runner excludes `evals/` when mounting skill resources, so the subject model never sees the
assertions it is being graded against.
