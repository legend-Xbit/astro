# `.agents/` — skill system

A skill is a procedure the model loads **on demand**, not on every turn. `AGENTS.md` is always in
context and must stay short; anything longer than a screen, or needed by only some tasks, belongs in
a skill.

```
.agents/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md          # required — the entry point, kept short
│       ├── <reference>.md    # optional — loaded only when SKILL.md points to it
│       └── evals/
│           └── evals.json    # required — how this skill is graded
├── evals/                    # the live-model eval runner (optional to adopt)
└── tools/
    └── validate-skills.mjs   # zero-dependency structural validator
```

## The authoring contract

**1. Frontmatter is a routing decision, not a summary.**

```yaml
---
name: <must equal the directory name>
description: <what it does + the literal phrases that should trigger it>
compatibility: <optional — tools or access this skill assumes>
---
```

The `description` is the only thing the model sees before deciding to load the skill. Write it to be
matched, not to be read: name the trigger phrases a user would actually type ("add a changeset",
"triage issue #1234", "review this PR"). A description that only paraphrases the title will never
fire.

**2. Progressive disclosure.** `SKILL.md` stays under ~150 lines. Detail goes into sibling files that
`SKILL.md` links to with a trigger condition. Two shapes work:

- **Router** — a decision table mapping task → files to read. Use when the skill loads context.
  (`| Fixing a bug | debugging.md | architecture.md |`)
- **Pipeline** — numbered stages, each in its own file, each with an explicit exit gate. Use when the
  skill performs a workflow.

**3. Every stage has an exit gate.** A pipeline skill states, after each step, the conditions under
which the run stops early:

```
After completing reproduction, check the result:
- If the issue was **skipped** — skip to Output.
- If it was **not reproducible** — skip to Output.
- If it was **reproduced** — continue to Step 2.
```

Without gates the model completes every stage regardless of evidence, and produces a confident fix
for a non-bug.

**4. Isolate expensive stages in a subagent.** When a stage generates a lot of throwaway context
(reading logs, exploring a tree, reproducing a bug), instruct the model to run it in a subagent and
return only its conclusion.

**5. Give an infrastructure bail-out.** State a hard attempt limit for anything environmental — a
server that won't start, a missing CLI, a blocked port — and what to produce instead. Loops on
infrastructure consume an entire budget and return nothing.

**6. State the safety boundary explicitly.** If a skill must not write files, run project code, or
touch the network, say so at the top under its own heading. A read-only skill that isn't declared
read-only will not stay read-only.

**7. Name the anti-triggers.** Close each skill with "When NOT to use this skill", pointing at the
sibling skill that owns those cases. This is what stops one skill from swallowing the others.

**8. Include a self-check.** End procedural skills with a short checklist the model runs before it
reports done. It converts vague instructions into verifiable ones.

## Evals

Every skill carries `evals/evals.json`. Each case is a prompt plus **assertions written as
observable facts** — a file that must exist, a verdict that must appear, an action that must NOT have
been claimed. The runner mounts every skill, requires the target skill to actually be activated, runs
the model in a disposable workspace, and has a second model grade the transcript, tool calls, and
resulting files against each assertion.

```json
{
  "skill_name": "<must equal the directory name>",
  "evals": [
    {
      "id": 1,
      "prompt": "<a complete, self-contained task>",
      "expected_output": "<one sentence describing a correct run>",
      "files": ["<repo-relative fixtures copied into the workspace>"],
      "assertions": ["<observable fact>", "<observable fact>"]
    }
  ]
}
```

Three cases per skill is the useful minimum, and they should not all be the happy path:

1. **Happy path** — the skill does its job end to end.
2. **Early exit** — the input should stop the pipeline at an exit gate. Asserts the gate works.
3. **Negative** — the input looks like a job for this skill but isn't (intended behavior, out of
   scope). Asserts the skill declines instead of inventing work.

Assertions must be checkable from the artifacts. `"The fix is correct"` is not gradeable;
`"The proposed fix guarantees minute-format seconds stay between 0 and 59"` is.

Include at least one assertion of the form _"the response does not claim that files were changed or
commands were run"_ on any dry-run case. Overclaiming is the most common skill failure and nothing
else catches it.

Validate structure without spending tokens:

```sh
node .agents/tools/validate-skills.mjs
```

Run the live evals (costs provider tokens, needs `ANTHROPIC_API_KEY`) — see
[`evals/README.md`](evals/README.md).
