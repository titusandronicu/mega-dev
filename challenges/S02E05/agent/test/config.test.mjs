import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSenders, loadConfig } from '../src/config.mjs';

const base = { AGENTMAIL_API_KEY: 'k', ANTHROPIC_API_KEY: 'k', AGENTMAIL_INBOX: 'a@agentmail.to' };
test('senders parse from a comma list, lower-cased and de-duplicated', () => {
  assert.deepEqual(parseSenders(' Rook@Mail.Mega.dev, owner-a@example.com ,owner-a@example.com'), ['rook@mail.mega.dev', 'owner-a@example.com']);
});
test('bad entries are refused instead of silently trusted', () => {
  for (const bad of ['', ' , ', 'not-an-address', 'a@b', 'Name <a@b.co>', 'a@b.co; c@d.co']) assert.throws(() => parseSenders(bad), /TRUSTED_SENDERS/, bad);
});
test('config: default is Rook only; TRUSTED_SENDERS wins over the old TRUSTED_SENDER', () => {
  assert.deepEqual(loadConfig(base).trustedSenders, ['rook@mail.mega.dev']);
  assert.deepEqual(loadConfig({ ...base, TRUSTED_SENDER: 'old@x.co' }).trustedSenders, ['old@x.co']);
  assert.deepEqual(loadConfig({ ...base, TRUSTED_SENDER: 'old@x.co', TRUSTED_SENDERS: 'a@x.co,b@x.co' }).trustedSenders, ['a@x.co', 'b@x.co']);
});
