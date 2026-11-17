// Prints every house note in ../../why/ so the reviewer can cite the decision and its reason.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'why');
for (const f of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
  console.log(`=== why/${f} ===\n${readFileSync(join(dir, f), 'utf8')}\n`);
}
