/**
 * Free / Pro / Pro+ / Special Ops / Beta module access
 * Admins always have full access for review/testing (ADMIN_EMAILS only).
 * Beta testers get the full learner catalog (modules + resources) without admin.
 *
 * Free        → sampler modules
 * Pro         → core + toolkit through PRO_MAX (default 95)
 * Pro+        → same full catalog through PRO_MAX (legacy Pro+ branding)
 * Special Ops → Pro+ catalog PLUS elite modules 96–97 (higher price)
 * Beta        → full learner catalog (incl. Special Ops modules); NOT admin
 */

const { SPECIAL_OPS_MODULE_IDS } = require('./specialOpsModules');

const DEFAULT_FREE_MODULE_IDS = [1, 7, 37]; // Phishing, Social Engineering, Security Awareness
const DEFAULT_PRO_MAX_ID = 95;

function parseFreeIds(envValue) {
    if (!envValue || typeof envValue !== 'string') return [...DEFAULT_FREE_MODULE_IDS];
    const ids = envValue.split(',').map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n) && n > 0);
    return ids.length ? ids : [...DEFAULT_FREE_MODULE_IDS];
}

function getFreeModuleIds() {
    return parseFreeIds(process.env.FREE_MODULE_IDS);
}

function getProMaxId() {
    const n = parseInt(process.env.PRO_MAX_MODULE_ID || '', 10);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_PRO_MAX_ID;
}

function isAdminEmail(email, adminEmails = []) {
    if (!email) return false;
    return adminEmails.map(e => String(e).toLowerCase()).includes(String(email).toLowerCase());
}

/**
 * Closed-beta explorers: full module/resource catalog, no paid/rank locks.
 * Never grants admin — ADMIN_EMAILS remains the only admin path.
 */
function isBetaTester(user = {}) {
    if (!user) return false;
    if (user.is_beta_tester === true || user.is_beta_tester === 1 || user.is_beta_tester === '1') {
        return true;
    }
    const tier = normalizeTier(user);
    return tier === 'beta' || tier === 'beta_tester';
}

function normalizeTier(user = {}) {
    return String(user.subscription_tier || 'free').toLowerCase().replace(/[\s-]+/g, '_');
}

function normalizeStatus(user = {}) {
    return String(user.subscription_status || 'inactive').toLowerCase();
}

function isActivePaid(user = {}) {
    const status = normalizeStatus(user);
    return status === 'active' || status === 'trialing' || status === 'paid';
}

function orgGrantsPro(user = {}) {
    const org = user.org_access;
    if (!org || org.license_inactive) return false;
    const tier = String(org.license_tier || '').toLowerCase();
    const status = String(org.license_status || '').toLowerCase();
    return ['active', 'trialing', 'paid'].includes(status) &&
        ['pro', 'pro_plus', 'proplus', 'premium', 'special_ops', 'elite'].includes(tier);
}

function orgGrantsProPlus(user = {}) {
    const org = user.org_access;
    if (!org || org.license_inactive) return false;
    const tier = String(org.license_tier || '').toLowerCase();
    const status = String(org.license_status || '').toLowerCase();
    return ['active', 'trialing', 'paid'].includes(status) &&
        ['pro_plus', 'proplus', 'premium_plus', 'special_ops', 'elite'].includes(tier);
}

function orgGrantsSpecialOps(user = {}) {
    const org = user.org_access;
    if (!org || org.license_inactive) return false;
    const tier = String(org.license_tier || '').toLowerCase();
    const status = String(org.license_status || '').toLowerCase();
    return ['active', 'trialing', 'paid'].includes(status) &&
        ['special_ops', 'elite'].includes(tier);
}

/** Any paid tier (Pro, Pro+, Special Ops) */
function isProUser(user = {}) {
    if (orgGrantsPro(user) || orgGrantsProPlus(user) || orgGrantsSpecialOps(user)) return true;
    const tier = normalizeTier(user);
    if (['pro', 'pro_plus', 'proplus', 'premium', 'annual', 'monthly', 'paid', 'special_ops', 'elite'].includes(tier)) {
        return isActivePaid(user) || ['pro', 'pro_plus', 'proplus', 'premium', 'annual', 'monthly', 'paid', 'special_ops', 'elite'].includes(tier);
    }
    if (isActivePaid(user)) return true;
    return false;
}

