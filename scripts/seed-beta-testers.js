/**
 * Seed 10 closed-beta tester accounts (full module/resource catalog, NOT admin).
 *
 * Usage:
 *   node scripts/seed-beta-testers.js
 *
 * Optional env:
 *   BETA_TESTER_PASSWORD  — shared password for all beta0N accounts (default below)
 *
 * Accounts upserted:
 *   username: beta01 … beta10
 *   email:    beta01@tribams.test … beta10@tribams.test
 *   flag:     is_beta_tester = 1
 *   tier:     subscription_tier = 'beta', subscription_status = 'active'
 *
 * These users get learner catalog access (modules 1–97 + labs/resources) via
 * accessControl.isBetaTester — they are never added to ADMIN_EMAILS and cannot
 * reach /admin or admin APIs.
 *
 * Credentials are printed once to the console after seeding. Store them securely;
 * do not commit passwords into the repo or list them on public pages.
 */

'use strict';

require('dotenv').config();

const path = require('path');
const bcrypt = require('bcrypt');
const { createDatabase } = require('../modules/database');
const { initSchema } = require('../modules/schema');

const DEFAULT_PASSWORD = 'BetaTribams2026!';
const PASSWORD = process.env.BETA_TESTER_PASSWORD || DEFAULT_PASSWORD;
const COUNT = 10;

async function upsertBeta(db, n, passwordHash) {
    const num = String(n).padStart(2, '0');
    const username = `beta${num}`;
    const email = `beta${num}@tribams.test`;

    const existing = await db.getAsync(
        'SELECT id, username, email FROM users WHERE email = ? OR username = ?',
        [email, username]
    );

    if (existing) {
        await db.runAsync(
            `UPDATE users SET
                username = ?,
                email = ?,
                password = ?,
                status = 'active',
                subscription_tier = 'beta',
                subscription_status = 'active',
                is_beta_tester = 1
             WHERE id = ?`,
            [username, email, passwordHash, existing.id]
        );
        return { id: existing.id, username, email, action: 'updated' };
    }

    const result = await db.runAsync(
        `INSERT INTO users (username, email, password, status, subscription_tier, subscription_status, is_beta_tester)
         VALUES (?, ?, ?, 'active', 'beta', 'active', 1)`,
        [username, email, passwordHash]
    );
    return {
        id: result?.lastID || result?.id || null,
        username,
        email,
        action: 'created'
    };
}

(async () => {
    const db = createDatabase(path.join(__dirname, '..', 'database'));
    console.log(`Seeding beta testers (${db.dialect || 'sqlite'})…`);
    await initSchema(db);

    const passwordHash = await bcrypt.hash(PASSWORD, 12);
    const rows = [];
    for (let i = 1; i <= COUNT; i++) {
        rows.push(await upsertBeta(db, i, passwordHash));
    }

    console.log('\n=== Closed beta tester credentials (store securely; printed once) ===');
    console.log(`Shared password: ${PASSWORD}`);
    console.log('(Override with BETA_TESTER_PASSWORD env if you re-seed.)\n');
    for (const r of rows) {
        console.log(`  ${r.username}  |  ${r.email}  |  [${r.action}]`);
    }
    console.log('\nAccess: full modules + resources. Admin routes: blocked.');
    console.log('Login at /login with email above + shared password.\n');

    await db.close();
    process.exit(0);
})().catch((err) => {
    console.error('seed-beta-testers failed:', err);
    process.exit(1);
});
