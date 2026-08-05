const path = require('path');
// Load .env first, then disable TLS cert rejection for Windows AV SMTP MITM
require('dotenv').config({ path: path.join(__dirname, '.env') });
if (process.env.EMAIL_TLS_INSECURE !== 'false') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const contentMedia = require('./modules/contentMedia');
const emailService = require('./services/emailService');

const app = express();
const PORT = Number(process.env.PORT || 3080);
const IS_PROD = process.env.NODE_ENV === 'production';
const SESSION_SECRET = process.env.SESSION_SECRET || 'cybermatech-dev-secret-change-me';

const db = new sqlite3.Database('./database/cybermatech.db');

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
    });
}

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        module_name TEXT,
        score INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Static assets only — never expose /views or /content JSON via static
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    dotfiles: 'deny'
}));

app.use(session({
    name: 'cm.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PROD,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

function requireLogin(req, res, next) {
    if (!req.session.user) {
        if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ success: false, message: 'Login required' });
        }
        const nextUrl = encodeURIComponent(req.originalUrl || '/dashboard');
        return res.redirect(`/login?next=${nextUrl}`);
    }
    next();
}

function sendView(res, file) {
    res.sendFile(path.join(__dirname, 'views', file));
}

function sanitizeText(value, max = 80) {
    return String(value || '').trim().slice(0, max);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const loginAttempts = new Map();
function rateLimitLogin(ip) {
    const now = Date.now();
    const row = loginAttempts.get(ip) || { count: 0, reset: now + 15 * 60 * 1000 };
    if (now > row.reset) {
        row.count = 0;
        row.reset = now + 15 * 60 * 1000;
    }
    row.count += 1;
    loginAttempts.set(ip, row);
    return row.count <= 30;
}

// ——— Public pages ———
app.get('/', (req, res) => sendView(res, 'index.html'));

app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    sendView(res, 'login.html');
});

app.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    sendView(res, 'register.html');
});

app.get('/forgot-password', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    sendView(res, 'forgot-password.html');
});

app.get('/reset-password', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    sendView(res, 'reset-password.html');
});

// ——— Member pages (no guest leak) ———
app.get('/dashboard', requireLogin, (req, res) => sendView(res, 'dashboard.html'));
app.get('/training/:module', requireLogin, (req, res) => sendView(res, 'training.html'));
app.get('/certificate', requireLogin, (req, res) => sendView(res, 'certificate.html'));
app.get('/resources', requireLogin, (req, res) => sendView(res, 'resources.html'));

// Block direct probing of other view names
app.get('/views/:file', (req, res) => res.status(404).end());

// ——— Public media config (safe subset only) ———
app.get('/api/public/media', (req, res) => {
    res.json({ success: true, media: contentMedia.publicMediaConfig() });
});

app.get('/api/user-info', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, username: null, member: false });
    }
    res.json({
        success: true,
        member: true,
        username: req.session.user.username,
        email: req.session.user.email
    });
});

