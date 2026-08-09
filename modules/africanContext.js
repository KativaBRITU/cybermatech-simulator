/**
 * African cyber operations context for TRIBAMS (tribams.com).
 * Namibia-first, Africa-wide — study overlays, quiz injects, trusted regional links.
 */

const AFRICAN_LINKS = {
    itu_africa: {
        name: 'ITU — Cybersecurity in Africa',
        url: 'https://www.itu.int/en/ITU-D/Cybersecurity/Pages/default.aspx'
    },
    au_malabo: {
        name: 'African Union — Malabo Convention (cybersecurity & data protection)',
        url: 'https://au.int/en/treaties/african-union-convention-cyber-security-and-personal-data-protection'
    },
    cran: {
        name: 'CRAN — Communications Regulatory Authority of Namibia',
        url: 'https://www.cran.na/'
    },
    interpol_africa: {
        name: 'INTERPOL — African Cyberthreat Assessment',
        url: 'https://www.interpol.int/en/Crimes/Cybercrime'
    },
    popia: {
        name: 'South Africa POPIA (Information Regulator)',
        url: 'https://inforegulator.org.za/'
    },
    ndpa_ng: {
        name: 'Nigeria Data Protection Act / NDPC',
        url: 'https://ndpc.gov.ng/'
    }
};

function q(question, options, correct, explanation, topic = 'africa-ops', time = 40) {
    return { question, options, correct, explanation, topic, time_expected: time };
}

/**
 * Per-category African study + quiz overlay.
 * Study fields merge into module extras; quiz questions prepend into drill pools.
 */
