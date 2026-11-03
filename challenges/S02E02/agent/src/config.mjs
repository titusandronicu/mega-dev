// Settings come from the environment only. Secrets never appear in code, logs or the model context.
/** "a@x.com, B@y.com" -> ["a@x.com", "b@y.com"]. Rejects anything that is not a plain address. */
export function parseSenders(text) {
  const list = String(text).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!list.length) throw new Error('TRUSTED_SENDERS is empty');
  for (const a of list) if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(a)) throw new Error(`TRUSTED_SENDERS has an invalid address: ${a}`);
  return [...new Set(list)];
}

export function loadConfig(env = process.env) {
  const need = (k) => { const v = env[k]; if (!v) throw new Error(`missing ${k}`); return v; };
  const int = (k, d) => { const n = Number(env[k] ?? d); if (!Number.isInteger(n) || n <= 0) throw new Error(`${k} must be a positive integer`); return n; };
  return {
    agentmailKey: need('AGENTMAIL_API_KEY'),
    anthropicKey: need('ANTHROPIC_API_KEY'),
    inboxId: need('AGENTMAIL_INBOX'),                        // the @agentmail.to address
    trustedSenders: parseSenders(env.TRUSTED_SENDERS ?? env.TRUSTED_SENDER ?? 'rook@mail.mega.dev'),
    model: env.MODEL ?? 'claude-haiku-5-5',
    pollSeconds: int('POLL_SECONDS', 10),
    dataDir: env.DATA_DIR ?? './data',
    budgets: { maxSteps: int('MAX_STEPS', 6), maxFetches: int('MAX_FETCHES', 4), deadlineMs: int('DEADLINE_MS', 90000) },
  };
}
