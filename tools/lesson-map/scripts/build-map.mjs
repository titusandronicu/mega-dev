// node scripts/build-map.mjs  ->  src/data/map.json
// Reads challenges/<code>/retro.md in this repo (the RETRO-TEMPLATE format; override the folder with RETRO_DIR), data/episodes.json, data/ideas.json and
// data/tags.json. A finding line looks like:
//   - <text> [evidence: ...] [fix: playbook|claude-md|tool|skill|none] [status: proposed|approved|applied|rejected] [idea: a, b]
// Inline [idea: ...] wins over data/tags.json; a missing retro gives an empty topic.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = new URL('../', import.meta.url);
const p = (f) => fileURLToPath(new URL(f, root));
const json = (f) => JSON.parse(readFileSync(p(f), 'utf8'));
const episodes = json('data/episodes.json'), ideas = json('data/ideas.json');
const tags = existsSync(p('data/tags.json')) ? json('data/tags.json') : {};
const tag = (s, k) => new RegExp(`\\[${k}:\\s*([^\\]]*)\\]`).exec(s)?.[1].trim();
const errors = [];
const topics = [], items = [];
for (const ep of episodes) {
  const file = join(process.env.RETRO_DIR ?? p('../../challenges'), ep.id, 'retro.md');
  const topic = { id: ep.id, label: ep.id, title: ep.title, retro: existsSync(file), count: 0 };
  topics.push(topic);
  if (!topic.retro) continue;
  const md = readFileSync(file, 'utf8');
  const sec = /## Findings\n([\s\S]*?)(?=\n## |$)/.exec(md)?.[1] ?? '';
  const feedback = [...(/## Feedback\n([\s\S]*?)(?=\n## |$)/.exec(md)?.[1] ?? '').matchAll(/^>\s*(.+)$/gm)].map((m) => m[1]);
  topic.feedback = feedback;
  sec.split('\n').filter((l) => l.startsWith('- ')).forEach((line, i) => {
    const key = `${ep.id}#${i + 1}`;
    const text = line.slice(2).replace(/\s*\[(evidence|fix|status|idea):[^\]]*\]/g, '').trim();
    const t = tags[key] ?? {};
    const inline = tag(line, 'idea')?.split(',').map((s) => s.trim()).filter(Boolean);
    const its = inline?.length ? inline : t.ideas ?? [];
    for (const id of its) if (!ideas.some((x) => x.id === id)) errors.push(`${key}: unknown idea "${id}"`);
    if (!its.length) errors.push(`${key}: no idea tag`);
    items.push({
      id: key, topic: ep.id, n: i + 1,
      label: t.label ?? (text.split(/[.;]/)[0].slice(0, 44)),
      text, evidence: tag(line, 'evidence') ?? '', fix: tag(line, 'fix') ?? 'none',
      status: tag(line, 'status') ?? 'proposed', ideas: its,
    });
    topic.count++;
  });
}
for (const idea of ideas) idea.count = items.filter((i) => i.ideas.includes(idea.id)).length;
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
mkdirSync(p('src/data'), { recursive: true });
writeFileSync(p('src/data/map.json'), JSON.stringify({ topics, items, ideas }, null, 1));
console.log(`map: ${topics.length} topics, ${items.length} findings, ${ideas.length} ideas`);
