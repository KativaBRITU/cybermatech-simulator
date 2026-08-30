// ============================================================
// TRIBAMS – PRODUCTION READY SERVER v14.1 (STABLE)
// ============================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// SMTP TLS (Windows AV MITM) is scoped inside services/emailService.js — never disable global TLS here.

const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const marked = require('marked');
const assessmentEngine = require('./modules/assessmentEngine');
const contentLibrary = require('./modules/contentLibrary');
const progressGate = require('./modules/progressGate');
const trainingPhases = require('./modules/trainingPhases');
const newsFeed = require('./modules/newsFeed');
const accessControl = require('./modules/accessControl');
const matteK = require('./modules/matteK');
const accountPrivacy = require('./modules/accountPrivacy');
const security = require('./modules/securityHardening');
const { ATTACKER_TOOLKIT_MODULES } = require('./modules/attackerToolkitModules');
const { SPECIAL_OPS_MODULES } = require('./modules/specialOpsModules');
const { createDatabase } = require('./modules/database');
const { initSchema } = require('./modules/schema');
const labEngine = require('./modules/labEngine');
const labVersioning = require('./modules/labVersioning');
const readinessTranscript = require('./modules/readinessTranscript');
const marketSignals = require('./modules/marketSignals');
const paypalCheckout = require('./modules/paypalCheckout');
const orgService = require('./modules/orgService');
const pricingCatalog = require('./modules/pricingCatalog');
const progressiveContent = require('./modules/progressiveContent');
const essayLearning = require('./modules/essayLearning');
const contentRefresh = require('./modules/contentRefresh');
const quizSecurity = require('./modules/quizSecurity');
const moduleDefinitions = require('./modules/moduleDefinitions');
const { seedFounderNews } = require('./modules/seedFounderNews');

// ============================================================
// APP INITIALIZATION & CONSTANTS
// ============================================================
const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Trust reverse proxy (Cloudflare / nginx / Tunnel). Set TRUST_PROXY=2 if double-proxied.
app.set('trust proxy', Number(process.env.TRUST_PROXY) > 0 ? Number(process.env.TRUST_PROXY) : 1);
app.disable('x-powered-by');

// Apex → www (phones/bookmarks often open tribams.com without www).
app.use((req, res, next) => {
    const host = String(req.hostname || req.headers.host || '').split(':')[0].toLowerCase();
    if (host === 'tribams.com') {
        return res.redirect(301, `https://www.tribams.com${req.originalUrl || '/'}`);
    }
    return next();
});

// Persistent Session Secret Fallback
const envSessionSecret = String(process.env.SESSION_SECRET || '').trim();
let SESSION_SECRET = envSessionSecret || null;
if (!SESSION_SECRET) {
    const secretPath = path.join(__dirname, 'database', '.session_secret');
    if (fs.existsSync(secretPath)) {
        SESSION_SECRET = fs.readFileSync(secretPath, 'utf8').trim();
    } else {
        SESSION_SECRET = crypto.randomBytes(64).toString('hex');
        try {
            if (!fs.existsSync(path.join(__dirname, 'database'))) {
                fs.mkdirSync(path.join(__dirname, 'database'), { recursive: true });
            }
            fs.writeFileSync(secretPath, SESSION_SECRET, 'utf8');
        } catch (e) {
            console.warn('⚠️ Could not write session secret to file:', e.message);
        }
    }
}

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    : [];

/** Paths that must never be served statically and must require an admin session. */
function isAdminOrOpsPath(p) {
    const pathName = String(p || '').split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
    return (
        pathName === '/admin' ||
        pathName.startsWith('/admin/') ||
        pathName === '/admin.html' ||
        pathName === '/admin-labs.html' ||
        pathName.endsWith('/admin.html') ||
        pathName.endsWith('/admin-labs.html') ||
        pathName === '/test' ||
        pathName === '/test.html' ||
        pathName === '/launch-readiness' ||
        pathName.startsWith('/api/admin') ||
        pathName === '/api/launch-readiness' ||
        pathName === '/api/email-status' ||
        pathName === '/api/content-freshness'
    );
}

// ============================================================
// CREATE DIRECTORIES
// ============================================================
const databaseDir = path.join(__dirname, 'database');
const sessionsDir = path.join(__dirname, 'database', 'sessions');
const uploadDir = path.join(__dirname, 'public', 'uploads', 'profiles');
const newsUploadDir = path.join(__dirname, 'public', 'uploads', 'news');

[databaseDir, sessionsDir, uploadDir, newsUploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ============================================================
// MULTER STORAGE CONFIGURATION
// ============================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const rawExt = (path.extname(file.originalname) || '.jpg').toLowerCase();
        const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(rawExt) ? rawExt : '.jpg';
        const uniqueName = `${req.session.user ? req.session.user.id : 'anon'}_${Date.now()}${safeExt}`;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
        if (allowed.has(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, GIF, and WEBP images are allowed.'));
    }
});

const profileUpload = upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]);

function profileUploadMiddleware(req, res, next) {
    profileUpload(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'Image must be 5MB or smaller.' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
        }
        return res.status(400).json({ success: false, message: err.message || 'Invalid image file' });
    });
}

function pickUploadedProfileFile(req) {
    return req.files?.profile_picture?.[0] || req.files?.profilePicture?.[0] || null;
}

const newsStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, newsUploadDir),
    filename: (req, file, cb) => {
        const rawExt = (path.extname(file.originalname) || '.jpg').toLowerCase();
        const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(rawExt) ? rawExt : '.jpg';
        cb(null, `news_${Date.now()}${safeExt}`);
    }
});
const newsUpload = multer({
    storage: newsStorage,
    limits: { fileSize: 4 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
        if (allowed.has(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, GIF, and WEBP images are allowed.'));
    }
});
function newsUploadMiddleware(req, res, next) {
    newsUpload.single('image')(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'Image must be 4MB or smaller.' });
        }
        return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    });
}

function publicProfileUrl(storedPath) {
    if (!storedPath) return null;
    const p = String(storedPath).startsWith('/') ? storedPath : `/${storedPath}`;
    return p;
}

/** Normalize DB timestamps for the browser (SQLite often returns "YYYY-MM-DD HH:MM:SS"). */
function toIsoDate(value) {
    if (value == null || value === '') return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
    }
    const raw = String(value).trim();
    if (!raw) return null;
    const normalized = /^\d{4}-\d{2}-\d{2} /.test(raw) ? raw.replace(' ', 'T') : raw;
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) {
        const fallback = new Date(raw.replace(' ', 'T') + 'Z');
        return Number.isNaN(fallback.getTime()) ? null : fallback.toISOString();
    }
    return d.toISOString();
}

async function removeStoredProfileFile(storedPath) {
    if (!storedPath) return;
    try {
        const rel = String(storedPath).replace(/^\/+/, '');
        const full = path.join(__dirname, 'public', rel);
        if (full.startsWith(path.join(__dirname, 'public', 'uploads', 'profiles')) && fs.existsSync(full)) {
            fs.unlinkSync(full);
        }
    } catch (_) { /* ignore cleanup errors */ }
}
// ============================================================
// DATABASE CONNECTION (SQLite default | PostgreSQL via DATABASE_URL)
// Assigned in startServer() so DEMO_SQLITE_FALLBACK can probe Postgres first.
// ============================================================
let db;
let serverInitComplete = false;

async function initDatabase() {
    await initSchema(db);
}

// ============================================================
// SEED MODULE DATA
// ============================================================
const MODULES = [
    { id: 1, name: 'Phishing Detection', icon_key: 'phishing', category: 'social-engineering', difficulty: 'easy' },
    { id: 2, name: 'Malware Analysis', icon_key: 'malware', category: 'malware', difficulty: 'medium' },
    { id: 3, name: 'Network Security', icon_key: 'network', category: 'network', difficulty: 'medium' },
    { id: 4, name: 'Cloud Security', icon_key: 'cloud', category: 'cloud', difficulty: 'medium' },
    { id: 5, name: 'Mobile Security', icon_key: 'mobile', category: 'network', difficulty: 'easy' },
    { id: 6, name: 'IoT Security', icon_key: 'iot', category: 'network', difficulty: 'medium' },
    { id: 7, name: 'Social Engineering', icon_key: 'social', category: 'social-engineering', difficulty: 'easy' },
    { id: 8, name: 'Incident Response', icon_key: 'incident', category: 'forensics', difficulty: 'medium' },
    { id: 9, name: 'Security Compliance', icon_key: 'compliance', category: 'governance', difficulty: 'easy' },
    { id: 10, name: 'Ethical Hacking', icon_key: 'ethical', category: 'social-engineering', difficulty: 'hard' },
    { id: 11, name: 'Ransomware Defense', icon_key: 'ransomware', category: 'malware', difficulty: 'medium' },
    { id: 12, name: 'Data Privacy (GDPR)', icon_key: 'privacy', category: 'governance', difficulty: 'easy' },
    { id: 13, name: 'Wireless Security', icon_key: 'wireless', category: 'network', difficulty: 'medium' },
    { id: 14, name: 'Database Security', icon_key: 'database', category: 'malware', difficulty: 'medium' },
    { id: 15, name: 'DevSecOps', icon_key: 'devops', category: 'cloud', difficulty: 'hard' },
    { id: 16, name: 'Digital Forensics', icon_key: 'forensic', category: 'forensics', difficulty: 'hard' },
    { id: 17, name: 'Threat Intelligence', icon_key: 'threat', category: 'forensics', difficulty: 'medium' },
    { id: 18, name: 'Security Operations (SOC)', icon_key: 'soc', category: 'forensics', difficulty: 'medium' },
    { id: 19, name: 'Identity & Access Management', icon_key: 'iam', category: 'network', difficulty: 'easy' },
    { id: 20, name: 'Cryptography', icon_key: 'crypto', category: 'network', difficulty: 'hard' },
    { id: 21, name: 'Zero Trust Architecture', icon_key: 'zerotrust', category: 'network', difficulty: 'hard' },
    { id: 22, name: 'Supply Chain Security', icon_key: 'supply', category: 'governance', difficulty: 'medium' },
    { id: 23, name: 'API Security', icon_key: 'api', category: 'malware', difficulty: 'medium' },
    { id: 24, name: 'Container Security', icon_key: 'container', category: 'cloud', difficulty: 'medium' },
    { id: 25, name: 'Kubernetes Security', icon_key: 'kubernetes', category: 'cloud', difficulty: 'hard' },
    { id: 26, name: 'Serverless Security', icon_key: 'serverless', category: 'cloud', difficulty: 'medium' },
    { id: 27, name: 'AI & Machine Learning Security', icon_key: 'ai', category: 'emerging', difficulty: 'hard' },
    { id: 28, name: 'Quantum Computing Threats', icon_key: 'quantum', category: 'emerging', difficulty: 'hard' },
    { id: 29, name: 'Blockchain Security', icon_key: 'blockchain', category: 'emerging', difficulty: 'medium' },
    { id: 30, name: 'OT/ICS Security', icon_key: 'ot', category: 'emerging', difficulty: 'hard' },
    { id: 31, name: 'Healthcare Security (HIPAA)', icon_key: 'healthcare', category: 'governance', difficulty: 'easy' },
    { id: 32, name: 'Financial Security (PCI-DSS)', icon_key: 'financial', category: 'governance', difficulty: 'easy' },
    { id: 33, name: 'E-Commerce Security', icon_key: 'ecommerce', category: 'governance', difficulty: 'easy' },
    { id: 34, name: 'Insider Threat Detection', icon_key: 'insider', category: 'social-engineering', difficulty: 'medium' },
    { id: 35, name: 'Physical Security Integration', icon_key: 'physical', category: 'governance', difficulty: 'easy' },
    { id: 36, name: 'Disaster Recovery & BCP', icon_key: 'disaster', category: 'governance', difficulty: 'easy' },
    { id: 37, name: 'Security Awareness Training', icon_key: 'awareness', category: 'social-engineering', difficulty: 'easy' },
    { id: 38, name: 'Risk Management', icon_key: 'risk', category: 'governance', difficulty: 'easy' },
    { id: 39, name: 'Vulnerability Management', icon_key: 'vuln', category: 'malware', difficulty: 'medium' },
    { id: 40, name: 'Penetration Testing', icon_key: 'pentest', category: 'social-engineering', difficulty: 'hard' },
    { id: 41, name: 'Red Team / Blue Team', icon_key: 'redblue', category: 'social-engineering', difficulty: 'hard' },
    { id: 42, name: 'Cybersecurity Frameworks', icon_key: 'frameworks', category: 'governance', difficulty: 'easy' },
    { id: 43, name: 'Cloud Forensics', icon_key: 'cloudforensic', category: 'forensics', difficulty: 'hard' },
    { id: 44, name: 'Mobile Forensics', icon_key: 'mobileforensic', category: 'forensics', difficulty: 'hard' },
    { id: 45, name: 'Cyber Law & Ethics', icon_key: 'cyberlaw', category: 'governance', difficulty: 'easy' },
    ...ATTACKER_TOOLKIT_MODULES,
    ...SPECIAL_OPS_MODULES
];

async function seedModules() {
    console.log(`📚 Seeding ${MODULES.length} modules...`);
    for (const m of MODULES) {
        await db.runAsync(
            `INSERT OR IGNORE INTO modules (id, name, icon_key, category, difficulty)
             VALUES (?, ?, ?, ?, ?)`,
            [m.id, m.name, m.icon_key, m.category, m.difficulty]
        );
        // Keep names/categories fresh when we expand the catalog
        await db.runAsync(
            `UPDATE modules SET name = ?, icon_key = ?, category = ?, difficulty = ? WHERE id = ?`,
            [m.name, m.icon_key, m.category, m.difficulty, m.id]
        );
    }
    console.log(`✅ ${MODULES.length} Modules seeded`);
}

/** Live catalog from DB so added modules auto-update the 65% gate math */
async function getActiveModules() {
    const byId = new Map(MODULES.map((m) => [m.id, m]));
    try {
        const rows = await db.allAsync(
            'SELECT id, name, icon_key, category, difficulty FROM modules ORDER BY id ASC'
        );
        if (rows && rows.length) {
            // Merge in-memory flags (special_ops, requires_rank, access_tier) lost in DB columns
            return rows.map((row) => {
                const meta = byId.get(row.id) || {};
                return {
                    ...row,
                    access_tier: meta.access_tier,
                    requires_rank: meta.requires_rank,
                    special_ops: !!meta.special_ops,
                    badge_label: meta.badge_label,
                    description: meta.description
                };
            });
        }
    } catch (e) {
        console.warn('getActiveModules fallback to MODULES:', e.message);
    }
    return MODULES;
}

async function loadUserScores(userId) {
    return db.allAsync(
        `SELECT id, module_name, score, time_taken, total_time_limit, difficulty, completed_at
         FROM quiz_scores WHERE user_id = ? ORDER BY datetime(completed_at) ASC, id ASC`,
        [userId]
    );
}

async function seedModuleContents() {
    console.log('📚 Seeding enriched module study guides...');

    for (const module of MODULES) {
        const id = module.id;
        const guide = contentLibrary.buildStudyGuide(module);
        const existing = await db.getAsync(
            'SELECT id, content_refreshed_at FROM module_contents WHERE module_id = ?',
            [id]
        );

        if (existing) {
            // Preserve quarterly refresh banks; refresh base study guide text only
            await db.runAsync(
                `UPDATE module_contents SET content = ?, resources = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE module_id = ?`,
                [guide.content, JSON.stringify(guide.resources), id]
            );
            if (!existing.content_refreshed_at) {
                await db.runAsync(
                    `UPDATE module_contents SET essay_questions = ?, updated_at = CURRENT_TIMESTAMP
                     WHERE module_id = ?`,
                    [JSON.stringify(guide.essayQuestions), id]
                );
            }
            continue;
        }

        await db.runAsync(
            `INSERT INTO module_contents (module_id, content, resources, essay_questions)
             VALUES (?, ?, ?, ?)`,
            [id, guide.content, JSON.stringify(guide.resources), JSON.stringify(guide.essayQuestions)]
        );
    }
    console.log('✅ Enriched study guides seeded (NIST/CISA/OWASP/MITRE references included)');
}

// ============================================================
// MIDDLEWARE CONFIGURATION
// ============================================================
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            // Helmet defaults set script-src-attr 'none', which silently blocks
            // onclick/onchange on admin (and other) pages. Allow attrs + prefer
            // event-delegation in new UI code.
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            // Dev debug ingest (session 19b11a) — never relied on in production CSP.
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            // Do not force HTTPS upgrades on this laptop origin (http://127.0.0.1).
            // Tunnel/HTTPS already uses https; upgrade-insecure-requests would break local login.
            upgradeInsecureRequests: null
        }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
const publicStatic = express.static(path.join(__dirname, 'public'), {
    dotfiles: 'deny',
    index: false,
    maxAge: IS_PROD ? '1d' : 0
});
// Never let public/ bypass auth for admin/ops HTML (e.g. public/admin.html).
app.use((req, res, next) => {
    if (isAdminOrOpsPath(req.path)) return next();
    return publicStatic(req, res, next);
});

// Security Step 2 — route-scoped rate limiter
const rateLimiter = (max, windowMs, bucket) => security.rateLimiter(max, windowMs, bucket);

// Session store — prefer MemoryStore for single-instance containers behind Cloudflare.
// FileStore needs a persistent volume; set SESSION_STORE=file when the volume exists.
const sessionStoreMode = String(process.env.SESSION_STORE || 'memory').toLowerCase();
let sessionStore;
if (sessionStoreMode === 'file') {
    sessionStore = new FileStore({
        path: sessionsDir,
        ttl: 86400,
        reapInterval: 3600,
        retries: 5
    });
    console.log('📦 Session store: FileStore (database/sessions)');
} else {
    const MemoryStore = require('memorystore')(session);
    sessionStore = new MemoryStore({ checkPeriod: 24 * 60 * 60 * 1000 });
    console.log('📦 Session store: MemoryStore (set SESSION_STORE=file for persistent file sessions)');
}

// Deployment security gate (Step 1)
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    console.warn('⚠️ SESSION_SECRET is weak/short. Use a 64+ char random secret before production deploy.');
}
if (IS_PROD && (!envSessionSecret || envSessionSecret.length < 32)) {
    console.error('❌ Refusing to start in production: SESSION_SECRET must be set in host env (Railway Variables), 32+ chars.');
    console.error(`   Detected SESSION_SECRET from environment: ${envSessionSecret ? envSessionSecret.length + ' chars' : 'missing'}`);
    process.exit(1);
}

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    name: 'tribams.sid',
    proxy: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        // 'auto': Secure on HTTPS (tunnel / tribams.com), not on http://localhost
        secure: 'auto',
        httpOnly: true,
        path: '/',
        // lax (not strict): PayPal/OAuth top-level returns must keep the session behind Cloudflare
        sameSite: 'lax'
    }
}));

// Sensitive API responses should not be cached by browsers/CDNs (Cloudflare must bypass /api)
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('CDN-Cache-Control', 'no-store');
    next();
});

// Member / auth HTML must not be edge-cached when Cloudflare is proxied
app.use((req, res, next) => {
    const p = req.path || '';
    if (
        p.startsWith('/api') ||
        p.startsWith('/dashboard') ||
        p.startsWith('/training') ||
        p.startsWith('/lab') ||
        p.startsWith('/payment') ||
        p.startsWith('/resource') ||
        p.startsWith('/scenario') ||
        p.startsWith('/organization') ||
        p.startsWith('/profile') ||
        p.startsWith('/admin') ||
        p === '/admin.html' ||
        p === '/test' ||
        p === '/test.html' ||
        p === '/launch-readiness' ||
        p === '/login' ||
        p === '/register' ||
        p === '/forgot-password' ||
        p === '/reset-password'
    ) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('CDN-Cache-Control', 'no-store');
    }
    next();
});

// Belt-and-suspenders: every admin/ops URL requires a logged-in admin (HTML → /login).
app.use((req, res, next) => {
    if (!isAdminOrOpsPath(req.path)) return next();
    return isAdmin(req, res, next);
});

