# TRIBAMS — Cyber Training Platform

Africa-focused cybersecurity training with 95 modules, Evidence Workbench labs, timed drills, Force Readiness transcripts, and Matte K coaching.

## Quick start

```bash
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3080` (or the `PORT` in `.env`).

## Domain

Production site: **https://tribams.com**

Set in `.env` before go-live:

```
APP_BASE_URL=https://tribams.com
NODE_ENV=production
```

### Cloudflare hosting (recommended)

Tribams is a **Node/Express** app. Use Cloudflare for **DNS + HTTPS + WAF** in front of a Node origin — **not** Workers-only.

Full guide: [`docs/CLOUDFLARE_HOSTING.md`](docs/CLOUDFLARE_HOSTING.md)  
**Safer recommended path:** [`docs/SAFE_CLOUDFLARE_DEPLOY.md`](docs/SAFE_CLOUDFLARE_DEPLOY.md) (Cloudflare + Railway + Neon)

```bash
# Origin with Postgres (then point tribams.com through Cloudflare)
docker compose -f docker-compose.cloudflare.yml up -d --build
```

Must set on the host: `NODE_ENV=production`, `APP_BASE_URL=https://tribams.com`, `SESSION_SECRET`, `ADMIN_EMAILS`, SMTP, PayPal. Prefer `DATABASE_URL` Postgres. In Cloudflare: SSL **Full (strict)** and cache **bypass** for `/api/*` and member pages.

## Public launch checklist

Set these in `.env` before going live:

| Variable | Why |
|---|---|
| `NODE_ENV=production` | Secure cookies + prod gates |
| `SESSION_SECRET` | 64+ random characters |
| `APP_BASE_URL` | Public `https://` domain (PayPal return URLs) |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `EMAIL_USER` / `EMAIL_PASS` | SMTP for welcome, reset, certs, payment receipts |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Live paid upgrades |
| `PAYPAL_MODE=live` | Real charges (use `sandbox` while testing) |

Prices are shown in NAD; PayPal charges the USD equivalent (`NAD_PER_USD`).

### Verify launch readiness

1. Start the server: `npm start`
2. Health: `GET /api/health`
3. As admin: `GET /api/launch-readiness` (target **≥ 80%**)
4. Smoke tests: `npm test` (server must be running)

### Payment test (sandbox)

1. Create a PayPal sandbox app and paste credentials into `.env`
2. Keep `PAYPAL_MODE=sandbox`
3. Log in → `/payment` → Subscribe → approve in PayPal sandbox
4. Confirm redirect to `/payment-success` and Pro access on dashboard

Without PayPal credentials, non-production / admin accounts can still activate plans for local testing.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Production server |
| `npm run dev` | Nodemon reload |
| `npm test` | Smoke tests against running server |
| `npm run db:postgres:up` | Start Postgres via Docker |
| `node scripts/seed-beta-testers.js` | Upsert 10 closed-beta accounts (`beta01`…`beta10`) with full module/resource access (not admin). Prints credentials once. Optional: `BETA_TESTER_PASSWORD`. |
| `node scripts/refresh-module-content.js` | Quarterly refresh of essay prompts + quiz/practice banks (90-day cycle; use `--force` for immediate run) |

### Quarterly content refresh

Every **90 days** (or on first boot when never refreshed), TRIBAMS regenerates:

- Essay prompts with current threat trends (AI fraud, mobile money, cloud IAM, OT, supply chain — Africa + global)
- Cached **quiz** and **practice** question banks in `module_contents`

Core path uses heuristic templates + quarterly trend packs (`modules/contentRefresh.js`). If `OPENAI_API_KEY` is set, two extra essay prompts may be appended.

- **Automatic:** server startup runs `refreshAllModulesIfDue`
- **Manual:** `node scripts/refresh-module-content.js --force`
- **Admin API:** `POST /api/admin/refresh-content` (optional `{ "module_id": 4, "force": true }`)
- **Status:** `GET /api/content-freshness` (admin)

## B2B (business plan)

| Stream | How |
|---|---|
| Subscriptions | `/payment` — individual Pro / Pro+ via PayPal |
| Licensing | `/organization` — Institution / SME / Enterprise seat packs |
| Customized training | Organization hub → request Namibia/industry packs |
| Team analytics | Organization hub readiness stats |

Org members inherit Pro/Pro+ while the org license is active.

## Stack

Express · SQLite (default) or PostgreSQL · PayPal Orders · Nodemailer · Helmet
