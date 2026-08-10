# Safer Tribams deploy (recommended)

## Recommendation

**Do not** deploy Tribams as Cloudflare Workers/Pages only. The app needs Node, filesystem uploads, bcrypt, and Postgres.

### Safer stack (recommended)

```
Users → Cloudflare (DNS + Full strict SSL + WAF)
              ↓
         Railway Node origin (Docker / Dockerfile)
              ↓
         Neon Postgres (managed, SSL, no public DIY DB)
```

| Piece | Choice | Why safer |
|-------|--------|-----------|
| Edge | Cloudflare | Hides origin IP (orange cloud), WAF, HTTPS |
| App | **Railway** (or Render) | Secrets in dashboard, no DIY VPS hardening, auto HTTPS to origin |
| DB | **Neon** Postgres | Managed backups/SSL; do **not** expose port 5432 on the internet |
| Auth cookies | `TRUST_PROXY=1`, `APP_BASE_URL=https://tribams.com` | Already supported in code |

### Even safer (optional later)

Cloudflare **Tunnel** from Railway/VPS so the origin has **no public ports**. Use after the basic stack works.

### Avoid

- Workers-only / Pages-only rewrite for v1  
- SQLite in production  
- Publishing Postgres `5432` to the public internet  
- Parking DNS IP  
- Committing `.env`

---

## Step 1 — Neon Postgres

1. Create a free project at [neon.tech](https://neon.tech)
2. Copy the connection string (include `?sslmode=require`)
3. Keep it for Railway env as `DATABASE_URL`

---

## Step 2 — Railway Node app

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub  
2. Repo: `KativaBRITU/cybermatech-simulator` (branch `main`)  
3. Railway detects `Dockerfile` — use it  
4. Set variables (Railway → Variables):

```
NODE_ENV=production
PORT=3080
TRUST_PROXY=1
SESSION_STORE=memory
SESSION_SECRET=<generate-64+ chars>
APP_BASE_URL=https://tribams.com
ADMIN_EMAILS=your-real-admin@email.com
DATABASE_URL=<neon-connection-string>
DB_CLIENT=postgres
PGSSL=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=TRIBAMS <...>
EMAIL_TLS_INSECURE=false
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
PAYPAL_CURRENCY=USD
```

**Do not** set `NODE_TLS_REJECT_UNAUTHORIZED=0` on Railway (that disables TLS verification globally).

5. Generate a public Railway URL first (e.g. `https://xxx.up.railway.app`) and confirm:

```
curl -sS https://YOUR-RAILWAY-URL/api/health
```

Expect Postgres dialect / healthy DB.

---

## Step 3 — Cloudflare in front of tribams.com

1. Cloudflare Dashboard → domain `tribams.com`  
2. DNS: create **CNAME** `tribams.com` (and `www`) → your Railway hostname  
   - Proxy status: **Proxied** (orange cloud)  
3. SSL/TLS → **Full (strict)** + Always Use HTTPS  
4. Caching → Cache Rule: **Bypass** for  
   - `/api/*`  
   - `/dashboard*` `/training*` `/lab*` `/payment*` `/login*` `/register*`  
5. Optional: WAF rate limit on `/login` and `/register`

Then set Railway `APP_BASE_URL=https://tribams.com` and re-check:

```
curl -sS https://tribams.com/api/health
# Admin: GET /api/launch-readiness  → aim ≥ 80%
```

---

## Step 4 — Post-go-live

1. Seed beta testers only with `BETA_TESTER_PASSWORD` set in Railway (not defaults)  
2. Switch PayPal to `live` after sandbox E2E  
3. Enable GitHub 2FA + protect `main`  
4. Consider private repo if the product is proprietary  

---

## If Railway free plan is exhausted

Use **Render** free Web Service instead (same Neon DB + Cloudflare front):

1. [dashboard.render.com](https://dashboard.render.com) → New → **Web Service** → connect GitHub → `cybermatech-simulator`
2. Runtime: **Docker** · Instance: **Free** · Branch: `main`
3. Or Blueprint: use repo `render.yaml`
4. Set the same env vars as Railway (`DATABASE_URL` = Neon, etc.)
5. After deploy: `https://YOUR-SERVICE.onrender.com/api/health`

**Free-tier note:** Render free apps **sleep after ~15 min idle** (cold start ~30–60s). Fine for beta; for always-on later, use a cheap VPS + Cloudflare Tunnel or a paid Render starter.

Do **not** create a Render Postgres — keep using **Neon**.
