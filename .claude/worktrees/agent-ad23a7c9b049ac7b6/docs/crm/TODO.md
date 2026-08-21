# TODO — Cron Job Scheduling (Self-Hosted VM / GCE)

**Status: not yet implemented.** Deployment target is a self-managed GCE VM, not
Vercel — `vercel.json`'s `crons` field is a Vercel-only product and does nothing
outside Vercel's own deploy pipeline. The 9 `/api/cron/*` endpoints exist and work
(each is a normal HTTP route protected by `CRON_SECRET`), but nothing currently
triggers them on a schedule.

**Decision (2026-08-07):** build an in-process scheduler that starts automatically
when the app starts, rather than relying on external infra (VM crontab, Google
Cloud Scheduler). Revisit this file when that's built.

## Implementation sketch (for whoever picks this up)

- Likely candidate: [`node-cron`](https://www.npmjs.com/package/node-cron) (or
  equivalent), initialized once from a custom Next.js server entrypoint (or an
  `instrumentation.ts` hook — check what's supported in this Next.js 16 setup)
  so the schedules start the moment `next start` runs, no separate process to
  babysit.
- Two ways to wire each job in-process:
  1. **Call the route handler's logic directly** (import the function, skip the
     HTTP hop entirely) — simpler, no need for `CRON_SECRET` internally.
  2. **Self-HTTP-call** `http://localhost:PORT/api/cron/...` with the
     `Authorization: Bearer $CRON_SECRET` header — keeps the route handlers as
     the single source of truth, no code duplication, easier to test each job
     independently (`curl` it manually).
  Option 2 is probably cleaner given `CRON_SECRET` gating is already built into
  every route.
- Make sure the scheduler only starts once per VM instance (guard against
  double-init if the process is ever run under a process manager that could fork).

## The 9 jobs (path → schedule → why)

| Path | Schedule (cron) | Purpose |
|---|---|---|
| `/api/cron/drain-outbox` | `*/2 * * * *` | Sends queued WhatsApp messages in small batches |
| `/api/cron/release-expired-holds` | `*/15 * * * *` | Releases unit holds past their 24h expiry |
| `/api/cron/poll-portals` | `*/15 * * * *` | Polls property portals for new leads |
| `/api/cron/sync-meta-insights` | `0 * * * *` (hourly) | Refreshes the Meta Ads campaign cache |
| `/api/cron/mark-no-show-visits` | `0 1 * * *` (1am) | Flags unclosed site visits as no-show |
| `/api/cron/repair-rollups` | `30 2 * * *` (2:30am) | Recomputes report rollups, fixes drift |
| `/api/cron/mark-overdue-demands` | `0 3 * * *` (3am) | Flags unpaid demands past due date |
| `/api/cron/grievance-sla-nudge` | `0 4 * * *` (4am) | Nudges admin on stale high-priority grievances |
| `/api/cron/tenancy-renewal-sweep` | `0 5 * * *` (5am) | Flags leases ending within 60 days |

`vercel.json` still has these same schedules declared — safe to leave as
documentation, or delete once the in-process scheduler is built and confirmed
working (whichever this repo's convention prefers).

## Also needed before any of this matters

`CRON_SECRET` must be set in the VM's environment (`.env.local` or systemd
service env) — every route checks it and rejects unauthenticated calls otherwise.
