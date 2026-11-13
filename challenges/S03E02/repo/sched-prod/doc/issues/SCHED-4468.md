---
key: SCHED-4468
title: "spacing: move hard-coded margins to the spacing scale"
status: open
labels: [agent-ready, from:product]
---

## Intent
Replace every margin and padding set inside a component with a step of the 4 px scale in the tokens (DES-3). Nothing visible changes.

## Acceptance
- Given the components, when the code is searched for margins and padding, then none sit outside the 4 px scale.
- Given any screen, when it is rendered before and after, then spacing looks the same.
- Given a spacing step changes, when the page renders, then every component using it follows.
- Given the change, when it is done, then it must not leave a component with its own spacing value or add an off-scale value.

## Boundaries
- Must not touch colours, type, copy or the structure of the markup.
- Must not add a density setting; that is a separate issue.

Allowed by AUT-1 ("bringing code in line with a rule in `specs/` when nothing visible changes"); the rule is DES-3.
