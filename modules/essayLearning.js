/**
 * Essay scoring for module composite pass (private to the learner).
 *
 * Weights toward module composite pass (essay share of grade):
 *   beginner     → 40%
 *   intermediate → 50%
 *   advanced     → 60%
 *
 * Minimum essay score to count as a mandatory pass component:
 *   beginner 40%, intermediate 50%, advanced 60%.
 * Catalog gate remains 65% of modules at the composite pass mark.
 *
 * Shared harvest into module_contents / public labs is disabled in the API;
 * helpers below remain for optional admin/offline tooling only.
 */

'use strict';

const ESSAY_WEIGHT = {
    beginner: 0.4,
    intermediate: 0.5,
    advanced: 0.6,
    easy: 0.4,
    medium: 0.5,
    hard: 0.6
};

const ESSAY_MIN_SCORE = {
    beginner: 40,
    intermediate: 50,
    advanced: 60,
    easy: 40,
    medium: 50,
    hard: 60
};

const CATEGORY_KEYWORDS = {
    phishing: ['phishing', 'email', 'spoof', 'link', 'credential', 'social', 'sender', 'verify', 'report'],
    malware: ['malware', 'ransomware', 'trojan', 'payload', 'sandbox', 'hash', 'indicator', 'ioc'],
    network: ['firewall', 'network', 'segment', 'vpn', 'zero trust', 'port', 'dns', 'ids', 'ips'],
    cloud: ['cloud', 'iam', 's3', 'azure', 'aws', 'shared responsibility', 'bucket', 'key'],
    forensics: ['forensic', 'evidence', 'log', 'timeline', 'chain of custody', 'image', 'artifact'],
    'social-engineering': ['social', 'pretext', 'vishing', 'baiting', 'awareness', 'human'],
    governance: ['policy', 'risk', 'compliance', 'governance', 'control', 'audit', 'gdpr'],
    emerging: ['ai', 'iot', 'ot', 'ics', 'blockchain', 'api', 'container'],
    default: ['security', 'risk', 'control', 'detect', 'respond', 'protect', 'identity', 'access']
};

const CATEGORY_STUDY_FRAMES = {
    phishing: {
        focus: 'Email / messaging deception',
        checklist: [
            'Verify sender via a second channel before acting on urgency',
            'Inspect links and attachments in a safe viewer — do not click live',
            'Report to the security mailbox / SOC and preserve the original message'
        ]
    },
    malware: {
        focus: 'Malicious code and ransomware readiness',
        checklist: [
            'Isolate the host without destroying volatile evidence',
            'Capture hashes / IOCs and compare against known families',
            'Restore from known-good backups only after containment'
        ]
    },
    network: {
        focus: 'Network containment and segmentation',
        checklist: [
            'Prefer targeted blocks over site-wide shutdowns',
            'Preserve logs and flow records for the investigation window',
            'Validate VPN / zero-trust paths before expanding access'
        ]
    },
    cloud: {
        focus: 'Cloud identity and shared responsibility',
        checklist: [
            'Revoke or rotate exposed keys and review IAM blast radius',
            'Check public buckets / misconfigured shares first',
            'Document which controls are customer-owned vs provider-owned'
        ]
    },
    forensics: {
        focus: 'Evidence integrity',
        checklist: [
            'Maintain chain of custody and write-block where possible',
            'Build a timeline from logs before remediation wipes artifacts',
            'Record tool versions and hash of images collected'
        ]
    },
    'social-engineering': {
        focus: 'Human-layer attacks',
        checklist: [
            'Slow down authority / urgency pressure with a call-back policy',
            'Train staff to escalate unusual requests to a known contact',
            'Treat voice deepfakes and WhatsApp pressure as high-risk signals'
        ]
    },
    governance: {
        focus: 'Policy, risk, and compliance',
        checklist: [
            'Map the issue to a written control owner',
            'Record risk acceptance with expiry — never silent exceptions',
            'Align response steps to the organisation policy the learner cited'
        ]
    },
    emerging: {
        focus: 'Emerging tech risk (AI, IoT/OT, APIs)',
        checklist: [
            'Separate IT and OT paths; avoid flat plant networks',
            'Treat AI-generated content as untrusted until verified',
            'Inventory API keys and container privileges in scope'
        ]
    },
    default: {
        focus: 'General cyber decision-making',
        checklist: [
            'Contain first, then investigate',
            'Prefer least privilege and dual control',
            'Document decisions so peers can reuse the playbook'
        ]
    }
};

function normalizeRank(rankOrDifficulty = 'beginner') {
    const r = String(rankOrDifficulty || 'beginner').toLowerCase();
    if (['advanced', 'hard'].includes(r)) return 'advanced';
    if (['intermediate', 'medium'].includes(r)) return 'intermediate';
    return 'beginner';
}

