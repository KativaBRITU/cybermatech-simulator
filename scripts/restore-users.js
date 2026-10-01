/**
 * Create or restore learner accounts (go-live recovery).
 *
 * Usage:
 *   node scripts/restore-users.js --send-welcome
 *   node scripts/restore-users.js mufenda user@example.com Mukwaruze user2@example.com
 *
 * Without args, restores the three known missing usernames with placeholder emails
 * (change emails in admin or re-run with real addresses).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcrypt');
const { createDatabase } = require('../modules/database');

const DEFAULT_RESTORE = [
    { username: 'mufenda', email: 'mufenda@tribams.com' },
    { username: 'mukwaruze', email: 'mukwaruze@tribams.com' },
    { username: 'butihaingura', email: 'butihaingura@tribams.com' }
];

const TEMP_PASSWORD = 'Tribams2026!';

function parsePairs(argv) {
    const sendWelcome = argv.includes('--send-welcome');
    const args = argv.filter((a) => !a.startsWith('--'));
    if (!args.length) return { pairs: DEFAULT_RESTORE, sendWelcome };
    const pairs = [];
    for (let i = 0; i < args.length; i += 2) {
        if (!args[i + 1]) throw new Error(`Missing email for username "${args[i]}"`);
        pairs.push({ username: args[i], email: args[i + 1] });
    }
    return { pairs, sendWelcome };
}

async function main() {
    const { pairs, sendWelcome } = parsePairs(process.argv.slice(2));
    const databaseDir = require('path').join(__dirname, '..', 'database');
    const db = await createDatabase(databaseDir);
    console.log('Database:', db.dialect, db.label || '');

    const hash = await bcrypt.hash(TEMP_PASSWORD, 12);
    let emailService = null;
    if (sendWelcome) {
        emailService = require('../services/emailService');
        if (!emailService.isConfigured()) {
            console.warn('Email not configured — skipping welcome emails.');
            emailService = null;
        }
    }

    for (const { username, email } of pairs) {
        const existing = await db.getAsync(
            'SELECT id, username, email FROM users WHERE lower(username) = lower(?) OR lower(email) = lower(?)',
            [username, email]
        );
        if (existing) {
            console.log(`SKIP ${username} — already exists as #${existing.id} (${existing.email})`);
            continue;
        }
        const r = await db.runAsync(
            'INSERT INTO users (username, email, password, status) VALUES (?, ?, ?, ?)',
            [username, email, hash, 'active']
        );
        console.log(`CREATED #${r.lastID} ${username} <${email}> temp password: ${TEMP_PASSWORD}`);
        if (emailService) {
            await emailService.sendWelcomeEmail(email, username).catch((e) => {
                console.warn(`  welcome email failed: ${e.message}`);
            });
        }
    }

    const total = await db.getAsync('SELECT COUNT(*) AS c FROM users');
    console.log('\nTotal users now:', total.c);
    console.log('Tell each learner to sign in and use Forgot password to set their own password.');
    await db.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
