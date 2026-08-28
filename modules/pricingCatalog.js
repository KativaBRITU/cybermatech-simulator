/**
 * Single commercial catalog — USD is the list and checkout currency.
 * NAD is a Namibia display reference only (FX from NAD_PER_USD).
 * Existing PRICE_*_NAD env vars still work: they convert into USD if PRICE_*_USD is unset.
 */

const FX = Number(process.env.NAD_PER_USD) || 18.5;

const USD_DEFAULTS = {
    monthly: 24,
    annualMonthly: 16,
    proPlus2mo: 45,
    proPlusAnnualMonthly: 19,
    specialOps2mo: 68,
    specialOpsAnnualMonthly: 29,
    sme: 350,
    institution: 990,
    enterprise: 2490,
    custom: 650
};

function num(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function usdFromNad(nad) {
    return Number((Number(nad) / FX).toFixed(2));
}

function nadFromUsd(usd) {
    return Math.round(Number(usd) * FX);
}

function usdPrice(usdEnv, nadEnv, usdDefault) {
    if (process.env[usdEnv] != null && process.env[usdEnv] !== '') {
        return num(process.env[usdEnv], usdDefault);
    }
    if (process.env[nadEnv] != null && process.env[nadEnv] !== '') {
        return usdFromNad(process.env[nadEnv]);
    }
    return usdDefault;
}

function snapshot() {
    const monthly = usdPrice('PRICE_MONTHLY_USD', 'PRICE_MONTHLY_NAD', USD_DEFAULTS.monthly);
    const annualMonthly = usdPrice(
        'PRICE_ANNUAL_MONTHLY_USD',
        'PRICE_ANNUAL_MONTHLY_NAD',
        USD_DEFAULTS.annualMonthly
    );
    const proPlus2mo = usdPrice('PRICE_PRO_PLUS_2MO_USD', 'PRICE_PRO_PLUS_2MO_NAD', USD_DEFAULTS.proPlus2mo);
    const proPlusAnnualMonthly = usdPrice(
        'PRICE_PRO_PLUS_ANNUAL_MONTHLY_USD',
        'PRICE_PRO_PLUS_ANNUAL_MONTHLY_NAD',
        USD_DEFAULTS.proPlusAnnualMonthly
    );
    const specialOps2mo = usdPrice(
        'PRICE_SPECIAL_OPS_2MO_USD',
        'PRICE_SPECIAL_OPS_2MO_NAD',
        USD_DEFAULTS.specialOps2mo
    );
    const specialOpsAnnualMonthly = usdPrice(
        'PRICE_SPECIAL_OPS_ANNUAL_MONTHLY_USD',
        'PRICE_SPECIAL_OPS_ANNUAL_MONTHLY_NAD',
        USD_DEFAULTS.specialOpsAnnualMonthly
    );
    const sme = usdPrice('PRICE_LICENSE_SME_USD', 'PRICE_LICENSE_SME_NAD', USD_DEFAULTS.sme);
    const institution = usdPrice(
        'PRICE_LICENSE_INSTITUTION_USD',
        'PRICE_LICENSE_INSTITUTION_NAD',
        USD_DEFAULTS.institution
    );
    const enterprise = usdPrice(
        'PRICE_LICENSE_ENTERPRISE_USD',
        'PRICE_LICENSE_ENTERPRISE_NAD',
        USD_DEFAULTS.enterprise
    );
    const custom = usdPrice('PRICE_CUSTOM_TRAINING_USD', 'PRICE_CUSTOM_TRAINING_NAD', USD_DEFAULTS.custom);

    const annualTotal = Number((annualMonthly * 12).toFixed(2));
    const proPlusAnnualTotal = Number((proPlusAnnualMonthly * 12).toFixed(2));
    const specialOpsAnnualTotal = Number((specialOpsAnnualMonthly * 12).toFixed(2));

    return {
        currency: 'USD',
        symbol: 'US$',
        nad_per_usd: FX,
        consumer: {
            monthly: { usd: monthly, nad: nadFromUsd(monthly), period: 'month' },
            annual: {
                usd: annualMonthly,
                nad: nadFromUsd(annualMonthly),
                period: 'month',
                months: 12,
                yearly_total_usd: annualTotal,
                yearly_total_nad: nadFromUsd(annualTotal),
                save_vs_monthly_usd: Number(((monthly - annualMonthly) * 12).toFixed(2))
            },
            pro_plus_2mo: { usd: proPlus2mo, nad: nadFromUsd(proPlus2mo), period: '2 months', months: 2 },
            pro_plus_annual: {
                usd: proPlusAnnualMonthly,
                nad: nadFromUsd(proPlusAnnualMonthly),
                period: 'month',
                months: 12,
                yearly_total_usd: proPlusAnnualTotal,
                yearly_total_nad: nadFromUsd(proPlusAnnualTotal)
            },
            special_ops_2mo: { usd: specialOps2mo, nad: nadFromUsd(specialOps2mo), period: '2 months', months: 2 },
            special_ops_annual: {
                usd: specialOpsAnnualMonthly,
                nad: nadFromUsd(specialOpsAnnualMonthly),
                period: 'month',
                months: 12,
                yearly_total_usd: specialOpsAnnualTotal,
                yearly_total_nad: nadFromUsd(specialOpsAnnualTotal)
            }
        },
        b2b: {
            sme_pack: {
                key: 'sme_pack',
                label: 'SME Team Pack',
                seats: 15,
                months: 12,
                tier: 'pro',
                usd: sme,
                nad: nadFromUsd(sme),
                description: 'Small teams — 15 seats, Pro catalog, annual license. Global + regional drills included.'
            },
            institution_annual: {
                key: 'institution_annual',
                label: 'Institution Annual License',
                seats: 50,
                months: 12,
                tier: 'pro',
                usd: institution,
                nad: nadFromUsd(institution),
                description: 'Schools and training centres — 50 seats, Pro catalog, yearly renewal.'
            },
            enterprise_license: {
                key: 'enterprise_license',
                label: 'Enterprise License',
                seats: 200,
                months: 12,
                tier: 'pro_plus',
                usd: enterprise,
                nad: nadFromUsd(enterprise),
                description: 'Large orgs and government — 200 seats, Pro+ catalog, roster analytics, custom requests.'
            },
            custom_training: {
                key: 'custom_training',
                label: 'Customized Training Package',
                seats: 25,
                months: 6,
                tier: 'pro_plus',
                usd: custom,
                nad: nadFromUsd(custom),
                description: 'Bespoke industry scenarios (any region) + delivery support. 25 seats, 6 months.'
            }
        }
    };
}

function b2bPlans() {
    return Object.values(snapshot().b2b);
}

function getB2bPlan(key) {
    return snapshot().b2b[key] || null;
}

module.exports = {
    FX,
    snapshot,
    b2bPlans,
    getB2bPlan,
    nadFromUsd,
    usdFromNad
};
