/**
 * Cybermatech / TRIBAMS email service
 * .env: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, APP_BASE_URL
 *
 * Windows note: antivirus HTTPS scanning often causes
 * "self-signed certificate in certificate chain".
 * Set EMAIL_TLS_INSECURE=true in .env for local/dev (already default in development).
 */

const nodemailer = require('nodemailer');

const APP_BASE_URL = (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, '');
const EMAIL_USER = String(process.env.EMAIL_USER || '').trim();
const EMAIL_PASS = String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const EMAIL_HOST = String(process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_FROM = String(process.env.EMAIL_FROM || '').trim() || `Cybermatech <${EMAIL_USER || 'noreply@localhost'}>`;

function tlsInsecureAllowed() {
    const flag = String(process.env.EMAIL_TLS_INSECURE || '').toLowerCase();
    if (flag === 'true' || flag === '1' || flag === 'yes') return true;
    if (flag === 'false' || flag === '0' || flag === 'no') return false;
    // Default: allow in non-production so local antivirus MITM does not block Gmail
    return process.env.NODE_ENV !== 'production';
}

let transporter = null;
let verifiedOnce = false;
let lastError = null;

function isConfigured() {
    return Boolean(EMAIL_USER && EMAIL_PASS);
}

function getTransporter() {
    if (!isConfigured()) return null;
    if (transporter) return transporter;

    const insecure = tlsInsecureAllowed();
    transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_PORT === 465,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        tls: {
            // Fixes: self-signed certificate in certificate chain (common on Windows AV)
            rejectUnauthorized: !insecure,
            minVersion: 'TLSv1.2'
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000
    });
    return transporter;
}

async function ensureReady() {
    const tx = getTransporter();
    if (!tx) {
        lastError = 'EMAIL_USER or EMAIL_PASS missing in .env';
        return false;
    }
    if (verifiedOnce) return true;
    try {
        await tx.verify();
        verifiedOnce = true;
        lastError = null;
        console.log(`✅ Email service ready (${EMAIL_USER} via ${EMAIL_HOST}:${EMAIL_PORT})`);
        return true;
    } catch (err) {
        lastError = err.message;
        console.warn('⚠️ Email service not ready:', err.message);
        if (/self-signed|certificate/i.test(err.message || '')) {
            console.warn('   Tip: set EMAIL_TLS_INSECURE=true in .env (antivirus TLS scan), then restart.');
        }
        if (/Invalid login|EAUTH|535/i.test(err.message || '')) {
            console.warn('   Tip: use a 16-character Gmail App Password, not your normal password.');
        }
        return false;
    }
}

function getStatus() {
    return {
        configured: isConfigured(),
        ready: verifiedOnce,
        user: EMAIL_USER || null,
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        from: EMAIL_FROM,
        app_base_url: APP_BASE_URL,
        tls_insecure: tlsInsecureAllowed(),
        last_error: lastError
    };
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function sendMail({ to, subject, html, text }) {
    const ready = await ensureReady();
    if (!ready) {
        return { sent: false, reason: lastError || 'not_configured' };
    }
    try {
        await getTransporter().sendMail({
            from: EMAIL_FROM,
            to,
            subject,
            html,
            text: text || undefined
        });
        console.log(`📧 Email sent → ${to} (${subject})`);
        return { sent: true };
    } catch (err) {
        lastError = err.message;
        console.error(`❌ Email failed → ${to}:`, err.message);
        return { sent: false, reason: err.message };
    }
}

async function sendWelcomeEmail(email, username) {
    const name = escapeHtml(username);
    const dash = `${APP_BASE_URL}/dashboard`;
    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0b2430;">
        <h2 style="margin:0 0 12px;">Welcome to Cybermatech, ${name}</h2>
        <p>Your account is ready. Sign in and start with the free training modules.</p>
        <p><a href="${dash}" style="display:inline-block;padding:12px 18px;background:#1f6f63;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Open Dashboard</a></p>
      </div>`;
    return sendMail({
        to: email,
        subject: 'Welcome to Cybermatech',
        html,
        text: `Welcome to Cybermatech, ${username}. Open ${dash}`
    });
}

async function sendPasswordResetEmail(email, username, resetLink) {
    const name = escapeHtml(username);
    const link = String(resetLink || '');
    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0b2430;">
        <h2>Hello ${name}</h2>
        <p>We received a password reset request.</p>
        <p><a href="${link}" style="display:inline-block;padding:12px 18px;background:#1f6f63;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Reset password</a></p>
        <p style="color:#5c6f7c;font-size:13px;">Link expires in 1 hour. If you did not ask for this, ignore the email.</p>
      </div>`;
    return sendMail({
        to: email,
        subject: 'Reset your Cybermatech password',
        html,
        text: `Reset password: ${link}`
    });
}

async function sendTestEmail(to) {
    const target = to || EMAIL_USER;
    return sendMail({
        to: target,
        subject: 'Cybermatech email test',
        html: `<p>SMTP works. Sent at ${new Date().toISOString()}</p>`,
        text: `SMTP works. Sent at ${new Date().toISOString()}`
    });
}

module.exports = {
    APP_BASE_URL,
    isConfigured,
    ensureReady,
    getStatus,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendTestEmail,
    sendMail
};
