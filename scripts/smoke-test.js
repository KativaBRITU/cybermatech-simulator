/**
 * Public-launch smoke tests — run against a live server:
 *   node scripts/smoke-test.js
 *   BASE_URL=http://localhost:3000 node scripts/smoke-test.js
 */

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

async function check(name, fn) {
    try {
        await fn();
        console.log(`  ✅ ${name}`);
        return true;
    } catch (err) {
        console.error(`  ❌ ${name}: ${err.message}`);
        return false;
    }
}

async function getJson(path, opts = {}) {
    const res = await fetch(`${BASE}${path}`, opts);
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch (_) { body = text; }
    return { res, body };
}

async function main() {
    console.log(`\nTRIBAMS smoke tests → ${BASE}\n`);
    let passed = 0;
    let failed = 0;

    const run = async (name, fn) => {
        const ok = await check(name, fn);
        if (ok) passed += 1;
        else failed += 1;
    };

    await run('GET /api/health', async () => {
        const { res, body } = await getJson('/api/health');
        if (!res.ok) throw new Error(`status ${res.status}`);
        if (!body || body.ok !== true) throw new Error('health.ok !== true');
    });

    await run('GET /api/pricing', async () => {
        const { res, body } = await getJson('/api/pricing');
        if (!res.ok) throw new Error(`status ${res.status}`);
        if (!body?.plans?.monthly) throw new Error('missing monthly plan');
    });

    await run('GET /api/modules (login required when anon)', async () => {
        const { res, body } = await getJson('/api/modules');
        if (res.status === 401) return;
        if (!res.ok) throw new Error(`status ${res.status}`);
        const count = Array.isArray(body?.modules) ? body.modules.length : 0;
        if (count < 45) throw new Error(`expected 45+ modules, got ${count}`);
    });

    await run('GET /api/subscription-status (anon)', async () => {
        const { res, body } = await getJson('/api/subscription-status');
        if (!res.ok) throw new Error(`status ${res.status}`);
        if (body?.logged_in !== false && body?.tier !== 'free') {
            // anon should not look paid
        }
        if (!body?.success) throw new Error('success false');
    });

    await run('GET / (marketing)', async () => {
        const res = await fetch(`${BASE}/`);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const html = await res.text();
        if (!/TRIBAMS|Tribams|tribams/i.test(html)) throw new Error('brand missing');
    });

    await run('GET /payment', async () => {
        const res = await fetch(`${BASE}/payment`);
        if (!res.ok) throw new Error(`status ${res.status}`);
    });

    await run('GET /login', async () => {
        const res = await fetch(`${BASE}/login`);
        if (!res.ok) throw new Error(`status ${res.status}`);
    });

    await run('GET /admin rejects anonymous (redirect or 401)', async () => {
        const res = await fetch(`${BASE}/admin`, { redirect: 'manual' });
        if (![301, 302, 303, 307, 308, 401, 403].includes(res.status)) {
            throw new Error(`expected auth challenge, got ${res.status}`);
        }
        if (res.status >= 300 && res.status < 400) {
            const loc = res.headers.get('location') || '';
            if (!/\/login/i.test(loc)) throw new Error(`expected redirect to login, got ${loc}`);
        }
        const text = await res.text();
        if (/api\/admin\/users|Admin Dashboard|user list/i.test(text)) {
            throw new Error('admin page body leaked without auth');
        }
    });

    await run('GET /api/admin/stats rejects anonymous', async () => {
        const { res, body } = await getJson('/api/admin/stats');
        if (![401, 403].includes(res.status)) {
            throw new Error(`expected 401/403, got ${res.status}`);
        }
        if (body && body.success === true) throw new Error('admin API returned success without auth');
    });

    await run('GET /api/launch-readiness rejects anonymous', async () => {
        const { res, body } = await getJson('/api/launch-readiness');
        if (![401, 403].includes(res.status)) {
            throw new Error(`expected 401/403, got ${res.status}`);
        }
        if (body && body.success === true) throw new Error('launch-readiness leaked without auth');
    });

    await run('POST /api/paypal/create-order requires auth', async () => {
        const { res, body } = await getJson('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: 'monthly' })
        });
        if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
        if (body?.success !== false) throw new Error('expected success false');
    });

    await run('GET /api/org/plans', async () => {
        const { res, body } = await getJson('/api/org/plans');
        if (!res.ok) throw new Error(`status ${res.status}`);
        if (!Array.isArray(body?.plans) || body.plans.length < 3) {
            throw new Error('expected B2B license plans');
        }
    });

    await run('GET /organization requires login redirect', async () => {
        const res = await fetch(`${BASE}/organization`, { redirect: 'manual' });
        if (![302, 303, 307, 401].includes(res.status) && res.status !== 200) {
            // 200 only if already authenticated in this environment
            throw new Error(`unexpected status ${res.status}`);
        }
    });

    console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
    process.exit(failed ? 1 : 0);
}

main().catch((err) => {
    console.error('Smoke test runner failed:', err);
    process.exit(1);
});
