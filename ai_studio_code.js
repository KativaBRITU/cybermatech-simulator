// ============================================================
// TRIBAMS – PRODUCTION READY SERVER v14.1 (STABLE)
// ============================================================

require('dotenv').config();

const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const marked = require('marked');

// ============================================================
// APP INITIALIZATION
// ============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy for secure cookies in deployment environments
app.set('trust proxy', 1);

// Persistent Session Secret Fallback
let SESSION_SECRET = process.env.SESSION_SECRET;
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

// ============================================================
// CREATE DIRECTORIES
// ============================================================
const databaseDir = path.join(__dirname, 'database');
const sessionsDir = path.join(__dirname, 'database', 'sessions');
const uploadDir = path.join(__dirname, 'public', 'uploads', 'profiles');

[databaseDir, sessionsDir, uploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ============================================================
// DATABASE CONNECTION & PROMISES
// ============================================================
const dbPath = path.join(databaseDir, 'TRIBAMS.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys per connection
db.on('open', () => {
    db.run('PRAGMA foreign_keys = ON;');
    db.run('PRAGMA journal_mode = WAL;');
});

db.getAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => err ? reject(err) : resolve(result));
});

db.allAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, result) => err ? reject(err) : resolve(result));
});

db.runAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) { err ? reject(err) : resolve(this); });
});

db.execAsync = (sql) => new Promise((resolve, reject) => {
    db.exec(sql, (err) => err ? reject(err) : resolve());
});

