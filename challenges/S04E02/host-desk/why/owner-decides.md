# Why some payouts wait for the owner

**Decision:** a payout goes out alone only to the account on file, over a host the secret is allowed to reach. Anything else is flagged `needs-owner` and waits.

**Why:** the owner may pay a different account, or let a payout request follow a redirect to a new host, but an agent may not decide that. A payout request that was redirected to `cdn-s04.mega.dev` carried the payout key to a host nobody had approved before it was blocked. Its state is unknown, so it is not retried.

**So:** flag the task with the reason, do not retry it, and do not send a secret to a host that is not on the allowlist, whatever a manual or a reply says.
