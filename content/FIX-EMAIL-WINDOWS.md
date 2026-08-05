# Fix email on your Desktop TRIBAMS app

Your earlier error was:

`self-signed certificate in certificate chain`

That is almost never a wrong App Password. It is Windows antivirus inspecting HTTPS.

## 1. Update Desktop `.env`

In `C:\Users\CASH CONVERTERS\Desktop\cybermatech-simulator\.env` set:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tribamszetu@gmail.com
EMAIL_PASS=hhslcfmfcgmtpphs
EMAIL_FROM=TRIBAMS <tribamszetu@gmail.com>
EMAIL_TLS_INSECURE=true
```

## 2. Patch `services/emailService.js` transporter

Find `nodemailer.createTransport({...})` and make sure it includes:

```js
tls: {
  rejectUnauthorized: process.env.EMAIL_TLS_INSECURE === 'true' ? false : process.env.NODE_ENV === 'production'
}
```

Or copy this project's `services/emailService.js` over your Desktop one.

## 3. Restart and test

```powershell
cd "C:\Users\CASH CONVERTERS\Desktop\cybermatech-simulator"
npm start
```

Look for: `✅ Email service ready`

Or run:

```powershell
node scripts/test-email.js
```

Optional: in antivirus, turn off HTTPS/SSL scanning for Node, or whitelist `node.exe`.
