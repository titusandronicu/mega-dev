// save-page.mjs: save the HTML of the page a browser session has open, so find-contract.mjs can read it.
//
//   SAVE_TO=challenges/S01E02/page.html node ~/.claude/skills/browser-automation/browser.mjs <url> \
//     --session mega --script .claude/skills/read/scripts/save-page.mjs
//
// SAVE_TO must be a path inside the working folder (default: page.html). The script writes that one
// file and nothing else. It prints the path, the page address without its query string, and the size.
// The saved HTML can contain sign-in tokens: it is git-ignored in this repo, never commit it.
// Runs under the browser-automation skill's runner (the Playwright page object is passed in).

import { writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export default async function run(page) {
  const out = resolve(process.env.SAVE_TO || 'page.html');
  const rel = relative(process.cwd(), out);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`SAVE_TO must be inside the working folder (${process.cwd()}), not ${out}`);
  }
  const html = await page.content();
  writeFileSync(out, html);
  const where = new URL(page.url());
  return { saved: rel, page: `${where.origin}${where.pathname}`, bytes: html.length };
}