const CATEGORY_AFRICA = {
    'social-engineering': {
        why: 'Across Africa, WhatsApp, USSD, mobile-money, and SMS are primary attack surfaces — not only corporate email. Authority fraud often impersonates permanent secretaries, bank relationship managers, pastors, or “HR payroll”.',
        concepts: [
            'Mobile-first social engineering: WhatsApp voice notes, SMS bursary/tax scams, fake delivery OTPs',
            'BEC against ministries, parastatals, and SMEs using N$ / local-currency urgency',
            'Community trust abuse: church, stokvel, campus, and family networks as pretext channels'
        ],
        prevent: [
            'Out-of-band verification on known office numbers — never inside the same WhatsApp thread',
            'Dual control for payments above a clear N$ threshold',
            'Staff drills using local languages and local brand spoofs, not only English email samples'
        ],
        caseStudy: 'A Windhoek SME nearly paid a “supplier in Walvis Bay” after a spoofed WhatsApp from a director at a coastal conference. The save was a callback to the director’s known number — the conference hotel Wi-Fi had nothing to do with trust.',
        futureScenario: 'Deepfake audio of a CEO speaking lightly accented English and local slang demands an urgent forex payment before SARB/BoN cut-off. Verification culture beats vocal familiarity.',
        quiz: [
            q(
                'A “Bank of Namibia compliance” SMS asks a staffer to “unlock salary” via a short link. Best response?',
                [
                    'Open it on mobile data so it is not on office Wi-Fi',
                    'Ignore the link; use the bank’s official app/site from a bookmark or known URL',
                    'Reply STOP and then click to confirm',
                    'Forward to the whole company WhatsApp so others can check'
                ],
                1,
                'African smishing clones banks and regulators. Navigate only via known apps/bookmarks.',
                'smishing-africa'
            ),
            q(
                'Mobile-money agent fraud is rising. Which control best protects a small trader?',
                [
                    'Share the PIN with the agent “only for today”',
                    'Never share PIN/OTP; confirm recipient name/number yourself before sending',
                    'Send first, dispute later — MoMo always refunds',
                    'Screenshot the chat and pay immediately'
                ],
                1,
                'PIN/OTP secrecy and recipient confirmation are core mobile-money hygiene continent-wide.',
                'mobile-money'
            )
        ]
    },
    malware: {
        why: 'African orgs often mix Windows SMBs, shared PCs, and late patch cycles. Ransomware and stealers arrive via “invoice”, “tender”, and “port clearance” documents — and hit logistics, clinics, and municipalities hard.',
        concepts: [
            'Document-borne malware via tender/invoice macros still works where allowlisting is rare',
            'Shared admin accounts on shop-floor and clinic PCs amplify blast radius',
            'Offline/immutable backups matter when bandwidth and spare hardware are limited'
        ],
        prevent: [
            'Block office macros from the internet; prefer protected view',
            'Separate finance/clinic workstations from guest browsing',
            'Test restores quarterly — a backup that never restored is hope, not a control'
        ],
        caseStudy: 'A Walvis Bay logistics firm opened a “port clearance.xlsx”. DNS beacons followed. Isolation of the host and blocking the rare TLD stopped the wave before invoices and shipping schedules were encrypted.',
        quiz: [
            q(
                'An African SME has one server that is also the backup target on the same share. Main problem?',
                [
                    'Nothing — same-share backups are best practice',
                    'Ransomware that reaches the server can encrypt live data and backups together',
                    'It only matters for Linux',
                    'Cloud is illegal so this is required'
                ],
                1,
                'Offline or immutable backups break the ransomware kill-chain when on-site hardware is limited.',
                'backups-africa'
            )
        ]
    },
    network: {
        why: 'Many African enterprises still run flat VLANs spanning guest Wi-Fi, CCTV, and OT/engineering. Mining, ports, and utilities need segmentation as much as banks do.',
        concepts: [
            'Flat networks in plants, campuses, and municipalities expand lateral movement',
            'VPN + weak MFA is a common remote-access weak point for diaspora admins',
            'Power and connectivity constraints make resilient remote admin paths essential'
        ],
        prevent: [
            'Segment guest, corporate, and OT/ICS; require jump hosts for engineering changes',
            'Protect RDP/SMB; prefer MFA VPN or zero-trust access',
            'Centralize logs even if on a small SIEM or well-kept syslog — time sync matters'
        ],
        caseStudy: 'A Swakopmund mining contractor put engineering workstations on the same VLAN as guest Wi-Fi “temporarily”. Temporary became permanent until a red-team walk showed guest-to-OT paths.',
        quiz: [
            q(
                'Guest Wi-Fi can reach an engineering PLC subnet. Priority fix?',
                [
                    'Change the guest password only',
                    'Segment OT from IT/guest and control engineering access via jump host',
                    'Disable all firewalls to improve speed',
                    'Move PLCs to public cloud without controls'
                ],
                1,
                'OT/IT segmentation is the African industrial control priority — password changes are not enough.',
                'ot-segment'
            )
        ]
    },
    cloud: {
        why: 'African startups and banks adopt SaaS and public cloud quickly — often with default-open storage and long-lived access keys. Misconfiguration, not exotic zero-days, drives many breaches.',
        concepts: [
            'Public buckets exposing ID scans, claims PDFs, and KYC packs',
            'Shared cloud admin accounts across vendors and freelancers',
            'Data residency and cross-border processing expectations under local privacy laws'
        ],
        prevent: [
            'Block public storage by default; continuous posture scanning',
            'SSO + MFA; short-lived credentials for automation',
            'Know where citizen/customer data sits (region) and who can export it'
        ],
        caseStudy: 'A Namibian insurer’s claims bucket was left public. A researcher disclosed responsibly. Closing the bucket, rotating keys, and reviewing access logs beat quiet panic.',
        quiz: [
            q(
                'KYC documents for African bank customers are in a public cloud bucket. First action?',
                [
                    'Leave it — researcher already knows',
                    'Make private immediately, rotate exposed credentials, assess access, follow notification duties',
                    'Delete without checking logs',
                    'Move to another public bucket in Europe'
                ],
                1,
                'Close exposure, rotate secrets, scope the leak, meet legal/ethical notification — standard cloud IR.',
                'cloud-kyc'
            )
        ]
    },
    forensics: {
        why: 'African SOCs often balance scarce senior analysts, outsourced ISPs, and executives who travel. Containment cannot wait for a CEO keynote in Cape Town or Dubai.',
        concepts: [
            'Preserve ISP/VPN/EDR logs early — retention windows can be short',
            'Evidence handling still matters for police / INTERPOL cooperation',
            'Communications plans for customers who use USSD and WhatsApp support channels'
        ],
        prevent: [
            'Written IR severity levels with who can isolate without executive approval',
            'Retain VPN and identity logs long enough for investigations',
            'Practice tabletops with realistic travel and power-outage injects'
        ],
        caseStudy: 'A Windhoek bank SOC saw after-hours VPN from a residential ISP and a staged payment file while the CEO was at a coastal conference. Disabling the session and quarantining the host came first — approval theatre came second.',
        quiz: [
            q(
                'CEO is unreachable; ransomware encryption just started on file shares. Best first move?',
                [
                    'Wait for CEO approval before any action',
                    'Isolate affected hosts/accounts per IR plan, preserve logs, escalate — do not wait on travel',
                    'Pay the ransom immediately from petty cash',
                    'Post on Facebook that you were hacked'
                ],
                1,
                'IR plans must authorize containment without executive presence — especially with travel-heavy leadership.',
                'ir-africa'
            )
        ]
    },
    governance: {
        why: 'African privacy and cyber laws are maturing (AU Malabo Convention, POPIA, NDPA, and national rules). Boards still need plain-language risk — not only EU GDPR copy-paste.',
        concepts: [
            'Data protection duties for citizen and customer data under African frameworks',
            'SME tender requirements increasingly ask for basic cyber hygiene evidence',
            'Sector rules: banking, health, telecom regulators expect measurable controls'
        ],
        prevent: [
            'Classify data; know what personal data you hold and where',
            'Map controls to both global good practice (NIST/CIS) and local legal clocks',
            'Keep evidence for audits and tender questionnaires ready'
        ],
        caseStudy: 'An SME won a ministry tender but nearly failed onboarding for lacking MFA on email and tested backups. A two-week hygiene sprint unblocked the portal access.',
        quiz: [
            q(
                'Which starter set best fits a Namibian/African SME preparing for a government portal?',
                [
                    'Buy a full SIEM before any MFA',
                    'MFA on email/admin, patch internet-facing systems, tested backups, phishing awareness',
                    'Only antivirus; skip backups',
                    'One shared admin password for the whole office'
                ],
                1,
                'Foundational hygiene wins tenders and reduces real risk before expensive platforms.',
                'sme-hygiene'
            ),
            q(
                'Why mention AU Malabo / POPIA-style duties in African training?',
                [
                    'They replace NIST entirely',
                    'Learners must connect technical controls to African legal and citizen-trust expectations',
                    'They ban cloud forever',
                    'They only apply to Europe'
                ],
                1,
                'Global frameworks plus African legal context is Tribams’ positioning edge.',
                'africa-law'
            )
        ]
    },
    emerging: {
        why: 'Africa’s leapfrog to mobile and AI means deepfakes, AI phishing, and API abuse hit markets that skipped older controls. Train for synthetic media and identity-first attacks now.',
        concepts: [
            'Deepfake CEO/pastor/politician fraud on Facebook and WhatsApp Status',
            'AI-written spear phish in English, Afrikaans, Oshiwambo, and other local languages',
            'OT and smart-city projects importing insecure IoT at scale'
        ],
        prevent: [
            'Verification rules for any video/voice payment or HR instruction',
            'AI tool boundaries: no secrets in prompts; human approval for money moves',
            'Inventory and segment IoT/OT before “smart” deployments'
        ],
        caseStudy: 'A deepfake video of a Namibian CEO urged gift-card purchases for a “surprise audit”. Internal comms killed it: no finance actions from social video; verify on known channels.',
        quiz: [
            q(
                'Staff see a perfect video of the CEO demanding gift cards on Facebook. Correct action?',
                [
                    'Comply — video quality proves authenticity',
                    'Internal alert: no financial action from social video; verify via known internal channels; report for takedown',
                    'Argue in the comments',
                    'Disable the company forever'
                ],
                1,
                'Deepfake BEC is rising in African markets — process beats pixel perfection.',
                'deepfake-africa'
            )
        ]
    },
    'offensive-tools': {
        why: 'African purple teams must recognize the same global toolchains (scans, C2, credential theft) when they appear on local ISP ranges, university labs, and outsourced admin jump boxes — always with legal authorization.',
        concepts: [
            'Tooling footprints in African SME logs look the same: odd DNS, beacon timing, LSASS touches',
            'Authorization and scope are non-negotiable — Tribams trains defense, not crime',
            'Map techniques to ATT&CK so local SOCs share a common language'
        ],
        prevent: [
            'Hunt behaviors (beacons, privilege abuse), not only AV tool names',
            'Lock down admin workstations used by remote contractors',
            'Practice detection in lab ranges you own or are contracted to test'
        ],
        caseStudy: 'A Gaborone SOC mistook a rename of a common credential dumper for “unknown malware”. ATT&CK mapping to credential access behaviors caught the operator on the second host.',
        quiz: [
            q(
                'You see LSASS access and lateral SMB from a helpdesk jump box in Lusaka. Best framing?',
                [
                    'Ignore — Africa does not get APT tradecraft',
                    'Treat as credential access / lateral movement; isolate, reset credentials, hunt with ATT&CK language',
                    'Only reimage without collecting evidence',
                    'Post IOCs on TikTok first'
                ],
                1,
                'Tradecraft is global. African SOCs win with the same technique-based response discipline.',
                'purple-africa'
            )
        ]
    }
};

