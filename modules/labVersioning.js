/**
 * Evidence Workbench lab content versioning — per-module generation bumps when lab hashes change.
 */
const crypto = require('crypto');
const labEngine = require('./labEngine');

function labContentHash(lab) {
    if (!lab) return null;
    const payload = {
        steps: lab.steps,
        artifacts: lab.artifacts,
        briefing: lab.briefing,
        roe: lab.roe,
        attack_techniques: lab.attack_techniques
    };
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16);
}

function hashesForModule(moduleId) {
    const id = parseInt(moduleId, 10);
    const labs = labEngine.getLabsForModule(id);
    const hashes = {};
    for (const lab of labs) {
        hashes[lab.id] = labContentHash(lab);
    }
    return hashes;
}

async function syncLabGenerations(db) {
    const moduleIds = labEngine.modulesWithLabs();
    for (const moduleId of moduleIds) {
        const hashes = hashesForModule(moduleId);
        const hashesJson = JSON.stringify(hashes);
        const row = await db.getAsync(
            'SELECT generation, lab_hashes FROM lab_module_generations WHERE module_id = ?',
            [moduleId]
        );
        if (!row) {
            await db.runAsync(
                `INSERT INTO lab_module_generations (module_id, generation, lab_hashes, updated_at)
                 VALUES (?, 1, ?, CURRENT_TIMESTAMP)`,
                [moduleId, hashesJson]
            );
            continue;
        }
        let prev = {};
        try {
            prev = JSON.parse(row.lab_hashes || '{}');
        } catch (_) {
            prev = {};
        }
        const changed = JSON.stringify(prev) !== JSON.stringify(hashes);
        if (changed) {
            await db.runAsync(
                `UPDATE lab_module_generations
                 SET generation = generation + 1, lab_hashes = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE module_id = ?`,
                [hashesJson, moduleId]
            );
        }
    }
}

async function getLabVersionInfo(db, labId) {
    const lab = labEngine.getLab(labId);
    if (!lab) return { generation: 1, content_hash: null, module_id: null };
    const content_hash = labContentHash(lab);
    const row = await db.getAsync(
        'SELECT generation FROM lab_module_generations WHERE module_id = ?',
        [lab.module_id]
    );
    return {
        generation: Number(row?.generation || 1),
        content_hash,
        module_id: lab.module_id
    };
}

function isCompletionStale(completion, currentHash) {
    if (!completion || !completion.passed) return false;
    if (!currentHash) return false;
    if (!completion.content_hash) return true;
    return completion.content_hash !== currentHash;
}

module.exports = {
    labContentHash,
    syncLabGenerations,
    getLabVersionInfo,
    isCompletionStale
};
