/**
 * Tribams progression gate
 * Learners must complete 65% of modules (pass mark) before leveling up.
 * Catalog size is dynamic — new modules automatically raise the bar.
 * First passing attempt (70%+) is the official record; retakes are allowed but do not replace it.
 */

const COMPLETION_THRESHOLD = 0.65; // 65%
const PASS_SCORE = 70; // module counts as done at 70%+

function sortChronologically(scores = []) {
    return [...scores]
        .filter(s => s && s.module_name && s.module_name !== 'Skill Assessment')
        .sort((a, b) => {
            const ta = a.completed_at ? Date.parse(a.completed_at) : 0;
            const tb = b.completed_at ? Date.parse(b.completed_at) : 0;
            if (ta && tb && ta !== tb) return ta - tb;
            return (Number(a.id) || 0) - (Number(b.id) || 0);
        });
}

/** First score >= PASS_SCORE per module — that is the official pass */
function buildFirstPassScores(scores = []) {
    const firstPass = new Map();
    for (const row of sortChronologically(scores)) {
        if (firstPass.has(row.module_name)) continue;
        if (typeof row.score === 'number' && row.score >= PASS_SCORE) {
            firstPass.set(row.module_name, {
                score: row.score,
                completed_at: row.completed_at || null
            });
        }
    }
    return firstPass;
}

function getCompletedModuleNames(scores = [], modulesList = []) {
    const firstPass = buildFirstPassScores(scores);
    const names = [];
    for (const m of modulesList) {
        if (firstPass.has(m.name)) names.push(m.name);
    }
    return names;
}

function getProgressSnapshot(scores = [], modulesList = []) {
    // Always derive denominator from live catalog length (auto-scales when modules are added)
    const total = Array.isArray(modulesList) && modulesList.length > 0 ? modulesList.length : 1;
    const firstPass = buildFirstPassScores(scores);
    const completedNames = getCompletedModuleNames(scores, modulesList);
    const completed = completedNames.length;
    const required = Math.ceil(total * COMPLETION_THRESHOLD);
    const ratio = completed / total;
    const pct = Math.round(ratio * 100);
    const meetsGate = ratio >= COMPLETION_THRESHOLD;

    // Official average = first-pass scores only (retakes do not rewrite history)
    const officialScores = completedNames.map(n => firstPass.get(n).score);
    const avg = officialScores.length
        ? Math.round(officialScores.reduce((a, b) => a + b, 0) / officialScores.length)
        : 0;

    let overall_level = 'beginner';
    let next_level = 'intermediate';
    let level_label = 'Recruit';

    if (meetsGate && avg >= 80) {
        overall_level = 'advanced';
        next_level = null;
        level_label = 'Mission-Ready Operator';
    } else if (meetsGate && avg >= 60) {
        overall_level = 'intermediate';
        next_level = 'advanced';
        level_label = 'Field Analyst';
    }

    return {
        total_modules: total,
        modules_completed: completed,
        completed_names: completedNames,
        required_for_level: required,
        completion_pct: pct,
        pass_score: PASS_SCORE,
        threshold_pct: Math.round(COMPLETION_THRESHOLD * 100),
        meets_level_gate: meetsGate,
        remaining_to_gate: Math.max(0, required - completed),
        average_score: avg,
        overall_level,
        next_level,
        level_label,
        force_ready: meetsGate && avg >= 75,
        first_pass_scores: Object.fromEntries(
            [...firstPass.entries()].map(([name, v]) => [name, v.score])
        ),
        message: meetsGate
            ? (avg >= 80
                ? 'Mission-Ready unlocked — advanced crisis-cell layers are live in your study guides and drills.'
                : 'Field Analyst unlocked — intermediate SOC/ops-floor layers are live. Raise first-pass average toward 80%+ for Mission-Ready.')
            : `Pass ${required - completed} more module(s) at ${PASS_SCORE}%+ to unlock Field Analyst environments (${pct}% / ${Math.round(COMPLETION_THRESHOLD * 100)}% of ${total} modules). Same modules deepen as you rank up.`
    };
}

/** Hard/expert modules locked until level gate; Special Ops also needs Mission-Ready (advanced). */
function isModuleUnlocked(module, progress) {
    if (!module) return false;
    if (!progress.meets_level_gate && (module.difficulty === 'hard' || module.difficulty === 'expert')) {
        return false;
    }
    const needRank = String(module.requires_rank || '').toLowerCase();
    if (needRank === 'advanced' && progress.overall_level !== 'advanced') {
        return false;
    }
    if (module.special_ops && progress.overall_level !== 'advanced') {
        return false;
    }
    return true;
}

function integrityRisk({ focusLosses = 0, hiddenMs = 0, timeTaken = 0, questionCount = 10, perfectScore = false }) {
    const flags = [];
    let risk = 0;

    if (focusLosses >= 3) {
        flags.push('Repeated tab/window switches during drill');
        risk += 35;
    } else if (focusLosses >= 1) {
        flags.push('Focus left the drill window');
        risk += 15;
    }

    if (hiddenMs >= 45000) {
        flags.push('Extended time away from drill (possible external assistance)');
        risk += 40;
    } else if (hiddenMs >= 15000) {
        flags.push('Notable time away from drill');
        risk += 20;
    }

    const avgSec = questionCount > 0 ? timeTaken / questionCount : 999;
    if (perfectScore && avgSec < 4) {
        flags.push('Implausibly fast perfect score');
        risk += 45;
    } else if (avgSec < 3 && questionCount >= 5) {
        flags.push('Answers submitted unusually fast');
        risk += 25;
    }

    let status = 'clean';
    if (risk >= 60) status = 'high_risk';
    else if (risk >= 30) status = 'review';

    return { risk, status, flags };
}

module.exports = {
    COMPLETION_THRESHOLD,
    PASS_SCORE,
    buildFirstPassScores,
    getProgressSnapshot,
    getCompletedModuleNames,
    isModuleUnlocked,
    integrityRisk
};
