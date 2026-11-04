#!/usr/bin/env node
/**
 * Audit questions across Tier A/B/C for the TRIBAMS rewrite.
 * READ-ONLY. Does not modify any files or data.
 *
 * IMPORTANT — this is a heuristic, not a proof. See docs/methodology/audit-caveat.md.
 */

const fs = require('fs');
const path = require('path');

const TIERS = [
    { name: 'A', file: '../modules/tierADepth.js', qs: 'TIER_A_QUESTIONS', es: 'TIER_A_ESSAYS' },
    { name: 'B', file: '../modules/tierBDepth.js', qs: 'TIER_B_QUESTIONS', es: 'TIER_B_ESSAYS' },
    { name: 'C', file: '../modules/tierCDepth.js', qs: 'TIER_C_QUESTIONS', es: 'TIER_C_ESSAYS' },
];

const JOKE_MARKERS = [
    'disable all', 'fire all', 'celebrate', 'post on twitter', 'coffee',
    'wallpaper', 'comic sans', 'dox', 'sticky note', 'lol',
    'only paint', 'ignore forever', 'never matter', 'glitch',
    'just reboot', 'delete logs', 'auto-patch', 'they look prettier',
    'ignore', 'only trust'
];

const MIN_QUESTIONS = 12;
const MIN_ANALYZE_LEVEL = 2;

function isJoke(text) {
    if (!text || typeof text !== 'string') return false;
    const lower = text.toLowerCase();
    return JOKE_MARKERS.some(m => lower.includes(m));
}

function isTruncated(text) {
    if (!text || typeof text !== 'string') return true;
    if (text.trim().length < 8) return true;
    if (text.trim().endsWith('...')) return true;
    return false;
}

function toneMatchFlag(q) {
    if (!Array.isArray(q.options) || q.options.length < 2) return false;
    const correctLen = (q.options[q.correct] || '').length;
    const distractorLens = q.options
        .filter((_, i) => i !== q.correct)
        .map(o => (o || '').length);
    if (distractorLens.length === 0) return false;
    const avgDistractor = distractorLens.reduce((a, b) => a + b, 0) / distractorLens.length;
    return correctLen > avgDistractor * 1.5;
}

function auditQuestion(q, moduleId, tier) {
    const issues = [];
    if (isTruncated(q.question)) issues.push('truncated_question');
    if (!Array.isArray(q.options) || q.options.length < 4) {
        issues.push('fewer_than_4_options');
    } else {
        for (let i = 0; i < q.options.length; i++) {
            if (isTruncated(q.options[i])) issues.push('truncated_option_' + i);
            if (isJoke(q.options[i])) issues.push('joke_option_' + i);
        }
    }
    if (toneMatchFlag(q)) issues.push('tone_match_flag');
    if (q.distractor_rationale === null || q.distractor_rationale === undefined) {
        issues.push('missing_distractor_rationale');
    }
    if (q.cognitive_level === null || q.cognitive_level === undefined) {
        issues.push('missing_cognitive_level');
    }
    if (q.last_validated === null || q.last_validated === undefined) {
        issues.push('missing_last_validated');
    }
    if (q.coverage_tag === null || q.coverage_tag === undefined) {
        issues.push('missing_coverage_tag');
    }
    return { tier, moduleId, topic: q.topic || null, issues };
}

function auditEssay(e, moduleId, tier) {
    const issues = [];
    if (isTruncated(e.question)) issues.push('truncated_essay_question');
    if (!e.rubric) issues.push('missing_rubric');
    else if (!Array.isArray(e.rubric) || e.rubric.length < 3) issues.push('rubric_too_short');
    return { tier, moduleId, issues };
}

function loadModule(filePath, exportName) {
    const fullPath = path.resolve(__dirname, filePath);
    const mod = require(fullPath);
    return mod[exportName];
}

