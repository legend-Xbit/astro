---
name: _TEMPLATE
description: <What this skill does, in one clause.> Use when the user says "<literal trigger phrase>", "<another trigger phrase>", or when another skill directs you here.
compatibility: <Optional. Tools, credentials, or access this skill assumes. Delete if none.>
---

<!--
  Rename the directory and the `name` field together — they must match.
  Keep this file under ~150 lines. Push detail into sibling files and link them with a trigger.
  Delete every section you do not need; an empty heading is worse than no heading.
-->

# <Skill Name>

<One paragraph: what this produces and for whom. Not how.>

## Safety Boundary

<!-- Keep only if this skill is constrained. Be absolute; hedged limits are not limits. -->

This skill does not <write files / run project code / access the network / commit>. It reports; the
user acts.

## Input

You need either:

- `<argName>` provided in args (preferred), OR
- `<the fallback source, and how to fetch it>`

If `<optional arg>` is provided, <use it as X>. Otherwise default to `<default>`.

## General Rules

**Do not get stuck on infrastructure problems.** If <a server won't start / a tool is missing / a
port is blocked> — bail out after 2 attempts and report with the data you already have. A partial
report with solid findings beats no report because the budget went to fighting the environment.

## Step 1: <Stage>

Read and follow [<stage-1>.md](<stage-1>.md). Use a subagent for this step to isolate context.

After completing it, check the result:

- If **<exit condition>** — skip to Output.
- If **<other exit condition>** — skip to Output.
- Otherwise — continue to Step 2.

## Step 2: <Stage>

<Same shape: link, subagent if expensive, explicit gate.>

## Output

<The exact shape of the final result: file paths written, sections required, and what the caller
does with it.>

## Self-Check Before Finishing

- [ ] <Verifiable condition, not "the work is good">
- [ ] <Every claim of an action taken corresponds to an action actually taken>
- [ ] <The output matches the Output section exactly>

## When NOT to Use This Skill

- **<Adjacent task>**: use the `<other-skill>` skill instead.
- **Simple questions**: answer directly; don't load this skill.
