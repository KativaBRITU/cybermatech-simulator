# Demo URL (trycloudflare.com) — ignores named-tunnel 404 catch-all
Set-Location $PSScriptRoot
$cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
Write-Host "Starting DEMO quick tunnel. Leave this window open."
& $cf --edge-ip-version 4 --protocol http2 tunnel --no-prechecks --config cloudflared.demo.yml --url http://127.0.0.1:3080