// ============================================================
// PROCESS MONITOR — inbound / outbound activity
// ============================================================
async function logProcess(entry) {
    try {
        await db.runAsync(
            `INSERT INTO process_monitor
             (direction, process_type, method, path, status_code, ip, user_id, username, details)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                entry.direction || 'inbound',
                entry.process_type || 'http',
                entry.method || null,
                entry.path || null,
                entry.status_code || null,
                entry.ip || null,
                entry.user_id || null,
                entry.username || null,
                typeof entry.details === 'string' ? entry.details : JSON.stringify(entry.details || {})
            ]
        );
    } catch (e) {
        // never break requests because of monitoring
    }
}

function logOutbound(processType, details = {}) {
    logProcess({
        direction: 'outbound',
        process_type: processType,
        method: details.method || 'EXTERNAL',
        path: details.target || details.path || processType,
        status_code: details.status_code || null,
        user_id: details.user_id || null,
        username: details.username || null,
        details
    });
}

app.use((req, res, next) => {
    // Skip noisy static assets
    if (/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?|map)$/i.test(req.path)) return next();
    const start = Date.now();
    res.on('finish', () => {
        const interesting =
            req.path.startsWith('/api/') ||
            req.path.startsWith('/admin') ||
            req.path.startsWith('/training') ||
            req.path.startsWith('/skill-assessment') ||
            req.path.startsWith('/scenario') ||
            req.path.startsWith('/lab') ||
            req.path.startsWith('/verify-readiness') ||
            req.path.startsWith('/dashboard') ||
            req.path.startsWith('/login') ||
            req.path.startsWith('/register') ||
            req.method !== 'GET';
        if (!interesting) return;
        logProcess({
            direction: 'inbound',
            process_type: req.path.startsWith('/api/') ? 'api' : 'page',
            method: req.method,
            path: req.originalUrl || req.path,
            status_code: res.statusCode,
            ip: req.ip || req.socket.remoteAddress,
            user_id: req.session?.user?.id || null,
            username: req.session?.user?.username || null,
            details: { duration_ms: Date.now() - start, referer: req.get('referer') || null }
        });
    });
    next();
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function generateCertificateId() {
    return 'TRI-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function publicCertificatePayload(cert) {
    if (!cert) return null;
    const base = String(process.env.APP_BASE_URL || 'https://tribams.com').replace(/\/$/, '');
    const isProgram = cert.module_name === trainingPhases.PROGRAM_CERTIFICATE_NAME;
    return {
        certificate_id: cert.certificate_id,
        recipient_name: cert.recipient_name,
        module_name: cert.module_name,
        program_certificate: isProgram,
        credential_title: isProgram ? 'Certificate of Training Completion' : 'Certificate of Achievement',
        score: cert.score,
        issue_date: cert.issue_date,
        account_bound: cert.user_id != null && cert.user_id !== '',
        verify_url: `${base}/verify?id=${encodeURIComponent(cert.certificate_id)}`
    };
}

async function getUserIntegrityStatus(userId) {
    try {
        const row = await db.getAsync(
            'SELECT status FROM quiz_integrity WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        return row?.status || 'clear';
    } catch {
        return 'clear';
    }
}

async function issueProgramCertificateIfEligible(userId, { progress, integrityStatus, createdAt, essayBlocksPass = false }) {
    const certGate = trainingPhases.canIssueProgramCertificate({
        createdAt,
        integrityStatus,
        progress,
        essayBlocksPass
    });
    if (!certGate.ok) {
        return { certificate: null, certificate_hold: certGate.reason };
    }

    const existing = await db.getAsync(
        'SELECT certificate_id FROM certificates WHERE user_id = ? AND module_name = ?',
        [userId, trainingPhases.PROGRAM_CERTIFICATE_NAME]
    );
    if (existing) {
        return { certificate: existing.certificate_id, certificate_hold: null };
    }

    const certId = generateCertificateId();
    const user = await db.getAsync('SELECT username, email FROM users WHERE id = ?', [userId]);
    const programScore = progress?.average_score || 0;
    await db.runAsync(
        'INSERT INTO certificates (certificate_id, user_id, recipient_name, module_name, score) VALUES (?, ?, ?, ?, ?)',
        [certId, userId, user.username, trainingPhases.PROGRAM_CERTIFICATE_NAME, programScore]
    );

    try {
        const emailService = require('./services/emailService');
        if (emailService.isConfigured() && user.email) {
            emailService
                .sendCertificateEmail(user.email, user.username, trainingPhases.PROGRAM_CERTIFICATE_NAME, programScore, certId)
                .catch(() => {});
        }
    } catch (_) { /* email optional */ }

    return { certificate: certId, certificate_hold: null };
}

function filterProgramCertificates(certs = []) {
    return (certs || []).filter((c) => c.module_name === trainingPhases.PROGRAM_CERTIFICATE_NAME);
}

function safeNextPath(raw, fallback = '/dashboard') {
    try {
        const decoded = decodeURIComponent(String(raw || '')).trim();
        if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\')) {
            return fallback;
        }
        if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return fallback;
        const pathOnly = decoded.split('?')[0];
        if (pathOnly === '/login' || pathOnly === '/register' || pathOnly === '/logout') {
            return fallback;
        }
        return decoded;
    } catch (_) {
        return fallback;
    }
}

function wantsJson(req) {
    const p = String(req.path || '');
    if (p.startsWith('/api/')) return true;
    const accept = String(req.get('accept') || '').toLowerCase();
    if (accept.includes('text/html')) return false;
    const xhr = String(req.get('x-requested-with') || '').toLowerCase();
    if (xhr === 'xmlhttprequest') return true;
    return accept.includes('application/json');
}

function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Login required' });
        }
        const nextUrl = encodeURIComponent(safeNextPath(req.originalUrl || req.path, '/dashboard'));
        return res.redirect(`/login?next=${nextUrl}`);
    }
    return next();
}

function userIsAdmin(user) {
    return accessControl.isAdminEmail(user && user.email, ADMIN_EMAILS);
}

function isAdmin(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('CDN-Cache-Control', 'no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');

    if (!req.session || !req.session.user) {
        if (wantsJson(req)) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        const nextUrl = encodeURIComponent(safeNextPath(req.originalUrl || req.path, '/admin'));
        return res.redirect(`/login?next=${nextUrl}`);
    }
    if (!userIsAdmin(req.session.user)) {
        if (wantsJson(req)) {
            return res.status(403).json({ success: false, message: 'Admin authorization required.' });
        }
        return res.redirect('/login');
    }
    return next();
}

function sendView(res, fileName) {
    const fullPath = path.join(__dirname, 'views', fileName);
    fs.readFile(fullPath, 'utf8', (err, html) => {
        if (err) return res.status(404).send('Page Not Found');
        // Keep cinematic/dark marketing pages free of the light app theme —
        // inject marketing-visibility instead for readable contrast
        const skipTheme = new Set([
            'index.html', 'about.html', 'login.html', 'register.html',
            'forgot-password.html', 'reset-password.html', 'terms.html', 'privacy.html',
            'cookies.html', 'teams.html', 'news.html'
        ]);
        if (skipTheme.has(fileName)) {
            if (!html.includes('/css/marketing-visibility.css')) {
                html = html.replace(
                    /<\/head>/i,
                    '    <link rel="stylesheet" href="/css/marketing-visibility.css">\n</head>'
                );
            }
        } else if (!html.includes('/css/educational-theme.css')) {
            html = html.replace(
                /<\/head>/i,
                '    <link rel="stylesheet" href="/css/educational-theme.css">\n</head>'
            );
        }
        if (!html.includes('/css/tribams-brand.css')) {
            html = html.replace(
                /<\/head>/i,
                '    <link rel="stylesheet" href="/css/tribams-brand.css">\n    <link rel="icon" href="/brand/tribams-mark.svg" type="image/svg+xml">\n</head>'
            );
        }
        if (!html.includes('/js/tribams-brand.js')) {
            html = html.replace(
                /<\/body>/i,
                '    <script src="/js/tribams-brand.js" defer></script>\n</body>'
            );
        }
        // Matte K — available outside exams only (never on training / assessment / scenario)
        const matteBlocked = new Set([
            'training.html', 'skill-assessment.html', 'scenario.html',
            'custom-training.html', 'review.html', 'lab.html'
        ]);
        // Public marketing pages (except homepage) stay Matte-free
        const matteMarketingBlocked = new Set([
            'about.html', 'contact.html', 'login.html', 'register.html',
            'forgot-password.html', 'reset-password.html', 'terms.html', 'privacy.html',
            'cookies.html', '404.html'
        ]);
        const matteAllowed = new Set([
            'index.html', // landing — Matte K visible to guests + members
            'dashboard.html', 'resource-center.html', 'resources.html', 'payment.html',
            'health-check.html', 'leaderboard.html', 'badges.html',
            'profile.html', 'verify.html', 'verify-readiness.html',
            'organization.html'
        ]);
        const req = res.req;
        const isGuest = !(req && req.session && req.session.user);
        const injectMatte =
            !matteBlocked.has(fileName) &&
            !matteMarketingBlocked.has(fileName) &&
            matteAllowed.has(fileName) &&
            !html.includes('matte-k.js') &&
            (fileName === 'index.html' || !isGuest);
        if (injectMatte) {
            html = html.replace(
                /<\/head>/i,
                '    <link rel="stylesheet" href="/css/matte-k.css">\n</head>'
            );
            html = html.replace(
                /<\/body>/i,
                '    <script src="/js/matte-k.js" defer></script>\n</body>'
            );
        }
        // Guest/member nav toggles — safe no-op when page has no data-auth attrs
        if (!html.includes('auth-nav.js')) {
            html = html.replace(
                /<\/body>/i,
                '    <script src="/js/auth-nav.js" defer></script>\n</body>'
            );
        }
        res.type('html').send(html);
    });
}

function generateModuleQuestions(moduleId, difficulty = 'medium', limit = 10, options = {}) {
    const module = MODULES.find(m => m.id === moduleId) || {
        id: moduleId,
        name: 'Cybersecurity',
        category: 'network',
        difficulty: difficulty || 'medium'
    };
    return assessmentEngine.generateModuleQuestions(module, difficulty || module.difficulty, limit, options);
}

function mergeQuestionsToLimit(primary, fallback, limit) {
    const floor = assessmentEngine.DRILL_COUNTS?.quizMin || assessmentEngine.DRILL_COUNTS?.quiz || 16;
    const target = Math.max(floor, parseInt(limit, 10) || floor);
    const out = [];
    const used = new Set();
    const pushAll = (qs) => {
        for (const q of qs || []) {
            if (out.length >= target) return;
            if (!q || !q.question || !Array.isArray(q.options)) continue;
            const key = String(q.question).slice(0, 90);
            if (used.has(key)) continue;
            used.add(key);
            out.push({ ...q, id: out.length + 1 });
        }
    };
    pushAll(primary?.questions);
    pushAll(fallback?.questions);
    const base = fallback || primary || { questions: [] };
    const timeLimit = Math.max(
        Number(primary?.timeLimit) || 0,
        Number(fallback?.timeLimit) || 0,
        Math.max(180, out.length * 32)
    );
    return {
        ...base,
        questions: out,
        totalQuestions: out.length,
        timeLimit
    };
}

async function loadRefreshedQuestionDrill(moduleId, mode, difficulty, limit, rank, sessionSeed) {
    try {
        const col = mode === 'practice' ? 'practice_bank' : 'quiz_bank';
        const row = await db.getAsync(
            `SELECT ${col} AS bank, content_refreshed_at FROM module_contents WHERE module_id = ?`,
            [moduleId]
        );
        if (!row?.bank || !row.content_refreshed_at) return null;
        const bank = JSON.parse(row.bank || '[]');
        const picked = contentRefresh.selectFromBank(bank, limit, difficulty, sessionSeed);
        if (!picked || !picked.questions?.length) return null;
        const module = MODULES.find(m => m.id === moduleId) || { name: 'Module' };
        const immersion = progressiveContent.immersionForRank(rank, module.name);
        return {
            ...picked,
            rank,
            rank_label: immersion.rank_label,
            environment: immersion.environment,
            immersion,
            mode: mode === 'practice' ? 'practice' : 'module_drill'
        };
    } catch (e) {
        console.warn('Refreshed question bank fallback:', e.message);
        return null;
    }
}

async function loadUserCreatedAt(userId) {
    try {
        const row = await db.getAsync('SELECT created_at FROM users WHERE id = ?', [userId]);
        return row && row.created_at ? row.created_at : null;
    } catch (_) {
        return null;
    }
}

async function snapshotProgress(userId, catalog) {
    const scores = await loadUserScores(userId);
    const createdAt = await loadUserCreatedAt(userId);
    return progressGate.getProgressSnapshot(scores, catalog, { createdAt });
}

async function resolveLearnerRank(req) {
    if (!req.session?.user) {
        return { rank: 'beginner', rank_label: 'Recruit', environment: progressiveContent.getEnvironment('beginner').environment, progress: null };
    }
    try {
        const catalog = await getActiveModules();
        const progress = await snapshotProgress(req.session.user.id, catalog);
        const rank = progressiveContent.normalizeRank(progress.overall_level);
        const env = progressiveContent.getEnvironment(rank);
        return {
            rank,
            rank_label: progress.level_label || env.label,
            environment: env.environment,
            progress
        };
    } catch (_) {
        return { rank: 'beginner', rank_label: 'Recruit', environment: progressiveContent.getEnvironment('beginner').environment, progress: null };
    }
}

// ============================================================
// STATIC PAGE ROUTES
// ============================================================
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => sendView(res, 'index.html'));
app.get('/about', (req, res) => sendView(res, 'about.html'));
app.get('/contact', (req, res) => sendView(res, 'contact.html'));
app.get('/login', (req, res) => sendView(res, 'login.html'));
app.get('/register', (req, res) => sendView(res, 'register.html'));
app.get('/forgot-password', (req, res) => sendView(res, 'forgot-password.html'));
app.get('/reset-password', (req, res) => sendView(res, 'reset-password.html'));
app.get('/verify', (req, res) => sendView(res, 'verify.html'));
app.get('/health-check', requireLogin, (req, res) => sendView(res, 'health-check.html'));
app.get('/resource-center', requireLogin, (req, res) => sendView(res, 'resource-center.html'));
app.get('/resources', requireLogin, (req, res) => sendView(res, 'resources.html'));
app.get('/scenario', requireLogin, (req, res) => sendView(res, 'scenario.html'));
app.get('/lab', requireLogin, (req, res) => sendView(res, 'lab.html'));
app.get('/verify-readiness', (req, res) => sendView(res, 'verify-readiness.html'));
app.get('/verify-readiness/:token', (req, res) => sendView(res, 'verify-readiness.html'));
app.get('/review', requireLogin, (req, res) => sendView(res, 'review.html'));
app.get('/certificate', requireLogin, (req, res) => sendView(res, 'certificate.html'));
app.get('/leaderboard', requireLogin, (req, res) => sendView(res, 'leaderboard.html'));
app.get('/badges', requireLogin, (req, res) => sendView(res, 'badges.html'));
app.get('/darkweb', requireLogin, (req, res) => sendView(res, 'darkweb.html'));
app.get('/payment', (req, res) => sendView(res, 'payment.html'));
app.get('/teams', (req, res) => sendView(res, 'teams.html'));
app.get('/for-teams', (req, res) => res.redirect('/teams'));
app.get('/payment-success', (req, res) => sendView(res, 'payment-success.html'));
app.get('/payment-cancel', (req, res) => sendView(res, 'payment-cancel.html'));
app.get('/organization', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendView(res, 'organization.html');
});
app.get('/custom-training/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendView(res, 'custom-training.html');
});
app.get('/terms', (req, res) => sendView(res, 'terms.html'));
app.get('/privacy', (req, res) => sendView(res, 'privacy.html'));
app.get('/cookies', (req, res) => sendView(res, 'cookies.html'));

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendView(res, 'dashboard.html');
});

app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendView(res, 'profile.html');
});

app.get('/training/:module', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const moduleId = parseInt(req.params.module, 10);
    if (Number.isFinite(moduleId)) {
        const user = await getAccessUser(req);
        const check = accessControl.canAccessModule(moduleId, user, ADMIN_EMAILS);
        if (!check.allowed) {
            return res.redirect(`/payment?locked=${moduleId}&reason=paid`);
        }
    }
    sendView(res, 'training.html');
});

app.get('/module/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const moduleId = parseInt(req.params.id);
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return res.redirect('/resource-center');
    const user = await getAccessUser(req);
    const check = accessControl.canAccessModule(moduleId, user, ADMIN_EMAILS);
    if (!check.allowed) return res.redirect(`/payment?locked=${moduleId}&reason=paid`);
    const tab = req.query.tab ? `?tab=${encodeURIComponent(req.query.tab)}` : '';
    return res.redirect(`/training/${moduleId}${tab}`);
});

app.get('/module/:id/lab', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const moduleId = parseInt(req.params.id);
    const user = await getAccessUser(req);
    const check = accessControl.canAccessModule(moduleId, user, ADMIN_EMAILS);
    if (!check.allowed) return res.redirect(`/payment?locked=${moduleId}&reason=paid`);
    const labs = labEngine.getLabsForModule(moduleId);
    if (labs.length) return res.redirect(`/lab?lab=${encodeURIComponent(labs[0].id)}`);
    return res.redirect(`/training/${moduleId}?tab=practice`);
});

app.get('/module/:id/quiz', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const moduleId = parseInt(req.params.id);
    const user = await getAccessUser(req);
    const check = accessControl.canAccessModule(moduleId, user, ADMIN_EMAILS);
    if (!check.allowed) return res.redirect(`/payment?locked=${moduleId}&reason=paid`);
    return res.redirect(`/training/${moduleId}?tab=quiz`);
});

/** Admins skip progress/phase locks for ops review. Learners — including beta — follow the institutional semester. */
function userBypassesProgressLocks(user) {
    return userIsAdmin(user);
}

/** Fresh subscription flags from DB (session can be stale after upgrade) */
async function getAccessUser(req) {
    if (!req.session?.user) return null;
    try {
        const row = await db.getAsync(
            `SELECT id, username, email, subscription_tier, subscription_status, subscription_expires_at, is_beta_tester
             FROM users WHERE id = ?`,
            [req.session.user.id]
        );
        if (!row) return req.session.user;

        let tier = row.subscription_tier || 'free';
        let status = row.subscription_status || 'inactive';
        const expiresAt = row.subscription_expires_at || null;
        const isBeta = !!(row.is_beta_tester === 1 || row.is_beta_tester === true || tier === 'beta');

        // Auto-expire paid access when the billing window ends (never expire beta seats this way)
        if (
            expiresAt &&
            status === 'active' &&
            tier !== 'free' &&
            tier !== 'beta' &&
            !isBeta &&
            new Date(expiresAt).getTime() < Date.now()
        ) {
            await db.runAsync(
                `UPDATE users SET subscription_tier = 'free', subscription_status = 'expired'
                 WHERE id = ?`,
                [row.id]
            );
            tier = 'free';
            status = 'expired';
        }

        req.session.user.subscription_tier = tier;
        req.session.user.subscription_status = status;
        req.session.user.subscription_expires_at = expiresAt;
        req.session.user.is_beta_tester = isBeta ? 1 : 0;

        let orgAccess = null;
        try {
            orgAccess = await orgService.getUserOrgAccess(db, row.id);
        } catch (_) { /* org tables may be mid-migrate */ }

        req.session.user.org_access = orgAccess;
        return {
            id: row.id,
            username: row.username,
            email: row.email,
            subscription_tier: tier,
            subscription_status: status,
            subscription_expires_at: expiresAt,
            is_beta_tester: isBeta ? 1 : 0,
            org_access: orgAccess
        };
    } catch (e) {
        return req.session.user;
    }
}

async function assertModuleAccess(req, res, moduleId) {
    const user = await getAccessUser(req);
    if (!user) {
        res.status(401).json({ success: false, message: 'Login required' });
        return null;
    }
    const meta = MODULES.find(m => m.id === parseInt(moduleId, 10)) || { id: moduleId };
    const check = accessControl.canAccessModule(moduleId, user, ADMIN_EMAILS, meta);
    if (!check.allowed) {
        const upgradeTarget =
            check.access === 'locked_special_ops' ? 'special_ops'
                : (check.access === 'locked_pro_plus' ? 'pro_plus' : 'pro');
        const planQuery = upgradeTarget === 'special_ops' ? 'special_ops_2mo' : upgradeTarget;
        res.status(402).json({
            success: false,
            paid_locked: true,
            upgrade_required: true,
            upgrade_target: upgradeTarget,
            message: check.reason,
            free_module_ids: accessControl.getFreeModuleIds(),
            upgrade_url: `/payment?plan=${planQuery}`
        });
        return null;
    }
    return { user, check };
}

app.get('/admin', isAdmin, (req, res) => sendView(res, 'admin.html'));
app.get('/news', (req, res) => sendView(res, 'news.html'));
app.get('/news.html', (req, res) => res.redirect('/news'));
app.get('/admin/labs', isAdmin, (req, res) => sendView(res, 'admin-labs.html'));
app.get('/admin.html', isAdmin, (req, res) => res.redirect('/admin'));
app.get('/admin-labs.html', isAdmin, (req, res) => res.redirect('/admin/labs'));
app.get('/test', isAdmin, (req, res) => sendView(res, 'test.html'));
app.get('/test.html', isAdmin, (req, res) => sendView(res, 'test.html'));
app.get('/launch-readiness', isAdmin, (req, res) => res.redirect('/api/launch-readiness'));

function unlinkNewsImage(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') return;
    if (!imageUrl.startsWith('/uploads/news/')) return;
    const full = path.join(__dirname, 'public', imageUrl.replace(/^\//, ''));
    const root = path.join(__dirname, 'public', 'uploads', 'news');
    if (!full.startsWith(root)) return;
    try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch (_) { /* ignore */ }
}

app.get('/api/news', rateLimiter(60, 15 * 60 * 1000, 'news-public'), async (req, res) => {
    try {
        const posts = await newsFeed.listPublished(db, { limit: parseInt(req.query.limit, 10) || 24 });
        res.json({ success: true, posts });
    } catch (e) {
        console.error('News list error:', e);
        res.status(500).json({ success: false, message: 'Could not load news', posts: [] });
    }
});

app.get('/api/news/:id', rateLimiter(60, 15 * 60 * 1000, 'news-item'), async (req, res) => {
    try {
        const post = await newsFeed.getPublished(db, parseInt(req.params.id, 10));
        if (!post) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, post });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Could not load post' });
    }
});

app.get('/api/admin/news', isAdmin, async (req, res) => {
    try {
        const posts = await newsFeed.listAll(db);
        res.json({ success: true, posts });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Could not load news' });
    }
});

app.post('/api/admin/news', isAdmin, rateLimiter(30, 15 * 60 * 1000, 'news-write'), async (req, res) => {
    try {
        const author = req.session.user.username || 'TRIBAMS';
        const result = await newsFeed.createPost(db, req.body || {}, author);
        if (!result.ok) return res.status(400).json({ success: false, message: result.message });
        res.json({ success: true });
    } catch (e) {
        console.error('News create error:', e);
        res.status(500).json({ success: false, message: 'Could not save post' });
    }
});

app.post('/api/admin/news/:id', isAdmin, rateLimiter(30, 15 * 60 * 1000, 'news-write'), async (req, res) => {
    try {
        const result = await newsFeed.updatePost(db, parseInt(req.params.id, 10), req.body || {});
        if (!result.ok) return res.status(400).json({ success: false, message: result.message });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Could not update post' });
    }
});

app.post('/api/admin/news/:id/delete', isAdmin, rateLimiter(20, 15 * 60 * 1000, 'news-write'), async (req, res) => {
    try {
        const result = await newsFeed.deletePost(db, parseInt(req.params.id, 10));
        if (!result.ok) return res.status(400).json({ success: false, message: result.message });
        unlinkNewsImage(result.image_url);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Could not delete post' });
    }
});

app.post('/api/admin/news-image', isAdmin, rateLimiter(20, 15 * 60 * 1000, 'news-image'), newsUploadMiddleware, (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'Choose an image first.' });
    res.json({ success: true, image_url: `/uploads/news/${req.file.filename}` });
});

// ============================================================
// AUTHENTICATION APIS
// ============================================================
app.post('/api/register', rateLimiter(5, 15 * 60 * 1000, 'register'), async (req, res) => {
    const check = security.validateRegister(req.body || {});
    if (!check.ok) {
        return res.status(400).json({ success: false, message: check.errors[0], errors: check.errors });
    }

    try {
        const hash = await bcrypt.hash(check.password, 12);
        await db.runAsync(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [check.username, check.email, hash]
        );
        console.log(`✅ User registered: ${check.username}`);

        // Optional welcome email — never block registration if SMTP is unset
        try {
            const emailService = require('./services/emailService');
            if (emailService.isConfigured()) {
                emailService.sendWelcomeEmail(check.email, check.username).catch(() => {});
            }
        } catch (_) { /* email optional */ }

        res.json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        if (err.message && err.message.includes('UNIQUE')) {
            res.status(409).json({ success: false, message: 'Username or email already exists' });
        } else {
            console.error('Registration error:', err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
});

app.post('/api/login', rateLimiter(12, 15 * 60 * 1000, 'login'), async (req, res) => {
    const check = security.validateLogin(req.body || {});
    if (!check.ok) {
        return res.status(400).json({ success: false, message: check.message });
    }

    if (security.isLoginLocked(check.email)) {
        return res.status(429).json({
            success: false,
            message: 'Too many failed logins. Try again in 15 minutes.'
        });
    }

    try {
        const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [check.email]);
        if (!user) {
            security.recordLoginFailure(check.email);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (user.status && user.status !== 'active') {
            return res.status(403).json({ success: false, message: 'Account is suspended. Contact support.' });
        }

        const valid = await bcrypt.compare(check.password, user.password);
        if (!valid) {
            const locked = security.recordLoginFailure(check.email);
            return res.status(401).json({
                success: false,
                message: locked
                    ? 'Too many failed logins. Try again in 15 minutes.'
                    : 'Invalid email or password'
            });
        }

        security.clearLoginFailures(check.email);
        await db.runAsync('UPDATE users SET last_active = datetime("now") WHERE id = ?', [user.id]);

        // Session fixation protection
        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => (err ? reject(err) : resolve()));
        });

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            subscription_tier: user.subscription_tier || 'free',
            subscription_status: user.subscription_status || 'inactive',
            subscription_expires_at: user.subscription_expires_at || null
        };

        req.session.save((err) => {
            if (err) {
                console.error('Login session save failed:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }
            res.json({ success: true, message: 'Login successful' });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ============================================================
// PASSWORD RESET (email)
// ============================================================
app.post('/api/forgot-password', rateLimiter(5, 15 * 60 * 1000, 'forgot-password'), async (req, res) => {
    const email = security.normalizeEmail(req.body?.email);
    const generic = {
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.json(generic);
    }

    try {
        const user = await db.getAsync('SELECT id, username, email, status FROM users WHERE email = ?', [email]);
        if (!user || (user.status && user.status !== 'active')) {
            return res.json(generic);
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await db.runAsync('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0', [user.id]);
        await db.runAsync(
            'INSERT INTO password_resets (user_id, token, used, expires_at) VALUES (?, ?, 0, ?)',
            [user.id, tokenHash, expiresAt]
        );

        const emailService = require('./services/emailService');
        const resetLink = `${emailService.APP_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

        if (emailService.isConfigured()) {
            const result = await emailService.sendPasswordResetEmail(user.email, user.username, resetLink);
            if (!result.sent) {
                console.warn('Forgot-password email not sent:', result.reason);
                console.log(`🔑 Password reset link (email failed — use manually): ${resetLink}`);
                // Dev / local only — never expose tokens in production API responses
                if (!IS_PROD) {
                    return res.json({
                        ...generic,
                        email_sent: false,
                        email_error: result.reason || 'smtp_failed',
                        reset_link: resetLink
                    });
                }
            } else {
                return res.json({ ...generic, email_sent: true });
            }
        } else {
            console.log(`🔐 Password reset link (EMAIL not configured): ${resetLink}`);
            if (!IS_PROD) {
                return res.json({
                    ...generic,
                    email_sent: false,
                    reset_link: resetLink
                });
            }
        }

        return res.json(generic);
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.json(generic);
    }
});

app.post('/api/reset-password', rateLimiter(8, 15 * 60 * 1000, 'reset-password'), async (req, res) => {
    const email = security.normalizeEmail(req.body?.email);
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '');

    if (!email || !token || token.length < 32) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 8 characters with a letter and a number.'
        });
    }

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const row = await db.getAsync(
            `SELECT pr.id, pr.user_id, pr.expires_at, pr.used, u.email
             FROM password_resets pr
             JOIN users u ON u.id = pr.user_id
             WHERE pr.token = ? AND u.email = ?`,
            [tokenHash, email]
        );

        if (!row || row.used) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link.' });
        }
        if (new Date(row.expires_at).getTime() < Date.now()) {
            return res.status(400).json({ success: false, message: 'This reset link has expired. Request a new one.' });
        }

        const hash = await bcrypt.hash(password, 12);
        await db.runAsync('UPDATE users SET password = ? WHERE id = ?', [hash, row.user_id]);
        await db.runAsync('UPDATE password_resets SET used = 1 WHERE id = ?', [row.id]);
        await db.runAsync('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0', [row.user_id]);

        security.clearLoginFailures(email);
        return res.json({ success: true, message: 'Password updated. You can sign in now.' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
});

