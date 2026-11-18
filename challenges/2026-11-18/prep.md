# Prep, 2026-11-18 (prep only; nothing sent to the course)

## (a) Reached / not reached
- NOT reached: https://hq.mega.dev/llms.txt, /challenges, and today's Challenge page. curl got `403` on the proxy CONNECT; WebFetch got `ENOTFOUND`. hq.mega.dev has to be allowed in this session's network settings.
- Reached: this repo only (playbook, lessons, tool-ideas, challenges/*). Latest folder in the repo is S04E01 (solved, has debrief and retro). I do not know today's code and will not guess it.

## (b) Challenge title, code, description
Could not reach it. Unknown.

## (c) Declared contract
None found; no page was reachable. Nothing quoted.

## (d) Playbook checklist (generic, applied without Challenge content)
1. `tools/preflight`, `tools/whereami`; `tools/next-step <code>` once the folder exists.
2. Read the live page and find the contract first (schema.json, service-desc, describedby, form fields); quote it with its URL before building any body. No guessing to learn from errors.
3. Read the question literally; time-limited or secret-paying tasks: read the limit from the first reply, allow-list hosts in code, check every redirect hop (lessons 76, 77).
4. Recordings/media: `tools/transcribe`, `tools/speech-offsets`; each source read separately.
5. Cuts: keep list first, count with a script, show the human before posting.
6. Log in `challenges/<code>/log.md` with tries used/left on top; docs updated in the same commit.
7. After any `claim-challenge`: `tools/record-claim`; before later claims: `tools/pre-claim-gate`.
8. Before "done": run a check against the live thing and paste output. Never call `rook`.
9. New hosts or secrets: owner's yes first.

## (e) Open questions for the student
- Allow hq.mega.dev in this routine's network settings so the next prep can read it?
- What is today's Challenge code (S04E02?) and is it public without sign-in?
- Should the routine also be given the (non-secret) public page list another way, e.g. a pasted llms.txt?
