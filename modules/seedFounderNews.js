/**
 * Ensure the CEO leadership post exists in news_posts (homepage + /news).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const TITLE = 'From a Simple Dream to a National Cyber Training Desk';
const SUMMARY =
    'Chief Executive Officer Mr. Britu Kativa on why TRIBAMS exists, what learners and organisations can expect, and the leadership culture behind Namibia\'s cyber training desk.';
const IMAGE = '/brand/founder-portrait.png';
const AUTHOR = 'Mr. Britu Kativa';
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

function loadBody() {
    if (!fs.existsSync(BODY_PATH)) {
        throw new Error(`Founder article missing: ${BODY_PATH}`);
    }
    return bodyFromMarkdown(fs.readFileSync(BODY_PATH, 'utf8'));
}

async function seedFounderNews(db) {
    let body;
    try {
        body = loadBody();
    } catch (e) {
        console.warn('⚠️ Founder news seed skipped:', e.message);
        return { seeded: false, reason: e.message };
    }

    const existing = await db.getAsync(
        `SELECT id, image_url FROM news_posts
         WHERE id = 3 OR title = ?
         ORDER BY id ASC LIMIT 1`,
        [TITLE]
    );

    if (existing) {
        await db.runAsync(
            `UPDATE news_posts SET title = ?, summary = ?, body = ?, kind = ?, image_url = ?,
                published = 1, pinned = 1, author = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [TITLE, SUMMARY, body, 'update', IMAGE, AUTHOR, existing.id]
        );
        console.log(`✅ Founder news post updated (id ${existing.id})`);
        return { seeded: true, id: existing.id, updated: true };
    }

    await db.runAsync(
        `INSERT INTO news_posts (title, summary, body, kind, image_url, published, pinned, author)
         VALUES (?, ?, ?, ?, ?, 1, 1, ?)`,
        [TITLE, SUMMARY, body, 'update', IMAGE, AUTHOR]
    );
    const row = await db.getAsync('SELECT id FROM news_posts WHERE title = ? ORDER BY id DESC LIMIT 1', [TITLE]);
    console.log(`✅ Founder news post published (id ${row?.id || '?'})`);
    return { seeded: true, id: row?.id, updated: false };
}

module.exports = { seedFounderNews, TITLE, SUMMARY, IMAGE, AUTHOR };
