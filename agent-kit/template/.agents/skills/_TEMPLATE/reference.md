<!--
  A supporting file is loaded ONLY when SKILL.md points at it. That makes it the right home for
  anything long: decision tables, command sequences, failure catalogues, worked examples.

  Give it the same discipline as SKILL.md: numbered steps, explicit exit conditions, real commands.
  Do not repeat SKILL.md here — a reader arrives with SKILL.md already in context.
-->

# <Stage Name>

## Prerequisites

<What must be true before this stage runs.>

## Overview

<Two or three sentences on what this stage decides.>

## Step 1: <Action>

<Exact commands. Real flags. Explain what a failure of each one means.>

```sh
<command>
```

## Step 2: Check for Early Exit Conditions

### <Condition> (`<machine-readable-slug>`)

<When it applies, and what to record before exiting.>

## Step N: Write Output

### `report.md` — <purpose>

```md
<the literal template the model should fill>
```
