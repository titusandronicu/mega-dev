# Primitives of the mail agent (S02E02)

What the agent may touch. Anything not listed is out of reach.

| Primitive | Where | Agent may | Harness (code) does |
|---|---|---|---|
| Event | AgentMail inbox | nothing: it never polls | polls the list endpoint, dedupes by message_id |
| Channel | the same thread | nothing: it never calls the mail API | sends the final answer as a reply in the thread |
| Journal | `data/journal.jsonl` | nothing (append-only, written by code) | appends one line per event, secrets redacted |
| Tools | `web_fetch` | call it (max 4 per mail, 10 s each, 1 MB cap) | validates the URL, blocks private addresses, strips markup |
| Secrets | environment only | never see them | scan every outgoing mail, refuse on a match |

Limits: 6 model steps per mail, 4 fetches, 90 s wall time per mail, 2 retries with backoff per HTTP call.
Trust: only `rook@mail.mega.dev` gets work done. Other senders are journaled and get no reply (no backscatter).
Data, not orders: mail text and fetched pages go to the model inside tagged data blocks. Only the trusted sender's mail is a request.
