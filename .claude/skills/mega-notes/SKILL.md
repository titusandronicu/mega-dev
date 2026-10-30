---
name: mega-notes
description: Use when the owner wants Notion notes for a MEGA.dev episode or challenge (a lesson summary, the story, how the challenge went, what changed in the harness), or wants an existing episode page updated after a debrief or retro.
---

# mega-notes

Drafts one Notion page per episode in the owner's "MEGA lessons" database, from local records, and publishes it only after a check and a yes. Started on 2026-10-30; S01E01 to S01E05 were done by hand with these rules.

The scripts sit in `scripts/` next to this file. Run them from the repo root. They need Node.js 18 or newer.

## Rules

1. **Local sources only.** Read `challenges/<code>/` (debrief, retro, log, handoff), `docs/`, and the examples repo (github.com/MEGA-DOT-DEV/examples; clone it read-only into a new empty folder outside this repo, and read `lessons.json` and each example's README). Do not call a course tool for lesson text. Do not read `~/.config/mega-hq`.
2. **The result comes from the course, not from your logs.** Call `list-challenges` once (read-only, say that you did) and copy `solved`, the course's title and the code. S01E04 and S01E05 were once marked "In progress" because a log ended early. If the tool is not available, ask the owner and leave Result empty.
3. **Never invent.** If the records do not hold the story text, a debrief, a try count or a URL, say so on the page and leave the property empty. Take quotes only from the owner's records, at most four, each short.
4. **Own words, not a copy.** Summarise lesson and story text. Example numbers come from the example READMEs; say they come from the examples' own runs on small models.
5. **Owner's first person.** "My log", "I approved". Never "your".
6. **Private data stays out.** No tokens, sign-in links, keys, home paths, IP addresses, tailnet hosts or emails. The check below enforces it.
7. **Show before you publish.** Show the owner the full draft and the check result. Create or update a Notion page only after a yes for that page.
8. **Stay private.** Create inside the "MEGA lessons" database only. Do not share, move or publish pages.

## Steps

1. Load the Notion tools: ToolSearch `select:mcp__claude_ai_Notion__notion-search,mcp__claude_ai_Notion__notion-fetch,mcp__claude_ai_Notion__notion-create-pages,mcp__claude_ai_Notion__notion-update-page`. Read `notion://docs/notion-flavored-markdown-spec` with fetch once.
2. Find the database: `notion-search` for "MEGA lessons". Fetch it to get the `collection://` URL and the exact property names. If an Episode row exists, fetch that page and plan an update, not a second page.
3. Gather the sources for the episode code (rule 1) and the course status (rule 2).
4. Write the draft in `references/page-template.md` format to a scratch file outside the repo. Do not commit drafts.
5. Check it: `cat <draft> | node .claude/skills/mega-notes/scripts/check-notes.mjs`. Fix every `FAIL`, and read each `warn`. Do not send a draft that fails.
6. Show the owner the draft and the result line. Wait for a yes.
7. New episode: `notion-create-pages` with `parent: {"type": "data_source_id", ...}`, the properties from the template and `Notes status` = `Draft`. Existing page: `notion-update-page` with `update_content` (smallest exact `old_str`) and `update_properties`.
8. Report the page URL and anything left empty. Add a line to `docs/CHANGELOG.md` only if the repo changed.

**Done:** the check printed `result: ok`, the owner said yes, and the report names the page and every empty property.

## Check

`node .claude/skills/mega-notes/scripts/check-notes.mjs --self-test` must print `self-test ok` after any edit to the script. The `redact.mjs` it calls is in the `read` skill.
