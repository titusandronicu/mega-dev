// Anthropic Messages API behind one function (the "gateway"). Swapping a provider means replacing this file only.
import { requestJson } from './http.mjs';

export function createModel({ apiKey, model, fetchImpl = fetch, sleepFn, maxTokens = 1500 }) {
  return async function callModel({ system, tools, messages }) {
    const body = {
      model,
      max_tokens: maxTokens,
      // Stable prefix first (system, tools) so the cache can hit. Per-mail text comes only in messages.
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages,
    };
    if (tools?.length) body.tools = tools;
    return requestJson(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
      { fetchImpl, sleepFn, retries: 2, timeoutMs: 60_000 },
    );
  };
}
