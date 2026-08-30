/**
 * TRIBAMS email service (tribams.com)
 *
 * Drop this file over Desktop: services/emailService.js then restart.
 * Fixes Windows antivirus MITM error:
 *   "self-signed certificate in certificate chain"
 */

'use strict';

// Must run before any SMTP/TLS socket is opened.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const tls = require('tls');
const dns = require('dns');
const nodemailer = require('nodemailer');

// Railway/cloud hosts often lack IPv6 egress to Gmail — force IPv4 for SMTP sockets.
try {
    dns.setDefaultResultOrder('ipv4first');
} catch (_) {
    /* Node < 17 */
}

function smtpLookup(hostname, _options, callback) {
    dns.lookup(hostname, { family: 4, all: false }, callback);
}

// Soften global TLS defaults for AV-inspected SMTP on Windows.
try {
    tls.DEFAULT_MIN_VERSION = 'TLSv1.2';
} catch (_) {
    /* ignore on older Node */
}

const APP_BASE_URL = String(
    process.env.APP_BASE_URL || `http://127.0.0.1:${process.env.PORT || 3080}`
).replace(/\/$/, '');

const EMAIL_USER = String(process.env.EMAIL_USER || '').trim();
const EMAIL_PASS = String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const EMAIL_HOST = String(process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
const EMAIL_FROM =
    String(process.env.EMAIL_FROM || '').trim() ||
    `TRIBAMS <${EMAIL_USER || 'noreply@localhost'}>`;

const PRIMARY_PORT = Number(process.env.EMAIL_PORT || 587);
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || '').trim();
const RESEND_FROM = String(process.env.RESEND_FROM || '').trim();

let transporter = null;
let activePort = PRIMARY_PORT;
let verifiedOnce = false;
let lastError = null;
let emailProvider = null; // 'resend' | 'smtp'

function useResend() {
    return Boolean(RESEND_API_KEY);
}

function isRailwayHost() {
    return Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isConfigured() {
    return Boolean((EMAIL_USER && EMAIL_PASS) || RESEND_API_KEY);
}

function isCertError(err) {
    const msg = String(err && err.message ? err.message : err || '').toLowerCase();
    return (
        msg.includes('self-signed') ||
        msg.includes('certificate') ||
        msg.includes('cert_') ||
        msg.includes('unable to verify') ||
        err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
        err.code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
        err.code === 'SELF_SIGNED_CERT_IN_CHAIN'
    );
}

function buildTransportOptions(port) {
    const use465 = Number(port) === 465;
    return {
        host: EMAIL_HOST,
        port: Number(port),
        secure: use465,
        requireTLS: !use465,
        ignoreTLS: false,
        lookup: smtpLookup,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        },
        tls: {
            // Required when Windows antivirus inspects SMTP/TLS.
            rejectUnauthorized: false,
            servername: EMAIL_HOST,
            minVersion: 'TLSv1.2'
        },
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 25000,
        logger: false,
        debug: false
    };
}

function createTransporter(port) {
    return nodemailer.createTransport(buildTransportOptions(port));
}

function resetTransporter() {
    transporter = null;
    verifiedOnce = false;
}

function getTransporter() {
    if (!isConfigured()) return null;
    if (transporter) return transporter;
    transporter = createTransporter(activePort);
    return transporter;
}

async function tryVerify(port) {
    const tx = createTransporter(port);
    await tx.verify();
    return tx;
}

