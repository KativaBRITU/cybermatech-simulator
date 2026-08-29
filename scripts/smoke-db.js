require('dotenv').config();
const path = require('path');
const { createDatabase, translateSql } = require('../modules/database');
const { initSchema } = require('../modules/schema');

(async () => {
    const db = await createDatabase(path.join(__dirname, '..', 'database'));
    console.log('dialect', db.dialect, db.label);
    await initSchema(db);
    const rows = await db.allAsync('SELECT COUNT(*) as c FROM modules');
    console.log('modules', rows);
    console.log(
        'translated',
        translateSql(
            "SELECT * FROM users WHERE last_active > datetime('now','-24 hours') AND id=?",
            'postgres'
        )
    );
    await db.close();
    console.log('ok');
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
