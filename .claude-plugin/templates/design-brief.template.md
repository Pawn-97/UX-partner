---
project: <project-name>
generated: <YYYY-MM-DD>
source: ./ux-onepage.md
---

<!--
KEEP THIS FILE SHORT. Total < 50 lines. Optimized for downstream design skill consumption (huashu-design / frontend-design / Figma).
Preserve [ref: ...] citations from ux-onepage.md so downstream can verify.
-->

# Design Brief: <project-name>

## In one sentence

<who> needs to <do what> in <which context>, so that <why>.

## Primary user

<role> + <key motivation> [ref: ...]

## Primary JTBD

When <situation>, I want to <action>, so I can <outcome>.

## Must-cover scenarios (3–5)

1. ... [ref: ...]
2. ...
3. ...

## Hard constraints

- ... [ref: ...]
- ... [ref: ...]
- ... [ref: ...]

## States to consider

default / empty / loading / success / error / permission-restricted / edge

(Remove states not applicable to this feature.)

## Don't design yet

- <thing 1> — <reason>
- <thing 2> — <reason>

## Suggested first design exploration prompt

```
Build a <type-of-screen-or-flow> for <primary-user> doing <primary-JTBD>.

Cover scenarios: <list>.
Respect constraints: <list>.
Don't include: <list>.

Reference patterns from KB: <ref>.
```
