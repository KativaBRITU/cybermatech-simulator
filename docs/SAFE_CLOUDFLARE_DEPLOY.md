# Safer Tribams deploy

## Current working recommendation

See **[`WORKING_STACK.md`](./WORKING_STACK.md)**.

```
Users → Cloudflare Tunnel (optional)
           ↓
      Node origin (this PC / Docker / cheap VPS)
           ↓
      Supabase Postgres
```

| Layer | Choice | Why |
|-------|--------|-----|
| Database | **Supabase** (you already have org **tribams**) | Free Postgres; Railway/Neon not required |
| App | **Local `npm start` first** | Guaranteed to work without paid PaaS |
| Public URL | **Cloudflare Tunnel** (free) | No Railway org / free-plan fights |
| Later | Small VPS + same Supabase URL | Scale when ready |

## Cancelled for now

- Railway (free/org limits)
- Relying on Fly free tier (gone for new accounts)
- Workers-only Cloudflare hosting

## Connect Supabase

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md). Put `DATABASE_URL` in `.env`, run `node scripts/smoke-db.js`, then `npm start`.
