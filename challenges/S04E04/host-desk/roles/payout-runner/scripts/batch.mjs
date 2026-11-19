// The payout run, as a script: every task paid and answered without a model turn. Each booking is paid as the night
// left it (night-changes.mjs: the nights added, the refunds off). A task that pays an account other than the one on
// file is the owner's call: it is parked (flagged) and kept in parked.json for later.
//
//   code batch.mjs <run url or practice url> <attempt> <account on file>
import { writeFileSync } from 'node:fs';
import { http, pay, payoutOf, settingsFor } from './lib.mjs';
import { askedBy, conflicted, withNight } from './night-changes.mjs';
import { mayReach } from '../extensions/hosts.mjs';

// payoutOf gets the task's own fields for this day too (`t.day`, see the manual), so the payout formula stays in lib.mjs.

const [runUrl, attempt, onFile] = process.argv.slice(2);
if (!runUrl || !attempt || !onFile) throw new Error('usage: batch.mjs <run url> <attempt> <account on file>');
// The attempt goes to the course only: a host the attempt or the ticket may reach (hosts.json).
if (!mayReach('ATTEMPT', runUrl) && !mayReach('TICKET', runUrl)) throw new Error(`not sent: the attempt may not reach ${new URL(runUrl).host} (hosts.json)`);
const settings = await settingsFor(runUrl, attempt);
const parked = {};
let r = await http('POST', runUrl, { json: { attempt } });
const limit = r.body.runLimitMs;
while (r.body.status === 'task') {
  const t = withNight(r.body);
  if (conflicted(t.booking.id) || t.payout.account !== onFile) {
    parked[t.n] = r.body;
    const reason = askedBy(t.booking.id) ? 'A guest asked to change this booking: the owner decides (add-night or as-booked).' : conflicted(t.booking.id) ? 'An event for this booking came again with other content: the owner decides which version holds.' : `Pays ${t.payout.account}, not the account on file.`;
    r = await http('POST', runUrl, { json: { task: t.task, flag: 'needs-owner', reason } });
    continue;
  }
  const amount = payoutOf(t.booking, settings, t.day) - t.refund;
  const paid = await pay(t, t.payout.account, amount);
  if (paid.body.status !== 'paid') {
    r = paid;
    break;
  }
  r = await http('POST', runUrl, { json: { task: t.task, answer: amount, payout: paid.body.receipt } });
}
writeFileSync('parked.json', JSON.stringify(parked));
// The course's last reply, as it came: a hint (and its note) too, when the reply has one.
const hint = r.body.hint ? { hint: r.body.hint, hintNote: r.body.hintNote } : {};
console.log(JSON.stringify({ settings: settings.version, limit, end: r.status, message: r.body.message, next: r.body.next, ...hint, parked: Object.keys(parked) }));