function essayWeight(rankOrDifficulty) {
    const key = normalizeRank(rankOrDifficulty);
    return ESSAY_WEIGHT[key] ?? 0.4;
}

function essayMinScore(rankOrDifficulty) {
    const key = normalizeRank(rankOrDifficulty);
    return ESSAY_MIN_SCORE[key] ?? 40;
}

function tokenize(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2);
}

function categoryKey(category) {
    const catKey = String(category || 'default').toLowerCase();
    return CATEGORY_KEYWORDS[catKey] ? catKey : 'default';
}

function scoreEssay({ answer, question, category, rankOrDifficulty, moduleName, moduleKeywords = [] }) {
    const text = String(answer || '').trim();
    const words = tokenize(text);
    const qWords = new Set(tokenize(question));
    const catKey = categoryKey(category);
    const catWords = CATEGORY_KEYWORDS[catKey] || CATEGORY_KEYWORDS.default;
    const modWords = Array.isArray(moduleKeywords) ? moduleKeywords : [];

    let score = 0;
    if (text.length >= 150) score += 15;
    if (text.length >= 300) score += 12;
    if (text.length >= 500) score += 10;
    if (text.length >= 800) score += 8;
    if (words.length >= 40) score += 8;
    if (words.length >= 80) score += 7;

    let qHits = 0;
    for (const w of words) if (qWords.has(w)) qHits++;
    score += Math.min(15, qHits * 2);

    let cHits = 0;
    const lower = text.toLowerCase();
    for (const kw of catWords) if (lower.includes(kw)) cHits++;
    score += Math.min(20, cHits * 4);

    let mHits = 0;
    for (const kw of modWords) {
        if (kw.length > 3 && lower.includes(kw.toLowerCase())) mHits++;
    }
    score += Math.min(15, mHits * 3);

    // Reject obvious filler / copy-paste spam
    const fillerRe = /(\b(lorem ipsum|as an ai|i cannot|test test|security is important)\b)/i;
    const repeated = /(.{20,})\1{2,}/;
    if (fillerRe.test(text)) score = Math.min(score, 25);
    if (repeated.test(text)) score = Math.min(score, 30);

    score = Math.max(0, Math.min(100, Math.round(score)));
    const min = essayMinScore(rankOrDifficulty);
    const relevant = score >= min
        && cHits >= 2
        && (mHits >= 2 || (moduleName && lower.includes(String(moduleName).toLowerCase().split(' ')[0])))
        && text.length >= 200
        && words.length >= 45;
    return {
        score,
        min_required: min,
        passed: score >= min,
        relevant,
        category_hits: cHits,
        module_hits: mHits,
        question_hits: qHits,
        weight: essayWeight(rankOrDifficulty),
        category: catKey
    };
}

function compositeModuleScore(quizScore, essayScore, rankOrDifficulty) {
    const w = essayWeight(rankOrDifficulty);
    const q = Number(quizScore) || 0;
    const e = Number(essayScore) || 0;
    return Math.round(q * (1 - w) + e * w);
}

function sanitizeSnippet(text, maxLen = 420) {
    let s = String(text || '')
        .replace(/\s+/g, ' ')
        .replace(/[<>]/g, '')
        .trim();
    if (s.length > maxLen) s = s.slice(0, maxLen - 1).trim() + '…';
    return s;
}

function extractActionLines(answer, limit = 4) {
    const lines = String(answer || '')
        .split(/[\n.;]+/)
        .map((s) => s.trim())
        .filter((s) => s.length >= 24 && s.length <= 180);
    const actionish = lines.filter((s) =>
        /\b(should|must|verify|isolate|report|contain|check|disable|escalate|document|rotate|block)\b/i.test(s)
    );
    const picked = (actionish.length ? actionish : lines).slice(0, limit);
    return picked.map((s) => sanitizeSnippet(s, 160));
}

function buildStudySnippet({ moduleName, category, question, answer, score }) {
    const cat = categoryKey(category);
    const frame = CATEGORY_STUDY_FRAMES[cat] || CATEGORY_STUDY_FRAMES.default;
    const body = sanitizeSnippet(answer, 360);
    const actions = extractActionLines(answer, 3);
    const checklist = frame.checklist.map((c) => `- ${c}`).join('\n');
    const actionBlock = actions.length
        ? actions.map((a) => `- ${a}`).join('\n')
        : '- (Peer note lacked explicit action verbs — use the category checklist below.)';

    return [
        '',
        `### Learner-trained study block — ${frame.focus}`,
        `*Module: ${moduleName || 'module'} · category: ${cat} · peer quality ${score}%*`,
        '',
        `**Research prompt:** ${sanitizeSnippet(question, 160)}`,
        '',
        '**Peer research excerpt**',
        body,
        '',
        '**Actions extracted from the peer answer**',
        actionBlock,
        '',
        `**Category drill checklist (${cat})**`,
        checklist,
        ''
    ].join('\n');
}