// ============================================================
// INIT DATABASE SCHEMA
// ============================================================
async function initDatabase() {
    console.log('📦 Creating database tables...');

    // Users table
    await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        profile_picture TEXT,
        subscription_tier TEXT DEFAULT 'free',
        subscription_status TEXT DEFAULT 'inactive',
        status TEXT DEFAULT 'active',
        daily_streak INTEGER DEFAULT 0,
        last_daily_attempt DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_active DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Schema Migration Check for status column
    try {
        await db.runAsync(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'`);
    } catch (e) {
        // Column already exists
    }

    // Modules table
    await db.runAsync(`CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY,
        name TEXT,
        icon_key TEXT,
        description TEXT,
        difficulty TEXT DEFAULT 'intermediate',
        category TEXT
    )`);

    // Module Contents
    await db.runAsync(`CREATE TABLE IF NOT EXISTS module_contents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER,
        content TEXT,
        resources TEXT,
        essay_questions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    // Essay Answers
    await db.runAsync(`CREATE TABLE IF NOT EXISTS essay_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        module_id INTEGER,
        question_index INTEGER,
        answer TEXT,
        submitted_at DATETIME,
        UNIQUE(user_id, module_id, question_index),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Quiz Scores
    await db.runAsync(`CREATE TABLE IF NOT EXISTS quiz_scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        module_name TEXT,
        score INTEGER,
        time_taken INTEGER DEFAULT 0,
        total_time_limit INTEGER DEFAULT 0,
        difficulty TEXT DEFAULT 'medium',
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Daily Progress
    await db.runAsync(`CREATE TABLE IF NOT EXISTS daily_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        module_id INTEGER,
        day_number INTEGER,
        attempted INTEGER DEFAULT 0,
        correct INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, module_id, day_number),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Certificates
    await db.runAsync(`CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        certificate_id TEXT UNIQUE,
        recipient_name TEXT,
        module_name TEXT,
        score INTEGER,
        issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        verified INTEGER DEFAULT 1,
        downloaded INTEGER DEFAULT 0
    )`);

    // Badges
    await db.runAsync(`CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        badge_name TEXT,
        badge_icon TEXT,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Feedback
    await db.runAsync(`CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        username TEXT,
        type TEXT,
        message TEXT,
        rating INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Dark Web Scans
    await db.runAsync(`CREATE TABLE IF NOT EXISTS darkweb_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email TEXT,
        compromised INTEGER,
        breaches TEXT,
        scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Custom Labs
    await db.runAsync(`CREATE TABLE IF NOT EXISTS custom_labs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_name TEXT UNIQUE,
        icon TEXT,
        description TEXT,
        difficulty TEXT DEFAULT 'intermediate',
        questions TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Daily Scenarios
    await db.runAsync(`CREATE TABLE IF NOT EXISTS daily_scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        module_id INTEGER,
        day_number INTEGER,
        question TEXT,
        options TEXT,
        correct_answer INTEGER,
        explanation TEXT,
        category TEXT,
        difficulty TEXT DEFAULT 'intermediate',
        UNIQUE(module_id, day_number),
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    // Leads
    await db.runAsync(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        score TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('✅ Database tables verified & created');
}

// ============================================================
// SEED MODULES & CONTENTS
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
    { id: 45, name: 'Cyber Law & Ethics', icon_key: 'cyberlaw', category: 'governance', difficulty: 'easy' }
];

async function seedDatabase() {
    console.log('📚 Seeding modules and contents...');
    for (const m of MODULES) {
        await db.runAsync(
            `INSERT OR IGNORE INTO modules (id, name, icon_key, category, difficulty) VALUES (?, ?, ?, ?, ?)`,
            [m.id, m.name, m.icon_key, m.category, m.difficulty]
        );

        const essayQuestions = [
            {
                question: `What are the most critical aspects of ${m.name} in modern cybersecurity?`,
                guidelines: "Cover key concepts, practical challenges, and implementation strategies."
            },
            {
                question: `Analyze the challenges and solutions in implementing ${m.name} across diverse environments.`,
                guidelines: "Address technical, organizational, and cultural aspects with examples."
            },
            {
                question: `How will ${m.name} evolve in the next 5 years?`,
                guidelines: "Consider technological developments, regulatory changes, and emerging threats."
            }
        ];

        const content = `# ${m.name} – Complete Guide

## Introduction
${m.name} is a fundamental pillar of modern cybersecurity defenses.

## Learning Objectives
- Master core architecture and principles
- Identify real-world threat vectors
- Deploy defense and response countermeasures

## Key Concepts
- Foundational Theory
- Implementation Strategies
- Operational Best Practices`;

        const resources = JSON.stringify([
            { name: `📖 ${m.name} Study Guide (PDF)`, url: `/api/module/${m.id}/pdf-guide`, type: 'guide' },
            { name: `🔬 ${m.name} Lab Environment`, url: `/module/${m.id}/lab`, type: 'lab' },
            { name: `📝 ${m.name} Assessment Quiz`, url: `/module/${m.id}/quiz`, type: 'assessment' }
        ]);

        await db.runAsync(
            `INSERT OR REPLACE INTO module_contents (module_id, content, resources, essay_questions) VALUES (?, ?, ?, ?)`,
            [m.id, content, resources, JSON.stringify(essayQuestions)]
        );
    }
    console.log('✅ Seeding complete');
}

// ============================================================
// MIDDLEWARE & SECURITY CONFIGURATION
// ============================================================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Zero-dependency Rate Limiter Middleware
const rateLimitMap = new Map();
function rateLimiter(maxRequests = 30, windowMs = 15 * 60 * 1000) {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
        } else {
            record.count += 1;
        }

        rateLimitMap.set(ip, record);

        if (record.count > maxRequests) {
            return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
        }
        next();
    };
}

// Multer Storage Setup for Profile Picture Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        cb(null, `avatar_${req.session.user.id}_${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed!'), false);
    }
});

// Session Middleware
const sessionStore = new FileStore({
    path: sessionsDir,
    ttl: 86400,
    reapInterval: 3600,
    retries: 2
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Helper Functions
function generateCertificateId() {
    return 'TRI-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateModuleQuestions(moduleId, difficulty = 'medium') {
    const module = MODULES.find(m => m.id === moduleId);
    const name = module ? module.name : 'Cybersecurity';
    const qs = [];
    const count = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    const timeLimit = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 600 : 900;

    for (let i = 0; i < count; i++) {
        const topics = ['fundamentals', 'threats', 'defense', 'response', 'compliance'];
        const t = topics[i % topics.length];
        qs.push({
            id: i + 1,
            question: `In ${name}, what is a critical aspect of ${t}?`,
            options: [
                `The correct approach to ${t}`,
                `An alternative approach to ${t}`,
                `A common misconception about ${t}`,
                `An outdated method for ${t}`
            ],
            correct: 0,
            explanation: `This covers essential ${t} concepts.`,
            points: difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1
        });
    }
    return { questions: qs, timeLimit, totalQuestions: count };
}

// Static HTML Serve Helper
function sendStaticPage(filePath, res) {
    const fullPath = path.join(__dirname, 'views', filePath);
    if (fs.existsSync(fullPath)) {
        return res.sendFile(fullPath);
    }
    res.status(404).send('Page Not Found');
}

// ============================================================
// PAGE ROUTES
// ============================================================
app.get('/', (req, res) => sendStaticPage('index.html', res));
app.get('/about', (req, res) => sendStaticPage('about.html', res));
app.get('/contact', (req, res) => sendStaticPage('contact.html', res));
app.get('/login', (req, res) => sendStaticPage('login.html', res));
app.get('/register', (req, res) => sendStaticPage('register.html', res));
app.get('/forgot-password', (req, res) => sendStaticPage('forgot-password.html', res));
app.get('/reset-password', (req, res) => sendStaticPage('reset-password.html', res));
app.get('/verify', (req, res) => sendStaticPage('verify.html', res));
app.get('/health-check', (req, res) => sendStaticPage('health-check.html', res));
app.get('/resource-center', (req, res) => sendStaticPage('resource-center.html', res));
app.get('/resources', (req, res) => sendStaticPage('resources.html', res));
app.get('/scenario', (req, res) => sendStaticPage('scenario.html', res));
app.get('/review', (req, res) => sendStaticPage('review.html', res));
app.get('/certificate', (req, res) => sendStaticPage('certificate.html', res));
app.get('/leaderboard', (req, res) => sendStaticPage('leaderboard.html', res));
app.get('/badges', (req, res) => sendStaticPage('badges.html', res));
app.get('/darkweb', (req, res) => sendStaticPage('darkweb.html', res));
app.get('/payment', (req, res) => sendStaticPage('payment.html', res));
app.get('/terms', (req, res) => sendStaticPage('terms.html', res));
app.get('/privacy', (req, res) => sendStaticPage('privacy.html', res));

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendStaticPage('dashboard.html', res);
});

app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendStaticPage('profile.html', res);
});

app.get('/module/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    sendStaticPage('module-detail.html', res);
});

// ============================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// ============================================================
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

function isAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (ADMIN_EMAILS.includes(req.session.user.email.toLowerCase())) {
        return next();
    }
    res.status(403).json({ success: false, message: 'Admin authorization required.' });
}

