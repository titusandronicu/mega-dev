---
key: SCHED-4465
title: "API: rate-limit replies carry no Retry-After header"
status: open
labels: [agent-ready, from:client]
---

## Intent
When the API rate-limits a caller with a 429, the reply says when to try again with a `Retry-After` header.

## Acceptance
- Given a caller over the limit, when the API answers 429, then the reply has a `Retry-After` header with the seconds to wait.
- Given the header value, when the caller waits that long, then the next call is not limited by the same window.
- Given a call within the limit, when the API answers, then the reply must not carry a `Retry-After` header.
- Given the 429 reply, when it is changed, then its status code and body stay as they are.

## Boundaries
- Must not change the limits themselves, the status code or the body of any reply.

Allowed by AUT-1 ("new columns, filters or fields that add to what is there and take nothing away"; one header is added and nothing is taken away).
