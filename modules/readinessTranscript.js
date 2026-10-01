/**
 * Force Readiness Transcript — employer-readable ATT&CK-mapped proof.
 */

const crypto = require('crypto');
const progressGate = require('./progressGate');
const { listLabs } = require('./labEngine');
const { learnerMarketSignals } = require('./marketSignals');

function techniqueCatalogFromLabs() {
    const map = new Map();
    for (const lab of listLabs()) {
        for (const t of lab.attack_techniques || []) {
            if (!map.has(t)) map.set(t, { id: t, labs: [] });
            map.get(t).labs.push(lab.id);
        }
    }
    return map;
}

function buildTranscript({
    user,
    scores = [],
    catalog = [],
    labCompletions = [],
    certificates = [],
    integrityFlags = []
}) {
    const progress = progressGate.getProgressSnapshot(scores, catalog);
    const labPassed = labCompletions.filter((l) => (l.score || 0) >= 70);
    const techMap = techniqueCatalogFromLabs();
    const demonstrated = new Set();
    for (const lc of labPassed) {
        let techs = [];
        try {
            techs = JSON.parse(lc.attack_techniques || '[]');
        } catch (e) {
            techs = [];
        }
        techs.forEach((t) => demonstrated.add(t));
    }

    const techniques = [...techMap.keys()].map((id) => ({
        id,
        demonstrated: demonstrated.has(id),
        related_labs: techMap.get(id).labs
    }));

    const integrityClean = !integrityFlags.some((f) => (f.risk_score || 0) >= 70);

    const base = {
        learner: {
            username: user.username,
            member_since: user.created_at || null
        },
        readiness: {
            level: progress.overall_level,
            level_label: progress.level_label,
            force_ready: !!progress.force_ready,
            modules_completed: progress.modules_completed,
            total_modules: progress.total_modules,
            completion_pct: progress.completion_pct,
            average_first_pass: progress.average_score,
            message: progress.message
        },
        labs: {
            completed: labPassed.length,
            available: listLabs().length,
            items: labPassed.map((l) => ({
                lab_id: l.lab_id,
                score: l.score,
                completed_at: l.completed_at
            }))
        },
        attack_coverage: {
            demonstrated: [...demonstrated],
            catalog_size: techMap.size,
            coverage_pct: techMap.size
                ? Math.round((demonstrated.size / techMap.size) * 100)
                : 0,
            techniques
        },
        certificates: certificates.slice(0, 10).map((c) => ({
            id: c.certificate_id,
            module: c.module_name,
            score: c.score,
            issued: c.issue_date
        })),
        integrity: {
            status: integrityClean ? 'clean' : 'flagged',
            note: integrityClean
                ? 'No high-risk integrity events on record for scored drills.'
                : 'One or more high-risk integrity events recorded — employer should review context.'
        },
        generated_at: new Date().toISOString()
    };

    base.market_signals = learnerMarketSignals(base);
    return base;
}

function issueToken() {
    return 'FR-' + crypto.randomBytes(16).toString('hex');
}

module.exports = {
    buildTranscript,
    issueToken,
    techniqueCatalogFromLabs
};
