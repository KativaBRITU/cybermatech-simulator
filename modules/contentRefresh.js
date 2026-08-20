/**
 * Quarterly content refresh — essay prompts, quiz banks, practice banks.
 * Heuristic/template core path; optional OpenAI enhancement when OPENAI_API_KEY is set.
 */

'use strict';

const assessmentEngine = require('./assessmentEngine');
const progressiveContent = require('./progressiveContent');

const REFRESH_CYCLE_DAYS = 90;
const REFRESH_CYCLE_MS = REFRESH_CYCLE_DAYS * 24 * 60 * 60 * 1000;

/** Quarterly trend packs — rotate by calendar quarter key. */
const TREND_VECTORS = {
    '2026-Q3': {
        ai_fraud: [
            'AI voice-clone CEO calls demanding urgent wire transfers before board meetings',
            'LLM-generated spear-phish with perfect local language and regional payment slang',
            'Deepfake video messages on WhatsApp/Telegram bypassing email filters'
        ],
        deepfakes: [
            'Synthetic voice matching executives from public AGM footage',
            'Face-swap video calls during vendor onboarding',
            'AI-dubbed voicemail left on finance shared lines'
        ],
        cloud: [
            'Over-privileged IAM roles chained via trust policies across accounts',
            'Public S3/GCS buckets opened for “temp auditor share” and never closed',
            'Leaked CI/CD long-lived keys with CreateInstance and AssumeRole abuse'
        ],
        ot: [
            'Flat IT/OT VLAN bridging ransomware into plant historians',
            'Remote vendor VPN straight into SCADA jump hosts without MFA',
            'Modbus/OPC traffic anomalies masked as maintenance windows'
        ],
        mobile_money: [
            'SIM-swap + USSD push approval for M-Pesa/MTN/EcoCash transfers',
            'Fake “bank reversal” SMS phishing with short-code lookalikes',
            'Agent fraud: compromised POS/agent credentials draining float'
        ],
        supply_chain: [
            'Typosquat npm/PyPI packages in CI pipelines',
            'Compromised SaaS OAuth app with broad mailbox scopes',
            'Vendor MFA fatigue on shared service accounts'
        ],
        africa: [
            'Load-shedding / power cuts used to justify skipping verification steps',
            'Regional mobile-money rails targeted during salary-payday windows',
            'Cross-border BEC using Namibian/SADC company registries for pretext'
        ],
        global: [
            'Passkey phishing via reverse-proxy kits',
            'SaaS session token theft from unmanaged browser extensions',
            'QR-code quishing at hybrid conference check-in desks'
        ]
    },
    '2026-Q4': {
        ai_fraud: [
            'Agentic AI browsing internal wikis to craft perfect pretext emails',
            'Real-time voice conversion on live Teams/Zoom sidebar chats',
            'Synthetic HR “policy update” portals harvesting MFA codes'
        ],
        deepfakes: [
            'Live deepfake CFO on earnings-call bridge approving exceptions',
            'AI lip-sync training clips reused for vishing at scale'
        ],
        cloud: [
            'Entra ID / IAM Identity Center privilege escalation via group nesting',
            'Serverless functions exfiltrating secrets from env vars at scale',
            'Misconfigured KMS keys allowing cross-tenant decrypt attempts'
        ],
        ot: [
            'Edge IoT gateways with default creds bridging to DCS panels',
            'Safety-system bypass tickets abused during “emergency maintenance”'
        ],
        mobile_money: [
            'USSD *147# / *140# spoof menus mimicking carrier short codes',
            'WhatsApp “proof of payment” screenshots with forged reference numbers'
        ],
        supply_chain: [
            'SolarWinds-style signed update channels with delayed C2',
            'GitHub Actions workflow injection via malicious PR labels'
        ],
        africa: [
            'Smishing waves during university registration and grant seasons',
            'Fuel-price / forex scam lures targeting treasury teams'
        ],
        global: [
            'OAuth device-code phishing against remote-first staff',
            'Cloudflare Workers used as credential-harvesting reverse proxies'
        ]
    }
};

function quarterKey(date = new Date()) {
    const y = date.getFullYear();
    const q = Math.floor(date.getMonth() / 3) + 1;
    return `${y}-Q${q}`;
}

function currentTrendPack(date = new Date()) {
    const key = quarterKey(date);
    if (TREND_VECTORS[key]) return { key, vectors: TREND_VECTORS[key] };
    const keys = Object.keys(TREND_VECTORS).sort();
    const fallback = keys[keys.length - 1];
    return { key: fallback, vectors: TREND_VECTORS[fallback] };
}

function shouldRefresh(lastRefreshedAt, now = Date.now()) {
    if (!lastRefreshedAt) return true;
    const t = new Date(lastRefreshedAt).getTime();
    if (Number.isNaN(t)) return true;
    return (now - t) >= REFRESH_CYCLE_MS;
}

