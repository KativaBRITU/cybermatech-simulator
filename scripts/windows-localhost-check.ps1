# Windows localhost repair for Cybermatech / TRIBAMS
# Run in PowerShell INSIDE your project folder.

Write-Host "=== 1) Kill old Node servers ===" -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host "=== 2) What is using common ports? ===" -ForegroundColor Cyan
netstat -ano | findstr ":5000 :3000 :3080 :3090"

Write-Host "=== 3) Start MINIMAL debug server on 3080 ===" -ForegroundColor Cyan
Write-Host "Keep this window open. In Chrome open: http://127.0.0.1:3080"
Write-Host "Press Ctrl+C when done testing, then run your real: node server.js"
$env:PORT = "3080"
node scripts/debug-listen.js