/** Pro+ catalog (through PRO_MAX). Special Ops includes Pro+. */
function isProPlusUser(user = {}) {
    if (isSpecialOpsUser(user)) return true;
    if (orgGrantsProPlus(user)) return true;
    const tier = normalizeTier(user);
    if (['pro_plus', 'proplus', 'premium_plus'].includes(tier)) {
        return true;
    }
    return false;
}

/** Highest consumer tier — Special Ops Elite modules 96–97 */
function isSpecialOpsUser(user = {}) {
    if (orgGrantsSpecialOps(user)) return true;
    const tier = normalizeTier(user);
    return ['special_ops', 'elite', 'specialops'].includes(tier);
}

function moduleIdOf(moduleOrId) {
    return moduleOrId && typeof moduleOrId === 'object'
        ? Number(moduleOrId.id)
        : parseInt(moduleOrId, 10);
}

function moduleRequiresSpecialOps(moduleOrId) {
    const id = moduleIdOf(moduleOrId);
    if (!Number.isFinite(id)) return false;
    if (SPECIAL_OPS_MODULE_IDS.includes(id)) return true;
    if (moduleOrId && typeof moduleOrId === 'object') {
        const tier = String(moduleOrId.access_tier || '').toLowerCase();
        if (tier === 'special_ops' || moduleOrId.special_ops) return true;
    }
    return false;
}

function moduleRequiresProPlus(moduleOrId) {
    // Special Ops is a stricter gate handled separately.
    if (moduleRequiresSpecialOps(moduleOrId)) return false;
    const id = moduleIdOf(moduleOrId);
    return Number.isFinite(id) && id > getProMaxId();
}

/**
 * @returns {{ allowed: boolean, reason: string, access: string, isAdmin: boolean, isPro: boolean, isProPlus: boolean, isSpecialOps: boolean, isBeta: boolean }}
 */
function canAccessModule(moduleId, user, adminEmails = [], moduleMeta = null) {
    const id = parseInt(moduleId, 10);
    const freeIds = getFreeModuleIds();
    const admin = isAdminEmail(user?.email, adminEmails);
    const beta = isBetaTester(user);
    const specialOps = isSpecialOpsUser(user) || beta;
    const proPlus = isProPlusUser(user) || beta;
    const pro = isProUser(user) || proPlus || beta;
    const needsSpecial = moduleRequiresSpecialOps(moduleMeta || id);
    const needsPlus = moduleRequiresProPlus(moduleMeta || id);

    if (admin) {
        return {
            allowed: true,
            reason: 'Admin full access (review/testing)',
            access: 'admin',
            isAdmin: true,
            isPro: pro,
            isProPlus: true,
            isSpecialOps: true,
            isBeta: false
        };
    }
    if (beta) {
        return {
            allowed: true,
            reason: 'Beta tester — full learner catalog (modules & resources)',
            access: 'beta',
            isAdmin: false,
            isPro: true,
            isProPlus: true,
            isSpecialOps: true,
            isBeta: true
        };
    }
    if (needsSpecial) {
        if (specialOps) {
            return {
                allowed: true,
                reason: 'Special Ops Elite — live red/blue crisis modules unlocked',
                access: 'special_ops',
                isAdmin: false,
                isPro: true,
                isProPlus: true,
                isSpecialOps: true,
                isBeta: false
            };
        }
        return {
            allowed: false,
            reason: 'Special Ops Elite only (priced above Pro+). Unlock Live Red Team Emulation and Live Blue Team Crisis Cell after Mission-Ready rank.',
            access: 'locked_special_ops',
            isAdmin: false,
            isPro: pro,
            isProPlus: proPlus,
            isSpecialOps: false,
            isBeta: false
        };
    }
    if (proPlus) {
        return {
            allowed: true,
            reason: 'Pro+ / Special Ops — full attacker-toolkit catalog',
            access: specialOps ? 'special_ops' : 'pro_plus',
            isAdmin: false,
            isPro: true,
            isProPlus: true,
            isSpecialOps: specialOps,
            isBeta: false
        };
    }
    if (pro && !needsPlus) {
        return {
            allowed: true,
            reason: 'Pro subscription — core modules',
            access: 'pro',
            isAdmin: false,
            isPro: true,
            isProPlus: false,
            isSpecialOps: false,
            isBeta: false
        };
    }
    if (pro && needsPlus) {
        return {
            allowed: false,
            reason: 'This attacker-toolkit module is Pro+. Upgrade to Pro+ to unlock how adversaries move and talk.',
            access: 'locked_pro_plus',
            isAdmin: false,
            isPro: true,
            isProPlus: false,
            isSpecialOps: false,
            isBeta: false
        };
    }
    if (freeIds.includes(id)) {
        return {
            allowed: true,
            reason: 'Included in Free plan',
            access: 'free',
            isAdmin: false,
            isPro: false,
            isProPlus: false,
            isSpecialOps: false,
            isBeta: false
        };
    }
    return {
        allowed: false,
        reason: 'Upgrade to Pro for core modules, Pro+ for the toolkit catalog, or Special Ops Elite for live red/blue crisis modules.',
        access: 'locked',
        isAdmin: false,
        isPro: false,
        isProPlus: false,
        isSpecialOps: false,
        isBeta: false
    };
}

