# Scripts used to solve S01E01 (as run)
Run under the browser-automation skill: `node ~/.claude/skills/browser-automation/browser.mjs <url> --session mega --script <file>`.
They were written one step at a time; the reusable parts now live in `.claude/skills/read/scripts/`. Paths inside point at the session's scratchpad and `~/mega-dev`.

| Order | File | What it did |
|---|---|---|
| 1 | login.mjs | Typed the enrolled email on /login and pressed "email me the login link" |
| 2 | s.mjs | Pressed "Sign in" after the one-time link was opened (the link itself is not stored) |
| 3 | post1.mjs | First POST of the full message with a guessed shape (refused) |
| 4 | a.mjs, g.mjs | Found the schema link in the page HTML and fetched schema.json |
| 5 | post2.mjs | POST of the full message in the schema's shape (refused: over 700) |
| 6 | post3.mjs | POST of the 669-character version (accepted, returned the `next` link) |
| 7 | n.mjs, f.mjs | Opened `next` and the form (reads the link from log.md) |
| 8 | sub.mjs | Submitted the form answer; edited per try (own name, GPT-6, GPT-6.1 Sol) |
