# Fix Desktop TRIBAMS email (forgot password)

Your server screenshot shows the app is healthy on **port 3080**, but email still fails with:

`self-signed certificate in certificate chain`

That means Desktop is still running the **old** `emailService.js` (TLS check still on). The App Password is fine — Gmail works once TLS verify is disabled.

## Fastest fix (PowerShell on your PC)

1. **Stop** the server (`Ctrl+C` in that terminal).

2. Paste this in PowerShell:

```powershell
cd "C:\Users\CASH CONVERTERS\Desktop\cybermatech-simulator"

# Backup old file
Copy-Item .\services\emailService.js .\services\emailService.js.bak -Force

# Download the fixed file from GitHub
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/KativaBRITU/cybermatech-simulator/cursor/remove-ai-visual-style-ac76/services/emailService.js" -OutFile ".\services\emailService.js"

# Patch .env (adds missing lines; does not wipe other vars)
$envPath = ".\.env"
if (-not (Test-Path $envPath)) { New-Item $envPath -ItemType File | Out-Null }
$needed = @(
  "EMAIL_HOST=smtp.gmail.com",
  "EMAIL_PORT=587",
  "EMAIL_USER=tribamszetu@gmail.com",
  "EMAIL_PASS=hhslcfmfcgmtpphs",
  "EMAIL_FROM=TRIBAMS <tribamszetu@gmail.com>",
  "APP_BASE_URL=http://127.0.0.1:3080",
  "EMAIL_TLS_INSECURE=true",
  "NODE_TLS_REJECT_UNAUTHORIZED=0"
)
$existing = Get-Content $envPath -ErrorAction SilentlyContinue
foreach ($line in $needed) {
  $key = ($line -split "=", 2)[0]
  if ($existing -notmatch "^$key=") {
    Add-Content $envPath $line
  } else {
    (Get-Content $envPath) | ForEach-Object {
      if ($_ -match "^$key=") { $line } else { $_ }
    } | Set-Content $envPath
  }
}

# Restart
node server.js
```

3. In the banner you must see:

`✅ Email service ready (...via smtp.gmail.com:587)`

**Not** `self-signed certificate in certificate chain`.

4. Open the site in **Windows Chrome** (not Cursor’s Simple Browser):

`http://127.0.0.1:3080`

5. Use **Forgot password** again → check Gmail **Inbox + Spam**.

## If download fails (manual)

1. Open: https://github.com/KativaBRITU/cybermatech-simulator/blob/cursor/remove-ai-visual-style-ac76/services/emailService.js  
2. Click **Raw** → Ctrl+A → Ctrl+C  
3. Overwrite `Desktop\cybermatech-simulator\services\emailService.js`  
4. Restart with `node server.js`

## Keep Desktop file — surgical TLS patch only

If you do not want to replace the whole file, open Desktop `services\emailService.js` and do **both**:

**A.** Put this as the **first line** of the file (before `require('nodemailer')`):

```js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

**B.** In every `createTransport({...})` / transporter config, force:

```js
tls: { rejectUnauthorized: false, minVersion: 'TLSv1.2' }
```

Do **not** leave `rejectUnauthorized: true` or omit `tls` entirely.

Save → restart → look for `✅ Email service ready`.

## Localhost note

- Server banner says **http://localhost:3080** → use that (or `127.0.0.1:3080`).
- Port **5000** will fail if nothing is listening there.
- Cursor cloud preview cannot open your Windows localhost.