app.get('/api/email-status', isAdmin, async (req, res) => {
    try {
        const emailService = require('./services/emailService');
        const configured = emailService.isConfigured();
        let ready = false;
        if (configured) ready = await emailService.ensureReady();
        res.json({
            success: true,
            ...emailService.getStatus(),
            configured,
            ready
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Could not read email status' });
    }
});

app.get('/api/user-info', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, username: null });
    try {
        const user = await getAccessUser(req);
        const row = await db.getAsync(
            'SELECT username, email, profile_picture, created_at, subscription_tier, subscription_status FROM users WHERE id = ?',
            [req.session.user.id]
        );
        if (!row) {
            return res.json({ success: false, username: null });
        }

        // Older rows may have a null created_at — backfill so "Member since" always works
        let createdAt = toIsoDate(row.created_at);
        if (!createdAt) {
            try {
                await db.runAsync(
                    `UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE id = ? AND (created_at IS NULL OR created_at = '')`,
                    [req.session.user.id]
                );
            } catch (_) { /* ignore */ }
            createdAt = new Date().toISOString();
        }

        const isAdminUser = userIsAdmin(user);
        const isBeta = accessControl.isBetaTester(user);
        const isPro = accessControl.isProUser(user) || isAdminUser || isBeta;
        const picture = publicProfileUrl(row.profile_picture);
        res.json({
            success: true,
            username: row.username,
            email: row.email,
            created_at: createdAt,
            profile_picture: picture,
            imageUrl: picture,
            subscription_tier: user.subscription_tier || row.subscription_tier || 'free',
            subscription_status: user.subscription_status || row.subscription_status || 'inactive',
            subscription_expires_at: user.subscription_expires_at || null,
            is_admin: isAdminUser,
            is_beta_tester: isBeta,
            is_pro: isPro,
            org_access: user?.org_access || null,
            free_module_ids: accessControl.getFreeModuleIds()
        });
    } catch (error) {
        console.error('user-info error:', error);
        res.json({ success: false, username: req.session.user.username, email: req.session.user.email });
    }
});

async function handleProfilePictureUpload(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const file = pickUploadedProfileFile(req);
    if (!file) return res.status(400).json({ success: false, message: 'Choose an image to upload (JPEG, PNG, GIF, or WEBP).' });

    const relativePath = `/uploads/profiles/${file.filename}`;
    try {
        const existing = await db.getAsync('SELECT profile_picture FROM users WHERE id = ?', [req.session.user.id]);
        await db.runAsync('UPDATE users SET profile_picture = ? WHERE id = ?', [relativePath, req.session.user.id]);
        if (existing?.profile_picture && existing.profile_picture !== relativePath) {
            await removeStoredProfileFile(existing.profile_picture);
        }
        res.json({
            success: true,
            profile_picture: relativePath,
            imageUrl: relativePath,
            message: 'Profile picture updated'
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        await removeStoredProfileFile(relativePath);
        res.status(500).json({ success: false, message: 'Could not save profile picture' });
    }
}

app.post('/api/user/upload-profile-picture', profileUploadMiddleware, handleProfilePictureUpload);
app.post('/api/profile/upload', profileUploadMiddleware, handleProfilePictureUpload);

app.get('/api/profile/picture', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const row = await db.getAsync('SELECT profile_picture FROM users WHERE id = ?', [req.session.user.id]);
        const imageUrl = publicProfileUrl(row?.profile_picture);
        res.json({ success: true, imageUrl, profile_picture: imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not load profile picture' });
    }
});

app.delete('/api/profile/picture', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const row = await db.getAsync('SELECT profile_picture FROM users WHERE id = ?', [req.session.user.id]);
        await db.runAsync('UPDATE users SET profile_picture = NULL WHERE id = ?', [req.session.user.id]);
        await removeStoredProfileFile(row?.profile_picture);
        res.json({ success: true, message: 'Profile picture removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not remove profile picture' });
    }
});

app.get('/api/account/export', rateLimiter(12, 15 * 60 * 1000, 'account-export'), async (req, res) => {
    if (!req.session?.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const pack = await accountPrivacy.exportUserAccount(db, req.session.user.id);
        if (!pack) return res.status(404).json({ success: false, message: 'Account not found' });
        res.set('Content-Disposition', 'attachment; filename="tribams-account-export.json"');
        res.json({
            success: true,
            exported_at: new Date().toISOString(),
            data: pack
        });
    } catch (error) {
        console.error('Account export error:', error);
        res.status(500).json({ success: false, message: 'Could not export account data' });
    }
});

app.post('/api/account/delete', rateLimiter(6, 15 * 60 * 1000, 'account-delete'), async (req, res) => {
    if (!req.session?.user) return res.status(401).json({ success: false, message: 'Login required' });
    const password = String(req.body?.password || '');
    const confirm = String(req.body?.confirm || '').trim().toUpperCase();
    if (confirm !== 'DELETE') {
        return res.status(400).json({
            success: false,
            message: 'Type DELETE to confirm account deletion.'
        });
    }
    if (password.length < 1) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    try {
        const target = await db.getAsync(
            'SELECT id, username, email, password, profile_picture, status FROM users WHERE id = ?',
            [req.session.user.id]
        );
        if (!target) return res.status(404).json({ success: false, message: 'Account not found' });
        if (userIsAdmin(target)) {
            return res.status(403).json({
                success: false,
                message: 'Operator admin accounts cannot self-delete here. Email tribams@gmail.com or use the admin console for another operator.'
            });
        }
        const valid = await bcrypt.compare(password, target.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Password is incorrect.' });
        }
        await accountPrivacy.purgeUserAccount(db, target, { removeStoredProfileFile });
        req.session.destroy(() => {
            res.json({
                success: true,
                message: 'Your TRIBAMS account and training records were deleted.',
                redirect: '/'
            });
        });
    } catch (error) {
        console.error('Account self-delete error:', error);
        res.status(500).json({ success: false, message: 'Could not delete account' });
    }
});

// ============================================================
// MODULE & QUIZ APIS
// ============================================================
app.get('/api/module-content/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (!(await assertModuleAccess(req, res, id))) return;
    try {
        const learner = await resolveLearnerRank(req);
        const module = MODULES.find(m => m.id === id) || { id, name: 'Module', category: 'network', difficulty: 'medium' };
        // Always build with rank so intermediate/advanced layers unlock live (beginner base stays)
        const guide = contentLibrary.buildStudyGuide(module, { rank: learner.rank });

        // Prefer quarterly-refreshed essay prompts when present
        let essayQuestions = guide.essayQuestions;
        try {
            const stored = await db.getAsync(
                'SELECT essay_questions, content_refreshed_at FROM module_contents WHERE module_id = ?',
                [id]
            );
            if (stored?.essay_questions) {
                const parsed = JSON.parse(stored.essay_questions || '[]');
                if (Array.isArray(parsed) && parsed.length) {
                    if (stored.content_refreshed_at) {
                        essayQuestions = parsed;
                    } else if (learner.rank === 'beginner') {
                        essayQuestions = parsed;
                    }
                }
            }
        } catch (_) { /* ignore */ }

        const minEssays = (assessmentEngine.DRILL_COUNTS && assessmentEngine.DRILL_COUNTS.essay) || 5;
        if (!Array.isArray(essayQuestions) || essayQuestions.length < minEssays) {
            const extras = guide.essayQuestions || [];
            const seen = new Set((essayQuestions || []).map((q) => String(q && q.question ? q.question : q).slice(0, 80)));
            essayQuestions = Array.isArray(essayQuestions) ? essayQuestions.slice() : [];
            for (const q of extras) {
                if (essayQuestions.length >= minEssays) break;
                const key = String(q && q.question ? q.question : q).slice(0, 80);
                if (seen.has(key)) continue;
                seen.add(key);
                essayQuestions.push(q);
            }
        }

        res.json({
            success: true,
            content: {
                content: guide.content,
                resources: guide.resources,
                essay_questions: essayQuestions
            },
            rank: learner.rank,
            rank_label: learner.rank_label,
            environment: learner.environment,
            progressive: {
                beginner: true,
                intermediate_unlocked: progressiveContent.rankAtLeast(learner.rank, 'intermediate'),
                advanced_unlocked: progressiveContent.rankAtLeast(learner.rank, 'advanced')
            }
        });
    } catch (error) {
        console.error('Module content error:', error);
        res.status(500).json({ success: false, message: 'Error loading content' });
    }
});

app.get('/api/module-questions/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });

    const id = parseInt(req.params.id);
    if (!(await assertModuleAccess(req, res, id))) return;

    const catalog = await getActiveModules();
    const module = catalog.find(m => m.id === id) || MODULES.find(m => m.id === id);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    let learner = { rank: 'beginner', rank_label: 'Recruit', environment: 'Campus / SME Helpdesk', progress: null };
    try {
        const accessUser = await getAccessUser(req);
        learner = await resolveLearnerRank(req);
        if (!userBypassesProgressLocks(accessUser) && learner.progress && !progressGate.isModuleUnlocked(module, learner.progress)) {
            return res.status(403).json({
                success: false,
                locked: true,
                message: learner.progress.message,
                progress: learner.progress
            });
        }
    } catch (e) {
        console.warn('Progress gate check failed:', e.message);
    }

    const difficulty = (req.query.difficulty || module.difficulty || 'medium');
    const mode = req.query.mode === 'practice' ? 'practice' : 'quiz';
    const defaultLimit = mode === 'practice'
        ? (assessmentEngine.DRILL_COUNTS.practice || 10)
        : (assessmentEngine.DRILL_COUNTS.quiz || 16);
    const limit = parseInt(req.query.limit, 10) || defaultLimit;
    const sessionSeed = (req.session.user.id * 1000) + id + (mode === 'practice' ? 7 : 13);
    const generated = generateModuleQuestions(id, difficulty, limit, { rank: learner.rank, mode, sessionSeed });
    const refreshed = await loadRefreshedQuestionDrill(id, mode, difficulty, limit, learner.rank, sessionSeed);
    const drill = mergeQuestionsToLimit(refreshed, generated, limit);

    if (mode === 'practice') {
        const practiceToken = crypto.randomBytes(12).toString('hex');
        req.session.modulePractice = {
            token: practiceToken,
            moduleId: id,
            questions: drill.questions,
            startedAt: Date.now()
        };
        return req.session.save((err) => {
            if (err) {
                console.error('Practice session save failed:', err);
                return res.status(500).json({ success: false, message: 'Could not start practice session' });
            }
            res.json({
                success: true,
                practiceToken,
                questions: quizSecurity.stripQuestionsForClient(drill.questions),
                totalQuestions: drill.totalQuestions,
                timeLimit: drill.timeLimit,
                difficulty: drill.difficulty,
                mode: 'practice',
                immersion: drill.immersion,
                rank: drill.rank,
                rank_label: drill.rank_label,
                environment: drill.environment,
                progressive: {
                    beginner: true,
                    intermediate_unlocked: progressiveContent.rankAtLeast(learner.rank, 'intermediate'),
                    advanced_unlocked: progressiveContent.rankAtLeast(learner.rank, 'advanced')
                }
            });
        });
    }

    const quizToken = crypto.randomBytes(16).toString('hex');
    req.session.moduleQuiz = {
        token: quizToken,
        moduleId: id,
        moduleName: module.name,
        difficulty: drill.difficulty,
        rank: drill.rank,
        questions: drill.questions,
        timeLimit: drill.timeLimit,
        startedAt: Date.now()
    };
    // Hard lock Matte K for this browser session until drill ends (also blocks other tabs)
    req.session.matteExamLock = {
        until: Date.now() + ((drill.timeLimit || 600) + 20 * 60) * 1000,
        reason: 'module_quiz',
        moduleId: id
    };

    const clientQuestions = drill.questions.map((q, idx) => ({
        id: q.id || idx + 1,
        question: q.question,
        options: q.options,
        topic: q.topic,
        time_expected: q.time_expected
    }));

    const payload = {
        success: true,
        quizToken,
        questions: clientQuestions,
        totalQuestions: drill.totalQuestions,
        timeLimit: drill.timeLimit,
        difficulty: drill.difficulty,
        mode: 'proctored_drill',
        rank: drill.rank,
        rank_label: drill.rank_label,
        environment: drill.environment,
        progressive: {
            beginner: true,
            intermediate_unlocked: progressiveContent.rankAtLeast(learner.rank, 'intermediate'),
            advanced_unlocked: progressiveContent.rankAtLeast(learner.rank, 'advanced')
        },
        immersion: {
            ...(drill.immersion || {}),
            integrity: 'Matte K and external AI stay locked during scored drills. Focus changes are logged.'
        },
        integrity: {
            pledge: 'I will complete this drill using my own judgment without external AI assistance.',
            rules: [
                'Correct answers are scored only on the server',
                'Tab switches and long absences are recorded',
                'Implausibly fast perfect scores are flagged for review'
            ]
        }
    };

    // Persist session before client can submit answers (FileStore race fix)
    req.session.save((err) => {
        if (err) {
            console.error('Session save failed for module quiz:', err);
            return res.status(500).json({ success: false, message: 'Could not start secure drill session' });
        }
        res.json(payload);
    });
});

app.post('/api/module-practice/check', rateLimiter(80, 15 * 60 * 1000, 'practice-check'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });

    const { practiceToken, questionIndex, choice } = req.body || {};
    const stored = req.session.modulePractice;
    if (!stored || !stored.questions || !stored.token) {
        return res.status(400).json({ success: false, message: 'No active practice session. Reload Practice tab.' });
    }
    if (practiceToken !== stored.token) {
        return res.status(400).json({ success: false, message: 'Practice session mismatch. Reload Practice tab.' });
    }

    const idx = parseInt(questionIndex, 10);
    if (!Number.isInteger(idx) || idx < 0 || idx >= stored.questions.length) {
        return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    const q = stored.questions[idx];
    const validated = quizSecurity.sanitizeAnswers(
        [choice],
        1,
        [q.options.length]
    );
    if (!validated.ok) {
        return res.status(400).json({ success: false, message: 'Invalid answer choice' });
    }

    const picked = validated.answers[0];
    const correct = picked === q.correct;
    res.json({
        success: true,
        correct,
        correctIndex: q.correct,
        explanation: q.explanation || '',
        questionIndex: idx
    });
});

