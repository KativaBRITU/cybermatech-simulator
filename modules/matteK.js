/**
 * Matte K — TRIBAMS cyber-ops AI guide
 * Project-wide Q&A with typo repair + scored intent matching.
 * Helpful outside exams. Hard-locked during scored drills / assessments.
 */

const knowledge = require('./matteKKnowledge');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const EXAM_LOCK_REPLY =
    'Exam lockdown active. I am Matte K, and I am disabled while a scored drill or skill assessment is in progress. Finish or submit the test first — your readiness has to be your own.';

const CHEAT_REFUSE_REPLY =
    'I will not provide quiz answers, option picks, or exam shortcuts. Matte K coaches learning paths and platform help only. Open Learn / Practice for study feedback — scored drills stay human-only.';

const CHEAT_PATTERNS = [
    /\b(what('?s| is) the (correct )?answer)\b/i,
    /\b(which option|pick the answer|tell me the answer|give me the answer)\b/i,
    /\b(answer key|solve this (quiz|question|mcq)|cheat)\b/i,
    /\b(for (the )?(quiz|exam|test|assessment|drill))\b.*\b(answer|correct|option)\b/i,
    /\b(option\s*[a-d1-4])\b.*\b(correct|right)\b/i,
    /\bcorrect (choice|option)\b/i,
    /\b(a\/b\/c\/d|mcq key)\b/i
];

const STOP_WORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'to', 'of', 'in',
    'on', 'for', 'and', 'or', 'but', 'if', 'at', 'by', 'with', 'from', 'as', 'it', 'this',
    'that', 'i', 'me', 'my', 'we', 'your', 'do', 'does', 'did', 'can', 'could',
    'would', 'should', 'please', 'tell', 'about', 'what', 'how', 'why', 'when',
    'where', 'which', 'who'
]);

const SHORT_TYPOS = {
    yu: 'you',
    u: 'you',
    ur: 'your',
    r: 'are',
    n: 'and',
    wat: 'what',
    wut: 'what',
    howto: 'how',
    plz: 'please',
    thx: 'thanks',
    thru: 'through',
    info: 'information'
};

let dictionaryCache = null;

function isExamSessionActive(session) {
    if (!session) return false;

    // Live module drill
    if (session.moduleQuiz && session.moduleQuiz.token) {
        const started = Number(session.moduleQuiz.startedAt) || 0;
        const limitSec = Number(session.moduleQuiz.timeLimit) || 600;
        // Keep locked through the drill + 20 min grace (abandon still blocks AI)
        if (!started || Date.now() - started < (limitSec + 20 * 60) * 1000) {
            return true;
        }
        // Stale drill — release lock so Matte K works again
        try { delete session.moduleQuiz; } catch (_) { session.moduleQuiz = null; }
    }

    // Skill assessment in progress
    if (session.skillAssessment && session.skillAssessment.questions) {
        const started = Number(session.skillAssessment.startedAt) || 0;
        if (!started || Date.now() - started < 90 * 60 * 1000) {
            return true;
        }
        try { delete session.skillAssessment; } catch (_) { session.skillAssessment = null; }
    }

    // Daily / module scenario attempt
    if (session.scenarioActive && session.scenarioActive.startedAt) {
        const started = Number(session.scenarioActive.startedAt) || 0;
        if (!started || Date.now() - started < 45 * 60 * 1000) {
            return true;
        }
        try { delete session.scenarioActive; } catch (_) { session.scenarioActive = null; }
    }

    // Explicit lockdown flag (set by exam surfaces)
    if (session.matteExamLock && session.matteExamLock.until > Date.now()) {
        return true;
    }

    return false;
}

function looksLikeCheatRequest(text) {
    const t = String(text || '');
    return CHEAT_PATTERNS.some((re) => re.test(t));
}

