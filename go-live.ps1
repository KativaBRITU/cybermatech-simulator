# One-command go-live for tribams.com
# Keeps Node + Cloudflare Tunnel running together.

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot
$cf = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$tunnelId = "a8d798d3-b2ad-48ef-b820-9769bda11e8e"

Write-Host "==> Checking local app on :3080 ..."
$ok = $false
try {
  $r = Invoke-WebRequest -Uri "http://127.0.0.1:3080/" -UseBasicParsing -TimeoutSec 5
  if ($r.StatusCode -eq 200) { $ok = $true }
} catch {}

if (-not $ok) {
  Write-Host "==> Starting node server.js in a new window ..."
  Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$PSScriptRoot`"; node server.js"
  Write-Host "Waiting for app to listen (can take a few minutes while DB seeds) ..."
  for ($i=0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 5
    try {
      $r = Invoke-WebRequest -Uri "http://127.0.0.1:3080/" -UseBasicParsing -TimeoutSec 3
      if ($r.StatusCode -eq 200) { $ok = $true; break }
    } catch {}
    Write-Host ("  still waiting... {0}s" -f (($i+1)*5))
  }
}

if (-not $ok) {
  Write-Host "ERROR: App did not become ready on http://127.0.0.1:3080"
  exit 1
}
Write-Host "OK: App is live on http://127.0.0.1:3080"

Write-Host "==> Stopping old cloudflared for this project ..."
Get-CimInstance Win32_Process -Filter "Name='cloudflared.exe'" | ForEach-Object {
  if ($_.CommandLine -match 'cloudflared\.tribams\.yml|trycloudflare|tunnel --url') {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Seconds 2

Write-Host "==> Ensuring DNS points to tunnel (may time out on flaky networks) ..."
& $cf tunnel route dns --overwrite-dns $tunnelId tribams.com 2>&1 | Out-Host
& $cf tunnel route dns --overwrite-dns $tunnelId www.tribams.com 2>&1 | Out-Host

Write-Host "==> Starting named tunnel (HTTP/2) ..."
Write-Host "Leave this window open. Then open https://tribams.com"
& $cf --edge-ip-version 4 tunnel --no-prechecks --config cloudflared.tribams.yml run
