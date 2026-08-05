const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 5000;

const db = new sqlite3.Database('./database/cybermatech.db');

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
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'cybermatech-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

function requireLogin(req, res, next) {
    if (!req.session.user) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Login required' });
        }
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/training/:module', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'training.html'));
});

app.get('/certificate', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'certificate.html'));
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword],
            function (err) {
                if (err) {
                    res.json({ success: false, message: 'Username or email already exists' });
                } else {
                    res.json({ success: true, message: 'Registration successful!' });
                }
            }
        );
    } catch (error) {
        res.json({ success: false, message: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        req.session.user = { id: user.id, username: user.username, email: user.email };
        res.json({ success: true, message: 'Login successful!' });
    });
});

app.post('/api/save-score', requireLogin, (req, res) => {
    const { module_name, score } = req.body;
    db.run(
        `INSERT INTO quiz_scores (user_id, module_name, score) VALUES (?, ?, ?)`,
        [req.session.user.id, module_name, score],
        function (err) {
            if (err) {
                res.json({ success: false });
            } else {
                res.json({ success: true });
            }
        }
    );
});

app.get('/api/progress', requireLogin, (req, res) => {
    db.all(
        `SELECT module_name, score, completed_at FROM quiz_scores WHERE user_id = ? ORDER BY completed_at DESC`,
        [req.session.user.id],
        (err, scores) => {
            res.json({ success: true, scores: scores || [] });
        }
    );
});

app.get('/api/user-info', (req, res) => {
    if (!req.session.user) {
        return res.json({ success: false, username: null });
    }
    res.json({
        success: true,
        username: req.session.user.username,
        email: req.session.user.email
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Cybermatech running at http://localhost:${PORT}`);
});
