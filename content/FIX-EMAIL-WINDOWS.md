# Fix email on your Desktop TRIBAMS app

Error:

`self-signed certificate in certificate chain`

This is almost never a wrong App Password. It is Windows antivirus inspecting TLS.

## Recommended

Double-click `fix-email.bat` in the project root, then restart:

```bat
node server.js
```

Or:

```bat
node scripts\apply-email-fix.js
node scripts\test-email.js
```

## What the fix changes

1. `services/emailService.js` — forces `rejectUnauthorized: false`, sets `NODE_TLS_REJECT_UNAUTHORIZED=0`, and retries port **587** then **465**.
2. `.env` — adds:

```env
EMAIL_TLS_INSECURE=true
NODE_TLS_REJECT_UNAUTHORIZED=0
APP_BASE_URL=http://127.0.0.1:3080
PORT=3080
```

Your existing `EMAIL_USER` / `EMAIL_PASS` are preserved.

## After restart

Look for: `✅ Email service ready (... TLS verify off)`

Then use Forgot password. If SMTP still fails, the UI shows a reset link so you can continue.