app.post('/api/module-quiz/submit', rateLimiter(12, 15 * 60 * 1000, 'quiz-submit'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
        quizToken,
        answers = [],
        time_taken = 0,
        focus_losses = 0,
        hidden_ms = 0,
        pledged = false
    } = req.body || {};

    const stored = req.session.moduleQuiz;
    if (!stored || !stored.questions || !stored.token) {
        return res.status(400).json({ success: false, message: 'No active drill. Restart the Quiz tab.' });
    }
    if (!(await assertModuleAccess(req, res, stored.moduleId))) return;
    if (quizToken !== stored.token) {
        return res.status(400).json({ success: false, message: 'Drill session mismatch. Restart the Quiz tab.' });
    }

    const minQuiz = assessmentEngine.DRILL_COUNTS?.quizMin || 16;
    if (stored.questions.length < minQuiz) {
        return res.status(400).json({
            success: false,
            message: `Drill requires at least ${minQuiz} scored decisions. Restart the Quiz tab.`
        });
    }

    const validated = quizSecurity.sanitizeAnswers(
        answers,
        stored.questions.length,
        stored.questions.map((q) => (Array.isArray(q.options) ? q.options.length : 4))
    );
    if (!validated.ok) {
        return res.status(400).json({ success: false, message: 'Invalid or incomplete answer submission.' });
    }
    const safeAnswers = validated.answers;

    const elapsedMs = Date.now() - (stored.startedAt || Date.now());
    const maxMs = ((stored.timeLimit || 600) + 30) * 1000;
    if (elapsedMs > maxMs) {
        // Allow submit but note timeout
    }

    let correct = 0;
    const debrief = [];
    stored.questions.forEach((q, i) => {
        const ok = safeAnswers[i] === q.correct;
        if (ok) correct++;
        else if (q.explanation) debrief.push(q.explanation);
    });

    const quizScore = stored.questions.length
        ? Math.round((correct / stored.questions.length) * 100)
        : 0;

    // Essay mandatory component — weights by learner rank / difficulty
    const learner = await resolveLearnerRank(req);
    const rankKey = learner.rank || progressiveContent.normalizeRank(stored.difficulty);
    let essayAvg = 0;
    let essayPassed = false;
    let essayCount = 0;
    try {
        const essays = await db.allAsync(
            'SELECT score, relevant FROM essay_answers WHERE user_id = ? AND module_id = ?',
            [req.session.user.id, stored.moduleId]
        );
        essayCount = (essays || []).length;
        if (essayCount) {
            essayAvg = Math.round(
                essays.reduce((s, e) => s + (Number(e.score) || 0), 0) / essayCount
            );
            const essayStatus = essayLearning.essayPassStatus(essays, rankKey);
            essayPassed = essayStatus.passed;
        }
    } catch (_) { /* essays optional until table migrated */ }

    const essayWeight = essayLearning.essayWeight(rankKey);
    const essayMin = essayLearning.essayMinScore(rankKey);
    let score = essayCount
        ? essayLearning.compositeModuleScore(quizScore, essayAvg, rankKey)
        : quizScore;
    // Without a passing essay, module cannot count as passed (mandatory research)
    const essayBlocksPass = !essayPassed;

    const integrity = progressGate.integrityRisk({
        focusLosses: Number(focus_losses) || 0,
        hiddenMs: Number(hidden_ms) || 0,
        timeTaken: Number(time_taken) || Math.round(elapsedMs / 1000),
        questionCount: stored.questions.length,
        perfectScore: quizScore === 100
    });

    // High integrity risk + strong score: cap recorded score and require review
    let recordedScore = score;
    let integrityNote = null;
    if (integrity.status === 'high_risk' && score >= 80) {
        recordedScore = Math.min(score, 69);
        integrityNote = 'Score capped pending integrity review (focus loss / external assistance signals).';
    } else if (!pledged) {
        integrity.flags.push('Integrity pledge not confirmed');
        integrity.risk += 10;
    }
    if (essayBlocksPass && recordedScore >= progressGate.PASS_SCORE) {
        recordedScore = Math.min(recordedScore, progressGate.PASS_SCORE - 1);
        integrityNote = (integrityNote ? integrityNote + ' ' : '') +
            `Essay mandatory: submit at least ${assessmentEngine.DRILL_COUNTS?.essayMinPass || 3} relevant essays scoring ≥${essayMin}% before this module can pass.`;
    }

    let paceHold = false;
    try {
        const priorScores = await loadUserScores(req.session.user.id);
        const pace = trainingPhases.canTakeOfficialFirstPass({
            scores: priorScores,
            moduleName: stored.moduleName,
            newScore: recordedScore
        });
        if (!pace.ok) {
            paceHold = true;
            recordedScore = Math.min(recordedScore, progressGate.PASS_SCORE - 1);
            integrityNote = (integrityNote ? integrityNote + ' ' : '') + pace.message;
        }
    } catch (_) { /* pace is best-effort */ }

    try {
        await db.runAsync(
            `INSERT INTO quiz_scores (user_id, module_name, score, time_taken, total_time_limit, difficulty)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.session.user.id,
                stored.moduleName,
                recordedScore,
                Number(time_taken) || Math.round(elapsedMs / 1000),
                stored.timeLimit || 0,
                stored.difficulty || 'medium'
            ]
        );

        try {
            await db.runAsync(
                `INSERT INTO quiz_integrity
                 (user_id, module_id, module_name, score, focus_losses, hidden_ms, time_taken, risk_score, status, flags)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.session.user.id,
                    stored.moduleId,
                    stored.moduleName,
                    recordedScore,
                    Number(focus_losses) || 0,
                    Number(hidden_ms) || 0,
                    Number(time_taken) || 0,
                    integrity.risk,
                    integrity.status,
                    JSON.stringify(integrity.flags)
                ]
            );
        } catch (integErr) {
            console.warn('quiz_integrity write skipped:', integErr.message);
        }

        let certificate = null;
        let certificate_hold = null;
        const createdAt = await loadUserCreatedAt(req.session.user.id);

        if (recordedScore >= trainingPhases.CERT_SCORE && !essayBlocksPass) {
            const badgeName = `${stored.moduleName} Master`;
            const existingBadge = await db.getAsync(
                'SELECT id FROM badges WHERE user_id = ? AND badge_name = ?',
                [req.session.user.id, badgeName]
            );
            if (!existingBadge) {
                await db.runAsync(
                    'INSERT INTO badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)',
                    [req.session.user.id, badgeName, '🏅']
                );
            }
        }

        const catalog = await getActiveModules();
        const allScores = await loadUserScores(req.session.user.id);
        const progress = progressGate.getProgressSnapshot(allScores, catalog, { createdAt });

        const certResult = await issueProgramCertificateIfEligible(req.session.user.id, {
            progress,
            integrityStatus: integrity.status,
            createdAt,
            essayBlocksPass
        });
        certificate = certResult.certificate;
        certificate_hold = certResult.certificate_hold;
        const firstPassMap = progressGate.buildFirstPassScores(allScores);
        const official = firstPassMap.get(stored.moduleName);
        const passCount = allScores.filter(
            s => s.module_name === stored.moduleName && s.score >= progressGate.PASS_SCORE
        ).length;
        const isOfficialFirstPass = recordedScore >= progressGate.PASS_SCORE && passCount === 1;
        const isRetakePass = recordedScore >= progressGate.PASS_SCORE && passCount > 1;

        // Clear session quiz so answers cannot be replayed
        delete req.session.moduleQuiz;
        delete req.session.matteExamLock;

        // Respond immediately — FileStore session.save callbacks can stall on Windows locks.
        // express-session still persists the touched session after the response.
        return res.json({
            success: true,
            score: recordedScore,
            raw_score: score,
            quiz_score: quizScore,
            essay_score: essayAvg,
            essay_count: essayCount,
            essay_required: true,
            essay_passed: essayPassed,
            essay_min: essayMin,
            essay_weight: essayWeight,
            correct,
            total: stored.questions.length,
            debrief: debrief.slice(0, 5),
            integrity: {
                status: integrity.status,
                risk: integrity.risk,
                flags: integrity.flags,
                note: integrityNote
            },
            progress,
            certificate,
            certificate_hold,
            pace_hold: paceHold,
            passed_module: recordedScore >= progressGate.PASS_SCORE && !essayBlocksPass,
            first_pass_official: isOfficialFirstPass,
            official_pass_score: official ? official.score : null,
            retake: isRetakePass,
            level_unlocked: progress.meets_level_gate
        });
    } catch (error) {
        console.error('Module quiz submit error:', error);
        res.status(500).json({ success: false, message: 'Error saving drill result' });
    }
});

app.get('/skill-assessment', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendView(res, 'skill-assessment.html');
});

app.get('/api/matte-k/status', (req, res) => {
    // Extra path defense: never treat exam pages as available, even without a session flag
    const ref = String(req.get('referer') || '');
    let examPage = false;
    try {
        const pathName = ref ? new URL(ref).pathname : '';
        examPage = /\/(training|skill-assessment|scenario|custom-training|review|lab)(\/|$)/i.test(pathName);
    } catch (_) { /* ignore bad referer */ }

    const locked = examPage || matteK.isExamSessionActive(req.session);
    res.json({
        success: true,
        name: 'Matte K',
        locked,
        available: !locked,
        message: locked
            ? 'Matte K is locked while a scored drill, scenario, or skill assessment is active.'
            : 'Matte K online — full project Q&A with typo repair. Never exam answers.'
    });
});

app.post('/api/matte-k/chat', rateLimiter(40, 15 * 60 * 1000, 'matte-k'), async (req, res) => {
    try {
        const ref = String(req.get('referer') || '');
        let examPage = false;
        try {
            const pathName = ref ? new URL(ref).pathname : '';
            examPage = /\/(training|skill-assessment|scenario|custom-training|review|lab)(\/|$)/i.test(pathName);
        } catch (_) { /* ignore */ }

        if (examPage || matteK.isExamSessionActive(req.session)) {
            return res.json({
                success: true,
                locked: true,
                name: 'Matte K',
                reply: matteK.EXAM_LOCK_REPLY,
                mode: 'exam_lock'
            });
        }

        const message = String(req.body?.message || '').slice(0, 1600);
        const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
        const result = await matteK.respond({
            message,
            history,
            session: req.session,
            user: req.session?.user || null
        });
        res.json(result);
    } catch (err) {
        console.error('Matte K chat error:', err);
        res.status(500).json({
            success: false,
            name: 'Matte K',
            message: 'Link unstable. Try again shortly.'
        });
    }
});

app.get('/api/skill-assessment', (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required to run skill assessment' });
    const limit = parseInt(req.query.limit, 10) || (assessmentEngine.DRILL_COUNTS.skillAssessment || 20);
    const assessment = assessmentEngine.generateSkillAssessment(MODULES, limit);
    // Stash questions server-side for honest scoring — strip answers from client payload
    req.session.skillAssessment = {
        questions: assessment.questions,
        startedAt: Date.now(),
        timeLimit: assessment.timeLimit || 1200
    };
    req.session.matteExamLock = { until: Date.now() + 90 * 60 * 1000, reason: 'skill_assessment' };
    const clientQuestions = assessment.questions.map((q, idx) => ({
        id: q.id || idx + 1,
        question: q.question,
        options: q.options,
        topic: q.topic,
        category: q.category,
        time_expected: q.time_expected,
        points: q.points
    }));
    const payload = {
        success: true,
        questions: clientQuestions,
        timeLimit: assessment.timeLimit,
        totalQuestions: assessment.totalQuestions,
        difficulty: assessment.difficulty,
        mode: assessment.mode,
        immersion: {
            ...(assessment.immersion || {}),
            integrity: 'Matte K is locked for this assessment. External AI assistance and tab switching are integrity risks.'
        }
    };
    req.session.save((err) => {
        if (err) {
            console.error('Session save failed for skill assessment:', err);
            return res.status(500).json({ success: false, message: 'Could not start secure assessment session' });
        }
        res.json(payload);
    });
});

app.post('/api/skill-assessment/submit', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { time_taken, total_time_limit, answers } = req.body;
    try {
        const stored = req.session.skillAssessment;
        if (!stored || !stored.questions) {
            return res.status(400).json({ success: false, message: 'No active assessment. Restart from Dashboard → Assessment.' });
        }

        const scored = assessmentEngine.scoreSkillAssessment(stored.questions, answers || []);

        // Build quick domain summary without waiting on DB (keeps UI unblocked).
        const domainEntries = Object.entries(scored.domainScores || {}).filter(([, v]) => Number(v) > 0);
        const weakQuick = domainEntries.filter(([, v]) => v < 60).map(([k]) => k);
        const strongQuick = domainEntries.filter(([, v]) => v >= 80).map(([k]) => k);

        const userId = req.session.user.id;
        req.session.skillAssessment = null;
        delete req.session.matteExamLock;

        res.json({
            success: true,
            message: 'Assessment scored',
            score: scored.overall,
            domainScores: scored.domainScores,
            weak_areas: weakQuick,
            strong_areas: strongQuick,
            skill_breakdown: scored.domainScores
        });

        // Persist after the client already has a result — DB/FileStore stalls must not freeze submit UI.
        setImmediate(() => {
            (async () => {
                try {
                    await db.runAsync(
                        `INSERT INTO quiz_scores (user_id, module_name, score, time_taken, total_time_limit, difficulty)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [userId, 'Skill Assessment', scored.overall, time_taken || 0, total_time_limit || 0, 'mixed']
                    );

                    const user = await db.getAsync('SELECT username, daily_streak FROM users WHERE id = ?', [userId]);
                    const catalog = await getActiveModules();
                    const allScores = await loadUserScores(userId);
                    const profile = assessmentEngine.computeSkillProfile(
                        allScores,
                        catalog,
                        user || {},
                        scored.domainScores
                    );
                    await db.runAsync(
                        `INSERT OR REPLACE INTO user_skill_profile
                         (user_id, overall_level, overall_score, modules_completed, total_attempts, average_score,
                          skill_breakdown, weak_areas, strong_areas, xp_total, last_assessment, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [
                            userId,
                            profile.overall_level,
                            profile.overall_score,
                            profile.modules_completed,
                            allScores.length,
                            profile.overall_score,
                            JSON.stringify(profile.skill_breakdown),
                            JSON.stringify(profile.weak_areas),
                            JSON.stringify(profile.strong_areas),
                            profile.xp_total
                        ]
                    );
                    try {
                        await db.runAsync(
                            `INSERT INTO skill_history (user_id, module_id, skill_score, event_type, event_data)
                             VALUES (?, NULL, ?, 'skill_assessment', ?)`,
                            [userId, scored.overall, JSON.stringify({
                                domainScores: scored.domainScores,
                                correct: scored.correct,
                                total: scored.total,
                                at: new Date().toISOString()
                            })]
                        );
                    } catch (_) { /* optional */ }
                } catch (persistErr) {
                    console.error('Skill assessment persist error:', persistErr);
                }
            })();
        });
        return;
    } catch (error) {
        console.error('Skill assessment submit error:', error);
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: 'Error saving assessment' });
        }
    }
});

app.get('/api/recommended-modules', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const user = await db.getAsync('SELECT username, daily_streak FROM users WHERE id = ?', [req.session.user.id]);
        const catalog = await getActiveModules();
        const scores = await loadUserScores(req.session.user.id);
        const stored = await db.getAsync('SELECT skill_breakdown FROM user_skill_profile WHERE user_id = ?', [req.session.user.id]);
        let overrides = null;
        if (stored?.skill_breakdown) {
            try { overrides = JSON.parse(stored.skill_breakdown); } catch (e) {}
        }
        const profile = assessmentEngine.computeSkillProfile(scores, catalog, user, overrides);
        res.json({ success: true, recommendations: profile.recommendations });
    } catch (error) {
        console.error('Recommended modules error:', error);
        res.status(500).json({ success: false, message: 'Could not load recommendations' });
    }
});

app.post('/api/update-learning-path', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const userId = req.session.user.id;
        const user = await db.getAsync('SELECT username, daily_streak FROM users WHERE id = ?', [userId]);
        const catalog = await getActiveModules();
        const scores = await loadUserScores(userId);
        const stored = await db.getAsync('SELECT skill_breakdown FROM user_skill_profile WHERE user_id = ?', [userId]);
        let overrides = null;
        if (stored?.skill_breakdown) {
            try { overrides = JSON.parse(stored.skill_breakdown); } catch (e) {}
        }
        const profile = assessmentEngine.computeSkillProfile(scores, catalog, user, overrides);
        const pathData = {
            steps: profile.recommendations,
            generatedAt: new Date().toISOString(),
            focus: profile.weak_areas
        };

        await db.runAsync(
            `INSERT INTO learning_paths (user_id, path_type, path_data, current_step, status, started_at)
             VALUES (?, 'recommended', ?, 0, 'active', datetime('now'))`,
            [userId, JSON.stringify(pathData)]
        );

        res.json({
            success: true,
            message: 'Learning path updated',
            learningPath: {
                steps: profile.recommendation_ids,
                recommendations: profile.recommendations,
                currentStep: 0,
                status: 'active'
            },
            profile
        });
    } catch (error) {
        console.error('Update learning path error:', error);
        res.status(500).json({ success: false, message: 'Failed to update learning path' });
    }
});

app.get('/api/pricing', (req, res) => {
    const snap = pricingCatalog.snapshot();
    const c = snap.consumer;
    const proMax = accessControl.getProMaxId();
    res.json({
        success: true,
        currency_base: 'USD',
        symbol: 'US$',
        nad_per_usd: snap.nad_per_usd,
        catalog: {
            free_modules: accessControl.getFreeModuleIds().length,
            pro_modules: proMax,
            pro_plus_modules: proMax,
            special_ops_modules: MODULES.length,
            total_modules: MODULES.length
        },
        plans: {
            free: { usd: 0, nad: 0, period: 'month', label: 'Free', modules: accessControl.getFreeModuleIds().length },
            monthly: {
                usd: c.monthly.usd,
                nad: c.monthly.nad,
                period: 'month',
                label: 'Pro Monthly',
                modules: proMax,
                tier: 'pro'
            },
            annual: {
                usd: c.annual.usd,
                nad: c.annual.nad,
                period: 'month',
                months: 12,
                yearly_total_usd: c.annual.yearly_total_usd,
                yearly_total_nad: c.annual.yearly_total_nad,
                label: `Pro Annual (US$${c.annual.usd}/mo)`,
                modules: proMax,
                tier: 'pro',
                save_vs_monthly_usd: c.annual.save_vs_monthly_usd
            },
            pro_plus_2mo: {
                usd: c.pro_plus_2mo.usd,
                nad: c.pro_plus_2mo.nad,
                period: '2 months',
                months: 2,
                label: 'Pro+ (2 months)',
                modules: proMax,
                tier: 'pro_plus'
            },
            pro_plus_annual: {
                usd: c.pro_plus_annual.usd,
                nad: c.pro_plus_annual.nad,
                period: 'month',
                months: 12,
                yearly_total_usd: c.pro_plus_annual.yearly_total_usd,
                label: `Pro+ Annual (US$${c.pro_plus_annual.usd}/mo)`,
                modules: proMax,
                tier: 'pro_plus'
            },
            special_ops_2mo: {
                usd: c.special_ops_2mo.usd,
                nad: c.special_ops_2mo.nad,
                period: '2 months',
                months: 2,
                label: 'Special Ops Elite (2 months)',
                modules: MODULES.length,
                tier: 'special_ops'
            },
            special_ops_annual: {
                usd: c.special_ops_annual.usd,
                nad: c.special_ops_annual.nad,
                period: 'month',
                months: 12,
                yearly_total_usd: c.special_ops_annual.yearly_total_usd,
                label: `Special Ops Elite Annual (US$${c.special_ops_annual.usd}/mo)`,
                modules: MODULES.length,
                tier: 'special_ops'
            }
        },
        note: `Checkout is USD. Namibia display reference uses ~N$${snap.nad_per_usd} per US$1. Pro through module ${proMax}. Special Ops Elite unlocks Live Red + Blue (96–97) — Mission-Ready rank required.`,
        paypal: {
            configured: paypalCheckout.isConfigured(),
            mode: paypalCheckout.isConfigured()
                ? (paypalCheckout.isLiveMode() ? 'live' : 'sandbox')
                : null,
            checkout_currency: 'USD'
        },
        b2b_licenses: orgService.catalogPlans()
    });
});

function applyPaidFieldsToSession(req, userId, activation) {
    if (!req.session?.user || !activation) return false;
    if (Number(req.session.user.id) !== Number(userId)) return false;
    req.session.user.subscription_tier = activation.tier;
    req.session.user.subscription_status = 'active';
    req.session.user.subscription_expires_at = activation.expiresAt;
    return true;
}

function saveSession(req) {
    return new Promise((resolve, reject) => {
        if (!req.session) return resolve();
        req.session.save((err) => (err ? reject(err) : resolve()));
    });
}

