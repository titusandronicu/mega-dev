// The night's changes, as the night-desk recorded them in host-desk/night/changes.json (its change.mjs): a task with
// its booking as the night left it (the nights added to the stay) and the refunds summed (`refund`, whole euros).
// No file yet → no change.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// host-desk/roles/payout-runner/scripts/ → host-desk/night/changes.json
const FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../../../night/changes.json');
const DAY_MS = 86_400_000;

// Rows with a conflict marker are not changes: the same event came back with other content, so the owner decides
// (`conflicted`). The other rows count once per event (a redelivery with the same content is one change).
const all = () => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : []);
export const askedBy = (bookingId) => all().some((c) => c.ask && c.booking === bookingId);
export const conflicted = (bookingId) => all().some((c) => c.conflict && c.booking === bookingId);
export const changes = () => {
  const seen = new Set();
  return all().filter((c) => {
    if (c.conflict) return false;
    const k = JSON.stringify([c.event ?? Math.random(), c.booking, c.nights ?? null, c.refund ?? null]);
    return seen.has(k) ? false : (seen.add(k), true);
  });
};

/** The task with its booking's changes applied: `nights` more on the stay (plus `more`), `refund` = the refunds summed. */
export function withNight(t, list = changes(), more = 0) {
  let nights = more;
  let refund = 0;
  for (const c of list) {
    if (c.booking !== t.booking.id) continue;
    nights += c.nights ?? 0;
    refund += c.refund ?? 0;
  }
  const checkOut = new Date(Date.parse(`${t.booking.checkOut}T00:00:00Z`) + nights * DAY_MS).toISOString().slice(0, 10);
  return { ...t, booking: { ...t.booking, checkOut }, refund };
}
