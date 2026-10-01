const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'database', 'tribams.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, username, email, created_at, status FROM users ORDER BY id', (e, rows) => {
    if (e) console.error(e);
    else console.log('ALL USERS:', JSON.stringify(rows, null, 2));

    db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (e2, tables) => {
        console.log('\nTABLES:', tables.map((t) => t.name).join(', '));

        // Search any text columns for the missing names
        const patterns = ['mufenda', 'mukwaru', 'butiha'];
        let pending = tables.length;
        if (!pending) return db.close();
        tables.forEach(({ name }) => {
            db.all(`PRAGMA table_info(${name})`, (e3, cols) => {
                pending--;
                if (e3 || !cols) {
                    if (pending === 0) db.close();
                    return;
                }
                const textCols = cols.filter((c) => /char|text|clob/i.test(c.type)).map((c) => c.name);
                if (!textCols.length) {
                    if (pending === 0) db.close();
                    return;
                }
                const wheres = patterns.flatMap((p) =>
                    textCols.map((col) => `lower(${col}) LIKE '%${p}%'`)
                );
                db.all(`SELECT * FROM ${name} WHERE ${wheres.join(' OR ')} LIMIT 5`, (e4, hits) => {
                    if (hits && hits.length) {
                        console.log(`\nHITS in ${name}:`, JSON.stringify(hits, null, 2));
                    }
                    if (pending === 0) db.close();
                });
            });
        });
    });
});
