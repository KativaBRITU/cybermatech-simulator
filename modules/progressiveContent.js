/**
 * Progressive training layers by learner rank.
 * Beginner = current catalog content (unchanged).
 * Intermediate / Advanced = added environments, depth, and harder judgment.
 *
 * Ranks (from progressGate):
 *   beginner     → Recruit
 *   intermediate → Field Analyst  (65% gate + avg ≥ 60)
 *   advanced     → Mission-Ready Operator (65% gate + avg ≥ 80)
 */

const RANK_ORDER = { beginner: 0, intermediate: 1, advanced: 2 };

const ENVIRONMENTS = {
    beginner: {
        id: 'beginner',
        label: 'Recruit',
        environment: 'Campus / SME Helpdesk',
        setting:
            'You are the first responder in a small African business, campus lab, or branch office — shared PCs, WhatsApp pressure, and limited tools.',
        focus: ['Foundations', 'Safe first actions', 'Verification habits', 'Blast-radius basics']
    },
    intermediate: {
        id: 'intermediate',
        label: 'Field Analyst',
        environment: 'SOC / Bank / Ministry Ops Floor',
        setting:
            'You now sit on a shift with tickets, SIEM noise, and stakeholders. Decisions must be defensible to a lead analyst and written into the ticket.',
        focus: ['Correlation', 'Containment under pressure', 'Evidence hygiene', 'Stakeholder briefs']
    },
    advanced: {
        id: 'advanced',
        label: 'Mission-Ready Operator',
        environment: 'National / Purple-Team / Crisis Cell',
        setting:
            'You operate in a crisis cell: cross-org coordination, incomplete intel, legal clocks, and adversary tradecraft. Rank means judgment — not trivia.',
        focus: ['Campaign thinking', 'Trade-off decisions', 'Purple-team loops', 'Executive & regulator language']
    }
};

function q(question, options, correct, explanation, topic, time = 42) {
    return { question, options, correct, explanation, topic, time_expected: time, rank_tier: topic };
}

