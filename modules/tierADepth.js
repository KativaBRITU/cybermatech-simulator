/**
 * Paid-grade depth for Tier A modules — extra questions + study extras.
 * Merged into assessmentEngine / contentLibrary.
 */

function q(question, options, correct, explanation, topic, time_expected = 40) {
    return { question, options, correct, explanation, topic, time_expected };
}

const TIER_A_QUESTIONS = {
    1: [
        q(
            'AiTM phishing proxies the real login and steals the session cookie after MFA. Which control family best reduces this?',
            [
                'Longer passwords only',
                'Phishing-resistant MFA (passkeys/FIDO2) + conditional access / token binding where available',
                'Disable all email',
                'Ask users to “look carefully” at pixels'
            ],
            1,
            'AiTM beats OTP MFA. Phishing-resistant authenticators and session controls matter.',
            'aitm',
            45
        ),
        q(
            'DMARC is p=none with no monitoring. What is the honest risk statement?',
            [
                'Domain spoofing defenses are fully enforced',
                'You have visibility at best — spoofed From can still succeed until policy moves to quarantine/reject with alignment',
                'DMARC replaces backups',
                'SPF alone is enough forever'
            ],
            1,
            'p=none is monitoring mode. Enforcement is a deliberate hardening step.',
            'email_auth',
            40
        ),
        q(
            'Namibian SME finance team gets WhatsApp “invoice” PDFs weekly. Best program control?',
            [
                'Ban WhatsApp company-wide without alternative',
                'Out-of-band payment verification + trusted channels + coach reporting without shame',
                'Trust any PDF with a logo',
                'Only train once at onboarding forever'
            ],
            1,
            'Channel-realistic controls beat generic poster campaigns.',
            'bec',
            40
        )
    ],
    7: [
        q(
            'Deepfake CFO voice asks for urgent wire. Which control survives “it sounded real”?',
            [
                'Caller ID trust alone',
                'Pre-agreed challenge phrase + dual-control callback on a known number',
                'Approve if amount is under N$5m',
                'Trust any WhatsApp voice note from “CFO”'
            ],
            1,
            'Process beats perception when audio can be synthesized.',
            'deepfake',
            40
        ),
        q(
            'Vendor portal password reset email arrives with a new domain. Best first check?',
            [
                'Click Reset immediately',
                'Open the vendor portal from a bookmark / known URL; never from the message link',
                'Forward to all staff',
                'Disable MFA so login is easier'
            ],
            1,
            'Navigation from trusted bookmarks breaks credential-harvest links.',
            'bec',
            35
        )
    ],
    8: [
        q(
            'Legal wants a customer notification draft while encryption is still spreading. IR lead priority?',
            [
                'Write perfect prose before isolation',
                'Contain/stop spread first; dual-track: tech containment + factual comms with legal — no speculation',
                'Power off every site blindly',
                'Delete logs to reduce liability'
            ],
            1,
            'NIST-style IR: stop harm, preserve enough evidence, communicate facts.',
            'incident_response',
            45
        ),
        q(
            'Which severity input most justifies declaring a major incident quickly?',
            [
                'A single spam email deleted successfully',
                'Active lateral movement into crown-jewel systems / safety or payment impact',
                'Someone used Comic Sans',
                'VPN latency of 12ms'
            ],
            1,
            'Severity follows blast radius and business/safety impact.',
            'severity',
            35
        ),
        q(
            'Evidence vs uptime: ransomware on a file server still encrypting. Best balance?',
            [
                'Ignore evidence always',
                'Isolate to stop spread; capture critical volatile data if playbook-safe; rebuild from known-good',
                'Leave attacker on system for a week to observe',
                'Reimage with no notes'
            ],
            1,
            'Containment and disciplined evidence can coexist.',
            'forensics',
            40
        )
    ],
    11: [
        q(
            'Affiliate checklist includes “delete VSS + exfil before encrypt.” What control most directly breaks leverage?',
            [
                'A motivational poster',
                'Immutable/offline backups that were restore-tested + identity tiering to slow domain-wide encryption',
                'Only AV signatures',
                'Paying every ransom immediately as policy'
            ],
            1,
            'Recoverability and identity resistance reduce extortion power.',
            'ransomware',
            40
        ),
        q(
            'Double extortion: data stolen and systems encrypted. Negotiation pressure hits executives. Professional posture?',
            [
                'IT alone decides payment in secret',
                'Legal/leadership decision with IR facts; continue recovery; do not halt containment for negotiation theater',
                'Publicly livestream negotiations',
                'Wipe backups to “deny thieves”'
            ],
            1,
            'Payment is business/legal. IR keeps recovering and containing.',
            'extortion',
            45
        )
    ],
    18: [
        q(
            'Alert fatigue: 900 medium alerts/day. Analyst starts closing without reading. Best leadership fix?',
            [
                'Fire all analysts',
                'Tune detections, enrich context, staff to volume, protect high-fidelity rules from silent disablement',
                'Turn SIEM off at night',
                'Only alert on low severity'
            ],
            1,
            'Fatigue is an ops design problem, not a moral failing.',
            'soc',
            40
        ),
        q(
            'True positive: service account success after spray, then admin$ hops. What is the 10-minute narrative?',
            [
                'Probably a glitch — close',
                'Identity compromise + lateral movement — contain account/host, hunt pivots, preserve logs',
                'Wait for ransomware note',
                'Only email the user politely'
            ],
            1,
            'Chain alerts beat single-event thinking.',
            'lateral',
            40
        ),
        q(
            'Which metric best shows SOC improvement after purple tests?',
            [
                'Number of slide decks',
                'MTTD/MTTR on emulated techniques before vs after',
                'Coffee consumed',
                'Count of ignored alerts'
            ],
            1,
            'Measure detect/respond on known techniques.',
            'metrics',
            35
        )
    ],
    21: [
        q(
            'VPN flat access lets any authenticated laptop reach SCADA jump hosts. Zero Trust response?',
            [
                'Trust the VPN forever',
                'Segment; continuous verify identity+device; least privilege per resource; remove flat pathways',
                'Remove all authentication',
                'Only add a longer VPN password'
            ],
            1,
            'ZT is about per-request verification and blast-radius reduction.',
            'zero_trust',
            40
        ),
        q(
            'Contractor BYOD with sideloaded apps needs ERP access. Best pattern?',
            [
                'Full domain admin on personal phone',
                'Managed device posture or VDI/Virtual app; short-lived access; no broad network immersion',
                'Share a shared generic login on a sticky note',
                'Disable logging for contractors'
            ],
            1,
            'Device trust and scoped access beat network location myths.',
            'ztna',
            40
        )
    ],
    37: [
        q(
            'Awareness training that only shames clickers produces what outcome?',
            [
                'Higher reporting rates',
                'Hidden clicks and lower reporting — culture failure',
                'Perfect security',
                'Automatic patching'
            ],
            1,
            'Psychological safety increases sensor quality (human reporting).',
            'awareness',
            35
        ),
        q(
            'Best micro-drill for a Windhoek retail chain with high WhatsApp use?',
            [
                'Only teach BGP hijacking week one',
                'Invoice/BEC verification + fake delivery SMS + manager callback practice',
                'Ignore mobile channels',
                'Memorize port numbers only'
            ],
            1,
            'Train the channels people actually use.',
            'awareness',
            40
        )
    ],
    46: [
        q(
            'Unapproved full-subnet SYN scan at 03:00 from a laptop. Best SOC framing?',
            [
                'Always benign Windows Update',
                'Reconnaissance tradecraft — treat as precursor activity until proven authorized',
                'Ignore night scans',
                'Ban all ICMP forever without analysis'
            ],
            1,
            'Nmap-style discovery is often stage-0. Authorize or investigate.',
            'nmap',
            40
        ),
        q(
            'Which Nmap finding most urgently needs a ticket with owner and SLA?',
            [
                'Closed port 9 on a printer',
                'Unexpected RDP/SMB exposure on a crown-jewel subnet from the internet',
                'A host that answers ping',
                'TTL of 64'
            ],
            1,
            'Attack surface on valuable assets drives priority.',
            'nmap',
            35
        )
    ],
    51: [
        q(
            'DA interactive logon to a user workstation, then lateral admin$ as DA. Root lesson?',
            [
                'Hashes cannot be reused',
                'Privileged credentials on dirty endpoints enable theft/reuse — enforce PAW/tiering',
                'RDP is always safe',
                'Only cloud accounts matter'
            ],
            1,
            'Mimikatz-class theft thrives on tiering failures.',
            'mimikatz',
            40
        ),
        q(
            'Credential Guard + Protected Users most directly reduce which outcome?',
            [
                'Phishing emails existing',
                'Ease of dumping/reusing certain credential materials on hardened endpoints',
                'Need for backups',
                'DNS resolution'
            ],
            1,
            'Platform hardening raises cost of credential theft.',
            'cred_guard',
            40
        )
    ],
    52: [
        q(
            'Malleable C2 uses legitimate-looking HTTP and sleep jitter. Detection focus?',
            [
                'Filename cobaltstrike.exe only',
                'Beacon cadence + process injection ancestry + rare destinations/JA3',
                'Disable HTTPS',
                'Count PDF downloads'
            ],
            1,
            'Behavior over brand.',
            'c2',
            40
        ),
        q(
            'Beaconing every ~60s with jitter to a rare SaaS-looking domain. First containment move?',
            [
                'Ignore until ransomware note',
                'Isolate host, preserve memory/disk if playbook allows, block egress, hunt siblings',
                'Only rename the domain in DNS forever',
                'Reboot and hope'
            ],
            1,
            'Stop C2, preserve evidence, expand hunt.',
            'c2',
            40
        )
    ],
    58: [
        q(
            'BloodHound shows Helpdesk GenericAll on a user who can reset a Tier-0-adjacent account. Action?',
            [
                'Celebrate inventory',
                'Treat as critical identity debt — remove dangerous ACLs and enforce tiering',
                'Grant GenericAll to everyone',
                'Ignore graphs'
            ],
            1,
            'Attack paths are backlog items with owners.',
            'bloodhound',
            40
        ),
        q(
            'Why do “shortest path to Domain Admin” findings matter more than raw object counts?',
            [
                'They look prettier',
                'They show how few steps an attacker needs — prioritizes real blast-radius debt',
                'They replace EDR',
                'They auto-patch Exchange'
            ],
            1,
            'Path length and privilege edges drive remediation order.',
            'bloodhound',
            35
        )
    ],
    60: [
        q(
            'Pass-the-Hash after DA touched a helpdesk PC. Cloud analogue to teach executives?',
            [
                'There is no analogue',
                'Stolen session/refresh tokens — short-lived creds and step-up auth',
                'Only USB risks remain',
                'Antivirus signatures replace identity'
            ],
            1,
            'Token theft is modern credential reuse.',
            'pth',
            40
        ),
        q(
            'Best architectural fix for PtH class failures in AD?',
            [
                'Longer user passwords only',
                'Tiered admin model / PAWs — privileged credentials never touch dirty workstations',
                'Disable Kerberos',
                'Allow DA on every laptop for convenience'
            ],
            1,
            'Architecture beats after-the-fact AV.',
            'tiering',
            40
        )
    ],
    70: [
        q(
            'High-entropy DNS labels every 45s from one host. Best hypothesis?',
            [
                'Normal AD replication',
                'Possible DNS tunneling / covert C2 — investigate host and DNS path',
                'Disable the company',
                'Ignore DNS forever'
            ],
            1,
            'DNS remains a covert channel when egress is constrained.',
            'dns_tunnel',
            40
        ),
        q(
            'Which control most reduces DNS tunneling success without breaking the business?',
            [
                'Block all DNS forever',
                'Internal recursive resolvers + logging + sinkhole rare patterns + host EDR correlation',
                'Ask users to type slower',
                'Only monitor port 443'
            ],
            1,
            'Visibility and recursive control beat blind blocks.',
            'dns_tunnel',
            40
        )
    ],
    84: [
        q(
            'Why map toolmarks to ATT&CK IDs in reports?',
            [
                'It patches servers automatically',
                'Shared language for coverage gaps, purple tests, and leadership funding conversations',
                'It replaces logging',
                'Only red teams use it'
            ],
            1,
            'ATT&CK is an ops vocabulary, not décor.',
            'attack',
            35
        ),
        q(
            'After mapping detections, you find T1003 covered and T1071 blind. Purple next step?',
            [
                'Hide the blind',
                'Emulate the blind technique safely, measure MTTD, fund the gap',
                'Delete ATT&CK from the wiki',
                'Only train phishing forever'
            ],
            1,
            'Coverage matrices drive emulations.',
            'attack',
            40
        )
    ],
    95: [
        q(
            'Purple week: LSASS dump missed, phishing detected in 4m. Where do you spend the sprint?',
            [
                'Only polish phishing further',
                'Close credential-theft and covert-channel misses with re-emulation proof',
                'Hide the matrix',
                'Buy random tools without metrics'
            ],
            1,
            'Fund the dangerous blinds; prove with retest.',
            'purple',
            40
        ),
        q(
            'Best purple success criterion for leadership?',
            [
                'More slides than last year',
                'Technique X detected/contained within agreed SLA on retest',
                'Red team “wins forever”',
                'No documentation'
            ],
            1,
            'Retestable outcomes beat theater.',
            'purple',
            35
        )
    ]
};

