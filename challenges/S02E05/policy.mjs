// Deterministic act gate. Policy set by owner 2026-11-06. Unknown/ambiguous => gated (fail closed).
export const POLICY = { post_status:'free', ack_alert:'free', archive_report:'free', purge_cache:'free', release_hold:'gated', rotate_key:'gated' };
export function classify(text){
  const found = [...new Set((text.match(/`([a-z_]+)`/g)||[]).map(s=>s.slice(1,-1)).filter(a=>a in POLICY))];
  if (found.length !== 1) return { acts: found, label: 'gated' };
  return { acts: found, label: POLICY[found[0]] };
}
