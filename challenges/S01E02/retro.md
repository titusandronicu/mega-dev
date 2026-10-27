# S01E02 retro
Inputs: `challenges/S01E02/debrief.md`, `challenges/S01E02/log.md`.

## Feedback
> (course feedback not pasted yet; add it verbatim, then re-run the findings)

## Findings
- Check for a local speech-to-text route at the start of any recording challenge; the first session had none and had to ask for a key. [evidence: debrief.md snag 1] [fix: playbook] [status: applied]
- Never hand untrusted input to a worker that runs with --yolo; a prompt is not a guardrail. [evidence: debrief.md snag 3, lessons-learned 17] [fix: claude-md] [status: applied]
- Do not trust model timestamps for speech; confirm with ffmpeg silencedetect and vote words across runs. [evidence: debrief.md snags 4-5, lessons-learned 16] [fix: tool] [status: applied]
- Answer only the asked event; recordings carry decoy times. [evidence: debrief.md snag 6] [fix: playbook] [status: applied]

## Applied
Owner approved all four on 2026-10-27.
1. Local transcriber first: `docs/playbook.md`, "Recording challenges" step 1.
2. No untrusted input to `--yolo` workers: `CLAUDE.md`, Tools section.
3. Offsets by silencedetect: new `tools/speech-offsets`, listed in `docs/tools.md` and `CLAUDE.md`; playbook step 2.
4. Decoy times: `docs/playbook.md`, "Recording challenges" step 3.
