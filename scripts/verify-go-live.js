/**
 * Pre-flight check before Railway / tribams.com go-live.
 *   node scripts/verify-go-live.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { createDatabase } = require('../modules/database');

const REQUIRED = [
    'NODE_ENV',
    'SESSION_SECRET',
    'APP_BASE_URL',
    'ADMIN_EMAILS',
    'DATABASE_URL',
    'EMAIL_USER',
    'EMAIL_PASS'
];

const RECOMMENDED = [
    'PGSSL',
    'PGSSL_SERVERNAME',
    'TRUST_PROXY',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET'
];

const FORBIDDEN_ON_RAILWAY = ['DEMO_SQLITE_FALLBACK', 'SESSION_STORE'];

function maskUrl(url) {
    return String(url || '').replace(/:([^:@/]+)@/, ':***@');
}

function hostFromUrl(url) {
    const m = String(url || '').match(/@([^/:?]+)/);
    return m ? m[1] : '(none)';
}

async function main() {
    console.log('\n=== TRIBAMS go-live verification ===\n');
    let issues = 0;
    let warnings = 0;

    for (const key of REQUIRED) {
        if (key === 'EMAIL_USER' || key === 'EMAIL_PASS') {
            if (String(process.env.RESEND_API_KEY || '').trim()) continue;
        }
        const val = String(process.env[key] || '').trim();
        if (!val) {
            console.log(`❌ MISSING ${key}`);
            issues++;
        } else if (key === 'SESSION_SECRET' && val.length < 32) {
            console.log(`❌ ${key} too short (${val.length} chars, need 32+)`);
            issues++;
        } else if (key === 'APP_BASE_URL' && /localhost|127\.0\.0\.1/i.test(val)) {
            console.log(`❌ ${key} still localhost — set https://tribams.com on Railway`);
            issues++;
        } else if (key === 'DATABASE_URL' && /:6543\//.test(val)) {
            console.log(`⚠️  ${key} uses port 6543 — prefer Session pooler :5432`);
            warnings++;
        } else {
            console.log(`✅ ${key}`);
        }
    }

    for (const key of RECOMMENDED) {
        if (!String(process.env[key] || '').trim()) {
            console.log(`⚠️  missing ${key}`);
            warnings++;
        }
    }

    for (const key of FORBIDDEN_ON_RAILWAY) {
        const val = String(process.env[key] || '').toLowerCase();
        if (key === 'DEMO_SQLITE_FALLBACK' && val === 'true') {
            console.log(`❌ ${key}=true — never on Railway`);
            issues++;
        }
        if (key === 'SESSION_STORE' && val === 'file') {
            console.log(`⚠️  ${key}=file — use memory on Railway (ephemeral disk)`);
            warnings++;
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  NODE_ENV is not production');
        warnings++;
    }

    if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID) {
        if (!String(process.env.RESEND_API_KEY || '').trim()) {
            console.log('⚠️  Railway blocks Gmail SMTP on Hobby — add RESEND_API_KEY or upgrade to Pro');
            warnings++;
        } else {
            console.log('✅ RESEND_API_KEY set (Railway email path)');
        }
    }

    console.log(`\nDatabase host: ${hostFromUrl(process.env.DATABASE_URL)}`);
    console.log(`DATABASE_URL: ${maskUrl(process.env.DATABASE_URL)}\n`);

    try {
        const db = await createDatabase(require('path').join(__dirname, '..', 'database'));
        const users = await db.getAsync('SELECT COUNT(*)::int AS c FROM users');
        const modules = await db.getAsync('SELECT COUNT(*)::int AS c FROM modules');
        console.log(`✅ Postgres connected — users: ${users?.c ?? 0}, modules: ${modules?.c ?? 0}`);
        await db.close();
    } catch (e) {
        console.log(`❌ Database connection failed: ${e.message}`);
        issues++;
    }

    try {
        const email = require('../services/emailService');
        if (email.isConfigured()) {
            const ok = await email.ensureReady();
            console.log(ok ? '✅ SMTP ready' : '⚠️  SMTP configured but verify failed');
            if (!ok) warnings++;
        } else {
            console.log('❌ Email not configured');
            issues++;
        }
    } catch (e) {
        console.log(`⚠️  SMTP check skipped: ${e.message}`);
        warnings++;
    }

    console.log(`\n--- Result: ${issues} blocker(s), ${warnings} warning(s) ---`);
    if (issues === 0) {
        console.log('Ready to deploy. Set the same variables on Railway web service and redeploy.\n');
    } else {
        console.log('Fix blockers before go-live.\n');
    }
    process.exit(issues ? 1 : 0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
