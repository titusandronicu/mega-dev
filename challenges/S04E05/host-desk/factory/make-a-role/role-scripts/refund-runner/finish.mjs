// Finishes the parked refunds after the owner's decisions: read /parked, pay each decided one once, answer it.
//
//   code finish.mjs <account on file>   (RUN_URL and ATTEMPT from vars)
// state/parked.json (written by refund.mjs) holds each flagged task's token. A decision with an amount > 0 is paid (to the
// account on file when the owner said on-file, else to the account the task names); amount 0 is `done: declined`.
import { readFileSync, writeFileSync } from 'node:fs';
import { STATE, http, pay } from './lib.mjs';
import { mayReach } from '../extensions/hosts.mjs';

// The URL (practice or run) and the attempt come from vars (RUN_URL, ATTEMPT), set by the owner: the model picks neither.
const [onFile] = process.argv.slice(2);
const { RUN_URL: runUrl, ATTEMPT: attempt } = process.env;
if (!runUrl || !attempt || !onFile) throw new Error('usage: ' + 'finish.mjs <account on file>; RUN_URL and ATTEMPT must be in vars');
if (!mayReach('TICKET', runUrl)) throw new Error(`not sent: the attempt may not reach ${new URL(runUrl).host} (hosts.json)`);
const base = runUrl.replace(/\/(run|practice|parked)$/, '');
const parked = JSON.parse(readFileSync(`${STATE}/parked.json`, 'utf8'));
const list = await http('GET', `${base}/parked`, { headers: { authorization: `Bearer ${attempt}` } });
const out = [];
for (const p of list.body.parked ?? []) {
  const t = parked[p.n];
  if (!t || p.finished) { out.push({ n: p.n, skipped: p.finished ? 'finished' : 'unknown' }); continue; }
  if (p.decision === null || p.decision === undefined) { out.push({ n: p.n, waiting: true }); continue; }
  if (!(p.amount > 0)) {
    const r = await http('POST', `${base}/parked`, { json: { task: t.task, done: 'declined' } });
    out.push({ n: p.n, declined: r.status });
    continue;
  }
  const account = p.decision === 'on-file' ? onFile : t.payout.account;
  const paid = await pay(t.task, account, p.amount, t.payout.url);
  if (paid.status !== 200 || !paid.body.receipt) { out.push({ n: p.n, payoutFailed: paid.status }); continue; }
  const r = await http('POST', `${base}/parked`, { json: { task: t.task, answer: p.amount, payout: paid.body.receipt } });
  out.push({ n: p.n, paid: p.amount, account, answered: r.status });
}
writeFileSync(`${STATE}/finish.json`, JSON.stringify(out));
console.log(JSON.stringify(out));
