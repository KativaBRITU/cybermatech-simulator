const fs = require('fs');
const p = require('path').join(__dirname, '..', 'views', 'payment.html');
let h = fs.readFileSync(p, 'utf8');

const start = h.indexOf('        <!-- Plans Grid -->');
const end = h.indexOf('        <!-- Features Comparison -->');
if (start < 0 || end < 0) {
    console.error('plan markers missing', start, end);
    process.exit(1);
}

const insert = `        <!-- Plans Grid -->
        <div class="plans-grid">

            <div class="plan-card">
                <div class="plan-header">
                    <div class="plan-icon">🎓</div>
                    <div class="plan-name">Free</div>
                    <div class="plan-price" data-plan="free">
                        <span class="currency">N$</span><span class="amount">0</span>
                        <span class="period">/month</span>
                    </div>
                    <div class="plan-desc">Start the path</div>
                </div>
                <ul class="plan-features">
                    <li><span class="check">✓</span> <span class="feature-text">3 starter modules</span></li>
                    <li><span class="check">✓</span> <span class="feature-text">Practice + Matte K (outside exams)</span></li>
                    <li class="disabled"><span class="cross">✕</span> <span class="feature-text">Core 45 catalog</span></li>
                    <li class="disabled"><span class="cross">✕</span> <span class="feature-text">Attacker-toolkit modules</span></li>
                </ul>
                <button class="btn-plan secondary" disabled>Current Plan</button>
            </div>

            <div class="plan-card">
                <div class="plan-header">
                    <div class="plan-icon">⭐</div>
                    <div class="plan-name">Pro Monthly</div>
                    <div class="plan-price" data-plan="monthly">
                        <span class="currency">N$</span><span class="amount">450</span>
                        <span class="period">/month</span>
                    </div>
                    <div class="plan-desc">45 core defensive modules</div>
                </div>
                <ul class="plan-features">
                    <li><span class="feature-icon">✅</span> <span class="feature-text">45 core modules</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Certificates + Cyber Range</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Matte K coaching</span></li>
                    <li class="disabled"><span class="cross">✕</span> <span class="feature-text">Pro+ attacker toolkit (46–95)</span></li>
                </ul>
                <button class="btn-plan primary" id="monthlyBtn" onclick="createOrder('monthly')">
                    <span class="btn-text">Subscribe with PayPal</span>
                    <span class="spinner"></span>
                </button>
            </div>

            <div class="plan-card popular">
                <div class="plan-header">
                    <div class="plan-icon">🚀</div>
                    <div class="plan-name">Pro Annual</div>
                    <div class="plan-price" data-plan="annual">
                        <span class="currency">N$</span><span class="amount">299</span>
                        <span class="period">/month</span>
                    </div>
                    <div class="plan-desc">Best Pro value — commit yearly</div>
                    <div class="savings-badge" id="savingsBadge">💎 Save vs N$450/mo</div>
                </div>
                <ul class="plan-features">
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Everything in Pro Monthly</span></li>
                    <li><span class="feature-icon">💎</span> <span class="feature-text highlight-text" id="annualTotalNote">N$299/mo × 12</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Priority support</span></li>
                    <li class="disabled"><span class="cross">✕</span> <span class="feature-text">Full 95-module Pro+ catalog</span></li>
                </ul>
                <button class="btn-plan primary" id="annualBtn" onclick="createOrder('annual')">
                    <span class="btn-text">Get Annual Pro</span>
                    <span class="spinner"></span>
                </button>
            </div>

            <div class="plan-card pro-plus" id="planProPlus">
                <div class="plan-header">
                    <div class="plan-icon">⚔️</div>
                    <div class="plan-name">Pro+</div>
                    <div class="plan-price" data-plan="pro_plus_2mo">
                        <span class="currency">N$</span><span class="amount">800</span>
                        <span class="period">/2 months</span>
                    </div>
                    <div class="plan-desc">95 modules — know how attackers move &amp; talk</div>
                    <div class="savings-badge">Nmap · Metasploit · Mimikatz · C2</div>
                </div>
                <ul class="plan-features">
                    <li><span class="feature-icon">✅</span> <span class="feature-text">All 95 modules</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Attacker-toolkit labs (46–95)</span></li>
                    <li><span class="feature-icon">✅</span> <span class="feature-text">Purple-team tool correlation</span></li>
                    <li><span class="feature-icon">💎</span> <span class="feature-text highlight-text">Or Pro+ Annual N$350/mo</span></li>
                </ul>
                <button class="btn-plan primary" id="proPlusBtn" onclick="createOrder('pro_plus_2mo')">
                    <span class="btn-text">Unlock Pro+ (2 months)</span>
                    <span class="spinner"></span>
                </button>
                <button class="btn-plan secondary" style="margin-top:0.6rem;" onclick="createOrder('pro_plus_annual')">
                    <span class="btn-text">Pro+ Annual (best value)</span>
                </button>
            </div>

        </div>

`;

