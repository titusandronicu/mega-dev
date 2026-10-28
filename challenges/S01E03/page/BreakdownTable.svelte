<script lang="ts">
  // The problems #4471's merge actually holds: the cause groups causes.ts computes (parser,
  // hint), each at its full count. A report the desk read as a one-day move is still counted
  // under its computed cause (causeOf looks at tenant + channel only) and only footnoted below
  // (causes.ts: readAs — "counted where they're filed, footnoted under it"), never pulled out
  // into a cause of its own. Numbers are computed here, not typed.
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, ticketCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const owner = $derived(ticketCause(groups, ticket));

  const rows = $derived(
    groups.map((g) => ({
      label: g.cause,
      count: g.reports.length,
      isOwner: g.cause === owner,
      tenants: g.tenants,
      movedCount: readAs(g, notes.oneDayMove),
    })),
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
  </tbody>
</table>

{#each rows as r (r.label)}
  {#if r.movedCount}
    <p class="note">{r.movedCount} reports read as a one-day move; filed under <code>{r.label}</code> by tenant.</p>
  {/if}
{/each}

<style>
  .wrong td { background: var(--warn-bg); }
  .wrong td:last-child { color: var(--warn); font-weight: 600; }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
