// ============================================================
// FILE: middleware/auth.js
// EXACT LOCATION: tribams-simulator/middleware/auth.js
// ============================================================

function wantsJson(req) {
    const p = String(req.path || '');
    if (p.startsWith('/api/')) return true;
    const accept = String(req.get('accept') || '').toLowerCase();
    if (accept.includes('text/html')) return false;
    const xhr = String(req.get('x-requested-with') || '').toLowerCase();
    if (xhr === 'xmlhttprequest') return true;
    return accept.includes('application/json');
}

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    if (wantsJson(req)) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Please login.'
        });
    }
    const nextUrl = encodeURIComponent(req.originalUrl || req.path || '/dashboard');
    return res.redirect(`/login?next=${nextUrl}`);
}

// Admin Authentication — session + ADMIN_EMAILS only (never fail open)
function isAdmin(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    if (!req.session || !req.session.user) {
        if (wantsJson(req)) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. Please login.'
            });
        }
        return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl || '/admin'));
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
    const email = String(req.session.user.email || '').toLowerCase();
    if (!email || !adminEmails.includes(email)) {
        if (wantsJson(req)) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required.'
            });
        }
        return res.redirect('/login');
    }

    next();
}

// API Key Authentication (optional)
function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        return next();
    }
    res.status(401).json({ 
        success: false, 
        message: 'Invalid API key.' 
    });
}

module.exports = {
    isAuthenticated,
    isAdmin,
    apiKeyAuth
};