const TIER_A_ESSAYS = {
    1: [
        {
            question:
                'Write a 90-second executive brief after an AiTM campaign stole three finance sessions despite OTP MFA. Cover: what happened, immediate containment, why OTP failed, and a 30-day control plan.',
            guidelines: 'Plain language, no jargon dumps. Name phishing-resistant MFA and session controls. Include dual-control payment freeze.'
        },
        {
            question:
                'Design a Namibian SME phishing program for WhatsApp + email invoice fraud. Include measurement, coaching (no shame), and escalation to SOC.',
            guidelines: 'Channel-realistic. Define KPIs (report time, callback adherence) not just completion rates.'
        }
    ],
    7: [
        {
            question:
                'A deepfake “CFO” voice asks for an urgent wire during month-end. Write the finance playbook step-by-step for the first 10 minutes.',
            guidelines: 'Challenge phrase, dual control, known-number callback, what not to do under authority pressure.'
        }
    ],
    8: [
        {
            question:
                'You are Incident Commander. Encryption is spreading; Legal wants a public statement in 20 minutes. Write dual-track orders for tech containment and communications.',
            guidelines: 'Facts only in comms. Named owners. Unsafe actions under panic listed explicitly.'
        }
    ],
    11: [
        {
            question:
                'Affiliates deleted VSS and began exfil before encrypt. Draft a board recovery narrative: backups, identity tiering, and whether ransom negotiation is an IR decision.',
            guidelines: 'Separate business/legal payment decisions from technical recovery. Cite restore-test evidence.'
        }
    ],
    18: [
        {
            question:
                'Night shift closed 200 medium alerts without reading due to fatigue. Write a SOC lead remediation plan covering tuning ownership, staffing, and protection of high-fidelity rules.',
            guidelines: 'Treat fatigue as design failure. Include MTTD/MTTR on purple techniques as success metrics.'
        }
    ],
    21: [
        {
            question:
                'Contractors on flat VPN can reach SCADA jump hosts. Propose a Zero Trust migration that keeps the plant running.',
            guidelines: 'Segmentation, device posture, least privilege, short-lived access. No “trust the VPN” leftovers.'
        }
    ],
    37: [
        {
            question:
                'Rewrite an annual shame-based awareness program into a monthly micro-drill system for retail staff who live on WhatsApp.',
            guidelines: 'Psychological safety, channel realism, manager callback norms, measurable behavior change.'
        }
    ],
    46: [
        {
            question:
                'Unauthorized 03:00 full-subnet SYN scan from a marketing laptop. Write the SOC case narrative and 48-hour hunt plan as if ransomware may follow.',
            guidelines: 'Recon as precursor. Isolation, authorization check, sibling hunt, ticket with owner.'
        }
    ],
    51: [
        {
            question:
                'Explain to a board why Domain Admin on a helpdesk PC is an architectural failure, using Mimikatz-class theft and Pass-the-Hash as the story.',
            guidelines: 'PAW/tiering language. Avoid tool worship. Tie to business blast radius.'
        }
    ],
    52: [
        {
            question:
                'Write a detection engineering brief for malleable HTTP C2 with sleep jitter. What do you hunt, what do you ignore, and how do you purple-test it?',
            guidelines: 'Beacon cadence, process ancestry, rare destinations. Retest after tuning.'
        }
    ],
    58: [
        {
            question:
                'BloodHound shows Helpdesk GenericAll on a path to Tier-0. Write a risk-committee paper: severity, owners, 30/60/90 remediation, and retest proof.',
            guidelines: 'Attack paths as backlog. Shortest-path metric. No inventory theater.'
        }
    ],
    60: [
        {
            question:
                'Teach executives Pass-the-Hash using cloud session-token theft as the analogy. Include the architectural fix and a 10-minute containment checklist.',
            guidelines: 'Reuse family of techniques. Tiering + short-lived creds. Clear containment steps.'
        }
    ],
    70: [
        {
            question:
                'High-entropy DNS every 45s from one host. Write the hunt-to-contain playbook and the durable DNS architecture controls.',
            guidelines: 'Recursive resolvers, logging, sinkhole, EDR correlation. Avoid “block all DNS.”'
        }
    ],
    84: [
        {
            question:
                'Build a one-page ATT&CK heatmap story for leadership: strong phishing coverage, blind credential dumping. Ask for funding with measurable MTTD targets.',
            guidelines: 'Shared vocabulary. Retestable outcomes. No fear theater.'
        }
    ],
    95: [
        {
            question:
                'Purple week results: phishing MTTD 4 minutes; LSASS dump missed. Write the sprint plan and the re-emulation success criteria.',
            guidelines: 'Fund dangerous blinds. Owners, dates, retest proof. Emulate → remediate → re-emulate.'
        }
    ]
};

