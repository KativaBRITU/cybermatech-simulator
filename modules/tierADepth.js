/**
 * Paid-grade depth for Tier A modules — extra questions + study extras.
 * Merged into assessmentEngine / contentLibrary.
 */

function q(question, options, correct, explanation, topic, time_expected = 40, meta = {}) {
    return {
        question,
        options,
        correct,
        explanation,
        topic,
        time_expected,
        distractor_rationale: meta.distractor_rationale || null,
        cognitive_level: meta.cognitive_level || null,
        difficulty: meta.difficulty || null,
        coverage_tag: meta.coverage_tag || null,
        rotation_bucket: meta.rotation_bucket || null,
        last_validated: meta.last_validated || null,
        retired: meta.retired || false,
        supersedes: meta.supersedes || null,
    };
}

function essay(question, guidelines, rubric = null) {
    return {
        question,
        guidelines,
        rubric,
    };
}

const TIER_A_QUESTIONS = {
    1: [

        q(

            "An employee reports receiving unauthorized password reset notifications immediately after logging into their corporate M365 account using a standard hardware token. No suspicious inbound emails appear in the inbox. Your initial diagnostic priority is:",

            [

                "Audit Azure sign-in logs for concurrent sessions from unexpected proxy IP ranges",

                "Reset the domain controller administrator password immediately to stop lateral movement",

                "Reboot the local workstation to clear any resident keylogger from physical memory",

                "Disable all external email forwarding rules on the tenant profile to prevent leaks"

            ],

            0,

            "Anomalous sign-in logs with sudden IP changes despite valid MFA point directly to adversary-in-the-middle session hijacking.",

            "aitm",

            45,

            {

                distractor_rationale: [

                    "CORRECT — session token theft bypasses standard MFA, requiring log analysis of token claims and proxy indicators.",

                    "WRONG — domain controller resets do not mitigate user-level session cookie theft or reverse proxy tokens.",

                    "WRONG — keyloggers are secondary; if MFA was entered correctly, the failure point is likely an upstream proxy relay.",

                    "WRONG — forwarding rules address mailbox compromise, not immediate token hijacking or session replay."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1539",

                rotation_bucket: "aitm",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "The finance department receives an urgent WhatsApp message and follow-up email appearing to come from the CEO, requesting an immediate wire transfer for a closing deadline. The sender number is a foreign prefix, but the display name and profile picture match. Your first containment action is:",

            [

                "Call the CEO on a known internal extension out-of-band before any transfer",

                "Forward the email to the entire organization as an emergency security warning",

                "Approve the transfer with a half-amount split to minimize immediate exposure",

                "Block the domain at the mail gateway, then approve if the CEO confirms in chat"

            ],

            0,

            "Out-of-band verification via a trusted, independent communication channel is the primary defense against executive impersonation and deepfake/BEC fraud.",

            "bec",

            45,

            {

                distractor_rationale: [

                    "CORRECT — out-of-band verification confirms identity independently of compromised or spoofed messaging channels.",

                    "WRONG — organizational-wide warnings create panic and do not immediately verify or contain the specific fraudulent request.",

                    "WRONG — partial transfers still result in financial loss and validate the attacker's persistence.",

                    "WRONG — blocking the domain helps prevent future emails, but does not stop the active WhatsApp or multi-channel attack."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1656",

                rotation_bucket: "bec",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "A Tier-1 SOC analyst receives a phishing link click alert for a user who self-reported clicking and submitted a screenshot. The analyst has 40 unread alerts in queue and 10 minutes before shift handover. The SOP says \"verify, then isolate, then document.\" What is the most professional judgment under this workload pressure?",

            [

                "Verify the URL against intel, isolate if malicious, document and defer queue backlog",

                "Skip verification and isolate the endpoint immediately since the user self-reported the click",

                "Document the ticket first and leave queue triage for the incoming shift engineer",

                "Route the alert directly to the on-call incident commander and close the ticket as duplicate"

            ],

            0,

            "Professional triage balances rapid risk containment with evidence preservation and realistic workflow prioritization under duress.",

            "reporting",

            30,

            {

                distractor_rationale: [

                    "CORRECT — focused verification ensures proportionate response without skipping critical validation steps or abandoning documentation.",

                    "WRONG — isolating without verification risks unnecessary business disruption for benign or blocked outbound links.",

                    "WRONG — deferring triage of an active user click violates basic containment SLAs and allows dwell time to grow.",

                    "WRONG — escalating raw alerts to incident commanders without initial scoping overwhelms senior engineering resources."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1566.002",

                rotation_bucket: "reporting",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "An employee enters their credentials into a fake login portal after clicking a link in a realistic company policy notification email. Ten minutes later, they realize their mistake and notify IT. Beyond resetting their password and checking individual session tokens, what is the most critical next check for enterprise scoping?",

            [

                "Query email gateway logs for identical sender hashes or subject lines across all mailboxes",

                "Reinstall the operating system from a clean recovery image across all department machines",

                "Change the passwords of all other employees in the exact same department as a precaution",

                "Issue a formal disciplinary warning to the employee for failing security awareness training"

            ],

            0,

            "Targeted credential harvesting campaigns are rarely isolated; checking for identical indicators across the tenant determines if it is a broad campaign.",

            "aitm",

            45,

            {

                distractor_rationale: [

                    "CORRECT — scoping the wider tenant for identical phishing indicators identifies other potential victims in a campaign.",

                    "WRONG — OS reinstallation is unnecessary for a single credential-phishing event unless local malware execution was verified.",

                    "WRONG — resetting an entire department's passwords causes unnecessary operational friction without targeted indicators.",

                    "WRONG — punitive measures hinder future incident reporting culture."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1078",

                rotation_bucket: "aitm",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "An employee asks whether using a standard 6-digit Time-based One-Time Password (TOTP) authenticator app is considered \"phishing-resistant.\" Your correct technical assessment is:",

            [

                "No — TOTP codes can be intercepted and relayed via AiTM proxy frameworks in real time",

                "Yes, because rotating 30-second codes cannot be guessed or reused by an attacker on the wire",

                "Yes, provided the code is entered into a company-approved browser extension during login",

                "No, unless the authenticator app is locked behind a secondary biometric device PIN code"

            ],

            0,

            "Standard TOTP codes are vulnerable to real-time interception via adversary-in-the-middle phishing kits, unlike hardware FIDO2/WebAuthn keys.",

            "aitm",

            45,

            {

                distractor_rationale: [

                    "CORRECT — TOTP tokens are susceptible to real-time relay attacks via reverse proxies.",

                    "WRONG — rapid rotation prevents offline reuse, but does not stop live relay during active phishing.",

                    "WRONG — browser extensions do not protect against proxy-based token capture.",

                    "WRONG — device locks protect local access, not network interception."

                ],

                cognitive_level: 2,

                difficulty: 2,

                coverage_tag: "T1539",

                rotation_bucket: "aitm",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "An accounts payable clerk receives an email stating that a key hardware vendor is changing their banking details to a new commercial account, accompanied by a scanned letter on official company letterhead. Before updating the payment profile, what is the mandatory verification step?",

            [

                "Call the vendor on a pre-established trusted number from records, never the number in the email",

                "Reply to the email asking the account manager to confirm the change via return message",

                "Check if the new bank routing code belongs to a licensed commercial bank in your region",

                "Approve the profile change if the scanned letter contains a valid company registration stamp"

            ],

            0,

            "Vendor bank change requests must be validated strictly via pre-established trusted phone numbers to prevent business email compromise (BEC).",

            "bec",

            45,

            {

                distractor_rationale: [

                    "CORRECT — trusted pre-established numbers bypass compromised email communication loops.",

                    "WRONG — replying to the email reaches the attacker if the vendor mailbox is already compromised.",

                    "WRONG — valid bank routing codes do not verify the legitimacy of the recipient entity.",

                    "WRONG — letterhead stamps and PDFs are easily fabricated by cybercriminals."

                ],

                cognitive_level: 2,

                difficulty: 2,

                coverage_tag: "T1656",

                rotation_bucket: "bec",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "An employee realizes they entered credentials into a phishing portal 5 minutes ago and notifies the helpdesk. The analyst confirms the employee accessed a URL that returned a 200 with a fake login page. Before revoking sessions, what is the most critical first action to preserve evidence?",

            [

                "Capture the URL, screenshot the portal, and preserve the email headers for legal or forensic review",

                "Revoke sessions immediately because operational containment always supersedes evidence retention",

                "Wait for the employee to write a detailed witness statement while their memory is still fresh",

                "Delete the phishing email from the user inbox immediately to prevent secondary clicks"

            ],

            0,

            "Evidence preservation (URL, screenshot, headers) before containment ensures the attack can be reconstructed for coordination and legal.",

            "reporting",

            45,

            {

                distractor_rationale: [

                    "CORRECT — capturing artifacts prior to mitigation ensures perishable indicators and headers are preserved.",

                    "WRONG — while containment is vital, acting without capturing immediate transient browser artifacts destroys forensic value.",

                    "WRONG — witness statements are secondary to technical log and header artifacts.",

                    "WRONG — deleting the email destroys the primary threat artifact before collection."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1566.002",

                rotation_bucket: "reporting",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "When an employee submits a suspicious phishing email via the security reporting plugin, what key metadata elements are most vital for the SOC automated pipeline to extract instantly?",

            [

                "Original RFC 822 internet headers, sender IP routing path, and embedded URL/attachment hashes",

                "The user's department head and their line manager for approval workflow routing",

                "The user's device model and operating system version for local endpoint profiling",

                "The user's last login IP and geolocation from the Identity Provider for context"

            ],

            0,

            "RFC 822 headers and file/URL hashes provide the precise technical indicators needed for threat intelligence correlation and gateway blocking.",

            "reporting",

            45,

            {

                distractor_rationale: [

                    "CORRECT — technical headers and hashes are essential for accurate threat analysis and blocking.",

                    "WRONG — management routing metadata is secondary to core artifact IOC extraction.",

                    "WRONG — endpoint OS version is not part of internet email routing headers.",

                    "WRONG — user login geolocation belongs to IdP sign-in logs rather than email header analysis."

                ],

                cognitive_level: 2,

                difficulty: 2,

                coverage_tag: "T1566",

                rotation_bucket: "reporting",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "When configuring Conditional Access policies in Microsoft Entra ID to mitigate adversary-in-the-middle session token theft, which control combination provides the highest level of structural protection?",

            [

                "Require phishing-resistant MFA (FIDO2) combined with compliant device claims and strict sign-in frequency limits",

                "Enforce standard SMS verification codes alongside optional legacy TLS authentication protocols",

                "Restrict user access solely by IP subnet geofencing while allowing any standard software token",

                "Disable all session timeouts to ensure users never experience re-authentication prompts"

            ],

            0,

            "FIDO2 combined with device compliance and conditional access restricts token export and replay.",

            "aitm",

            45,

            {

                distractor_rationale: [

                    "CORRECT — phishing-resistant authentication paired with device compliance mitigates stolen session tokens.",

                    "WRONG — SMS and legacy protocols are highly vulnerable to interception and modern bypass attacks.",

                    "WRONG — IP geofencing is easily bypassed via residential proxies and VPNs.",

                    "WRONG — infinite session lifespans increase exposure windows for stolen session cookies."

                ],

                cognitive_level: 2,

                difficulty: 2,

                coverage_tag: "T1556.006",

                rotation_bucket: "aitm",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "The finance manager receives a phone call from someone whose voice matches the Chief Executive Officer, requesting an urgent wire transfer for an acquisition. The caller claims to be calling from a noisy airport lounge on a mobile phone with poor reception. Your recommended verification policy is:",

            [

                "Refuse the transfer and require verification via a pre-established internal callback number or out-of-band channel",

                "Proceed with the transfer since the vocal cadence and speech patterns matched the CEO",

                "Ask the caller to recite their corporate login password over the active phone call as proof",

                "Execute half the wire amount now and wait for the airport flight to land before sending the rest"

            ],

            0,

            "Audio-only deepfakes require strict out-of-band callback verification using pre-established numbers rather than trusting vocal recognition.",

            "bec",

            45,

            {

                distractor_rationale: [

                    "CORRECT — pre-established callback channels bypass audio deepfakes and caller ID spoofing.",

                    "WRONG — modern voice cloning models replicate pitch and cadence accurately enough to fool casual listeners.",

                    "WRONG — sharing passwords over voice channels creates severe credential exposure risks.",

                    "WRONG — partial wire transfers still result in capital loss and encourage attacker persistence."

                ],

                cognitive_level: 3,

                difficulty: 3,

                coverage_tag: "T1656",

                rotation_bucket: "bec",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "An employee receives a high-urgency message stating their corporate payroll profile will be deactivated within two hours unless they verify their credentials immediately. This tactic primarily exploits which human cognitive vulnerability?",

            [

                "Artificial urgency and fear of negative consequences designed to bypass critical thinking",

                "Curiosity regarding internal company reorganization announcements and bonuses",

                "Desire to help coworkers resolve IT support tickets during peak hours",

                "Compliance with routine quarterly audit document submission workflows"

            ],

            0,

            "Social engineering attacks rely heavily on artificial time pressure and intimidation to induce rushed decision-making.",

            "bec",

            30,

            {

                distractor_rationale: [

                    "CORRECT — urgency and negative consequences induce panic, bypassing careful analysis.",

                    "WRONG — curiosity targets different lures (e.g., compensation lists) rather than payroll deactivation.",

                    "WRONG — helpfulness describes support scams, not imminent account loss threats.",

                    "WRONG — routine compliance lacks the fabricated panic and immediate threat window."

                ],

                cognitive_level: 1,

                difficulty: 1,

                coverage_tag: "T1598",

                rotation_bucket: "bec",

                last_validated: "2026-11-07"

            }

        ),

        q(

            "What is the primary operational benefit of fostering a blame-free security incident reporting culture within an enterprise?",

            [

                "It eliminates psychological barriers, increasing reporting speed and reducing attacker dwell time",

                "It replaces the need for automated endpoint detection and response software agents",

                "It guarantees that zero phishing emails will ever bypass the secure email gateway",

                "It transfers legal liability for security breaches entirely from the company to individual staff"

            ],

            0,

            "A blame-free culture removes psychological barriers, ensuring rapid reporting of security incidents and minimizing adversary dwell time.",

            "reporting",

            30,

            {

                distractor_rationale: [

                    "CORRECT — removing fear encourages prompt reporting, shortening the time to detect and contain threats.",

                    "WRONG — cultural practices do not replace technical endpoint monitoring defenses.",

                    "WRONG — no security perimeter can achieve 100% prevention against novel attacks.",

                    "WRONG — liability cannot be legally shifted to employees in this manner."

                ],

                cognitive_level: 1,

                difficulty: 1,

                coverage_tag: "T1566",

                rotation_bucket: "reporting",

                last_validated: "2026-11-07"

            }

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
                'Legal/leadership decision with IR facts; continue recovery; do not halt containment for chat drama',
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
        essay(
            'Write a 90-second executive brief after an AiTM campaign stole three finance sessions despite OTP MFA. Cover: what happened, immediate containment, why OTP failed, and a 30-day control plan.',
            'Plain language, no jargon dumps. Name phishing-resistant MFA and session controls. Include dual-control payment freeze.'
        ),
        essay(
            'Design a Namibian SME phishing program for WhatsApp + email invoice fraud. Include measurement, coaching (no shame), and escalation to SOC.',
            'Channel-realistic. Define KPIs (report time, callback adherence) not just completion rates.'
        )
    ],
    7: [
        essay(
            'A deepfake “CFO” voice asks for an urgent wire during month-end. Write the finance playbook step-by-step for the first 10 minutes.',
            'Challenge phrase, dual control, known-number callback, what not to do under authority pressure.'
        )
    ],
    8: [
        essay(
            'You are Incident Commander. Encryption is spreading; Legal wants a public statement in 20 minutes. Write dual-track orders for tech containment and communications.',
            'Facts only in comms. Named owners. Unsafe actions under panic listed explicitly.'
        )
    ],
    11: [
        essay(
            'Affiliates deleted VSS and began exfil before encrypt. Draft a board recovery narrative: backups, identity tiering, and whether ransom negotiation is an IR decision.',
            'Separate business/legal payment decisions from technical recovery. Cite restore-test evidence.'
        )
    ],
    18: [
        essay(
            'Night shift closed 200 medium alerts without reading due to fatigue. Write a SOC lead remediation plan covering tuning ownership, staffing, and protection of high-fidelity rules.',
            'Treat fatigue as design failure. Include MTTD/MTTR on purple techniques as success metrics.'
        )
    ],
    21: [
        essay(
            'Contractors on flat VPN can reach SCADA jump hosts. Propose a Zero Trust migration that keeps the plant running.',
            'Segmentation, device posture, least privilege, short-lived access. No “trust the VPN” leftovers.'
        )
    ],
    37: [
        essay(
            'Rewrite an annual shame-based awareness program into a monthly micro-drill system for retail staff who live on WhatsApp.',
            'Psychological safety, channel realism, manager callback norms, measurable behavior change.'
        )
    ],
    46: [
        essay(
            'Unauthorized 03:00 full-subnet SYN scan from a marketing laptop. Write the SOC case narrative and 48-hour hunt plan as if ransomware may follow.',
            'Recon as precursor. Isolation, authorization check, sibling hunt, ticket with owner.'
        )
    ],
    51: [
        essay(
            'Explain to a board why Domain Admin on a helpdesk PC is an architectural failure, using Mimikatz-class theft and Pass-the-Hash as the story.',
            'PAW/tiering language. Avoid tool worship. Tie to business blast radius.'
        )
    ],
    52: [
        essay(
            'Write a detection engineering brief for malleable HTTP C2 with sleep jitter. What do you hunt, what do you ignore, and how do you purple-test it?',
            'Beacon cadence, process ancestry, rare destinations. Retest after tuning.'
        )
    ],
    58: [
        essay(
            'BloodHound shows Helpdesk GenericAll on a path to Tier-0. Write a risk-committee paper: severity, owners, 30/60/90 remediation, and retest proof.',
            'Attack paths as backlog. Shortest-path metric. No inventory theater.'
        )
    ],
    60: [
        essay(
            'Teach executives Pass-the-Hash using cloud session-token theft as the analogy. Include the architectural fix and a 10-minute containment checklist.',
            'Reuse family of techniques. Tiering + short-lived creds. Clear containment steps.'
        )
    ],
    70: [
        essay(
            'High-entropy DNS every 45s from one host. Write the hunt-to-contain playbook and the durable DNS architecture controls.',
            'Recursive resolvers, logging, sinkhole, EDR correlation. Avoid “block all DNS.”'
        )
    ],
    84: [
        essay(
            'Build a one-page ATT&CK heatmap story for leadership: strong phishing coverage, blind credential dumping. Ask for funding with measurable MTTD targets.',
            'Shared vocabulary. Retestable outcomes. No fear theater.'
        )
    ],
    95: [
        essay(
            'Purple week results: phishing MTTD 4 minutes; LSASS dump missed. Write the sprint plan and the re-emulation success criteria.',
            'Fund dangerous blinds. Owners, dates, retest proof. Emulate → remediate → re-emulate.'
        )
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

const MODULE_ROTATION_MIN = 12;
const MODULE_ROTATION_MIN_BUCKETS = 3;

module.exports = {
    TIER_A_QUESTIONS,
    TIER_A_EXTRAS,
    TIER_A_ESSAYS,
    getTierAEssays,
    MODULE_ROTATION_MIN,
    MODULE_ROTATION_MIN_BUCKETS,
};