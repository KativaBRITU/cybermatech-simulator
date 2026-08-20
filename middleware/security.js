// ============================================================
// FILE: middleware/security.js
// EXACT LOCATION: tribams-simulator/middleware/security.js
// ============================================================

// Security Headers Middleware
function securityHeaders(req, res, next) {
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Frame protection (anti-clickjacking)
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data:; " +
        "connect-src 'self'"
    );
    
    // HSTS (only in production)
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    next();
}

// Session Fingerprinting (anti-hijacking)
function sessionFingerprint(req, res, next) {
    if (req.session && req.session.user) {
        const fingerprint = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };
        
        // Check if fingerprint changed
        if (req.session.fingerprint) {
            if (req.session.fingerprint.ip !== fingerprint.ip) {
                console.log('🚨 Session hijacking attempt detected!');
                req.session.destroy();
                return res.status(403).json({ 
                    error: 'Session invalid. Please login again.' 
                });
            }
        } else {
            req.session.fingerprint = fingerprint;
        }
    }
    next();
}

// Input Sanitization (XSS protection)
function sanitizeInput(input) {
    if (!input) return '';
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function sanitizeBody(req, res, next) {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        }
    }
    next();
}

// Security Logging
function logSecurityEvent(event, details = {}) {
    console.log(`🔐 SECURITY: ${event}`, {
        timestamp: new Date().toISOString(),
        ...details
    });
}

module.exports = {
    securityHeaders,
    sessionFingerprint,
    sanitizeBody,
    sanitizeInput,
    logSecurityEvent
};