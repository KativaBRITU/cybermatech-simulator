# TRIBAMS on Cloudflare — mechanical requirements

## Architecture (fixed)

```
User → Cloudflare (DNS + HTTPS + WAF) → Node origin (Docker/VPS) → Postgres (hosted)
```

| Question | Answer |
|----------|--------|
| Workers / Pages only? | **No** |
| Cloudflare for domain/SSL/WAF? | **Yes** |
| Database standard in production? | **Hosted Postgres** (`DATABASE_URL`) — not SQLite |

SQLite remains for local laptop only. Production behind Cloudflare uses **Postgres** so redeploys do not wipe users, scores, or essays.

The app already supports this: set `DATABASE_URL` and it uses Postgres. Docker compose (`docker-compose.cloudflare.yml`) runs Node + Postgres together.

---

## Mechanical checklist (fill with your accounts)

### 1. Hosted Postgres (required)

Create a Postgres database (Neon, Supabase, Railway, Render, DigitalOcean, etc.) then set:

```
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
DB_CLIENT=postgres
PGSSL=true
```

### 2. Node origin env (required)

```
NODE_ENV=production
PORT=3080
APP_BASE_URL=https://tribams.com
SESSION_SECRET=<64+ random characters>
ADMIN_EMAILS=you@yourdomain.com
SESSION_STORE=memory
TRUST_PROXY=1
```

### 3. Email (required for public)

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...          # App Password or provider SMTP key
EMAIL_FROM=TRIBAMS <...>
EMAIL_TLS_INSECURE=false
```

### 4. PayPal (required for paid plans)

```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox     # then live after E2E
PAYPAL_CURRENCY=USD
```

### 5. Cloudflare dashboard (required)

1. `tribams.com` DNS → orange-cloud to your Node origin (or Tunnel)  
2. SSL/TLS → **Full (strict)** + Always Use HTTPS  
3. Cache rules → **Bypass** `/api/*`, `/dashboard*`, `/training*`, `/lab*`, `/payment*`, `/login`, `/register`  
4. Optional: WAF rate limit on login/register/paypal  

### 6. Pricing (optional overrides)

Defaults are already in code. Only set if you change them:

```
PRICE_MONTHLY_NAD=450
PRICE_ANNUAL_MONTHLY_NAD=299
PRICE_PRO_PLUS_2MO_NAD=800
PRICE_PRO_PLUS_ANNUAL_MONTHLY_NAD=350
PRICE_SPECIAL_OPS_2MO_NAD=1250
PRICE_SPECIAL_OPS_ANNUAL_MONTHLY_NAD=520
```

---

## Deploy (mechanical)

**Safer recommended path (Neon Postgres + Railway Node + Cloudflare DNS/WAF):**  
see [`SAFE_CLOUDFLARE_DEPLOY.md`](./SAFE_CLOUDFLARE_DEPLOY.md)

Self-host compose (local/VPS) — do **not** expose Postgres publicly:

```bash
cp .env.example .env
# Fill DATABASE_URL (Postgres) + secrets above

docker compose -f docker-compose.cloudflare.yml up -d --build
# Or: deploy Dockerfile to your Node host and point DATABASE_URL at your hosted Postgres
```

Verify:

```bash
curl -sS https://tribams.com/api/health
# Expect database dialect/label showing Postgres when DATABASE_URL is set

# As admin:
# GET https://tribams.com/api/launch-readiness  → target ≥ 80%
```

---

## Already met in the project (no action)

- Express listens on `0.0.0.0`
- `trust proxy` for Cloudflare
- Secure cookies + `sameSite=lax` (PayPal return)
- `/api` and member pages send `no-store` / `CDN-Cache-Control`
- `/api/health` and `/api/launch-readiness`
- `Dockerfile` + `docker-compose.cloudflare.yml`
- Postgres via `DATABASE_URL`

## Only you fill (accounts)

- Hosted Postgres connection string  
- Cloudflare DNS + Full (strict) + cache bypass  
- `SESSION_SECRET`, `ADMIN_EMAILS`, SMTP, PayPal credentials  
- `APP_BASE_URL=https://tribams.com`
