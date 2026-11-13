---
key: SCHED-4412
title: "colours: move hard-coded colours to design tokens"
status: open
labels: [agent-ready, from:product]
---

## Intent
Replace every raw hex, rgb or named colour in components with a `--color-*` token from the tokens file (DES-2). Nothing visible changes.

## Acceptance
- Given the components, when the code is searched for raw hex, rgb or named colours, then none are left outside the tokens file.
- Given any screen, when it is rendered before and after, then it looks the same (no pixel change in the default scheme).
- Given a token is changed, when the page renders, then every component that used the old raw value follows it.
- Given the change, when it is done, then no new colour value is added to the tokens that the palette did not already hold, and no component gets a new raw value.

## Boundaries
- Must not touch layout, spacing, type or copy.
- Must not invent new colours: use the palette already in the tokens file.

Allowed by AUT-1 ("bringing code in line with a rule in `specs/` when nothing visible changes"); the rule is DES-2.
