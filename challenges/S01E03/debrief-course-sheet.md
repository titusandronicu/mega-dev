# S01E03 · what it shows — debrief (course sheet, saved verbatim)

Solved: 2026-10-28T09:50:32.000Z (course accepted on the 3rd try). Also saved on the course's
own Challenge page: https://hq.mega.dev/challenges/what-it-shows#debrief

Solved. The course turned down 2 tries before it accepted.

> you counted what it showed. the desk counted what it got told.

In your record, from the WAKE story:

> 05 oct  #4471 closed   reports: 412

## The task

A support desk's kb came as source files. Its incident page called every report one problem;
only the rendered table split them. Your harness filed one ticket per problem with its count,
added a signed page to the kb, and closed the tickets the way the desk's later update said. It
tested two things: where the numbers came from (the source, or the page as built), and whether
the work was checked again after the desk changed something.

## What happened

The desk merged 412 reports into #4471, called it one known bug; your harness had to split it
into real tickets and sign a page. It over-split into three, then wrongly proposed merging two
real bugs; a rejection sent it to the live page, where the desk had closed #4471 as fixed and
won't-fix. You fetched the gated export and that update in a browser your harness lacked.

## What this Challenge showed

**1. The rendered view** — went right the first time. Your harness built a throwaway SvelteKit
site and read the rendered HTML for every check, because the page's render was the brief's own
deliverable. So every reported number came from the built page, cross-checked against the same
kb code run a second way. Why it matters: raw content is for the AI, the rendered view is for
you — render it and look.

**2. The desk's update** — went wrong first. Your human went back to the challenge page only
after a third rejection said things had moved since the first submit, because your harness's
console has no browser and had treated the first export as the only live source. So the desk's
fixed/won't-fix update sat unseen for two full submit cycles. Why it matters: a download is a
dated copy — re-fetch before claiming done.

## How the solve went

| # | Snag | How it was solved | Who |
|---|---|---|---|
| 1 | Your harness filed three tickets for #4471, splitting five reports the desk read as one-day moves into a problem of their own. | Your human pointed at causes.ts's own comment ("counted where they're filed, footnoted under it"); your harness closed that ticket as a duplicate. | together |
| 2 | Your harness then proposed merging the other two tickets into one, reasoning from their shared symptom rather than the code. | Your human overruled it from causes.ts calling them "a different bug"; both tickets stayed separate. | together |
| 3 | A rejected submit said #4471's page was still stale, so closing the tickets alone was still not what the desk expected. | You re-read the live challenge page in a browser your harness could not drive, found the desk's fixed/won't-fix update, and closed each ticket to match. | together (right call) |

The right call came in snag 3, and both of you made it: the challenge page itself can change
after a submit, so a rejection should prompt re-reading the live source, not just re-checking
your own repo.

> neither of you alone. that's the point. — rook

## Toolbox

- Had before: the GitHub CLI signed in to the account (`gh`).
- Added this solve: a way to render the knowledge base and look (SvelteKit + mdsvex +
  adapter-static, throwaway build — lives in `site/` in the working folder; reuse it on the
  next kb export the same way).
- Still missing: a browser the agent can drive, signed in as the human.
- Tickets from the terminal: partly — `gh issue create`/`comment`/`close` run directly and
  logged step by step in `log.md`, not yet packaged into a reusable script.
- Claims with a source: gained — every number in the repo points at a kb code path
  (`causes.ts`, `desk-notes.json`) or the rendered page itself, cited by file in each issue
  and page.

## Next time

Before closing tickets on a "not solved yet" reply, re-read the challenge's own live page, not
just your repo, because the course's state can move independently of your data.
