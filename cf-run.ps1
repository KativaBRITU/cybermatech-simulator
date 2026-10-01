# Demo tunnel for tribams.com — HTTP/2 over TCP (QUIC/UDP drops on this Wi-Fi)
Set-Location $PSScriptRoot
$cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"

Write-Host "Stopping old cloudflared processes..."
Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$env:TUNNEL_TRANSPORT_PROTOCOL = "http2"
$env:TUNNEL_EDGE_IP_VERSION = "4"

Write-Host "Starting tribams tunnel (HTTP/2, IPv4, 1 connection)..."
Write-Host "Leave this window open. Demo: https://tribams.com"
& $cf --edge-ip-version 4 --protocol http2 tunnel --no-prechecks --config cloudflared.tribams.yml run
