/**
 * TRIBAMS / Cybermatech email service
 * DROP THIS FILE OVER: services/emailService.js on your Desktop app, then restart.
 *
 * Fixes Windows antivirus error:
 *   "self-signed certificate in certificate chain"
 */

// Force BEFORE nodemailer opens any TLS socket
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const nodemailer = require('nodemailer');

const APP_BASE_URL = (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3080}`).replace(/\/$/, '');
const EMAIL_USER = String(process.env.EMAIL_USER || '').trim();
const EMAIL_PASS = String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const EMAIL_HOST = String(process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
const EMAIL_PORT = Number(process.env.EMAIL_PORT || 587);
const EMAIL_FROM = String(process.env.EMAIL_FROM || '').trim() || `TRIBAMS <${EMAIL_USER || 'noreply@localhost'}>`;

let transporter = null;
let verifiedOnce = false;
let lastError = null;

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isConfigured() {
    return Boolean(EMAIL_USER && EMAIL_PASS);
}

function getTransporter() {
    if (!isConfigured()) return null;
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_PORT === 465,
        requireTLS: EMAIL_PORT === 587,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        tls: {
            // REQUIRED on many Windows PCs (AV HTTPS scanning)
            rejectUnauthorized: false,
            minVersion: 'TLSv1.2'
        },
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 25000
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
        tls_insecure: true,
        last_error: lastError
    };
}

function wrapLayout({ title, bodyHtml }) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#0b1220;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b1220;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#f8fafc;border-radius:14px;overflow:hidden;">
        <tr><td style="background:#0b2430;padding:22px 24px;color:#5eead4;">
          <div style="font-size:22px;font-weight:800;color:#ffffff;">TRIBAMS</div>
          <div style="font-size:13px;color:#99f6e4;margin-top:4px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:28px 24px;color:#0f172a;line-height:1.6;font-size:15px;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:16px 24px 22px;font-size:12px;color:#64748b;text-align:center;border-top:1px solid #e2e8f0;">
          TRIBAMS · Building cyber resilience<br>
          <a href="${APP_BASE_URL}" style="color:#0f766e;">${APP_BASE_URL}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href, label) {
    return `<p style="text-align:center;margin:28px 0;">
      <a href="${href}" style="display:inline-block;padding:12px 22px;background:#14b8a6;color:#041018;text-decoration:none;border-radius:8px;font-weight:700;">${escapeHtml(label)}</a>
    </p>`;
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
    const html = wrapLayout({
        title: 'Welcome aboard',
        bodyHtml: `
          <h2 style="margin:0 0 12px;color:#0f172a;">Hello ${name},</h2>
          <p>Welcome to <strong>TRIBAMS</strong> — cyber-ops training built for real pressure.</p>
          ${ctaButton(dash, 'Open Dashboard')}
        `
    });
    return sendMail({
        to: email,
        subject: 'Welcome to TRIBAMS',
        html,
        text: `Welcome to TRIBAMS, ${username}. Start here: ${dash}`
    });
}

async function sendPasswordResetEmail(email, username, resetLink) {
    const name = escapeHtml(username);
    const link = String(resetLink || '');
    const html = wrapLayout({
        title: 'Password reset',
        bodyHtml: `
          <h2 style="margin:0 0 12px;">Hello ${name},</h2>
          <p>We received a request to reset your TRIBAMS password.</p>
          ${ctaButton(link, 'Reset My Password')}
          <p style="background:#fff7ed;border-left:4px solid #f59e0b;padding:12px;color:#9a3412;">
            <strong>This link expires in 1 hour.</strong> If you did not request this, ignore this email.
          </p>
          <p style="font-size:12px;color:#64748b;word-break:break-all;">Or paste: ${escapeHtml(link)}</p>
        `
    });
    return sendMail({
        to: email,
        subject: 'Reset your TRIBAMS password',
        html,
        text: `Reset your TRIBAMS password (expires in 1 hour): ${link}`
    });
}

async function sendCertificateEmail(email, username, moduleName, score, certificateId) {
    const name = escapeHtml(username);
    const mod = escapeHtml(moduleName);
    const certUrl = certificateId
        ? `${APP_BASE_URL}/verify?id=${encodeURIComponent(certificateId)}`
        : `${APP_BASE_URL}/dashboard`;
    const html = wrapLayout({
        title: 'Certificate earned',
        bodyHtml: `
          <h2 style="margin:0 0 12px;">Well done, ${name}</h2>
          <p>You earned a TRIBAMS certificate for <strong>${mod}</strong>.</p>
          <p>Score: <strong style="color:#0f766e;">${Number(score)}%</strong>
          ${certificateId ? `<br>ID: <code>${escapeHtml(certificateId)}</code>` : ''}</p>
          ${ctaButton(certUrl, 'View / Verify Certificate')}
        `
    });
    return sendMail({
        to: email,
        subject: `Certificate earned: ${moduleName} — TRIBAMS`,
        html,
        text: `Certificate for ${moduleName} (${score}%). Verify: ${certUrl}`
    });
}

async function sendVerificationEmail(email, username, verifyLink) {
    const name = escapeHtml(username);
    const link = String(verifyLink || '');
    const html = wrapLayout({
        title: 'Verify your email',
        bodyHtml: `
          <h2 style="margin:0 0 12px;">Welcome ${name}</h2>
          <p>Confirm your email to finish setting up TRIBAMS.</p>
          ${ctaButton(link, 'Verify Email Address')}
        `
    });
    return sendMail({
        to: email,
        subject: 'Verify your TRIBAMS account',
        html,
        text: `Verify your TRIBAMS email: ${link}`
    });
}

async function sendPaymentConfirmationEmail(email, username, details = {}) {
    const name = escapeHtml(username);
    const planLabel = escapeHtml(details.planLabel || details.tier || 'Pro');
    const tier = escapeHtml(details.tier || 'pro');
    const expires = details.expiresAt
        ? escapeHtml(new Date(details.expiresAt).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'short', day: 'numeric'
        }))
        : 'end of billing period';
    const amount = details.amountUsd ? `US$${escapeHtml(String(details.amountUsd))}` : '';
    const dash = `${APP_BASE_URL}/dashboard`;
    const html = wrapLayout({
        title: 'Subscription confirmed',
        bodyHtml: `
          <h2 style="margin:0 0 12px;">Thank you, ${name}</h2>
          <p>Your <strong>${planLabel}</strong> subscription is active.</p>
          <p>Tier: <strong>${tier}</strong>${amount ? `<br>Paid: <strong>${amount}</strong>` : ''}<br>Access until: <strong>${expires}</strong></p>
          ${ctaButton(dash, 'Start Training')}
        `
    });
    return sendMail({
        to: email,
        subject: `TRIBAMS ${details.planLabel || 'subscription'} confirmed`,
        html,
        text: `Your TRIBAMS ${details.planLabel || 'plan'} is active until ${expires}. Open ${dash}`
    });
}

module.exports = {
    APP_BASE_URL,
    isConfigured,
    ensureReady,
    getStatus,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendCertificateEmail,
    sendVerificationEmail,
    sendPaymentConfirmationEmail
};
