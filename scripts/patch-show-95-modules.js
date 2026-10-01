const fs = require('fs');
const path = require('path');

// --- resource-center.html ---
const rcPath = path.join(__dirname, '..', 'views', 'resource-center.html');
let rc = fs.readFileSync(rcPath, 'utf8');

rc = rc.replace('const MODULES = [{', 'let MODULES = [{');
rc = rc.replace(/Explore 45 immersive/g, 'Explore 95 immersive');
rc = rc.replace(/Browse all 45 cybersecurity/g, 'Browse all 95 cybersecurity');
rc = rc.replace('Explore 45 immersive cybersecurity training modules. Each module includes', 'Explore 95 immersive cybersecurity training modules. Each module includes');
rc = rc.replace('<span class="number" id="totalModules">45</span>', '<span class="number" id="totalModules">95</span>');
rc = rc.replace('All <span class="badge" id="allCount">45</span>', 'All <span class="badge" id="allCount">95</span>');
rc = rc.replace('of <strong id="totalCount">45</strong> modules', 'of <strong id="totalCount">95</strong> modules');
rc = rc.replace('We have 45 modules covering', 'We have 95 modules covering');
rc = rc.replace('Resource Center loaded – 45 modules available.', 'Resource Center loaded – ${MODULES.length} modules available.');

// Fix the console.log to use template - the replace above might have broken quotes
rc = rc.replace(
    "console.log('📚 Resource Center loaded – ${MODULES.length} modules available.');",
    'console.log(`📚 Resource Center loaded – ${MODULES.length} modules available.`);'
);

// Add offensive-tools filter button
if (!rc.includes('data-filter="offensive-tools"')) {
    rc = rc.replace(
        '<button class="filter-btn" data-filter="emerging">🧠 Emerging Technologies <span class="badge" id="emergingCount">0</span></button>',
        `<button class="filter-btn" data-filter="emerging">🧠 Emerging Technologies <span class="badge" id="emergingCount">0</span></button>
                <button class="filter-btn" data-filter="offensive-tools">⚔️ Attacker Toolkit <span class="badge" id="offensiveCount">0</span></button>`
    );
}

if (!rc.includes('offensiveCount')) {
    rc = rc.replace(
        `emerging: document.getElementById('emergingCount')
        };`,
        `emerging: document.getElementById('emergingCount'),
            'offensive-tools': document.getElementById('offensiveCount')
        };`
    );
}

rc = rc.replace(
    `emerging: 'Emerging Technologies'
            };
            return map[cat] || cat;`,
    `emerging: 'Emerging Technologies',
                'offensive-tools': 'Attacker Toolkit'
            };
            return map[cat] || cat;`
);

rc = rc.replace(
    `emerging: '🧠'
            };
            return map[cat] || '📘';`,
    `emerging: '🧠',
                'offensive-tools': '⚔️'
            };
            return map[cat] || '📘';`
);

const oldMerge = `            // Merge Free vs Pro access flags from server
            try {
                const res = await fetch('/api/modules', { credentials: 'same-origin' });
                const data = await res.json();
                if (data.modules) {
                    const byId = new Map(data.modules.map(m => [m.id, m]));
                    MODULES.forEach(m => {
                        const a = byId.get(m.id);
                        if (!a) return;
                        m.is_free = !!a.is_free;
                        m.is_paid = !!a.is_paid;
                        m.paid_locked = !!a.paid_locked;
                        m.locked = !!a.locked;
                        m.access = a.access;
                    });
                    window.__accessMeta = data.access || null;
                    window.__freeModuleIds = data.free_module_ids || [1, 7, 37];
                }
            } catch (e) {
                // Default: mark only starter modules free if API unavailable
                const freeIds = new Set([1, 7, 37]);
                MODULES.forEach(m => {
                    m.is_free = freeIds.has(m.id);
                    m.is_paid = !m.is_free;
                    m.paid_locked = !m.is_free;
                    m.locked = m.paid_locked;
                });
            }`;

