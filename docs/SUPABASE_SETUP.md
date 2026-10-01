# Tribams + Supabase (recommended database)

## What Supabase is for (this project)

| Piece | On Supabase? | Notes |
|-------|--------------|--------|
| **Postgres database** | **Yes — use this** | Replaces Neon/Railway Postgres via `DATABASE_URL` |
| Auth / Storage | Optional later | Not required for current Express login |
| Hosting the Node/Express app | **No** | Still need local, Docker, Render free, or a VPS + Cloudflare |

Railway/Render org limits are cancelled for our path. **Database = Supabase.** App origin stays separate (local first, then cheap host later).

## Connect Tribams to Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Project Settings → Database → Connection string → URI**
3. Prefer the **Transaction pooler** (port **6543**) for the app, or Session mode if advised by Supabase
4. Put the URI in local `.env` (never commit):

```
DATABASE_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-....pooler.supabase.com:6543/postgres
DB_CLIENT=postgres
PGSSL=true
```

5. Verify:

```bash
node scripts/smoke-db.js
```

Expect: `Database driver: PostgreSQL` and tables created.

6. Start the app: `npm start` — modules seed into Supabase on boot.

## Cloudflare

Unchanged: DNS/WAF in front of whatever hosts the Node app. Point at your origin when you have one; use Supabase only for data.
