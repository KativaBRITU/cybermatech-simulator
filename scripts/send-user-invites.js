/**
 * Update learner emails and send password-reset invite.
 * Usage: node scripts/send-user-invites.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
if (process.env.EMAIL_TLS_INSECURE !== 'false') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const crypto = require('crypto');
const { createDatabase } = require('../modules/database');
const emailService = require('../services/emailService');

const INVITES = [
    { username: 'mufenda', email: 'mufenda52@gmail.com' },
    { username: 'butihaingura', email: 'butihaigura@gmail.com' }
];

async function sendReset(db, user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.runAsync('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0', [user.id]);
    await db.runAsync(
        'INSERT INTO password_resets (user_id, token, used, expires_at) VALUES (?, ?, 0, ?)',
        [user.id, tokenHash, expiresAt]
    );

    const resetLink = `${emailService.APP_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
    const result = await emailService.sendPasswordResetEmail(user.email, user.username, resetLink);
    return { resetLink, result };
}

async function main() {
    const db = await createDatabase(require('path').join(__dirname, '..', 'database'));
    await emailService.ensureReady();

    for (const { username, email } of INVITES) {
        await db.runAsync('UPDATE users SET email = ? WHERE lower(username) = lower(?)', [email, username]);
        const user = await db.getAsync(
            'SELECT id, username, email, status FROM users WHERE lower(username) = lower(?)',
            [username]
        );
        if (!user) {
            console.log(`MISSING user: ${username}`);
            continue;
        }
        const { resetLink, result } = await sendReset(db, user);
        console.log(`${username} <${user.email}> → sent: ${result.sent}`);
        if (!result.sent) console.log('  link:', resetLink);
    }

    await db.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
