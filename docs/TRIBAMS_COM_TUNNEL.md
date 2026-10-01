# tribams.com via Cloudflare named Tunnel

## Goal

```
https://tribams.com  →  Cloudflare Tunnel  →  http://127.0.0.1:3080  →  Supabase
```

## One-time setup (on this PC)

1. Install done: `cloudflared` at `C:\Program Files (x86)\cloudflared\cloudflared.exe`

2. **Login** (pick the Cloudflare account that owns **tribams.com**):

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel login
```

Browser opens → authorize → select zone **tribams.com**.  
Creates: `%USERPROFILE%\.cloudflared\cert.pem`

3. **Create tunnel**:

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel create tribams
```

Note the Tunnel ID printed. Edit `cloudflared.tribams.yml` and set:

`credentials-file: C:\Users\CASH CONVERTERS\.cloudflared\<TUNNEL_ID>.json`

4. **DNS** (CNAME to tunnel — Cloudflare will create orange-cloud records):

```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel route dns tribams tribams.com
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel route dns tribams www.tribams.com
```

5. **SSL** in Cloudflare dashboard for tribams.com:  
   SSL/TLS → **Full** (Tunnel terminates to Cloudflare; Full is enough for tunnel)

6. **Env** (already prepared in `.env`):

```
APP_BASE_URL=https://tribams.com
TRUST_PROXY=1
NODE_ENV=production
```

7. **Run every time you want tribams.com live**:

```powershell
# Terminal A
npm start

# Terminal B
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --config cloudflared.tribams.yml run
```

## Dashboard alternative

Cloudflare Zero Trust → Networks → Tunnels → Create a tunnel → Cloudflared →  
Public hostname `tribams.com` → Service `http://localhost:3080`

## Notes

- PC must stay on while the tunnel runs (or move Node to a VPS later with the same tunnel/config).
- Anonymous `trycloudflare.com` / `lhr.life` URLs are temporary; **tribams.com** needs this named tunnel.
- Keep `/api/*` and login/training paths **cache bypass** in Cloudflare Caching rules.
