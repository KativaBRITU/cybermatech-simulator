/**
 * Matte K project knowledge — live facts + coaching concepts.
 * Answers stay platform-accurate. Exam keys are never stored here.
 */

const { ATTACKER_TOOLKIT_MODULES } = require('./attackerToolkitModules');
const { SPECIAL_OPS_MODULES } = require('./specialOpsModules');
const pricingCatalog = require('./pricingCatalog');

const CORE_MODULES = [
    { id: 1, name: 'Phishing Detection', category: 'social-engineering', difficulty: 'easy' },
    { id: 2, name: 'Malware Analysis', category: 'malware', difficulty: 'medium' },
    { id: 3, name: 'Network Security', category: 'network', difficulty: 'medium' },
    { id: 4, name: 'Cloud Security', category: 'cloud', difficulty: 'medium' },
    { id: 5, name: 'Mobile Security', category: 'network', difficulty: 'easy' },
    { id: 6, name: 'IoT Security', category: 'network', difficulty: 'medium' },
    { id: 7, name: 'Social Engineering', category: 'social-engineering', difficulty: 'easy' },
    { id: 8, name: 'Incident Response', category: 'forensics', difficulty: 'medium' },
    { id: 9, name: 'Security Compliance', category: 'governance', difficulty: 'easy' },
    { id: 10, name: 'Ethical Hacking', category: 'social-engineering', difficulty: 'hard' },
    { id: 11, name: 'Ransomware Defense', category: 'malware', difficulty: 'medium' },
    { id: 12, name: 'Data Privacy (GDPR)', category: 'governance', difficulty: 'easy' },
    { id: 13, name: 'Wireless Security', category: 'network', difficulty: 'medium' },
    { id: 14, name: 'Database Security', category: 'malware', difficulty: 'medium' },
    { id: 15, name: 'DevSecOps', category: 'cloud', difficulty: 'hard' },
    { id: 16, name: 'Digital Forensics', category: 'forensics', difficulty: 'hard' },
    { id: 17, name: 'Threat Intelligence', category: 'forensics', difficulty: 'medium' },
    { id: 18, name: 'Security Operations (SOC)', category: 'forensics', difficulty: 'medium' },
    { id: 19, name: 'Identity & Access Management', category: 'network', difficulty: 'easy' },
    { id: 20, name: 'Cryptography', category: 'network', difficulty: 'hard' },
    { id: 21, name: 'Zero Trust Architecture', category: 'network', difficulty: 'hard' },
    { id: 22, name: 'Supply Chain Security', category: 'governance', difficulty: 'medium' },
    { id: 23, name: 'API Security', category: 'malware', difficulty: 'medium' },
    { id: 24, name: 'Container Security', category: 'cloud', difficulty: 'medium' },
    { id: 25, name: 'Kubernetes Security', category: 'cloud', difficulty: 'hard' },
    { id: 26, name: 'Serverless Security', category: 'cloud', difficulty: 'medium' },
    { id: 27, name: 'AI & Machine Learning Security', category: 'emerging', difficulty: 'hard' },
    { id: 28, name: 'Quantum Computing Threats', category: 'emerging', difficulty: 'hard' },
    { id: 29, name: 'Blockchain Security', category: 'emerging', difficulty: 'medium' },
    { id: 30, name: 'OT/ICS Security', category: 'emerging', difficulty: 'hard' },
    { id: 31, name: 'Healthcare Security (HIPAA)', category: 'governance', difficulty: 'easy' },
    { id: 32, name: 'Financial Security (PCI-DSS)', category: 'governance', difficulty: 'easy' },
    { id: 33, name: 'E-Commerce Security', category: 'governance', difficulty: 'easy' },
    { id: 34, name: 'Insider Threat Detection', category: 'social-engineering', difficulty: 'medium' },
    { id: 35, name: 'Physical Security Integration', category: 'governance', difficulty: 'easy' },
    { id: 36, name: 'Disaster Recovery & BCP', category: 'governance', difficulty: 'easy' },
    { id: 37, name: 'Security Awareness Training', category: 'social-engineering', difficulty: 'easy' },
    { id: 38, name: 'Risk Management', category: 'governance', difficulty: 'easy' },
    { id: 39, name: 'Vulnerability Management', category: 'malware', difficulty: 'medium' },
    { id: 40, name: 'Penetration Testing', category: 'social-engineering', difficulty: 'hard' },
    { id: 41, name: 'Red Team / Blue Team', category: 'social-engineering', difficulty: 'hard' },
    { id: 42, name: 'Cybersecurity Frameworks', category: 'governance', difficulty: 'easy' },
    { id: 43, name: 'Cloud Forensics', category: 'forensics', difficulty: 'hard' },
    { id: 44, name: 'Mobile Forensics', category: 'forensics', difficulty: 'hard' },
    { id: 45, name: 'Cyber Law & Ethics', category: 'governance', difficulty: 'easy' }
];

