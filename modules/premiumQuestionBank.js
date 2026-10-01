/**
 * Premium judgment scenarios — broader than the study guide.
 * Scenario-rich, ops-floor decisions learners cannot memorize from one module pass.
 */

'use strict';

function q(question, options, correct, explanation, topic, time = 48) {
    return { question, options, correct, explanation, topic, time_expected: time, pool_tier: 'premium' };
}

const PREMIUM_BY_CATEGORY = {
    'social-engineering': [
        q(
            'Friday 16:58 — payroll is Monday. WhatsApp voice note + email both claim the CFO abroad needs beneficiary change. Finance is tired. Your move?',
            [
                'Freeze change; callback on directory number; attach both artifacts to ticket',
                'Approve — dual channel proves authenticity',
                'Reply only on WhatsApp for speed',
                'Forward to intern to handle after weekend'
            ],
            0,
            'Multi-channel BEC still needs out-of-band verify and dual control.',
            'bec_pressure',
            52
        ),
        q(
            'Helpdesk ticket: "Reset MFA — user on video call looks like director." Video quality is poor. Policy requires ticket + manager approval.',
            [
                'Reset immediately; video is enough',
                'Refuse live reset; use approved identity path and log the attempt',
                'Share backup codes in chat to avoid delay',
                'Disable MFA globally until Monday'
            ],
            1,
            'Deepfake/video authority is BEC 2.0 — process beats pixels.',
            'deepfake_helpdesk',
            50
        )
    ],
    malware: [
        q(
            'EDR flags ransomware precursors on finance PC. User still has open SAP session. Backup team says restore takes 6 hours.',
            [
                'Isolate host; preserve memory if safe; revoke sessions; communicate RTO honestly',
                'Reboot immediately to clear malware',
                'Wait for user to finish month-end before isolation',
                'Pay quietly to avoid downtime'
            ],
            0,
            'Containment beats convenience; session revocation limits spread.',
            'ransom_contain',
            55
        ),
        q(
            'Sandbox detonates a "invoice.pdf.exe" — calls home to new domain. Mail gateway still delivers .exe inside zip.',
            [
                'Block IOCs; hunt mailbox rules; tighten attachment policy; notify affected users',
                'Delete the one file and close ticket',
                'Allow zips because finance needs them',
                'Disable antivirus — too many alerts'
            ],
            0,
            'One sample implies a campaign — hunt wider.',
            'malware_campaign',
            50
        )
    ],
    network: [
        q(
            'Branch office shares one firewall with guest Wi‑Fi and POS. Auditor flagged flat network. Budget is zero this quarter.',
            [
                'Document risk; VLAN/guest isolation plan with dated exception and monitoring compensations',
                'Do nothing until budget arrives',
                'Turn off guest Wi‑Fi permanently without alternative',
                'Hide POS on public Wi‑Fi to simplify'
            ],
            0,
            'Compensating controls + time-boxed risk acceptance is professional.',
            'segmentation_budget',
            48
        ),
        q(
            'Impossible travel alert: user in Windhoek and Lagos within 20 minutes. User confirms travel but ticket shows tomorrow.',
            [
                'Force step-up auth; revoke refresh tokens; open credential theft investigation',
                'Close as false positive — user said OK',
                'Disable the user forever without review',
                'Whitelist the country pair permanently'
            ],
            0,
            'Treat as potential session theft until verified.',
            'impossible_travel',
            45
        )
    ],
    cloud: [
        q(
            'Public S3 bucket found with customer exports. Dev says "only for testing." Object ACL shows world-readable for 12 days.',
            [
                'Lock bucket; rotate keys; assess breach notification; fix CI guardrails',
                'Make bucket private and delete logs',
                'Ignore — testing data only without verification',
                'Copy data locally before fixing'
            ],
            0,
            'Assume exposure until proven otherwise; evidence preservation matters.',
            'cloud_exposure',
            52
        )
    ],
    forensics: [
        q(
            'Legal asks for logs while IR team still contains active C2. Retention expires tonight on key index.',
            [
                'Preserve relevant logs first; parallel containment; brief legal on timeline',
                'Stop containment until legal satisfied',
                'Let retention delete — too expensive',
                'Screenshot three alerts and wipe the rest'
            ],
            0,
            'Evidence preservation and containment run together.',
            'legal_vs_contain',
            50
        )
    ],
    governance: [
        q(
            'Ministry audit in 48 hours. Control owner wants to backdate policy signatures.',
            [
                'Refuse falsification; implement real controls; document honest gap plan',
                'Backdate — audit must pass',
                'Delete failed control tests',
                'Blame vendor without evidence'
            ],
            0,
            'Integrity of records is itself a control.',
            'audit_integrity',
            45
        )
    ],
    emerging: [
        q(
            'Internal chatbot with email plugin summarizes a poisoned PDF and tries to send attachments externally.',
            [
                'Disable tool egress; rotate keys; review prompt injection guardrails',
                'Trust the bot — it is internal',
                'Publish the PDF company-wide for transparency',
                'Give the bot domain admin to fix itself'
            ],
            0,
            'AI tool boundaries are authorization problems.',
            'ai_exfil',
            50
        ),
        q(
            'OT vendor wants VPN into plant network for "quick PLC patch" during production run.',
            [
                'Scoped jump host; maintenance window; monitored session; rollback plan',
                'Full VPN domain access — vendor knows best',
                'Patch live during peak production without backup',
                'Email PLC credentials for speed'
            ],
            0,
            'OT changes need safety and availability first.',
            'ot_vendor',
            55
        )
    ],
    'offensive-tools': [
        q(
            'SOC sees encoded PowerShell matching Cobalt-style staging but binary name is "WindowsUpdateHelper.exe".',
            [
                'Behavioral hunt; isolate; map parent/child; assume tool rename',
                'Whitelist because name looks legitimate',
                'Delete the file only and close',
                'Block PowerShell globally forever'
            ],
            0,
            'Defenders hunt techniques — names lie.',
            'c2_behavior',
            50
        ),
        q(
            'Purple-team emulation scheduled. Red wants production AD for "realism." Blue has no extra staff.',
            [
                'Isolated lab with production-like data subset; scoped ROE; measurable detection goals',
                'Full production AD — realism requires it',
                'Cancel purple team entirely',
                'Run tools without telling blue'
            ],
            0,
            'Emulation needs authorization and isolation.',
            'purple_roe',
            48
        )
    ]
};

