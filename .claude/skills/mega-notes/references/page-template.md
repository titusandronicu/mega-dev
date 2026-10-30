# Episode page template

Voice: the owner's first person ("my log", "I approved"). Never "your". Plain words, short sentences.
Notion markdown: escape a literal `<tag>` in text as `\<tag>`; use `<b>`, `<i>` and `<code>`; use pipe tables.
Icon: one emoji per episode, the same one in the callout and as the page icon.

Properties (database "MEGA lessons"):

| Property | Value | Rule |
|---|---|---|
| Episode | `S01E0n` | title |
| Lesson | the lesson title from the examples repo `lessons.json` | |
| Challenge | the course's title from `list-challenges` | never your own name for it |
| Result | `Solved`, `In progress` or `Not started` | from `list-challenges`, never from your own logs |
| Tries refused | a number | only if the debrief or log says it; otherwise leave empty |
| Date | `date:Date:start` = the solve date, `date:Date:is_datetime` = 0 | |
| Course page | the challenge URL | only if a record names it; otherwise leave empty |
| Notes status | `Draft` | the owner flips it to `Done` |

Page body, in this order:

```
<callout icon="E" color="gray_bg">
Season 1, episode N. Lesson: <title>. Challenge: "<course title>". Notes drafted on <date> from <the sources used>. <One sentence if a source is missing, e.g. there is no course debrief in my records.>
</callout>

## Lesson: what it teaches
One paragraph: what the lesson is about, and that example numbers come from the examples' own runs on small models, so they are direction, not size.
8 to 10 bullets: **bold claim.** One or two sentences with the example's numbers. ([example-name](https://github.com/MEGA-DOT-DEV/examples/tree/main/examples/example-name))
An example whose README publishes no numbers is marked "design only, no numbers published".

## Story
What happened in the course story, in my own words. At most four short quotes. If my records do not hold the story text, say so and describe only what the records show. Never invent story.

## Challenge: <course title>
Result line (from list-challenges, with the date it was checked). The task in the course's words if known. Say whether this is the course debrief or compiled from my log.
| # | Snag | Fix | Who |
| --- | --- | --- | --- |

## What changed in my harness
Bullets: what was applied (playbook, tools, hooks), and what is only proposed.

## Links
Challenge page, examples repo. Nothing with a token.

## Open
What is still missing: the debrief, the feedback, anything unknown.
```

`scripts/check-notes.mjs` requires the headings `## Lesson`, `## Story`, `## Challenge:`, `## What changed in my harness` and `## Open`.