function getCatalog() {
    return [...CORE_MODULES, ...ATTACKER_TOOLKIT_MODULES, ...SPECIAL_OPS_MODULES];
}

function usd(n) {
    const v = Number(n);
    if (!Number.isFinite(v) || v === 0) return 'US$0';
    return Number.isInteger(v) ? `US$${v}` : `US$${v.toFixed(2)}`;
}

function nadRef(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return 'N$0';
    return `N$${Math.round(v).toLocaleString()}`;
}

function livePricing() {
    const snap = pricingCatalog.snapshot();
    const c = snap.consumer;
    const b = snap.b2b;
    const freeIds = String(process.env.FREE_MODULE_IDS || '1,7,37')
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter(Boolean);
    return {
        monthly: c.monthly.usd,
        monthlyNad: c.monthly.nad,
        annualMonthly: c.annual.usd,
        annualMonthlyNad: c.annual.nad,
        annualTotal: c.annual.yearly_total_usd,
        saveAnnual: c.annual.save_vs_monthly_usd,
        proPlus2mo: c.pro_plus_2mo.usd,
        proPlus2moNad: c.pro_plus_2mo.nad,
        proPlusAnnualMonthly: c.pro_plus_annual.usd,
        proPlusAnnualMonthlyNad: c.pro_plus_annual.nad,
        proPlusAnnualTotal: c.pro_plus_annual.yearly_total_usd,
        specialOps2mo: c.special_ops_2mo.usd,
        specialOps2moNad: c.special_ops_2mo.nad,
        specialOpsAnnualMonthly: c.special_ops_annual.usd,
        specialOpsAnnualMonthlyNad: c.special_ops_annual.nad,
        specialOpsAnnualTotal: c.special_ops_annual.yearly_total_usd,
        institution: b.institution_annual.usd,
        institutionNad: b.institution_annual.nad,
        enterprise: b.enterprise_license.usd,
        enterpriseNad: b.enterprise_license.nad,
        sme: b.sme_pack.usd,
        smeNad: b.sme_pack.nad,
        custom: b.custom_training.usd,
        customNad: b.custom_training.nad,
        fx: snap.nad_per_usd,
        freeIds,
        currency: 'USD'
    };
}

