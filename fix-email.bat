@echo off
setlocal
cd /d "%~dp0"

echo.
echo === TRIBAMS email fix ===
echo Folder: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not on PATH.
  echo Install Node from https://nodejs.org then run this again.
  pause
  exit /b 1
)

node "scripts\apply-email-fix.js"
set ERR=%ERRORLEVEL%

echo.
if %ERR% neq 0 (
  echo Fix failed. See errors above.
  pause
  exit /b %ERR%
)

echo.
echo Optional quick SMTP test now? Close this window or press a key to test.
pause >nul
node "scripts\test-email.js"
echo.
pause
