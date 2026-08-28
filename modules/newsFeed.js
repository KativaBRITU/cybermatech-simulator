/**
 * Public news / offers feed — edited from Admin, no code changes required.
 */

const ALLOWED_KINDS = new Set(['update', 'offer', 'training', 'event']);

function clip(str, max) {
    return String(str || '').trim().slice(0, max);
}

function normalizeKind(kind) {
    const k = String(kind || 'update').toLowerCase();
    return ALLOWED_KINDS.has(k) ? k : 'update';
}

function asFlag(v) {
    return v === true || v === 1 || v === '1' || v === 'true' || v === 'on' ? 1 : 0;
}

function rowToPublic(row) {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        summary: row.summary || '',
        body: row.body || '',
        kind: row.kind || 'update',
        image_url: row.image_url || null,
        pinned: !!(row.pinned),
        author: row.author || 'TRIBAMS',
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

async function listPublished(db, { limit = 24 } = {}) {
    const n = Math.min(50, Math.max(1, Number(limit) || 24));
    const rows = await db.allAsync(
        `SELECT id, title, summary, body, kind, image_url, pinned, author, created_at, updated_at
         FROM news_posts WHERE published = 1
         ORDER BY pinned DESC, created_at DESC, id DESC
         LIMIT ?`,
        [n]
    );
    return (rows || []).map(rowToPublic);
}

async function listAll(db) {
    const rows = await db.allAsync(
        `SELECT * FROM news_posts ORDER BY created_at DESC, id DESC LIMIT 200`
    );
    return rows || [];
}

async function getPublished(db, id) {
    const row = await db.getAsync(
        'SELECT * FROM news_posts WHERE id = ? AND published = 1',
        [id]
    );
    return rowToPublic(row);
}

async function createPost(db, input, author) {
    const title = clip(input.title, 160);
    if (title.length < 4) {
        return { ok: false, message: 'Title must be at least 4 characters.' };
    }
    await db.runAsync(
        `INSERT INTO news_posts (title, summary, body, kind, image_url, published, pinned, author)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title,
            clip(input.summary, 280),
            clip(input.body, 12000),
            normalizeKind(input.kind),
            clip(input.image_url, 400) || null,
            asFlag(input.published),
            asFlag(input.pinned),
            clip(author, 80) || 'TRIBAMS'
        ]
    );
    return { ok: true };
}

async function updatePost(db, id, input) {
    const existing = await db.getAsync('SELECT id FROM news_posts WHERE id = ?', [id]);
    if (!existing) return { ok: false, message: 'Post not found.' };
    const title = clip(input.title, 160);
    if (title.length < 4) {
        return { ok: false, message: 'Title must be at least 4 characters.' };
    }
    await db.runAsync(
        `UPDATE news_posts SET title = ?, summary = ?, body = ?, kind = ?, image_url = ?,
            published = ?, pinned = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [
            title,
            clip(input.summary, 280),
            clip(input.body, 12000),
            normalizeKind(input.kind),
            clip(input.image_url, 400) || null,
            asFlag(input.published),
            asFlag(input.pinned),
            id
        ]
    );
    return { ok: true };
}

async function deletePost(db, id) {
    const row = await db.getAsync('SELECT id, image_url FROM news_posts WHERE id = ?', [id]);
    if (!row) return { ok: false, message: 'Post not found.' };
    await db.runAsync('DELETE FROM news_posts WHERE id = ?', [id]);
    return { ok: true, image_url: row.image_url };
}

module.exports = {
    ALLOWED_KINDS,
    listPublished,
    listAll,
    getPublished,
    createPost,
    updatePost,
    deletePost
};
