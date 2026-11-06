// Entry point: poll the inbox, hand each new mail to the processor, never crash on one bad mail.
import { loadConfig } from './config.mjs';
import { createMailClient } from './agentmail.mjs';
import { createModel } from './llm.mjs';
import { createJournal } from './journal.mjs';
import { openStore } from './store.mjs';
import { createProcessor } from './processor.mjs';
import { safeFetch } from './net.mjs';
import { createAway } from './away.mjs';

const cfg = loadConfig();
const secrets = [cfg.agentmailKey, cfg.anthropicKey];
const journal = createJournal(`${cfg.dataDir}/journal.jsonl`, secrets);
const store = openStore(`${cfg.dataDir}/agent.db`);
const mail = createMailClient({ apiKey: cfg.agentmailKey, inboxId: cfg.inboxId });
const callModel = createModel({ apiKey: cfg.anthropicKey, model: cfg.model });
const away = createAway({ mail, journal, dataDir: cfg.dataDir, trustedSenders: cfg.trustedSenders });
const processor = createProcessor({ away,
  mail, store, journal, callModel, fetchPage: (u) => safeFetch(u),
  trustedSender: cfg.trustedSenders, secrets, selfAddress: cfg.inboxId, budgets: cfg.budgets,
});

let stopping = false;
for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => { stopping = true; journal.append('stopping', { sig }); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

journal.append('started', { inbox: cfg.inboxId, model: cfg.model, trusted: cfg.trustedSenders, budgets: cfg.budgets });
await processor.recover().catch((e) => journal.append('recover_error', { error: String(e.message ?? e) }));

let failures = 0;
while (!stopping) {
  try {
    await away.sweepFiles();
    const recent = await mail.listRecent(50);
    for (const m of recent.reverse()) {            // oldest first
      if (stopping) break;
      await processor.handle(m);
    }
    failures = 0;
  } catch (e) {
    failures++;
    journal.append('poll_error', { error: String(e.message ?? e), failures });
  }
  await sleep(Math.min(cfg.pollSeconds * 1000 * 2 ** Math.min(failures, 5), 300_000));
}
store.close();