/** Cross-cutting premium scenarios — valuable on any module */
const PREMIUM_UNIVERSAL = [
    q(
        '[Ops judgment] At 02:40 the only senior analyst is asleep. Critical alert + press inquiry + partial outage. First coordination step?',
        [
            'Assign incident commander; stabilize; facts to comms only when verified',
            'Answer press immediately with technical guesses',
            'Shut all systems off',
            'Wait until business hours'
        ],
        0,
        'Command structure and verified facts beat panic messaging.',
        'night_shift_ic',
        50
    ),
    q(
        '[Ops judgment] Vendor SOC offers to "handle everything" if you share admin creds for the weekend.',
        [
            'Refuse; scoped read-only or supervised session per contract',
            'Share break-glass — they are certified',
            'Disable logging so they work faster',
            'Email creds because ticket system is down'
        ],
        0,
        'Unscoped privileged access is a common breach path.',
        'vendor_trust',
        45
    ),
    q(
        '[Ops judgment] Learner wants certification after copying answers from two easy modules. Platform stance?',
        [
            'Account-bound records; integrity signals; retakes with coaching — no shortcut passes',
            'Pass everyone to grow numbers',
            'Disable all scoring',
            'Sell answer keys as premium'
        ],
        0,
        'Credential value comes from verified judgment, not repetition.',
        'platform_integrity',
        40
    )
];

function getPremiumQuestions(module) {
    const name = module.name || 'Module';
    const cat = module.category || 'network';
    const catQs = (PREMIUM_BY_CATEGORY[cat] || PREMIUM_BY_CATEGORY.network || []).map((item) => ({
        ...item,
        question: item.question.startsWith('[') ? item.question.replace('[Ops judgment]', `[${name}]`) : `[${name}] ${item.question}`
    }));
    const universal = PREMIUM_UNIVERSAL.map((item) => ({
        ...item,
        question: item.question.replace('[Ops judgment]', `[${name} · Premium]`)
    }));
    return [...catQs, ...universal];
}

module.exports = {
    PREMIUM_BY_CATEGORY,
    getPremiumQuestions
};
