# Fix Desktop TRIBAMS email (forgot password)

Your screenshot shows:
`Forgot-password email not sent: self-signed certificate in certificate chain`

## Do this on your PC

1. Stop the server (Ctrl+C).

2. Open Desktop `.env` and make sure these lines exist:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tribamszetu@gmail.com
EMAIL_PASS=hhslcfmfcgmtpphs
EMAIL_FROM=TRIBAMS <tribamszetu@gmail.com>
APP_BASE_URL=http://127.0.0.1:3080
EMAIL_TLS_INSECURE=true
NODE_TLS_REJECT_UNAUTHORIZED=0
```

3. Replace this file completely:
`C:\Users\CASH CONVERTERS\Desktop\cybermatech-simulator\services\emailService.js`

Copy from this repo's `services/emailService.js` (the version with `rejectUnauthorized: false`).

4. Start again:

```powershell
node server.js
```

You want:
`✅ Email service ready`

NOT:
`self-signed certificate in certificate chain`

5. Try Forgot password again. Check Gmail **Inbox + Spam**.

6. Open the site at the port shown in the banner:
`http://127.0.0.1:3080` (from your screenshot)
