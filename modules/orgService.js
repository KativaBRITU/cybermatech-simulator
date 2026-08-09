/**
 * B2B organizations — licensing, seats, custom training (Tribams business plan).
 */

const crypto = require('crypto');

const ORG_TYPES = ['education', 'government', 'healthcare', 'enterprise', 'sme', 'other'];
const LICENSE_PLANS = {
    institution_annual: {
        label: 'Institution Annual License',
        seats: 50,
        months: 12,
        tier: 'pro',
        nad: Number(process.env.PRICE_LICENSE_INSTITUTION_NAD) || 18000,
        description: 'Schools & training centres — up to 50 seats, Pro catalog, yearly renewal.'
    },
    enterprise_license: {
        label: 'Enterprise License',
        seats: 200,
        months: 12,
        tier: 'pro_plus',
        nad: Number(process.env.PRICE_LICENSE_ENTERPRISE_NAD) || 45000,
        description: 'Large orgs & government — up to 200 seats, Pro+ attacker-toolkit catalog.'
    },
    sme_pack: {
        label: 'SME Team Pack',
        seats: 15,
        months: 12,
        tier: 'pro',
        nad: Number(process.env.PRICE_LICENSE_SME_NAD) || 6500,
        description: 'Small/medium businesses — 15 seats, Pro modules, annual license.'
    },
    custom_training: {
        label: 'Customized Training Package',
        seats: 25,
        months: 6,
        tier: 'pro_plus',
        nad: Number(process.env.PRICE_CUSTOM_TRAINING_NAD) || 12000,
        description: 'Bespoke Namibia/industry scenarios + compliance focus + delivery support.'
    }
};

function slugify(name) {
    return String(name || 'org')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 48) || 'org';
}

function makeInviteCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function expiresAtMonths(months) {
    const d = new Date();
    d.setMonth(d.getMonth() + Number(months || 12));
    return d.toISOString();
}

function catalogPlans() {
    return Object.entries(LICENSE_PLANS).map(([key, p]) => ({ key, ...p }));
}

function isLicenseActive(org) {
    if (!org) return false;
    const status = String(org.license_status || '').toLowerCase();
    if (!['active', 'trialing', 'paid'].includes(status)) return false;
    if (org.license_expires_at && new Date(org.license_expires_at).getTime() < Date.now()) return false;
    return true;
}

/**
 * Resolve the strongest active org license for a user.
 */
async function getUserOrgAccess(db, userId) {
    if (!userId) return null;
    const rows = await db.allAsync(
        `SELECT o.*, m.role AS member_role, m.status AS member_status
         FROM organization_members m
         JOIN organizations o ON o.id = m.org_id
         WHERE m.user_id = ? AND m.status = 'active'
         ORDER BY
           CASE o.license_tier WHEN 'pro_plus' THEN 2 WHEN 'pro' THEN 1 ELSE 0 END DESC,
           o.id ASC`,
        [userId]
    );
    if (!rows || !rows.length) return null;

    for (const org of rows) {
        if (isLicenseActive(org)) {
            return {
                org_id: org.id,
                org_name: org.name,
                org_type: org.org_type,
                role: org.member_role,
                license_tier: org.license_tier || 'pro',
                license_status: org.license_status,
                license_expires_at: org.license_expires_at,
                seat_limit: org.seat_limit,
                invite_code: org.invite_code
            };
        }
    }
    // Still return membership for UI even if license inactive
    const first = rows[0];
    return {
        org_id: first.id,
        org_name: first.name,
        org_type: first.org_type,
        role: first.member_role,
        license_tier: first.license_tier || 'free',
        license_status: first.license_status || 'inactive',
        license_expires_at: first.license_expires_at,
        seat_limit: first.seat_limit,
        invite_code: first.invite_code,
        license_inactive: true
    };
}

async function countActiveSeats(db, orgId) {
    const row = await db.getAsync(
        `SELECT COUNT(*) AS c FROM organization_members WHERE org_id = ? AND status = 'active'`,
        [orgId]
    );
    return Number(row?.c || 0);
}

async function assertOrgRole(db, orgId, userId, roles = ['owner', 'admin']) {
    const m = await db.getAsync(
        `SELECT * FROM organization_members WHERE org_id = ? AND user_id = ? AND status = 'active'`,
        [orgId, userId]
    );
    if (!m) return null;
    if (roles.length && !roles.includes(m.role)) return null;
    return m;
}

