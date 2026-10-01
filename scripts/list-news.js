const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'tribams.db'));
db.all('SELECT * FROM news_posts ORDER BY id DESC', (e, rows) => {
    console.log('POSTS:', JSON.stringify(rows, null, 2));
    db.close();
});
['news', 'founders'].forEach((d) => {
    const p = path.join(__dirname, '..', 'public', 'uploads', d);
    console.log(d, fs.existsSync(p) ? fs.readdirSync(p) : 'missing');
});