/** Activate a subscription tier (PayPal capture, admin, or local dev) */
async function activateSubscription(userId, plan, extras = {}) {
    const resolved = paypalCheckout.resolvePlan(plan);
    if (!resolved) return null;
    const expiresAt = paypalCheckout.expiresAtIso(resolved.months);
    await db.runAsync(
        `UPDATE users
         SET subscription_tier = ?, subscription_status = 'active', subscription_expires_at = ?
         WHERE id = ?`,
        [resolved.tier, expiresAt, userId]
    );
    // Verify on the users row (Postgres poolers can report odd rowCount on UPDATE)
    const verify = await db.getAsync(
        `SELECT id, subscription_tier, subscription_status, subscription_expires_at
         FROM users WHERE id = ?`,
        [userId]
    );
    if (!verify) {
        throw new Error('Could not persist subscription on users row');
    }
    if (String(verify.subscription_tier) !== String(resolved.tier) || String(verify.subscription_status) !== 'active') {
        throw new Error('Subscription write did not stick on users row');
    }
    if (extras.recordSubscription !== false) {
        try {
            await db.runAsync(
                `INSERT INTO subscriptions
                 (user_id, paypal_order_id, paypal_capture_id, tier, plan, status, amount, amount_usd, currency, expires_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    extras.orderId || null,
                    extras.captureId || null,
                    resolved.tier,
                    plan,
                    extras.status || 'active',
                    Math.round(resolved.nad),
                    String(resolved.usd),
                    resolved.currency,
                    expiresAt
                ]
            );
        } catch (ledgerErr) {
            console.warn('Subscription ledger insert skipped:', ledgerErr.message);
        }
    }
    return {
        ...resolved,
        expiresAt: verify.subscription_expires_at || expiresAt,
        persisted_tier: verify.subscription_tier || resolved.tier,
        persisted_status: verify.subscription_status || 'active'
    };
}

async function sendPaymentEmailSafe(user, activation, orderMeta = {}) {
    try {
        const emailService = require('./services/emailService');
        if (!emailService.isConfigured() || !user?.email) return;
        await emailService.sendPaymentConfirmationEmail(user.email, user.username, {
            planLabel: activation.label,
            tier: activation.tier,
            expiresAt: activation.expiresAt,
            amountUsd: activation.usd,
            orderId: orderMeta.orderId,
            captureId: orderMeta.captureId
        });
    } catch (e) {
        console.warn('Payment confirmation email skipped:', e.message);
    }
}

app.get('/api/health', async (req, res) => {
    let dbOk = false;
    if (db) {
        try {
            await db.getAsync('SELECT 1 AS ok');
            dbOk = true;
        } catch (_) { /* ignore */ }
    }
    res.set('Cache-Control', 'no-store');
    // Railway healthcheck: return 200 while seeding so the container is not killed mid-startup.
    res.status(200).json({
        ok: true,
        ready: serverInitComplete && dbOk,
        db: dbOk,
        service: 'TRIBAMS',
        time: new Date().toISOString()
    });
});

app.get('/api/launch-readiness', isAdmin, async (req, res) => {
    const emailService = require('./services/emailService');
    const emailConfigured = emailService.isConfigured();
    let emailReady = false;
    if (emailConfigured) {
        try { emailReady = await emailService.ensureReady(); } catch (_) { emailReady = false; }
    }
    let databaseOk = false;
    try {
        await db.getAsync('SELECT 1 AS ok');
        databaseOk = true;
    } catch (_) { /* ignore */ }
    const sqliteFallbackOn = String(process.env.DEMO_SQLITE_FALLBACK || '').toLowerCase() === 'true';
    const base = String(process.env.APP_BASE_URL || '');
    const httpsPublic = /^https:\/\//i.test(base) && !/localhost|127\.0\.0\.1/i.test(base);
    const checks = {
        session_secret: Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32),
        app_base_url: Boolean(base && !/localhost|127\.0\.0\.1/i.test(base)),
        app_base_url_https: httpsPublic,
        paypal: paypalCheckout.isConfigured(),
        paypal_live: paypalCheckout.isConfigured() && paypalCheckout.isLiveMode(),
        email_configured: emailConfigured,
        email_ready: emailReady,
        email_tls_strict: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
        admin_emails: ADMIN_EMAILS.length > 0,
        production_mode: IS_PROD,
        database_ok: databaseOk,
        database_postgres: db.dialect === 'postgres',
        sqlite_fallback_off: !sqliteFallbackOn,
        cloudflare_proxy_ready: httpsPublic && IS_PROD,
        docker_origin_ready: true
    };
    const weights = {
        session_secret: 12,
        app_base_url: 8,
        app_base_url_https: 8,
        paypal: 18,
        paypal_live: 8,
        email_configured: 12,
        email_ready: 8,
        email_tls_strict: 4,
        admin_emails: 4,
        production_mode: 8,
        database_ok: 5,
        database_postgres: 5,
        sqlite_fallback_off: 3,
        cloudflare_proxy_ready: 5
    };
    let score = 0;
    let max = 0;
    for (const [key, w] of Object.entries(weights)) {
        max += w;
        if (checks[key]) score += w;
    }
    const percent = Math.round((score / max) * 100);
    res.set('Cache-Control', 'no-store');
    res.json({
        success: true,
        public_launch_percent: percent,
        ready_for_public_launch: percent >= 80,
        hosting_model: 'cloudflare_dns_proxy_plus_node_origin',
        workers_only_supported: false,
        checks,
        next_steps: [
            !checks.session_secret && 'Set a 64+ char SESSION_SECRET in .env',
            !checks.paypal && 'Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET',
            checks.paypal && !checks.paypal_live && 'Set PAYPAL_MODE=live for real charges',
            !checks.email_configured && 'Set EMAIL_USER and EMAIL_PASS (Gmail App Password or transactional SMTP)',
            !checks.app_base_url && 'Set APP_BASE_URL to your public domain (not localhost)',
            !checks.app_base_url_https && 'Set APP_BASE_URL=https://tribams.com (HTTPS required behind Cloudflare)',
            !checks.production_mode && 'Run with NODE_ENV=production',
            !checks.admin_emails && 'Set ADMIN_EMAILS for ops access',
            !checks.email_tls_strict && 'Remove NODE_TLS_REJECT_UNAUTHORIZED=0 — use Resend on Railway or SMTP-only TLS relax via EMAIL_TLS_INSECURE',
            !checks.database_ok && 'Database ping failed — check DATABASE_URL / local SQLite file',
            !checks.database_postgres && 'Recommended: DATABASE_URL Postgres so Cloudflare redeploys do not wipe SQLite',
            !checks.sqlite_fallback_off && 'Unset DEMO_SQLITE_FALLBACK in production — do not silently fall back to SQLite',
            !checks.cloudflare_proxy_ready && 'Point tribams.com through Cloudflare (Full strict SSL) to this Node origin — see docs/CLOUDFLARE_HOSTING.md',
            'In Cloudflare: bypass cache for /api/* and member pages; do not deploy Workers-only'
        ].filter(Boolean)
    });
});

/** Subscription status for payment page (legacy stripe path kept as alias) */
async function subscriptionStatusHandler(req, res) {
    const paypalReady = paypalCheckout.isConfigured();
    const paypalLive = paypalReady && paypalCheckout.isLiveMode();
    const checkoutMeta = {
        paypal_configured: paypalReady,
        paypal_live: paypalLive,
        manual_checkout_available: true
    };
    if (!req.session.user) {
        return res.json({
            success: true,
            tier: 'free',
            status: 'inactive',
            logged_in: false,
            is_admin: false,
            ...checkoutMeta
        });
    }
    const user = await getAccessUser(req);
    const tier = user?.subscription_tier || 'free';
    const status = user?.subscription_status || 'inactive';
    const isBeta = accessControl.isBetaTester(user);
    const isPaid = accessControl.isProUser(user) || accessControl.isProPlusUser(user) || userIsAdmin(user) || isBeta;
    res.json({
        success: true,
        logged_in: true,
        is_admin: userIsAdmin(user),
        tier,
        status,
        is_pro: isPaid,
        is_pro_plus: accessControl.isProPlusUser(user) || userIsAdmin(user) || isBeta,
        is_special_ops: accessControl.isSpecialOpsUser(user) || userIsAdmin(user) || isBeta,
        is_beta_tester: isBeta,
        expires_at: user?.subscription_expires_at || null,
        org_access: user?.org_access || null,
        email: user?.email || req.session.user.email || null,
        username: user?.username || req.session.user.username || null,
        ...checkoutMeta
    });
}
app.get('/api/subscription-status', subscriptionStatusHandler);
app.get('/api/stripe/subscription-status', subscriptionStatusHandler);

app.post('/api/paypal/create-order', rateLimiter(10, 15 * 60 * 1000, 'paypal-create'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Login required to subscribe' });
    }
    const plan = String(req.body?.plan || '');
    const allowed = ['monthly', 'annual', 'pro_plus_2mo', 'pro_plus_annual', 'special_ops_2mo', 'special_ops_annual'];
    if (!allowed.includes(plan)) {
        return res.status(400).json({ success: false, message: 'Unknown plan' });
    }

    const paypalReady = paypalCheckout.isConfigured();
    const accessUser = await getAccessUser(req);
    const adminActivate = !paypalReady && userIsAdmin(accessUser) && req.body?.admin_activate === true;

    if (adminActivate) {
        const sel = await activateSubscription(req.session.user.id, plan, {
            status: 'admin_activate',
            orderId: `ADMIN-${Date.now()}`
        });
        if (!sel) return res.status(400).json({ success: false, message: 'Unknown plan' });
        req.session.user.subscription_tier = sel.tier;
        req.session.user.subscription_status = 'active';
        req.session.user.subscription_expires_at = sel.expiresAt;
        return req.session.save(() => {
            res.json({
                success: true,
                activated: true,
                tier: sel.tier,
                expires_at: sel.expiresAt,
                message: `Operator activation: ${sel.label || sel.tier} is now active on this account.`
            });
        });
    }

    if (!paypalReady) {
        return res.status(503).json({
            success: false,
            paypal_ready: false,
            fallback: 'manual',
            message: 'Card checkout is not live yet. Request this plan or enter a license key on this page. Access starts after an operator activates the request — it is not an unpaid upgrade.'
        });
    }

    try {
        const created = await paypalCheckout.createOrder({
            planKey: plan,
            userId: req.session.user.id,
            username: req.session.user.username
        });
        if (!created.approvalUrl) {
            return res.status(502).json({
                success: false,
                fallback: 'manual',
                message: 'PayPal did not return a checkout URL. Request this plan or enter a license key.'
            });
        }

        await db.runAsync(
            `INSERT INTO subscriptions
             (user_id, paypal_order_id, tier, plan, status, amount, amount_usd, currency, expires_at)
             VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
            [
                req.session.user.id,
                created.orderId,
                created.plan.tier,
                plan,
                Math.round(created.plan.nad),
                String(created.plan.usd),
                created.plan.currency,
                paypalCheckout.expiresAtIso(created.plan.months)
            ]
        );

        logOutbound('paypal_create_order', {
            user_id: req.session.user.id,
            username: req.session.user.username,
            target: 'paypal',
            path: created.orderId,
            details: { plan, usd: created.plan.usd }
        });

        return res.json({
            success: true,
            orderId: created.orderId,
            approvalUrl: created.approvalUrl,
            amount_usd: created.plan.usd,
            currency: created.plan.currency,
            mode: paypalCheckout.isLiveMode() ? 'live' : 'sandbox'
        });
    } catch (err) {
        console.error('PayPal create-order error:', err);
        return res.status(502).json({
            success: false,
            paypal_ready: true,
            fallback: 'manual',
            message: 'PayPal did not start. You can request this plan or enter a license key. Access starts after an operator confirms payment — it is not an unpaid upgrade.'
        });
    }
});

const CONSUMER_PLANS = ['monthly', 'annual', 'pro_plus_2mo', 'pro_plus_annual', 'special_ops_2mo', 'special_ops_annual'];

function makeLicenseCode() {
    const raw = crypto.randomBytes(9).toString('hex').toUpperCase();
    return `TRIB-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
}

async function recordPendingSubscription({ userId, plan, email, name, note, source }) {
    const resolved = paypalCheckout.resolvePlan(plan);
    if (!resolved) return null;
    const requestId = `REQ-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    if (userId) {
        await db.runAsync(
            `INSERT INTO subscriptions
             (user_id, paypal_order_id, tier, plan, status, amount, amount_usd, currency, expires_at)
             VALUES (?, ?, ?, ?, 'pending_manual', ?, ?, ?, ?)`,
            [
                userId,
                requestId,
                resolved.tier,
                plan,
                Math.round(resolved.nad),
                String(resolved.usd),
                resolved.currency,
                null
            ]
        );
    }
    await db.runAsync(
        `INSERT INTO sales_leads (name, email, company, role, seats, country, message, source, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
        [
            String(name || 'Learner').slice(0, 120),
            String(email || '').slice(0, 200),
            'Self-serve subscription',
            resolved.label,
            1,
            null,
            String(note || `${resolved.label} — pending activation. Ref ${requestId}`).slice(0, 4000),
            String(source || 'payment').slice(0, 40)
        ]
    );
    return { requestId, plan: resolved };
}

app.post('/api/subscribe/request', rateLimiter(8, 15 * 60 * 1000, 'subscribe-request'), async (req, res) => {
    const plan = String(req.body?.plan || '');
    if (!CONSUMER_PLANS.includes(plan)) {
        return res.status(400).json({ success: false, message: 'Unknown plan' });
    }
    const sessionUser = req.session.user;
    const email = String(req.body?.email || sessionUser?.email || '').trim();
    const name = String(req.body?.name || sessionUser?.username || '').trim();
    if (!email.includes('@') || name.length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Provide your name and email, or sign in first.'
        });
    }
    try {
        const recorded = await recordPendingSubscription({
            userId: sessionUser?.id || null,
            plan,
            email,
            name,
            note: String(req.body?.note || '').slice(0, 2000),
            source: 'payment'
        });
        if (!recorded) return res.status(400).json({ success: false, message: 'Unknown plan' });
        return res.json({
            success: true,
            pending: true,
            request_id: recorded.requestId,
            plan: recorded.plan.label,
            amount_usd: recorded.plan.usd,
            message: sessionUser
                ? `Request recorded for ${recorded.plan.label} (US$${recorded.plan.usd}). An operator will activate this account after payment is confirmed. This is not instant unpaid access.`
                : `Request recorded for ${recorded.plan.label}. Sign in (or register) with ${email} so an operator can attach the plan after payment is confirmed.`
        });
    } catch (error) {
        console.error('Subscribe request error:', error);
        return res.status(500).json({ success: false, message: 'Could not record subscription request' });
    }
});

app.post('/api/subscribe/redeem', rateLimiter(10, 15 * 60 * 1000, 'subscribe-redeem'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Sign in to redeem a license key' });
    }
    const code = String(req.body?.key || req.body?.code || '')
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '');
    if (code.length < 8) {
        return res.status(400).json({ success: false, message: 'Enter a valid license key' });
    }
    try {
        const row = await db.getAsync(
            `SELECT * FROM license_keys WHERE upper(code) = ? LIMIT 1`,
            [code]
        );
        if (!row || String(row.status || 'unused') !== 'unused') {
            return res.status(400).json({ success: false, message: 'That license key is not valid or has already been used.' });
        }
        const activation = await activateSubscription(req.session.user.id, row.plan, {
            status: 'license_key',
            orderId: `KEY-${row.id}`
        });
        if (!activation) {
            return res.status(400).json({ success: false, message: 'This key is tied to an unknown plan' });
        }
        await db.runAsync(
            `UPDATE license_keys SET status = 'used', used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [req.session.user.id, row.id]
        );
        req.session.user.subscription_tier = activation.tier;
        req.session.user.subscription_status = 'active';
        req.session.user.subscription_expires_at = activation.expiresAt;
        return req.session.save(() => {
            res.json({
                success: true,
                activated: true,
                tier: activation.tier,
                expires_at: activation.expiresAt,
                message: `${activation.label || activation.tier} is now active on this account.`
            });
        });
    } catch (error) {
        console.error('License redeem error:', error);
        return res.status(500).json({ success: false, message: 'Could not redeem license key' });
    }
});

app.post('/api/admin/license-keys', isAdmin, async (req, res) => {
    const plan = String(req.body?.plan || 'annual');
    if (!CONSUMER_PLANS.includes(plan)) {
        return res.status(400).json({ success: false, message: 'Unknown plan' });
    }
    const count = Math.min(10, Math.max(1, parseInt(req.body?.count, 10) || 1));
    const note = String(req.body?.note || '').slice(0, 200);
    const created = [];
    try {
        for (let i = 0; i < count; i++) {
            const code = makeLicenseCode();
            await db.runAsync(
                `INSERT INTO license_keys (code, plan, status, created_by, note) VALUES (?, ?, 'unused', ?, ?)`,
                [code, plan, req.session.user.id, note || null]
            );
            created.push({ code, plan });
        }
        res.json({ success: true, keys: created, message: `Created ${created.length} unused license key(s).` });
    } catch (error) {
        console.error('License key create error:', error);
        res.status(500).json({ success: false, message: 'Could not create license keys' });
    }
});

app.get('/api/admin/license-keys', isAdmin, async (req, res) => {
    try {
        const rows = await db.allAsync(
            `SELECT id, code, plan, status, created_by, used_by, note, created_at, used_at
             FROM license_keys ORDER BY id DESC LIMIT 100`
        );
        res.json({ success: true, keys: rows || [] });
    } catch (error) {
        console.error('License key list error:', error);
        res.status(500).json({ success: false, message: 'Could not load license keys' });
    }
});

app.post('/api/admin/users/:id/activate-plan', isAdmin, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const plan = String(req.body?.plan || 'annual');
    if (!Number.isFinite(userId) || userId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    if (!CONSUMER_PLANS.includes(plan)) {
        return res.status(400).json({ success: false, message: 'Unknown plan' });
    }
    try {
        const target = await db.getAsync('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        if (!target) return res.status(404).json({ success: false, message: 'User not found' });
        const activation = await activateSubscription(userId, plan, {
            status: 'admin_activate',
            orderId: `ADMIN-USER-${userId}-${Date.now()}`
        });
        if (!activation) return res.status(400).json({ success: false, message: 'Unknown plan' });
        await db.runAsync(
            `UPDATE subscriptions SET status = 'completed' WHERE user_id = ? AND status = 'pending_manual'`,
            [userId]
        );
        if (applyPaidFieldsToSession(req, userId, activation)) {
            await saveSession(req);
        }
        res.json({
            success: true,
            message: `Activated ${activation.label || plan} for ${target.username}.`,
            tier: activation.persisted_tier || activation.tier,
            status: activation.persisted_status || 'active',
            expires_at: activation.expiresAt
        });
    } catch (error) {
        console.error('Admin activate-plan error:', error);
        res.status(500).json({ success: false, message: 'Could not activate plan' });
    }
});

// ============================================================
// B2B ORGANIZATIONS — licensing, seats, custom training
// ============================================================
app.get('/api/org/plans', (req, res) => {
    res.json({ success: true, plans: orgService.catalogPlans(), org_types: orgService.ORG_TYPES });
});

app.get('/api/org/mine', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const rows = await db.allAsync(
            `SELECT o.*, m.role, m.status AS member_status,
                (SELECT COUNT(*) FROM organization_members om
                 WHERE om.org_id = o.id AND om.status = 'active') AS seats_used
             FROM organization_members m
             JOIN organizations o ON o.id = m.org_id
             WHERE m.user_id = ? AND m.status = 'active'
             ORDER BY o.name`,
            [req.session.user.id]
        );
        res.json({
            success: true,
            organizations: rows || [],
            active_access: await orgService.getUserOrgAccess(db, req.session.user.id)
        });
    } catch (err) {
        console.error('org/mine error:', err);
        res.status(500).json({ success: false, message: 'Could not load organizations' });
    }
});

app.post('/api/org/create', rateLimiter(8, 15 * 60 * 1000, 'org-create'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const name = String(req.body?.name || '').trim();
    if (name.length < 2 || name.length > 120) {
        return res.status(400).json({ success: false, message: 'Organization name must be 2–120 characters' });
    }
    try {
        const org = await orgService.createOrganization(db, {
            name,
            orgType: String(req.body?.org_type || 'enterprise'),
            industry: String(req.body?.industry || '').trim() || null,
            contactEmail: req.session.user.email,
            createdBy: req.session.user.id
        });
        res.json({
            success: true,
            organization: org,
            message: 'Organization created. Share the invite code so teammates can join.'
        });
    } catch (err) {
        console.error('org/create error:', err);
        res.status(500).json({ success: false, message: 'Could not create organization' });
    }
});

app.post('/api/org/join', rateLimiter(20, 15 * 60 * 1000, 'org-join'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const result = await orgService.joinWithInvite(db, req.session.user.id, req.body?.invite_code);
        res.json({
            success: true,
            already: result.already,
            organization: {
                id: result.org.id,
                name: result.org.name,
                org_type: result.org.org_type,
                license_status: result.org.license_status
            },
            message: result.already
                ? 'You are already a member of this organization.'
                : `Joined ${result.org.name}. Org license seats unlock Pro access when active.`
        });
    } catch (err) {
        const code = err.code === 'SEAT_LIMIT' ? 403 : err.code === 'NOT_FOUND' ? 404 : 400;
        res.status(code).json({ success: false, message: err.message || 'Could not join' });
    }
});

app.get('/api/org/:id/export.csv', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const orgId = parseInt(req.params.id, 10);
    const member = await orgService.assertOrgRole(db, orgId, req.session.user.id, ['owner', 'admin']);
    if (!member && !userIsAdmin(await getAccessUser(req))) {
        return res.status(403).json({ success: false, message: 'Admin role required' });
    }
    try {
        const pack = await orgService.getOrgRosterCsv(db, orgId);
        if (!pack) return res.status(404).json({ success: false, message: 'Organization not found' });
        res.set('Content-Type', 'text/csv; charset=utf-8');
        res.set('Cache-Control', 'no-store');
        res.set('Content-Disposition', `attachment; filename="${pack.filename}"`);
        res.send(pack.csv);
    } catch (err) {
        console.error('org export error:', err);
        res.status(500).json({ success: false, message: 'Could not export roster' });
    }
});

app.get('/api/org/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const orgId = parseInt(req.params.id, 10);
    try {
        const member = await db.getAsync(
            `SELECT * FROM organization_members WHERE org_id = ? AND user_id = ? AND status = 'active'`,
            [orgId, req.session.user.id]
        );
        if (!member && !userIsAdmin(await getAccessUser(req))) {
            return res.status(403).json({ success: false, message: 'Not a member of this organization' });
        }
        const analytics = await orgService.getOrgAnalytics(db, orgId);
        if (!analytics) return res.status(404).json({ success: false, message: 'Organization not found' });
        const canManage = member && ['owner', 'admin'].includes(member.role);
        res.json({
            success: true,
            role: member?.role || 'admin',
            can_manage: canManage || userIsAdmin(await getAccessUser(req)),
            ...analytics,
            invite_code: (canManage || userIsAdmin(await getAccessUser(req)))
                ? analytics.org.invite_code
                : undefined
        });
    } catch (err) {
        console.error('org/:id error:', err);
        res.status(500).json({ success: false, message: 'Could not load organization' });
    }
});

app.post('/api/org/:id/refresh-invite', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const orgId = parseInt(req.params.id, 10);
    const member = await orgService.assertOrgRole(db, orgId, req.session.user.id, ['owner', 'admin']);
    if (!member && !userIsAdmin(await getAccessUser(req))) {
        return res.status(403).json({ success: false, message: 'Admin role required' });
    }
    const code = orgService.makeInviteCode();
    await db.runAsync('UPDATE organizations SET invite_code = ? WHERE id = ?', [code, orgId]);
    res.json({ success: true, invite_code: code });
});

app.post('/api/org/:id/request-license', rateLimiter(10, 15 * 60 * 1000, 'org-license-req'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const orgId = parseInt(req.params.id, 10);
    const planKey = String(req.body?.plan || 'institution_annual');
    const plan = orgService.LICENSE_PLANS[planKey];
    if (!plan) return res.status(400).json({ success: false, message: 'Unknown license plan' });

    const member = await orgService.assertOrgRole(db, orgId, req.session.user.id, ['owner', 'admin']);
    if (!member && !userIsAdmin(await getAccessUser(req))) {
        return res.status(403).json({ success: false, message: 'Admin role required' });
    }

    const accessUser = await getAccessUser(req);
    // Dev/admin can activate instantly; production requests stay pending for sales
    const canInstant = userIsAdmin(accessUser) || !IS_PROD;
    if (canInstant && (req.body?.activate === true || userIsAdmin(accessUser))) {
        const activated = await orgService.activateLicense(db, orgId, planKey, {
            notes: `Activated by ${req.session.user.email}`
        });
        return res.json({
            success: true,
            activated: true,
            expires_at: activated.expires,
            plan: { key: planKey, ...plan },
            message: `${plan.label} activated for this organization.`
        });
    }

    await db.runAsync(
        `INSERT INTO organization_licenses
         (org_id, plan, seats, amount_nad, status, notes)
         VALUES (?, ?, ?, ?, 'pending', ?)`,
        [orgId, planKey, plan.seats, plan.nad, `Requested by ${req.session.user.email}`]
    );
    res.json({
        success: true,
        activated: false,
        plan: { key: planKey, ...plan },
        message: 'License request submitted. Tribams will confirm payment and activate seats.'
    });
});

