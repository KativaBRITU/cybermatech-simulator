/**
 * Market signals — what TRIBAMS can honestly claim to buyers & employers.
 * Keeps claims bounded: judgment + ATT&CK lab proof, not full VM-range parity.
 */

const { listLabs, MODULE_NAMES } = require('./labEngine');

const PLATFORM_CLAIMS = {
    product: 'TRIBAMS',
    positioning:
        'An institutional cybersecurity judgment path — Namibia-rooted, global in threat floor — that trains community cyber officials over a semester, not a weekend PDF. Evidence Workbench labs and Force Readiness transcripts; not a VM pentest gym.',
    competitors: {
        vs_tryhackme_htb:
            'Those products excel at machines and CTF hours. TRIBAMS trains defendable decisions on artifacts, ATT&CK language, and local injects (WhatsApp, mobile-money, ministry BEC).',
        vs_sans_rangeforce:
            'They hold brand and enterprise range trust. TRIBAMS is the emerging institutional path for campuses, SMEs, and public desks that need proof of judgment without a six-figure range.',
        vs_generic_lms:
            'Slide decks do not mint operators. TRIBAMS scores timed drills server-side, binds certificates to the account, and phases the catalog so completion means a community-ready desk, not a binge.'
    },
    not_claiming: [
        'Not a full interactive network / VM attack-range substitute',
        'Not a live red-team engagement or penetration-test certificate',
        'Not a university degree equivalent',
        'Not a weekend certificate mill'
    ],
    does_claim: [
        'Phased institutional semester (Foundation → Operations → Adversary literacy → Crisis cell)',
        '97 scenario-driven modules with African-context study guides and drills',
        'WhatsApp/BEC/mobile-money and ministry/SME scenarios across the continent',
        'Evidence Workbench labs graded on artifacts under time pressure',
        'ATT&CK techniques credited from passed labs (70%+)',
        'Integrity-aware scored drills (server-side grading; focus/risk signals)',
        'Shareable Force Readiness transcript token for employers — after earned time on platform'
    ],
    pass_mark: 70,
    catalog_modules: 97,
    recommended_buyer:
        'African and global institutions that need to staff community cyber desks — SMEs, campuses, public sector — with judgment proof, not vanity PDFs'
};

function catalogMarketSignals() {
    const labs = listLabs();
    const techniques = new Set();
    const tracks = {};
    for (const lab of labs) {
        (lab.attack_techniques || []).forEach((t) => techniques.add(t));
        const tr = lab.track || 'ops-general';
        tracks[tr] = (tracks[tr] || 0) + 1;
    }
    return {
        ...PLATFORM_CLAIMS,
        workbench: {
            labs: labs.length,
            modules_with_labs: new Set(labs.map((l) => l.module_id)).size,
            unique_attack_techniques: techniques.size,
            techniques: [...techniques].sort(),
            tracks
        },
        sample_lab_modules: labs.slice(0, 8).map((l) => ({
            lab_id: l.id,
            module_id: l.module_id,
            module_name: MODULE_NAMES[l.module_id] || l.module_name,
            title: l.title,
            techniques: l.attack_techniques
        })),
        generated_at: new Date().toISOString()
    };
}

/**
 * Learner-specific market signal block for transcripts / dashboard.
 */
function learnerMarketSignals(transcript) {
    const readiness = transcript.readiness || {};
    const labs = transcript.labs || {};
    const attack = transcript.attack_coverage || {};
    const integrity = transcript.integrity || {};

    const signals = [];

    if (readiness.force_ready) {
        signals.push({
            id: 'force_ready',
            strength: 'strong',
            label: 'Force-Ready gate met',
            employer_line: 'Learner met Tribams catalog readiness threshold (65% modules at 70%+).'
        });
    } else {
        signals.push({
            id: 'force_ready',
            strength: 'weak',
            label: 'Force-Ready not yet met',
            employer_line: `In progress: ${readiness.modules_completed || 0}/${readiness.total_modules || 95} modules passed.`
        });
    }

    const labPct = labs.available ? Math.round(((labs.completed || 0) / labs.available) * 100) : 0;
    signals.push({
        id: 'workbench',
        strength: labPct >= 40 ? 'strong' : labPct >= 15 ? 'moderate' : 'weak',
        label: `Workbench ${labs.completed || 0}/${labs.available || 0} labs`,
        employer_line: 'Evidence Workbench scores reflect artifact-based decisions under time pressure.'
    });

    signals.push({
        id: 'attack',
        strength: (attack.coverage_pct || 0) >= 35 ? 'strong' : (attack.coverage_pct || 0) >= 15 ? 'moderate' : 'weak',
        label: `ATT&CK lab coverage ${attack.coverage_pct || 0}%`,
        employer_line: `${(attack.demonstrated || []).length} techniques demonstrated via passed labs (not a full ATT&CK matrix).`
    });

    signals.push({
        id: 'integrity',
        strength: integrity.status === 'clean' ? 'strong' : 'flagged',
        label: integrity.status === 'clean' ? 'Integrity: clean' : 'Integrity: flagged',
        employer_line: integrity.note || ''
    });

    const strongCount = signals.filter((s) => s.strength === 'strong').length;
    let market_band = 'emerging';
    let market_band_label = 'Emerging — early proof';
    if (strongCount >= 3 && readiness.force_ready) {
        market_band = 'recommendable';
        market_band_label = 'Recommendable — force-ready with Workbench + clean integrity';
    } else if (strongCount >= 2 || (labs.completed || 0) >= 5) {
        market_band = 'developing';
        market_band_label = 'Developing — meaningful lab/module signal, still building';
    }

    return {
        market_band,
        market_band_label,
        employer_summary: buildEmployerSummary(readiness, labs, attack, integrity, market_band_label),
        signals,
        heatmap: (attack.techniques || []).map((t) => ({
            id: t.id,
            on: !!t.demonstrated,
            labs: t.related_labs || []
        }))
    };
}

function buildEmployerSummary(readiness, labs, attack, integrity, bandLabel) {
    return [
        `TRIBAMS market band: ${bandLabel}.`,
        `Modules passed (≥70%): ${readiness.modules_completed || 0} of ${readiness.total_modules || 95} (${readiness.completion_pct || 0}%).`,
        `Evidence Workbench labs passed: ${labs.completed || 0} of ${labs.available || 0}.`,
        `ATT&CK techniques from labs: ${(attack.demonstrated || []).length} demonstrated (${attack.coverage_pct || 0}% of Workbench technique catalog).`,
        `Scored-drill integrity: ${integrity.status || 'unknown'}.`,
        'Interpretation: measures professional judgment and lab decisions — not live exploit lab hours.'
    ].join(' ');
}

module.exports = {
    PLATFORM_CLAIMS,
    catalogMarketSignals,
    learnerMarketSignals
};
