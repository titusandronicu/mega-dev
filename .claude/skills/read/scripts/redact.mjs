#!/usr/bin/env node
// redact.mjs: remove sign-in tokens and magic links from a text before you commit or share it.
//
//   node redact.mjs <file>            print the file with tokens replaced
//   node redact.mjs --check <file>... exit 1 and list line numbers if a token is still in a file
//   node redact.mjs --check --stdin   same, for text piped in (used by the pre-commit hook)
//   node redact.mjs --self-test
//
// It replaces:
//   - course tokens that look like v1.<base64>.<base64>
//   - the value of any token= query parameter
//   - the whole address of a /magic-link/activate link
// Reads only files inside the current working folder. Writes nothing (it prints). No network.
// Plain Node.js 18 or newer, no dependencies.

import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

const PATTERNS = [
  [/https?:\/\/[^\s"'<>)\]]*\/magic-link\/activate[^\s"'<>)\]]*/gi, '<redacted-magic-link>'],
  [/(token=)(?![^&\s"'<>)\]\\]*<redacted)[^&\s"'<>)\]\\]+/gi, '$1<redacted>'],
  [/v1\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, 'v1.<redacted-token>'],
];

const redact = (text) => PATTERNS.reduce((t, [re, to]) => t.replace(re, to), text);
const leaks = (text) => text.split('\n').flatMap((line, i) => (redact(line) !== line ? [i + 1] : []));

function readInside(path) {
  const cwd = realpathSync(process.cwd());
  let real;
  try {
    real = realpathSync(resolve(cwd, path));
  } catch {
    throw new Error(`cannot read ${path}: no such file`);
  }
  const rel = relative(cwd, real);
  if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
    throw new Error(`${path} is outside the working folder. Ask your human before reading it.`);
  }
  return readFileSync(real, 'utf8');
}

function selfTest() {
  const t = 'ok v1.eyJzdWIiOiI4MzEi.wRJnBxfiQ46CMUMcM-n2 and https://hq.mega.dev/x?token=abc123&y=1 done';
  const r = redact(t);
  assert.ok(!r.includes('eyJzdWIi') && !r.includes('abc123'));
  assert.ok(r.includes('y=1') && r.startsWith('ok '));
  assert.equal(redact('https://hq.mega.dev/magic-link/activate?token=zzz'), '<redacted-magic-link>');
  assert.equal(redact('nothing here v1 or 1.2.3'), 'nothing here v1 or 1.2.3');
  assert.deepEqual(leaks('a\nb v1.aaaaaaaaaaaa.bbbbbbbbbbbb\nc'), [2]);
  assert.deepEqual(leaks('already clean ?token=v1.<redacted-token> and token=<redacted>'), []);
  console.log('self-test ok');
  return 0;
}

function main(argv) {
  if (argv.includes('--self-test')) return selfTest();
  const check = argv.includes('--check');
  if (check && argv.includes('--stdin')) {
    const lines = leaks(readFileSync(0, 'utf8'));
    if (lines.length) console.log(`token or magic link on line ${lines.join(', ')}`);
    return lines.length ? 1 : 0;
  }
  const files = argv.filter((a) => !a.startsWith('--'));
  if (files.length === 0 || (!check && files.length !== 1)) {
    throw new Error('usage: node redact.mjs <file> | --check <file>... | --self-test');
  }
  if (!check) {
    process.stdout.write(redact(readInside(files[0])));
    return 0;
  }
  let bad = 0;
  for (const f of files) {
    const lines = leaks(readInside(f));
    if (lines.length) {
      bad += 1;
      console.log(`${f}: token or magic link on line ${lines.join(', ')}`);
    }
  }
  if (!bad) console.log('check ok: no tokens found');
  return bad ? 1 : 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(`redact: ${error.message}`);
  process.exitCode = 1;
}