app.post('/api/org/:id/custom-training', rateLimiter(10, 15 * 60 * 1000, 'org-custom'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const orgId = parseInt(req.params.id, 10);
    const member = await db.getAsync(
        `SELECT * FROM organization_members WHERE org_id = ? AND user_id = ? AND status = 'active'`,
        [orgId, req.session.user.id]
    );
    if (!member) return res.status(403).json({ success: false, message: 'Members only' });

    const title = String(req.body?.title || '').trim();
    const brief = String(req.body?.brief || '').trim();
    if (title.length < 4 || brief.length < 20) {
        return res.status(400).json({
            success: false,
            message: 'Provide a title and a brief (20+ chars) describing the customized training need.'
        });
    }

    await db.runAsync(
        `INSERT INTO custom_training_requests
         (org_id, requested_by, title, industry_focus, compliance_focus, module_ids, brief, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
            orgId,
            req.session.user.id,
            title.slice(0, 160),
            String(req.body?.industry_focus || '').slice(0, 120) || null,
            String(req.body?.compliance_focus || '').slice(0, 120) || null,
            JSON.stringify(req.body?.module_ids || []),
            brief.slice(0, 4000)
        ]
    );
    res.json({
        success: true,
        message: 'Custom training request submitted. Our team will scope Namibia/industry scenarios for your package.'
    });
});

app.get('/api/admin/orgs', isAdmin, async (req, res) => {
    try {
        const orgs = await db.allAsync(
            `SELECT o.*,
                (SELECT COUNT(*) FROM organization_members m WHERE m.org_id = o.id AND m.status = 'active') AS seats_used
             FROM organizations o ORDER BY o.id DESC`
        );
        const pendingLicenses = await db.allAsync(
            `SELECT l.*, o.name AS org_name FROM organization_licenses l
             JOIN organizations o ON o.id = l.org_id
             WHERE l.status = 'pending' ORDER BY l.id DESC LIMIT 50`
        );
        const pendingCustom = await db.allAsync(
            `SELECT c.*, o.name AS org_name FROM custom_training_requests c
             JOIN organizations o ON o.id = c.org_id
             WHERE c.status IN ('pending', 'in_progress') ORDER BY c.id DESC LIMIT 50`
        );
        res.json({ success: true, organizations: orgs, pending_licenses: pendingLicenses, pending_custom: pendingCustom });
    } catch (err) {
        console.error('admin/orgs error:', err);
        res.status(500).json({ success: false, message: 'Could not load organizations' });
    }
});

app.post('/api/admin/orgs/:id/activate-license', isAdmin, async (req, res) => {
    const orgId = parseInt(req.params.id, 10);
    const planKey = String(req.body?.plan || 'institution_annual');
    try {
        const activated = await orgService.activateLicense(db, orgId, planKey, {
            notes: `Admin activate by ${req.session.user.email}`
        });
        await db.runAsync(
            `UPDATE organization_licenses SET status = 'superseded'
             WHERE org_id = ? AND status = 'pending'`,
            [orgId]
        );
        res.json({ success: true, expires_at: activated.expires, plan: activated.plan });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || 'Activate failed' });
    }
});

app.post('/api/admin/custom-training/:id/status', isAdmin, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const status = String(req.body?.status || 'in_progress');
    const allowed = ['pending', 'in_progress', 'delivered', 'closed'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await db.runAsync(
        `UPDATE custom_training_requests
         SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [status, String(req.body?.admin_notes || '').slice(0, 2000) || null, id]
    );
    res.json({ success: true });
});

app.get('/api/admin/payments', isAdmin, async (req, res) => {
    try {
        const subs = await db.allAsync(
            `SELECT s.*, u.username, u.email FROM subscriptions s
             LEFT JOIN users u ON u.id = s.user_id
             ORDER BY s.id DESC LIMIT 100`
        );
        const licenses = await db.allAsync(
            `SELECT l.*, o.name AS org_name FROM organization_licenses l
             JOIN organizations o ON o.id = l.org_id
             ORDER BY l.id DESC LIMIT 100`
        );
        res.json({ success: true, subscriptions: subs || [], organization_licenses: licenses || [] });
    } catch (err) {
        console.error('admin/payments error:', err);
        res.status(500).json({ success: false, message: 'Could not load payments' });
    }
});

app.post('/api/paypal/capture-order', rateLimiter(20, 15 * 60 * 1000, 'paypal-capture'), async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Login required' });
    }
    const orderId = String(req.body?.orderId || req.body?.token || '').trim();
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Missing PayPal order id' });
    }
    if (!paypalCheckout.isConfigured()) {
        return res.status(503).json({ success: false, message: 'PayPal is not configured' });
    }

    try {
        const pending = await db.getAsync(
            `SELECT * FROM subscriptions WHERE paypal_order_id = ? AND user_id = ? ORDER BY id DESC`,
            [orderId, req.session.user.id]
        );
        if (!pending) {
            return res.status(404).json({
                success: false,
                message: 'No matching checkout found for this account. Start checkout again from /payment.'
            });
        }
        if (pending.status === 'completed' || pending.status === 'active') {
            const user = await getAccessUser(req);
            return res.json({
                success: true,
                already_captured: true,
                tier: user.subscription_tier,
                message: 'Payment already completed. Your plan is active.'
            });
        }

        const captured = await paypalCheckout.captureOrder(orderId);
        if (captured.userId && captured.userId !== req.session.user.id) {
            return res.status(403).json({ success: false, message: 'This payment belongs to a different account.' });
        }

        const planKey = captured.planKey || pending.plan;
        const okStatus = ['COMPLETED', 'APPROVED'].includes(String(captured.status || '').toUpperCase())
            || ['COMPLETED', 'PENDING'].includes(String(captured.captureStatus || '').toUpperCase());
        if (!okStatus) {
            await db.runAsync(
                `UPDATE subscriptions SET status = ? WHERE paypal_order_id = ? AND user_id = ?`,
                [`capture_${captured.status || 'failed'}`, orderId, req.session.user.id]
            );
            return res.status(402).json({
                success: false,
                message: `PayPal did not complete the payment (status: ${captured.status || 'unknown'}).`
            });
        }

        const activation = await activateSubscription(req.session.user.id, planKey, {
            recordSubscription: false,
            orderId,
            captureId: captured.captureId
        });
        if (!activation) {
            return res.status(400).json({ success: false, message: 'Unknown plan on captured order' });
        }

        await db.runAsync(
            `UPDATE subscriptions
             SET status = 'completed', paypal_capture_id = ?, tier = ?, expires_at = ?
             WHERE paypal_order_id = ? AND user_id = ?`,
            [captured.captureId, activation.tier, activation.expiresAt, orderId, req.session.user.id]
        );

        req.session.user.subscription_tier = activation.tier;
        req.session.user.subscription_status = 'active';
        req.session.user.subscription_expires_at = activation.expiresAt;

        logOutbound('paypal_capture_order', {
            user_id: req.session.user.id,
            username: req.session.user.username,
            target: 'paypal',
            path: orderId,
            status_code: 200,
            details: { plan: planKey, captureId: captured.captureId }
        });

        sendPaymentEmailSafe(req.session.user, activation, {
            orderId,
            captureId: captured.captureId
        }).catch(() => {});

        return req.session.save(() => {
            res.json({
                success: true,
                tier: activation.tier,
                expires_at: activation.expiresAt,
                redirect: '/payment-success',
                message: `Payment successful — ${activation.label} is active.`
            });
        });
    } catch (err) {
        console.error('PayPal capture-order error:', err);
        return res.status(502).json({
            success: false,
            message: 'Could not finalize PayPal payment. If you were charged, contact support with your PayPal receipt.'
        });
    }
});

app.get('/api/module-briefing/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const moduleId = parseInt(req.params.id);
    if (!(await assertModuleAccess(req, res, moduleId))) return;
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, briefing: assessmentEngine.getModuleBriefing(module) });
});

app.get('/api/modules', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Login required' });
    }
    const catalog = await getActiveModules();
    let progress = null;
    let accessUser = null;
    if (req.session.user) {
        try {
            accessUser = await getAccessUser(req);
            progress = await snapshotProgress(req.session.user.id, catalog);
        } catch (e) {}
    }
    const annotated = accessControl.annotateModules(catalog, accessUser, ADMIN_EMAILS);
    const modules = annotated.map(m => {
        const levelLocked = progress && !userBypassesProgressLocks(accessUser)
            ? !progressGate.isModuleUnlocked(m, progress)
            : false;
        return {
            ...m,
            ...moduleDefinitions.getModuleDefinition(m),
            phase_id: trainingPhases.getPhaseForModuleId(m.id).id,
            phase_name: trainingPhases.getPhaseForModuleId(m.id).name,
            locked: !!(m.paid_locked || levelLocked),
            level_locked: levelLocked,
            paid_locked: !!m.paid_locked
        };
    });
    const isBeta = accessControl.isBetaTester(accessUser);
    res.json({
        modules,
        progress,
        free_module_ids: accessControl.getFreeModuleIds(),
        access: accessUser ? {
            is_admin: userIsAdmin(accessUser),
            is_beta_tester: isBeta,
            is_pro: accessControl.isProUser(accessUser) || userIsAdmin(accessUser) || isBeta,
            is_pro_plus: accessControl.isProPlusUser(accessUser) || userIsAdmin(accessUser) || isBeta,
            is_special_ops: accessControl.isSpecialOpsUser(accessUser) || userIsAdmin(accessUser) || isBeta,
            subscription_tier: accessUser.subscription_tier || 'free'
        } : null
    });
});

app.post('/api/save-score', async (req, res) => {
    // Legacy endpoint — module drills must use /api/module-quiz/submit (server-side scoring)
    if (!req.session.user) return res.json({ success: false, message: 'Not logged in' });
    return res.status(400).json({
        success: false,
        message: 'Direct score submission disabled. Complete the timed drill so answers are scored on the server.'
    });
});

app.get('/api/progress', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, scores: [] });
    try {
        const catalog = await getActiveModules();
        const progress = await snapshotProgress(req.session.user.id, catalog);
        res.json({ success: true, scores: [...scores].reverse(), progress });
    } catch (error) {
        console.error('Progress error:', error);
        res.json({ success: false, scores: [] });
    }
});

app.get('/api/market-signals', (req, res) => {
    res.json({ success: true, signals: marketSignals.catalogMarketSignals() });
});

app.get('/api/readiness', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    try {
        const catalog = await getActiveModules();
        const scores = await loadUserScores(req.session.user.id);
        const user = await db.getAsync('SELECT username, daily_streak FROM users WHERE id = ?', [req.session.user.id]);
        const profile = assessmentEngine.computeSkillProfile(scores, catalog, user);
        const progress = profile.progress || await snapshotProgress(req.session.user.id, catalog);
        res.json({
            success: true,
            readiness: {
                level: progress.overall_level,
                level_label: progress.level_label,
                force_ready: progress.force_ready,
                completion_pct: progress.completion_pct,
                modules_completed: progress.modules_completed,
                required_for_level: progress.required_for_level,
                remaining_to_gate: progress.remaining_to_gate,
                average_score: progress.average_score,
                message: progress.message,
                phase: progress.phase || null,
                weak_areas: profile.weak_areas,
                strong_areas: profile.strong_areas,
                recommendable: progress.force_ready
                    ? 'Candidate shows sustained multi-module mastery suitable for peer recommendation.'
                    : 'Complete 65% of modules at 70%+ and raise average score to become Force-Ready.'
            }
        });
    } catch (error) {
        console.error('Readiness error:', error);
        res.status(500).json({ success: false, message: 'Error computing readiness' });
    }
});

// ============================================================
// EVIDENCE WORKBENCH LABS
// ============================================================
async function loadLearnerLabSeeds() {
    try {
        const seeds = await db.allAsync(
            `SELECT seed_json FROM learner_lab_seeds
             WHERE quality >= 50
             ORDER BY created_at DESC LIMIT 40`
        );
        const parsed = (seeds || []).map((r) => {
            try { return JSON.parse(r.seed_json); } catch (_) { return null; }
        }).filter(Boolean);
        labEngine.registerLearnerLabs(parsed);
        return parsed.length;
    } catch (_) {
        return 0;
    }
}

app.get('/api/labs', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        await loadLearnerLabSeeds();
        const labs = labEngine.listLabs();
        const rows = await db.allAsync(
            'SELECT lab_id, score, passed, completed_at, content_hash, lab_generation FROM lab_completions WHERE user_id = ?',
            [req.session.user.id]
        );
        const byId = Object.fromEntries((rows || []).map((r) => [r.lab_id, r]));
        const enriched = [];
        for (const l of labs) {
            const version = await labVersioning.getLabVersionInfo(db, l.id);
            const completion = byId[l.id] || null;
            enriched.push({
                ...l,
                content_hash: version.content_hash,
                lab_generation: version.generation,
                user_score: completion != null ? completion.score : null,
                user_passed: completion ? !!completion.passed : false,
                completed_at: completion?.completed_at || null,
                completion_stale: labVersioning.isCompletionStale(completion, version.content_hash)
            });
        }
        res.json({
            success: true,
            total: enriched.length,
            labs: enriched,
            modules_with_labs: labEngine.modulesWithLabs()
        });
    } catch (error) {
        console.error('List labs error:', error);
        res.json({ success: true, total: labEngine.listLabs().length, labs: labEngine.listLabs(), modules_with_labs: labEngine.modulesWithLabs() });
    }
});

app.get('/api/labs/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    if (String(req.params.id || '').startsWith('learner-')) {
        await loadLearnerLabSeeds();
    }
    const sessionKey = String(req.session.user.id);
    const pub = labEngine.getLabPublic(req.params.id, sessionKey);
    if (!pub) return res.status(404).json({ success: false, message: 'Lab not found' });
    const user = await getAccessUser(req);
    const check = accessControl.canAccessModule(pub.module_id, user, ADMIN_EMAILS);
    if (!check.allowed) {
        return res.status(403).json({ success: false, message: check.reason || 'Upgrade required', locked: true });
    }
    const version = await labVersioning.getLabVersionInfo(db, pub.id);
    const completion = await db.getAsync(
        'SELECT lab_id, score, passed, completed_at, content_hash, lab_generation FROM lab_completions WHERE user_id = ? AND lab_id = ?',
        [req.session.user.id, pub.id]
    );
    res.json({
        success: true,
        lab: {
            ...pub,
            content_hash: version.content_hash,
            lab_generation: version.generation,
            completion_stale: labVersioning.isCompletionStale(completion, version.content_hash),
            user_passed: completion ? !!completion.passed : false,
            user_score: completion?.score ?? null
        }
    });
});

app.post('/api/labs/:id/submit', rateLimiter(12, 15 * 60 * 1000, 'lab-submit'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    const labMeta = labEngine.getLab(req.params.id);
    if (!labMeta) return res.status(404).json({ success: false, message: 'Lab not found' });
    const user = await getAccessUser(req);
    const check = accessControl.canAccessModule(labMeta.module_id, user, ADMIN_EMAILS);
    if (!check.allowed) {
        return res.status(403).json({ success: false, message: check.reason || 'Upgrade required' });
    }
    const sessionKey = String(req.session.user.id);
    const result = labEngine.scoreLab(req.params.id, req.body?.answers || {}, sessionKey);
    if (!result) return res.status(400).json({ success: false, message: 'Could not score lab' });
    const version = await labVersioning.getLabVersionInfo(db, result.lab_id);
    try {
        await db.runAsync(
            `INSERT INTO lab_completions
             (user_id, lab_id, module_id, score, earned, max_points, attack_techniques, passed, completed_at, content_hash, lab_generation)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
             ON CONFLICT(user_id, lab_id) DO UPDATE SET
               score=excluded.score,
               earned=excluded.earned,
               max_points=excluded.max_points,
               attack_techniques=excluded.attack_techniques,
               passed=excluded.passed,
               completed_at=excluded.completed_at,
               content_hash=excluded.content_hash,
               lab_generation=excluded.lab_generation`,
            [
                req.session.user.id,
                result.lab_id,
                result.module_id,
                result.score,
                result.earned,
                result.max,
                JSON.stringify(result.attack_techniques_demonstrated || []),
                result.passed ? 1 : 0,
                version.content_hash,
                version.generation
            ]
        );
        res.json({ success: true, result, content_hash: version.content_hash, lab_generation: version.generation });
    } catch (error) {
        console.error('Lab submit error:', error);
        res.status(500).json({ success: false, message: 'Error saving lab result' });
    }
});

async function buildUserTranscript(userId) {
    const user = await db.getAsync(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [userId]
    );
    if (!user) return null;
    const catalog = await getActiveModules();
    const scores = await loadUserScores(userId);
    const labCompletions = await db.allAsync(
        'SELECT lab_id, module_id, score, attack_techniques, passed, completed_at FROM lab_completions WHERE user_id = ? AND passed = 1',
        [userId]
    );
    const certificates = await db.allAsync(
        `SELECT certificate_id, module_name, score, issue_date FROM certificates
         WHERE user_id = ? OR (user_id IS NULL AND recipient_name = ?)
         ORDER BY issue_date DESC LIMIT 20`,
        [userId, user.username]
    );
    let integrityFlags = [];
    try {
        integrityFlags = await db.allAsync(
            'SELECT risk_score, status, created_at FROM quiz_integrity WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [userId]
        );
    } catch (e) {
        integrityFlags = [];
    }
    return readinessTranscript.buildTranscript({
        user,
        scores,
        catalog,
        labCompletions,
        certificates,
        integrityFlags
    });
}

app.get('/api/readiness-transcript', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Login required' });
    try {
        const transcript = await buildUserTranscript(req.session.user.id);
        if (!transcript) return res.status(404).json({ success: false, message: 'User not found' });

        let row = await db.getAsync(
            'SELECT token FROM readiness_tokens WHERE user_id = ?',
            [req.session.user.id]
        );
        if (!row) {
            const token = readinessTranscript.issueToken();
            await db.runAsync(
                'INSERT INTO readiness_tokens (user_id, token, created_at) VALUES (?, ?, datetime(\'now\'))',
                [req.session.user.id, token]
            );
            row = { token };
        }
        res.json({ success: true, token: row.token, transcript, share_url: `/verify-readiness/${row.token}` });
    } catch (error) {
        console.error('Transcript error:', error);
        res.status(500).json({ success: false, message: 'Error building transcript' });
    }
});

app.get('/api/verify-readiness/:token', async (req, res) => {
    try {
        const row = await db.getAsync(
            'SELECT user_id, token FROM readiness_tokens WHERE token = ?',
            [req.params.token]
        );
        if (!row) return res.status(404).json({ success: false, message: 'Transcript token not found' });
        const transcript = await buildUserTranscript(row.user_id);
        if (!transcript) return res.status(404).json({ success: false, message: 'Learner not found' });
        // Privacy: do not expose email on public verify
        delete transcript.learner.email;
        res.json({ success: true, token: row.token, transcript });
    } catch (error) {
        console.error('Verify readiness error:', error);
        res.status(500).json({ success: false, message: 'Error verifying transcript' });
    }
});

