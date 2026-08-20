/**
 * Loads no-code content from /content/*.json
 * Edit those files + public/media — no server code changes needed.
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

function readJson(file, fallback) {
    const full = path.join(CONTENT_DIR, file);
    try {
        const raw = fs.readFileSync(full, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.warn(`[content] Could not read ${file}:`, err.message);
        return fallback;
    }
}

function loadSiteMedia() {
    return readJson('site-media.json', { version: 1, pages: {}, brand: {}, global: {} });
}

function loadModulesCatalog() {
    const data = readJson('modules.json', { modules: [], pass_score: 70, certificate_score: 80 });
    const modules = Array.isArray(data.modules) ? data.modules : [];
    return {
        pass_score: Number(data.pass_score) || 70,
        certificate_score: Number(data.certificate_score) || 80,
        modules: modules.map((m, idx) => ({
            id: String(m.id || `module-${idx + 1}`),
            order: Number(m.order) || idx + 1,
            title: m.title || m.id,
            icon: m.icon || '',
            description: m.description || '',
            difficulty: m.difficulty || 'beginner',
            category: m.category || 'general',
            member_only: m.member_only !== false,
            video: m.video || '',
            video_poster: m.video_poster || '',
            background_image: m.background_image || '',
            questions: Array.isArray(m.questions) ? m.questions : []
        })).sort((a, b) => a.order - b.order)
    };
}

function listModulesPublic() {
    const { modules, pass_score, certificate_score } = loadModulesCatalog();
    return {
        pass_score,
        certificate_score,
        modules: modules.map((m) => ({
            id: m.id,
            order: m.order,
            title: m.title,
            icon: m.icon,
            description: m.description,
            difficulty: m.difficulty,
            category: m.category,
            has_video: Boolean(m.video),
            question_count: m.questions.length
        }))
    };
}

function getModule(id) {
    const { modules, pass_score, certificate_score } = loadModulesCatalog();
    const mod = modules.find((m) => m.id === String(id));
    if (!mod) return null;
    return { ...mod, pass_score, certificate_score };
}

/** Quiz payload for the browser — never includes correct answers */
function getQuizForClient(id) {
    const mod = getModule(id);
    if (!mod) return null;
    return {
        id: mod.id,
        title: mod.title,
        icon: mod.icon,
        description: mod.description,
        video: mod.video || '',
        video_poster: mod.video_poster || '',
        background_image: mod.background_image || '',
        pass_score: mod.pass_score,
        certificate_score: mod.certificate_score,
        questions: mod.questions.map((q, idx) => ({
            id: idx + 1,
            question: q.question,
            options: q.options
        }))
    };
}

function scoreQuiz(id, answers) {
    const mod = getModule(id);
    if (!mod) return null;
    const list = Array.isArray(answers) ? answers : [];
    let correct = 0;
    const review = mod.questions.map((q, idx) => {
        const selected = list[idx];
        const ok = selected === q.correct;
        if (ok) correct += 1;
        return {
            id: idx + 1,
            selected: typeof selected === 'number' ? selected : null,
            correct: q.correct,
            is_correct: ok,
            explanation: q.explanation || ''
        };
    });
    const total = mod.questions.length || 1;
    const score = Math.round((correct / total) * 100);
    return {
        module_id: mod.id,
        module_title: mod.title,
        correct,
        total,
        score,
        passed: score >= mod.pass_score,
        certificate_eligible: score >= mod.certificate_score,
        review
    };
}

function publicMediaConfig() {
    const media = loadSiteMedia();
    return {
        brand: media.brand || {},
        global: media.global || {},
        pages: {
            home: media.pages?.home || {},
            login: media.pages?.login || {},
            register: media.pages?.register || {}
        }
    };
}

function memberMediaConfig() {
    const media = loadSiteMedia();
    return {
        brand: media.brand || {},
        global: media.global || {},
        pages: media.pages || {}
    };
}

module.exports = {
    loadSiteMedia,
    loadModulesCatalog,
    listModulesPublic,
    getModule,
    getQuizForClient,
    scoreQuiz,
    publicMediaConfig,
    memberMediaConfig
};
