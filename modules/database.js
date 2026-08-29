/**
 * TRIBAMS database layer — SQLite (default) or PostgreSQL (enterprise).
 *
 * Activation:
 *   DATABASE_URL=postgres://user:pass@host:5432/tribams
 *   or DB_CLIENT=postgres + PGHOST/PGUSER/PGPASSWORD/PGDATABASE
 *
 * Without those, SQLite file database/tribams.db is used (local/dev).
 *
 * Laptop/demo only: DEMO_SQLITE_FALLBACK=true probes Postgres then falls
 * back to SQLite on timeout. Do not set this on Railway/Render/VPS.
 */

const path = require('path');
const fs = require('fs');

function detectDialect() {
    const url = process.env.DATABASE_URL || '';
    const client = String(process.env.DB_CLIENT || '').toLowerCase();
    if (client === 'postgres' || client === 'postgresql' || /^postgres(ql)?:\/\//i.test(url)) {
        return 'postgres';
    }
    return 'sqlite';
}

/** Convert SQLite-flavored SQL to Postgres where needed. */
function translateSql(sql, dialect) {
    if (dialect !== 'postgres') return sql;
    let s = String(sql || '').trim();
    if (!s) return s;

    // PRAGMA is SQLite-only
    if (/^PRAGMA\b/i.test(s)) return null;

    // datetime('now') / datetime("now")
    s = s.replace(/datetime\s*\(\s*['"]now['"]\s*\)/gi, 'NOW()');

    // datetime('now', '-24 hours') etc.
    s = s.replace(
        /datetime\s*\(\s*['"]now['"]\s*,\s*['"]-24 hours['"]\s*\)/gi,
        "(NOW() - INTERVAL '24 hours')"
    );
    s = s.replace(
        /datetime\s*\(\s*['"]now['"]\s*,\s*['"]-1 hour['"]\s*\)/gi,
        "(NOW() - INTERVAL '1 hour')"
    );
    s = s.replace(
        /datetime\s*\(\s*['"]now['"]\s*,\s*['"]-7 days['"]\s*\)/gi,
        "(NOW() - INTERVAL '7 days')"
    );

    // datetime(column) / date(column)
    s = s.replace(/datetime\s*\(\s*([a-z_][a-z0-9_]*)\s*\)/gi, '$1');
    s = s.replace(/date\s*\(\s*([a-z_][a-z0-9_]*)\s*\)/gi, 'DATE($1)');

    // INSERT OR IGNORE → ON CONFLICT DO NOTHING
    if (/^INSERT\s+OR\s+IGNORE\s+INTO/i.test(s)) {
        s = s.replace(/^INSERT\s+OR\s+IGNORE\s+INTO/i, 'INSERT INTO');
        if (!/\bON CONFLICT\b/i.test(s)) {
            s = s.replace(/\s*;?\s*$/, ' ON CONFLICT DO NOTHING');
        }
    }

    // INSERT OR REPLACE → table-specific upserts
    if (/^INSERT\s+OR\s+REPLACE\s+INTO/i.test(s)) {
        s = s.replace(/^INSERT\s+OR\s+REPLACE\s+INTO/i, 'INSERT INTO');
        if (!/\bON CONFLICT\b/i.test(s)) {
            if (/INTO\s+user_skill_profile\b/i.test(s)) {
                s += ` ON CONFLICT (user_id) DO UPDATE SET
                    overall_level = EXCLUDED.overall_level,
                    overall_score = EXCLUDED.overall_score,
                    modules_completed = EXCLUDED.modules_completed,
                    total_attempts = EXCLUDED.total_attempts,
                    average_score = EXCLUDED.average_score,
                    skill_breakdown = EXCLUDED.skill_breakdown,
                    weak_areas = EXCLUDED.weak_areas,
                    strong_areas = EXCLUDED.strong_areas,
                    xp_total = EXCLUDED.xp_total,
                    last_assessment = EXCLUDED.last_assessment,
                    updated_at = EXCLUDED.updated_at`;
            } else if (/INTO\s+essay_answers\b/i.test(s)) {
                s += ` ON CONFLICT (user_id, module_id, question_index) DO UPDATE SET
                    answer = EXCLUDED.answer,
                    score = EXCLUDED.score,
                    relevant = EXCLUDED.relevant,
                    submitted_at = EXCLUDED.submitted_at`;
            } else if (/INTO\s+daily_progress\b/i.test(s)) {
                s += ` ON CONFLICT (user_id, module_id, day_number) DO UPDATE SET
                    attempted = EXCLUDED.attempted,
                    correct = EXCLUDED.correct,
                    points = EXCLUDED.points,
                    completed_at = EXCLUDED.completed_at`;
            } else {
                s += ' ON CONFLICT DO NOTHING';
            }
        }
    }

    // SQLite excluded. → Postgres EXCLUDED.
    s = s.replace(/\bexcluded\./gi, 'EXCLUDED.');

    // ? placeholders → $1, $2, ...
    let n = 0;
    s = s.replace(/\?/g, () => `$${++n}`);

    return s;
}

function createSqliteDatabase(databaseDir) {
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(databaseDir, 'tribams.db');
    // Legacy filename only — older installs used cybermatech.db before the Tribams rename.
    // Do not change this string or existing local DBs will not migrate.
    const legacyDbPath = path.join(databaseDir, 'cybermatech.db');
    if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
        try {
            fs.renameSync(legacyDbPath, dbPath);
        } catch (e) {
            console.warn('DB rename skipped:', e.message);
        }
    }

    const raw = new sqlite3.Database(dbPath);
    // Avoid indefinite waits when another connection briefly holds the DB (Windows + FileStore).
    try { raw.configure('busyTimeout', 8000); } catch (_) { /* older sqlite3 */ }
    raw.on('open', () => {
        raw.run('PRAGMA foreign_keys = ON;');
        raw.run('PRAGMA journal_mode = WAL;');
        raw.run('PRAGMA busy_timeout = 8000;');
    });

    const api = {
        dialect: 'sqlite',
        label: 'SQLite (tribams.db)',
        filePath: dbPath,
        getAsync: (sql, params = []) =>
            new Promise((resolve, reject) => {
                raw.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
            }),
        allAsync: (sql, params = []) =>
            new Promise((resolve, reject) => {
                raw.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
            }),
        runAsync: (sql, params = []) =>
            new Promise((resolve, reject) => {
                raw.run(sql, params, function (err) {
                    err ? reject(err) : resolve({ lastID: this.lastID, changes: this.changes });
                });
            }),
        execAsync: (sql) =>
            new Promise((resolve, reject) => {
                raw.exec(sql, (err) => (err ? reject(err) : resolve()));
            }),
        close: () =>
            new Promise((resolve, reject) => {
                raw.close((err) => (err ? reject(err) : resolve()));
            })
    };
    return api;
}

function postgresSslFromEnv() {
    const url = process.env.DATABASE_URL || '';
    const explicitSsl = String(process.env.PGSSL || '').toLowerCase();
    const hostMatch = url.match(/@([^/:?]+)/);
    const host = hostMatch ? hostMatch[1] : '';
    const isSupabase =
        /\.supabase\.com$/i.test(host) ||
        /\.supabase\.co$/i.test(host) ||
        /pooler\.supabase\.com$/i.test(host);
    const sslServername = (process.env.PGSSL_SERVERNAME || '').trim() || host;
    const useSsl =
        explicitSsl === 'true' ||
        (explicitSsl !== 'false' && (isSupabase || /sslmode=require/i.test(url)));

    if (!useSsl) return undefined;
    return {
        rejectUnauthorized: false,
        ...(sslServername ? { servername: sslServername } : {})
    };
}

function createPostgresDatabase() {
    // Windows / some ISPs hang on IPv6-first lookups to Supabase poolers; prefer IPv4.
    try {
        require('dns').setDefaultResultOrder('ipv4first');
    } catch (_) { /* Node < 17 */ }

    const { Pool } = require('pg');
    const ssl = postgresSslFromEnv();
    const sslServername = process.env.PGSSL_SERVERNAME || (process.env.DATABASE_URL || '').match(/@([^/:?]+)/)?.[1] || '';

    const connectMs = parseInt(process.env.PG_CONNECT_TIMEOUT_MS || '30000', 10) || 30000;

    const pool = process.env.DATABASE_URL
        ? new Pool({
              connectionString: process.env.DATABASE_URL,
              ssl,
              connectionTimeoutMillis: connectMs
          })
        : new Pool({
              host: process.env.PGHOST || '127.0.0.1',
              port: parseInt(process.env.PGPORT || '5432', 10),
              user: process.env.PGUSER || 'tribams',
              password: process.env.PGPASSWORD || '',
              database: process.env.PGDATABASE || 'tribams',
              ssl,
              connectionTimeoutMillis: connectMs
          });

    if (sslServername) {
        console.log(`🐘 Postgres SSL SNI: ${sslServername}`);
    }

    async function query(sql, params = []) {
        const translated = translateSql(sql, 'postgres');
        if (translated === null) return { rows: [], rowCount: 0 };
        return pool.query(translated, params);
    }

    const api = {
        dialect: 'postgres',
        label: 'PostgreSQL',
        pool,
        getAsync: async (sql, params = []) => {
            const r = await query(sql, params);
            return r.rows[0];
        },
        allAsync: async (sql, params = []) => {
            const r = await query(sql, params);
            return r.rows;
        },
        runAsync: async (sql, params = []) => {
            const translated = translateSql(sql, 'postgres');
            if (translated === null) return { lastID: 0, changes: 0 };
            const r = await pool.query(translated, params);
            const row = r.rows && r.rows[0] ? r.rows[0] : null;
            return {
                lastID: row && (row.id != null ? row.id : row.user_id != null ? row.user_id : 0),
                changes: r.rowCount || 0
            };
        },
        execAsync: async (sql) => {
            const parts = String(sql)
                .split(';')
                .map((p) => p.trim())
                .filter(Boolean);
            for (const part of parts) {
                const translated = translateSql(part, 'postgres');
                if (translated) await pool.query(translated);
            }
        },
        close: async () => {
            await pool.end();
        }
    };
    return api;
}

function demoSqliteFallbackEnabled() {
    return String(process.env.DEMO_SQLITE_FALLBACK || '').toLowerCase() === 'true';
}

/**
 * @param {string} databaseDir - folder for SQLite file (ignored for Postgres)
 */
async function createDatabase(databaseDir) {
    const dialect = detectDialect();
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd && dialect !== 'postgres') {
        const msg =
            'Production requires DATABASE_URL (PostgreSQL). Add it in Railway Variables and link your Postgres service — SQLite is not supported on Railway.';
        console.error(`❌ ${msg}`);
        throw new Error(msg);
    }

    if (dialect !== 'postgres') {
        console.log('📦 Database driver: SQLite');
        return createSqliteDatabase(databaseDir);
    }

    const allowSqliteFallback = demoSqliteFallbackEnabled();
    console.log(
        allowSqliteFallback
            ? '🐘 Database driver: PostgreSQL (DEMO_SQLITE_FALLBACK=true)'
            : '🐘 Database driver: PostgreSQL'
    );

    const pg = createPostgresDatabase();
    const maxAttempts = Math.max(1, parseInt(process.env.PG_CONNECT_RETRIES || '5', 10) || 5);
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await pg.getAsync('SELECT 1 AS ok');
            if (attempt > 1) console.log(`🐘 Postgres connected on attempt ${attempt}/${maxAttempts}`);
            return pg;
        } catch (err) {
            lastErr = err;
            const msg = err && err.message ? err.message : String(err);
            if (attempt < maxAttempts) {
                const wait = Math.min(3000 * attempt, 15000);
                console.warn(`Postgres attempt ${attempt}/${maxAttempts} failed: ${msg} — retry in ${wait}ms`);
                await new Promise((r) => setTimeout(r, wait));
            }
        }
    }
    const msg = lastErr && lastErr.message ? lastErr.message : String(lastErr);
    try {
        await pg.close();
    } catch (_) {
        /* ignore */
    }
    if (allowSqliteFallback) {
        console.error('DEMO: using SQLite because Postgres timed out');
        console.error(`Postgres connect failed: ${msg}`);
        console.log('📦 Database driver: SQLite');
        return createSqliteDatabase(databaseDir);
    }
    console.error('❌ PostgreSQL connection failed (no DEMO_SQLITE_FALLBACK).');
    throw lastErr;
}

module.exports = {
    createDatabase,
    detectDialect,
    translateSql
};
