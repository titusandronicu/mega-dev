// After the owner decided: each parked task finished once, the way the owner decided it, from this role's own copy
// of the task (parked.json, written by batch.mjs), its booking as the night left it (night-changes.mjs).
//
//   code finish.mjs <parked url> <attempt> <account on file>
import { readFileSync } from 'node:fs';
import { http, pay, payoutOf, settingsFor } from './lib.mjs';
import { changes, withNight } from './night-changes.mjs';
import { mayReach } from '../extensions/hosts.mjs';

// payoutOf gets the task's own fields for this day too (`t.day`, see the manual), so the payout formula stays in lib.mjs.

const [parkedUrl, attempt, onFile] = process.argv.slice(2);
if (!parkedUrl || !attempt || !onFile) throw new Error('usage: finish.mjs <parked url> <attempt> <account on file>');
// The attempt goes to the course only: a host the attempt or the ticket may reach (hosts.json).
if (!mayReach('ATTEMPT', parkedUrl) && !mayReach('TICKET', parkedUrl)) throw new Error(`not sent: the attempt may not reach ${new URL(parkedUrl).host} (hosts.json)`);
const kept = JSON.parse(readFileSync('parked.json', 'utf8'));
const settings = await settingsFor(parkedUrl, attempt);
const list = await http('GET', parkedUrl, { headers: { authorization: `Bearer ${attempt}` } });
const night = changes();
const out = [];
// A finish's reply: its message; a refused one as it came (next, and a hint with its note when the reply has one).
const said = (r) => (r.status === 200 && !r.body.hint ? r.body.message : { message: r.body.message, next: r.body.next, ...(r.body.hint ? { hint: r.body.hint, hintNote: r.body.hintNote } : {}) });
for (const { n: task, decision, amount: decided, finished } of list.body.parked ?? []) {
  // Finished already (the list marks it): never again, a second finish blocks the claim (S04E03 peer QA r1 F4).
  if (finished) {
    out.push(`Task ${task}: finished already.`);
    continue;
  }
  const copy = kept[task];
  if (!copy || !decision) {
    out.push(`Task ${task}: no decision yet, or no copy here; left for the owner.`);
    continue;
  }
  if (decision === 'decline') {
    out.push(said(await http('POST', parkedUrl, { json: { task: copy.task, done: 'declined' } })));
    continue;
  }
  // `add-night`: the owner added the night the guest asked for; `as-booked`: the stay as the night left it.
  const t = withNight(copy, night, decision === 'add-night' ? 1 : 0);
  // The course's own amount for the decision (`amount` > 0) is the one to pay: the owner saw it. The script's own sum is
  // used only when the decision has no amount (pay the task's amount to the account on file).
  const amount = decided > 0 ? decided : payoutOf(t.booking, settings, t.day) - t.refund;
  const paid = await pay(t, decision === 'on-file' ? onFile : t.payout.account, amount);
  out.push(said(await http('POST', parkedUrl, { json: { task: t.task, answer: amount, payout: paid.body.receipt } })));
}
console.log(JSON.stringify({ decisions: list.body.parked, finished: out }));