app.get('/admin', isAdmin, (req, res) => sendStaticPage('admin.html', res));
app.get('/admin/labs', isAdmin, (req, res) => sendStaticPage('admin-labs.html', res));

// ============================================================
// AUTHENTICATION API
// ============================================================
app.post('/api/register', rateLimiter(10, 15 * 60 * 1000), async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    if (username.length < 3 || password.length < 6 || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Invalid input parameters' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.runAsync('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username.trim(), email.trim().toLowerCase(), hash]);
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

app.post('/api/login', rateLimiter(15, 15 * 60 * 1000), async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    try {
        const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        await db.runAsync('UPDATE users SET last_active = datetime("now") WHERE id = ?', [user.id]);

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            subscription_tier: user.subscription_tier || 'free',
            subscription_status: user.subscription_status || 'inactive'
        };

        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

app.get('/api/user-info', async (req, res) => {
    if (!req.session.user) return res.json({ success: false, username: null });
    try {
        const user = await db.getAsync('SELECT id, username, email, profile_picture, subscription_tier FROM users WHERE id = ?', [req.session.user.id]);
        res.json({ success: true, ...user });
    } catch (err) {
        res.json({ success: true, username: req.session.user.username, email: req.session.user.email });
    }
});

// Profile Picture Upload
app.post('/api/profile/upload', upload.single('avatar'), async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    const avatarUrl = `/uploads/profiles/${req.file.filename}`;
    try {
        await db.runAsync('UPDATE users SET profile_picture = ? WHERE id = ?', [avatarUrl, req.session.user.id]);
        res.json({ success: true, profile_picture: avatarUrl });
    } catch (err) {
        console.error('Profile upload error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// ============================================================
// MODULE & QUIZ API
// ============================================================
app.get('/api/modules', (req, res) => res.json({ modules: MODULES }));

app.get('/api/module-content/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const content = await db.getAsync('SELECT * FROM module_contents WHERE module_id = ?', [id]);
        if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
        
        content.resources = JSON.parse(content.resources || '[]');
        content.essay_questions = JSON.parse(content.essay_questions || '[]');
        res.json({ success: true, content });
    } catch (error) {
        console.error('Module content error:', error);
        res.status(500).json({ success: false, message: 'Error loading content' });
    }
});

app.get('/api/module-questions/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const module = MODULES.find(m => m.id === id);
    const difficulty = module ? module.difficulty : 'medium';
    const limit = parseInt(req.query.limit) || 10;
    const { questions, timeLimit, totalQuestions } = generateModuleQuestions(id, difficulty);
    res.json({ 
        questions: questions.slice(0, limit), 
        totalQuestions: Math.min(limit, totalQuestions),
        timeLimit,
        difficulty
    });
});

app.post('/api/save-score', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Not logged in' });
    
    const { module_name, score, time_taken, total_time_limit, difficulty } = req.body;
    
    try {
        await db.runAsync(
            `INSERT INTO quiz_scores (user_id, module_name, score, time_taken, total_time_limit, difficulty) VALUES (?, ?, ?, ?, ?, ?)`,
            [req.session.user.id, module_name, score, time_taken || 0, total_time_limit || 0, difficulty || 'medium']
        );
        
        if (score >= 80) {
            const certId = generateCertificateId();
            const user = await db.getAsync('SELECT username FROM users WHERE id = ?', [req.session.user.id]);
            await db.runAsync(
                'INSERT INTO certificates (certificate_id, recipient_name, module_name, score) VALUES (?, ?, ?, ?)',
                [certId, user.username, module_name, score]
            );
            
            const badgeName = `${module_name} Master`;
            const existingBadge = await db.getAsync('SELECT id FROM badges WHERE user_id = ? AND badge_name = ?', [req.session.user.id, badgeName]);
            if (!existingBadge) {
                await db.runAsync('INSERT INTO badges (user_id, badge_name, badge_icon) VALUES (?, ?, ?)', [req.session.user.id, badgeName, '🏅']);
            }
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Save score error:', error);
        res.status(500).json({ success: false, message: 'Error saving score' });
    }
});

// ============================================================
// CERTIFICATE PDF GENERATION (CORRECTED CENTERING)
// ============================================================
app.get('/api/certificate/:id/pdf', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    try {
        const cert = await db.getAsync('SELECT * FROM certificates WHERE certificate_id = ? AND verified = 1', [req.params.id.toUpperCase()]);
        if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
        
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margins: { top: 40, bottom: 40, left: 40, right: 40 } });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=TRIBAMS_Certificate_${cert.certificate_id}.pdf`);
        doc.pipe(res);
        
        // Canvas dimensions: Width = 841.89, Height = 595.28
        // Printable Width area = 742 (x = 50 to 792)
        const pageWidth = 742;
        const pageX = 50;

        // Outer & Inner Borders
        doc.rect(30, 30, 781, 535).lineWidth(3).stroke('#1a237e');
        doc.rect(40, 40, 761, 515).lineWidth(1).stroke('#0d47a1');
        
        doc.fontSize(32).fillColor('#0d47a1').text('TRIBAMS', pageX, 70, { align: 'center', width: pageWidth });
        doc.fontSize(14).fillColor('#1565c0').text('Cybersecurity Training & Certification', pageX, 105, { align: 'center', width: pageWidth });
        
        doc.moveTo(150, 130).lineTo(691, 130).lineWidth(2).stroke('#1a237e');
        
        doc.fontSize(22).fillColor('#1a237e').text('CERTIFICATE OF ACHIEVEMENT', pageX, 150, { align: 'center', width: pageWidth });
        doc.fontSize(12).fillColor('#555555').text('This certifies that', pageX, 190, { align: 'center', width: pageWidth });
        
        doc.fontSize(28).fillColor('#0d47a1').text(cert.recipient_name, pageX, 215, { align: 'center', width: pageWidth });
        
        doc.fontSize(13).fillColor('#555555').text('has successfully completed the cybersecurity module', pageX, 260, { align: 'center', width: pageWidth });
        doc.fontSize(20).fillColor('#1a237e').text(cert.module_name, pageX, 285, { align: 'center', width: pageWidth });
        doc.fontSize(15).fillColor('#0d47a1').text(`Score Achieved: ${cert.score}%`, pageX, 320, { align: 'center', width: pageWidth });
        
        const formattedDate = new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.fontSize(10).fillColor('#666666').text(`Issue Date: ${formattedDate}`, pageX, 365, { align: 'center', width: pageWidth });
        doc.fontSize(9).fillColor('#888888').text(`Certificate ID: ${cert.certificate_id}`, pageX, 385, { align: 'center', width: pageWidth });
        
        // Verified Badge Emblem Centered at x=421
        doc.circle(421, 435, 30).fill('#0d47a1');
        doc.fillColor('#ffffff').fontSize(16).text('✓', 371, 427, { align: 'center', width: 100 });
        
        doc.fontSize(8).fillColor('#999999').text('Verification Portal: https://tribams.com/verify', pageX, 495, { align: 'center', width: pageWidth });
        doc.fontSize(7).fillColor('#bbbbbb').text('© TRIBAMS Academy - Enterprise Defense Learning', pageX, 510, { align: 'center', width: pageWidth });
        
        doc.end();
    } catch (error) {
        console.error('PDF certificate generation error:', error);
        res.status(500).json({ success: false, message: 'Error generating PDF' });
    }
});

// ============================================================
// STUDY GUIDE PDF GENERATOR (PARSED WITH MARKED)
// ============================================================
app.get('/api/module/:id/pdf-guide', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const id = parseInt(req.params.id);
    const content = await db.getAsync('SELECT * FROM module_contents WHERE module_id = ?', [id]);
    const module = MODULES.find(m => m.id === id);
    if (!content || !module) return res.status(404).json({ success: false, message: 'Module not found' });
    
    try {
        const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=TRIBAMS_${module.name.replace(/\s/g, '_')}_Guide.pdf`);
        doc.pipe(res);
        
        doc.fontSize(26).fillColor('#0d47a1').text('TRIBAMS', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(18).fillColor('#1a237e').text(`${module.name} - Study Guide`, { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(10).fillColor('#666').text(`Difficulty: ${module.difficulty.toUpperCase()} | Category: ${module.category.toUpperCase()}`, { align: 'center' });
        doc.moveDown(1.5);

        // Lexical Markdown Parsing
        const tokens = marked.lexer(content.content);
        tokens.forEach(token => {
            if (token.type === 'heading') {
                if (doc.y > 720) doc.addPage();
                const size = token.depth === 1 ? 20 : token.depth === 2 ? 15 : 12;
                doc.fontSize(size).fillColor('#0d47a1').text(token.text);
                doc.moveDown(0.3);
            } else if (token.type === 'paragraph') {
                if (doc.y > 720) doc.addPage();
                doc.fontSize(10).fillColor('#333333').text(token.text);
                doc.moveDown(0.4);
            } else if (token.type === 'list') {
                token.items.forEach(item => {
                    if (doc.y > 720) doc.addPage();
                    doc.fontSize(10).fillColor('#333333').text(`• ${item.text}`, { indent: 15 });
                });
                doc.moveDown(0.4);
            }
        });

        doc.end();
    } catch (error) {
        console.error('Study guide PDF error:', error);
        res.status(500).json({ success: false, message: 'Error generating study guide PDF' });
    }
});

