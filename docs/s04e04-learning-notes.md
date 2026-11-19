# S04E04 learning notes - Work that starts without you

Source: John Lindquist's video transcript and the lesson text "Automating Work Beyond Code".

## Principles
- Events wake the system: the app writes one log line and moves on; a watcher reads it and starts the job. Give each event an identity and one entry point; filter with rules first, a small model only where rules fail.
- Hooks change a job's path: owner, trigger, condition, response, description, expiry. Plain code matches them; a model wakes only on a match. Alerts and approvals are shared primitives.
- Pipelines have a fixed path: observe, classify, route, execute, verify, communicate. Code does most steps; unclear cases go to a person.
- Push systems hand the agent exactly the facts it needs (a lookup by code), and keep internal notes out in code, not by instruction.
- Unattended work: pass^k on a labeled set with traps; "unsure waits for you" as a plain-code rule; bookmark moves last, so work must be safe to repeat; the same event twice runs once; agents report, never fix; code keeps the evidence.

## What the Challenge taught (see challenges/S04E04/log.md)
1. Answer each event once. A redelivery with the same content is acked, not answered again (the course counts "applied").
2. The same event id with other content is not a retry: park it for the owner; do not pick the later one.
3. Every running job on the board needs an owner among your roles. Foreign jobs took event 5 until stopped by job id.
4. A guest's change request, or a message with no booking, is never applied by the desk: park it.
5. A poller must survive a network timeout (retry), and run somewhere that stays up (the NAS).
6. A role that fetches the manual again makes a new attempt and a new night. Fetch once.
7. Read each refusal's hint literally: every one named the cause.
