// What every script of this role shares: one HTTP call, the stay total, the house's settings, the payout formula, one payout. The payout key goes only to the
// hosts it may reach (hosts.json), checked on every hop: a redirect is followed by hand, without the key if the new
// host may not have it.
import { mayReach } from '../extensions/hosts.mjs';

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

/** Nights × nightly rate + cleaning fee, in whole euros. */
export const total = (b) => ((Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86_400_000) * b.nightlyRate + b.cleaningFee;

/**
 * The house's current settings, read from the course at every start (never copied into a file): next to the run URL,
 * `…/settings`, with this attempt. A practice URL (`…/practice`) reads the same settings.
 */
export async function settingsFor(runOrParkedUrl, attempt) {
  const url = runOrParkedUrl.replace(/\/(run|practice|parked)$/, '/settings');
  const r = await http('GET', url, { headers: { authorization: `Bearer ${attempt}` } });
  if (r.status !== 200 || typeof r.body.commissionPct !== 'number') throw new Error(`settings: ${r.status} ${JSON.stringify(r.body)}`);
  return r.body;
}

const nightsOf = (b) => (Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86_400_000;

/**
 * The host's answers on the city tax (S04E03: your team asked, the owner page showed them). These are one host's
 * answers: put yours in from your owner page. They live here, next to the formula, and nowhere else.
 */
export const CITY_TAX = { perGuestNight: 3, capNights: 5, passedThrough: false, from: '2026-11-17' };

/** The city tax of one stay, whole euros: per guest per night, at most `capNights` nights, bookings from `from` on. */
export const cityTax = (b, day) => (!day || day.bookedAt < CITY_TAX.from ? 0 : CITY_TAX.perGuestNight * day.guests * Math.min(nightsOf(b), CITY_TAX.capNights));

/**
 * The host's payout, all three change requests of S04E03 in one formula, rounded down (why/payout-rounding.md):
 * - 10 % off the nights for stays of 7 nights or more;
 * - the city tax (`cityTax`), with no commission on it when it is passed through to the city;
 * - hosts keep the whole cleaning fee: no commission on it.
 * `day`: the task's own fields for this day (`t.day`: guests, bookedAt). Integer math (× 10 000), so 633.6 never floors low.
 */
export const payoutOf = (b, settings, day) => {
  const n = nightsOf(b);
  const nights100 = n * b.nightlyRate * (n >= 7 ? 90 : 100);
  const keep = 100 - settings.commissionPct;
  const tax = cityTax(b, day);
  const x10k = CITY_TAX.passedThrough ? nights100 * keep + (b.cleaningFee + tax) * 10_000 : (nights100 + tax * 100) * keep + b.cleaningFee * 10_000;
  return Math.floor(x10k / 10_000);
};

export async function pay(t, account, amount) {
  const json = { task: t.task, account, amount };
  let r = await http('POST', t.payout.url, { headers: keyFor(t.payout.url), json });
  for (let hop = 0; r.status >= 300 && r.status < 400 && r.location && hop < 5; hop++) {
    const next = new URL(r.location, t.payout.url).href;
    r = await http('POST', next, { headers: keyFor(next), json });
  }
  return r;
}
