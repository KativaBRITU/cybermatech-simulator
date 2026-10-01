/**
 * Probe Postgres connectivity with current .env and suggested Supabase pooler host.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { Pool } = require('pg');

async function probe(label, connectionString, sslServername) {
    const ssl =
        process.env.PGSSL === 'true'
            ? { rejectUnauthorized: false, ...(sslServername ? { servername: sslServername } : {}) }
            : undefined;
    const pool = new Pool({
        connectionString,
        ssl,
        connectionTimeoutMillis: 15000
    });
    try {
        const r = await pool.query('SELECT COUNT(*)::int AS c FROM users');
        console.log(`OK  ${label} — users: ${r.rows[0].c}`);
        const sample = await pool.query(
            `SELECT id, username, email FROM users
             WHERE lower(username) LIKE ANY(ARRAY['%mufenda%','%mukwaru%','%butiha%'])
             ORDER BY id`
        );
        if (sample.rows.length) {
            console.log('  Matches:', sample.rows);
        }
        return true;
    } catch (e) {
        console.log(`FAIL ${label} — ${e.message}`);
        return false;
    } finally {
        await pool.end().catch(() => {});
    }
}

async function main() {
    const url = process.env.DATABASE_URL || '';
    const sslSni = process.env.PGSSL_SERVERNAME || '';
    console.log('Current DATABASE_URL host:', (url.match(/@([^/]+)/) || [])[1] || '(none)');
    await probe('current .env', url, sslSni);

    // Supabase pooler: username postgres.PROJECT_REF must use pooler hostname, not raw IP.
    const m = url.match(/^postgres(ql)?:\/\/([^:]+):([^@]+)@[^/]+\/(.+)$/i);
    if (m && sslSni) {
        const [, , user, pass, db] = m;
        const poolerUrl = `postgresql://${user}:${pass}@${sslSni}:6543/${db}`;
        await probe('pooler :6543', poolerUrl, sslSni);
        const pooler5432 = `postgresql://${user}:${pass}@${sslSni}:5432/${db}`;
        await probe('pooler :5432', pooler5432, sslSni);
    }

    const directMatch = url.match(/postgres(?:ql)?:\/\/postgres\.([a-z0-9]+):/i);
    if (directMatch) {
        const ref = directMatch[1];
        const passMatch = url.match(/postgres(?:ql)?:\/\/[^:]+:([^@]+)@/i);
        const pass = passMatch ? passMatch[1] : '';
        const directUrl = `postgresql://postgres:${pass}@db.${ref}.supabase.co:5432/postgres`;
        await probe('direct db.*.supabase.co', directUrl, `db.${ref}.supabase.co`);
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
