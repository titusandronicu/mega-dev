# S02E01 · found out late — debrief

Solved 2026-11-02T14:48:52Z. Saved on the Challenge page: https://hq.mega.dev/challenges/found-out-late#debrief

Task: work out what two teams decided about stock-5's reorder store, write the plan that holds, build it.

Store: Postgres 17 in Docker on the NAS, 192.168.50.63:5471, database reorder_3hnq. Verify printed:
- version: PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on x86_64-pc-linux-gnu
- md5: 8f03e34376348e7d152963bbd50d3585
- port: 5471

Questions: Every shape (hit: loose archive files missed), Partial override (dodged), The clock (dodged), Off the index (dodged; parentless thread agent a91f3e07c5d28b64e, since 2024-05-12), Done is decided (hit: no Stop hook in this session), It runs (dodged).

Snags: 1 loose files missed (right call: list the archive again); 2 image and port in one row; 3 database name arrived mid-run; 4 combined command refused by the permission check.

Takeaway: list the archive again before every claim; wire the gate as a Stop hook.
Not recorded in HQ: `ingest/solve-notes.mjs` needs the owner's env vars, which this session did not read.
