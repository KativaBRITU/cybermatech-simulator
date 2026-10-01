/**
 * Learner data export + account purge. Shared by self-service (/profile)
 * and the admin user-delete path. Does not invent new data stores.
 */

async function safeAll(db, sql, params) {
    try {
        return (await db.allAsync(sql, params)) || [];
    } catch (_) {
        return [];
    }
}

async function safeGet(db, sql, params) {
    try {
        return (await db.getAsync(sql, params)) || null;
    } catch (_) {
        return null;
    }
}

async function safeRun(db, sql, params) {
    try {
        await db.runAsync(sql, params);
    } catch (_) {
        /* table may not exist on older DBs */
    }
}

function publicUserRow(row) {
    if (!row) return null;
    const { password, ...rest } = row;
    return {
        ...rest,
        password_is_set: Boolean(password)
    };
}

async function exportUserAccount(db, userId) {
    const id = Number(userId);
    const user = publicUserRow(await safeGet(db, 'SELECT * FROM users WHERE id = ?', [id]));
    if (!user) return null;

    const email = user.email || '';

    const [
        quiz_scores,
        essay_answers,
        daily_progress,
        lab_completions,
        quiz_integrity,
        badges,
        certificates,
        subscriptions,
        organization_members,
        custom_training_requests,
        user_activity,
        user_skill_profile,
        adaptive_quiz_sessions,
        skill_history,
        learning_paths,
        user_feedback,
        feedback,
        darkweb_scans,
        readiness_tokens,
        learner_lab_seeds,
        password_resets,
        email_verifications,
        process_monitor,
        sales_leads
    ] = await Promise.all([
        safeAll(db, 'SELECT * FROM quiz_scores WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM essay_answers WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM daily_progress WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM lab_completions WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM quiz_integrity WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM badges WHERE user_id = ?', [id]),
        safeAll(
            db,
            `SELECT * FROM certificates WHERE user_id = ? OR (user_id IS NULL AND recipient_name = ?)`,
            [id, user.username]
        ),
        safeAll(db, 'SELECT * FROM subscriptions WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM organization_members WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM custom_training_requests WHERE requested_by = ?', [id]),
        safeAll(db, 'SELECT * FROM user_activity WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM user_skill_profile WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM adaptive_quiz_sessions WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM skill_history WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM learning_paths WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM user_feedback WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT * FROM feedback WHERE user_id = ? OR email = ?', [id, email]),
        safeAll(db, 'SELECT * FROM darkweb_scans WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT token, created_at FROM readiness_tokens WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT id, module_id, quality, created_at FROM learner_lab_seeds WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT id, used, expires_at, created_at FROM password_resets WHERE user_id = ?', [id]),
        safeAll(db, 'SELECT id, verified, expires_at, created_at FROM email_verifications WHERE user_id = ?', [id]),
        safeAll(
            db,
            `SELECT id, direction, process_type, method, path, status_code, ip, created_at
             FROM process_monitor WHERE user_id = ? ORDER BY id DESC LIMIT 200`,
            [id]
        ),
        safeAll(db, 'SELECT * FROM sales_leads WHERE email = ?', [email])
    ]);

    return {
        operator: 'TRIBAMS',
        establishment: 'Windhoek, Namibia',
        site: 'https://tribams.com',
        note: 'Password hashes, session secrets, and PayPal card data held by PayPal are not included. Certificates and readiness transcripts that were public remain listed here so you can see what was published.',
        account: user,
        training: {
            quiz_scores,
            essay_answers,
            daily_progress,
            lab_completions,
            quiz_integrity,
            badges,
            certificates,
            user_skill_profile,
            adaptive_quiz_sessions,
            skill_history,
            learning_paths,
            learner_lab_seeds
        },
        payments: { subscriptions },
        organisations: { membership: organization_members, custom_training_requests },
        communications: { user_feedback, feedback, sales_leads },
        security_ops: {
            user_activity,
            process_monitor_recent: process_monitor,
            darkweb_scans_training_sim: darkweb_scans,
            password_resets,
            email_verifications,
            readiness_tokens
        }
    };
}