function getCategoryAfrica(category) {
    return CATEGORY_AFRICA[category] || CATEGORY_AFRICA.network;
}

function getAfricanQuizQuestions(category, moduleName) {
    const block = getCategoryAfrica(category);
    return (block.quiz || []).map((item) => ({
        ...item,
        question: item.question.startsWith('[')
            ? item.question
            : `[Africa · ${moduleName}] ${item.question}`
    }));
}

function getAfricanStudyOverlay(category) {
    const block = getCategoryAfrica(category);
    return {
        why: block.why,
        concepts: block.concepts || [],
        prevent: block.prevent || [],
        caseStudy: block.caseStudy,
        futureScenario: block.futureScenario,
        links: [
            AFRICAN_LINKS.cran,
            AFRICAN_LINKS.au_malabo,
            AFRICAN_LINKS.itu_africa,
            AFRICAN_LINKS.interpol_africa
        ]
    };
}

/** Merge African overlay onto existing module extras (African case/why win when present). */
function mergeAfricanExtras(extras = {}, category) {
    const africa = getAfricanStudyOverlay(category);
    return {
        ...extras,
        why: africa.why || extras.why,
        concepts: [...(extras.concepts || []), ...(africa.concepts || [])],
        prevent: [...(extras.prevent || []), ...(africa.prevent || [])],
        caseStudy: africa.caseStudy || extras.caseStudy,
        futureScenario: africa.futureScenario || extras.futureScenario,
        links: [...(extras.links || []), ...(africa.links || [])]
    };
}

function africanGuideSection(moduleName) {
    return `
## African operations context (Tribams)
TRIBAMS trains for African reality: **WhatsApp-first fraud**, mobile-money risk, ministry and parastatal BEC, SME tender hygiene, mining/port OT exposure, and privacy duties shaped by instruments like the **AU Malabo Convention** and national rules (e.g. POPIA-style regimes).

When you rehearse **${moduleName}**, prefer local injects — Windhoek, Walvis Bay, Lagos, Nairobi, Gaborone, Johannesburg — and ask: would this control still work on intermittent power, shared PCs, and a three-person IT team?
`;
}

module.exports = {
    AFRICAN_LINKS,
    CATEGORY_AFRICA,
    getCategoryAfrica,
    getAfricanQuizQuestions,
    getAfricanStudyOverlay,
    mergeAfricanExtras,
    africanGuideSection
};
