/**
 * Tribams Study Content Library
 * Rich educational guides + trusted public references (standards bodies / government).
 * No competitor training platforms.
 */

const {
    getToolkitExtras,
    getToolkitEssayQuestions
} = require('./attackerToolkitContent');
const { TIER_A_EXTRAS, getTierAEssays } = require('./tierADepth');
const { TIER_B_EXTRAS, getTierBEssays } = require('./tierBDepth');
const { TIER_C_EXTRAS, getTierCEssays } = require('./tierCDepth');
const { getLabsForModule } = require('./labEngine');
const africanContext = require('./africanContext');
const progressiveContent = require('./progressiveContent');
const moduleDefinitions = require('./moduleDefinitions');
const trainingPhases = require('./trainingPhases');
const { getSpecialOpsExtras, getSpecialOpsEssayQuestions } = require('./specialOpsPillars');

const TRUSTED_LINKS = {
    nist_csf: { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
    nist_800_61: { name: 'NIST SP 800-61 Incident Handling', url: 'https://csrc.nist.gov/pubs/sp/800/61/r2/final' },
    nist_800_53: { name: 'NIST SP 800-53 Security Controls', url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final' },
    nist_800_63: { name: 'NIST SP 800-63 Digital Identity', url: 'https://csrc.nist.gov/projects/digital-identity-guidelines' },
    owasp_top10: { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
    owasp_asvs: { name: 'OWASP ASVS', url: 'https://owasp.org/www-project-application-security-verification-standard/' },
    owasp_api: { name: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/' },
    mitre_attack: { name: 'MITRE ATT&CK', url: 'https://attack.mitre.org/' },
    mitre_navigator: { name: 'MITRE ATT&CK Navigator', url: 'https://mitre-attack.github.io/attack-navigator/' },
    cisa: { name: 'CISA Cybersecurity Resources', url: 'https://www.cisa.gov/cybersecurity' },
    cisa_phishing: { name: 'CISA Phishing Guidance', url: 'https://www.cisa.gov/topics/cyber-threats-and-advisories/phishing' },
    cisa_ransomware: { name: 'CISA StopRansomware', url: 'https://www.cisa.gov/stopransomware' },
    cis_controls: { name: 'CIS Critical Security Controls', url: 'https://www.cisecurity.org/controls' },
    enisa: { name: 'ENISA Threat Landscape', url: 'https://www.enisa.europa.eu/topics/cyber-threats/threats-and-trends' },
    gdpr: { name: 'EU GDPR (official text)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
    iso27001: { name: 'ISO/IEC 27001 Overview (ISO)', url: 'https://www.iso.org/standard/iso-iec-27001-information-security.html' },
    pci: { name: 'PCI Security Standards Council', url: 'https://www.pcisecuritystandards.org/' },
    hipaa: { name: 'HHS HIPAA Security Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html' },
    nist_cloud: { name: 'NIST Cloud Computing Security', url: 'https://csrc.nist.gov/projects/cloud-computing' },
    nist_zero_trust: { name: 'NIST SP 800-207 Zero Trust', url: 'https://csrc.nist.gov/pubs/sp/800/207/final' },
    ics_cert: { name: 'CISA ICS Advisories', url: 'https://www.cisa.gov/topics/industrial-control-systems' },
    nist_ai: { name: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    ...africanContext.AFRICAN_LINKS
};

const CATEGORY_DEPTH = {
    'offensive-tools': {
        coreIdeas: [
            'Know the enemy by how they move and talk — tooling, slang, and attack chains',
            'Tool purpose, typical operator workflow, and tell-tale artifacts in logs/EDR',
            'Map techniques to ATT&CK so local SOCs share a common language',
            'Popular frameworks leave detectable footprints when you know what to hunt',
            'Tooling footprints in African SME logs look the same: odd DNS, beacon timing, LSASS-class access',
            'Purple-team skill: describe the technique, then prove detection and response on artifacts',
            'MITRE ATT&CK mapping: initial access → execution → persistence → lateral movement',
            'Safe lab study vs illegal misuse — TRIBAMS trains defense and purple-team awareness only',
            'Authorization and scope are non-negotiable — TRIBAMS trains defense, not crime'
        ],
        practices: [
            'Use ATT&CK Navigator as a heat map of coverage gaps — not as a live attack plan against the internet',
            'For every tool family, name the workflow step it serves and the log source that would show it',
            'Study artifacts (process trees, beacon cadence, credential-store access), not marketing names',
            'Hunt living-off-the-land and identity abuse; do not wait for a named APT story',
            'Never practice offensive tooling on systems you do not own or have written permission to test',
            'Keep live procedures in consented isolated labs outside this product; here you grade judgment on artifacts'
        ],
        links: ['mitre_attack', 'mitre_navigator', 'cisa', 'nist_800_61', 'cis_controls']
    },
    'social-engineering': {
        coreIdeas: [
            'Attacks target trust, authority, urgency, and helpfulness — not only technology',
            'OSINT makes pretexting personal and convincing',
            'Verification culture beats “smart users” alone'
        ],
        practices: [
            'Out-of-band verification for payment, MFA, and credential changes',
            'Report-phish buttons and positive coaching (not shame)',
            'Help-desk identity proofing stronger than name/manager trivia'
        ],
        links: ['cisa_phishing', 'mitre_attack', 'nist_csf', 'enisa']
    },
    malware: {
        coreIdeas: [
            'Modern malware blends living-off-the-land with credential theft and ransomware',
            'Detection needs behavior + identity signals, not signatures alone',
            'Backup integrity is part of malware defense'
        ],
        practices: [
            'EDR isolation playbooks and least-privilege endpoints',
            'Application allowlisting where feasible',
            'Immutable / offline backup testing on a schedule'
        ],
        links: ['cisa_ransomware', 'mitre_attack', 'nist_800_61', 'cis_controls']
    },
    network: {
        coreIdeas: [
            'Flat networks amplify blast radius after initial access',
            'Identity is now a primary network control plane',
            'East-west traffic needs segmentation and monitoring'
        ],
        practices: [
            'Segment critical systems; deny-by-default east-west where possible',
            'Protect privileged protocols (RDP/SMB/WinRM) and admin paths',
            'Centralize logs with time sync for investigation'
        ],
        links: ['nist_csf', 'cis_controls', 'mitre_attack', 'cisa']
    },
    cloud: {
        coreIdeas: [
            'Misconfiguration and over-privileged identities cause many cloud breaches',
            'Shared responsibility does not remove customer IAM/data duties',
            'Short-lived credentials beat long-lived keys'
        ],
        practices: [
            'Enforce MFA, SSO, and just-in-time admin elevation',
            'Block public storage by default; continuous posture checks',
            'CloudTrail/activity logging retained and alerted'
        ],
        links: ['nist_cloud', 'cis_controls', 'owasp_top10', 'cisa']
    },
    forensics: {
        coreIdeas: [
            'Order of volatility and chain of custody make evidence usable',
            'IR is a team sport: tech + legal + comms',
            'Containment can happen while collecting evidence',
            'ATT&CK IDs on tickets are how blue and red share a language',
            'Universal hunt footprints: odd DNS, beacon-like timing, credential-store access',
            'Living-off-the-land and 02:00 admin binaries beat malware-name hunting on African SME gear',
            'Purple loop: after a technique is named, show detection and response — then cut dwell time',
            'Responders stay inside authorization: imaging or scanning systems you do not own is still unlawful'
        ],
        practices: [
            'Follow a written IR plan with severity definitions',
            'Preserve volatile data when safe; document every action',
            'Run tabletop exercises quarterly',
            'Ask SIEM-class questions of authorized logs (parent-child, DNS cadence, process access) — do not detonate samples on the analyst PC',
            'Prefer portable detection logic over one vendor screenshot; prove it on workbench artifacts',
            'Break lateral movement and revoke sessions when initial access already happened'
        ],
        links: ['nist_800_61', 'mitre_attack', 'mitre_navigator', 'cisa', 'enisa']
    },
    governance: {
        coreIdeas: [
            'Controls must map to risk, law, and business objectives',
            'Exceptions need owner, expiry, and compensating controls',
            'Privacy and security requirements overlap but are not identical'
        ],
        practices: [
            'Maintain asset inventory and data classification',
            'Track risk register with treatment decisions',
            'Evidence-ready policies and control testing'
        ],
        links: ['nist_csf', 'nist_800_53', 'gdpr', 'iso27001', 'pci', 'hipaa', 'au_malabo', 'popia', 'cran']
    },
    emerging: {
        coreIdeas: [
            'New tech introduces novel abuse paths (prompt injection, OT safety, post-quantum risk)',
            'Inventory and crypto-agility matter before crises',
            'Safety and availability can outweigh confidentiality in OT'
        ],
        practices: [
            'Threat-model AI tools with tool/privilege boundaries',
            'Segment OT/ICS from IT; monitor with OT-aware practices',
            'Plan cryptographic transition for long-lived sensitive data'
        ],
        links: ['nist_ai', 'nist_zero_trust', 'ics_cert', 'enisa', 'cisa', 'itu_africa']
    }
};

// Inject African ops ideas into every category's core list
for (const [cat, depth] of Object.entries(CATEGORY_DEPTH)) {
    const africa = africanContext.getCategoryAfrica(cat);
    if (africa?.concepts?.[0]) {
        depth.coreIdeas = [...depth.coreIdeas, africa.concepts[0]];
    }
    if (!depth.links.includes('cran') && cat !== 'offensive-tools') {
        depth.links = [...depth.links, 'itu_africa'];
    }
}

function pickLinks(keys) {
    return keys.map(k => TRUSTED_LINKS[k]).filter(Boolean);
}

function buildStudyGuide(module, options = {}) {
    const name = module.name;
    const cat = module.category || 'network';
    const depth = CATEGORY_DEPTH[cat] || CATEGORY_DEPTH.network;
    const links = pickLinks(depth.links);
    const rank = progressiveContent.normalizeRank(options.rank || options.overall_level || 'beginner');
    const env = progressiveContent.getEnvironment(rank);

    // Module-specific enrichment hooks (African overlay applied)
    const extras = moduleExtras(module);

    const linkMd = links.concat(extras.links || []).map(l =>
        `- [${l.name}](${l.url})`
    ).join('\n');

    const progressiveMd = progressiveContent.buildProgressiveMarkdown(module, rank);
    const modDef = moduleDefinitions.getModuleDefinition(module);

    const content = `# ${name} — Tribams Professional Study Guide

> **Your rank:** ${env.label} · **Training environment:** ${env.environment}

## What this module is
**Definition:** ${modDef.definition}

${modDef.summary}

*${modDef.hook}*

## 1. Why this module matters
${name} sits at the intersection of technology, human behavior, and business risk — especially for African organisations facing WhatsApp-first fraud, mobile-money risk, and lean IT teams. In Tribams you train the way operations teams work: incomplete information, time pressure, and decisions that must be defended later to leadership, auditors, or regulators.

**Beginner foundation (always available):** ${env.setting}

${trainingPhases.studyGuidePhaseBanner(module)}

${extras.why || `${name} failures often start small (a click, a misconfig, a skipped verification) and escalate into credential theft, data exposure, or service disruption.`}
${africanContext.africanGuideSection(name)}

## 2. Learning objectives
By the end of this guide and its drills you should be able to:
- Explain the primary threat patterns associated with **${name}**
- Choose first-response actions that reduce blast radius
- Apply least privilege, verification, and evidence-minded habits
- Map controls to recognized frameworks (NIST / CIS / relevant regulation)
- Communicate risk in plain language to non-technical stakeholders

## 3. Core concepts
${depth.coreIdeas.map((c, i) => `${i + 1}. ${c}`).join('\n')}
${extras.concepts ? extras.concepts.map((c, i) => `${depth.coreIdeas.length + i + 1}. ${c}`).join('\n') : ''}

## 4. Attacker narrative (what “good” looks like to adversaries)
Adversaries targeting ${name} typically:
1. Reconnoiter people, systems, and trust relationships
2. Gain an initial foothold with the cheapest reliable method
3. Escalate privileges and move toward high-value data or disruption
4. Maintain persistence and cover tracks when possible

Use [MITRE ATT&CK](${TRUSTED_LINKS.mitre_attack.url}) language when describing techniques during drills — it is an industry-shared vocabulary, not a vendor pitch.

## 5. Defender playbook (operational checklist)
### Prevent
${depth.practices.map(p => `- ${p}`).join('\n')}
${extras.prevent ? extras.prevent.map(p => `- ${p}`).join('\n') : ''}

### Detect
- Alert on impossible travel, unusual privilege use, anomalous automation, and known bad patterns
- Keep logs centralized, time-synchronized, and retained long enough for investigations
- Tune detections — do not silently disable critical coverage under alert fatigue

### Respond
1. **Stabilize / contain** active harm
2. **Preserve** evidence when safe
3. **Eradicate** attacker access (accounts, tokens, persistence)
4. **Recover** from known-good backups/images
5. **Learn** with owners and deadlines

Reference: [NIST SP 800-61](${TRUSTED_LINKS.nist_800_61.url})

## 6. Decision standards under pressure
When urgency, authority, or fear show up:
- Verify identity on a known-good channel
- Prefer dual control for irreversible actions (payments, privilege grants, production changes)
- Prefer reversible containment over destructive panic
- Write down what you knew and why you chose an action

## 7. Psychology of compromise (real-life human factors)
Attackers do not only hack systems — they hack **states of mind**:
- **Authority bias**: “The CEO / IT / police said so”
- **Urgency hijack**: artificial deadlines that short-circuit dual control
- **Fatigue & night-shift risk**: 02:00 decisions are lower quality — build process, not heroics
- **Reciprocity & likability**: helpful strangers who “already did you a favor”
- **Fear of looking incompetent**: skipping escalation to avoid “crying wolf”
- **Normalcy bias**: “It can’t be that bad” while lateral movement continues

**Life application:** The same habits protect family mobile-money scams, romance fraud, fake delivery SMS, bursary phishing, and workplace BEC on WhatsApp. A ready African cyber force is calm under social pressure — at work and at home.

## 8. Future threat horizon (train for what is coming)
Assume the next five years will normalize:
- **Deepfake voice/video** used in approval calls and helpdesk resets
- **AI-assisted spear phishing** that reads your public posts and tickets in seconds
- **Identity-first breaches** where the “network” is wherever your tokens work
- **Supply-chain and API abuse** that bypasses traditional perimeter tools
- **OT / safety-impacting** incidents where availability beats confidentiality

Your Tribams drills intentionally mix incomplete information with timers so you rehearse judgment — not copy-paste answers from an AI assistant during exams.

## 9. Mini case study
${extras.caseStudy || `A mid-size organization ignored early ${name}-related alerts because “it looked noisy.” Within hours, the same pathway enabled credential reuse and lateral movement. The post-incident finding was not a missing tool — it was missing ownership, escalation criteria, and rehearsal.`}

${extras.futureScenario ? `### Future inject\n${extras.futureScenario}` : ''}

**Questions for reflection**
- What signal should have forced escalation?
- Which compensating control would have limited blast radius?
- How would you brief an executive in 90 seconds?
- What would you tell a family member facing the same social pressure?
${progressiveMd}
## 10. Hands-on Tribams path
1. Read this guide (beginner foundation${rank !== 'beginner' ? ` + your **${env.label}** unlock layers` : ''})
2. Complete **Guided Practice** (learn with feedback)
3. Run the **Timed Live Drill** (judgment under pressure — no external AI)
4. Attempt today’s **Cyber Range** scenario for this domain
5. If listed in resources: complete the **Evidence Workbench** lab (artifact-based decisions)
6. Write one essay as if submitting to a SOC lead / risk committee
7. Pass **65% of modules** at 70%+ to unlock Field Analyst content; raise average for Mission-Ready layers

## 11. Trusted references (non-commercial standards & public agencies)
${linkMd}

> Tribams links only to public standards bodies, government agencies, and non-profit security projects. We do not send learners to competing commercial academies.

## 12. Knowledge check prompts
- What is the first safe action if ${name} impact is actively spreading?
- Which log sources prove who did what, and are they integrity-protected?
- What exception process applies if a patch/control cannot be applied today?
- Which psychological trap would make *you* most likely to fail this module under stress?
`;

    const moduleLabs = getLabsForModule(module.id) || [];
    const labResources = moduleLabs.map((lab) => ({
        name: `Evidence Workbench: ${lab.title}`,
        url: `/lab?lab=${encodeURIComponent(lab.id)}`,
        type: 'lab'
    }));

    const resources = [
        { name: `${name} Study Guide (PDF)`, url: `/api/module/${module.id}/pdf-guide`, type: 'guide' },
        { name: `${name} Guided Practice`, url: `/training/${module.id}?tab=practice`, type: 'lab' },
        { name: `${name} Timed Drill`, url: `/training/${module.id}?tab=quiz`, type: 'assessment' },
        { name: `${name} Cyber Range`, url: `/scenario?module=${module.id}`, type: 'lab' },
        ...labResources,
        ...links.slice(0, 4).map(l => ({ name: l.name, url: l.url, type: 'external' }))
    ];

    const tierEssays = getTierAEssays(module.id) || getTierBEssays(module.id) || getTierCEssays(module.id);
    const toolkitEssays = getToolkitEssayQuestions(module);
    const specialEssays = getSpecialOpsEssayQuestions(module);
    const defaultEssays = [
        {
            question: `You are the incident commander for a live ${name} event. Stakeholders demand updates every 5 minutes. Write an operational response plan covering containment, evidence, communications, and recovery priorities.`,
            guidelines: 'Professional runbook format: phases, owners, decision criteria, and unsafe actions to avoid under pressure.'
        },
        {
            question: `Translate a red-team finding about ${name} into a board-ready brief: business risk, compensating controls, and a 30/60/90-day remediation plan mapped to NIST CSF functions.`,
            guidelines: 'Use risk language, residual risk, effort/impact, and measurable success criteria. Cite public frameworks where relevant.'
        },
        {
            question: `Design a tabletop exercise for ${name} that stresses human factors (urgency, authority bias, incomplete information). Include injects, expected actions, and a scoring rubric.`,
            guidelines: 'Focus on judgment quality and process adherence, not trivia recall.'
        },
        {
            question: `Describe a near-future ${name} scenario involving AI-assisted social engineering or deepfake verification failure. Explain how you would coach a colleague (or family member) through the first 10 minutes without panicking.`,
            guidelines: 'Include psychological traps, verification steps, and what not to do under fear or authority pressure.'
        },
        {
            question: `Write a learner debrief for ${name}: what mental model should stick after the drill, which control you would not skip under pressure, and how an institution should record the result on an account-bound transcript.`,
            guidelines: 'Education-grade reflection. Name owners, evidence, and why certificates must match the scored account.'
        },
        {
            question: `An institution in your region wants ${name} training for mixed junior and senior staff. Propose how to assess them fairly: practice length, timed drill, essay, and what “pass” should mean for a certificate.`,
            guidelines: 'Do not recommend fake scores. Explain why short 5-question quizzes are not enough for a professional record.'
        }
    ];
    const essayQuestions = (tierEssays
        ? [...tierEssays, ...defaultEssays]
        : (specialEssays || toolkitEssays || defaultEssays)
    ).slice();
    const seen = new Set();
    const unique = [];
    for (const q of essayQuestions) {
        const key = String(q && q.question ? q.question : q).slice(0, 80);
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(q);
    }
    let extra = 0;
    while (unique.length < 5 && extra < defaultEssays.length) {
        const q = defaultEssays[extra++];
        const key = String(q.question).slice(0, 80);
        if (seen.has(key)) continue;
        seen.add(key);
        unique.push(q);
    }

    return {
        content,
        resources,
        essayQuestions: unique.slice(0, 8),
        rank,
        rank_label: env.label,
        environment: env.environment
    };
}

function depthLinks(id) {
    const byId = {
        1: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.mitre_attack],
        2: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        3: [TRUSTED_LINKS.cis_controls, TRUSTED_LINKS.mitre_attack],
        4: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.cis_controls],
        5: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_800_63],
        6: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.cis_controls],
        7: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.cisa],
        8: [TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.cisa],
        9: [TRUSTED_LINKS.nist_csf, TRUSTED_LINKS.cis_controls],
        10: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.mitre_attack],
        11: [TRUSTED_LINKS.cisa_ransomware, TRUSTED_LINKS.nist_800_61],
        12: [TRUSTED_LINKS.gdpr, TRUSTED_LINKS.nist_800_53],
        13: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.cis_controls],
        14: [TRUSTED_LINKS.owasp_top10, TRUSTED_LINKS.cis_controls],
        15: [TRUSTED_LINKS.owasp_asvs, TRUSTED_LINKS.nist_800_53],
        16: [TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.cisa],
        17: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.enisa],
        18: [TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        19: [TRUSTED_LINKS.nist_800_63, TRUSTED_LINKS.cis_controls],
        20: [TRUSTED_LINKS.nist_800_53, TRUSTED_LINKS.cisa],
        21: [TRUSTED_LINKS.nist_zero_trust, TRUSTED_LINKS.cis_controls],
        22: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_csf],
        23: [TRUSTED_LINKS.owasp_api, TRUSTED_LINKS.owasp_asvs],
        24: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.cis_controls],
        25: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.cis_controls],
        26: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.cis_controls],
        27: [TRUSTED_LINKS.nist_ai, TRUSTED_LINKS.owasp_top10],
        28: [TRUSTED_LINKS.nist_800_53, TRUSTED_LINKS.cisa],
        29: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_csf],
        30: [TRUSTED_LINKS.ics_cert, TRUSTED_LINKS.cisa],
        31: [TRUSTED_LINKS.hipaa, TRUSTED_LINKS.nist_800_53],
        32: [TRUSTED_LINKS.pci, TRUSTED_LINKS.cis_controls],
        33: [TRUSTED_LINKS.pci, TRUSTED_LINKS.owasp_top10],
        34: [TRUSTED_LINKS.cis_controls, TRUSTED_LINKS.nist_800_53],
        35: [TRUSTED_LINKS.cis_controls, TRUSTED_LINKS.cisa],
        36: [TRUSTED_LINKS.nist_csf, TRUSTED_LINKS.cisa_ransomware],
        37: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.cisa],
        38: [TRUSTED_LINKS.nist_csf, TRUSTED_LINKS.cis_controls],
        39: [TRUSTED_LINKS.cis_controls, TRUSTED_LINKS.cisa],
        40: [TRUSTED_LINKS.owasp_asvs, TRUSTED_LINKS.mitre_attack],
        41: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_61],
        42: [TRUSTED_LINKS.nist_csf, TRUSTED_LINKS.cis_controls, TRUSTED_LINKS.mitre_attack],
        43: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.nist_800_61],
        44: [TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.cisa],
        45: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_800_61],
        46: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        47: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        48: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        49: [TRUSTED_LINKS.owasp_top10, TRUSTED_LINKS.owasp_asvs],
        50: [TRUSTED_LINKS.owasp_top10, TRUSTED_LINKS.mitre_attack],
        51: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        52: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_61],
        53: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        54: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_63],
        55: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_63],
        56: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_63],
        57: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.cis_controls],
        58: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        59: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        60: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_63],
        61: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        62: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        63: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.mitre_attack],
        64: [TRUSTED_LINKS.owasp_top10, TRUSTED_LINKS.mitre_attack],
        65: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.mitre_attack],
        66: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.mitre_attack],
        67: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.cisa],
        68: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.cis_controls],
        69: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.mitre_attack],
        70: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        71: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.mitre_attack],
        72: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        73: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_61],
        74: [TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.mitre_attack],
        75: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        76: [TRUSTED_LINKS.cisa_ransomware, TRUSTED_LINKS.mitre_attack],
        77: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        78: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.owasp_top10],
        79: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        80: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        81: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        82: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        83: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cis_controls],
        84: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        85: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_61],
        86: [TRUSTED_LINKS.cisa_phishing, TRUSTED_LINKS.cisa],
        87: [TRUSTED_LINKS.nist_ai, TRUSTED_LINKS.mitre_attack],
        88: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.mitre_attack],
        89: [TRUSTED_LINKS.nist_cloud, TRUSTED_LINKS.cis_controls],
        90: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_csf],
        91: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.mitre_attack],
        92: [TRUSTED_LINKS.cisa, TRUSTED_LINKS.cis_controls],
        93: [TRUSTED_LINKS.ics_cert, TRUSTED_LINKS.cisa],
        94: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa],
        95: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.nist_800_61],
        96: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.mitre_navigator, TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.cisa],
        97: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.mitre_navigator, TRUSTED_LINKS.nist_800_61, TRUSTED_LINKS.cisa]
    };
    return (byId[id] || [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa]).filter(Boolean);
}

function moduleExtras(module) {
    const id = module.id;
    const cat = module.category || 'network';
    let base;
    const tier = TIER_A_EXTRAS[id] || TIER_B_EXTRAS[id] || TIER_C_EXTRAS[id];
    const special = getSpecialOpsExtras(module);
    if (special) {
        base = {
            ...special,
            links: depthLinks(id)
        };
    } else if (tier) {
        base = {
            ...tier,
            links: depthLinks(id)
        };
    } else {
        const toolkit = getToolkitExtras(module);
        if (toolkit) {
            base = {
                ...toolkit,
                links: [TRUSTED_LINKS.mitre_attack, TRUSTED_LINKS.cisa, TRUSTED_LINKS.nist_800_61].filter(Boolean)
            };
        } else if (module.category === 'offensive-tools' || module.access_tier === 'pro_plus') {
            base = {
                why: `Defenders must understand the tools adversaries use — how they move, talk, and chain techniques — or they will only see noise.`,
                concepts: [
                    `Tool purpose, typical operator workflow, and tell-tale artifacts in logs/EDR`,
                    `MITRE ATT&CK mapping: initial access → execution → persistence → lateral movement`,
                    `Safe lab study vs illegal misuse — Tribams trains defense and purple-team awareness only`
                ],
                prevent: [
                    'Detect behavioral patterns, not only signatures of one binary name',
                    'Hunt for living-off-the-land and credential abuse paths',
                    'Purple-team: emulate the technique, then prove your controls fire'
                ],
                caseStudy: `Operators often rename or proxy popular tools. Knowing the technique (not just the brand name) is what lets SOC analysts catch the move.`,
                futureScenario: `An AI-assisted attacker generates variant scripts of a classic tool chain. Your edge is recognizing the language of the attack — callbacks, staging, privilege steps — not memorizing one hash.`,
                links: [TRUSTED_LINKS.mitre_attack || TRUSTED_LINKS.owasp_top10].filter(Boolean)
            };
        } else {
            const map = {
                4: {
                    why: 'Cloud breaches frequently stem from identity sprawl and public resource exposure rather than “novel zero-days.”',
                    concepts: ['Shared responsibility model', 'CSPM / CIEM thinking for posture and entitlements'],
                    prevent: ['Disable long-lived access keys when feasible', 'Account/OU separation for production'],
                    futureScenario: 'An agentic AI tool with over-broad cloud roles “helpfully” exports a bucket for debugging. Short-lived least privilege would have contained blast radius.',
                    links: [TRUSTED_LINKS.nist_cloud]
                },
                12: {
                    why: 'Privacy incidents create legal clocks (GDPR and African DP regimes such as POPIA-style rules) alongside technical work.',
                    links: [TRUSTED_LINKS.gdpr, TRUSTED_LINKS.au_malabo, TRUSTED_LINKS.popia].filter(Boolean)
                },
                23: {
                    why: 'APIs expose business logic at scale; broken authZ and excessive data exposure are common.',
                    links: [TRUSTED_LINKS.owasp_api, TRUSTED_LINKS.owasp_asvs]
                },
                27: {
                    why: 'AI systems introduce prompt injection, data leakage through tools, and model supply-chain risk.',
                    futureScenario: 'A helpful internal chatbot follows a poisoned document and tries to exfiltrate secrets via a connected plugin. Tool boundaries and human approval gates are the control.',
                    links: [TRUSTED_LINKS.nist_ai]
                },
                30: {
                    why: 'OT/ICS incidents can threaten safety and availability, not only confidentiality.',
                    links: [TRUSTED_LINKS.ics_cert]
                },
                31: {
                    links: [TRUSTED_LINKS.hipaa]
                },
                32: {
                    links: [TRUSTED_LINKS.pci]
                }
            };
            base = map[id] || { links: [] };
        }
    }
    return africanContext.mergeAfricanExtras(base, cat);
}

module.exports = { buildStudyGuide, TRUSTED_LINKS };