/** Damerau–Levenshtein: insert / delete / substitute / adjacent transpose. */
function levenshtein(a, b) {
    const s = String(a || '').toLowerCase();
    const t = String(b || '').toLowerCase();
    if (s === t) return 0;
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    if (Math.abs(s.length - t.length) > 4) return Math.max(s.length, t.length);

    const d = Array.from({ length: s.length + 1 }, () => new Array(t.length + 1).fill(0));
    for (let i = 0; i <= s.length; i++) d[i][0] = i;
    for (let j = 0; j <= t.length; j++) d[0][j] = j;
    for (let i = 1; i <= s.length; i++) {
        for (let j = 1; j <= t.length; j++) {
            const cost = s[i - 1] === t[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }
    return d[s.length][t.length];
}

function similarity(a, b) {
    const s = String(a || '').toLowerCase();
    const t = String(b || '').toLowerCase();
    if (!s && !t) return 1;
    const dist = levenshtein(s, t);
    return 1 - dist / Math.max(s.length, t.length, 1);
}

function tokenize(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9+#./\s-]/g, ' ')
        .split(/[\s/_-]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2);
}

function buildDictionary() {
    if (dictionaryCache) return dictionaryCache;
    const words = new Set(knowledge.EXTRA_DICTIONARY);
    for (const topic of knowledge.buildTopics()) {
        topic.keywords.forEach((k) => tokenize(k).forEach((w) => words.add(w)));
        (topic.phrases || []).forEach((p) => tokenize(p).forEach((w) => words.add(w)));
    }
    for (const mod of knowledge.getCatalog()) {
        tokenize(mod.name).forEach((w) => words.add(w));
        tokenize(mod.category).forEach((w) => words.add(w));
        if (mod.icon_key) words.add(String(mod.icon_key).toLowerCase());
    }
    [
        'hello', 'help', 'start', 'free', 'pro', 'plus', 'cost', 'price', 'email',
        'password', 'quiz', 'exam', 'certificate', 'dashboard', 'training', 'africa',
        'security', 'cyber', 'cloud', 'network', 'mobile', 'incident', 'response',
        'explain', 'unlock', 'level', 'rank', 'many', 'next', 'you', 'your'
    ].forEach((w) => words.add(w));
    const list = [...words].filter((w) => w.length >= 2);
    const byLen = new Map();
    for (const w of list) {
        if (!byLen.has(w.length)) byLen.set(w.length, []);
        byLen.get(w.length).push(w);
    }
    dictionaryCache = { set: new Set(list), byLen };
    return dictionaryCache;
}

function maxEditFor(word) {
    if (word.length <= 3) return 1;
    if (word.length <= 6) return 1;
    if (word.length <= 10) return 2;
    return 3;
}

function correctToken(token, dict) {
    if (!token) return { word: token, corrected: false, distance: 0 };
    if (/^\d+$/.test(token)) return { word: token, corrected: false, distance: 0 };
    if (SHORT_TYPOS[token]) {
        return { word: SHORT_TYPOS[token], corrected: true, distance: 1, from: token };
    }
    if (token.length < 3) return { word: token, corrected: false, distance: 0 };
    if (dict.set.has(token) || STOP_WORDS.has(token)) {
        return { word: token, corrected: false, distance: 0 };
    }

    let best = token;
    let bestDist = Infinity;
    const max = maxEditFor(token);
    for (let len = token.length - max; len <= token.length + max; len++) {
        const bucket = dict.byLen.get(len);
        if (!bucket) continue;
        for (const candidate of bucket) {
            if (candidate[0] !== token[0] && candidate[0] !== token[1] && token[0] !== candidate[1]) {
                continue;
            }
            const d = levenshtein(token, candidate);
            if (d < bestDist) {
                bestDist = d;
                best = candidate;
                if (d === 1) break;
            }
        }
        if (bestDist === 1) break;
    }
    if (bestDist > 0 && bestDist <= max && best !== token) {
        return { word: best, corrected: true, distance: bestDist, from: token };
    }
    return { word: token, corrected: false, distance: 0 };
}

function normalizeQuery(message) {
    const raw = String(message || '').trim();
    const dict = buildDictionary();
    const tokens = tokenize(raw);
    const typos = [];
    const correctedTokens = tokens.map((tok) => {
        const result = correctToken(tok, dict);
        if (result.corrected) {
            typos.push({ from: result.from, to: result.word, distance: result.distance });
        }
        return result.word;
    });
    let corrected = raw;
    for (const typo of typos) {
        const re = new RegExp(`\\b${escapeRegExp(typo.from)}\\b`, 'ig');
        corrected = corrected.replace(re, typo.to);
    }
    return { raw, corrected, tokens: correctedTokens, typos };
}

function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function typoPreface(typos, corrected) {
    if (!typos.length) return '';
    const bits = typos.slice(0, 4).map((t) => `“${t.from}” → “${t.to}”`).join(', ');
    return `Typo check: I read that as “${corrected}” (${bits}).\n\n`;
}

/**
 * Intent score:
 *  phrase hit * 4.5
 *  exact keyword token * 3
 *  fuzzy keyword (sim >= 0.78) * 2
 *  then length-normalize with sqrt(#signals)
 */
function scoreTopic(topic, tokens, correctedText) {
    const text = String(correctedText || '').toLowerCase();
    const tokenSet = new Set(tokens);
    let raw = 0;
    let hits = 0;

    for (const phrase of topic.phrases || []) {
        if (text.includes(phrase)) {
            raw += 4.5;
            hits += 1;
        }
    }

    for (const key of topic.keywords) {
        const keyTokens = tokenize(key);
        if (!keyTokens.length) continue;
        let keyHit = 0;
        for (const kt of keyTokens) {
            if (tokenSet.has(kt)) {
                keyHit = Math.max(keyHit, 3);
                continue;
            }
            let bestSim = 0;
            for (const tok of tokens) {
                if (STOP_WORDS.has(tok) || tok.length < 3) continue;
                bestSim = Math.max(bestSim, similarity(tok, kt));
            }
            if (bestSim >= 0.86) keyHit = Math.max(keyHit, 2.4);
            else if (bestSim >= 0.78) keyHit = Math.max(keyHit, 1.6);
        }
        if (keyHit) {
            raw += keyHit;
            hits += 1;
        }
    }

    if (topic.id === 'gate' && (tokenSet.has('unlock') || tokenSet.has('level') || tokenSet.has('rank'))) {
        if (tokenSet.has('module') || tokenSet.has('modules') || tokenSet.has('many') || tokenSet.has('more')) {
            raw += 3.5;
            hits += 1;
        }
    }
    if (topic.id === 'ranks' && (tokenSet.has('rank') || tokenSet.has('ranks') || tokenSet.has('level'))) {
        if (tokenSet.has('unlock') || tokenSet.has('up') || tokenSet.has('analyst') || tokenSet.has('recruit')) {
            raw += 3;
            hits += 1;
        }
    }
    if (topic.id === 'identity' && /who are you|who r you|who are yu/.test(text)) {
        raw += 5;
        hits += 1;
    }

    if (!hits) return 0;
    return raw / Math.sqrt(Math.max(2, (topic.keywords.length + (topic.phrases || []).length) / 4));
}

function rankTopics(tokens, correctedText) {
    return knowledge
        .buildTopics()
        .map((topic) => ({ topic, score: scoreTopic(topic, tokens, correctedText) }))
        .sort((a, b) => b.score - a.score);
}

function findModule(correctedText, tokens) {
    const text = String(correctedText || '').toLowerCase();
    const idMatch = text.match(/\b(?:module\s*)?#\s*(\d{1,3})\b/) || text.match(/\bmodule\s+(\d{1,3})\b/);
    const catalog = knowledge.getCatalog();
    const byId = idMatch ? catalog.find((m) => m.id === parseInt(idMatch[1], 10)) : null;

    let best = null;
    for (const mod of catalog) {
        const name = mod.name.toLowerCase();
        const icon = String(mod.icon_key || '').toLowerCase();
        let score = 0;
        if (icon && tokens.includes(icon)) score = 0.96;
        if (text.includes(name)) score = Math.max(score, 0.97);
        else {
            const nameTokens = tokenize(mod.name).filter((t) => !STOP_WORDS.has(t) && t.length > 2);
            if (nameTokens.length) {
                let overlap = 0;
                for (const nt of nameTokens) {
                    if (tokens.includes(nt)) overlap += 1;
                    else if (tokens.some((t) => similarity(t, nt) >= 0.84)) overlap += 0.7;
                }
                score = Math.max(score, overlap / nameTokens.length);
            }
        }
        if (!best || score > best.score) best = { module: mod, score, via: icon && tokens.includes(icon) ? 'icon' : 'fuzzy' };
    }

    if (byId && best && best.module.id !== byId.id && best.score >= 0.72) {
        return { module: best.module, score: best.score, via: 'name_over_id', also: byId };
    }
    if (byId) return { module: byId, score: 0.99, via: 'id', also: best && best.score >= 0.72 && best.module.id !== byId.id ? best.module : null };
    if (best && best.score >= 0.55) return best;
    return null;
}

function explainModule(mod, also) {
    const p = knowledge.livePricing();
    const free = p.freeIds.includes(mod.id);
    const toolkit = mod.id >= 46;
    const hard = mod.difficulty === 'hard' || mod.difficulty === 'expert';
    const main = [
        `Module #${mod.id}: ${mod.name}.`,
        `Category: ${mod.category}. Difficulty: ${mod.difficulty}.`,
        free ? 'Access: included on Free.' : toolkit ? 'Access: attacker-toolkit track (Pro/Pro+ or org license depending on plan).' : 'Access: Pro catalog (or active org license).',
        hard ? 'Hard module: locked until you clear the 65% readiness gate.' : 'Available as soon as your plan allows.',
        `Open /training/${mod.id} — Learn (rank layers) → Practice → Live drill.`,
        'I can coach concepts, not scored quiz answers.'
    ].join(' ');
    if (also && also.id !== mod.id) {
        return `${main} Note: you also referenced module #${also.id} (${also.name}).`;
    }
    return main;
}

function userContextLine(user) {
    if (!user) return '';
    const name = user.username || user.email || 'learner';
    const tier = user.subscription_tier || 'free';
    return `Signed-in context: ${name} · plan ${tier}. `;
}

function composeLocal({ message, user }) {
    const norm = normalizeQuery(message);
    if (!norm.raw) {
        return {
            reply: 'Signal received empty. Ask about any module, pricing, ranks, orgs, certificates, labs, or how a page works — typos are fine.',
            mode: 'local',
            typos: [],
            confidence: 0,
            intent: null
        };
    }

    if (looksLikeCheatRequest(norm.raw) || looksLikeCheatRequest(norm.corrected)) {
        return {
            reply: CHEAT_REFUSE_REPLY,
            mode: 'integrity',
            refused: true,
            typos: norm.typos,
            confidence: 1,
            intent: 'integrity'
        };
    }

    const ranked = rankTopics(norm.tokens, norm.corrected);
    const moduleHit = findModule(norm.corrected, norm.tokens);
    const top = ranked[0];
    const second = ranked[1];

    let intent = null;
    let confidence = 0;
    let body = '';

    const wantsModule = /\b(module|course|train|open|start)\b/i.test(norm.corrected) || /#\d+/.test(norm.corrected);

    if (moduleHit && (moduleHit.score >= 0.72 || (wantsModule && moduleHit.score >= 0.55))) {
        intent = `module:${moduleHit.module.id}`;
        confidence = moduleHit.score;
        body = explainModule(moduleHit.module, moduleHit.also);
        if (top && top.score >= 1.8 && !['catalog', 'training'].includes(top.topic.id)) {
            body += `\n\nAlso relevant — ${top.topic.title}: ${top.topic.answer()}`;
        }
    } else if (top && top.score >= 1.55) {
        intent = top.topic.id;
        confidence = Math.min(0.99, top.score / 6);
        body = top.topic.answer();
        if (second && second.score >= 1.7 && second.score >= top.score * 0.72 && second.topic.id !== top.topic.id) {
            body += `\n\nRelated (${second.topic.title}): ${second.topic.answer()}`;
        }
        if (moduleHit && moduleHit.score >= 0.55) {
            body += `\n\nClosest module match: ${explainModule(moduleHit.module)}`;
        }
    } else {
        const suggestions = ranked
            .filter((r) => r.score > 0.8)
            .slice(0, 4)
            .map((r) => r.topic.title);
        intent = top ? top.topic.id : 'fallback';
        confidence = top ? Math.min(0.45, top.score / 8) : 0.15;
        body = top && top.score >= 0.9
            ? `${top.topic.answer()}\n\nIf that missed, try a module number (e.g. “module 11”) or: pricing, ranks, certificates, organization, labs.`
            : `I mapped your question across the whole TRIBAMS project but need a cleaner target. Try: pricing, ranks / Field Analyst, certificates, organization licenses, dark-web sim, or a module name/number.${suggestions.length ? ` Closest topics: ${suggestions.join('; ')}.` : ''}`;
    }

    const preface = typoPreface(norm.typos, norm.corrected);
    const ctx = userContextLine(user);
    return {
        reply: `${preface}${ctx}${body}`,
        mode: 'local',
        typos: norm.typos,
        confidence,
        intent,
        corrected: norm.corrected
    };
}

async function openaiReply(message, history = [], extras = {}) {
    if (!OPENAI_API_KEY) return null;
    try {
        const OpenAI = require('openai');
        const client = new OpenAI({ apiKey: OPENAI_API_KEY });
        const brief = knowledge.platformBrief();
        const localHint = extras.localHint ? `\nLocal engine top intent: ${extras.localHint}` : '';
        const typoNote = extras.corrected && extras.corrected !== message
            ? `\nUser typo-corrected message: ${extras.corrected}`
            : '';
        const messages = [
            {
                role: 'system',
                content:
                    `You are Matte K, TRIBAMS futuristic cyber-ops AI. Answer ANY project question with clear logic and exact platform facts. ${brief}` +
                    `${localHint}${typoNote}\nIf the user has typos, briefly acknowledge the intended meaning then answer. Be concise but complete. Coach cybersecurity concepts with reasoning (why a control works), never trivia dumps.` +
                    ' NEVER provide quiz/exam answers, option letters, or solve assessment items. If asked for exam answers, refuse firmly.'
            },
            ...history.slice(-8).map((h) => ({
                role: h.role === 'assistant' ? 'assistant' : 'user',
                content: String(h.content || '').slice(0, 1200)
            })),
            { role: 'user', content: String(message).slice(0, 1600) }
        ];
        const completion = await client.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages,
            max_tokens: 520,
            temperature: 0.25
        });
        const reply = completion.choices?.[0]?.message?.content?.trim();
        if (!reply) return null;
        return { reply, mode: 'openai' };
    } catch (err) {
        console.warn('Matte K OpenAI fallback:', err.message);
        return null;
    }
}

async function respond({ message, history, session, user }) {
    if (isExamSessionActive(session)) {
        return {
            success: true,
            locked: true,
            name: 'Matte K',
            reply: EXAM_LOCK_REPLY,
            mode: 'exam_lock'
        };
    }

    if (looksLikeCheatRequest(message)) {
        return {
            success: true,
            refused: true,
            name: 'Matte K',
            reply: CHEAT_REFUSE_REPLY,
            mode: 'integrity'
        };
    }

    const local = composeLocal({ message, user: user || session?.user });

    if (local.refused) {
        return { success: true, name: 'Matte K', ...local };
    }

    // High-confidence local facts win (deterministic pricing/ranks/modules).
    if (local.confidence >= 0.42 && local.intent && local.intent !== 'fallback') {
        return { success: true, name: 'Matte K', ...local };
    }

    const ai = await openaiReply(message, history, {
        corrected: local.corrected,
        localHint: local.intent ? `${local.intent} (confidence ${local.confidence.toFixed(2)})` : 'none'
    });
    if (ai) {
        const preface = typoPreface(local.typos || [], local.corrected || message);
        return {
            success: true,
            name: 'Matte K',
            reply: preface + ai.reply,
            mode: 'openai',
            typos: local.typos,
            intent: local.intent,
            confidence: Math.max(local.confidence, 0.55)
        };
    }

    return { success: true, name: 'Matte K', ...local };
}

module.exports = {
    respond,
    isExamSessionActive,
    looksLikeCheatRequest,
    levenshtein,
    normalizeQuery,
    composeLocal,
    EXAM_LOCK_REPLY
};
