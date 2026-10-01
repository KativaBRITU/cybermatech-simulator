/**
 * Copy data from SQLite (database/tribams.db) into PostgreSQL.
 *
 * Prerequisites:
 *   1) Postgres running (see docker-compose.postgres.yml)
 *   2) .env has DATABASE_URL=postgres://...
 *   3) App schema already created once with Node against Postgres
 *      (or this script will createSchema first)
 *
 * Usage:
 *   node scripts/migrate-sqlite-to-postgres.js
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { createDatabase } = require('../modules/database');
const { initSchema } = require('../modules/schema');

const TABLES = [
    'users',
    'modules',
    'module_contents',
    'essay_answers',
    'quiz_scores',
    'daily_progress',
    'certificates',
    'badges',
    'password_resets',
    'feedback',
    'darkweb_scans',
    'subscriptions',
    'custom_labs',
    'daily_scenarios',
    'leads',
    'email_verifications',
    'user_activity',
    'process_monitor',
    'quiz_integrity',
    'user_skill_profile',
    'adaptive_quiz_sessions',
    'skill_history',
    'learning_paths',
    'question_bank',
    'user_feedback',
    'lab_completions',
    'readiness_tokens'
];

function openSqlite(file) {
    const db = new sqlite3.Database(file);
    const all = (sql, params = []) =>
        new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
        });
    const close = () =>
        new Promise((resolve, reject) => {
            db.close((err) => (err ? reject(err) : resolve()));
        });
    return { all, close };
}

async function main() {
    if (!process.env.DATABASE_URL && String(process.env.DB_CLIENT || '').toLowerCase() !== 'postgres') {
        console.error('Set DATABASE_URL (or DB_CLIENT=postgres) before migrating.');
        process.exit(1);
    }

    const sqlitePath = path.join(__dirname, '..', 'database', 'tribams.db');
    if (!fs.existsSync(sqlitePath)) {
        console.error('SQLite file not found:', sqlitePath);
        process.exit(1);
    }

    const pg = createDatabase(path.join(__dirname, '..', 'database'));
    if (pg.dialect !== 'postgres') {
        console.error('Postgres driver did not activate. Check DATABASE_URL.');
        process.exit(1);
    }

    console.log('Creating Postgres schema...');
    await initSchema(pg);

    const sqlite = openSqlite(sqlitePath);
    let total = 0;

    for (const table of TABLES) {
        let rows;
        try {
            rows = await sqlite.all(`SELECT * FROM ${table}`);
        } catch (e) {
            console.warn(`Skip ${table}:`, e.message);
            continue;
        }
        if (!rows.length) {
            console.log(`${table}: 0 rows`);
            continue;
        }

        const cols = Object.keys(rows[0]);
        const placeholders = cols.map(() => '?').join(', ');
        const colList = cols.join(', ');
        let inserted = 0;

        for (const row of rows) {
            const values = cols.map((c) => row[c]);
            try {
                await pg.runAsync(
                    `INSERT OR IGNORE INTO ${table} (${colList}) VALUES (${placeholders})`,
                    values
                );
                inserted += 1;
            } catch (e) {
                console.warn(`  ${table} row failed:`, e.message);
            }
        }
        console.log(`${table}: migrated ~${inserted}/${rows.length}`);
        total += inserted;
    }

    // Reset serial sequences for Postgres
    for (const table of TABLES) {
        if (table === 'user_skill_profile' || table === 'modules') continue;
        try {
            await pg.pool.query(
                `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), true)`
            );
        } catch (e) {
            /* table may lack serial id */
        }
    }

    await sqlite.close();
    await pg.close();
    console.log(`\nDone. Approx ${total} rows copied into PostgreSQL.`);
    console.log('Keep DATABASE_URL set, then: npm start');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
