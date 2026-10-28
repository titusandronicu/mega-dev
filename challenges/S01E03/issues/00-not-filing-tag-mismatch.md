# Decision: intakeTag mismatches (38) are not filed as a 4th ticket

38 of 412 reports have `meta.intakeTag` (a guess made from the reporter's browser at intake,
per `causes.ts`'s own comment) disagreeing with the tenant-derived `causeOf()` result.

This is a desk **process** accuracy issue, not a user-facing product bug engineering can fix —
there's no code path to patch; it's intake's heuristic guessing wrong on the direction of the
swap. It's real and worth recording (done in `analysis.md` and the kb page), but it doesn't
meet the bar of "a problem desk ticket #4471 holds" the same way the 3 filed tickets do: it doesn't change what's
broken or how many users are affected, only how the 412 reports were initially labeled.
Recommendation: mention it on the kb page as context (how reliable intake's first guess is),
not as its own ticket.
