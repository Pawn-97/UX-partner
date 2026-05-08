---
project: <project-name>
generated: <YYYY-MM-DD>
prd_source: ./pm-source.md
prd_version: <v1 / v2 / ...>
---

<!--
Cite-or-die rule: every claim below MUST end with [ref: <path>].
- pm-source.md:L<line> for PRD facts
- decisions.md:D<id> for decisions
- assumptions.md:A<id> for assumptions (mark these as inference, not fact)
- questions.md:Q<id> for open questions
- <kb-path> for KB-sourced facts (use the actual ctx_search result path)

Outdated PRD refs get ⚠️ outdated marker.
Sections may be empty if not applicable to this project. Empty sections should be marked with `_(not applicable)_` so it's clear they weren't skipped accidentally.
-->

# UX Onepage: <project-name>

## 1. Final Goal

<one sentence: who, in what context, achieves what> [ref: ...]

## 2. Problem Framing

<2–3 sentences: what we're really solving, distinct from PM's stated solution> [ref: ...]

## 3. PM Original Ask vs. Interpreted User Need

| PM Original Ask | Interpreted User Need | Source |
|---|---|---|
| ... | ... | [ref: pm-source.md:L...] |

## 4. Target Users

### Primary
<role + key motivation> [ref: ...]

### Secondary
<role + key motivation> [ref: ...]

### Impacted (non-direct)
<role + how impacted> [ref: ...]

## 5. User Behaviors

### Current
<how users do this today> [ref: ...]

### Desired
<how it should work> [ref: ...]

### Failure
<what happens when system fails> [ref: ...]

### Edge
<boundary cases> [ref: ...]

## 6. JTBD

### Primary
When <situation>, I want to <action>, so I can <outcome>. [ref: ...]

### Secondary
When ..., I want ..., so ... [ref: ...]

### Anti-JTBD
The user does NOT want to <unwanted state>. [ref: ...]

## 7. Key Scenarios

1. **<scenario name>** — <one-line description> [ref: ...]
2. **<scenario name>** — ... [ref: ...]
3. **<scenario name>** — ... [ref: ...]

## 8. Constraints from KB

| Constraint | Source | Confidence |
|---|---|---|
| ... | [ref: ...] | high/medium/low |

## 9. Key Decisions

<lifted from decisions.md, top 3-5>
- D1: ... [ref: decisions.md:D1]
- D2: ... [ref: decisions.md:D2]

## 10. Active Assumptions

<lifted from assumptions.md, status=active only>
- A1: ... (confidence: medium) [ref: assumptions.md:A1]

## 11. Open Questions

### Blocking
- Q1: ... (owner: ...) [ref: questions.md:Q1]

### Deferred
- Q3: ... (owner: ...) [ref: questions.md:Q3]

## 12. Design Direction Hypothesis

<this is direction, not UI>

- This is a <configuration / guidance / feedback / monitoring / repair> type of experience. (inference)
- Must prioritize <scenario X> in any design exploration. [ref: ...]
- Must NOT yet specify <thing>; it depends on <unresolved question>. [ref: questions.md:Q...]

## 13. Handoff Notes

<what the downstream design skill should know>

- States to consider: default / empty / loading / success / error / permission-restricted / edge
- Key risks downstream should design around: ...
- Reference patterns from KB: ... [ref: ...]