async function sendViaResend({ to, subject, html, text }) {
    const from = RESEND_FROM || EMAIL_FROM;
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to: Array.isArray(to) ? to : [to],
            subject,
            html,
            text: text || undefined
        })
    });
    const body = await res.text();
    if (!res.ok) {
        throw new Error(`Resend HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
    return { sent: true, provider: 'resend' };
}

async function ensureReady() {
    if (!isConfigured() && !useResend()) {
        lastError = 'EMAIL_USER/EMAIL_PASS or RESEND_API_KEY missing';
        return false;
    }

    if (useResend()) {
        emailProvider = 'resend';
        verifiedOnce = true;
        lastError = null;
        console.log(`✅ Email service ready (Resend API → ${RESEND_FROM || EMAIL_FROM})`);
        return true;
    }

    if (isRailwayHost()) {
        console.warn(
            '⚠️ Railway Hobby/Trial blocks Gmail SMTP (ports 587/465). ' +
                'Set RESEND_API_KEY on Railway (free at resend.com) or upgrade to Railway Pro and redeploy.'
        );
    }

    if (verifiedOnce && transporter) return true;

    // Force global bypass again in case another module overwrote it.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const portsToTry = [];
    const primary = PRIMARY_PORT || 587;
    portsToTry.push(primary);
    if (primary !== 465) portsToTry.push(465);
    if (primary !== 587) portsToTry.push(587);

    let lastErr = null;
    for (const port of portsToTry) {
        try {
            const tx = await tryVerify(port);
            transporter = tx;
            activePort = port;
            verifiedOnce = true;
            emailProvider = 'smtp';
            lastError = null;
            console.log(
                `✅ Email service ready (${EMAIL_USER} via ${EMAIL_HOST}:${port}, TLS verify off)`
            );
            return true;
        } catch (err) {
            lastErr = err;
            const msg = String(err && err.message ? err.message : err);
            const badCreds = /535|BadCredentials|Username and Password not accepted/i.test(msg);
            const hint = isCertError(err)
                ? ' (TLS/AV intercept — will retry next port)'
                : badCreds
                    ? ' → Gmail rejected EMAIL_USER/EMAIL_PASS. Use a Google App Password for EMAIL_USER (not the normal login password), then restart.'
                    : '';
            console.warn(
                `⚠️ Email verify failed on ${EMAIL_HOST}:${port}: ${msg.split('\n')[0]}${hint}`
            );
        }
    }

    // Verify can fail (timeout / AV) while sendMail still works — keep a transporter ready to try.
    transporter = createTransporter(primary);
    activePort = primary;
    emailProvider = 'smtp';
    verifiedOnce = false;
    lastError = lastErr ? lastErr.message : 'SMTP verify failed';
    console.warn('⚠️ Email verify failed; will still attempt send on demand:', lastError);
    return true;
}

function getStatus() {
    return {
        configured: isConfigured() || useResend(),
        ready: verifiedOnce,
        provider: emailProvider || (useResend() ? 'resend' : isConfigured() ? 'smtp' : null),
        user: EMAIL_USER || null,
        host: EMAIL_HOST,
        port: activePort,
        from: RESEND_FROM || EMAIL_FROM,
        resend: useResend(),
        railway_smtp_blocked_hint: isRailwayHost() && !useResend(),
        app_base_url: APP_BASE_URL,
        tls_insecure: true,
        node_tls_reject_unauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
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
    if (useResend()) {
        try {
            await ensureReady();
            const result = await sendViaResend({ to, subject, html, text });
            console.log(`📧 Email sent (Resend) → ${to} (${subject})`);
            return result;
        } catch (err) {
            lastError = err.message;
            console.error(`❌ Resend email failed → ${to}:`, err.message);
            return { sent: false, reason: err.message };
        }
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let ready = await ensureReady();
    if (!ready) {
        // One hard reset + retry for flaky AV TLS inspection.
        resetTransporter();
        ready = await ensureReady();
    }
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

        if (isCertError(err) || /timeout|econn|socket/i.test(String(err.message))) {
            resetTransporter();
            const retried = await ensureReady();
            if (retried) {
                try {
                    await getTransporter().sendMail({
                        from: EMAIL_FROM,
                        to,
                        subject,
                        html,
                        text: text || undefined
                    });
                    console.log(`📧 Email sent on retry → ${to} (${subject})`);
                    return { sent: true };
                } catch (err2) {
                    lastError = err2.message;
                    console.error(`❌ Email retry failed → ${to}:`, err2.message);
                    return { sent: false, reason: err2.message };
                }
            }
        }

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
    const result = await sendMail({
        to: email,
        subject: 'Reset your TRIBAMS password',
        html,
        text: `Reset your TRIBAMS password (expires in 1 hour): ${link}`
    });
    if (!result.sent) {
        // Match Desktop TRIBAMS log wording so screenshots are easier to diagnose.
        console.warn('Forgot-password email not sent:', result.reason || lastError);
    }
    return result;
}

async function sendCertificateEmail(email, username, moduleName, score, certificateId) {
    const name = escapeHtml(username);
    const mod = escapeHtml(moduleName);
    const viewUrl = certificateId
        ? `${APP_BASE_URL}/certificate?id=${encodeURIComponent(certificateId)}`
        : `${APP_BASE_URL}/dashboard`;
    const verifyUrl = certificateId
        ? `${APP_BASE_URL}/verify?id=${encodeURIComponent(certificateId)}`
        : `${APP_BASE_URL}/verify`;
    const html = wrapLayout({
        title: 'Your TRIBAMS certificate is ready',
        bodyHtml: `
          <h2 style="margin:0 0 12px;">Congratulations, ${name}</h2>
          <p>You have completed the TRIBAMS training program. Your credential has been <strong>signed off</strong> by TRIBAMS leadership and issued to your account.</p>
          <p>Credential: <strong>${mod}</strong><br>
          Program average: <strong style="color:#b8860b;">${Number(score)}%</strong>
          ${certificateId ? `<br>Certificate ID: <code>${escapeHtml(certificateId)}</code>` : ''}</p>
          <p style="font-size:14px;color:#64748b;">Share your certificate using the secure links below. Anyone can confirm originality on our verify page — no copies or screenshots replace the official record.</p>
          ${ctaButton(viewUrl, 'View your certificate')}
          <p style="margin-top:16px;text-align:center;">
            <a href="${verifyUrl}" style="color:#b8860b;font-weight:600;">Verify originality →</a>
          </p>
        `
    });
    return sendMail({
        to: email,
        subject: `Your TRIBAMS certificate — signed off and ready to share`,
        html,
        text: `TRIBAMS training program completed (${score}%). View: ${viewUrl} Verify: ${verifyUrl}`
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
        ? escapeHtml(
              new Date(details.expiresAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
              })
          )
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

async function sendTestEmail(to) {
    const target = to || EMAIL_USER;
    return sendMail({
        to: target,
        subject: 'TRIBAMS email test',
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
    sendCertificateEmail,
    sendVerificationEmail,
    sendPaymentConfirmationEmail,
    sendTestEmail
};