function buildTopics() {
    const p = livePricing();
    const catalog = getCatalog();
    const total = catalog.length;
    const requiredGate = Math.ceil(total * 0.65);
    const freeNames = catalog
        .filter((m) => p.freeIds.includes(m.id))
        .map((m) => `${m.name} (#${m.id})`)
        .join(', ');

    return [
        {
            id: 'identity',
            title: 'Who is Matte K / TRIBAMS',
            keywords: [
                'who', 'you', 'your', 'name', 'matte', 'mate', 'matt', 'hello', 'hi', 'hey',
                'about', 'tribams', 'platform', 'what is this', 'introduce'
            ],
            phrases: ['who are you', 'what is tribams', 'your name'],
            answer: () =>
                'I am Matte K — the TRIBAMS cyber-ops guide (tribams.com). Global catalog, local Namibia context. I explain every part of this platform: modules, ranks, pricing, orgs, certificates, labs, and how training works. I also catch typos and match your question to the closest real topic. I stay locked during scored drills so results stay yours.'
        },
        {
            id: 'start',
            title: 'Getting started',
            keywords: [
                'start', 'begin', 'register', 'signup', 'sign', 'account', 'free', 'first',
                'onboard', 'new', 'join', 'create', 'login', 'log', 'signin'
            ],
            phrases: ['get started', 'how do i start', 'create account', 'sign up'],
            answer: () =>
                `Start here: 1) Open /register and create an account. 2) Sign in at /login. 3) Go to /dashboard or /resource-center. 4) Train the free modules first: ${freeNames || 'Phishing, Social Engineering, Security Awareness'}. Path inside each module: Learn → Practice (feedback) → Live drill. I go dark on scored drills.`
        },
        {
            id: 'pricing',
            title: 'Pricing and plans',
            keywords: [
                'price', 'pricing', 'cost', 'pay', 'payment', 'subscribe', 'subscription',
                'pro', 'plus', 'plan', 'month', 'annual', 'yearly', 'n$', 'nad', 'paypal',
                'upgrade', 'cheap', 'expensive', 'fee', 'billing', 'usd', 'dollar', 'us$'
            ],
            phrases: ['how much', 'what does pro cost', 'pro plus', 'payment page', 'what does pro cost in usd'],
            answer: () =>
                `Live pricing (USD list, global): Free = ${p.freeIds.length} starter modules. Pro monthly = ${usd(p.monthly)}/mo (modules 1–95). Pro annual = ${usd(p.annualMonthly)}/mo billed yearly. Pro+ intensive = ${usd(p.proPlus2mo)} for 2 months, or ${usd(p.proPlusAnnualMonthly)}/mo yearly. Special Ops Elite = ${usd(p.specialOps2mo)} for 2 months or ${usd(p.specialOpsAnnualMonthly)}/mo yearly — unlocks modules 96–97 (Mission-Ready rank required). PayPal checkout on /payment charges USD. Local Namibia N$ is a display reference only (~${p.fx} NAD/USD; Pro ≈ ${nadRef(p.monthlyNad)}/mo). Beta testers may have full catalog access without payment.`
        },
        {
            id: 'b2b',
            title: 'Organizations and licenses',
            keywords: [
                'org', 'organization', 'organisation', 'company', 'school', 'university',
                'institution', 'enterprise', 'sme', 'license', 'licence', 'seat', 'invite',
                'team', 'b2b', 'custom', 'training', 'ministry', 'government'
            ],
            phrases: ['join organization', 'invite code', 'custom training', 'org license'],
            answer: () =>
                `B2B lives at /organization. Create an org (default 10 seats) or join with an invite code — seat limits are enforced. Org types: education, government, healthcare, enterprise, SME, other. Roles: owner, admin, member (owners/admins request licenses and export roster CSV). Annual USD packs (global + local): SME ${usd(p.sme)} (15 seats, Pro; ~${nadRef(p.smeNad)}), Institution ${usd(p.institution)} (50 seats, Pro; ~${nadRef(p.institutionNad)}), Enterprise ${usd(p.enterprise)} (200 seats, Pro+; ~${nadRef(p.enterpriseNad)}), Custom training ~${usd(p.custom)} (25 seats, 6 months, Pro+; ~${nadRef(p.customNad)}). Workflow: org admin requests → Tribams admin activates in /admin. Active license unlocks Pro/Pro+ for members. Analytics: team scores, certs, lab passes, module activity, roster CSV export.`
        },
        {
            id: 'catalog',
            title: 'Module catalog',
            keywords: [
                'module', 'modules', 'catalog', 'catalogue', 'course', 'courses', 'topic',
                'learn', 'training', '95', 'list', 'resource', 'center', 'curriculum'
            ],
            phrases: ['how many modules', 'what can i learn', 'module list', 'resource center'],
            answer: () =>
                `TRIBAMS catalogs ${total} modules (IDs 1–${total}). Core + attacker toolkit (1–95) unlock with Pro. Special Ops Elite modules 96–97 need Special Ops subscription + Mission-Ready rank. Categories: social-engineering, malware, network, cloud, forensics, governance, emerging, offensive-tools. Browse /resource-center. Free IDs: ${p.freeIds.join(', ')}. Hard modules stay locked until you clear the 65% readiness gate.`
        },
        {
            id: 'ranks',
            title: 'Ranks and progressive content',
            keywords: [
                'rank', 'level', 'recruit', 'analyst', 'mission', 'ready', 'beginner',
                'intermediate', 'advanced', 'progressive', 'environment', 'growth',
                'field', 'operator', 'unlock', 'layer'
            ],
            phrases: ['field analyst', 'mission ready', 'progressive content', 'rank up', 'how do i rank', 'unlock ranks'],
            answer: () =>
                `Same module, deeper workplace as you rank up. Recruit (beginner) = campus/SME helpdesk foundations. Field Analyst (intermediate) = SOC / bank / ministry ops floor — unlocks after you pass 65% of the catalog at 70%+ and hold official first-pass average ≥ 60%. Mission-Ready Operator (advanced) = crisis cell / purple team — same 65% gate and official average ≥ 80%. Study guides and drills add intermediate/advanced layers; beginner content stays.`
        },
        {
            id: 'gate',
            title: 'Readiness gate math',
            keywords: [
                'gate', '65', '70', 'progress', 'percent', 'average', 'pass', 'unlock',
                'hard', 'required', 'remaining', 'formula', 'calculate', 'math', 'score'
            ],
            phrases: ['readiness gate', 'how to unlock', '65 percent', 'pass mark', 'unlock next level', 'how many modules', 'how many more'],
            answer: () =>
                `Gate algorithm: catalog size T = ${total}. Required passes R = ceil(T × 0.65) = ${requiredGate}. A module counts only on the first score ≥ 70% (retakes allowed, first pass is official). Completion % = round(completed / T × 100). Official average = mean of those first-pass scores. Hard/expert modules unlock when completed/T ≥ 0.65. Force-Ready badge ≈ gate + official average ≥ 75%.`
        },
        {
            id: 'training',
            title: 'How a module works',
            keywords: [
                'learn', 'practice', 'quiz', 'drill', 'exam', 'test', 'tab', 'study',
                'guide', 'live', 'timer', 'integrity', 'pledge', 'proctor'
            ],
            phrases: ['how training works', 'learn practice quiz', 'live drill'],
            answer: () =>
                'Each module at /training/:id has three layers. Learn = study guide (rank-aware). Practice = short questions with explanations. Live drill = timed, pledged, server-scored exam. Correct answers never leave the server. Tab switches and external AI can flag integrity and cap high scores. Matte K is disabled on drill/assessment surfaces.'
        },
        {
            id: 'certificate',
            title: 'Certificates and badges',
            keywords: [
                'certificate', 'cert', 'badge', 'badges', 'verify', 'transcript',
                'readiness', 'share', 'tri'
            ],
            phrases: ['how to get a certificate', 'verify certificate'],
            answer: () =>
                'Complete 65% of TRIBAMS modules at 70%+ and TRIBAMS signs off one program certificate bound to your account. You receive an email with a secure link to view it; anyone can confirm originality at /verify with your certificate ID. Module Master badges still unlock at 80%+ per module. Broader proof of force readiness is /verify-readiness.'
        },
        {
            id: 'assessment',
            title: 'Skill assessment',
            keywords: [
                'assessment', 'skill', 'placement', 'path', 'recommend', 'recommended',
                'update', 'learning'
            ],
            phrases: ['skill assessment', 'learning path', 'recommended modules'],
            answer: () =>
                'Skill assessment is at /skill-assessment (login required). It is a timed placement drill — I stay locked while it runs. Results feed recommended modules and your learning path. You can refresh path from the dashboard “Update Path” control. I will not solve assessment items.'
        },
        {
            id: 'profile',
            title: 'Profile and account',
            keywords: [
                'profile', 'picture', 'avatar', 'password', 'reset', 'forgot', 'email',
                'username', 'account', 'member', 'since'
            ],
            phrases: ['profile picture', 'forgot password', 'reset password', 'change photo'],
            answer: () =>
                'Profile is /profile — update photo, member-since, download a JSON copy of your data, or delete the account (password + type DELETE). Operator admin emails cannot self-delete there. Forgot password: /forgot-password → email link (1 hour) → /reset-password. If SMTP is down, reset still logs server-side for admins.'
        },
        {
            id: 'labs',
            title: 'Labs and scenarios',
            keywords: [
                'lab', 'labs', 'scenario', 'range', 'simulation', 'africa', 'namibia',
                'cyber', 'range'
            ],
            phrases: ['cyber range', 'hands on lab', 'african scenario'],
            answer: () =>
                'Evidence Workbench (/lab) — 28+ browser-realistic ops labs (no VMs). Graded judgment on artifacts; 70% pass threshold. MITRE ATT&CK techniques feed your readiness transcript. Per-module labs at /module/:id/lab. Login + tier gate applies (linked module access). Special Ops labs: special-ops-red-01 and special-ops-blue-01 (modules 96–97). Scenarios (/scenario) are different — daily rotating single-question Africa-first drills; Matte K locks there. Lab content can update — stale passes prompt a retake.'
        },
        {
            id: 'darkweb',
            title: 'Dark-web check',
            keywords: [
                'dark', 'web', 'darkweb', 'breach', 'leaked', 'pwned', 'exposed', 'scan'
            ],
            phrases: ['dark web scan', 'email breach'],
            answer: () =>
                ' /darkweb is a training simulation for breach-awareness habits — not a live dark-web crawl of real criminal markets. Use it to practice what to do if an email appears in a breach story: unique passwords, MFA, monitor accounts. Do not treat it as forensic proof.'
        },
        {
            id: 'product_privacy',
            title: 'TRIBAMS privacy and Namibia law',
            keywords: [
                'cookie', 'cookies', 'jurisdiction', 'popia', 'dpa', 'export',
                'namibia', 'windhoek', 'session'
            ],
            phrases: [
                'privacy policy', 'namibia law', 'popia', 'delete my account',
                'do you sell data', 'governing law', 'data protection bill',
                'gdpr apply', 'cookie notice', 'privacy policy & namibia law'
            ],
            answer: () =>
                'TRIBAMS (tribams.com) is established in Windhoek, Namibia — that is home law and the courts of Namibia. We do not pretend Namibia has an in-force GDPR-style Data Protection Act: the Data Protection Bill is not enacted as of August 2026. South Africa POPIA is neighbour/SADC comparison in training overlays, not Namibian law. Global learners pay USD via PayPal; processors (PayPal, email, hosting/Cloudflare, optional OpenAI for Matte K) may sit abroad. We do not sell your data. Session cookie is tribams.sid (required to stay signed in). No analytics/ad cookies in this app. Export or delete from /profile. Policy: /privacy  Cookies: /cookies  Contact: /contact#privacy.'
        },
        {
            id: 'admin',
            title: 'Admin and ops',
            keywords: [
                'admin', 'administrator', 'users', 'delete', 'payments', 'orgs', 'ops'
            ],
            phrases: ['admin panel', 'delete user'],
            answer: () =>
                'Admin console is /admin (emails listed in ADMIN_EMAILS). Ops can review users, orgs, licenses, custom-training status, and payments. Health: /api/health. Launch checklist: /api/launch-readiness (admin). Email probe: /api/email-status (admin).'
        },
        {
            id: 'pages',
            title: 'Where to click (sitemap)',
            keywords: [
                'page', 'pages', 'link', 'url', 'where', 'navigate', 'menu', 'route',
                'contact', 'about', 'terms', 'privacy', 'help', 'support'
            ],
            phrases: ['where do i go', 'which page', 'site map'],
            answer: () =>
                'Key pages: / (home), /about, /contact, /login, /register, /dashboard, /profile, /resource-center, /training/:id, /payment, /organization, /leaderboard, /badges, /darkweb, /lab, /scenario, /certificate, /verify, /forgot-password, /terms, /privacy, /cookies. Human support: /contact (privacy requests: /contact#privacy).'
        },
        {
            id: 'integrity',
            title: 'Exam integrity',
            keywords: [
                'cheat', 'ai', 'integrity', 'tab', 'switch', 'mattek', 'lock', 'locked',
                'proctor', 'honest'
            ],
            phrases: ['are quizzes ai free', 'can i use chatgpt', 'exam lock'],
            answer: () =>
                'Scored drills and skill assessments are human-only. I lock during those sessions. Answers are scored on the server. Leaving the tab, pasting AI answers, or implausibly fast perfect runs can be flagged. Use Learn + Practice for coaching; Live drill is the exam.'
        },
        {
            id: 'phishing',
            title: 'Phishing / social engineering coaching',
            keywords: [
                'phish', 'phishing', 'spoof', 'bec', 'whatsapp', 'pretext', 'social',
                'engineering', 'urgency', 'invoice', 'ceo'
            ],
            phrases: ['how to spot phishing', 'business email compromise'],
            answer: () =>
                'Coaching logic (not an exam key): treat unexpected money, password, or MFA requests as hostile until verified out-of-band on a known-good number. Multi-channel (email + WhatsApp) is not proof. Check sender domain, hover links, and whether urgency skips dual control. Free starter: module #1 Phishing Detection, then #7 Social Engineering.'
        },
        {
            id: 'malware',
            title: 'Malware / ransomware coaching',
            keywords: [
                'malware', 'virus', 'ransom', 'ransomware', 'trojan', 'worm', 'encrypt',
                'backup', 'payload'
            ],
            phrases: ['what is ransomware', 'malware analysis'],
            answer: () =>
                'Defender logic: isolate first (network pull / disable account), preserve evidence, restore from known-good backups — do not pay as a plan. Ransomware is a business-continuity + identity problem as much as a file problem. Train #2 Malware Analysis and #11 Ransomware Defense, then IR (#8).'
        },
        {
            id: 'network',
            title: 'Network / IAM / Zero Trust coaching',
            keywords: [
                'network', 'firewall', 'vpn', 'iam', 'mfa', 'password', 'zero', 'trust',
                'wifi', 'wireless', 'segment'
            ],
            phrases: ['what is zero trust', 'how does mfa help'],
            answer: () =>
                'Zero Trust logic: never trust location alone — verify identity, device, and least privilege every request. MFA stops most password replay; it does not stop session theft or MFA-fatigue, so pair it with phishing-resistant factors and out-of-band verify for money moves. See modules #3, #13, #19, #21.'
        },
        {
            id: 'cloud',
            title: 'Cloud / DevSecOps coaching',
            keywords: [
                'cloud', 'aws', 'azure', 'gcp', 'container', 'kubernetes', 'k8s',
                'serverless', 'devsecops', 'api'
            ],
            phrases: ['cloud security', 'container security'],
            answer: () =>
                'Cloud logic: identity is the new perimeter (IAM keys, roles, OAuth). Lock public storage, rotate keys, scan images, and treat APIs as attack surface. Containers/K8s fail from over-permissioned service accounts and exposed dashboards more often than “fancy CVEs.” Modules #4, #15, #23–#26.'
        },
        {
            id: 'forensics',
            title: 'SOC / IR / forensics coaching',
            keywords: [
                'soc', 'siem', 'forensic', 'forensics', 'incident', 'response', 'ir',
                'threat', 'intel', 'log', 'ticket'
            ],
            phrases: ['incident response steps', 'what does a soc do'],
            answer: () =>
                'IR loop: identify → contain → eradicate → recover → lessons. Write tickets that a lead can defend. Preserve logs before reboot/wipe. SOC work is correlation + blast-radius control, not trivia. Modules #8, #16–#18, #17 Threat Intelligence.'
        },
        {
            id: 'governance',
            title: 'Governance / compliance coaching',
            keywords: [
                'gdpr', 'hipaa', 'pci', 'compliance', 'policy', 'risk', 'law', 'privacy',
                'framework', 'iso', 'nist'
            ],
            phrases: ['what is gdpr', 'pci dss', 'cyber frameworks'],
            answer: () =>
                'Training logic (not TRIBAMS product law): map data → law/contract → control → evidence. GDPR is an EU regime about lawful processing and data-subject rights; HIPAA protects health data; PCI-DSS protects cardholder data. Namibia home law for this product is separate — ask “privacy policy” for TRIBAMS itself. Frameworks (NIST/ISO) are how you prove control. See #9, #12, #31, #32, #38, #42, #45.'
        },
        {
            id: 'offensive',
            title: 'Attacker-toolkit (defender view)',
            keywords: [
                'nmap', 'metasploit', 'burp', 'mimikatz', 'cobalt', 'hashcat', 'bloodhound',
                'attacker', 'toolkit', 'offensive', 'red', 'team', 'pentest', 'osint'
            ],
            phrases: ['attacker toolkit', 'know the enemy', 'pro plus modules'],
            answer: () =>
                `Modules 46–95 teach defender awareness of attacker tooling (Nmap, Burp, Mimikatz, C2, AD attacks, etc.). Pro unlocks modules 1–95. Pro+ adds deeper intensive access paths. Special Ops Elite (96–97) is the live red/blue crisis tier above Pro+. Goal is recognition and control design — not running crime. Purple-team wrap is #95.`
        },
        {
            id: 'special_ops',
            title: 'Special Ops Elite',
            keywords: [
                'special', 'ops', 'elite', 'red', 'blue', 'crisis', '96', '97', 'live',
                'emulation', 'mission', 'ready'
            ],
            phrases: ['special ops elite', 'module 96', 'module 97', 'live red team'],
            answer: () =>
                `Special Ops Elite is the premium tier above Pro+. Pricing: ${usd(p.specialOps2mo)} for 2 months or ${usd(p.specialOpsAnnualMonthly)}/mo yearly (PayPal charges USD; Namibia ref ~${nadRef(p.specialOps2moNad)} / ${nadRef(p.specialOpsAnnualMonthlyNad)}). Unlocks modules 96 (Live Red Team Emulation) and 97 (Live Blue Team Crisis Cell). Requires Mission-Ready Operator rank. Matching labs: special-ops-red-01 and special-ops-blue-01 in Evidence Workbench. Checkout on /payment.`
        },
        {
            id: 'emerging',
            title: 'Emerging tech threats',
            keywords: [
                'ai', 'ml', 'llm', 'quantum', 'blockchain', 'ot', 'ics', 'plc', 'iot',
                'deepfake'
            ],
            phrases: ['ai security', 'ot ics', 'quantum threat'],
            answer: () =>
                'Emerging track: AI/ML security (#27), quantum threats (#28), blockchain (#29), OT/ICS (#30), IoT (#6), plus deepfake/AI voice modules in the toolkit. Logic: new tech inherits old failures — identity abuse, unsafe defaults, and unpatched edge — then adds model/process risk.'
        }
    ];
}