function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

function pickTrend(vectors, category, seed) {
    const rng = mulberry32(seed);
    const pools = [
        ...(vectors.africa || []),
        ...(vectors[categoryToTrendKey(category)] || []),
        ...(vectors.global || [])
    ];
    if (!pools.length) return 'emerging attack patterns affecting your sector';
    return pools[Math.floor(rng() * pools.length)];
}

function categoryToTrendKey(category) {
    const c = String(category || '').toLowerCase();
    if (c.includes('social') || c.includes('phish')) return 'ai_fraud';
    if (c.includes('cloud')) return 'cloud';
    if (c.includes('forensic') || c.includes('incident')) return 'ot';
    if (c.includes('governance') || c.includes('financial')) return 'mobile_money';
    if (c.includes('malware') || c.includes('supply')) return 'supply_chain';
    if (c.includes('emerging')) return 'deepfakes';
    return 'global';
}

function extractSnippets(content, resourcesJson, limit = 6) {
    const snippets = [];
    const text = String(content || '');
    const headings = text.match(/^#{2,3}\s+(.+)$/gm) || [];
    for (const h of headings.slice(0, limit)) {
        snippets.push(h.replace(/^#+\s+/, '').trim());
    }
    try {
        const resources = typeof resourcesJson === 'string' ? JSON.parse(resourcesJson) : resourcesJson;
        if (Array.isArray(resources)) {
            for (const r of resources.slice(0, 3)) {
                if (r?.title) snippets.push(String(r.title));
            }
        }
    } catch (_) { /* ignore */ }
    return snippets.filter(Boolean);
}

function generateEssayPrompts(module, content, rank = 'beginner', trendPack = currentTrendPack()) {
    const name = module.name || 'this module';
    const cat = module.category || 'network';
    const seed = (module.id || 1) * 997 + trendPack.key.length;
    const trend = pickTrend(trendPack.vectors, cat, seed);
    const snippets = extractSnippets(content, null, 4);
    const focus = snippets[0] || name;
    const env = progressiveContent.getEnvironment(progressiveContent.normalizeRank(rank));

    const base = [
        {
            question: `[${trendPack.key}] A live ${name} incident is unfolding while ${trend}. You are ${env.label} for ${env.environment}. Write your first-hour containment plan: evidence to preserve, stakeholders to notify, and unsafe shortcuts your team must reject under pressure.`,
            guidelines: 'Operational runbook tone. Reference controls from the study guide where relevant. No generic awareness slogans.'
        },
        {
            question: `Board members ask how ${focus} relates to ${trend} in Namibia/SADC and globally. Draft a risk brief: likelihood, impact, compensating controls, and a 30/60/90-day remediation plan mapped to NIST CSF.`,
            guidelines: 'Use measurable outcomes, owners, and residual risk. Cite public frameworks (NIST, CISA, MITRE) where appropriate.'
        },
        {
            question: `Design a tabletop for ${name} with injects covering ${trend}. Include roles, decision gates, expected actions, and a scoring rubric focused on verification culture—not trivia.`,
            guidelines: 'Stress human factors: urgency, authority bias, incomplete telemetry.'
        },
        {
            question: `A colleague receives a convincing message tied to ${trend}. Coach them through the first 10 minutes: verification steps, escalation path, and psychological traps (fear, authority, scarcity) they should expect.`,
            guidelines: 'Practical coaching language. Mention Africa-relevant payment or comms channels when applicable.'
        }
    ];

    if (progressiveContent.rankAtLeast(rank, 'intermediate')) {
        base.push({
            question: `Purple-team perspective: map ${trend} to MITRE ATT&CK techniques relevant to ${name}. What detections would you expect in a mature SOC, and what gaps remain in a typical SME/SADC deployment?`,
            guidelines: 'Technique IDs welcome. Tie detections to log sources and owner teams.'
        });
    }

    if (progressiveContent.rankAtLeast(rank, 'advanced')) {
        base.push({
            question: `Special Ops scenario: ${trend} coincides with load-shedding and a payroll window. You have incomplete logs and a demanding CFO. Document dual-control decisions, legal/privacy parallel tracks, and what you will retest in 72 hours.`,
            guidelines: 'Assume imperfect evidence. Prefer honest residual-risk language over denial.'
        });
    }

    return base.slice(0, progressiveContent.rankAtLeast(rank, 'advanced') ? 6 : progressiveContent.rankAtLeast(rank, 'intermediate') ? 5 : 4);
}

function synthesizeTrendQuestion(module, trend, idx, difficulty, mode) {
    const name = module.name || 'Cybersecurity';
    const templates = [
        {
            question: `During a ${name} drill, analysts flag activity matching “${trend}.” What is the strongest first response?`,
            options: [
                'Verify through official channels; contain blast radius; preserve evidence before broad comms',
                'Ignore until a second analyst agrees after lunch',
                'Disable all user accounts tenant-wide without a playbook',
                'Publish indicators on social media before internal verification'
            ],
            correct: 0,
            explanation: 'Verification + containment + evidence beats panic or silent hope.',
            topic: 'trend_response',
            time_expected: difficulty === 'hard' ? 48 : 40
        },
        {
            question: `Leadership wants to skip dual control because of “${trend.slice(0, 60)}…” What is the professional pushback?`,
            options: [
                'Dual control and callback lists exist precisely for high-pressure fraud — no exceptions on payment rails',
                'Skip controls once per quarter to keep velocity',
                'Trust sensory realism (voice/video) over process',
                'Delegate approval to the most junior clerk to save time'
            ],
            correct: 0,
            explanation: 'Process beats sensory trust for BEC, deepfakes, and mobile-money fraud.',
            topic: 'dual_control',
            time_expected: 42
        },
        {
            question: `Your ${name} telemetry is incomplete during an event tied to ${trend.split('.')[0]}. Best investigative stance?`,
            options: [
                'Document gaps; collect what exists; avoid wiping systems; escalate with honest uncertainty',
                'Reimage everything before logging scope',
                'Assume no breach because EDR was quiet',
                'Turn off alerting to reduce queue noise'
            ],
            correct: 0,
            explanation: 'Incomplete telemetry is normal — honesty and preservation matter.',
            topic: 'investigation',
            time_expected: 44
        }
    ];
    const t = templates[idx % templates.length];
    const q = {
        id: idx + 1,
        question: t.question.replace(/\s+/g, ' ').trim(),
        options: [...t.options],
        correct: t.correct,
        explanation: t.explanation,
        points: difficulty === 'hard' ? 3 : difficulty === 'easy' ? 1 : 2,
        topic: t.topic,
        category: module.category,
        module_name: name,
        time_expected: t.time_expected,
        pressure: mode !== 'practice',
        rank_tier: difficulty,
        source: 'content_refresh'
    };
    return assessmentEngine.balanceOptionLengths(q);
}

function generateQuizQuestions(module, content, count = 12, difficulty = 'medium', trendPack = currentTrendPack()) {
    const cat = module.category || 'network';
    const seed = (module.id || 1) * 313 + trendPack.key.charCodeAt(0);
    const rng = mulberry32(seed);
    const engine = assessmentEngine.generateModuleQuestions(module, difficulty, count, { rank: 'intermediate' });
    const trendCount = Math.min(4, Math.max(2, Math.floor(count / 4)));
    const out = [...engine.questions];

    for (let i = 0; i < trendCount; i++) {
        const trend = pickTrend(trendPack.vectors, cat, seed + i * 17);
        out.push(assessmentEngine.shuffleQuestion(
            synthesizeTrendQuestion(module, trend, out.length, difficulty, 'quiz'),
            rng
        ));
    }

    return out.slice(0, Math.max(count, 10)).map((q, i) => ({ ...q, id: i + 1 }));
}

function generatePracticeQuestions(module, content, count = 14, trendPack = currentTrendPack()) {
    const quiz = generateQuizQuestions(module, content, count, module.difficulty || 'medium', trendPack);
    return quiz.map((q) => ({
        ...q,
        pressure: false,
        show_explanation: true,
        source: 'content_refresh_practice'
    }));
}

function selectFromBank(bank, limit = 10, difficulty = 'medium', sessionSeed = Date.now()) {
    if (!Array.isArray(bank) || bank.length < 4) return null;
    const rng = mulberry32(sessionSeed >>> 0);
    const shuffled = [...bank];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const count = Math.min(limit, shuffled.length);
    const selected = shuffled.slice(0, count).map((q, idx) =>
        assessmentEngine.shuffleQuestion({ ...q, id: idx + 1 }, rng)
    );
    const expectedSum = selected.reduce((s, q) => s + (q.time_expected || 40), 0);
    const profile = progressiveContent.drillProfileForRank('intermediate');
    const timeLimit = Math.max(180, Math.round(expectedSum * profile.timeFactor));
    return {
        questions: selected,
        totalQuestions: selected.length,
        timeLimit,
        difficulty,
        source: 'refresh_bank'
    };
}

async function optionalOpenAIEnhance(module, essayQuestions, trendPack) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return essayQuestions;
    try {
        const OpenAI = require('openai');
        const client = new OpenAI({ apiKey: key });
        const prompt = `Refresh 2 essay prompts for cybersecurity module "${module.name}" (${module.category}). 
Trend pack ${trendPack.key}. Include Africa/SADC realism. Return JSON array of {question, guidelines} only.`;
        const resp = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.4,
            max_tokens: 900
        });
        const raw = resp.choices?.[0]?.message?.content || '';
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) return essayQuestions;
        const extra = JSON.parse(match[0]);
        if (!Array.isArray(extra)) return essayQuestions;
        return [...essayQuestions, ...extra.filter((e) => e && e.question).slice(0, 2)];
    } catch (e) {
        console.warn('OpenAI content refresh skipped:', e.message);
        return essayQuestions;
    }
}

