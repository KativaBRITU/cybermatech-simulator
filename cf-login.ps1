# Step 1: Cloudflare tunnel login (browser opens — pick tribams.com)
Set-Location $PSScriptRoot
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel login
