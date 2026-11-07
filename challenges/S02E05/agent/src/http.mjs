// JSON over HTTP with bounded retries. Used by the mail client and the model client.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class HttpError extends Error {
  constructor(status, body) {
    super(`HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

/**
 * Retries 429, 5xx (529 included) and network errors, at most `retries` times.
 * Honors Retry-After. Any other 4xx is the caller's bug: thrown at once.
 */
export async function requestJson(url, init, { fetchImpl = fetch, retries = 2, timeoutMs = 30_000, baseDelayMs = 500, sleepFn = sleep } = {}) {
  for (let attempt = 0; ; attempt++) {
    const backoff = baseDelayMs * 2 ** attempt;
    let res, text;
    try {
      res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      text = await res.text();
    } catch (networkError) {
      if (attempt >= retries) throw networkError;
      await sleepFn(backoff);
      continue;
    }
    let body;
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text.slice(0, 500) }; }
    if (res.ok) return body;
    const err = new HttpError(res.status, body);
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= retries) throw err;
    const ra = Number(res.headers?.get?.('retry-after'));
    await sleepFn(Number.isFinite(ra) && ra > 0 ? Math.min(ra, 20) * 1000 : backoff);
  }
}