function main() {
    const report = {
        generatedAt: new Date().toISOString(),
        minimums: { minQuestions: MIN_QUESTIONS, minAnalyzeLevel: MIN_ANALYZE_LEVEL },
        tiers: {},
        summary: {
            totalQuestions: 0,
            totalEssays: 0,
            questionsWithIssues: 0,
            essaysWithIssues: 0,
            modulesUnderMinimum: [],
            modulesWithoutAnalyzeLevel: [],
            modulesWithoutRubricEssays: [],
        },
    };

    for (const tier of TIERS) {
        const questions = loadModule(tier.file, tier.qs) || {};
        const essays = loadModule(tier.file, tier.es) || {};

        const tierReport = {
            tierName: tier.name,
            moduleCount: Object.keys(questions).length,
            questionCount: 0,
            essayCount: 0,
            modules: {},
        };

        for (const moduleId of Object.keys(questions)) {
            const qs = questions[moduleId] || [];
            const es = essays[moduleId] || [];

            const qAudits = qs.map(q => auditQuestion(q, moduleId, tier.name));
            const eAudits = es.map(e => auditEssay(e, moduleId, tier.name));

            const analyzeCount = qs.filter(q => (q.cognitive_level || 0) >= MIN_ANALYZE_LEVEL).length;

            const moduleReport = {
                questionCount: qs.length,
                essayCount: es.length,
                questionIssues: qAudits,
                essayIssues: eAudits,
                analyzeLevelCount: analyzeCount,
                hasEnoughAnalyzeLevel: analyzeCount >= 2,
                hasRubricEssay: es.some(e => e.rubric && Array.isArray(e.rubric) && e.rubric.length >= 3),
            };

            tierReport.modules[moduleId] = moduleReport;
            tierReport.questionCount += qs.length;
            tierReport.essayCount += es.length;

            report.summary.totalQuestions += qs.length;
            report.summary.totalEssays += es.length;
            report.summary.questionsWithIssues += qAudits.filter(a => a.issues.length > 0).length;
            report.summary.essaysWithIssues += eAudits.filter(a => a.issues.length > 0).length;

            if (qs.length < MIN_QUESTIONS) {
                report.summary.modulesUnderMinimum.push({
                    tier: tier.name,
                    moduleId,
                    questionCount: qs.length,
                    needed: MIN_QUESTIONS - qs.length,
                });
            }
            if (qs.length > 0 && analyzeCount < 2) {
                report.summary.modulesWithoutAnalyzeLevel.push({ tier: tier.name, moduleId, analyzeCount });
            }
            if (es.length > 0 && !moduleReport.hasRubricEssay) {
                report.summary.modulesWithoutRubricEssays.push({ tier: tier.name, moduleId });
            }
        }

        report.tiers[tier.name] = tierReport;
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  TRIBAMS Question Bank Audit — Step 2');
    console.log('  (Heuristics, not proofs. See docs/methodology/audit-caveat.md)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('Generated: ' + report.generatedAt);
    console.log('Minimum questions per certificate module: ' + MIN_QUESTIONS);
    console.log('Minimum analyze-level per module: ' + MIN_ANALYZE_LEVEL);
    console.log('');
    console.log('TOTALS');
    console.log('  Total questions:           ' + report.summary.totalQuestions);
    console.log('  Total essays:              ' + report.summary.totalEssays);
    console.log('  Questions with any issue:  ' + report.summary.questionsWithIssues);
    console.log('  Essays with any issue:     ' + report.summary.essaysWithIssues);
    console.log('');
    console.log('PER TIER');
    for (const [tierName, tr] of Object.entries(report.tiers)) {
        console.log('  Tier ' + tierName + ': ' + tr.questionCount + ' questions across ' + tr.moduleCount + ' modules, ' + tr.essayCount + ' essays');
    }
    console.log('');
    console.log('MODULES UNDER ' + MIN_QUESTIONS + ' QUESTIONS: ' + report.summary.modulesUnderMinimum.length);
    for (const m of report.summary.modulesUnderMinimum.slice(0, 25)) {
        console.log('  Tier ' + m.tier + ' Module ' + m.moduleId + ': ' + m.questionCount + ' questions (need ' + m.needed + ' more)');
    }
    if (report.summary.modulesUnderMinimum.length > 25) {
        console.log('  ... and ' + (report.summary.modulesUnderMinimum.length - 25) + ' more');
    }
    console.log('');
    console.log('MODULES WITHOUT >=2 ANALYZE-LEVEL: ' + report.summary.modulesWithoutAnalyzeLevel.length);
    for (const m of report.summary.modulesWithoutAnalyzeLevel.slice(0, 15)) {
        console.log('  Tier ' + m.tier + ' Module ' + m.moduleId + ': ' + m.analyzeCount + ' analyze-level');
    }
    if (report.summary.modulesWithoutAnalyzeLevel.length > 15) {
        console.log('  ... and ' + (report.summary.modulesWithoutAnalyzeLevel.length - 15) + ' more');
    }
    console.log('');
    console.log("MODULES WITHOUT RUBRIC'D ESSAY: " + report.summary.modulesWithoutRubricEssays.length);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');

    const auditDir = path.resolve(__dirname, '..', 'docs', 'audit');
    fs.mkdirSync(auditDir, { recursive: true });
    const reportPath = path.join(auditDir, 'audit-before.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log('Full report written to: docs/audit/audit-before.json');
}

main();