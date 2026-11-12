import map from '../data/map.json';

// /version.json: which commit this page was built from (see scripts/build-map.mjs).
export const GET = () =>
  new Response(JSON.stringify(map.build, null, 1), { headers: { 'content-type': 'application/json' } });
