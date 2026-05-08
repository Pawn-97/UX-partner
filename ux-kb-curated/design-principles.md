# Design Principles

Hand-curated design principles the team has agreed on. Keep < 100 lines.

The skill reads this file at the start of every session as **anchor knowledge**. These principles act as constraints during reframing and onepage drafting — when the skill asks "should we do X or Y?", these are the criteria for breaking ties.

## How to use

- One section per principle.
- Each principle: short rule + rationale + when it applies + when it doesn't.
- Edit freely. No script regenerates this.

## Principles

### 1. Admin clarity over admin power

**Rule:** When designing admin features, clarity beats configurability. Admins should always know what state they're in and what the system will do next.

**Why:** Zoom Phone admins are responsible for outcomes they can't easily reverse (call routing, number provisioning). Confused admins cause customer impact.

**Applies when:** designing any admin-facing flow.

**Doesn't apply when:** designing power-user flows where the user has explicit train-up (e.g., engineering integrations).

---

### 2. End-user transparency

**Rule:** End users should understand what's happening to their call/message, even when admins control the underlying configuration.

**Why:** Phone is a high-trust medium. Silent failures or surprise behaviors damage trust.

**Applies when:** any user-facing feature that involves admin-configured logic (e.g., routing, queueing, recording).

---

### 3. Failure states are first-class

**Rule:** "What happens when this fails?" is a required design question, not a polish-phase concern.

**Why:** Failures in Phone are user-visible (dropped calls, lost voicemail). Edge-case handling differentiates production-grade from prototype.

**Applies when:** designing any flow that depends on network, carrier, or external service.

---

### 4. Don't surface infra unless necessary

**Rule:** Network paths, carriers, regions, codecs — hide unless the user has a specific reason to care.

**Why:** Most users don't care about the underlying mechanics. Surfacing them creates noise and false-failure perceptions.

**Applies when:** designing user-facing features.

**Doesn't apply when:** designing diagnostic / troubleshooting tools where the infra IS the subject.

---

### 5. Respect existing admin mental models

**Rule:** When adding new admin features, map them to the existing taxonomy (sites, groups, extensions, queues, routes) before inventing new abstractions.

**Why:** Admins manage multiple Zoom Phone deployments. Cognitive consistency across features is high-value.

**Applies when:** adding new admin configuration surfaces.

---

## Add new principles when

- A discussion repeatedly converges on the same trade-off and the team decides a default direction.
- A leadership/PM/eng decision becomes a long-term constraint that should bind future designs.
- A user research finding becomes a north star.

## Don't add

- One-off project decisions (those go in `decisions.md` for the specific project).
- Generic UX wisdom unrelated to this product (the LLM has those).
- Aspirational principles the team doesn't actually follow.

## Review cadence

Quarterly. Stale principles drift away from real practice and erode trust in this file.
