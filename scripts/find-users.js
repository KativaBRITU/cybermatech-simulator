/**
 * Find users by username/email fragment. Usage:
 *   node scripts/find-users.js mufenda mukwaruze butihaingura
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createDatabase } = require('../modules/database');

async function main() {
    const patterns = process.argv.slice(2).length
        ? process.argv.slice(2)
        : ['mufenda', 'mukwaru', 'butiha'];
    const databaseDir = require('path').join(__dirname, '..', 'database');
    const db = await createDatabase(databaseDir);
    console.log('Database:', db.dialect, db.label || '');

    for (const p of patterns) {
        const like = `%${p.toLowerCase()}%`;
        const rows = await db.allAsync(
            `SELECT id, username, email, status, subscription_tier, created_at
             FROM users
             WHERE lower(username) LIKE ? OR lower(email) LIKE ?
             ORDER BY id`,
            [like, like]
        );
        console.log(`\n--- ${p} (${rows.length} match${rows.length === 1 ? '' : 'es'}) ---`);
        rows.forEach((r) => console.log(JSON.stringify(r)));
    }

    const total = await db.getAsync('SELECT COUNT(*) AS c FROM users');
    console.log('\nTotal users:', total.c);

    const recent = await db.allAsync(
        `SELECT id, username, email, created_at FROM users ORDER BY id DESC LIMIT 15`
    );
    console.log('\nLatest 15 users:');
    recent.forEach((r) => console.log(`${r.id}\t${r.username}\t${r.email}\t${r.created_at}`));

    await db.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
