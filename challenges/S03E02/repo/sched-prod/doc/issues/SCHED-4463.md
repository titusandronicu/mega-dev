---
key: SCHED-4463
title: "type: move hard-coded font sizes to the type scale"
status: open
labels: [agent-ready, from:product]
---

## Intent
Replace every font size set inside a component with a step of the type scale in the tokens (DES-1). Nothing visible changes.

## Acceptance
- Given the components, when the code is searched for font sizes, then none sit outside the type scale.
- Given any screen, when it is rendered before and after, then text looks the same at the default setting.
- Given a type scale step changes, when the page renders, then every component using it follows.
- Given the change, when it is done, then it must not leave a component with its own size or add a new size to the scale.

## Boundaries
- Must not touch colours, spacing, layout or copy.
- Must not add a text-size setting; that is a separate issue.

Allowed by AUT-1 ("bringing code in line with a rule in `specs/` when nothing visible changes"); the rule is DES-1.