app.post('/api/submit-essay', rateLimiter(25, 15 * 60 * 1000, 'essay-submit'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { module_id, question_index, answer } = req.body || {};
    if (!module_id || question_index === undefined || answer == null) {
        return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const cleanAnswer = quizSecurity.sanitizeEssayText(answer);
    if (cleanAnswer.length < 200) {
        return res.status(400).json({ success: false, message: 'Minimum 200 characters of on-topic research required' });
    }

    const qIndex = parseInt(question_index, 10);
    if (!Number.isInteger(qIndex) || qIndex < 0 || qIndex > 24) {
        return res.status(400).json({ success: false, message: 'Invalid essay prompt index' });
    }

    try {
        const moduleId = parseInt(module_id, 10);
        if (!(await assertModuleAccess(req, res, moduleId))) return;

        const module = MODULES.find((m) => m.id === moduleId) || { id: moduleId, name: 'Module', category: 'network', difficulty: 'medium' };
        const learner = await resolveLearnerRank(req);
        const rank = learner.rank || progressiveContent.normalizeRank(module.difficulty);

        let questionText = `Module ${module.name} essay`;
        try {
            const stored = await db.getAsync('SELECT essay_questions FROM module_contents WHERE module_id = ?', [moduleId]);
            const parsed = stored?.essay_questions ? JSON.parse(stored.essay_questions) : [];
            const q = Array.isArray(parsed) ? parsed[qIndex] : null;
            if (typeof q === 'string') questionText = q;
            else if (q && q.question) questionText = q.question;
        } catch (_) { /* keep default */ }

        const graded = essayLearning.scoreEssay({
            answer: cleanAnswer,
            question: questionText,
            category: module.category,
            rankOrDifficulty: rank,
            moduleName: module.name,
            moduleKeywords: moduleDefinitions.moduleKeywords(module)
        });

        await db.runAsync(
            `INSERT OR REPLACE INTO essay_answers
             (user_id, module_id, question_index, answer, score, relevant, submitted_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            [
                req.session.user.id,
                moduleId,
                qIndex,
                cleanAnswer,
                graded.score,
                graded.relevant ? 1 : 0
            ]
        );

        // Shared harvest into module_contents / learner_lab_seeds is disabled for privacy.
        // Essay answers remain private to the learner for scoring and progress only.
        const harvested = { study: false, lab: false, shared: false };

        const existingBadge = await db.getAsync(
            'SELECT id FROM badges WHERE user_id = ? AND badge_name = ?',
            [req.session.user.id, 'First Essay']
        );
        if (!existingBadge) {
            await db.runAsync(
                'INSERT INTO badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)',
                [req.session.user.id, 'First Essay', '✍️']
            );
        }

        const message = graded.relevant
            ? `Essay accepted (${graded.score}%) — relevant research counts toward your module pass.`
            : `Essay saved (${graded.score}%) but not yet relevant. Use module-specific terms, cite controls/actions, and reach ≥${graded.min_required}% with on-topic depth.`;

        res.json({
            success: true,
            message,
            grading: graded,
            harvested,
            mandatory: true,
            weight: graded.weight
        });
    } catch (error) {
        console.error('Essay submission error:', error);
        res.status(500).json({ success: false, message: 'Error saving essay' });
    }
});

app.get('/api/essay-answers/:moduleId', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const moduleId = parseInt(req.params.moduleId);
    try {
        const answers = await db.allAsync(
            'SELECT question_index, answer, submitted_at FROM essay_answers WHERE user_id = ? AND module_id = ?',
            [req.session.user.id, moduleId]
        );
        res.json({ success: true, answers });
    } catch (error) {
        console.error('Fetch essays error:', error);
        res.status(500).json({ success: false, message: 'Error fetching essays' });
    }
});

// ============================================================
// DASHBOARD APIS
// ============================================================
app.get('/api/dashboard-data', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, message: 'Not logged in' });
    
    try {
        const userId = req.session.user.id;
        
        const user = await db.getAsync(
            'SELECT username, email, created_at, daily_streak, subscription_tier, subscription_status, is_beta_tester FROM users WHERE id = ?',
            [userId]
        );
        const catalog = await getActiveModules();
        const scores = await loadUserScores(userId);
        const accessUser = await getAccessUser(req);
        const isAdminUser = userIsAdmin(accessUser);
        const isBeta = accessControl.isBetaTester(accessUser);
        const isPro = accessControl.isProUser(accessUser) || isAdminUser || isBeta;
        
        const certs = await db.allAsync(
            `SELECT certificate_id, module_name, score, issue_date FROM certificates
             WHERE user_id = ? OR (user_id IS NULL AND recipient_name = ?)
             ORDER BY issue_date DESC`,
            [userId, user.username]
        );
        
        const badges = await db.allAsync(
            'SELECT badge_name, badge_icon FROM badges WHERE user_id = ?',
            [userId]
        );

        const storedProfile = await db.getAsync('SELECT skill_breakdown FROM user_skill_profile WHERE user_id = ?', [userId]);
        let domainOverrides = null;
        if (storedProfile?.skill_breakdown) {
            try {
                const parsed = JSON.parse(storedProfile.skill_breakdown);
                // Only use as override if assessment produced real domain values
                if (parsed && Object.values(parsed).some(v => Number(v) > 0)) domainOverrides = parsed;
            } catch (e) {}
        }

        const profile = assessmentEngine.computeSkillProfile(scores, catalog, user, domainOverrides);

        try {
            await db.runAsync(
                `INSERT OR REPLACE INTO user_skill_profile
                 (user_id, overall_level, overall_score, modules_completed, total_attempts, average_score,
                  skill_breakdown, weak_areas, strong_areas, xp_total, last_assessment, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                [
                    userId,
                    profile.overall_level,
                    profile.overall_score,
                    profile.modules_completed,
                    scores.length,
                    profile.overall_score,
                    JSON.stringify(profile.skill_breakdown),
                    JSON.stringify(profile.weak_areas),
                    JSON.stringify(profile.strong_areas),
                    profile.xp_total
                ]
            );
        } catch (e2) {
            console.warn('Skill profile persist skipped:', e2.message);
        }
        
        const progress = profile.progress || await snapshotProgress(req.session.user.id, catalog);
        const integrityStatus = await getUserIntegrityStatus(userId);
        const certResult = await issueProgramCertificateIfEligible(userId, {
            progress,
            integrityStatus,
            createdAt: user.created_at
        });
        let programCerts = filterProgramCertificates(certs);
        if (certResult.certificate && !programCerts.some((c) => c.certificate_id === certResult.certificate)) {
            const fresh = await db.getAsync(
                `SELECT certificate_id, module_name, score, issue_date FROM certificates WHERE certificate_id = ?`,
                [certResult.certificate]
            );
            if (fresh) programCerts = [fresh];
        }
        const recommendations = (profile.recommendations || []).map(r => {
            const check = accessControl.canAccessModule(r.id, accessUser, ADMIN_EMAILS);
            return {
                ...r,
                is_free: accessControl.getFreeModuleIds().includes(r.id),
                paid_locked: !check.allowed,
                upgrade_required: !check.allowed,
                access: check.access
            };
        });

        res.json({
            success: true,
            data: {
                profile: {
                    username: user.username,
                    overall_score: profile.overall_score,
                    modules_completed: profile.modules_completed,
                    streak: profile.streak,
                    overall_level: profile.overall_level,
                    level_label: profile.level_label || progress.level_label,
                    xp_total: profile.xp_total,
                    skill_breakdown: profile.skill_breakdown,
                    weak_areas: profile.weak_areas,
                    strong_areas: profile.strong_areas,
                    needs_assessment: profile.needs_assessment,
                    force_ready: profile.force_ready || progress.force_ready,
                    is_admin: isAdminUser,
                    is_beta_tester: isBeta,
                    is_pro: isPro,
                    subscription_tier: accessUser.subscription_tier,
                    subscription_status: accessUser.subscription_status,
                    subscription_expires_at: accessUser.subscription_expires_at
                },
                progress,
                free_module_ids: accessControl.getFreeModuleIds(),
                access: { is_admin: isAdminUser, is_beta_tester: isBeta, is_pro: isPro },
                stats: {
                    certificates_earned: programCerts.length
                },
                recentScores: [...scores].reverse().slice(0, 5),
                certificates: programCerts.slice(0, 5),
                certificate_progress: {
                    eligible: !!certResult.certificate,
                    hold_reason: certResult.certificate ? null : certResult.certificate_hold,
                    completion_pct: progress.completion_pct,
                    threshold_pct: progress.threshold_pct,
                    remaining: progress.remaining_to_gate
                },
                badges: badges,
                recommendations,
                learningPath: {
                    steps: profile.recommendation_ids,
                    recommendations,
                    currentStep: Math.min(profile.modules_completed, 14),
                    status: profile.modules_completed > 0 || !profile.needs_assessment ? 'active' : 'not_started'
                }
            }
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.json({ success: false, message: 'Error loading dashboard data' });
    }
});

app.get('/api/dashboard-stats', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, message: 'Not logged in' });
    
    try {
        const userId = req.session.user.id;
        
        const modulesCompleted = await db.getAsync(
            'SELECT COUNT(DISTINCT module_name) as count FROM quiz_scores WHERE user_id = ? AND score > 0',
            [userId]
        );
        
        const avgScore = await db.getAsync(
            'SELECT AVG(score) as avg FROM quiz_scores WHERE user_id = ?',
            [userId]
        );
        
        const certificates = await db.getAsync(
            `SELECT COUNT(*) as count FROM certificates
             WHERE user_id = ? OR (user_id IS NULL AND recipient_name = (SELECT username FROM users WHERE id = ?))`,
            [userId, userId]
        );
        
        const user = await db.getAsync(
            'SELECT daily_streak FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            stats: {
                modules_completed: modulesCompleted.count || 0,
                avg_score: Math.round(avgScore.avg || 0),
                certificates_earned: certificates.count || 0,
                streak: user.daily_streak || 0
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Error loading stats' });
    }
});

app.get('/api/daily-stats', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, streak: 0, points: 0 });
    
    try {
        const user = await db.getAsync(
            'SELECT daily_streak FROM users WHERE id = ?',
            [req.session.user.id]
        );
        
        const points = await db.getAsync(
            'SELECT SUM(points) as total FROM daily_progress WHERE user_id = ?',
            [req.session.user.id]
        );
        
        res.json({
            success: true,
            streak: user ? user.daily_streak || 0 : 0,
            points: points ? points.total || 0 : 0
        });
    } catch (error) {
        console.error('Daily stats error:', error);
        res.json({ success: false, streak: 0, points: 0 });
    }
});

// ============================================================
// LEADERBOARD & BADGES
// ============================================================
app.get('/api/leaderboard', async (req, res) => {
    try {
        const data = await db.allAsync(`
            SELECT u.username, 
             COUNT(DISTINCT qs.module_name) as modules_completed,
             SUM(qs.score) as total_score,
             AVG(qs.score) as avg_score,
             MAX(qs.score) as best_score,
             COUNT(DISTINCT CASE WHEN qs.score >= 80 THEN qs.module_name END) as certified_modules
             FROM quiz_scores qs 
             JOIN users u ON qs.user_id = u.id
             GROUP BY u.id
             ORDER BY total_score DESC LIMIT 50
        `);
        res.json({ success: true, leaderboard: data });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Error loading leaderboard' });
    }
});

app.get('/api/badges', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, badges: [] });
    try {
        const badges = await db.allAsync(
            'SELECT badge_name, badge_icon, earned_at FROM badges WHERE user_id = ? ORDER BY earned_at DESC',
            [req.session.user.id]
        );
        res.json({ success: true, badges });
    } catch (error) {
        console.error('Badges error:', error);
        res.status(500).json({ success: false, message: 'Error loading badges' });
    }
});

app.post('/api/award-badge', async (req, res) => {
    if (!req.session.user) return res.json({ success: false });
    const { badge_name, badge_icon } = req.body;
    try {
        const existing = await db.getAsync(
            'SELECT id FROM badges WHERE user_id = ? AND badge_name = ?',
            [req.session.user.id, badge_name]
        );
        if (existing) return res.json({ success: true, alreadyEarned: true });
        await db.runAsync('INSERT INTO badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)', 
            [req.session.user.id, badge_name, badge_icon]);
        res.json({ success: true });
    } catch (error) {
        console.error('Award badge error:', error);
        res.status(500).json({ success: false, message: 'Error awarding badge' });
    }
});

// ============================================================
// CERTIFICATES & PDF GENERATION
// ============================================================
app.get('/api/verify-certificate/:id', async (req, res) => {
    try {
        const cert = await db.getAsync(
            `SELECT certificate_id, recipient_name, module_name, score, issue_date, user_id
             FROM certificates WHERE certificate_id = ? AND verified = 1`,
            [req.params.id.toUpperCase()]
        );
        if (!cert) return res.json({ success: true, valid: false });
        res.json({ success: true, valid: true, certificate: publicCertificatePayload(cert) });
    } catch (error) {
        console.error('Certificate verification error:', error);
        res.status(500).json({ success: false, message: 'Error verifying certificate' });
    }
});

app.get('/api/user/certificates', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    try {
        const userId = req.session.user.id;
        const user = await db.getAsync('SELECT username FROM users WHERE id = ?', [userId]);
        const certs = await db.allAsync(
            `SELECT certificate_id, module_name, score, issue_date FROM certificates
             WHERE user_id = ? OR (user_id IS NULL AND recipient_name = ?)
             ORDER BY issue_date DESC`,
            [userId, user?.username || '']
        );
        res.json({ success: true, certificates: filterProgramCertificates(certs) });
    } catch (error) {
        console.error('Certificates error:', error);
        res.status(500).json({ success: false, message: 'Error loading certificates' });
    }
});

app.get('/api/certificate/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    try {
        const cert = await db.getAsync(
            `SELECT certificate_id, recipient_name, module_name, score, issue_date, user_id, verified
             FROM certificates WHERE certificate_id = ?`,
            [req.params.id.toUpperCase()]
        );
        if (!cert || !cert.verified) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        const accessUser = await getAccessUser(req);
        const isAdminUser = userIsAdmin(accessUser);
        const isOwner = cert.user_id != null && Number(cert.user_id) === Number(req.session.user.id);
        const user = await db.getAsync('SELECT username FROM users WHERE id = ?', [req.session.user.id]);
        const legacyOwner = cert.user_id == null && user?.username && cert.recipient_name === user.username;
        if (!isOwner && !legacyOwner && !isAdminUser) {
            return res.status(403).json({ success: false, message: 'You can only view your own certificates' });
        }

        res.json({ success: true, certificate: publicCertificatePayload(cert) });
    } catch (error) {
        console.error('Certificate view error:', error);
        res.status(500).json({ success: false, message: 'Error loading certificate' });
    }
});

app.get('/api/certificate/:id/pdf', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    try {
        const cert = await db.getAsync(
            `SELECT certificate_id, recipient_name, module_name, score, issue_date, user_id
             FROM certificates WHERE certificate_id = ? AND verified = 1`,
            [req.params.id.toUpperCase()]
        );
        
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

        const accessUser = await getAccessUser(req);
        const isAdminUser = userIsAdmin(accessUser);
        const isOwner = cert.user_id != null && Number(cert.user_id) === Number(req.session.user.id);
        if (!isOwner && !isAdminUser) {
            return res.status(403).json({ success: false, message: 'You can only download your own certificates' });
        }
        
        const doc = new PDFDocument({ 
            size: 'A4', 
            layout: 'landscape', 
            margins: { top: 50, bottom: 50, left: 50, right: 50 } 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Tribams_Certificate_${cert.certificate_id}.pdf`);
        doc.pipe(res);
        
        doc.rect(30, 30, 752, 532).lineWidth(3).stroke('#d4af37');
        doc.rect(40, 40, 732, 512).lineWidth(1.5).stroke('#b8860b');
        
        const cx = 421;
        const boxW = 520;
        const left = cx - boxW / 2;

        doc.fontSize(32).fillColor('#1a1205').text('TRIBAMS', left, 70, { align: 'center', width: boxW });
        doc.fontSize(13).fillColor('#6b6358').text('Certificate of Training Completion', left, 112, { align: 'center', width: boxW });
        
        doc.moveTo(left + 80, 132).lineTo(left + boxW - 80, 132).lineWidth(2).stroke('#d4af37');
        
        doc.fontSize(20).fillColor('#3d3428').text('CERTIFICATE OF COMPLETION', left, 148, { align: 'center', width: boxW });
        doc.fontSize(12).fillColor('#7a7268').text('This certifies that', left, 188, { align: 'center', width: boxW });
        
        doc.fontSize(28).fillColor('#1a1205').text(cert.recipient_name || req.session.user.username, left, 218, { 
            align: 'center', 
            width: boxW,
            underline: true 
        });
        
        doc.fontSize(14).fillColor('#7a7268').text('has successfully completed', left, 268, { align: 'center', width: boxW });
        doc.fontSize(18).fillColor('#3d3428').text(cert.module_name, left, 292, { align: 'center', width: boxW });
        doc.fontSize(14).fillColor('#6b6358').text(`Program average (first passes): ${cert.score}%`, left, 328, { align: 'center', width: boxW });
        
        doc.fontSize(10).fillColor('#6b6358').text(`Issue Date: ${new Date(cert.issue_date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        })}`, left, 368, { align: 'center', width: boxW });
        
        doc.fontSize(9).fillColor('#8a8278').text(`Certificate ID: ${cert.certificate_id}`, left, 388, { align: 'center', width: boxW });
        
        doc.circle(cx, 432, 35).fill('#d4af37');
        doc.fillColor('#1a1205').fontSize(18).text('✓', cx - 17, 420, { align: 'center', width: 34 });
        doc.fontSize(8).fillColor('#3d3428').text('VERIFIED', cx - 17, 444, { align: 'center', width: 34 });
        
        const verifyBase = String(process.env.APP_BASE_URL || 'https://tribams.com').replace(/\/$/, '');
        doc.fontSize(8).fillColor('#999').text(`Verify this certificate at: ${verifyBase}/verify?id=${encodeURIComponent(cert.certificate_id)}`, left, 498, { align: 'center', width: boxW });
        doc.fontSize(7).fillColor('#bbb').text('© TRIBAMS — Excellence in Cybersecurity Education', left, 518, { align: 'center', width: boxW });
        
        doc.end();
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ success: false, message: 'Error generating PDF' });
    }
});

app.get('/api/module/:id/pdf-guide', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const id = parseInt(req.params.id);
    try {
        const content = await db.getAsync('SELECT * FROM module_contents WHERE module_id = ?', [id]);
        const module = MODULES.find(m => m.id === id);
        if (!content || !module) return res.status(404).json({ success: false, message: 'Module not found' });
        
        const doc = new PDFDocument({ 
            size: 'A4', 
            margins: { top: 70, bottom: 50, left: 50, right: 50 } 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Tribams_${module.name.replace(/\s/g, '_')}_Study_Guide.pdf`);
        doc.pipe(res);
        
        doc.fontSize(28).fillColor('#0d47a1').text('TRIBAMS', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(20).fillColor('#1a237e').text(module.name, { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(12).fillColor('#555').text(`Difficulty: ${module.difficulty.toUpperCase()} | Category: ${module.category.replace('-', ' ').toUpperCase()}`, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#999').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
        
        doc.moveDown(2);
        doc.lineWidth(1).moveTo(100, doc.y).lineTo(500, doc.y).stroke('#ddd');
        doc.moveDown(2);
        
        doc.fontSize(16).fillColor('#1a237e').text('Table of Contents', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(11).fillColor('#555');
        doc.text('1. Introduction ...................... 3');
        doc.text('2. Key Concepts ...................... 4');
        doc.text('3. Main Topics ...................... 6');
        doc.text('4. Best Practices ................... 8');
        doc.text('5. Advanced Strategies ............. 10');
        doc.text('6. Conclusion ........................ 12');
        doc.text('7. Appendix .......................... 13');
        doc.addPage();
        
        const lines = content.content.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('# ')) {
                doc.fontSize(24).fillColor('#0d47a1');
                doc.text(line.substring(2), { align: 'center' });
                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#333');
            } else if (line.startsWith('## ')) {
                if (doc.y > 700) doc.addPage();
                doc.fontSize(18).fillColor('#1a237e');
                doc.text(line.substring(3));
                doc.moveDown(0.3);
                doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke('#0d47a1');
                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#333');
            } else if (line.startsWith('### ')) {
                if (doc.y > 700) doc.addPage();
                doc.fontSize(14).fillColor('#283593');
                doc.text(line.substring(4));
                doc.moveDown(0.2);
                doc.fontSize(11).fillColor('#333');
            } else if (line.startsWith('- ')) {
                if (doc.y > 700) doc.addPage();
                doc.text(`• ${line.substring(2)}`, { indent: 20 });
            } else if (line.trim()) {
                if (doc.y > 700) doc.addPage();
                doc.fontSize(11).fillColor('#333').text(line.trim());
                doc.moveDown(0.2);
            }
        }
        
        doc.addPage();
        doc.fontSize(20).fillColor('#0d47a1').text('Appendix', { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(12).fillColor('#333');
        doc.text('Recommended Resources:');
        doc.moveDown(0.5);
        doc.text('1. NIST Cybersecurity Framework - https://www.nist.gov/cyberframework');
        doc.text('2. OWASP Top 10 - https://owasp.org/www-project-top-ten/');
        doc.text('3. SANS Institute - https://www.sans.org/');
        doc.text('4. MITRE ATT&CK Framework - https://attack.mitre.org/');
        
        doc.end();
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ success: false, message: 'Error generating PDF' });
    }
});

// ============================================================
// DARK WEB APIS
// ============================================================
app.post('/api/darkweb/scan', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, message: 'Not logged in' });
    
    const { email } = req.body;
    logOutbound('darkweb_scan', {
        target: 'breach_intelligence_check',
        user_id: req.session.user.id,
        username: req.session.user.username,
        email_domain: (email || '').split('@')[1] || null
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const breaches = [
        { name: 'LinkedIn', date: '2021-06-22', data: 'Email, Password' },
        { name: 'Adobe', date: '2013-10-04', data: 'Email, Password Hint' },
        { name: 'Dropbox', date: '2012-07-12', data: 'Email, Password' }
    ];

    const compromised = Math.random() > 0.4;
    const found = compromised ? breaches.slice(0, Math.floor(Math.random() * 2) + 1) : [];

    try {
        await db.runAsync(
            'INSERT INTO darkweb_scans (user_id, email, compromised, breaches) VALUES (?, ?, ?, ?)',
            [req.session.user.id, email, compromised ? 1 : 0, JSON.stringify(found)]
        );
        res.json({ success: true, email, compromised, breaches: found, scanDate: new Date().toISOString() });
    } catch (error) {
        console.error('Darkweb scan error:', error);
        res.status(500).json({ success: false, message: 'Scan error' });
    }
});

app.get('/api/darkweb/history', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, history: [] });
    try {
        const history = await db.allAsync(
            'SELECT * FROM darkweb_scans WHERE user_id = ? ORDER BY scan_date DESC',
            [req.session.user.id]
        );
        res.json({ success: true, history });
    } catch (error) {
        console.error('Darkweb history error:', error);
        res.json({ success: false, history: [] });
    }
});

// ============================================================
// SCENARIOS APIS
// ============================================================
app.get('/api/scenario/:moduleId', async (req, res) => {
    const moduleId = parseInt(req.params.moduleId);
    if (!(await assertModuleAccess(req, res, moduleId))) return;
    const startDate = new Date('2025-01-01');
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const dayNumber = (days % 90) + 1;
    const module = MODULES.find(m => m.id === moduleId) || {
        id: moduleId,
        name: 'Incident Response',
        category: 'forensics',
        difficulty: 'medium'
    };

    try {
        // Deterministic professional scenario for module + day
        const scenario = assessmentEngine.generateDailyScenario(module, dayNumber);

        await db.runAsync(
            `INSERT INTO daily_scenarios
             (module_id, day_number, question, options, correct_answer, explanation, category, difficulty)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(module_id, day_number) DO UPDATE SET
               question=excluded.question,
               options=excluded.options,
               correct_answer=excluded.correct_answer,
               explanation=excluded.explanation,
               category=excluded.category,
               difficulty=excluded.difficulty`,
            [
                moduleId,
                dayNumber,
                scenario.question,
                JSON.stringify(scenario.options),
                scenario.correct,
                scenario.explanation,
                scenario.category,
                scenario.difficulty
            ]
        );

        // Lock Matte K while this scenario is open (other tabs included)
        if (req.session) {
            req.session.scenarioActive = { moduleId, dayNumber, startedAt: Date.now() };
            req.session.matteExamLock = { until: Date.now() + 45 * 60 * 1000, reason: 'scenario' };
        }

        const finish = () => res.json({
            scenario,
            day: dayNumber,
            integrity: 'Matte K is locked during scenarios.'
        });
        if (req.session && typeof req.session.save === 'function') {
            return req.session.save((err) => {
                if (err) console.warn('Scenario session save:', err.message);
                finish();
            });
        }
        return finish();
    } catch (error) {
        console.error('Scenario error:', error);
        res.status(500).json({ success: false, message: 'Error loading scenario' });
    }
});

