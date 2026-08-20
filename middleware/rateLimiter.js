// ============================================================
// FILE: middleware/rateLimiter.js
// EXACT LOCATION: tribams-simulator/middleware/rateLimiter.js
// ============================================================

const rateLimit = require('express-rate-limit');

// Store attempts in memory (for demo)
// In production, use Redis or database
const loginAttempts = {};
const resetAttempts = {};

// Global API rate limit
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { 
        success: false, 
        message: 'Too many requests. Please try again later.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login rate limit (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { 
        success: false, 
        message: 'Too many login attempts. Please try again later.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.log(`🚨 Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Too many login attempts. Please try again later.'
        });
    }
});

// Password reset rate limit (3 per hour)
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { 
        success: false, 
        message: 'Too many reset attempts. Please try again later.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Registration rate limit (10 per hour)
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { 
        success: false, 
        message: 'Too many registration attempts. Please try again later.' 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Record login attempt (for monitoring)
function recordLoginAttempt(email, success) {
    const now = Date.now();
    if (!loginAttempts[email]) {
        loginAttempts[email] = [];
    }
    loginAttempts[email].push({ time: now, success });
    
    // Keep only last 24 hours
    loginAttempts[email] = loginAttempts[email].filter(
        a => now - a.time < 86400000
    );
    
    // Check for suspicious patterns
    const recentFailures = loginAttempts[email].filter(
        a => !a.success && (now - a.time < 900000)
    );
    
    if (recentFailures.length >= 3) {
        console.log(`🚨 Suspicious: ${recentFailures.length} failed logins for ${email}`);
    }
}

// Check reset rate limit manually
function checkResetRateLimit(email) {
    const now = Date.now();
    if (!resetAttempts[email]) {
        resetAttempts[email] = [];
    }
    
    // Clean old attempts
    resetAttempts[email] = resetAttempts[email].filter(
        t => now - t < 3600000 // 1 hour
    );
    
    if (resetAttempts[email].length >= 3) {
        return false;
    }
    
    resetAttempts[email].push(now);
    return true;
}

module.exports = {
    globalLimiter,
    loginLimiter,
    resetLimiter,
    registerLimiter,
    recordLoginAttempt,
    checkResetRateLimit
};