function platformBrief() {
    const p = livePricing();
    const total = getCatalog().length;
    return [
        `TRIBAMS (tribams.com) training platform. Guide name: Matte K.`,
        `Catalog: ${total} modules. Free module IDs: ${p.freeIds.join(', ')}.`,
        `Pricing USD (PayPal charges USD): Pro ${usd(p.monthly)}/mo (modules 1–95), Pro annual ${usd(p.annualMonthly)}/mo, Pro+ 2mo ${usd(p.proPlus2mo)}, Pro+ annual ${usd(p.proPlusAnnualMonthly)}/mo, Special Ops ${usd(p.specialOps2mo)}/2mo or ${usd(p.specialOpsAnnualMonthly)}/mo annual (96–97). Namibia N$ is reference only (~${p.fx} NAD/USD).`,
        `B2B USD annual (global + local): SME ${usd(p.sme)} (15 seats), Institution ${usd(p.institution)} (50), Enterprise ${usd(p.enterprise)} (200), custom training ~${usd(p.custom)} (25 seats). Org hub /organization — request then admin activates.`,
        `Labs: Evidence Workbench /lab — 28 built-in labs, 70% pass, MITRE ATT&CK transcript. Scenarios /scenario are separate daily drills.`,
        `Gate: pass mark 70%, unlock band at 65% of catalog. Ranks: Recruit → Field Analyst (avg≥60 after gate) → Mission-Ready (avg≥80).`,
        `Cert: 80%+ live drill. Pages: /dashboard /resource-center /payment /organization /profile /privacy /cookies /training/:id.`,
        `Never provide quiz answers, option letters, or solve scored assessment items.`
    ].join(' ');
}

const EXTRA_DICTIONARY = [
    'matte', 'tribams', 'dashboard', 'module', 'modules', 'phishing',
    'malware', 'ransomware', 'forensics', 'certificate', 'subscription', 'paypal',
    'organization', 'licence', 'license', 'intermediate', 'advanced', 'beginner',
    'recruit', 'analyst', 'operator', 'namibia', 'africa', 'whatsapp', 'integrity',
    'assessment', 'practice', 'drill', 'scenario', 'kubernetes', 'cryptography',
    'zerotrust', 'compliance', 'password', 'profile', 'register', 'login', 'pricing', 'usd',
    'privacy', 'cookies', 'popia', 'gdpr', 'windhoek', 'jurisdiction'
];

module.exports = {
    getCatalog,
    livePricing,
    buildTopics,
    platformBrief,
    EXTRA_DICTIONARY
};
