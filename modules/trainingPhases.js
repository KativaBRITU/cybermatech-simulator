/**
 * Institutional training semester — sequential phases, community-official roles.
 * Aligns with the project book: Free sampler → Pro catalog → Special Ops 96–97,
 * 70% pass, program certificate at 65% catalog completion, 65% catalog for rank layers — without letting a
 * binge weekend empty the catalog or mint a stack of certificates.
 *
 * Typical calendar: 12+ weeks if the learner respects pace (max official first
 * passes per rolling week). Not a fake delay; it is how institutions train people
 * who will sit a community cyber desk.
 */

const PASS_SCORE = 70;
const CERT_SCORE = 80;
const MAX_FIRST_PASSES_PER_7_DAYS = 4;
const MIN_DAYS_BEFORE_MODULE_CERT = 14;
/** Single verifiable credential when the learner completes the training program (65% gate). */
const PROGRAM_CERTIFICATE_NAME = 'TRIBAMS Cybersecurity Training Program';

const PHASES = [
    {
        id: 1,
        code: 'foundation',
        name: 'Phase 1 — Community Foundation',
        community_role: 'Neighbourhood and SME cyber-hygiene official',
        weeks: '1–4',
        min_days_enrolled: 0,
        id_min: 1,
        id_max: 15,
        extra_ids: [37],
        outcome:
            'Judgment on phishing, social engineering, awareness, ethics, and basic blast-radius. The person a clinic, school, or parish can call first.'
    },
    {
        id: 2,
        code: 'operations',
        name: 'Phase 2 — Watchfloor Operations',
        community_role: 'Local SOC / ministry / campus ops-floor analyst',
        weeks: '5–8',
        min_days_enrolled: 21,
        id_min: 16,
        id_max: 45,
        extra_ids: [],
        outcome:
            'Containment, evidence, identity, cloud hygiene, and IR under incomplete information — still in TRIBAMS, not a VM pentest gym.'
    },
    {
        id: 3,
        code: 'adversary',
        name: 'Phase 3 — Adversary Literacy',
        community_role: 'Purple-aware community defender',
        weeks: '9–12',
        min_days_enrolled: 56,
        id_min: 46,
        id_max: 95,
        extra_ids: [],
        outcome:
            'Know how operators move and talk; hunt footprints (DNS, cadence, credential-store access); stay inside written ROE.'
    },
    {
        id: 4,
        code: 'crisis_cell',
        name: 'Phase 4 — Crisis Cell',
        community_role: 'Mission-Ready red/blue cell for the community and region',
        weeks: '13+',
        min_days_enrolled: 84,
        id_min: 96,
        id_max: 97,
        extra_ids: [],
        outcome:
            'Paired Special Ops desks. Requires prior phases, Mission-Ready rank, and Special Ops access. Not a live-fire certificate.'
    }
];

function daysBetween(from, to = new Date()) {
    const a = from ? Date.parse(from) : NaN;
    if (!Number.isFinite(a)) return 0;
    return Math.max(0, Math.floor((to.getTime() - a) / 86400000));
}

function phaseOwnsId(phase, id) {
    const n = Number(id);
    if (!Number.isFinite(n)) return false;
    if (n >= phase.id_min && n <= phase.id_max) return true;
    return (phase.extra_ids || []).includes(n);
}

function getPhaseForModuleId(moduleId) {
    const id = Number(moduleId);
    return PHASES.find((p) => phaseOwnsId(p, id)) || PHASES[0];
}

function modulesInPhase(catalog = [], phase) {
    return (catalog || []).filter((m) => phaseOwnsId(phase, m.id));
}

function passedNames(scores = []) {
    const first = new Map();
    const rows = [...(scores || [])]
        .filter((s) => s && s.module_name && s.module_name !== 'Skill Assessment')
        .sort((a, b) => {
            const ta = a.completed_at ? Date.parse(a.completed_at) : 0;
            const tb = b.completed_at ? Date.parse(b.completed_at) : 0;
            if (ta && tb && ta !== tb) return ta - tb;
            return (Number(a.id) || 0) - (Number(b.id) || 0);
        });
    for (const row of rows) {
        if (first.has(row.module_name)) continue;
        if (typeof row.score === 'number' && row.score >= PASS_SCORE) {
            first.set(row.module_name, row);
        }
    }
    return first;
}

function phaseComplete(phase, catalog, firstPass) {
    const mods = modulesInPhase(catalog, phase);
    if (!mods.length) return true;
    const needed = Math.max(1, Math.ceil(mods.length * 0.85));
    let n = 0;
    for (const m of mods) {
        if (firstPass.has(m.name)) n += 1;
    }
    return n >= needed;
}

function firstPassesInWindow(scores = [], windowMs = 7 * 86400000, now = Date.now()) {
    const first = passedNames(scores);
    let n = 0;
    for (const row of first.values()) {
        const t = row.completed_at ? Date.parse(row.completed_at) : 0;
        if (t && now - t <= windowMs) n += 1;
    }
    return n;
}

