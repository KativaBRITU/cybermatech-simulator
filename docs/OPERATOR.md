# TRIBAMS operator path

Short runbook for the person who starts the app and handles sales. Not a hosting migration guide.

## Start the app

1. Copy `.env.example` to `.env` if needed. Set `SESSION_SECRET`, `ADMIN_EMAILS`, `APP_BASE_URL`.
2. **Production:** set `DATABASE_URL` to hosted Postgres. Do **not** set `DEMO_SQLITE_FALLBACK=true` on a public host — that silently uses the SQLite file and drops data on redeploy.
3. From the project root: `npm start` (or `node server.js`). Default listen port is `PORT` (example: 3000; local `.env` may use 3080).
4. Sign in as Katva (`kativabritish@gmail.com` in `ADMIN_EMAILS`), then open `/admin`. Admin is email-only; other founder logins (Kabox / Mukwaruze / trbams) do not get the operator console.

## One folder, one project

TRIBAMS lives in **one** folder: `Desktop\cybermatech-simulator` under the Windows account you work in (this PC: `CASH CONVERTERS`).

Do not open the zip copies (`cybermatech-simulator.zip`) as a second project. Do not keep a second clone on another Windows login. Cursor/GitHub may show a different display name (Kabox vs Mukwaruze); that is two **logins**, not two codebases. Always open this same folder so News, phases, labs, and USD payment stay together.

Admin is `ADMIN_EMAILS` only (`kativabritish@gmail.com`). Do not grant `/admin` by username. Do not re-run `scripts/grant-founder-access.js` — it would force Special Ops onto founder usernames without payment.

## Health vs launch guts

| Path | Who | What you get |
|------|-----|----------------|
| `GET /api/health` | Public | `{ ok, service, time }` only. `ok: false` / HTTP 503 means the DB ping failed. |
| `GET /api/launch-readiness` | Admin session | PayPal, email, DB ping, Postgres vs SQLite, sandbox vs live, next steps. Same payload drives the admin status pills. |

Do not treat public health as a config dump.

## Activate an org license

After a paid or agreed team deal:

1. Admin → **Organizations**.
2. Choose a plan on the org row (SME / Institution / Enterprise / Custom). That calls `POST /api/admin/orgs/:id/activate-license`.
3. Confirm seats and expiry on the org row. Revenue uses `organization_licenses.amount_usd` (NAD-only historical rows convert at `NAD_PER_USD` as a footnote, not live FX).

## Individual checkout

Consumer PayPal checkouts complete on `/payment`. If PayPal is not configured, learners submit a **plan request** or redeem a **license key** on the same page. Requests appear in Admin → Sales (pending checkouts). They do **not** unlock Pro until you activate the user.

## Activate a learner plan (manual / Railway before PayPal)

1. Admin → **Users** → **Activate plan** on the learner row, or
2. Admin → **Sales** → **License keys** → Create key, send it to the learner, they redeem on `/payment`.

Do not treat a pending request as paid access.

## Sales queue

1. Quotes from `/teams` land in Admin → **Sales**.
2. `GET /api/admin/sales-leads` lists them (status starts as `new`).
3. Reply from the human inbox; close the loop in email. The queue is the intake list, not a CRM.

## Do not use SQLite fallback in production

- Local laptop: empty `DATABASE_URL` → SQLite `database/tribams.db` is fine.
- Production: hosted Postgres via `DATABASE_URL`. Unset `DEMO_SQLITE_FALLBACK`.
- If launch-readiness shows **DB sqlite** or `sqlite_fallback_off: false` on a public host, stop and fix the database before taking payments.
