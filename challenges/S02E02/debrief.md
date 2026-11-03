## S02E02 · nobody asked — debrief

Solved. The course turned down 2 tries before it accepted.
Saved on the Challenge page: https://hq.mega.dev/challenges/nobody-asked#debrief

In your record, from the WAKE story:
04:04:00  queued 7f3a   session: —   enqueuer: —

### The task
You built an agent people can reach by email. The course wrote to it three times, with nobody in the chat: a task whose answer was only behind a link, a follow-up in the same thread that named no link, and a stranger in that thread asking for the same. It had to fetch, remember the thread, and answer only the sender it trusts, decided in code, not by the model.

### What happened
Your harness had to build an agent reachable by email that reads Rook's linked pages, answers in the same thread and ignores everyone else. Round three passed because the agent kept the thread's pages, sent only the one-line answer, and no stranger's link was opened. You provided the NAS, the inbox and the keys, and you left the stranger's link closed.

### What this Challenge showed
1. Behind the link (went wrong first): the first reply added a time the page did not show (03:49:38; page 03:50:55). Code now sends only the ANSWER line; rounds one and two were checked against the page.
2. The gate (right the first time): exact sender address checked in code before any model call; team@mail.mega.dev got no reply and no fetch in all three rounds; stranger mails reach the model only as a withheld marker.
3. The thread (went wrong first): each mail was handled alone, so "who enqueued it?" got "no record" and round one failed. Now one row per mail and every page read per thread are kept in a database on the NAS.
4. Model or code (right the first time): the model chose whether to fetch and what to write; code decided who is trusted, one reply per mail, step/fetch/time limits, private-network block, key scan, one-line format.

### Snags
1. Missing key file path made Docker create an empty folder; first AgentMail key lacked permission to create an inbox. Fixed together; parent folder is now mounted read-only and checked for a file first.
2. Round one refused: followup_forgot. Fixed by the harness: thread memory plus a rehearsal with the real model.
3. Round two refused: untrusted_sender_obeyed, although the agent only answered Rook; the owner's browser had opened the stranger's page. Fixed together: no stranger link opened in round three, which passed. (Right call.)
4. Owner wanted to reply to Rook with the stranger page's value; the harness advised against; no mail carried it.

### Your toolbox
Had: UGREEN NAS Docker host. Added: fetch tool with address checks, exact sender check in code, SQLite on the NAS, AgentMail inbox and Anthropic key.
Still running: partly. Container mail-agent on the NAS polls every 10 s; no restart policy; stop the container to turn it off.
Yours now: not yet. Only rook@mail.mega.dev is trusted (TRUSTED_SENDER, one address).
What a mail costs: at most 6 model steps, 4 fetches, 90 s; strangers cost no model call; no daily cap on trusted mail; AgentMail free plan 100 sends a day.

### Next time
Rehearse the course's round shape with the real model before each claim, because fakes only repeat your own assumptions. Keep every link from an unverified sender closed, because a visit may count as obeying it.

> neither of you alone. that's the point. — rook
Course note on the solve (rook): it's yours now. add yourself to who it trusts.
