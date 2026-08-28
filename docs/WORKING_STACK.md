# How Tribams hosting works (simple path)

## Why Railway / Fly “failed”

| Option | Problem |
|--------|---------|
| Railway | Free plan / org limits |
| Fly.io | Free tier gone for new accounts (needs card + pay-as-you-go) |
| Cloudflare Workers only | Cannot run this Express + bcrypt + uploads app |
| Supabase alone | Great **database** — does **not** host the Node server |

## Working stack (use this)

```
You / testers
    → Cloudflare Tunnel (optional, free public URL)
        → Node app on your PC (or a cheap VPS later)
            → Supabase Postgres (your "tribams" Free Plan project)
```

1. **Supabase** = store users, modules, essays, labs data  
2. **Node on this machine** = run Tribams (`npm start`)  
3. **Cloudflare Tunnel** (when you want `https://…` without Railway)  
4. Later: move Node to any cheap VPS; keep the same Supabase `DATABASE_URL`

## Make it work today (3 steps)

### 1) Supabase connection string

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) → org **tribams** → your project  
2. **Project Settings → Database → Connection string → URI**  
3. Use the **Transaction pooler** URI (port **6543**) when possible  
4. Replace `[YOUR-PASSWORD]` with the database password you set at project create  

### 2) Put it in local `.env` (never commit)

```
DATABASE_URL=postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-....pooler.supabase.com:6543/postgres
DB_CLIENT=postgres
PGSSL=true
```

### 3) Start Tribams

```bash
node scripts/smoke-db.js
npm start
```

Open `http://127.0.0.1:3080` — app talks to Supabase.

## Public URL without Railway (optional)

Install [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/), then:

```bash
cloudflared tunnel --url http://127.0.0.1:3080
```

You get a free `https://….trycloudflare.com` link for beta testers.  
For `tribams.com`, create a named Tunnel in the Cloudflare Zero Trust dashboard and point DNS at it.

## What to paste back here

Paste **only** the Supabase URI with the password filled in (or say “password set, ready to test”) and we will verify `smoke-db` + boot the app.
