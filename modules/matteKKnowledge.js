/**
 * Matte K project knowledge — live facts + coaching concepts.
 * Answers stay platform-accurate. Exam keys are never stored here.
 */

const { ATTACKER_TOOLKIT_MODULES } = require('./attackerToolkitModules');

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
    return [...CORE_MODULES, ...ATTACKER_TOOLKIT_MODULES];
}

function nad(n) {
    return `N$${Number(n)}`;
}

function livePricing() {
    const monthly = Number(process.env.PRICE_MONTHLY_NAD) || 450;
    const annualMonthly = Number(process.env.PRICE_ANNUAL_MONTHLY_NAD || process.env.PRICE_ANNUAL_NAD) || 299;
    const proPlus2mo = Number(process.env.PRICE_PRO_PLUS_2MO_NAD) || 800;
    const proPlusAnnualMonthly = Number(process.env.PRICE_PRO_PLUS_ANNUAL_MONTHLY_NAD) || 350;
    const institution = Number(process.env.PRICE_LICENSE_INSTITUTION_NAD) || 18000;
    const enterprise = Number(process.env.PRICE_LICENSE_ENTERPRISE_NAD) || 45000;
    const sme = Number(process.env.PRICE_LICENSE_SME_NAD) || 6500;
    const custom = Number(process.env.PRICE_CUSTOM_TRAINING_NAD) || 12000;
    const fx = Number(process.env.NAD_PER_USD) || 18.5;
    const freeIds = String(process.env.FREE_MODULE_IDS || '1,7,37')
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter(Boolean);
    return {
        monthly,
        annualMonthly,
        annualTotal: annualMonthly * 12,
        saveAnnual: (monthly - annualMonthly) * 12,
        proPlus2mo,
        proPlusAnnualMonthly,
        proPlusAnnualTotal: proPlusAnnualMonthly * 12,
        institution,
        enterprise,
        sme,
        custom,
        fx,
        freeIds
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
                'I am Matte K — the TRIBAMS cyber-ops guide (tribams.com). I explain every part of this platform: modules, ranks, pricing, orgs, certificates, labs, and how training works. I also catch typos and match your question to the closest real topic. I stay locked during scored drills so results stay yours.'
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
                'upgrade', 'cheap', 'expensive', 'fee', 'billing'
            ],
            phrases: ['how much', 'what does pro cost', 'pro plus', 'payment page'],
            answer: () =>
                `Live pricing (NAD): Free = ${p.freeIds.length} starter modules. Pro monthly = ${nad(p.monthly)}/mo. Pro annual = ${nad(p.annualMonthly)}/mo billed yearly (${nad(p.annualTotal)}/yr, save ${nad(p.saveAnnual)} vs monthly). Pro+ intensive = ${nad(p.proPlus2mo)} for 2 months, or ${nad(p.proPlusAnnualMonthly)}/mo yearly. PayPal checkout is on /payment. FX reference ≈ ${p.fx} NAD per 1 USD.`
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
                `B2B lives at /organization. Create an org or join with an invite code. License packs (annual NAD): SME ${nad(p.sme)}, Institution ${nad(p.institution)}, Enterprise ${nad(p.enterprise)}. Custom training requests start around ${nad(p.custom)}. An active org license can unlock Pro/Pro+ seats for members. Admins activate licenses in /admin.`
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
                `TRIBAMS currently catalogs ${total} modules (IDs 1–${total}). Categories: social-engineering, malware, network, cloud, forensics, governance, emerging, and offensive-tools (attacker toolkit). Browse /resource-center. Free IDs: ${p.freeIds.join(', ')}. Hard modules stay locked until you clear the 65% readiness gate.`
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
                'Each module at /training/:id has three layers. Learn = study guide (rank-aware). Practice = short questions with explanations. Live drill = timed, pledged, server-scored exam. Correct answers never leave the server. Focus changes during scored drills are logged on your readiness record. Study assistants pause on drill and assessment surfaces.'
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
                'Score 80%+ on a module live drill to earn a verifiable TRIBAMS certificate (TRI-… ID). Open /certificate or your dashboard to share. Public check is /verify. Broader proof of force readiness is /verify-readiness. Badges live at /badges; leaderboard at /leaderboard.'
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
                'Profile is /profile — update photo, see member-since, and account details. Forgot password: /forgot-password → email link (1 hour) → /reset-password. If SMTP is down, reset still logs server-side for admins. Dashboard avatar links to profile.'
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
                'Hands-on surfaces: /lab and per-module labs at /module/:id/lab. Scenario / African cyber-range drills are at /scenario — Africa-first locales most days. Content overlays local context (banks, ministries, WhatsApp/BEC patterns) on top of global cyber practice.'
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
                'Key pages: / (home), /about, /contact, /login, /register, /dashboard, /profile, /resource-center, /training/:id, /payment, /organization, /leaderboard, /badges, /darkweb, /lab, /scenario, /certificate, /verify, /forgot-password, /terms, /privacy. Human support: /contact.'
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
                'Governance logic: map data → law/contract → control → evidence. GDPR is about lawful processing and data-subject rights; HIPAA protects health data; PCI-DSS protects cardholder data. Frameworks (NIST/ISO) are how you prove control, not a sticker. See #9, #12, #31, #32, #38, #42, #45.'
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
                `Modules 46–${total} teach defender awareness of attacker tooling (Nmap, Burp, Mimikatz, C2, AD attacks, etc.). Goal is recognition and control design — not running crime. Access follows your plan (Pro vs Pro+ / org license). Purple-team wrap is #95.`
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
        `Pricing NAD: Pro ${p.monthly}/mo, Pro annual ${p.annualMonthly}/mo, Pro+ 2mo ${p.proPlus2mo}, Pro+ annual ${p.proPlusAnnualMonthly}/mo.`,
        `B2B NAD annual: SME ${p.sme}, Institution ${p.institution}, Enterprise ${p.enterprise}, custom training ~${p.custom}.`,
        `Gate: pass mark 70%, unlock band at 65% of catalog. Ranks: Recruit → Field Analyst (avg≥60 after gate) → Mission-Ready (avg≥80).`,
        `Cert: 80%+ live drill. Pages: /dashboard /resource-center /payment /organization /profile /training/:id.`,
        `Never provide quiz answers, option letters, or solve scored assessment items.`
    ].join(' ');
}

const EXTRA_DICTIONARY = [
    'matte', 'tribams', 'dashboard', 'module', 'modules', 'phishing',
    'malware', 'ransomware', 'forensics', 'certificate', 'subscription', 'paypal',
    'organization', 'licence', 'license', 'intermediate', 'advanced', 'beginner',
    'recruit', 'analyst', 'operator', 'namibia', 'africa', 'whatsapp', 'integrity',
    'assessment', 'practice', 'drill', 'scenario', 'kubernetes', 'cryptography',
    'zerotrust', 'compliance', 'password', 'profile', 'register', 'login', 'pricing'
];

module.exports = {
    getCatalog,
    livePricing,
    buildTopics,
    platformBrief,
    EXTRA_DICTIONARY
};
