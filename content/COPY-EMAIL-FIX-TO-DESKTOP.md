# Fix Desktop TRIBAMS email (forgot password)

Your server can be healthy on **port 3080** while email still fails with:

`self-signed certificate in certificate chain`

That is Windows antivirus TLS inspection — not a bad Gmail App Password.

## Easiest fix (no PowerShell paste)

1. Stop the server (`Ctrl+C`).
2. Make sure this project folder is your Desktop TRIBAMS folder  
   (example: `Desktop\cybermatech-simulator`).
3. **Double-click** `fix-email.bat`  
   — or run:

```bat
node scripts\apply-email-fix.js
```

4. Open `.env` and confirm these exist (keep your real App Password):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=TRIBAMS <your-gmail@gmail.com>
APP_BASE_URL=http://127.0.0.1:3080
EMAIL_TLS_INSECURE=true
NODE_TLS_REJECT_UNAUTHORIZED=0
PORT=3080
```

5. Start the app:

```bat
node server.js
```

6. Banner must show:

`✅ Email service ready (... TLS verify off)`

**Not** `self-signed certificate in certificate chain`.

7. Open Chrome (not Cursor Simple Browser):

`http://127.0.0.1:3080/forgot-password`

8. If mail still fails, the page will show a **clickable reset link** so you can still change the password. Also check the terminal for a `🔑` line.

## Manual fallback

1. Open:  
   https://github.com/KativaBRITU/cybermatech-simulator/blob/cursor/fix-email-tls-553d/services/emailService.js
2. Click **Raw** → select all → copy
3. Overwrite `services\emailService.js` on Desktop
4. Restart with `node server.js`

## Quick SMTP test

```bat
node scripts\test-email.js
```
