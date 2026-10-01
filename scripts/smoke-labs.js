require('dotenv').config();
const path = require('path');
const lab = require('../modules/labEngine');
const { createDatabase } = require('../modules/database');
const { initSchema } = require('../modules/schema');

const r = lab.scoreLab('phish-triage-01', { s1: 1, s2: 2, s3: 1, s4: 1 });
console.log('score', r.score, 'passed', r.passed, 'techs', r.attack_techniques_demonstrated);

(async () => {
    const db = createDatabase(path.join(__dirname, '..', 'database'));
    await initSchema(db);
    if (db.dialect === 'sqlite') {
        const t = await db.allAsync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('lab_completions','readiness_tokens')"
        );
        console.log('tables', t);
    } else {
        console.log('postgres dialect ok');
    }
    await db.close();
    console.log('ok');
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