async function refreshModuleContent(db, module, options = {}) {
    const moduleId = module.id;
    const force = !!options.force;
    const rank = options.rank || 'intermediate';

    const row = await db.getAsync(
        `SELECT id, content, resources, content_refreshed_at, refresh_generation
         FROM module_contents WHERE module_id = ?`,
        [moduleId]
    );

    if (!force && row && !shouldRefresh(row.content_refreshed_at)) {
        return { refreshed: false, module_id: moduleId, reason: 'not_due' };
    }

    const content = row?.content || '';
    const resources = row?.resources || '[]';
    const trendPack = currentTrendPack();
    const generation = (Number(row?.refresh_generation) || 0) + 1;

    let essayQuestions = generateEssayPrompts(module, content, rank, trendPack);
    if (process.env.OPENAI_API_KEY) {
        essayQuestions = await optionalOpenAIEnhance(module, essayQuestions, trendPack);
    }

    const quizBank = generateQuizQuestions(module, content, 16, module.difficulty || 'medium', trendPack);
    const practiceBank = generatePracticeQuestions(module, content, 16, trendPack);
    const nowIso = new Date().toISOString();

    if (row) {
        await db.runAsync(
            `UPDATE module_contents
             SET essay_questions = ?, quiz_bank = ?, practice_bank = ?,
                 content_refreshed_at = ?, refresh_generation = ?, updated_at = CURRENT_TIMESTAMP
             WHERE module_id = ?`,
            [
                JSON.stringify(essayQuestions),
                JSON.stringify(quizBank),
                JSON.stringify(practiceBank),
                nowIso,
                generation,
                moduleId
            ]
        );
    } else {
        await db.runAsync(
            `INSERT INTO module_contents
             (module_id, content, resources, essay_questions, quiz_bank, practice_bank,
              content_refreshed_at, refresh_generation, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [
                moduleId,
                content,
                resources,
                JSON.stringify(essayQuestions),
                JSON.stringify(quizBank),
                JSON.stringify(practiceBank),
                nowIso,
                generation
            ]
        );
    }

    return {
        refreshed: true,
        module_id: moduleId,
        generation,
        trend_pack: trendPack.key,
        essay_count: essayQuestions.length,
        quiz_count: quizBank.length,
        practice_count: practiceBank.length,
        refreshed_at: nowIso
    };
}

async function refreshModuleContentIfDue(db, module, options = {}) {
    const row = await db.getAsync(
        'SELECT content_refreshed_at FROM module_contents WHERE module_id = ?',
        [module.id]
    );
    if (!options.force && row && !shouldRefresh(row.content_refreshed_at)) {
        return { refreshed: false, module_id: module.id, reason: 'not_due' };
    }
    return refreshModuleContent(db, module, options);
}

async function refreshAllModulesIfDue(db, modules, options = {}) {
    const results = [];
    for (const mod of modules) {
        try {
            results.push(await refreshModuleContentIfDue(db, mod, options));
        } catch (e) {
            results.push({ refreshed: false, module_id: mod.id, error: e.message });
        }
    }
    const refreshed = results.filter((r) => r.refreshed).length;
    return { refreshed, total: modules.length, results };
}

async function getContentFreshness(db, modules) {
    const rows = await db.allAsync(
        `SELECT module_id, content_refreshed_at, refresh_generation
         FROM module_contents ORDER BY module_id ASC`
    );
    const byId = new Map((rows || []).map((r) => [r.module_id, r]));
    const now = Date.now();
    return modules.map((m) => {
        const row = byId.get(m.id);
        const due = shouldRefresh(row?.content_refreshed_at, now);
        return {
            module_id: m.id,
            module_name: m.name,
            content_refreshed_at: row?.content_refreshed_at || null,
            refresh_generation: row?.refresh_generation || 0,
            due,
            days_until_due: row?.content_refreshed_at
                ? Math.max(0, REFRESH_CYCLE_DAYS - Math.floor((now - new Date(row.content_refreshed_at).getTime()) / 86400000))
                : 0
        };
    });
}

module.exports = {
    REFRESH_CYCLE_DAYS,
    REFRESH_CYCLE_MS,
    TREND_VECTORS,
    quarterKey,
    currentTrendPack,
    shouldRefresh,
    generateEssayPrompts,
    generateQuizQuestions,
    generatePracticeQuestions,
    selectFromBank,
    refreshModuleContent,
    refreshModuleContentIfDue,
    refreshAllModulesIfDue,
    getContentFreshness
};
