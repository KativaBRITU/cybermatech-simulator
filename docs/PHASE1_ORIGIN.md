# Phase 1 — Always-on origin (without Railway / Render)

Railway free quota is used up. Render wants a card and yours is declined.  
**Next real host: a small VPS.** Until you have one, keep demo on this PC + Cloudflare Tunnel.

## What a small VPS is

A **VPS** (virtual private server) is a **rented computer in a data centre** that stays on 24/7.

| Your laptop | Small VPS |
|-------------|-----------|
| You must leave it on, Wi‑Fi up | Always on, even if you sleep the PC |
| Tunnel (QUIC errors, 522) | Normal HTTPS via Cloudflare DNS |
| Home IP / Windows DNS quirks | Datacentre network (Supabase hostname usually works) |

You get: a public IP, Linux (usually Ubuntu), SSH login, and you run `node server.js` (or Docker) there.

**Small** means the cheapest size that can run Node: about **1 vCPU, 1–2 GB RAM**. TRIBAMS does not need a big machine at the start.

Typical price: **about USD 4–7 / month** (Hetzner, Contabo, some DigitalOcean droplets). That is a real bill, not “free with a card on file.”

## How we go on without Railway and Render

**Path A — keep demo (now)**  
`node server.js` + `.\cf-demo.ps1` / named tunnel. Site only lives while this PC is on. Fine for showing people; not a product.

**Path B — small VPS (Phase 1)**  
1. You buy the VPS and send the **IP** (and that you can SSH).  
2. We install Node (or Docker), copy the app, set `.env` with Supabase **hostname** (no `DEMO_SQLITE_FALLBACK`).  
3. Cloudflare DNS: **A record** `tribams.com` → VPS IP (proxied), SSL **Full (strict)**.  
4. Turn the laptop off. If tribams.com still loads, Phase 1 is done.

There is no third magic free host that runs this Express app 24/7 with no payment. Workers/Pages cannot run this stack. Supabase is database only.

## Providers (you choose)

| Provider | Notes |
|----------|--------|
| [Hetzner Cloud](https://www.hetzner.com/cloud) | Often cheapest (CX22 / CAX11). Card or PayPal depending on account. |
| [Contabo](https://contabo.com) | Low monthly price; sometimes slower support. |
| [DigitalOcean](https://www.digitalocean.com) | Simple; usually needs a working card. |
| [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) | ARM VM can be free; signup still often wants a card and is picky. |

If **every** card fails, Path A (laptop + tunnel) is the only option until billing works (business account, prepaid USD card, or someone who can pay the VPS for you).

## What to send when you have a VPS

- Public IPv4  
- Ubuntu (or other Linux)  
- That you can log in with SSH  
- **Do not** paste the root password in chat; we can use SSH keys.

We will not push to GitHub unless you ask.
