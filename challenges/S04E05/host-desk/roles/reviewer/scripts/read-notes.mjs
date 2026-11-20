// Prints the house notes (host-desk/why/*.md) and the factory rules (host-desk/factory/CHECKLIST.md), so the role reads
// them at every start instead of keeping copies.
//
//   code read-notes.mjs
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const desk = resolve(import.meta.dirname, '..', '..', '..');
const why = join(desk, 'why');
for (const name of existsSync(why) ? readdirSync(why).filter((n) => n.endsWith('.md')).sort() : []) {
  console.log(`--- why/${name}\n${readFileSync(join(why, name), 'utf8').trim()}\n`);
}
const checklist = join(desk, 'factory', 'CHECKLIST.md');
if (existsSync(checklist)) console.log(`--- factory/CHECKLIST.md\n${readFileSync(checklist, 'utf8').trim()}`);
