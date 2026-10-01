/**
 * Do NOT run this script.
 * It would set subscription_tier=special_ops for founder usernames/emails
 * (Kabox, Mukwaruze, trbams, iyambohs, tribamszetu) without proof of payment.
 * Katva admin is ADMIN_EMAILS only. Paid Special Ops stays as paid.
 */
const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'tribams.db'));
const sql = `UPDATE users SET subscription_tier = 'special_ops', subscription_status = 'active'
  WHERE lower(username) IN ('kabox','mukwaruze','katva','trbams','kativabritu')
     OR lower(email) IN ('iyambohs@yahoo.com','kativabritish@gmail.com','tribamszetu@gmail.com')`;
db.run(sql, function onRun(err) {
    if (err) {
        console.error(err);
        db.close();
        process.exit(1);
    }
    console.log('updated', this.changes);
    db.all('SELECT id, username, email, subscription_tier, subscription_status FROM users', (e2, rows) => {
        if (e2) console.error(e2);
        else console.log(JSON.stringify(rows, null, 2));
        db.close();
    });
});
