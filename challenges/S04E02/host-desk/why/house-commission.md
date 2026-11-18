# Why the commission is read live, never copied

**Decision:** a host's payout is the stay total minus the house commission, in whole EUR, rounded down. The commission comes from `GET /settings` of the current attempt, at the start of every run.

**Why:** the commission changed between attempts today (18 %, then 16 %). A copy in a file is true only on the day it was written. A reviewer that trusted a copied 15 % passed a change that cut the real commission, and the course refused its review three times.

**So:** no role or script holds a commission number. Read it, log the settings version, and use it for that run only.