h = h.slice(0, start) + insert + h.slice(end);

const cStart = h.indexOf('        <!-- Features Comparison -->');
const cEnd = h.indexOf('        <!-- FAQ mini -->');
if (cStart < 0 || cEnd < 0) {
    console.error('comparison markers missing', cStart, cEnd);
    process.exit(1);
}

const comparison = `        <!-- Features Comparison -->
        <div class="comparison-section">
            <div class="comparison-title">📊 <span style="color:var(--neon-green);">Feature Comparison</span></div>
            <table>
                <thead>
                    <tr>
                        <th style="text-align:left;">Feature</th>
                        <th>Free</th>
                        <th>Pro</th>
                        <th>Pro+</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Training Modules</td>
                        <td>3</td>
                        <td>45</td>
                        <td><span style="color:var(--neon-gold);font-weight:700;">95</span></td>
                    </tr>
                    <tr>
                        <td>Attacker toolkit (how they move &amp; talk)</td>
                        <td><span class="cross">✕</span></td>
                        <td><span class="cross">✕</span></td>
                        <td><span class="check">✓</span></td>
                    </tr>
                    <tr>
                        <td>Certificates</td>
                        <td>Basic</td>
                        <td>Unlimited</td>
                        <td>Unlimited</td>
                    </tr>
                    <tr>
                        <td>Matte K AI (outside exams)</td>
                        <td>Limited</td>
                        <td><span class="check">✓</span></td>
                        <td><span class="check">✓</span></td>
                    </tr>
                    <tr class="highlight-row">
                        <td><strong>From</strong></td>
                        <td><strong>N$0</strong></td>
                        <td><strong id="comparePrice">N$299/mo yearly</strong></td>
                        <td><strong style="color:var(--neon-gold);">N$800 / 2 mo</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

`;

h = h.slice(0, cStart) + comparison + h.slice(cEnd);

h = h.replace(
    'Get unlimited access to all 45 modules, premium resources, AI Q&A, and priority support. Start your professional journey today.',
    'Choose Pro (45 modules) or Pro+ (95 modules including attacker-toolkit labs). Annual plans beat monthly — know how adversaries move and talk.'
);
h = h.replace(
    'Upgrade to Pro to unlock all 45 modules, unlimited certificates, and premium features.',
    'Upgrade to Pro (45) or Pro+ (95 attacker-toolkit modules). Annual Pro is the best core value.'
);

// Pricing JS defaults
h = h.replace(
    `const PRICING = {
            free: { nad: 0, period: '/month' },
            monthly: { nad: 450, period: '/month' },
            // Annual commitment: N$360 per month for 12 months (N$4,320 total)
            annual: { nad: 360, period: '/month', months: 12 }
        };`,
    `const PRICING = {
            free: { nad: 0, period: '/month' },
            monthly: { nad: 450, period: '/month' },
            annual: { nad: 299, period: '/month', months: 12 },
            pro_plus_2mo: { nad: 800, period: '/2 months', months: 2 },
            pro_plus_annual: { nad: 350, period: '/month', months: 12 }
        };`
);

h = h.replace(
    `if (data?.plans?.monthly?.nad) PRICING.monthly.nad = data.plans.monthly.nad;
                if (data?.plans?.annual?.nad) PRICING.annual.nad = data.plans.annual.nad;`,
    `if (data?.plans?.monthly?.nad) PRICING.monthly.nad = data.plans.monthly.nad;
                if (data?.plans?.annual?.nad) PRICING.annual.nad = data.plans.annual.nad;
                if (data?.plans?.pro_plus_2mo?.nad) PRICING.pro_plus_2mo.nad = data.plans.pro_plus_2mo.nad;
                if (data?.plans?.pro_plus_annual?.nad) PRICING.pro_plus_annual.nad = data.plans.pro_plus_annual.nad;`
);

fs.writeFileSync(p, h);
console.log('OK payment.html patched');
