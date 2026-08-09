'use strict';
/**
 * Safe SMTP diagnose — logs shape + verify result, never prints password.
 * Usage: node scripts/smtp-diagnose.js
 */
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const logPath = path.join(__dirname, '..', 'debug-19b11a.log');
function log(hypothesisId, message, data) {
  const payload = {
    sessionId: '19b11a',
    runId: 'smtp-diagnose',
    hypothesisId,
    location: 'scripts/smtp-diagnose.js',
    message,
    data,
    timestamp: Date.now()
  };
  fs.appendFileSync(logPath, JSON.stringify(payload) + '\n');
  console.log(message, JSON.stringify(data));
}

(async () => {
  const user = String(process.env.EMAIL_USER || '').trim();
  const pass = String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const host = String(process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.EMAIL_PORT || 587);

  log('E1', 'smtp config shape', {
    user,
    host,
    port,
    passSet: Boolean(pass),
    passLen: pass.length,
    looksLikeAppPassword: /^[a-zA-Z0-9]{16}$/.test(pass),
    from: process.env.EMAIL_FROM || null
  });

  if (!user || !pass) {
    log('E1', 'missing credentials', { userSet: Boolean(user), passSet: Boolean(pass) });
    process.exit(2);
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const nodemailer = require('nodemailer');

  for (const p of [port, port === 465 ? 587 : 465]) {
    const transporter = nodemailer.createTransport({
      host,
      port: p,
      secure: p === 465,
      requireTLS: p !== 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false, servername: host, minVersion: 'TLSv1.2' },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000
    });
    try {
      await transporter.verify();
      log('E2', 'smtp verify success', { host, port: p, user });
      process.exit(0);
    } catch (err) {
      const msg = String(err && err.message ? err.message : err);
      const code = err && (err.responseCode || err.code);
      log('E2', 'smtp verify failed', {
        host,
        port: p,
        user,
        code,
        badCredentials: /535|BadCredentials|Username and Password not accepted/i.test(msg),
        message: msg.slice(0, 240)
      });
    }
  }
  process.exit(1);
})();
