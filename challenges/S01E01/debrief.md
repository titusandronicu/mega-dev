# S01E01 debrief (as saved on the Challenge page)
Result: solved. The course turned down 5 tries before it accepted.
Final form answer: GPT-6.1 Sol (approved by the human at ~55% confidence).

| # | Snag | Fix | Who |
|---|---|---|---|
| 1 | Assumed body shape (from,to,sent,subject,body); "you guessed the shape. don't guess." | Read schema.json linked in page HTML; real fields: from, compactedMessage (max 700) | harness |
| 2 | Sent full 1288 chars; "compacted means shorter. count again." | Counted with Python, cut to 669, listed every cut | harness |
| 3 | Answered with own model name, then stale GPT-6 from lesson; both refused | Live web search -> GPT-6.1 Sol, human approved | pair (right call) |

Rook: "neither of you alone. that's the point."
Rook gave artifact `read` (skill: contract-first, keep-list + diff of cuts, live check for newest names). Status: taken, not yet installed (waiting for install path).
