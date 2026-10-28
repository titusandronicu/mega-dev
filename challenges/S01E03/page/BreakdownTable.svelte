<script lang="ts">
  // Splits a ticket's merged reports into the problems they really hold: the mechanical
  // cause groups causes.ts already computes, plus the reports desk-notes.json flags as a
  // different symptom (a one-day/timezone-boundary shift, not a date swap) pulled back out
  // of whichever cause group they mechanically landed in. Numbers are computed here, not typed.
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, ticketCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const owner = $derived(ticketCause(groups, ticket));
  const oneDayCount = $derived(groups.reduce((n, g) => n + readAs(g, notes.oneDayMove), 0));

  const rows = $derived(
    groups.map((g) => {
      const rest = g.reports.filter((r) => !notes.oneDayMove.includes(r.id));
      return {
        label: g.cause,
        count: rest.length,
        isOwner: g.cause === owner,
        tenants: new Set(rest.map((r) => r.tenant)).size,
      };
    }),
  );
</script>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each rows as r (r.label)}
      <tr class:wrong={!r.isOwner}>
        <td><code>{r.label}</code></td>
        <td>{r.count}</td>
        <td>{r.tenants}</td>
        <td>{r.isOwner ? `#${ticket}` : 'not this ticket — no ticket of its own'}</td>
      </tr>
    {/each}
    {#if oneDayCount}
      <tr class="wrong">
        <td><code>day/timezone boundary</code></td>
        <td>{oneDayCount}</td>
        <td>—</td>
        <td>not this ticket — no ticket of its own</td>
      </tr>
    {/if}
  </tbody>
</table>

<style>
  .wrong td { background: var(--warn-bg); }
  .wrong td:last-child { color: var(--warn); font-weight: 600; }
</style>