app.post('/api/scenario/:moduleId/submit', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, message: 'Not logged in' });
    
    const moduleId = parseInt(req.params.moduleId);
    const { selectedOption, correctAnswer, timeRemaining } = req.body;
    const startDate = new Date('2025-01-01');
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const dayNumber = (days % 90) + 1;
    const module = MODULES.find(m => m.id === moduleId);

    try {
        const stored = await db.getAsync(
            'SELECT * FROM daily_scenarios WHERE module_id = ? AND day_number = ?',
            [moduleId, dayNumber]
        );
        let expectedCorrect = stored ? stored.correct_answer : null;
        if (expectedCorrect === null && module) {
            expectedCorrect = assessmentEngine.generateDailyScenario(module, dayNumber).correct;
        }
        if (typeof correctAnswer === 'number' && expectedCorrect === null) {
            expectedCorrect = correctAnswer;
        }

        const timedOut = typeof timeRemaining === 'number' && timeRemaining <= 0;
        const isCorrect = !timedOut && selectedOption === expectedCorrect;
        let pointsEarned = isCorrect ? 15 : timedOut ? 0 : 3;
        // Speed bonus under pressure
        if (isCorrect && typeof timeRemaining === 'number' && timeRemaining > 20) pointsEarned += 5;

        const userId = req.session.user.id;

        await db.runAsync(
            `INSERT OR REPLACE INTO daily_progress (user_id, module_id, day_number, attempted, correct, points, completed_at)
             VALUES (?, ?, ?, 1, ?, ?, datetime('now'))`,
            [userId, moduleId, dayNumber, isCorrect ? 1 : 0, pointsEarned]
        );

        const todayStr = today.toISOString().slice(0, 10);
        const user = await db.getAsync('SELECT daily_streak, last_daily_attempt FROM users WHERE id = ?', [userId]);
        let streak = user?.daily_streak || 0;
        
        if (user?.last_daily_attempt !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().slice(0, 10);
            const yesterdayProgress = await db.getAsync(
                'SELECT id FROM daily_progress WHERE user_id = ? AND date(completed_at) = ?',
                [userId, yStr]
            );
            if (yesterdayProgress) { streak += 1; } else { streak = 1; }
            await db.runAsync(
                'UPDATE users SET daily_streak = ?, last_daily_attempt = ? WHERE id = ?',
                [streak, todayStr, userId]
            );
        }

        const explanation = stored?.explanation
            || (module ? assessmentEngine.generateDailyScenario(module, dayNumber).explanation : '');

        delete req.session.scenarioActive;
        delete req.session.matteExamLock;

        res.json({
            success: true,
            correct: isCorrect,
            pointsEarned,
            streak,
            timedOut,
            explanation,
            message: timedOut
                ? '⏱️ Time expired — in a real attack, hesitation can cost containment windows.'
                : isCorrect
                    ? `✅ Sound decision under pressure! +${pointsEarned} points`
                    : `❌ Not the safest move. +${pointsEarned} participation. Review the debrief.`
        });
    } catch (error) {
        console.error('Scenario submission error:', error);
        res.status(500).json({ success: false, message: 'Error submitting scenario' });
    }
});

// ============================================================
// CONTACT & LEADS APIS
// ============================================================
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, category, message, company } = req.body;
    if (!name || !email || !subject || !message) {
        return res.json({ success: false, message: 'All fields required' });
    }
    
    try {
        await db.runAsync(
            'INSERT INTO feedback (username, email, company, type, message) VALUES (?, ?, ?, ?, ?)',
            [
                String(name).slice(0, 120),
                String(email).slice(0, 200),
                company ? String(company).slice(0, 160) : null,
                category || 'general',
                `${subject}: ${message}`
            ]
        );
        console.log(`📧 Contact form submitted by ${name} <${email}>`);
        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.json({ success: false, message: 'Error sending message' });
    }
});

app.post('/api/sales-lead', rateLimiter(8, 15 * 60 * 1000, 'sales-lead'), async (req, res) => {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const company = String(req.body?.company || '').trim();
    const message = String(req.body?.message || '').trim();
    if (name.length < 2 || !email.includes('@') || company.length < 2 || message.length < 20) {
        return res.status(400).json({
            success: false,
            message: 'Provide name, work email, company, and a short brief (20+ characters).'
        });
    }
    try {
        await db.runAsync(
            `INSERT INTO sales_leads (name, email, company, role, seats, country, message, source, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
            [
                name.slice(0, 120),
                email.slice(0, 200),
                company.slice(0, 160),
                String(req.body?.role || '').slice(0, 80) || null,
                parseInt(req.body?.seats, 10) || null,
                String(req.body?.country || '').slice(0, 80) || null,
                message.slice(0, 4000),
                String(req.body?.source || 'teams').slice(0, 40)
            ]
        );
        res.json({
            success: true,
            message: 'Request received. A Tribams operator will reply with a USD quote and next steps.'
        });
    } catch (error) {
        console.error('Sales lead error:', error);
        res.status(500).json({ success: false, message: 'Could not save request' });
    }
});

app.get('/api/admin/sales-leads', isAdmin, async (req, res) => {
    try {
        const rows = await db.allAsync('SELECT * FROM sales_leads ORDER BY id DESC LIMIT 200');
        let pendingSubs = [];
        try {
            pendingSubs = await db.allAsync(
                `SELECT s.id, s.user_id, s.plan, s.tier, s.status, s.amount_usd, s.created_at, u.username, u.email
                 FROM subscriptions s
                 LEFT JOIN users u ON u.id = s.user_id
                 WHERE s.status IN ('pending_manual', 'pending')
                 ORDER BY s.id DESC LIMIT 100`
            );
        } catch (_) { /* older DBs */ }
        res.json({
            success: true,
            leads: rows || [],
            pending_subscriptions: pendingSubs || []
        });
    } catch (error) {
        console.error('Admin sales leads error:', error);
        res.status(500).json({ success: false, message: 'Could not load sales leads' });
    }
});

app.post('/api/health-check-lead', async (req, res) => {
    const { email, score } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });
    
    try {
        await db.runAsync(
            'INSERT OR IGNORE INTO leads (email, score) VALUES (?, ?)',
            [email, score || 0]
        );
        res.json({ success: true, message: 'Lead captured' });
    } catch (error) {
        console.error('Lead capture error:', error);
        res.json({ success: false, message: 'Error capturing lead' });
    }
});

function parsePositiveUsd(value) {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
}

/** Paid rows only. Prefer amount_usd; NAD-only historical rows convert at NAD_PER_USD (footnote, not checkout). */
function sumRecognizedUsd(rows, usdField, nadField, paidStatuses) {
    const paid = new Set(paidStatuses);
    let usd = 0;
    let nadOnlyRows = 0;
    let nadOnlyConvertedUsd = 0;
    for (const row of rows || []) {
        const status = String(row.status || '').toLowerCase();
        if (!paid.has(status)) continue;
        const listedUsd = parsePositiveUsd(row[usdField]);
        if (listedUsd != null) {
            usd += listedUsd;
            continue;
        }
        const nad = parsePositiveUsd(row[nadField]);
        if (nad == null) continue;
        const converted = pricingCatalog.usdFromNad(nad);
        usd += converted;
        nadOnlyConvertedUsd += converted;
        nadOnlyRows += 1;
    }
    return {
        usd: Number(usd.toFixed(2)),
        nadOnlyRows,
        nadOnlyConvertedUsd: Number(nadOnlyConvertedUsd.toFixed(2))
    };
}

// ============================================================
// ADMIN MANAGEMENT APIS
// ============================================================
app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
        const totalUsers = await db.getAsync('SELECT COUNT(*) as count FROM users');
        const totalQuizzes = await db.getAsync('SELECT COUNT(*) as count FROM quiz_scores');
        const avgScore = await db.getAsync('SELECT AVG(score) as avg FROM quiz_scores');
        const totalCertificates = await db.getAsync('SELECT COUNT(*) as count FROM certificates');
        const activeUsers = await db.getAsync(
            'SELECT COUNT(*) as count FROM users WHERE last_active > datetime("now", "-24 hours")'
        );
        const totalOrgs = await db.getAsync('SELECT COUNT(*) as count FROM organizations');
        const activeOrgLicenses = await db.getAsync(
            `SELECT COUNT(*) as count FROM organizations
             WHERE license_status IN ('active', 'trialing', 'paid')
               AND (license_expires_at IS NULL OR license_expires_at > datetime('now'))`
        );
        const seatsUsed = await db.getAsync(
            `SELECT COUNT(*) as count FROM organization_members WHERE status = 'active'`
        );
        const pendingLicenses = await db.getAsync(
            `SELECT COUNT(*) as count FROM organization_licenses WHERE status = 'pending'`
        );
        const subscriptionRows = await db.allAsync(
            `SELECT amount_usd, amount, status FROM subscriptions`
        );
        const licenseRows = await db.allAsync(
            `SELECT amount_usd, amount_nad, status FROM organization_licenses`
        );
        const subRev = sumRecognizedUsd(
            subscriptionRows,
            'amount_usd',
            'amount',
            ['completed', 'active', 'paid']
        );
        const licRev = sumRecognizedUsd(
            licenseRows,
            'amount_usd',
            'amount_nad',
            ['active', 'paid', 'completed']
        );
        const nadOnlyRows = subRev.nadOnlyRows + licRev.nadOnlyRows;
        const totalRevenue = Number((subRev.usd + licRev.usd).toFixed(2));

        res.json({
            success: true,
            totalUsers: totalUsers.count,
            totalQuizzes: totalQuizzes.count,
            avgScore: Math.round(avgScore.avg || 0),
            totalCertificates: totalCertificates.count,
            totalRevenue,
            revenueCurrency: 'USD',
            revenueSubscriptionsUsd: subRev.usd,
            revenueLicensesUsd: licRev.usd,
            revenueNadOnlyRows: nadOnlyRows,
            revenueNadPerUsd: pricingCatalog.FX,
            activeUsers: activeUsers.count,
            totalOrgs: totalOrgs.count || 0,
            activeOrgLicenses: activeOrgLicenses.count || 0,
            orgSeatsUsed: seatsUsed.count || 0,
            pendingLicenseRequests: pendingLicenses.count || 0
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Error loading stats' });
    }
});

app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
        const users = await db.allAsync(`
            SELECT u.id, u.username, u.email, u.created_at, u.status,
                   u.subscription_tier, u.subscription_status, u.subscription_expires_at,
                   COALESCE(s.modules_completed, 0) AS modules_completed,
                   s.best_score
            FROM users u
            LEFT JOIN (
                SELECT user_id,
                       COUNT(DISTINCT module_name) AS modules_completed,
                       MAX(score) AS best_score
                FROM quiz_scores
                GROUP BY user_id
            ) s ON s.user_id = u.id
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, users });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ success: false, message: 'Error loading users' });
    }
});

app.get('/api/admin/users/:id', isAdmin, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (!Number.isFinite(userId) || userId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    try {
        const user = await db.getAsync(
            `SELECT u.id, u.username, u.email, u.created_at, u.status,
                    u.subscription_tier, u.subscription_status, u.subscription_expires_at,
                    COALESCE((
                        SELECT COUNT(DISTINCT module_name) FROM quiz_scores qs WHERE qs.user_id = u.id
                    ), 0) AS modules_completed
             FROM users u WHERE u.id = ?`,
            [userId]
        );
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        console.error('Admin user view error:', error);
        res.status(500).json({ success: false, message: 'Error loading user' });
    }
});

async function adminDeleteUserHandler(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (!Number.isFinite(userId) || userId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    try {
        const target = await db.getAsync(
            'SELECT id, username, email, profile_picture, status FROM users WHERE id = ?',
            [userId]
        );
        if (!target) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (req.session.user && Number(req.session.user.id) === userId) {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete your own admin account while signed in.'
            });
        }

        if (userIsAdmin(target)) {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete another admin account. Remove them from ADMIN_EMAILS first if needed.'
            });
        }

        await accountPrivacy.purgeUserAccount(db, target, { removeStoredProfileFile });

        console.log(`Admin ${req.session.user.email} deleted user #${userId} (${target.username})`);
        res.json({
            success: true,
            message: `User “${target.username}” deleted.`,
            deleted_id: userId
        });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ success: false, message: 'Could not delete user' });
    }
}

app.delete('/api/admin/users/:id', isAdmin, adminDeleteUserHandler);
app.post('/api/admin/users/:id/delete', isAdmin, adminDeleteUserHandler);

app.get('/api/admin/certificates', isAdmin, async (req, res) => {
    try {
        const certificates = await db.allAsync('SELECT * FROM certificates ORDER BY issue_date DESC');
        res.json({ success: true, certificates });
    } catch (error) {
        console.error('Admin certificates error:', error);
        res.status(500).json({ success: false, message: 'Error loading certificates' });
    }
});

app.get('/api/admin/feedback', isAdmin, async (req, res) => {
    try {
        const feedback = await db.allAsync('SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50');
        res.json({ success: true, feedback });
    } catch (error) {
        console.error('Admin feedback error:', error);
        res.status(500).json({ success: false, message: 'Error loading feedback' });
    }
});

app.get('/api/content-freshness', isAdmin, async (req, res) => {
    try {
        const catalog = await getActiveModules();
        const modules = await contentRefresh.getContentFreshness(db, catalog);
        const dueCount = modules.filter((m) => m.due).length;
        res.json({
            success: true,
            cycle_days: contentRefresh.REFRESH_CYCLE_DAYS,
            trend_pack: contentRefresh.currentTrendPack().key,
            due_count: dueCount,
            modules
        });
    } catch (error) {
        console.error('Content freshness error:', error);
        res.status(500).json({ success: false, message: 'Error loading content freshness' });
    }
});

app.post('/api/admin/refresh-content', isAdmin, async (req, res) => {
    try {
        const catalog = await getActiveModules();
        const moduleId = parseInt(req.body?.module_id, 10);
        const force = req.body?.force === true || req.query.force === '1';
        if (moduleId) {
            const mod = catalog.find((m) => m.id === moduleId);
            if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
            const result = await contentRefresh.refreshModuleContent(db, mod, { force, rank: req.body?.rank });
            return res.json({ success: true, ...result });
        }
        const summary = await contentRefresh.refreshAllModulesIfDue(db, catalog, { force });
        res.json({ success: true, ...summary });
    } catch (error) {
        console.error('Admin refresh-content error:', error);
        res.status(500).json({ success: false, message: 'Content refresh failed' });
    }
});

app.get('/api/admin/labs', isAdmin, async (req, res) => {
    try {
        const labs = await db.allAsync('SELECT * FROM custom_labs ORDER BY created_at DESC');
        res.json({ success: true, labs });
    } catch (error) {
        console.error('Admin labs error:', error);
        res.status(500).json({ success: false, message: 'Error loading labs' });
    }
});

app.get('/api/admin/activity', isAdmin, async (req, res) => {
    try {
        const direction = (req.query.direction || 'all').toLowerCase();
        const limit = Math.min(parseInt(req.query.limit) || 100, 300);
        let rows;
        if (direction === 'inbound' || direction === 'outbound') {
            rows = await db.allAsync(
                `SELECT * FROM process_monitor WHERE direction = ? ORDER BY created_at DESC LIMIT ?`,
                [direction, limit]
            );
        } else {
            rows = await db.allAsync(
                `SELECT * FROM process_monitor ORDER BY created_at DESC LIMIT ?`,
                [limit]
            );
        }

        const summary = await db.getAsync(`
            SELECT
              SUM(CASE WHEN direction='inbound' THEN 1 ELSE 0 END) as inbound_count,
              SUM(CASE WHEN direction='outbound' THEN 1 ELSE 0 END) as outbound_count,
              SUM(CASE WHEN created_at >= datetime('now','-1 hour') THEN 1 ELSE 0 END) as last_hour,
              SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count
            FROM process_monitor
            WHERE created_at >= datetime('now','-24 hours')
        `);

        res.json({
            success: true,
            summary: {
                inbound_24h: summary?.inbound_count || 0,
                outbound_24h: summary?.outbound_count || 0,
                last_hour: summary?.last_hour || 0,
                errors_24h: summary?.error_count || 0
            },
            activity: rows
        });
    } catch (error) {
        console.error('Admin activity error:', error);
        res.status(500).json({ success: false, message: 'Error loading process activity' });
    }
});

app.delete('/api/admin/activity', isAdmin, async (req, res) => {
    try {
        await db.runAsync(`DELETE FROM process_monitor WHERE created_at < datetime('now','-7 days')`);
        res.json({ success: true, message: 'Cleared process logs older than 7 days' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not clear logs' });
    }
});

app.post('/api/admin/labs/create', isAdmin, async (req, res) => {
    const { module_name, icon, description, difficulty, questions } = req.body;
    if (!module_name || !questions || !Array.isArray(questions) || questions.length < 3) {
        return res.json({ success: false, message: 'Invalid lab data' });
    }
    
    try {
        await db.runAsync(
            `INSERT INTO custom_labs (module_name, icon, description, difficulty, questions)
             VALUES (?, ?, ?, ?, ?)`,
            [module_name, icon || '📚', description || '', difficulty || 'intermediate', JSON.stringify(questions)]
        );
        res.json({ success: true, message: 'Lab created successfully' });
    } catch (error) {
        console.error('Create lab error:', error);
        res.status(500).json({ success: false, message: 'Error creating lab' });
    }
});

app.delete('/api/admin/labs/:id', isAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.runAsync('DELETE FROM custom_labs WHERE id = ?', [id]);
        res.json({ success: true, message: 'Lab deleted' });
    } catch (error) {
        console.error('Delete lab error:', error);
        res.status(500).json({ success: false, message: 'Error deleting lab' });
    }
});

// ============================================================
// CUSTOM LAB USER ENDPOINT
// ============================================================
app.get('/api/custom-lab/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const lab = await db.getAsync('SELECT * FROM custom_labs WHERE id = ? AND active = 1', [id]);
        if (!lab) return res.status(404).json({ success: false, message: 'Lab not found' });
        res.json({ success: true, lab });
    } catch (error) {
        console.error('Custom lab error:', error);
        res.status(500).json({ success: false, message: 'Error loading lab' });
    }
});

// ============================================================
// GLOBAL ERROR & SHUTDOWN HANDLING
// ============================================================
app.use((req, res) => {
    if (wantsJson(req)) {
        return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(404);
    return sendView(res, '404.html');
});

app.use((err, req, res, next) => {
    console.error('Unhandled express error:', err.stack || err);
    if (res.headersSent) return next(err);
    if (wantsJson(req)) {
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
    return res.status(500).send('An internal server error occurred.');
});

async function initializeServer() {
    try {
        await initDatabase();
        await seedModules();
        await seedModuleContents();
        const catalog = await getActiveModules();
        const refreshSummary = await contentRefresh.refreshAllModulesIfDue(db, catalog);
        if (refreshSummary.refreshed > 0) {
            console.log(`🔄 Quarterly content refresh: ${refreshSummary.refreshed}/${refreshSummary.total} modules updated`);
        }
        await labVersioning.syncLabGenerations(db);
        await seedFounderNews(db);
        console.log('✅ All systems initialized!');
    } catch (error) {
        console.error('❌ Server initialization failed:', error);
        process.exit(1);
    }
}

async function startServer() {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 HTTP listening on 0.0.0.0:${PORT} (database + seed in progress…)`);
    });

    const shutdown = () => {
        console.log('\n🛑 Gracefully shutting down...');
        server.close(async () => {
            try {
                if (db) {
                    await db.close();
                    console.log(`✅ Database disconnected (${db.dialect}).`);
                }
            } catch (err) {
                console.error('Error closing database:', err);
            }
            process.exit(0);
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    db = await createDatabase(databaseDir);
    await initializeServer();
    serverInitComplete = true;

    const emailService = require('./services/emailService');
    const emailNote = emailService.isConfigured()
        ? 'Email: configured'
        : 'Email: not configured (reset links log to console)';
    const paypalNote = paypalCheckout.isConfigured()
        ? `PayPal: ${paypalCheckout.isLiveMode() ? 'LIVE' : 'sandbox'} ready`
        : 'PayPal: not configured — learners can request a plan or redeem a license key';
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║     TRIBAMS — cybersecurity judgment training                ║
    ║                                                              ║
    ║     Listening on 0.0.0.0:${String(PORT).padEnd(36)}║
    ║     Local: http://localhost:${String(PORT).padEnd(34)}║
    ║     Database: ${String(db.label || db.dialect).padEnd(44)}║
    ║     ${emailNote.padEnd(54)}║
    ║     ${paypalNote.padEnd(54)}║
    ║     Health: /api/health                                      ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
    if (emailService.isConfigured()) {
        emailService.ensureReady().catch(() => {});
    }
    if (IS_PROD && !paypalCheckout.isConfigured()) {
        console.warn('PRODUCTION: PayPal credentials missing — learners can still request a plan or redeem a license key; card checkout will not run.');
    }
    if (IS_PROD && !emailService.isConfigured()) {
        console.warn('⚠️ PRODUCTION: EMAIL_USER/EMAIL_PASS or RESEND_API_KEY missing — password reset emails will not send.');
    }
}

startServer().catch((error) => {
    console.error('❌ Critical initialization error:', error);
    process.exit(1);
});

module.exports = app;