# Pending: gather the deck cards
Original request: gather the cards from https://hq.mega.dev/deck into `cards/` (one file per card). Not started. Needs the signed-in browser session (read the deck page first, then decide the file format). See `docs/tool-ideas.md` item 10.

## Findings (2026-10-27, from the UGREEN)
- `curl https://hq.mega.dev/deck` redirects to `/login?next=/deck`. The deck needs a signed-in session.
- The sign-in link is bound to the browser that requested it. A link requested on another machine returned 403 on the "Sign in" button (tried twice). Do not try to get around it.
- Requesting a link from a second machine right after the first returned 429 (rate limit).
- No browser tool was available on the UGREEN session (no Claude in Chrome, no built-in browser).
- The `mega-challenge` `artifact` tool returns the files unlocked by a solved challenge. S01E01 gave the `read` skill. The deck is probably the list of these artifacts (inference).
- Cheapest way forward: the human opens `/deck` in their signed-in browser and pastes the text, or the Mac's headless session (`browser-automation --session mega`) reads it.