const TIER_A_EXTRAS = {
    1: {
        why: 'Phishing is still the cheapest reliable initial access — and AiTM kits now steal sessions after MFA.',
        concepts: [
            'Lookalike domains, AiTM proxies, MFA fatigue, and callback failures',
            'SPF/DKIM/DMARC alignment is necessary but not sufficient alone',
            'Reporting culture beats shame; phishing-resistant MFA beats OTP when AiTM appears'
        ],
        prevent: [
            'Passkeys/FIDO2 for VIP and finance',
            'DMARC enforcement path with monitoring first',
            'Measured simulations with coaching; one-click report buttons'
        ],
        caseStudy:
            'A Windhoek finance clerk nearly paid on a lookalike domain invoice. Dual-control callback to a known number stopped N$480k in loss the same afternoon.',
        futureScenario:
            'AI voice clone of your CFO during month-end. Challenge phrase + dual control is the brake — not “it sounded real.”'
    },
    7: {
        why: 'BEC and deepfake social engineering target payment trust more than malware.',
        concepts: [
            'Invoice redirect and vendor portal lookalikes',
            'Voice/video synthesis pressure on executives',
            'Out-of-band verification as a financial control, not optional etiquette'
        ],
        prevent: [
            'Dual control and callback on known numbers for payment changes',
            'Challenge phrases for executive voice requests',
            'Finance playbooks that slow urgency without killing business'
        ],
        caseStudy:
            'A supplier “bank change” email matched brand tone. Finance called the number on last year’s contract — fraud stopped before transfer.',
        futureScenario:
            'Real-time deepfake video in Teams. Process and dual control outrank “I saw their face.”'
    },
    8: {
        why: 'IR quality decides whether a bad day becomes an existential event — especially under executive pressure.',
        concepts: [
            'Severity models, escalation trees, and Incident Commander role clarity',
            'Containment can proceed while evidence is preserved selectively',
            'Comms must track facts — speculation creates legal and trust debt'
        ],
        prevent: [
            'Quarterly tabletop with pressure injects',
            'Named deputies for IC / comms / legal bridge',
            'Evidence kits and known-good rebuild paths tested'
        ],
        caseStudy:
            'A retailer paused public statements until containment stopped POS lateral movement. Customers got facts 90 minutes later — trust held.',
        futureScenario:
            'Regulators and WhatsApp rumors outrun your draft. Train dual-track: tech containment + careful public language.'
    },
    11: {
        why: 'Ransomware affiliates industrialize backup destruction and identity abuse before encryption.',
        concepts: [
            'Exfil-before-encrypt and VSS deletion as checklist items',
            'Immutable backup design and restore drills',
            'Negotiation is business/legal — IR keeps recovering'
        ],
        prevent: [
            'Offline/immutable backups with restore tests',
            'Tier admin model; reduce domain-wide blast radius',
            'EDR isolation playbooks rehearsed'
        ],
        caseStudy:
            'Hospital restores succeeded because backups were offline and tested — affiliates found encrypted disks but not leverage.',
        futureScenario:
            'Extortion includes stolen family photos of executives. Keep legal counsel in loop; do not halt technical recovery.'
    },
    18: {
        why: 'SOC value is judged by decisions under noise — not by alert count.',
        concepts: [
            'Alert chaining beats single-event tunnel vision',
            'Service accounts are crown jewels',
            'MTTD/MTTR on purple techniques prove maturity'
        ],
        prevent: [
            'Tune with ownership; never silent-disable high-risk rules',
            'Enrich identity context in the queue',
            'Staff to real volume; protect analysts from fatigue traps'
        ],
        caseStudy:
            'Night shift caught spray→admin$ by chaining three “medium” alerts. Flat VLAN made ERP risk real — segmentation funded next quarter.',
        futureScenario:
            'AI will summarize queues — your edge remains knowing which chain means hands-on-keyboard.'
    },
    21: {
        why: 'Zero Trust replaces “trusted network location” with continuous verification of identity, device, and context.',
        concepts: [
            'Per-request authorization and least privilege',
            'Device posture for remote/contractor access',
            'Segmentation as blast-radius control — especially near OT'
        ],
        prevent: [
            'Remove flat VPN paths to crown jewels',
            'Short-lived access and just-in-time elevation',
            'Monitor token misuse and impossible travel'
        ],
        caseStudy:
            'Contractor VPN once reached engineering jump hosts. ZTNA + device checks cut that path without killing productivity.',
        futureScenario:
            'Home routers and agentic tools request broad roles. Continuous auth and scoped tokens matter more than VPN myths.'
    },
    37: {
        why: 'Awareness is a control system — culture, channels, and drills — not an annual PDF.',
        concepts: [
            'Psychological safety increases reporting',
            'Train WhatsApp/SMS/BEC realities for African SMEs',
            'Measure behavior change, not completion checkboxes only'
        ],
        prevent: [
            'Micro-drills monthly on real channels',
            'Manager callback norms for payments',
            'Coach clickers; do not ritual-shame'
        ],
        caseStudy:
            'After a no-shame reporting campaign, phish-to-report time dropped from hours to minutes in a retail group.',
        futureScenario:
            'Deepfake supplier calls become normal. Awareness must teach process, not “spot the artifact.”'
    },
    46: {
        why: 'Reconnaissance tooling is stage-0 for both attackers and authorized testers — intent and authorization decide legality.',
        concepts: [
            'SYN/UDP scans as discovery tradecraft',
            'Internet-facing RDP/SMB as priority attack surface',
            'Change tickets and ROE separate purple from crime'
        ],
        prevent: [
            'External attack-surface monitoring with owners',
            'Network segmentation and expose-only-what-you-must',
            'Hunt unauthorized scanners as incidents'
        ],
        caseStudy:
            '03:00 full-subnet scan from a marketing laptop preceded ransomware by 48 hours. Early isolation cut blast radius.',
        futureScenario:
            'Automated scanners will blend with business bots. Authorization telemetry becomes the difference.'
    },
    51: {
        why: 'Credential dumping turns one privileged logon into domain-wide reuse.',
        concepts: [
            'LSASS/secrets as attacker gold',
            'Tiering and PAWs as architectural controls',
            'Credential Guard / Protected Users raise theft cost'
        ],
        prevent: [
            'Never administer Tier-0 from dirty workstations',
            'LAPS/gMSA; reduce standing admin',
            'EDR alerts on dump tooling + unusual LSASS access'
        ],
        caseStudy:
            'DA RDP to a helpdesk PC enabled hash reuse across file servers the same night. PAW project was funded after the postmortem.',
        futureScenario:
            'Cloud admin sessions will be the new LSASS. Session binding and short-lived tokens are the next tiering fight.'
    },
    52: {
        why: 'Commercial C2 frameworks teach defenders what “quiet persistence” looks like on the wire and host.',
        concepts: [
            'Malleable profiles and sleep jitter',
            'Process injection ancestry over filename IOCs',
            'Egress allowlists and beacon cadence hunts'
        ],
        prevent: [
            'Detect beacon patterns and rare destinations',
            'Isolate + memory capture playbooks',
            'Purple emulations that retest after tuning'
        ],
        caseStudy:
            'Beacon to a “CDN” domain every 60s with jitter was dismissed as SaaS until process ancestry showed Office→rundll32→injected thread.',
        futureScenario:
            'AI will rewrite malleable profiles weekly. Behavior and identity context stay your durable detectors.'
    },
    58: {
        why: 'Identity graphs expose how few ACL mistakes stand between an intern account and Domain Admin.',
        concepts: [
            'Dangerous edges: GenericAll, WriteDACL, force-change-password chains',
            'Shortest path metrics for remediation priority',
            'Tier-0 hygiene as continuous backlog, not a one-time project'
        ],
        prevent: [
            'Remove Helpdesk-to-Tier-0 paths',
            'Quarterly BloodHound / AD ACL reviews with owners',
            'Privileged access workstations and clean source of admin'
        ],
        caseStudy:
            'Helpdesk GenericAll on a resettable account that could reach Tier-0 was closed in a week after graph evidence hit the risk committee.',
        futureScenario:
            'Hybrid identity paths (Entra + on-prem) will be the new shortest path. Graph both sides.'
    },
    60: {
        why: 'Pass-the-Hash is credential reuse — the same story as stolen cloud tokens, older protocol.',
        concepts: [
            'NTLM hash reuse without cracking',
            'Privileged logons on dirty hosts create reusable material',
            'Cloud token theft is the executive-friendly analogue'
        ],
        prevent: [
            'Tiered admin / PAW',
            'Restrict NTLM where feasible; prefer modern auth',
            'Short-lived sessions and step-up for sensitive actions'
        ],
        caseStudy:
            'After PtH lateral movement, the board understood “DA on a laptop” as the root cause — not “antivirus missed a file.”',
        futureScenario:
            'PRT and refresh-token theft will dominate headlines. Teach reuse as a family of techniques.'
    },
    70: {
        why: 'When HTTP egress is watched, attackers still abuse DNS as a covert channel.',
        concepts: [
            'High-entropy labels and regular query cadence',
            'Internal resolvers as control points',
            'Correlate DNS anomalies with host EDR'
        ],
        prevent: [
            'Central recursive DNS with logging',
            'Sinkhole / alert rare patterns',
            'Host isolation playbooks for tunneling suspects'
        ],
        caseStudy:
            'A workstation queried entropy-heavy labels every 45s. Isolation found staging tools before exfil completed.',
        futureScenario:
            'DoH will hide some queries. Endpoint DNS telemetry becomes mandatory.'
    },
    84: {
        why: 'ATT&CK turns tool drama into a shared map of coverage, gaps, and funding asks.',
        concepts: [
            'Techniques as units of purple testing',
            'Heatmaps for leadership without fear theater',
            'Retest after each detection investment'
        ],
        prevent: [
            'Map detections and controls to technique IDs',
            'Fund blinds with measurable MTTD targets',
            'Keep matrices living — not annual wallpaper'
        ],
        caseStudy:
            'A heat map showed strong phishing detection and blind credential dumping. One sprint closed T1003 with proof on retest.',
        futureScenario:
            'Boards will ask “which techniques can we detect?” — ATT&CK fluency is career currency.'
    },
    95: {
        why: 'Purple teaming is how you prove defenses under controlled adversary pressure.',
        concepts: [
            'Emulate, measure, remediate, re-emulate',
            'Spend on dangerous blinds, not vanity metrics',
            'Shared red/blue language via ATT&CK'
        ],
        prevent: [
            'Scheduled purple weeks with ROE',
            'Publish MTTD/MTTR deltas',
            'Close findings with owners and retest dates'
        ],
        caseStudy:
            'Phishing caught in 4 minutes; LSASS dump missed. Next sprint funded credential controls — retest passed.',
        futureScenario:
            'Continuous automated emulation will replace annual theater. Humans still decide what “good enough” means for the business.'
    }
};

function getTierAEssays(moduleId) {
    return TIER_A_ESSAYS[moduleId] || null;
}

module.exports = {
    TIER_A_QUESTIONS,
    TIER_A_EXTRAS,
    TIER_A_ESSAYS,
    getTierAEssays
};