/** Category progressive study + quiz layers */
const CATEGORY_PROGRESSION = {
    'social-engineering': {
        intermediate: {
            title: 'Field Analyst layer — targeted influence ops',
            environment: 'Bank / Ministry finance WhatsApp + email hybrid desk',
            objectives: [
                'Spot multi-channel pretexting (email + WhatsApp + voice)',
                'Design dual-control payment workflows that survive urgency theatre',
                'Brief a shift lead in 90 seconds after a near-miss BEC'
            ],
            concepts: [
                'Kill-chain of BEC: recon → trust build → payment redirect → laundering window',
                'Helpdesk reset abuse and SIM-swap narratives in African fintech support',
                'Positive reporting culture vs shame that drives silent clicks'
            ],
            playbook: [
                'Tag tickets with influence technique (authority, urgency, reciprocity)',
                'Require out-of-band verify for any beneficiary or MFA change',
                'Preserve chat exports and headers before wiping “evidence”'
            ],
            caseStudy:
                'A Field Analyst stops a dual-channel attack: spoofed PS WhatsApp plus a lookalike finance email. The win was process — not “being smart.”',
            quiz: [
                q(
                    '[Field Analyst] A payment change arrives by email; a matching WhatsApp arrives 2 minutes later from a “director abroad.” Best move?',
                    [
                        'Approve — two channels prove authenticity',
                        'Freeze the change; verify on a known office number; escalate with both artifacts attached',
                        'Reply only on WhatsApp for speed',
                        'Ignore both and hope it goes away'
                    ],
                    1,
                    'Multi-channel does not equal verified. Known-good out-of-band + freeze is analyst discipline.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — influence campaign defense',
            environment: 'National CERT liaison / enterprise crisis cell',
            objectives: [
                'Treat repeated BEC as a campaign, not isolated tickets',
                'Coordinate comms, legal, and finance under a single incident commander',
                'Coach executives against deepfake/voice authority traps'
            ],
            concepts: [
                'Campaign indicators: shared infrastructure, repeated beneficiary patterns, timing around payroll',
                'Deepfake voice as BEC 2.0 against travel-heavy African executives',
                'Metrics that matter: prevented loss, time-to-verify, report rate — not click shame'
            ],
            playbook: [
                'Stand up a virtual war room with finance dual-control owners',
                'Issue org-wide inject: no money moves from video/voice alone',
                'Hunt related mailbox rules, OAuth grants, and vendor portal takeovers'
            ],
            caseStudy:
                'An Operator links three “one-off” payment redirects across subsidiaries to one vendor-email compromise and stops the fourth attempt mid-flight.',
            quiz: [
                q(
                    '[Mission-Ready] Three subsidiaries report similar beneficiary changes in 10 days. Correct framing?',
                    [
                        'Three unlucky employees',
                        'Treat as a campaign: correlate IOCs, freeze related payments, hunt mailbox rules/OAuth, brief executives once with coordinated guidance',
                        'Only retrain the last victim',
                        'Publicly name employees who clicked'
                    ],
                    1,
                    'Advanced rank means campaign thinking and coordinated containment — not single-ticket tunnel vision.',
                    'advanced',
                    50
                )
            ]
        }
    },
    malware: {
        intermediate: {
            title: 'Field Analyst layer — endpoint + identity blend',
            environment: 'Managed SOC watching SME and clinic fleets',
            objectives: [
                'Connect malware alerts to identity abuse (tokens, admin shares)',
                'Choose isolation that preserves evidence',
                'Write a containment note a lead can approve fast'
            ],
            concepts: [
                'Living-off-the-land after the first payload',
                'Backup targeting as part of ransomware prep',
                'When to isolate vs when to observe briefly for intel'
            ],
            playbook: [
                'Isolate host + disable suspect sessions',
                'Pull EDR timeline before reimage pressure wins',
                'Check for staging shares and odd DNS in the same window'
            ],
            caseStudy:
                'Analyst isolates a “port clearance” macro host and finds the same DNS beacon on a second unpaid invoice PC — one ticket becomes two containments.',
            quiz: [
                q(
                    '[Field Analyst] EDR flags a macro; finance wants the PC “cleaned in 5 minutes.” Best analyst stance?',
                    [
                        'Wipe immediately with no collection',
                        'Isolate, collect volatile/timeline evidence, then rebuild — document why wipe-now increases blind spots',
                        'Leave it online to “watch the attacker” for days',
                        'Only run antivirus and reopen for payroll'
                    ],
                    1,
                    'Intermediate ops balance care continuity pressure with evidence-aware containment.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — ransomware campaign IR',
            environment: 'Crisis cell for a regional logistics / health group',
            objectives: [
                'Run IR phases with legal and care/ops continuity in parallel',
                'Decide restore priority by business/safety impact',
                'Hunt affiliates’ reusable access paths across sites'
            ],
            concepts: [
                'Affiliate model: initial access brokers vs ransomware operators',
                'Immutable backup verification under time pressure',
                'Negotiation/payment as last resort — never Plan A'
            ],
            playbook: [
                'Declare severity; assign containment, intel, restore, and comms owners',
                'Prioritize OT/clinic/cash ops downtime procedures',
                'Rotate identity material at scale after C2 kill'
            ],
            caseStudy:
                'Operator refuses crypto payment pressure, restores billing from offline backup, and finds the broker’s VPN account still live on a sister site.',
            quiz: [
                q(
                    '[Mission-Ready] Encryption started; leadership pushes to pay “for ART clinic hours.” Your priority order?',
                    [
                        'Pay first, investigate later',
                        'Isolate & preserve, activate care downtime procedures, restore from known-good backups, notify per duty — payment only as last resort with counsel',
                        'Wipe every site including backups',
                        'Post patient names so they monitor fraud'
                    ],
                    1,
                    'Advanced IR keeps safety/continuity and lawful process ahead of ransom panic.',
                    'advanced',
                    55
                )
            ]
        }
    },
    network: {
        intermediate: {
            title: 'Field Analyst layer — segmentation & east-west',
            environment: 'Enterprise campus / mining contractor network ops',
            objectives: [
                'Read lateral movement paths on flat VLANs',
                'Propose quick segmentation wins without boiling the ocean',
                'Protect admin protocols (RDP/SMB/WinRM)'
            ],
            concepts: [
                'Identity as the new network control plane',
                'Guest-to-OT shortcuts from “temporary” changes',
                'Jump hosts and just-in-time admin'
            ],
            playbook: [
                'Map critical VLANs and shadow IT Wi-Fi bridges',
                'Block east-west where safe; log the rest',
                'Ticket every temporary exception with expiry'
            ],
            caseStudy:
                'Analyst finds guest Wi-Fi reaching engineering — fixes with segmentation and a jump host before the next shift.',
            quiz: [
                q(
                    '[Field Analyst] Guest can ping an engineering PLC subnet after a “temporary” change. First priority?',
                    [
                        'Change guest password only',
                        'Restore segmentation, require jump-host for engineering, review change tickets/expiry',
                        'Disable all logging',
                        'Move PLCs to the guest SSID'
                    ],
                    1,
                    'Intermediate network work is segmentation discipline under real change chaos.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — zero-trust under crisis',
            environment: 'Multi-site African enterprise during active intrusion',
            objectives: [
                'Apply zero-trust thinking without a full product rewrite overnight',
                'Cut attacker paths while keeping critical ops online',
                'Design lasting control after the war room closes'
            ],
            concepts: [
                'Assume breach: continuous verification of users, devices, paths',
                'Trade-offs: availability vs confidentiality in OT/safety contexts',
                'Post-incident architecture that survives the next broker'
            ],
            playbook: [
                'Emergency allow-lists for critical flows only',
                'Force re-auth / session kill for privileged paths',
                'Convert war-room blocks into permanent policy with owners'
            ],
            caseStudy:
                'Operator keeps plant telemetry up while cutting SMB east-west and forcing MFA re-auth on all VPN admins mid-incident.',
            quiz: [
                q(
                    '[Mission-Ready] Intruder has a foothold; OT must stay up. Best advanced move?',
                    [
                        'Shut the entire company network',
                        'Preserve critical OT paths, sever IT-to-OT shortcuts, force privileged re-auth, hunt identity — then harden permanently',
                        'Only send a phishing video to staff',
                        'Ignore OT and focus on the website'
                    ],
                    1,
                    'Advanced network judgment protects safety/availability while collapsing attacker mobility.',
                    'advanced',
                    50
                )
            ]
        }
    },
    cloud: {
        intermediate: {
            title: 'Field Analyst layer — identity & posture',
            environment: 'SaaS-heavy insurer / fintech cloud desk',
            objectives: [
                'Hunt public storage and over-privileged roles',
                'Prefer short-lived credentials',
                'Respond to responsible disclosure without panic'
            ],
            concepts: [
                'Shared responsibility in practice',
                'CIEM/CSPM thinking for African SMEs on a budget',
                'Data residency awareness for citizen/customer data'
            ],
            playbook: [
                'Close public exposure first',
                'Rotate keys/tokens; review access logs',
                'Open a ticket with legal/comms if personal data may be in scope'
            ],
            caseStudy:
                'Analyst closes a public claims bucket the same hour a researcher mails disclosure — rotation and log review follow before the press cycle.',
            quiz: [
                q(
                    '[Field Analyst] Public bucket with KYC PDFs. Correct first sequence?',
                    [
                        'Leave it until Friday change window',
                        'Make private, rotate secrets, assess access, follow notification duties',
                        'Delete without logs',
                        'Move to another public bucket abroad'
                    ],
                    1,
                    'Intermediate cloud IR is exposure-close then identity hygiene.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — cloud campaign & control plane',
            environment: 'Multi-account landing zone under active token theft',
            objectives: [
                'Think control-plane compromise, not one bucket',
                'Coordinate org-wide session revocation',
                'Hardening that survives freelancers and vendors'
            ],
            concepts: [
                'Federation/OAuth app abuse',
                'Cross-account role chaining',
                'Break-glass design that is audited, not shared on WhatsApp'
            ],
            playbook: [
                'Kill sessions and rotate federation secrets',
                'Inventory third-party apps with data scopes',
                'Enforce SSO+MFA and remove long-lived keys at scale'
            ],
            caseStudy:
                'Operator traces a “staging key” leak to a production role chain and cuts vendor OAuth before exfil completes.',
            quiz: [
                q(
                    '[Mission-Ready] Attacker has a stolen cloud refresh token used by a vendor integration. Best response?',
                    [
                        'Change the website banner only',
                        'Revoke sessions/tokens, rotate federation/app secrets, review API scopes and data access, notify stakeholders as required',
                        'Wait for the vendor’s next quarterly meeting',
                        'Disable MFA so users can “recover faster”'
                    ],
                    1,
                    'Advanced cloud defense is identity/control-plane crisis management.',
                    'advanced',
                    50
                )
            ]
        }
    },
    forensics: {
        intermediate: {
            title: 'Field Analyst layer — evidence under shift pressure',
            environment: '24/7 SOC with travel-heavy executives',
            objectives: [
                'Contain without waiting for CEO approval when the IR plan allows it',
                'Preserve volatile evidence before rebuild culture wins',
                'Hand off a clean timeline to the next shift'
            ],
            concepts: [
                'Order of volatility',
                'Chain of custody for police / INTERPOL paths',
                'Shift handoff quality as a control'
            ],
            playbook: [
                'Follow severity matrix for who may isolate',
                'Snapshot/timeline before reimage',
                'Write the story: what, when, impact, next actions'
            ],
            caseStudy:
                'Analyst disables a bad VPN session while the CEO is at a coastal conference — IR plan authorized it; the ticket proves why.',
            quiz: [
                q(
                    '[Field Analyst] CEO unreachable; staging of a payment file seen. Best first move?',
                    [
                        'Wait for the keynote to end',
                        'Disable suspect session/account, quarantine host, preserve logs, escalate per IR plan',
                        'Announce on social media',
                        'Shut all core banking without evidence care'
                    ],
                    1,
                    'Intermediate IR authority is written into the plan — not personality-dependent.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — multi-party investigation',
            environment: 'Joint cell with legal, comms, and external responders',
            objectives: [
                'Run parallel workstreams without trampling evidence',
                'Speak regulator/board language without oversharing IOCs publicly',
                'Close with measurable hardening owners'
            ],
            concepts: [
                'Attribution humility vs actionable defense',
                'Legal hold vs operational restore tension',
                'Tabletop → live incident skill transfer'
            ],
            playbook: [
                'Single incident commander; clear swim lanes',
                'Evidence repository with access control',
                'After-action with deadlines, not vibes'
            ],
            caseStudy:
                'Operator keeps restore moving while legal hold protects key logs — both succeed because roles were explicit.',
            quiz: [
                q(
                    '[Mission-Ready] Legal wants a hold; ops wants instant wipe/restore. Advanced resolution?',
                    [
                        'Ignore legal',
                        'Preserve required evidence/images first (or dual-track), then restore service with known-good media — document the decision',
                        'Wipe everything including the evidence share',
                        'Debate for three days with no containment'
                    ],
                    1,
                    'Advanced forensics balances legal durability and operational recovery.',
                    'advanced',
                    50
                )
            ]
        }
    },
    governance: {
        intermediate: {
            title: 'Field Analyst layer — risk & evidence for tenders',
            environment: 'SME / ministry onboarding and control testing',
            objectives: [
                'Map controls to risk and local DP expectations',
                'Prepare evidence packs for audits and tenders',
                'Track exceptions with owner and expiry'
            ],
            concepts: [
                'Risk register treatment decisions',
                'African DP context alongside NIST/CIS',
                'Control testing that survives a busy quarter'
            ],
            playbook: [
                'Classify data; know where it lives',
                'MFA, patching, backups as non-negotiable baselines',
                'Exception tickets with compensating controls'
            ],
            caseStudy:
                'Analyst unblocks a ministry portal onboarding by proving MFA + tested backups in a one-page evidence pack.',
            quiz: [
                q(
                    '[Field Analyst] Tender asks for cyber hygiene evidence next week. Best focus?',
                    [
                        'Buy a SIEM brochure',
                        'Demonstrate MFA, patching, tested backups, and awareness records with owners',
                        'One shared admin password policy',
                        'Promise ISO next year with no controls today'
                    ],
                    1,
                    'Intermediate governance is evidence of basics — not tooling theatre.',
                    'intermediate',
                    40
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — board & regulator posture',
            environment: 'Enterprise risk committee / national-scale program',
            objectives: [
                'Translate incidents into residual risk and investment choices',
                'Align with AU Malabo / national DP duties without cargo-cult GDPR copy',
                'Build a control roadmap with 30/60/90 outcomes'
            ],
            concepts: [
                'Board-ready risk language',
                'Third-party / supply-chain assurance',
                'Metrics that change behavior'
            ],
            playbook: [
                'Quarterly control attestation with samples',
                'Vendor tiering and minimum security schedules',
                'Post-incident policy updates with owners'
            ],
            caseStudy:
                'Operator turns a near-miss into a funded MFA + dual-control program with a board date and success metrics.',
            quiz: [
                q(
                    '[Mission-Ready] After a BEC near-miss, board asks “are we safe?” Best advanced answer shape?',
                    [
                        'Yes, forever',
                        'State residual risk, compensating controls in place, gaps, and a dated 30/60/90 plan with owners and metrics',
                        'Only blame the employee',
                        'Read the entire NIST catalog aloud'
                    ],
                    1,
                    'Advanced governance is honest residual risk plus an owned roadmap.',
                    'advanced',
                    48
                )
            ]
        }
    },
    emerging: {
        intermediate: {
            title: 'Field Analyst layer — AI & synthetic media on the desk',
            environment: 'Helpdesk + fraud desk facing deepfakes and AI phish',
            objectives: [
                'Apply verification rules to voice/video payment asks',
                'Bound AI tools so they cannot reset access alone',
                'Report synthetic media without amplifying it'
            ],
            concepts: [
                'Prompt injection against helpdesk bots',
                'Deepfake CEO fraud on social platforms',
                'Human-in-the-loop for irreversible actions'
            ],
            playbook: [
                'No financial action from social video alone',
                'Step-up proofing that cannot live only in attacker chat',
                'Log and rate-limit AI admin actions'
            ],
            caseStudy:
                'Analyst kills a deepfake gift-card campaign with one internal alert and known-channel verification.',
            quiz: [
                q(
                    '[Field Analyst] Perfect CEO video demands gift cards on Facebook. Correct action?',
                    [
                        'Comply — quality proves authenticity',
                        'Internal alert; no finance from social video; verify on known channels; seek takedown',
                        'Argue in comments',
                        'Disable the company forever'
                    ],
                    1,
                    'Intermediate emerging threats are process against synthetic media.',
                    'intermediate',
                    42
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — AI-enabled adversary programs',
            environment: 'Purple-team / national readiness exercises',
            objectives: [
                'Threat-model AI assistants with tool privileges',
                'Exercise deepfake + BEC combined injects',
                'Set org policy for AI data handling'
            ],
            concepts: [
                'Agentic tools with over-broad roles',
                'Model/supply-chain risk',
                'Crypto-agility and long-lived sensitive data'
            ],
            playbook: [
                'Tabletops with synthetic media injects',
                'AI use policy with data classes',
                'Purple-team detection for AI-scaled phishing volume'
            ],
            caseStudy:
                'Operator runs an exercise where AI drafts spear phish in local language — defenders measured verify-time, not click shame.',
            quiz: [
                q(
                    '[Mission-Ready] Internal AI agent can export cloud buckets “for debugging.” Advanced control?',
                    [
                        'Trust the model',
                        'Least-privilege tool scopes, human approval for exports, monitoring, and data-class policies',
                        'Give it admin to be more helpful',
                        'Ban electricity'
                    ],
                    1,
                    'Advanced AI security is privilege design and approval gates.',
                    'advanced',
                    48
                )
            ]
        }
    },
    'offensive-tools': {
        intermediate: {
            title: 'Field Analyst layer — recognize tradecraft in logs',
            environment: 'Purple-aware SOC on African MSSP jump boxes',
            objectives: [
                'Map tool families to ATT&CK without worshipping brand names',
                'Hunt beacons and credential access behaviors',
                'Stay inside authorization and scope'
            ],
            concepts: [
                'Renamed binaries still leave technique footprints',
                'Jump-box blast radius for remote admins',
                'Ethics: defense and authorized emulation only'
            ],
            playbook: [
                'Alert on LSASS touches, odd DNS, lateral SMB',
                'Isolate shared admin hosts fast',
                'Reset credentials used from compromised jump boxes'
            ],
            caseStudy:
                'Analyst catches a renamed credential dumper via ATT&CK credential-access behaviors, not AV signature names.',
            quiz: [
                q(
                    '[Field Analyst] LSASS access + lateral SMB from a Lusaka jump box. Best framing?',
                    [
                        'Ignore — regional myth that APTs skip Africa',
                        'Credential access / lateral movement: isolate, reset identity material, hunt with ATT&CK language',
                        'Only rename the host',
                        'Share dumps on WhatsApp'
                    ],
                    1,
                    'Intermediate purple awareness is technique-based response.',
                    'intermediate',
                    45
                )
            ]
        },
        advanced: {
            title: 'Mission-Ready layer — authorized emulation & detection engineering',
            environment: 'Purple team with written ROE across SADC clients',
            objectives: [
                'Design detections that survive rename/proxy',
                'Enforce scope; treat out-of-scope scanning as incident until proven',
                'Convert exercise findings into durable controls'
            ],
            concepts: [
                'Detection engineering loops',
                'ROE and legal authorization as hard gates',
                'From purple findings to backlog with owners'
            ],
            playbook: [
                'Write detections for behaviors, not one hash',
                'Stop out-of-scope activity immediately',
                'Track findings to remediated controls'
            ],
            caseStudy:
                'Operator halts a contractor’s out-of-scope sweep, then ships a detection for the same technique the next sprint.',
            quiz: [
                q(
                    '[Mission-Ready] Purple exercise shows out-of-scope scans on a card VLAN. Correct action?',
                    [
                        'Praise initiative',
                        'Stop activity, review authorization/scope, treat as incident until proven authorized, then fix process',
                        'Expand to production quietly',
                        'Post on LinkedIn'
                    ],
                    1,
                    'Advanced offensive literacy is inseparable from authorization discipline.',
                    'advanced',
                    48
                )
            ]
        }
    }
};

function normalizeRank(rank) {
    const r = String(rank || 'beginner').toLowerCase();
    if (r === 'advanced' || r === 'expert') return 'advanced';
    if (r === 'intermediate' || r === 'mid') return 'intermediate';
    return 'beginner';
}

function rankAtLeast(rank, needed) {
    return (RANK_ORDER[normalizeRank(rank)] || 0) >= (RANK_ORDER[needed] || 0);
}

function getEnvironment(rank) {
    return ENVIRONMENTS[normalizeRank(rank)] || ENVIRONMENTS.beginner;
}

function getCategoryProgression(category) {
    return CATEGORY_PROGRESSION[category] || CATEGORY_PROGRESSION.network;
}

function buildProgressiveMarkdown(module, rank) {
    const tier = normalizeRank(rank);
    const env = getEnvironment(tier);
    const prog = getCategoryProgression(module.category || 'network');
    const parts = [];

    // Recruits keep beginner content only — but see what growth unlocks
    if (tier === 'beginner') {
        const mid = prog.intermediate;
        const adv = prog.advanced;
        return `
---

## Your growth path — same module, new environments
You are training as a **Recruit** in **${env.environment}**.

The beginner foundation above stays yours forever. Rank unlocks deeper layers in *this same module*:

| Rank | Environment you enter | What changes |
|------|------------------------|--------------|
| **Recruit** (now) | Campus / SME helpdesk | Foundations, safe first actions |
| **Field Analyst** 🔒 | SOC / bank / ministry ops floor | Correlation, tickets, defensible containment |
| **Mission-Ready Operator** 🔒 | National / purple-team / crisis cell | Campaigns, trade-offs, executive language |

### Coming when you rank up
${mid ? `**Field Analyst unlock:** ${mid.environment} — ${(mid.objectives || []).slice(0, 2).join('; ')}.` : ''}
${adv ? `
**Mission-Ready unlock:** ${adv.environment} — ${(adv.objectives || []).slice(0, 2).join('; ')}.` : ''}

**How to unlock:** pass **65%** of the catalog at 70%+ (Field Analyst), then raise your official first-pass average toward **80%+** (Mission-Ready).

> Growth is not a new menu — it is a harder cybersecurity *workplace* for the skills you already started.
`;
    }

    parts.push(`
---

## Progressive rank unlock — ${env.label}
**Environment:** ${env.environment}

${env.setting}

**This rank focuses on:** ${env.focus.join(' · ')}
`);

    if (rankAtLeast(tier, 'intermediate') && prog.intermediate) {
        const L = prog.intermediate;
        parts.push(`
### ${L.title}
**Ops floor:** ${L.environment}

**Objectives**
${L.objectives.map((o) => `- ${o}`).join('\n')}

**Deeper concepts**
${L.concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Playbook additions**
${L.playbook.map((p) => `- ${p}`).join('\n')}

**Case — growth moment**
${L.caseStudy}
`);
    }

    if (rankAtLeast(tier, 'advanced') && prog.advanced) {
        const L = prog.advanced;
        parts.push(`
### ${L.title}
**Crisis cell:** ${L.environment}

**Objectives**
${L.objectives.map((o) => `- ${o}`).join('\n')}

**Operator concepts**
${L.concepts.map((c, i) => `${i + 1}. ${c}`).join('\n')}

**Crisis playbook**
${L.playbook.map((p) => `- ${p}`).join('\n')}

**Case — mission-ready judgment**
${L.caseStudy}
`);
    } else if (rankAtLeast(tier, 'intermediate') && !rankAtLeast(tier, 'advanced')) {
        parts.push(`
### Next unlock — Mission-Ready Operator 🔒
Raise your official first-pass average to **80%+** (while keeping the 65% gate) to enter the **national / purple-team / crisis cell** layer for this module.
`);
    }

    parts.push(`
> Rank is earned by clearing the **65% catalog gate** and raising your official first-pass average. Content deepens as you grow — same module, higher-stakes environment.
`);

    return parts.join('\n');
}

function getProgressiveQuestions(module, rank) {
    const tier = normalizeRank(rank);
    const prog = getCategoryProgression(module.category || 'network');
    const out = [];
    if (rankAtLeast(tier, 'intermediate') && prog.intermediate?.quiz) {
        out.push(
            ...prog.intermediate.quiz.map((item) => ({
                ...item,
                question: item.question.includes(module.name)
                    ? item.question
                    : item.question.replace(/^\[/, `[${module.name} · `)
            }))
        );
    }
    if (rankAtLeast(tier, 'advanced') && prog.advanced?.quiz) {
        out.push(
            ...prog.advanced.quiz.map((item) => ({
                ...item,
                question: item.question.includes(module.name)
                    ? item.question
                    : item.question.replace(/^\[/, `[${module.name} · `)
            }))
        );
    }
    return out;
}

function immersionForRank(rank, moduleName) {
    const env = getEnvironment(rank);
    return {
        title: `${env.label.toUpperCase()} DRILL — ${moduleName}`,
        subtitle: env.environment,
        setting: env.setting,
        tips: [
            `You are operating as a ${env.label} in: ${env.environment}.`,
            ...env.focus.map((f) => `Focus: ${f}`),
            'Timer pressure is part of the environment — accuracy still beats panic.'
        ],
        rank: normalizeRank(rank),
        rank_label: env.label,
        environment: env.environment
    };
}

function drillProfileForRank(rank) {
    const tier = normalizeRank(rank);
    if (tier === 'advanced') {
        return { difficulty: 'hard', limitBonus: 2, timeFactor: 0.78, label: 'advanced' };
    }
    if (tier === 'intermediate') {
        return { difficulty: 'medium', limitBonus: 1, timeFactor: 0.82, label: 'intermediate' };
    }
    return { difficulty: 'medium', limitBonus: 0, timeFactor: 0.85, label: 'beginner' };
}

module.exports = {
    ENVIRONMENTS,
    RANK_ORDER,
    CATEGORY_PROGRESSION,
    normalizeRank,
    rankAtLeast,
    getEnvironment,
    buildProgressiveMarkdown,
    getProgressiveQuestions,
    immersionForRank,
    drillProfileForRank
};