async function purgeUserAccount(db, target, { removeStoredProfileFile } = {}) {
    const userId = Number(target.id);
    const username = target.username;
    const email = target.email;

    const relatedDeletes = [
        ['DELETE FROM organization_members WHERE user_id = ?', [userId]],
        ['DELETE FROM subscriptions WHERE user_id = ?', [userId]],
        ['DELETE FROM password_resets WHERE user_id = ?', [userId]],
        ['DELETE FROM email_verifications WHERE user_id = ?', [userId]],
        ['DELETE FROM quiz_scores WHERE user_id = ?', [userId]],
        ['DELETE FROM quiz_integrity WHERE user_id = ?', [userId]],
        ['DELETE FROM lab_completions WHERE user_id = ?', [userId]],
        ['DELETE FROM badges WHERE user_id = ?', [userId]],
        ['DELETE FROM essay_answers WHERE user_id = ?', [userId]],
        ['DELETE FROM daily_progress WHERE user_id = ?', [userId]],
        ['DELETE FROM user_activity WHERE user_id = ?', [userId]],
        ['DELETE FROM user_skill_profile WHERE user_id = ?', [userId]],
        ['DELETE FROM adaptive_quiz_sessions WHERE user_id = ?', [userId]],
        ['DELETE FROM skill_history WHERE user_id = ?', [userId]],
        ['DELETE FROM learning_paths WHERE user_id = ?', [userId]],
        ['DELETE FROM user_feedback WHERE user_id = ?', [userId]],
        ['DELETE FROM feedback WHERE user_id = ?', [userId]],
        ['DELETE FROM darkweb_scans WHERE user_id = ?', [userId]],
        ['DELETE FROM readiness_tokens WHERE user_id = ?', [userId]],
        ['DELETE FROM learner_lab_seeds WHERE user_id = ?', [userId]],
        ['DELETE FROM process_monitor WHERE user_id = ?', [userId]],
        ['UPDATE license_keys SET used_by = NULL WHERE used_by = ?', [userId]],
        ['UPDATE custom_training_requests SET requested_by = NULL WHERE requested_by = ?', [userId]]
    ];

    for (const [sql, params] of relatedDeletes) {
        await safeRun(db, sql, params);
    }

    await safeRun(
        db,
        `DELETE FROM certificates WHERE user_id = ? OR (user_id IS NULL AND recipient_name = ?)`,
        [userId, username]
    );

    if (email) {
        await safeRun(db, 'DELETE FROM sales_leads WHERE email = ?', [email]);
        await safeRun(db, 'DELETE FROM feedback WHERE email = ?', [email]);
        await safeRun(db, 'DELETE FROM leads WHERE email = ?', [email]);
    }

    try {
        const owned = await db.allAsync(
            `SELECT o.id FROM organizations o WHERE o.created_by = ?`,
            [userId]
        );
        for (const org of owned || []) {
            const seats = await db.getAsync(
                `SELECT COUNT(*) AS c FROM organization_members WHERE org_id = ? AND status = 'active'`,
                [org.id]
            );
            if (Number(seats?.c || 0) === 0) {
                await safeRun(db, 'DELETE FROM custom_training_requests WHERE org_id = ?', [org.id]);
                await safeRun(db, 'DELETE FROM organization_licenses WHERE org_id = ?', [org.id]);
                await safeRun(db, 'DELETE FROM organizations WHERE id = ?', [org.id]);
            } else {
                await safeRun(db, `UPDATE organizations SET created_by = NULL WHERE id = ?`, [org.id]);
            }
        }
    } catch (_) { /* org tables optional */ }

    await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);
    if (typeof removeStoredProfileFile === 'function') {
        await removeStoredProfileFile(target.profile_picture);
    }
}

module.exports = {
    exportUserAccount,
    purgeUserAccount
};
