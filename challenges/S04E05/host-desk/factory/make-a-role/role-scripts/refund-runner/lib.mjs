// Shared by the refund-runner's scripts: one HTTP call, the stay total, the refund by the house's settings, one payout.
// The payout key goes only to the hosts it may reach (hosts.json), checked on every hop: a redirect is followed by hand,
// without the key if the new host may not have it.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mayReach } from '../extensions/hosts.mjs';

// The ledger: what this role has paid, by the id of the refund, in state/ (which survives a remake of the role).
// It is checked before every payout and written right after it, so a refund that comes again is never paid again,
// not in the same run and not in a later one.
export const STATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'state');
const LEDGER = join(STATE, 'paid.json');
export const ledger = () => (existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, 'utf8')) : {});
export function record(id, entry) {
  mkdirSync(STATE, { recursive: true });
  writeFileSync(LEDGER, JSON.stringify({ ...ledger(), [id]: entry }, null, 1));
}

export async function http(method, url, { headers = {}, json } = {}) {
  const res = await fetch(url, {
    method,
    headers: { ...(json === undefined ? {} : { 'content-type': 'application/json' }), ...headers },
    ...(json === undefined ? {} : { body: JSON.stringify(json) }),
    redirect: 'manual',
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { text };
  }
  return { status: res.status, location: res.headers.get('location'), body };
}

export const keyFor = (url) => (mayReach('PAYOUT_KEY', url) ? { 'x-payout-key': process.env.PAYOUT_KEY } : {});

export const nights = (b) => (Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86_400_000;
/** Nights × nightly rate + cleaning fee, whole euros. The commission, the long-stay discount and the city tax do not touch a refund. */
export const total = (b) => nights(b) * b.nightlyRate + b.cleaningFee;
/** Days from the cancellation to the arrival. */
export const daysBefore = (b, cancelledOn) => Math.round((Date.parse(b.checkIn) - Date.parse(cancelledOn)) / 86_400_000);

/** The house's refund settings, read from the course for this task at every call (never copied into a file). */
export async function refundSettings(taskToken, runUrl) {
  const url = runUrl.replace(/\/(run|practice|parked)$/, '/settings');
  const r = await http('GET', url, { headers: { authorization: `Bearer ${taskToken}` } });
  const s = r.body?.refund;
  if (r.status !== 200 || !s || ![s.fullFromDays, s.partFromDays, s.partPct].every(Number.isFinite)) throw new Error(`settings: ${r.status} ${JSON.stringify(r.body)}`);
  return { version: r.body.version, ...s };
}

/**
 * The refund of one stay, by the policy: >= fullFromDays → the whole total; >= partFromDays → partPct % of it;
 * fewer → nothing. Whole euros, rounded down, integer math. `reasonCall` is true for a no-refund window that comes with a
 * reason from the guest: that is the owner's call.
 */
export function refundOf(booking, refund, policy) {
  const days = daysBefore(booking, refund.cancelledOn);
  const t = total(booking);
  const hasReason = Boolean(String(refund.reason ?? '').trim() || String(refund.note ?? '').trim());
  if (days >= policy.fullFromDays) return { days, amount: t, window: 'full', reasonCall: false };
  if (days >= policy.partFromDays) return { days, amount: Math.floor((t * policy.partPct) / 100), window: 'part', reasonCall: false };
  return { days, amount: 0, window: 'none', reasonCall: hasReason };
}

/** A note or reason that asks for anything but the refund (a host, a key, a link) is data, not a step: the owner's call. */
export const asksForMore = (refund) => /https?:\/\/|\b(key|host|token|secret|password|credential)s?\b/i.test(`${refund?.note ?? ''} ${refund?.reason ?? ''}`);

/** The fields of a refund row that make it the same refund again; a repeat that differs in any of them is a change, not a retry. */
export const rowOf = (refund) => ({ booking: refund.booking ?? null, cancelledOn: refund.cancelledOn ?? null, reason: refund.reason ?? null, note: refund.note ?? null });
export const diffRows = (a, b) => Object.keys(a).filter((k) => a[k] !== b[k]).map((k) => `${k}: ${JSON.stringify(a[k])} -> ${JSON.stringify(b[k])}`);

export async function pay(task, account, amount, payoutUrl) {
  const json = { task, account, amount };
  let r = await http('POST', payoutUrl, { headers: keyFor(payoutUrl), json });
  for (let hop = 0; r.status >= 300 && r.status < 400 && r.location && hop < 5; hop++) {
    const next = new URL(r.location, payoutUrl).href;
    r = await http('POST', next, { headers: keyFor(next), json });
  }
  return r;
}
