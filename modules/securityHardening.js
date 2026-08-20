/**
 * Security hardening helpers (Step 2)
 * — input validation, route-scoped rate limits, login lockout
 */

const rateBuckets = new Map();
const loginFailures = new Map();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_\-.]{3,32}$/;

function clientIp(req) {
    return (
        req.ip ||
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        'unknown'
    );
}

/** Route-scoped rate limiter (IP + bucket name). */
function rateLimiter(maxRequests = 30, windowMs = 15 * 60 * 1000, bucket = 'default') {
    return (req, res, next) => {
        const key = `${bucket}:${clientIp(req)}`;
        const now = Date.now();
        let record = rateBuckets.get(key);
        if (!record || now > record.resetTime) {
            record = { count: 0, resetTime: now + windowMs };
        }
        record.count += 1;
        rateBuckets.set(key, record);

        res.setHeader('X-RateLimit-Limit', String(maxRequests));
        res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - record.count)));

        if (record.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.'
            });
        }
        next();
    };
}

// Periodic cleanup so maps do not grow forever
setInterval(() => {
    const now = Date.now();
    for (const [k, v] of rateBuckets) {
        if (v.resetTime < now) rateBuckets.delete(k);
    }
    for (const [k, v] of loginFailures) {
        if (v.unlockAt < now) loginFailures.delete(k);
    }
}, 10 * 60 * 1000).unref?.();

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function validateRegister({ username, email, password }) {
    const errors = [];
    const u = String(username || '').trim();
    const e = normalizeEmail(email);
    const p = String(password || '');

    if (!USERNAME_RE.test(u)) {
        errors.push('Username must be 3–32 characters (letters, numbers, _ - .)');
    }
    if (!EMAIL_RE.test(e) || e.length > 120) {
        errors.push('Enter a valid email address');
    }
    if (p.length < 8 || p.length > 128) {
        errors.push('Password must be 8–128 characters');
    }
    if (p && !/[A-Za-z]/.test(p)) {
        errors.push('Password must include at least one letter');
    }
    if (p && !/[0-9]/.test(p)) {
        errors.push('Password must include at least one number');
    }

    return {
        ok: errors.length === 0,
        errors,
        username: u,
        email: e,
        password: p
    };
}

function validateLogin({ email, password }) {
    const e = normalizeEmail(email);
    const p = String(password || '');
    if (!EMAIL_RE.test(e) || !p || p.length > 128) {
        return { ok: false, message: 'Email and password required' };
    }
    return { ok: true, email: e, password: p };
}

const MAX_FAILS = 8;
const LOCK_MS = 15 * 60 * 1000;

function isLoginLocked(email) {
    const key = normalizeEmail(email);
    const row = loginFailures.get(key);
    if (!row) return false;
    if (Date.now() < row.unlockAt) return true;
    loginFailures.delete(key);
    return false;
}

function recordLoginFailure(email) {
    const key = normalizeEmail(email);
    const row = loginFailures.get(key) || { fails: 0, unlockAt: 0 };
    row.fails += 1;
    if (row.fails >= MAX_FAILS) {
        row.unlockAt = Date.now() + LOCK_MS;
        row.fails = 0;
    }
    loginFailures.set(key, row);
    return row.unlockAt > Date.now();
}

function clearLoginFailures(email) {
    loginFailures.delete(normalizeEmail(email));
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = {
    rateLimiter,
    validateRegister,
    validateLogin,
    normalizeEmail,
    isLoginLocked,
    recordLoginFailure,
    clearLoginFailures,
    escapeHtml,
    clientIp
};
