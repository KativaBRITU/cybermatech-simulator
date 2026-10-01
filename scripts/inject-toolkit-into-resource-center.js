/**
 * Append attacker-toolkit modules (46–95) to Resource Center + Dashboard local MODULES lists.
 */
const fs = require('fs');
const path = require('path');
const { ATTACKER_TOOLKIT_MODULES } = require('../modules/attackerToolkitModules');

const icon =
    '`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>`';

function injectResourceCenter() {
    const file = path.join(__dirname, '..', 'views', 'resource-center.html');
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('Purple Team Tool Correlation Lab')) {
        console.log('resource-center: already has toolkit modules');
        return;
    }

    const needle = "name: 'Cyber Law & Ethics'";
    const start = html.indexOf(needle);
    if (start < 0) throw new Error('resource-center: Cyber Law marker missing');

    const endArr = html.indexOf('];', start);
    if (endArr < 0) throw new Error('resource-center: MODULES end missing');

    // Walk back to the `}` that closes module 45 object (before `];`)
    let closeBrace = html.lastIndexOf('}', endArr);
    const before = html.slice(0, closeBrace + 1);
    const after = html.slice(closeBrace + 1);

    const extra = ATTACKER_TOOLKIT_MODULES.map(
        (m) => `, {
            id: ${m.id},
            name: ${JSON.stringify(m.name)},
            category: 'offensive-tools',
            description: ${JSON.stringify(
                m.name +
                    ': study how adversaries use this tooling — how they move and talk — so you can detect and stop it.'
            )},
            difficulty: ${JSON.stringify(m.difficulty)},
            popular: false,
            new: true,
            premium: true,
            duration: '40',
            icon: ${icon}
        }`
    ).join('');

    fs.writeFileSync(file, before + extra + after);
    console.log(`resource-center: injected ${ATTACKER_TOOLKIT_MODULES.length} modules`);
}

function injectDashboard() {
    const file = path.join(__dirname, '..', 'views', 'dashboard.html');
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('Purple Team Tool Correlation Lab')) {
        console.log('dashboard: already has toolkit modules');
        return;
    }

    const needle = "{ id: 45, name: 'Cyber Law & Ethics', category: 'governance', difficulty: 'easy' }";
    if (!html.includes(needle)) throw new Error('dashboard: module 45 marker missing');

    const extra = ATTACKER_TOOLKIT_MODULES.map(
        (m) =>
            `,\n            { id: ${m.id}, name: ${JSON.stringify(m.name)}, category: 'offensive-tools', difficulty: ${JSON.stringify(m.difficulty)} }`
    ).join('');

    html = html.replace(needle, needle + extra);
    fs.writeFileSync(file, html);
    console.log(`dashboard: injected ${ATTACKER_TOOLKIT_MODULES.length} modules`);
}

injectResourceCenter();
injectDashboard();
