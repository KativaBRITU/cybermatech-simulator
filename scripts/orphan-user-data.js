const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'tribams.db'));

function q(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (e, rows) => (e ? reject(e) : resolve(rows)));
    });
}

(async () => {
    const orphanIds = [3, 7, 8, 9, 10];
    const tables = await q("SELECT name FROM sqlite_master WHERE type='table'");
    for (const { name } of tables) {
        const cols = await q(`PRAGMA table_info(${name})`);
        const userCol = cols.find((c) => c.name === 'user_id');
        if (!userCol) continue;
        for (const id of orphanIds) {
            const rows = await q(`SELECT * FROM ${name} WHERE user_id = ? LIMIT 3`, [id]);
            if (rows.length) console.log(`${name} user_id=${id}:`, rows);
        }
    }
    db.close();
})();
