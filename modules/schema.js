/**
 * Dialect-aware schema bootstrap for TRIBAMS (SQLite + PostgreSQL).
 */

async function addColumnIfMissing(db, table, column, definition) {
    try {
        if (db.dialect === 'postgres') {
            await db.runAsync(
                `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${definition}`
            );
        } else {
            await db.runAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        }
    } catch (e) {
        // Column already exists (SQLite) or other benign race
    }
}

function pkAuto(db) {
    return db.dialect === 'postgres'
        ? 'SERIAL PRIMARY KEY'
        : 'INTEGER PRIMARY KEY AUTOINCREMENT';
}

function tsDefault(db) {
    return db.dialect === 'postgres'
        ? 'TIMESTAMP DEFAULT NOW()'
        : 'DATETIME DEFAULT CURRENT_TIMESTAMP';
}

function textType() {
    return 'TEXT';
}

async function initSchema(db) {
    console.log('📦 Creating database tables...');

    if (db.dialect === 'sqlite') {
        await db.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    }

    const PK = pkAuto(db);
    const TS = tsDefault(db);
    const T = textType();

    await db.runAsync(`CREATE TABLE IF NOT EXISTS users (
        id ${PK},
        username ${T} UNIQUE,
        email ${T} UNIQUE,
        password ${T},
        profile_picture ${T},
        status ${T} DEFAULT 'active',
        subscription_tier ${T} DEFAULT 'free',
        subscription_status ${T} DEFAULT 'inactive',
        subscription_expires_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        daily_streak INTEGER DEFAULT 0,
        last_daily_attempt DATE,
        created_at ${TS},
        last_active ${TS}
    )`);

    await addColumnIfMissing(db, 'users', 'status', `${T} DEFAULT 'active'`);
    await addColumnIfMissing(db, 'users', 'is_beta_tester', 'INTEGER DEFAULT 0');

    await db.runAsync(`CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY,
        name ${T},
        icon_key ${T},
        description ${T},
        difficulty ${T} DEFAULT 'intermediate',
        category ${T}
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS module_contents (
        id ${PK},
        module_id INTEGER,
        content ${T},
        resources ${T},
        essay_questions ${T},
        created_at ${TS},
        updated_at ${TS},
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    // Quarterly content refresh columns (soft migrate)
    await addColumnIfMissing(db, 'module_contents', 'quiz_bank', T);
    await addColumnIfMissing(db, 'module_contents', 'practice_bank', T);
    await addColumnIfMissing(
        db,
        'module_contents',
        'content_refreshed_at',
        db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'
    );
    await addColumnIfMissing(db, 'module_contents', 'refresh_generation', 'INTEGER DEFAULT 0');

    await db.runAsync(`CREATE TABLE IF NOT EXISTS essay_answers (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        question_index INTEGER,
        answer ${T},
        score INTEGER DEFAULT 0,
        relevant INTEGER DEFAULT 0,
        submitted_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        UNIQUE(user_id, module_id, question_index),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Soft-migrate essay scoring columns (SQLite ignores if already present)
    for (const col of ['score INTEGER DEFAULT 0', 'relevant INTEGER DEFAULT 0']) {
        try {
            await db.runAsync(`ALTER TABLE essay_answers ADD COLUMN ${col}`);
        } catch (_) { /* already exists */ }
    }

    await db.runAsync(`CREATE TABLE IF NOT EXISTS learner_lab_seeds (
        id ${PK},
        module_id INTEGER,
        user_id INTEGER,
        seed_json ${T},
        quality INTEGER DEFAULT 0,
        created_at ${TS},
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS quiz_scores (
        id ${PK},
        user_id INTEGER,
        module_name ${T},
        score INTEGER,
        time_taken INTEGER DEFAULT 0,
        total_time_limit INTEGER DEFAULT 0,
        difficulty ${T} DEFAULT 'medium',
        completed_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS daily_progress (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        day_number INTEGER,
        attempted INTEGER DEFAULT 0,
        correct INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        completed_at ${TS},
        UNIQUE(user_id, module_id, day_number),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS certificates (
        id ${PK},
        certificate_id ${T} UNIQUE,
        recipient_name ${T},
        module_name ${T},
        score INTEGER,
        issue_date ${TS},
        verified INTEGER DEFAULT 1,
        downloaded INTEGER DEFAULT 0
    )`);
    await addColumnIfMissing(db, 'certificates', 'user_id', 'INTEGER');
    try {
        if (db.dialect === 'postgres') {
            await db.runAsync(`
                UPDATE certificates c
                SET user_id = u.id
                FROM users u
                WHERE c.user_id IS NULL AND u.username = c.recipient_name
            `);
        } else {
            await db.runAsync(`
                UPDATE certificates
                SET user_id = (SELECT id FROM users WHERE username = certificates.recipient_name)
                WHERE user_id IS NULL
            `);
        }
    } catch (e) {
        console.warn('Certificate user_id backfill skipped:', e.message);
    }

    await db.runAsync(`CREATE TABLE IF NOT EXISTS badges (
        id ${PK},
        user_id INTEGER,
        badge_name ${T},
        badge_icon ${T},
        earned_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS password_resets (
        id ${PK},
        user_id INTEGER,
        token ${T} UNIQUE,
        used INTEGER DEFAULT 0,
        expires_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS feedback (
        id ${PK},
        user_id INTEGER,
        username ${T},
        type ${T},
        message ${T},
        rating INTEGER DEFAULT 0,
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS darkweb_scans (
        id ${PK},
        user_id INTEGER,
        email ${T},
        compromised INTEGER,
        breaches ${T},
        scan_date ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS subscriptions (
        id ${PK},
        user_id INTEGER,
        paypal_order_id ${T},
        tier ${T},
        status ${T},
        amount INTEGER,
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await addColumnIfMissing(db, 'users', 'subscription_expires_at', db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME');
    await addColumnIfMissing(db, 'subscriptions', 'plan', T);
    await addColumnIfMissing(db, 'subscriptions', 'currency', T);
    await addColumnIfMissing(db, 'subscriptions', 'paypal_capture_id', T);
    await addColumnIfMissing(db, 'subscriptions', 'expires_at', db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME');
    await addColumnIfMissing(db, 'subscriptions', 'amount_usd', T);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS custom_labs (
        id ${PK},
        module_name ${T} UNIQUE,
        icon ${T},
        description ${T},
        difficulty ${T} DEFAULT 'intermediate',
        questions ${T},
        active INTEGER DEFAULT 1,
        created_at ${TS}
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS daily_scenarios (
        id ${PK},
        module_id INTEGER,
        day_number INTEGER,
        question ${T},
        options ${T},
        correct_answer INTEGER,
        explanation ${T},
        category ${T},
        difficulty ${T} DEFAULT 'intermediate',
        UNIQUE(module_id, day_number),
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS leads (
        id ${PK},
        email ${T} UNIQUE,
        score ${T},
        created_at ${TS}
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS email_verifications (
        id ${PK},
        user_id INTEGER,
        token ${T} UNIQUE,
        verified INTEGER DEFAULT 0,
        expires_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS user_activity (
        id ${PK},
        user_id INTEGER,
        activity_type ${T},
        module_id INTEGER,
        details ${T},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS process_monitor (
        id ${PK},
        direction ${T} NOT NULL,
        process_type ${T},
        method ${T},
        path ${T},
        status_code INTEGER,
        ip ${T},
        user_id INTEGER,
        username ${T},
        details ${T},
        created_at ${TS}
    )`);
    await db.runAsync(
        `CREATE INDEX IF NOT EXISTS idx_process_monitor_created ON process_monitor(created_at DESC)`
    );

    await db.runAsync(`CREATE TABLE IF NOT EXISTS quiz_integrity (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        module_name ${T},
        score INTEGER,
        focus_losses INTEGER DEFAULT 0,
        hidden_ms INTEGER DEFAULT 0,
        time_taken INTEGER DEFAULT 0,
        risk_score INTEGER DEFAULT 0,
        status ${T},
        flags ${T},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS user_skill_profile (
        user_id INTEGER PRIMARY KEY,
        overall_level ${T} DEFAULT 'beginner',
        overall_score INTEGER DEFAULT 0,
        modules_completed INTEGER DEFAULT 0,
        total_attempts INTEGER DEFAULT 0,
        average_score INTEGER DEFAULT 0,
        skill_breakdown ${T},
        weak_areas ${T},
        strong_areas ${T},
        learning_style ${T} DEFAULT 'visual',
        xp_total INTEGER DEFAULT 0,
        last_assessment ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        created_at ${TS},
        updated_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS adaptive_quiz_sessions (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        difficulty_used ${T},
        questions_attempted INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        adaptive_data ${T},
        completed_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS skill_history (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        skill_score INTEGER DEFAULT 0,
        event_type ${T},
        event_data ${T},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS learning_paths (
        id ${PK},
        user_id INTEGER,
        path_type ${T} DEFAULT 'recommended',
        path_data ${T},
        current_step INTEGER DEFAULT 0,
        status ${T} DEFAULT 'active',
        started_at ${TS},
        completed_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS question_bank (
        id ${PK},
        module_id INTEGER,
        difficulty ${T} DEFAULT 'intermediate',
        question_text ${T},
        options ${T},
        correct_answer INTEGER,
        explanation ${T},
        time_expected INTEGER DEFAULT 30,
        weight INTEGER DEFAULT 1,
        topic ${T},
        created_at ${TS},
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS user_feedback (
        id ${PK},
        user_id INTEGER,
        module_id INTEGER,
        feedback_type ${T},
        difficulty_suggested ${T},
        comments ${T},
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    )`);

    // Evidence Workbench lab completions
    await db.runAsync(`CREATE TABLE IF NOT EXISTS lab_completions (
        id ${PK},
        user_id INTEGER,
        lab_id ${T},
        module_id INTEGER,
        score INTEGER,
        earned INTEGER DEFAULT 0,
        max_points INTEGER DEFAULT 0,
        attack_techniques ${T},
        passed INTEGER DEFAULT 0,
        completed_at ${TS},
        UNIQUE(user_id, lab_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    await addColumnIfMissing(db, 'lab_completions', 'content_hash', T);
    await addColumnIfMissing(db, 'lab_completions', 'lab_generation', 'INTEGER DEFAULT 1');
    await db.runAsync(`CREATE TABLE IF NOT EXISTS lab_module_generations (
        module_id INTEGER PRIMARY KEY,
        generation INTEGER DEFAULT 1,
        lab_hashes ${T},
        updated_at ${TS}
    )`);

    // Public Force Readiness transcript tokens
    await db.runAsync(`CREATE TABLE IF NOT EXISTS readiness_tokens (
        id ${PK},
        user_id INTEGER UNIQUE,
        token ${T} UNIQUE,
        created_at ${TS},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // B2B organizations (institutions, government, enterprises)
    await db.runAsync(`CREATE TABLE IF NOT EXISTS organizations (
        id ${PK},
        name ${T} NOT NULL,
        slug ${T} UNIQUE,
        org_type ${T} DEFAULT 'enterprise',
        industry ${T},
        country ${T} DEFAULT 'NA',
        contact_email ${T},
        seat_limit INTEGER DEFAULT 10,
        license_tier ${T} DEFAULT 'free',
        license_status ${T} DEFAULT 'inactive',
        license_expires_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        invite_code ${T} UNIQUE,
        created_by INTEGER,
        notes ${T},
        created_at ${TS},
        updated_at ${TS},
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS organization_members (
        id ${PK},
        org_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role ${T} DEFAULT 'member',
        status ${T} DEFAULT 'active',
        joined_at ${TS},
        UNIQUE(org_id, user_id),
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS organization_licenses (
        id ${PK},
        org_id INTEGER NOT NULL,
        plan ${T},
        seats INTEGER DEFAULT 0,
        amount_nad INTEGER DEFAULT 0,
        status ${T} DEFAULT 'pending',
        starts_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        expires_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'},
        notes ${T},
        created_at ${TS},
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE
    )`);
    await addColumnIfMissing(db, 'organization_licenses', 'amount_usd', T);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS sales_leads (
        id ${PK},
        name ${T},
        email ${T},
        company ${T},
        role ${T},
        seats INTEGER,
        country ${T},
        message ${T},
        source ${T} DEFAULT 'teams',
        status ${T} DEFAULT 'new',
        created_at ${TS}
    )`);
    await addColumnIfMissing(db, 'feedback', 'email', T);
    await addColumnIfMissing(db, 'feedback', 'company', T);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS custom_training_requests (
        id ${PK},
        org_id INTEGER NOT NULL,
        requested_by INTEGER,
        title ${T},
        industry_focus ${T},
        compliance_focus ${T},
        module_ids ${T},
        brief ${T},
        status ${T} DEFAULT 'pending',
        admin_notes ${T},
        created_at ${TS},
        updated_at ${TS},
        FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL
    )`);

    await db.runAsync(
        `CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id)`
    );

    await db.runAsync(`CREATE TABLE IF NOT EXISTS license_keys (
        id ${PK},
        code ${T} UNIQUE,
        plan ${T},
        status ${T} DEFAULT 'unused',
        created_by INTEGER,
        used_by INTEGER,
        note ${T},
        created_at ${TS},
        used_at ${db.dialect === 'postgres' ? 'TIMESTAMP' : 'DATETIME'}
    )`);

    await db.runAsync(`CREATE TABLE IF NOT EXISTS news_posts (
        id ${PK},
        title ${T} NOT NULL,
        summary ${T},
        body ${T},
        kind ${T} DEFAULT 'update',
        image_url ${T},
        published INTEGER DEFAULT 0,
        pinned INTEGER DEFAULT 0,
        author ${T},
        created_at ${TS},
        updated_at ${TS}
    )`);

    console.log('✅ Database tables created');
}

module.exports = { initSchema };
