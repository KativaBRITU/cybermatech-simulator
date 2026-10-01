/**
 * Publish founder leadership news post (post id 3).
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { createDatabase } = require('../modules/database');

const TITLE = 'From a Simple Dream to a National Cyber Training Desk';
const SUMMARY =
    'Chief Executive Officer Mr. Britu Kativa on why TRIBAMS exists, what learners and organisations can expect, and the leadership culture behind Namibia\'s cyber training desk.';
const IMAGE = '/brand/founder-portrait.png';
const BODY_PATH = path.join(__dirname, '..', 'content', 'founder-leadership-article.md');

function bodyFromMarkdown(md) {
    return md
        .replace(/^# .+\n/m, '')
        .replace(/^\*\*(?:Mr\.\s+)?Britu Kativa[^\n]*\n/m, '')
        .replace(/^---\n/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/^## (.+)$/gm, '\n\n$1\n\n')
        .trim();
}

async function main() {
    const body = bodyFromMarkdown(fs.readFileSync(BODY_PATH, 'utf8'));
    const db = await createDatabase(path.join(__dirname, '..', 'database'));
    await db.runAsync(
        `UPDATE news_posts SET title = ?, summary = ?, body = ?, kind = ?, image_url = ?,
            published = 1, pinned = 1, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 3`,
        [TITLE, SUMMARY, body, 'update', IMAGE, 'Mr. Britu Kativa']
    );
    const row = await db.getAsync('SELECT id, title, image_url, pinned, length(body) AS len FROM news_posts WHERE id = 3');
    console.log('Published:', row);
    await db.close();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