const newMerge = `            // Load FULL catalog (95) from API — local list is only for icons/descriptions
            try {
                const res = await fetch('/api/modules', { credentials: 'same-origin' });
                const data = await res.json();
                if (data.modules && data.modules.length) {
                    const iconById = new Map(MODULES.map(m => [m.id, m.icon]));
                    const descById = new Map(MODULES.map(m => [m.id, m.description]));
                    const defaultIcon = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>\`;
                    MODULES = data.modules.map(a => ({
                        id: a.id,
                        name: a.name,
                        category: a.category || 'emerging',
                        description: descById.get(a.id) || (a.id > 45
                            ? \`\${a.name}: study how adversaries use this tooling — how they move and talk — so you can detect and stop it.\`
                            : \`\${a.name} training module with practice drills and a scored live quiz.\`),
                        difficulty: a.difficulty || 'medium',
                        popular: a.id <= 12,
                        new: a.id > 45,
                        premium: a.id > 45,
                        duration: '40',
                        icon: iconById.get(a.id) || defaultIcon,
                        is_free: !!a.is_free,
                        is_paid: !!a.is_paid,
                        paid_locked: !!a.paid_locked,
                        locked: !!a.locked,
                        access: a.access,
                        requires_pro_plus: !!a.requires_pro_plus
                    }));
                    const totalEl = document.getElementById('totalModules');
                    if (totalEl) totalEl.textContent = String(MODULES.length);
                    if (totalCount) totalCount.textContent = String(MODULES.length);
                    window.__accessMeta = data.access || null;
                    window.__freeModuleIds = data.free_module_ids || [1, 7, 37];
                }
            } catch (e) {
                const freeIds = new Set([1, 7, 37]);
                MODULES.forEach(m => {
                    m.is_free = freeIds.has(m.id);
                    m.is_paid = !m.is_free;
                    m.paid_locked = !m.is_free;
                    m.locked = m.paid_locked;
                });
            }`;

if (!rc.includes(oldMerge)) {
    console.error('resource-center merge block not found');
    process.exit(1);
}
rc = rc.replace(oldMerge, newMerge);
fs.writeFileSync(rcPath, rc);
console.log('resource-center.html OK, modules load from API');

// --- dashboard.html ---
const dashPath = path.join(__dirname, '..', 'views', 'dashboard.html');
let dash = fs.readFileSync(dashPath, 'utf8');
dash = dash.replace('// --- 45 Modules ---\n        const MODULES = [', '// --- Modules (hydrated from /api/modules to include all 95) ---\n        let MODULES = [');

const dashHook = `                // Load user info for avatar
                try {
                    const userRes = await fetch('/api/user-info');
                    const userData = await userRes.json();
                    if (userData.success) {
                        this.user = userData;
                    }
                } catch (e) { /* ignore */ }
            }`;

const dashHookNew = `                // Load user info for avatar
                try {
                    const userRes = await fetch('/api/user-info');
                    const userData = await userRes.json();
                    if (userData.success) {
                        this.user = userData;
                    }
                } catch (e) { /* ignore */ }

                // Expand MODULES to full live catalog (95)
                try {
                    const modRes = await fetch('/api/modules', { credentials: 'same-origin' });
                    const modData = await modRes.json();
                    if (modData.modules && modData.modules.length) {
                        MODULES = modData.modules.map(m => ({
                            id: m.id,
                            name: m.name,
                            category: m.category,
                            difficulty: m.difficulty || 'medium',
                            is_free: !!m.is_free,
                            paid_locked: !!m.paid_locked,
                            locked: !!m.locked,
                            access: m.access
                        }));
                    }
                } catch (e) { /* keep fallback 45 */ }
            }`;

if (!dash.includes(dashHook)) {
    console.error('dashboard hook not found');
    process.exit(1);
}
dash = dash.replace(dashHook, dashHookNew);
dash = dash.replace('|| 45} total)', '|| MODULES.length} total)');
fs.writeFileSync(dashPath, dash);
console.log('dashboard.html OK');

// payment copy 45 -> 95 where it says Pro has 45 as the full catalog
const payPath = path.join(__dirname, '..', 'views', 'payment.html');
let pay = fs.readFileSync(payPath, 'utf8');
pay = pay.replace(/45 core modules/g, '95 modules');
pay = pay.replace(/45 core defensive modules/g, 'Full 95-module catalog');
pay = pay.replace(/Core 45 catalog/g, 'Full 95-module catalog');
pay = pay.replace(/Everything in Pro Monthly<\/span><\/li>\n                    <li><span class="feature-icon">💎<\/span> <span class="feature-text highlight-text" id="annualTotalNote">N\$299\/mo × 12<\/span><\/li>\n                    <li><span class="feature-icon">✅<\/span> <span class="feature-text">Priority support<\/span><\/li>\n                    <li class="disabled"><span class="cross">✕<\/span> <span class="feature-text">Full 95-module Pro\+ catalog<\/span><\/li>/,
    `Everything in Pro Monthly</span></li>
                    <li><span class="feature-icon">💎</span> <span class="feature-text highlight-text" id="annualTotalNote">N$299/mo × 12</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Priority support</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">All 95 modules unlocked</span></li>`);
pay = pay.replace('<td>45</td>\n                        <td><span style="color:var(--neon-gold);font-weight:700;">95</span></td>',
    '<td>95</td>\n                        <td><span style="color:var(--neon-gold);font-weight:700;">95</span></td>');
pay = pay.replace('Choose Pro (45 modules) or Pro+ (95 modules including attacker-toolkit labs).',
    'Choose Pro or Pro+ — both unlock the full 95-module catalog. Pro+ packs are built for intensive attacker-toolkit focus.');
fs.writeFileSync(payPath, pay);
console.log('payment.html OK');
