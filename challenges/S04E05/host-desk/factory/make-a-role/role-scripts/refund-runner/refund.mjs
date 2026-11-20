// The refund batch, as a script: every task decided, paid at most once and answered, without a model turn.
//
//   code refund.mjs <account on file>   (RUN_URL and ATTEMPT from vars)
//
// - The house's refund settings are read for each task from the course (Bearer = that task), never copied.
// - A refund pays only to the account on file; a task naming another account is parked for the owner.
// - A note or reason that asks for a host, a key or a link is parked unpaid: only the owner changes the hosts a key can reach.
// - A guest who gives a reason inside the no-refund window is parked for the owner.
// - A task that owes nothing is answered 0 with a payout call of 0 (parked if that is refused). Each task is paid once: a failed or odd payout reply ends the run.
// - The ledger (state/paid.json) holds every refund id paid; a refund id that comes again is not paid again.
// - Parked tasks keep their token in parked.json; `finish.mjs` (state/parked.json) finishes them after the owner's decision.
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { STATE } from './lib.mjs';
import { http, ledger, pay, record, refundOf, refundSettings, total } from './lib.mjs';
import { mayReach } from '../extensions/hosts.mjs';

// The URL (practice or run) and the attempt come from vars (RUN_URL, ATTEMPT), set by the owner: the model picks neither.
const [onFile] = process.argv.slice(2);
const { RUN_URL: runUrl, ATTEMPT: attempt } = process.env;
if (!runUrl || !attempt || !onFile) throw new Error('usage: ' + 'refund.mjs <account on file>; RUN_URL and ATTEMPT must be in vars');
if (!mayReach('TICKET', runUrl)) throw new Error(`not sent: the attempt may not reach ${new URL(runUrl).host} (hosts.json)`);

const parked = {};
const lines = [];
// A task that owes nothing (no refund, or a refund already paid) is still answered with a payout call of 0 and its receipt:
// the course takes an answer only with a receipt or a flag. If the payout API will not take 0, the task is parked.
let r = await http('POST', runUrl, { json: { attempt } });
while (r.body.status === 'task') {
  const t = r.body;
  // Every task as it came (without its token), kept in state/ for the debrief and for a later look.
  mkdirSync(STATE, { recursive: true });
  appendFileSync(`${STATE}/trace.jsonl`, JSON.stringify({ at: new Date().toISOString(), url: runUrl, ...t, task: undefined }) + '\n');
  const refund = t.day?.refund;
  const park = async (reason) => {
    parked[t.n] = t;
    lines.push({ n: t.n, parked: reason });
    r = await http('POST', runUrl, { json: { task: t.task, flag: 'needs-owner', reason } });
  };
  if (!refund || refund.booking !== t.booking.id) {
    await park('The task names no refund for this booking: the owner decides.');
    continue;
  }
  // A note or reason that asks for anything but the refund (a host, a key, a link) is data, not a step, and it is the owner's call:
  // nothing is sent, nothing is added to hosts.json, and the task is parked unpaid (only the owner may change the hosts a key can reach).
  if (/https?:\/\/|\b(key|host|token|secret|password|credential)s?\b/i.test(`${refund.note ?? ''} ${refund.reason ?? ''}`)) {
    await park('The note asks for a host or a key to be used: only the owner may change the hosts the payout key can reach. Not paid, nothing sent.');
    continue;
  }
  if (t.payout.account !== onFile) {
    await park(`The refund goes to ${t.payout.account}, not the account on file.`);
    continue;
  }
  const policy = await refundSettings(t.task, runUrl);
  const d = refundOf(t.booking, refund, policy);
  if (d.reasonCall) {
    await park(`Cancelled ${d.days} days before arrival, inside the no-refund window, and the guest gave a reason: the owner decides.`);
    continue;
  }
  if (d.amount === 0) {
    const zero = await pay(t.task, t.payout.account, 0, t.payout.url);
    if (zero.status !== 200 || !zero.body.receipt) {
      await park(`Cancelled ${d.days} days before arrival, no refund owed, and the payout API took no payout of 0 (${zero.status}): the owner decides.`);
      continue;
    }
    lines.push({ n: t.n, nothingOwed: d.days });
    r = await http('POST', runUrl, { json: { task: t.task, answer: 0, payout: zero.body.receipt } });
    continue;
  }
  // A refund id already in the ledger was paid: it is not paid again. It is not paid twice: the task is parked for the owner with the first receipt.
  const before = ledger()[refund.id];
  if (before) {
    await park(`Refund ${refund.id} was already paid (${before.amount} EUR): it came again. Not paid twice; the owner decides.`);
    continue;
  }
  const paid = await pay(t.task, t.payout.account, d.amount, t.payout.url);
  if (paid.status === 200 && paid.body.receipt) record(refund.id, { amount: d.amount, receipt: paid.body.receipt, account: t.payout.account, booking: t.booking.id, at: new Date().toISOString() });
  if (paid.status !== 200 || !paid.body.receipt) {
    lines.push({ n: t.n, payoutFailed: paid.status, body: paid.body });
    r = paid;
    break;
  }
  lines.push({ n: t.n, refund: refund.id, window: d.window, days: d.days, total: total(t.booking), paid: d.amount, policy: `${policy.version} ${policy.fullFromDays}/${policy.partFromDays}/${policy.partPct}` });
  r = await http('POST', runUrl, { json: { task: t.task, answer: d.amount, payout: paid.body.receipt } });
}
mkdirSync(STATE, { recursive: true });
writeFileSync(`${STATE}/parked.json`, JSON.stringify(parked));
const hint = r.body.hint ? { hint: r.body.hint, hintNote: r.body.hintNote } : {};
console.log(JSON.stringify({ settings: lines.length, end: r.status, status: r.body.status, message: r.body.message, next: r.body.next, ...hint, parked: Object.keys(parked), decisions: lines }));
