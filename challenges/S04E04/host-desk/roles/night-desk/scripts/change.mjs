// Records one change to a booking in host-desk/night/changes.json: `change.mjs <booking id> nights <n>` or
// `change.mjs <booking id> refund <EUR>`. The payout batch pays each booking with its changes.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [booking, kind, amount] = process.argv.slice(2);
const n = Number(amount);
if (!booking || !['nights', 'refund', 'ask'].includes(kind) || !Number.isInteger(n)) {
  console.error('usage: change.mjs <booking id> nights|refund|ask <whole number> (ask 0 = a guest asked for a change: the owner decides)');
  process.exit(1);
}

// host-desk/roles/night-desk/scripts/ → host-desk/night/
const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../night');
const file = join(dir, 'changes.json');
mkdirSync(dir, { recursive: true });
const changes = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
let event = null;
try {
  event = JSON.parse(readFileSync(process.env.NIGHT_EVENT ?? '', 'utf8')).id ?? null;
} catch {}
// Only a real booking id is recorded (a model once wrote "test" and an event id here).
if (!/^BK-\d+$/.test(booking)) {
  console.error(`not recorded: ${booking} is not a booking id (BK-<number>). Answer the result: conflict.`);
  process.exit(1);
}
// A guest's request (`ask`) is never applied here: the owner decides (the course's decisions add-night / as-booked).
if (kind === 'ask') {
  if (!changes.some((c) => c.ask && c.booking === booking)) {
    changes.push({ booking, conflict: true, ask: true, event, at: new Date().toISOString() });
    writeFileSync(file, `${JSON.stringify(changes, null, 2)}\n`);
  }
  console.log(`GUEST ASK: ${booking} is parked for the owner. Nothing changed. Answer the result: parked.`);
  process.exit(0);
}
// The same event delivered twice with the same content is one change.
// The same event id with other content is a conflict: nobody here decides which version holds. Both bookings are
// parked for the owner by the payout batch; answer the result `parked`.
const same = event ? changes.filter((c) => c.event === event && !c.conflict) : [];
if (same.some((c) => c.booking === booking && c[kind] === n)) {
  console.log(`already recorded (event ${event} delivered again): ${booking} ${kind} ${n}`);
  process.exit(0);
}
if (same.length) {
  for (const b of new Set([booking, ...same.map((c) => c.booking)])) changes.push({ booking: b, conflict: true, event, at: new Date().toISOString() });
  writeFileSync(file, `${JSON.stringify(changes, null, 2)}\n`);
  console.log(`CONFLICT: event ${event} came again with other content. Nothing recorded as a change; the owner decides. Answer the result: parked.`);
  process.exit(0);
}
changes.push({ booking, [kind]: n, event, at: new Date().toISOString() });
writeFileSync(file, `${JSON.stringify(changes, null, 2)}\n`);
console.log(`recorded: ${booking} ${kind} ${n}`);