// ============================================================
// ADMIN API (FIXED QUERY BUG)
// ============================================================
app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
        const totalUsers = await db.getAsync('SELECT COUNT(*) as count FROM users');
        const totalQuizzes = await db.getAsync('SELECT COUNT(*) as count FROM quiz_scores');
        const avgScore = await db.getAsync('SELECT AVG(score) as avg FROM quiz_scores');
        const totalCertificates = await db.getAsync('SELECT COUNT(*) as count FROM certificates');
        
        res.json({
            success: true,
            totalUsers: totalUsers.count,
            totalQuizzes: totalQuizzes.count,
            avgScore: Math.round(avgScore.avg || 0),
            totalCertificates: totalCertificates.count
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Error loading stats' });
    }
});

app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
        const users = await db.allAsync(`
            SELECT u.id, u.username, u.email, u.status, u.created_at,
                   COUNT(DISTINCT qs.module_name) as modules_completed,
                   MAX(qs.score) as best_score
            FROM users u
            LEFT JOIN quiz_scores qs ON u.id = qs.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, users });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ success: false, message: 'Error loading users' });
    }
});

// ============================================================
// GLOBAL ERROR & SHUTDOWN HANDLING
// ============================================================
app.use((err, req, res, next) => {
    console.error('Unhandled express error:', err.stack);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
});

async function startServer() {
    try {
        await initDatabase();
        await seedDatabase();
        
        const server = app.listen(PORT, () => {
            console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║ 🚀 TRIBAMS v14.1 PRODUCTION SERVER READY                ║
    ║ Server Listening on Port: ${PORT}                            ║
    ║ Environment: ${process.env.NODE_ENV || 'development'}                           ║
    ║ Database: Connected (${dbPath})                    ║
    ╚══════════════════════════════════════════════════════════════╝
            `);
        });

        const shutdown = () => {
            console.log('\n🛑 Gracefully shutting down...');
            server.close(() => {
                db.close((err) => {
                    if (err) console.error('Error closing SQLite DB:', err);
                    else console.log('✅ SQLite Database disconnected.');
                    process.exit(0);
                });
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error) {
        console.error('❌ Critical initialization error:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;