async function createOrganization(db, { name, orgType, industry, contactEmail, createdBy }) {
    const type = ORG_TYPES.includes(orgType) ? orgType : 'other';
    let slug = slugify(name);
    const existing = await db.getAsync('SELECT id FROM organizations WHERE slug = ?', [slug]);
    if (existing) slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`;

    const invite = makeInviteCode();
    const result = await db.runAsync(
        `INSERT INTO organizations
         (name, slug, org_type, industry, country, contact_email, seat_limit,
          license_tier, license_status, invite_code, created_by)
         VALUES (?, ?, ?, ?, 'NA', ?, 10, 'free', 'inactive', ?, ?)`,
        [name.trim(), slug, type, industry || null, contactEmail || null, invite, createdBy]
    );
    const orgId = result.lastID || result.lastId;
    // Dialect adapters may return differently — fetch by slug
    const org = await db.getAsync('SELECT * FROM organizations WHERE slug = ?', [slug]);
    await db.runAsync(
        `INSERT INTO organization_members (org_id, user_id, role, status)
         VALUES (?, ?, 'owner', 'active')`,
        [org.id, createdBy]
    );
    return org;
}

async function joinWithInvite(db, userId, inviteCode) {
    const code = String(inviteCode || '').trim().toUpperCase();
    if (!code) {
        const err = new Error('Invite code required');
        err.code = 'BAD_REQUEST';
        throw err;
    }
    const org = await db.getAsync('SELECT * FROM organizations WHERE invite_code = ?', [code]);
    if (!org) {
        const err = new Error('Invalid invite code');
        err.code = 'NOT_FOUND';
        throw err;
    }

    const seats = await countActiveSeats(db, org.id);
    const limit = Number(org.seat_limit) || 10;
    const existing = await db.getAsync(
        `SELECT * FROM organization_members WHERE org_id = ? AND user_id = ?`,
        [org.id, userId]
    );
    if (existing && existing.status === 'active') {
        return { org, already: true };
    }
    if (!existing && seats >= limit) {
        const err = new Error(`Seat limit reached (${limit}). Ask your org admin to upgrade the license.`);
        err.code = 'SEAT_LIMIT';
        throw err;
    }

    if (existing) {
        await db.runAsync(
            `UPDATE organization_members SET status = 'active', role = COALESCE(role, 'member') WHERE id = ?`,
            [existing.id]
        );
    } else {
        await db.runAsync(
            `INSERT INTO organization_members (org_id, user_id, role, status) VALUES (?, ?, 'member', 'active')`,
            [org.id, userId]
        );
    }
    return { org, already: false };
}

async function activateLicense(db, orgId, planKey, extras = {}) {
    const plan = LICENSE_PLANS[planKey];
    if (!plan) {
        const err = new Error('Unknown license plan');
        err.code = 'UNKNOWN_PLAN';
        throw err;
    }
    const expires = expiresAtMonths(plan.months);
    await db.runAsync(
        `UPDATE organizations
         SET license_tier = ?, license_status = 'active', license_expires_at = ?,
             seat_limit = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [plan.tier, expires, plan.seats, orgId]
    );
    await db.runAsync(
        `INSERT INTO organization_licenses
         (org_id, plan, seats, amount_nad, status, starts_at, expires_at, notes)
         VALUES (?, ?, ?, ?, 'active', CURRENT_TIMESTAMP, ?, ?)`,
        [orgId, planKey, plan.seats, plan.nad, expires, extras.notes || null]
    );
    return { plan, expires };
}

async function getOrgAnalytics(db, orgId) {
    const org = await db.getAsync('SELECT * FROM organizations WHERE id = ?', [orgId]);
    if (!org) return null;

    const members = await db.allAsync(
        `SELECT m.role, m.status, m.joined_at, u.id AS user_id, u.username, u.email,
                u.subscription_tier, u.last_active
         FROM organization_members m
         JOIN users u ON u.id = m.user_id
         WHERE m.org_id = ?
         ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, u.username`,
        [orgId]
    );

    const memberIds = members.map((m) => m.user_id);
    let scoreStats = { attempts: 0, avg_score: 0, certificates: 0, lab_passes: 0 };
    let topModules = [];
    let recentActivity = [];

    if (memberIds.length) {
        const placeholders = memberIds.map(() => '?').join(',');
        const scores = await db.getAsync(
            `SELECT COUNT(*) AS attempts, COALESCE(AVG(score), 0) AS avg_score
             FROM quiz_scores WHERE user_id IN (${placeholders})`,
            memberIds
        );
        const certs = await db.getAsync(
            `SELECT COUNT(*) AS c FROM certificates
             WHERE recipient_name IN (
               SELECT username FROM users WHERE id IN (${placeholders})
             )`,
            memberIds
        );
        const labs = await db.getAsync(
            `SELECT COUNT(*) AS c FROM lab_completions
             WHERE user_id IN (${placeholders}) AND passed = 1`,
            memberIds
        );
        scoreStats = {
            attempts: Number(scores?.attempts || 0),
            avg_score: Math.round(Number(scores?.avg_score || 0)),
            certificates: Number(certs?.c || 0),
            lab_passes: Number(labs?.c || 0)
        };

        topModules = await db.allAsync(
            `SELECT module_name, COUNT(*) AS attempts, ROUND(AVG(score)) AS avg_score
             FROM quiz_scores
             WHERE user_id IN (${placeholders})
             GROUP BY module_name
             ORDER BY attempts DESC
             LIMIT 8`,
            memberIds
        );

        recentActivity = await db.allAsync(
            `SELECT user_id, module_name AS detail, score AS value, completed_at AS at, 'quiz' AS kind
             FROM quiz_scores
             WHERE user_id IN (${placeholders})
             ORDER BY datetime(completed_at) DESC
             LIMIT 15`,
            memberIds
        );
    }

    const customRequests = await db.allAsync(
        `SELECT id, title, industry_focus, status, created_at
         FROM custom_training_requests WHERE org_id = ? ORDER BY id DESC LIMIT 20`,
        [orgId]
    );

    const licenses = await db.allAsync(
        `SELECT * FROM organization_licenses WHERE org_id = ? ORDER BY id DESC LIMIT 10`,
        [orgId]
    );

    return {
        org,
        members,
        seats_used: members.filter((m) => m.status === 'active').length,
        seats_limit: Number(org.seat_limit) || 0,
        license_active: isLicenseActive(org),
        stats: scoreStats,
        top_modules: topModules,
        recent_activity: recentActivity,
        custom_training: customRequests,
        licenses,
        plans: catalogPlans()
    };
}

module.exports = {
    ORG_TYPES,
    LICENSE_PLANS,
    catalogPlans,
    isLicenseActive,
    getUserOrgAccess,
    countActiveSeats,
    assertOrgRole,
    createOrganization,
    joinWithInvite,
    activateLicense,
    getOrgAnalytics,
    makeInviteCode,
    expiresAtMonths
};
