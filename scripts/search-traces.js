const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'tribams.db'));
const patterns = ['mufenda', 'mukwaru', 'butiha'];

function q(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (e, rows) => (e ? reject(e) : resolve(rows)));
    });
}

(async () => {
    for (const table of ['email_verifications', 'password_resets', 'user_activity', 'subscriptions', 'feedback']) {
        try {
            const cols = await q(`PRAGMA table_info(${table})`);
            const textCols = cols.filter((c) => /char|text|clob/i.test(c.type)).map((c) => c.name);
            if (!textCols.length) continue;
            const wheres = patterns.flatMap((p) => textCols.map((col) => `lower(${col}) LIKE '%${p}%'`));
            const rows = await q(`SELECT * FROM ${table} WHERE ${wheres.join(' OR ')} LIMIT 10`);
            console.log(table, rows.length ? rows : '(none)');
        } catch (e) {
            console.log(table, 'skip', e.message);
        }
    }
    db.close();
})();
