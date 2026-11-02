# lesson-map

One map for every lesson: lessons -> findings -> the ideas that keep coming back.
Same stack and tokens as `mega-hq-web` (Astro 7, Tailwind 4, Geist), so it can move into `mega-hq/web` later.

## Add a lesson
1. Write `challenges/<code>/retro.md` from `challenges/RETRO-TEMPLATE.md` (`## Findings`, one line per finding) and run `tools/retro-check` on it.
2. Optional: end a finding line with `[idea: contract-first, look-again]`. Without it the parser reads `tools/lesson-map/data/tags.json` (`"<code>#<n>": { "label": "...", "ideas": [...] }`).
3. Add the lesson to `data/episodes.json`. Add a new recurring idea to `data/ideas.json`.
4. Run `npm run dev` (or `npm run build`). `scripts/build-map.mjs` fails on an unknown idea or a finding with no idea.

## Run
    npm install
    npm run dev                      # http://localhost:4321
    npm run build && npm run preview # http://127.0.0.1:4322
