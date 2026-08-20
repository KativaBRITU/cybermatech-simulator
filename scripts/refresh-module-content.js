#!/usr/bin/env node
/**
 * Manual / cron CLI for quarterly module content refresh.
 *
 * Usage:
 *   node scripts/refresh-module-content.js           # refresh modules due (>90 days)
 *   node scripts/refresh-module-content.js --force   # refresh all modules now
 *   node scripts/refresh-module-content.js --module 4
 */

'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { createDatabase } = require('../modules/database');
const { initSchema } = require('../modules/schema');
const contentRefresh = require('../modules/contentRefresh');
const { SPECIAL_OPS_MODULES } = require('../modules/specialOpsModules');
const { ATTACKER_TOOLKIT_MODULES } = require('../modules/attackerToolkitModules');

const BASE_MODULES = [
    { id: 1, name: 'Phishing Detection', category: 'social-engineering', difficulty: 'easy' },
    { id: 2, name: 'Malware Analysis', category: 'malware', difficulty: 'medium' },
    { id: 3, name: 'Network Security', category: 'network', difficulty: 'medium' },
    { id: 4, name: 'Cloud Security', category: 'cloud', difficulty: 'medium' }
];

function parseArgs(argv) {
    const force = argv.includes('--force');
    const modIdx = argv.indexOf('--module');
    const moduleId = modIdx >= 0 ? parseInt(argv[modIdx + 1], 10) : null;
    return { force, moduleId: Number.isFinite(moduleId) ? moduleId : null };
}

async function loadCatalog(db) {
    try {
        const rows = await db.allAsync(
            'SELECT id, name, category, difficulty FROM modules ORDER BY id ASC'
        );
        if (rows && rows.length) return rows;
    } catch (_) { /* fallback */ }
    return [...BASE_MODULES, ...ATTACKER_TOOLKIT_MODULES, ...SPECIAL_OPS_MODULES];
}

async function main() {
    const { force, moduleId } = parseArgs(process.argv.slice(2));
    const db = createDatabase(path.join(__dirname, '..', 'database'));
    await initSchema(db);

    const catalog = await loadCatalog(db);
    if (!catalog.length) {
        console.error('No modules in database. Run `npm start` once to seed the catalog, then retry.');
        process.exit(1);
    }
    let result;

    if (moduleId) {
        const mod = catalog.find((m) => m.id === moduleId);
        if (!mod) {
            console.error(`Module ${moduleId} not found`);
            process.exit(1);
        }
        result = await contentRefresh.refreshModuleContent(db, mod, { force });
        console.log(JSON.stringify(result, null, 2));
    } else {
        result = await contentRefresh.refreshAllModulesIfDue(db, catalog, { force });
        console.log(`Refreshed ${result.refreshed}/${result.total} modules (force=${force})`);
        console.log(JSON.stringify(result.results.filter((r) => r.refreshed).slice(0, 10), null, 2));
    }

    await db.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