function getPhaseSnapshot({ catalog = [], scores = [], createdAt = null, now = new Date() } = {}) {
    const firstPass = passedNames(scores);
    const enrolledDays = daysBetween(createdAt, now);
    const weeklyFirstPasses = firstPassesInWindow(scores, 7 * 86400000, now.getTime());

    const rows = PHASES.map((phase) => {
        const mods = modulesInPhase(catalog, phase);
        const passed = mods.filter((m) => firstPass.has(m.name)).length;
        const complete = phaseComplete(phase, catalog, firstPass);
        return {
            id: phase.id,
            code: phase.code,
            name: phase.name,
            community_role: phase.community_role,
            weeks: phase.weeks,
            outcome: phase.outcome,
            min_days_enrolled: phase.min_days_enrolled,
            modules: mods.length,
            passed,
            complete,
            days_ok: enrolledDays >= phase.min_days_enrolled
        };
    });

    const unlocked = new Set();
    for (let i = 0; i < PHASES.length; i++) {
        const phase = PHASES[i];
        const row = rows[i];
        const prevOk = i === 0 ? true : rows[i - 1].complete;
        row.unlocked = prevOk && row.days_ok;
        if (row.unlocked) {
            for (const m of modulesInPhase(catalog, phase)) unlocked.add(m.id);
        }
        if (!row.unlocked) {
            row.lock_reason = !prevOk
                ? `Finish ${rows[i - 1].name} (about 85% of its modules at ${PASS_SCORE}%+) before this phase.`
                : `Institutional pace: ${phase.min_days_enrolled} days enrolled before ${phase.name} (${enrolledDays} so far).`;
        }
    }

    const current = rows.find((r) => r.unlocked && !r.complete) || rows.filter((r) => r.unlocked).pop() || rows[0];

    return {
        enrolled_days: enrolledDays,
        weekly_first_passes: weeklyFirstPasses,
        weekly_cap: MAX_FIRST_PASSES_PER_7_DAYS,
        weekly_remaining: Math.max(0, MAX_FIRST_PASSES_PER_7_DAYS - weeklyFirstPasses),
        min_days_before_module_cert: MIN_DAYS_BEFORE_MODULE_CERT,
        current_phase_id: current.id,
        current_phase_name: current.name,
        community_role: current.community_role,
        phases: rows,
        unlocked_module_ids: [...unlocked],
        message: `${current.name} · ${current.community_role}. Official first passes are paced (${MAX_FIRST_PASSES_PER_7_DAYS}/week) so this is a semester, not a weekend certificate mill.`
    };
}

function isModuleInUnlockedPhase(module, phaseSnap) {
    if (!module || !phaseSnap) return true;
    const ids = phaseSnap.unlocked_module_ids || [];
    if (!ids.length) return Number(module.id) <= 15 || (phaseSnap.phases && phaseSnap.phases[0] && phaseSnap.phases[0].unlocked);
    return ids.includes(Number(module.id));
}

function wouldBeNewFirstPass(scores, moduleName, newScore) {
    if (newScore < PASS_SCORE) return false;
    const first = passedNames(scores);
    return !first.has(moduleName);
}

function canTakeOfficialFirstPass({ scores, moduleName, newScore }) {
    if (!wouldBeNewFirstPass(scores, moduleName, newScore)) {
        return { ok: true, retake: true };
    }
    const used = firstPassesInWindow(scores);
    if (used >= MAX_FIRST_PASSES_PER_7_DAYS) {
        return {
            ok: false,
            paced: true,
            message: `Institutional pace: at most ${MAX_FIRST_PASSES_PER_7_DAYS} new module passes per 7 days. Practice stays open. Come back for the next official first pass.`
        };
    }
    return { ok: true, retake: false };
}

/** @deprecated Per-module certificates removed — use canIssueProgramCertificate. */
function canIssueModuleCertificate({ createdAt, integrityStatus, score, essayBlocksPass }) {
    return canIssueProgramCertificate({ createdAt, integrityStatus, progress: null, essayBlocksPass });
}

function canIssueProgramCertificate({ createdAt, integrityStatus, progress, essayBlocksPass }) {
    if (essayBlocksPass) return { ok: false, reason: 'Essay requirement not met on this module.' };
    if (integrityStatus === 'high_risk') return { ok: false, reason: 'Integrity review — certificate withheld.' };
    if (!progress || !progress.meets_level_gate) {
        const remaining = progress?.remaining_to_gate ?? 0;
        const pct = progress?.completion_pct ?? 0;
        const need = progress?.threshold_pct ?? 65;
        return {
            ok: false,
            reason: remaining > 0
                ? `Program certificate unlocks after you pass ${remaining} more module(s) at ${PASS_SCORE}%+ (${pct}% of ${need}% required).`
                : `Complete the training program (${need}% of modules at ${PASS_SCORE}%+) to earn your certificate.`
        };
    }
    const days = daysBetween(createdAt);
    if (days < MIN_DAYS_BEFORE_MODULE_CERT) {
        return {
            ok: false,
            reason: `Program certificate issues after ${MIN_DAYS_BEFORE_MODULE_CERT} days on the platform (${days} so far). Your progress is saved.`
        };
    }
    return { ok: true };
}

function studyGuidePhaseBanner(module) {
    const phase = getPhaseForModuleId(module && module.id);
    return `
## Institutional semester
**${phase.name}** (${phase.weeks}) · Role this phase trains: **${phase.community_role}**

${phase.outcome}

Finish this phase (about 85% of its modules at ${PASS_SCORE}%+) before the next one unlocks. Official first passes are capped at **${MAX_FIRST_PASSES_PER_7_DAYS} per 7 days**. Rank layers (Recruit → Field Analyst → Mission-Ready) still deepen the same guides. TRIBAMS is not a weekend PDF mill and not a VM pentest gym — it is a judgment path for people who will protect a real community desk.
`;
}

module.exports = {
    PHASES,
    PASS_SCORE,
    CERT_SCORE,
    MAX_FIRST_PASSES_PER_7_DAYS,
    MIN_DAYS_BEFORE_MODULE_CERT,
    PROGRAM_CERTIFICATE_NAME,
    getPhaseForModuleId,
    getPhaseSnapshot,
    isModuleInUnlockedPhase,
    canTakeOfficialFirstPass,
    canIssueModuleCertificate,
    canIssueProgramCertificate,
    studyGuidePhaseBanner
};
