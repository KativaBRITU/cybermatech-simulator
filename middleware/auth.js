// ============================================================
// FILE: middleware/auth.js
// EXACT LOCATION: tribams-simulator/middleware/auth.js
// ============================================================

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ 
        success: false, 
        message: 'Unauthorized. Please login.' 
    });
}

// Admin Authentication
function isAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Unauthorized. Please login.' 
        });
    }
    
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    if (!adminEmails.includes(req.session.user.email)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required.' 
        });
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