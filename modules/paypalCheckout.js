/**
 * Live PayPal Orders (create + capture) for TRIBAMS subscriptions.
 * List and charge currency is USD.
 */

const paypal = require('@paypal/checkout-server-sdk');
const pricingCatalog = require('./pricingCatalog');

const PLAN_META = {
    monthly: { tier: 'pro', months: 1, label: 'TRIBAMS Pro Monthly' },
    annual: { tier: 'pro', months: 12, label: 'TRIBAMS Pro Annual' },
    pro_plus_2mo: { tier: 'pro_plus', months: 2, label: 'TRIBAMS Pro+ (2 months)' },
    pro_plus_annual: { tier: 'pro_plus', months: 12, label: 'TRIBAMS Pro+ Annual' },
    // Priced above Pro+ — unlocks Special Ops Live Red/Blue modules (96–97)
    special_ops_2mo: { tier: 'special_ops', months: 2, label: 'TRIBAMS Special Ops Elite (2 months)' },
    special_ops_annual: { tier: 'special_ops', months: 12, label: 'TRIBAMS Special Ops Elite Annual' }
};

function isConfigured() {
    return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

function isLiveMode() {
    const mode = String(process.env.PAYPAL_MODE || '').toLowerCase();
    if (mode === 'live' || mode === 'production') return true;
    if (mode === 'sandbox') return false;
    return process.env.NODE_ENV === 'production';
}

function getClient() {
    if (!isConfigured()) return null;
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const env = isLiveMode()
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    return new paypal.core.PayPalHttpClient(env);
}

function getPricingSnapshot() {
    const snap = pricingCatalog.snapshot();
    const c = snap.consumer;
    return {
        nadPerUsd: snap.nad_per_usd,
        currency: process.env.PAYPAL_CURRENCY || 'USD',
        plans: {
            monthly: { nad: c.monthly.nad, usd: c.monthly.usd, totalNad: c.monthly.nad, totalUsd: c.monthly.usd },
            annual: {
                nad: c.annual.nad,
                usd: c.annual.yearly_total_usd,
                totalNad: c.annual.yearly_total_nad,
                totalUsd: c.annual.yearly_total_usd
            },
            pro_plus_2mo: {
                nad: c.pro_plus_2mo.nad,
                usd: c.pro_plus_2mo.usd,
                totalNad: c.pro_plus_2mo.nad,
                totalUsd: c.pro_plus_2mo.usd
            },
            pro_plus_annual: {
                nad: c.pro_plus_annual.nad,
                usd: c.pro_plus_annual.yearly_total_usd,
                totalNad: c.pro_plus_annual.yearly_total_nad,
                totalUsd: c.pro_plus_annual.yearly_total_usd
            },
            special_ops_2mo: {
                nad: c.special_ops_2mo.nad,
                usd: c.special_ops_2mo.usd,
                totalNad: c.special_ops_2mo.nad,
                totalUsd: c.special_ops_2mo.usd
            },
            special_ops_annual: {
                nad: c.special_ops_annual.nad,
                usd: c.special_ops_annual.yearly_total_usd,
                totalNad: c.special_ops_annual.yearly_total_nad,
                totalUsd: c.special_ops_annual.yearly_total_usd
            }
        }
    };
}

function resolvePlan(planKey) {
    const meta = PLAN_META[planKey];
    if (!meta) return null;
    const pricing = getPricingSnapshot();
    const amounts = pricing.plans[planKey];
    if (!amounts) return null;
    return {
        key: planKey,
        ...meta,
        nad: amounts.totalNad,
        usd: amounts.usd,
        currency: pricing.currency
    };
}

function appBaseUrl() {
    return (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
}

function expiresAtIso(months) {
    const d = new Date();
    d.setMonth(d.getMonth() + Number(months || 1));
    return d.toISOString();
}

async function createOrder({ planKey, userId, username }) {
    const client = getClient();
    const plan = resolvePlan(planKey);
    if (!client || !plan) {
        const err = new Error(!client ? 'PayPal is not configured' : 'Unknown plan');
        err.code = !client ? 'NOT_CONFIGURED' : 'UNKNOWN_PLAN';
        throw err;
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                reference_id: `${planKey}_${userId}`,
                description: plan.label.slice(0, 127),
                custom_id: `u${userId}:${planKey}`,
                soft_descriptor: 'TRIBAMS',
                amount: {
                    currency_code: plan.currency,
                    value: plan.usd.toFixed(2)
                }
            }
        ],
        application_context: {
            brand_name: 'TRIBAMS',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            shipping_preference: 'NO_SHIPPING',
            return_url: `${appBaseUrl()}/payment?paypal=return`,
            cancel_url: `${appBaseUrl()}/payment-cancel`
        }
    });

    const order = await client.execute(request);
    const result = order.result;
    const approve = (result.links || []).find((l) => l.rel === 'approve');

    return {
        orderId: result.id,
        status: result.status,
        approvalUrl: approve ? approve.href : null,
        plan,
        payerHint: username || null
    };
}

async function captureOrder(orderId) {
    const client = getClient();
    if (!client) {
        const err = new Error('PayPal is not configured');
        err.code = 'NOT_CONFIGURED';
        throw err;
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await client.execute(request);
    const result = capture.result;
    const unit = (result.purchase_units || [])[0] || {};
    const payments = unit.payments || {};
    const captures = payments.captures || [];
    const firstCapture = captures[0] || {};
    const customId = String(unit.custom_id || '');
    const match = customId.match(/^u(\d+):([a-z0-9_]+)$/i);

    return {
        orderId: result.id,
        status: result.status,
        captureId: firstCapture.id || null,
        captureStatus: firstCapture.status || null,
        amount: firstCapture.amount || unit.amount || null,
        customId,
        userId: match ? parseInt(match[1], 10) : null,
        planKey: match ? match[2] : null,
        payerEmail: result.payer?.email_address || null
    };
}

module.exports = {
    PLAN_META,
    isConfigured,
    isLiveMode,
    getPricingSnapshot,
    resolvePlan,
    expiresAtIso,
    createOrder,
    captureOrder,
    appBaseUrl
};