function annotateModules(modulesList = [], user = null, adminEmails = []) {
    const freeIds = new Set(getFreeModuleIds());
    const admin = user ? isAdminEmail(user.email, adminEmails) : false;
    const beta = user ? isBetaTester(user) : false;
    const specialOps = user ? (isSpecialOpsUser(user) || beta) : false;
    const proPlus = user ? (isProPlusUser(user) || beta) : false;
    const pro = user ? (isProUser(user) || proPlus || beta) : false;

    return modulesList.map(m => {
        const isFree = freeIds.has(m.id);
        const needsSpecial = moduleRequiresSpecialOps(m);
        const needsPlus = moduleRequiresProPlus(m);
        const accessInfo = user
            ? canAccessModule(m.id, user, adminEmails, m)
            : {
                allowed: isFree,
                access: isFree ? 'free' : (needsSpecial ? 'locked_special_ops' : (needsPlus ? 'locked_pro_plus' : 'locked')),
                isAdmin: false,
                isPro: false,
                isProPlus: false,
                isSpecialOps: false,
                isBeta: false
            };

        let access = accessInfo.access;
        let paidLocked = !accessInfo.allowed;

        if (!user) {
            access = isFree ? 'free' : (needsSpecial ? 'locked_special_ops' : (needsPlus ? 'locked_pro_plus' : 'locked'));
            paidLocked = !isFree;
        }

        let upgradeTarget = null;
        if (paidLocked) {
            if (needsSpecial && !specialOps && !admin && !beta) upgradeTarget = 'special_ops';
            else if (needsPlus && pro && !proPlus && !admin && !beta) upgradeTarget = 'pro_plus';
            else if (needsPlus) upgradeTarget = 'pro_plus';
            else upgradeTarget = 'pro';
        }

        return {
            ...m,
            access_tier: needsSpecial ? 'special_ops' : (needsPlus ? 'pro_plus' : (isFree ? 'free' : 'pro')),
            is_free: isFree,
            is_paid: !isFree,
            requires_pro_plus: needsPlus,
            requires_special_ops: needsSpecial,
            access,
            paid_locked: paidLocked,
            upgrade_required: paidLocked,
            upgrade_target: upgradeTarget
        };
    });
}

module.exports = {
    DEFAULT_FREE_MODULE_IDS,
    DEFAULT_PRO_MAX_ID,
    SPECIAL_OPS_MODULE_IDS,
    getFreeModuleIds,
    getProMaxId,
    isAdminEmail,
    isBetaTester,
    isProUser,
    isProPlusUser,
    isSpecialOpsUser,
    orgGrantsPro,
    orgGrantsProPlus,
    orgGrantsSpecialOps,
    moduleRequiresProPlus,
    moduleRequiresSpecialOps,
    canAccessModule,
    annotateModules
};