// ——— Auth ———
app.post('/api/register', async (req, res) => {
    const username = sanitizeText(req.body.username, 40);
    const email = sanitizeText(req.body.email, 120).toLowerCase();
    const password = String(req.body.password || '');

    if (username.length < 3) {
        return res.json({ success: false, message: 'Username must be at least 3 characters' });
    }
    if (!isValidEmail(email)) {
        return res.json({ success: false, message: 'Enter a valid email' });
    }
    if (password.length < 8) {
        return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await dbRun(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword]
        );
        // Fire-and-forget welcome mail (does not block register if SMTP fails)
        emailService.sendWelcomeEmail(email, username).catch(() => {});
        res.json({ success: true, message: 'Registration successful! You can sign in now.' });
    } catch (err) {
        if (String(err.message || '').includes('UNIQUE')) {
            return res.json({ success: false, message: 'Username or email already exists' });
        }
        console.error('Register error:', err);
        res.json({ success: false, message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!rateLimitLogin(ip)) {
        return res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
    }

    const email = sanitizeText(req.body.email, 120).toLowerCase();
    const password = String(req.body.password || '');

    try {
        const user = await dbGet(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        req.session.regenerate((err) => {
            if (err) {
                console.error('Session regenerate failed:', err);
                return res.json({ success: false, message: 'Could not start session' });
            }
            req.session.user = { id: user.id, username: user.username, email: user.email };
            req.session.save(() => {
                res.json({ success: true, message: 'Login successful!', username: user.username });
            });
        });
    } catch (err) {
        console.error('Login error:', err);
        res.json({ success: false, message: 'Server error' });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!rateLimitLogin(ip)) {
        return res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
    }

    const email = sanitizeText(req.body.email, 120).toLowerCase();
    const generic =
        'If that email is registered, a reset link was sent. Check inbox and spam.';

    if (!isValidEmail(email)) {
        return res.json({ success: false, message: 'Enter a valid email' });
    }

    try {
        const user = await dbGet(`SELECT id, username, email FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.json({ success: true, message: generic });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await dbRun(`UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0`, [user.id]);
        await dbRun(
            `INSERT INTO password_resets (user_id, email, token_hash, expires_at, used) VALUES (?, ?, ?, ?, 0)`,
            [user.id, user.email, tokenHash, expiresAt]
        );

        const resetLink = `${emailService.APP_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
        console.log(`🔑 Password reset link for ${user.email}: ${resetLink}`);

        let mailed = { sent: false, reason: 'email_not_configured' };
        if (emailService.isConfigured()) {
            mailed = await emailService.sendPasswordResetEmail(user.email, user.username, resetLink);
            if (!mailed.sent) {
                console.warn('Forgot-password email not sent:', mailed.reason);
            }
        } else {
            console.warn('Forgot-password email not sent: EMAIL_USER/EMAIL_PASS missing in .env');
        }

        const payload = {
            success: true,
            message: mailed.sent
                ? 'Reset link sent. Check your inbox and spam folder.'
                : 'Email could not be sent (SMTP/TLS). Use the reset link below — it works the same as the email link.',
            email_sent: !!mailed.sent,
            // Always include when mail failed so Desktop users can recover without PowerShell.
            reset_link: mailed.sent ? undefined : resetLink,
            // Keep legacy key used by older frontend builds.
            dev_reset_link: mailed.sent ? undefined : resetLink
        };
        return res.json(payload);
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const email = sanitizeText(req.body.email, 120).toLowerCase();
    const token = String(req.body.token || '').trim();
    const password = String(req.body.password || '');

    if (!isValidEmail(email) || !token) {
        return res.json({ success: false, message: 'Invalid reset request' });
    }
    if (password.length < 8) {
        return res.json({ success: false, message: 'Password must be at least 8 characters' });
    }

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const row = await dbGet(
            `SELECT * FROM password_resets WHERE email = ? AND token_hash = ? AND used = 0 ORDER BY id DESC LIMIT 1`,
            [email, tokenHash]
        );
        if (!row) {
            return res.json({ success: false, message: 'Reset link is invalid or already used' });
        }
        if (new Date(row.expires_at).getTime() < Date.now()) {
            return res.json({ success: false, message: 'Reset link has expired. Request a new one.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        await dbRun(`UPDATE users SET password = ? WHERE id = ?`, [hashed, row.user_id]);
        await dbRun(`UPDATE password_resets SET used = 1 WHERE id = ?`, [row.id]);
        await dbRun(`UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0`, [row.user_id]);

        return res.json({ success: true, message: 'Password updated. You can sign in now.' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('cm.sid');
        res.redirect('/');
    });
});

// ——— Member APIs ———
app.get('/api/media', requireLogin, (req, res) => {
    res.json({ success: true, media: contentMedia.memberMediaConfig() });
});

app.get('/api/modules', requireLogin, (req, res) => {
    res.json({ success: true, ...contentMedia.listModulesPublic() });
});

app.get('/api/modules/:id/quiz', requireLogin, (req, res) => {
    const quiz = contentMedia.getQuizForClient(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Module not found' });
    // Bind quiz token to session so submit cannot spoof another module easily
    const token = crypto.randomBytes(12).toString('hex');
    req.session.activeQuiz = {
        token,
        moduleId: quiz.id,
        startedAt: Date.now()
    };
    res.json({ success: true, quizToken: token, quiz });
});

app.post('/api/modules/:id/submit', requireLogin, async (req, res) => {
    const moduleId = req.params.id;
    const { answers, quizToken } = req.body || {};
    const active = req.session.activeQuiz;

    if (!active || active.moduleId !== moduleId || active.token !== quizToken) {
        return res.status(403).json({ success: false, message: 'Invalid or expired quiz session. Reload the module.' });
    }

    const result = contentMedia.scoreQuiz(moduleId, answers);
    if (!result) return res.status(404).json({ success: false, message: 'Module not found' });

    try {
        await dbRun(
            `INSERT INTO quiz_scores (user_id, module_name, score) VALUES (?, ?, ?)`,
            [req.session.user.id, moduleId, result.score]
        );
    } catch (err) {
        console.error('Score save failed:', err);
    }

    delete req.session.activeQuiz;

    res.json({
        success: true,
        ...result,
        username: req.session.user.username
    });
});

app.get('/api/progress', requireLogin, async (req, res) => {
    try {
        const scores = await dbAll(
            `SELECT module_name, score, completed_at FROM quiz_scores WHERE user_id = ? ORDER BY completed_at DESC`,
            [req.session.user.id]
        );
        const best = {};
        for (const row of scores) {
            if (best[row.module_name] == null || row.score > best[row.module_name]) {
                best[row.module_name] = row.score;
            }
        }
        res.json({ success: true, scores, best });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Could not load progress' });
    }
});

// Legacy save endpoint kept but gated + validated
app.post('/api/save-score', requireLogin, async (req, res) => {
    res.status(410).json({
        success: false,
        message: 'Use /api/modules/:id/submit — client-side scoring is disabled.'
    });
});

app.get('/api/health', async (req, res) => {
    res.json({
        ok: true,
        service: 'Cybermatech',
        modules: contentMedia.listModulesPublic().modules.length,
        email: emailService.isConfigured() ? 'configured' : 'not_configured',
        time: new Date().toISOString()
    });
});

app.get('/api/email-status', requireLogin, async (req, res) => {
    let ready = false;
    if (emailService.isConfigured()) {
        ready = await emailService.ensureReady();
    }
    res.json({ success: true, ...emailService.getStatus(), ready });
});

app.post('/api/email-test', requireLogin, async (req, res) => {
    const to = sanitizeText(req.body?.to || req.session.user.email, 120).toLowerCase();
    if (!isValidEmail(to)) {
        return res.json({ success: false, message: 'Valid email required' });
    }
    const result = await emailService.sendTestEmail(to);
    res.json({
        success: result.sent,
        ...result,
        status: emailService.getStatus()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    const catalog = contentMedia.listModulesPublic();
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   TRIBAMS / Cybermatech                  ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`Server URL:  http://127.0.0.1:${PORT}`);
    console.log(`Also try:    http://localhost:${PORT}`);
    console.log(`Database:    SQLite (database/cybermatech.db)`);
    console.log(`Modules:     ${catalog.modules.length} (edit content/modules.json)`);
    console.log(`Health:      /api/health`);
    if (emailService.isConfigured()) {
        console.log('Email:       SMTP configured');
        emailService.ensureReady().catch(() => {});
    } else {
        console.log('Email:       not configured — set EMAIL_USER / EMAIL_PASS in .env');
        console.log('             or run: node scripts/apply-email-fix.js');
    }
    console.log('');
});
