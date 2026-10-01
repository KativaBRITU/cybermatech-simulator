/**
 * Quiz / practice / essay input validation — no answer keys on the client.
 */

'use strict';

const SCRIPT_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const TAG_RE = /<[^>]+>/g;

function stripHtml(text) {
    return String(text || '')
        .replace(SCRIPT_RE, '')
        .replace(TAG_RE, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
}

function sanitizeEssayText(text, maxLen = 12000) {
    let s = stripHtml(text);
    if (s.length > maxLen) s = s.slice(0, maxLen);
    return s;
}

function sanitizeAnswers(raw, questionCount, optionsLengths = []) {
    if (!Array.isArray(raw)) return { ok: false, reason: 'answers_must_be_array', answers: [] };
    if (raw.length !== questionCount) {
        return { ok: false, reason: 'answer_count_mismatch', answers: [] };
    }
    const answers = [];
    for (let i = 0; i < questionCount; i++) {
        const n = Number(raw[i]);
        if (!Number.isInteger(n) || n < 0) {
            return { ok: false, reason: 'invalid_answer_index', answers: [] };
        }
        const max = Number.isInteger(optionsLengths[i]) ? optionsLengths[i] - 1 : 3;
        if (n > max) {
            return { ok: false, reason: 'answer_out_of_range', answers: [] };
        }
        answers.push(n);
    }
    return { ok: true, answers };
}

function stripQuestionForClient(q, idx = 0) {
    return {
        id: q.id || idx + 1,
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        topic: q.topic || null,
        time_expected: q.time_expected || 40
    };
}

function stripQuestionsForClient(questions = []) {
    return questions.map((q, i) => stripQuestionForClient(q, i));
}

module.exports = {
    stripHtml,
    sanitizeEssayText,
    sanitizeAnswers,
    stripQuestionForClient,
    stripQuestionsForClient
};