function buildLabSeed({ moduleId, moduleName, category, answer, score, question }) {
    const cat = categoryKey(category);
    const frame = CATEGORY_STUDY_FRAMES[cat] || CATEGORY_STUDY_FRAMES.default;
    const snippet = sanitizeSnippet(answer, 240);
    const actions = extractActionLines(answer, 3);
    const stamp = Date.now().toString(36);
    const bestAction = actions[0] || frame.checklist[0];

    return {
        id: `learner-${moduleId}-${stamp}`,
        module_id: moduleId,
        title: `Learner lab — ${moduleName || 'module'} (${cat})`,
        subtitle: `Trained from peer research · quality ${score}%`,
        track: cat || 'ops-general',
        difficulty: score >= 70 ? 'medium' : 'easy',
        time_limit_sec: 480,
        briefing: [
            `Category focus: ${frame.focus}.`,
            `A peer researched: ${sanitizeSnippet(question || moduleName || 'this module', 140)}.`,
            'Treat their note as an evidence artifact. Choose professional controls — not panic options.'
        ].join(' '),
        objectives: [
            `Apply ${frame.focus} judgment under time pressure`,
            'Prefer verification and containment over speed-alone decisions',
            'Reuse peer-researched actions when they match policy'
        ],
        roe: [
            'No live offensive actions — judgment only',
            'Assume the peer note is incomplete; still pick the safest next step'
        ],
        artifacts: [
            { type: 'note', label: 'Peer research excerpt', content: snippet },
            {
                type: 'checklist',
                label: `${cat} checklist`,
                content: frame.checklist.join('\n')
            },
            ...(actions.length
                ? [{ type: 'note', label: 'Extracted actions', content: actions.join('\n') }]
                : [])
        ],
        attack_techniques: [],
        steps: [
            {
                id: 's1',
                prompt: 'Based on the peer research note, what is the strongest immediate action?',
                options: [
                    bestAction,
                    'Ignore the note and wait for more tickets to pile up',
                    'Publicly blame a vendor without evidence',
                    'Wipe all systems immediately without preserving logs'
                ],
                correct: 0,
                points: 40,
                explanation: 'Peer-trained labs reward concrete verification/containment steps drawn from researched answers.'
            },
            {
                id: 's2',
                prompt: `For ${cat} incidents, which control best matches this category checklist?`,
                options: [
                    frame.checklist[0],
                    'Delete all evidence to keep the board calm',
                    'Share passwords in a group chat for speed',
                    'Disable monitoring so alerts stop'
                ],
                correct: 0,
                points: 35,
                explanation: frame.checklist[0]
            },
            {
                id: 's3',
                prompt: 'How should this peer note be used for the wider force?',
                options: [
                    'Fold verified actions into study notes and keep drilling judgment labs',
                    'Treat one peer essay as classified gospel with no review',
                    'Hide the finding so others cannot learn',
                    'Replace all official policy with anonymous forum posts'
                ],
                correct: 0,
                points: 25,
                explanation: 'Relevant essays train modules and labs, but policy and dual review still apply.'
            }
        ],
        grader_hints: [
            'Prefer concrete verification, containment, and escalation over vague awareness advice.',
            `Align with ${cat} controls: ${frame.checklist[0]}`
        ],
        source: 'learner_essay',
        quality: score,
        category: cat
    };
}

function essayPassStatus(essays = [], rankOrDifficulty) {
    const minE = essayMinScore(rankOrDifficulty);
    const minPass = assessmentEngineMinPassCount();
    const relevantPassed = essays.filter(
        (e) => (e.relevant === 1 || e.relevant === true) && (Number(e.score) || 0) >= minE
    ).length;
    return {
        count: essays.length,
        relevant_passed: relevantPassed,
        required: minPass,
        passed: relevantPassed >= minPass,
        min_score: minE
    };
}

function assessmentEngineMinPassCount() {
    try {
        const ae = require('./assessmentEngine');
        return ae.DRILL_COUNTS?.essayMinPass || 3;
    } catch (_) {
        return 3;
    }
}

module.exports = {
    ESSAY_WEIGHT,
    ESSAY_MIN_SCORE,
    CATEGORY_KEYWORDS,
    normalizeRank,
    essayWeight,
    essayMinScore,
    scoreEssay,
    essayPassStatus,
    compositeModuleScore,
    buildStudySnippet,
    buildLabSeed,
    sanitizeSnippet,
    extractActionLines,
    categoryKey
};
