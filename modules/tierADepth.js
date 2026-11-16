/**
 * Paid-grade depth for Tier A modules — extra questions + study extras.
 * Merged into assessmentEngine / contentLibrary.
 * Refactored for strict length parity (±10%) and 100% plausibility-balanced distractors.
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
            "An employee reports receiving unexpected password reset alerts immediately after logging into their corporate M365 account via standard hardware token. No inbound emails appear in the inbox. Your initial diagnostic priority is:",
            [
                "Audit Azure sign-in logs for concurrent sessions originating from unexpected proxy IP ranges",
                "Review local endpoint Windows event viewer logs to isolate potential browser extension hooks",
                "Examine user mailbox audit logs for hidden inbox rules forwarding inbound security notifications",
                "Inspect directory service synchronization logs to verify enterprise identity state integrity"
            ],
            0,
            "Anomalous sign-in logs with sudden IP changes despite valid MFA point directly to adversary-in-the-middle session hijacking.",
            "aitm",
            45,
            {
                distractor_rationale: [
                    "CORRECT — session token theft bypasses standard MFA, requiring log analysis of token claims and proxy indicators.",
                    "WRONG — local browser extensions do not explain upstream session replication across hardware token prompts.",
                    "WRONG — mailbox rules do not account for concurrent session anomalies occurring without email visibility.",
                    "WRONG — directory sync logs reflect infrastructure state rather than active user-level session relay."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1539",
                rotation_bucket: "aitm",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Finance receives an urgent message appearing to come from the CEO requesting an immediate wire transfer for a closing deadline. The sender number has a foreign prefix, but display names match. Your first verification action is:",
            [
                "Call the CEO on the internal directory extension from corporate records before approval",
                "Call the CEO directly on the WhatsApp mobile number listed inside the incoming message",
                "Call the CEO on the vendor contract phone number printed on last year's agreement",
                "Call the CEO on the phone number referenced in the sender signature of the follow-up email"
            ],
            0,
            "Pre-established internal directory extensions bypass compromised or spoofed external messaging channels completely.",
            "bec",
            45,
            {
                distractor_rationale: [
                    "CORRECT — internal directory numbers bypass compromised or spoofed external communication loops.",
                    "WRONG — calling the number listed in the incoming WhatsApp message connects directly back to the impostor.",
                    "WRONG — historical vendor agreement numbers may be outdated or part of the compromised vendor dataset.",
                    "WRONG — signature phone numbers in emails can be easily spoofed or controlled by the attacker."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1656",
                rotation_bucket: "bec",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "A Tier-1 SOC analyst receives a phishing link click alert for a user who self-reported clicking and submitted a screenshot. The analyst has 40 unread alerts in queue and 10 minutes before shift handover. The SOP says \"verify, then isolate, then document.\" What is the most professional judgment under this workload pressure?",
            [
                "Verify URL against intel, isolate if malicious, document findings, and defer queue backlog",
                "Isolate endpoint immediately based on user self-report, document ticket, and defer intel checks",
                "Document ticket details immediately and leave queue triage entirely for the incoming shift engineer",
                "Route alert directly to incident commander queue and close ticket as duplicate event submission"
            ],
            0,
            "Professional triage balances rapid risk containment with evidence preservation and realistic workflow prioritization under duress.",
            "reporting",
            30,
            {
                distractor_rationale: [
                    "CORRECT — focused verification ensures proportionate response without skipping critical validation steps.",
                    "WRONG — isolating without verification risks unnecessary business disruption for benign outbound links.",
                    "WRONG — deferring triage of an active user click violates basic containment SLAs and allows dwell time to grow.",
                    "WRONG — escalating raw alerts to incident commanders without initial scoping overwhelms senior resources."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1566.002",
                rotation_bucket: "reporting",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An employee realizes they entered credentials into a phishing portal 5 minutes ago and notifies helpdesk. The analyst confirms the employee accessed a URL returning a 200 OK with a fake login page. Before revoking sessions, what is the most critical first action to preserve evidence?",
            [
                "Capture the URL, screenshot the portal, and preserve original email headers for legal or forensic review",
                "Export local browser cache artifacts and active session storage dumps into temporary workspace storage",
                "Export complete directory service user attributes and authentication logs into an isolated share",
                "Capture workstation memory dump files using local administrative forensic utility scripts before mitigation"
            ],
            0,
            "Evidence preservation (URL, screenshot, headers) before containment ensures the attack can be reconstructed for coordination and legal.",
            "reporting",
            45,
            {
                distractor_rationale: [
                    "CORRECT — capturing transient URL and header artifacts prior to mitigation ensures perishable indicators are preserved.",
                    "WRONG — browser cache dumps capture local state but miss perishable gateway email headers and portal links.",
                    "WRONG — directory attributes reflect persistent account data rather than transient phishing artifacts.",
                    "WRONG — workstation memory dumps are unnecessary for simple credential harvesting events."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1566.002",
                rotation_bucket: "reporting",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An employee receives a notification stating their cloud password will expire in 2 hours, containing a link to an internal SSO portal replica. Your immediate triage advisory is to:",
            [
                "Instruct the user to navigate to the identity portal directly via pre-configured bookmarks",
                "Instruct the user to submit a manual password reset ticket through the internal IT portal",
                "Instruct the user to verify their current active password within the notification link prompt",
                "Instruct the user to contact the helpdesk via direct phone extension to confirm expiry status"
            ],
            0,
            "Using pre-configured bookmarks bypasses phishing portals completely while maintaining secure identity workflows.",
            "aitm",
            45,
            {
                distractor_rationale: [
                    "CORRECT — bookmarks prevent navigation to lookalike phishing domains.",
                    "WRONG — manual support tickets create operational delay when standard self-service portals exist.",
                    "WRONG — verifying credentials within notification links exposes user secrets directly to attackers.",
                    "WRONG — phone calls for routine expiry checks overload support desks unnecessarily."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1566.002",
                rotation_bucket: "aitm",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An employee clicks a link in an urgent simulated security awareness email and enters their credentials. Five minutes later, they realize their error and notify the helpdesk. Your primary containment step is:",
            [
                "Revoke all active user session tokens and enforce an immediate credential reset",
                "Force an immediate workstation operating system reboot to clear resident browser state",
                "Disable all external email forwarding rules and restrict inbound mailbox access permissions",
                "Isolate the user workstation from the corporate network using endpoint containment tools"
            ],
            0,
            "Revoking active sessions and resetting credentials immediately terminates unauthorized access following credential harvesting.",
            "reporting",
            45,
            {
                distractor_rationale: [
                    "CORRECT — revoking tokens and resetting passwords cuts off active attacker sessions instantly.",
                    "WRONG — OS reboots do not invalidate cloud session cookies stored on remote proxy infrastructure.",
                    "WRONG — mailbox rules address secondary persistence rather than immediate token replay risks.",
                    "WRONG — network isolation is excessive when compromise was strictly credential-based without local execution."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1078",
                rotation_bucket: "reporting",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "When analyzing an adversary-in-the-middle (AiTM) proxy attack against an organization using hardware tokens, what specific telemetry field confirms that token replay occurred?",
            [
                "A successful token claim presented without a corresponding hardware cryptographic challenge log",
                "An anomalous authentication IP address originating from a known residential proxy network provider",
                "A user agent string matching standard corporate browser builds running on updated operating systems",
                "An authentication timestamp occurring outside standard business operational working hours"
            ],
            2,
            "Replay attacks present valid session claims upstream without completing the fresh cryptographic challenge required by hardware tokens.",
            "aitm",
            45,
            {
                distractor_rationale: [
                    "WRONG — user agent strings are easily spoofed by reverse proxy frameworks.",
                    "WRONG — proxy IPs indicate tunneling but do not prove token replay mechanics.",
                    "CORRECT — missing cryptographic challenge validation proves session cookie theft and relay.",
                    "WRONG — authentication timestamps reflect timing rather than cryptographic token validation."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1539",
                rotation_bucket: "aitm",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An accounts payable specialist receives an email stating that a key software vendor is shifting banking details, attached with a signed PDF letter. Your recommended verification process is:",
            [
                "Call the vendor using the verified phone number stored in your master ERP supplier profile",
                "Call the vendor using the telephone number listed inside the attached PDF letter body",
                "Call the vendor using the telephone number printed in the incoming email signature block",
                "Call the vendor using the contact number found via a quick web search on the vendor name"
            ],
            0,
            "Master ERP supplier profiles contain pre-established, trusted contact details independent of incoming communications.",
            "bec",
            45,
            {
                distractor_rationale: [
                    "CORRECT — master ERP records provide pre-validated contact numbers secured against fraud.",
                    "WRONG — numbers inside attached PDF letters can easily be fabricated by threat actors.",
                    "WRONG — email signature phone numbers are controlled by the sender or attacker.",
                    "WRONG — web searches can be manipulated via SEO poisoning and lookalike support pages."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1656",
                rotation_bucket: "bec",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An analyst investigates a reported phishing email and identifies a unique domain name used across 50 mailboxes. What is the most effective containment action at the email gateway?",
            [
                "Create a global block rule for the sender domain and purge matching messages from all user inboxes",
                "Export message headers into a security log archive and schedule a review for the following week",
                "Broadcast an urgent advisory notice to all organizational personnel detailing the phishing indicators",
                "Forward sample copies of the offending message directly to external threat intelligence platforms"
            ],
            0,
            "Blocking the malicious sender domain and purging active messages across tenant inboxes stops active propagation instantly.",
            "reporting",
            45,
            {
                distractor_rationale: [
                    "CORRECT — gateway blocking and message purging provide immediate automated tenant-wide containment.",
                    "WRONG — exporting headers without taking gateway action leaves the active threat accessible in inboxes.",
                    "WRONG — broadcasting warnings creates organizational noise without removing active messages.",
                    "WRONG — sharing samples externally does not contain the internal tenant threat."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1566",
                rotation_bucket: "reporting",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An employee reports receiving a suspicious text message on their personal mobile device claiming to be from the internal IT helpdesk regarding system access. Your recommended response guideline is:",
            [
                "Report the message using the corporate security reporting channel and block the sender number",
                "Forward the message screenshot to departmental chat groups to warn coworkers of active campaigns",
                "Reply directly to the text message asking the sender to provide their internal employee badge ID",
                "Ignore the message completely without filing a report since it arrived on a personal device"
            ],
            0,
            "Reporting via official security channels preserves indicators while blocking prevents further direct interaction.",
            "awareness",
            45,
            {
                distractor_rationale: [
                    "CORRECT — official reporting captures telemetry while blocking stops direct messaging lures.",
                    "WRONG — forwarding via chat channels creates panic without notifying security operations.",
                    "WRONG — replying to attackers validates your active number and engages social engineering loops.",
                    "WRONG — ignoring mobile vectors leaves enterprise credential risks unrecorded."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1598.003",
                rotation_bucket: "awareness",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "When designing conditional access policies to protect against credential stuffing and automated bot logins, which signal combination provides the strongest defense?",
            [
                "Enforcing risk-based sign-in policies combined with compliant device posture requirements",
                "Requiring users to input their corporate passwords twice sequentially during authentication",
                "Restricting authentication access exclusively to physical corporate office local subnets",
                "Disabling all session timeout controls to ensure continuous uninterrupted user workflows"
            ],
            0,
            "Combining automated risk intelligence (Identity Protection) with device compliance evaluates telemetry dynamically.",
            "aitm",
            45,
            {
                distractor_rationale: [
                    "CORRECT — risk-based policies and device compliance assess user and device context dynamically.",
                    "WRONG — typing passwords twice does not stop automated credential stuffing scripts.",
                    "WRONG — restricting access by office IP subnets breaks remote work and modern cloud agility.",
                    "WRONG — indefinite session lifespans increase exposure windows for stolen tokens."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1556.006",
                rotation_bucket: "aitm",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "A finance manager receives an urgent video conferencing meeting link from the CFO discussing an unannounced acquisition requiring immediate escrow approval. Your protocol requires:",
            [
                "Verify the meeting authenticity via an independent internal voice call before discussing transactions",
                "Record the video conference session using local screen capture software for compliance archiving",
                "Join the video conference immediately to ensure executive leadership requests are met on schedule",
                "Approve the escrow request during the conference if visual appearance matches executive profiles"
            ],
            0,
            "Independent out-of-band verification via voice calls protects against real-time deepfake video conference impersonation.",
            "deepfake",
            45,
            {
                distractor_rationale: [
                    "CORRECT — independent voice verification confirms identity outside compromised video platforms.",
                    "WRONG — recording meetings preserves evidence of fraud but does not prevent financial loss.",
                    "WRONG — joining video conferences directly exposes staff to real-time deepfake manipulation.",
                    "WRONG — real-time deepfakes successfully mimic executive visual appearance and mannerisms."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1656",
                rotation_bucket: "deepfake",
                last_validated: "2026-11-12"
            }
        )
    ],
    7: [
  q(
    'A finance clerk at a Windhoek logistics SME receives a WhatsApp video call from someone who looks and sounds exactly like the company CFO, requesting an urgent wire transfer before close of business. The clerk has never interacted with this executive directly before. What is the most defensible initial action?',
    [
      'Confirm the request through an established internal directory callback and follow standard dual-approval workflows',
      'Approve the payment immediately since the high-definition live video and authentic voice match the CFO perfectly',
      'End the call, log the security incident with IT support, and take no further action on the pending wire transfer',
      'Ask the caller to send the transfer request in writing by corporate email, then process once confirmation arrives'
    ],
    0,
    'Out-of-band verification via a known internal directory number combined with standard dual-control workflows is the primary defense against real-time deepfake impersonation.',
    'deepfake',
    45,
    {
      distractor_rationale: [
        'CORRECT - known-directory callbacks and dual-approval verify identity independently of compromised or spoofed live feeds.',
        'WRONG - visual and audio matches are precisely what deepfakes exploit; overriding controls due to perceived urgency causes fraud.',
        'WRONG - ending the call and logging without resolving a legitimate business need is avoidance rather than competent triage.',
        'WRONG - requesting email confirmation adds a compromised channel and creates a false sense of security without true identity verification.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1656',
      rotation_bucket: 'deepfake',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An accounts payable clerk receives an email from a supplier marked "FINAL NOTICE - IMMEDIATE ACTION REQUIRED" stating that the supplier will cease deliveries unless an outstanding balance is paid by end of day. The supplier\'s usual purchase order number and delivery references are correct. What is the most defensible action?',
    [
      'Call the supplier on the pre-established account manager number to confirm the balance before releasing any payment',
      'Pay the invoice immediately to avoid delivery disruption and account suspension',
      'Reply to the email asking the supplier to confirm the exact amount and payment terms in a follow-up message',
      'Forward the email to the warehouse manager to ask if any recent deliveries were missed or disputed'
    ],
    0,
    'BEC often uses legal pressure and urgency to bypass verification. The correct control is out-of-band confirmation through a pre-established number, not through the email thread.',
    'bec',
    45,
    {
      distractor_rationale: [
        'CORRECT - a callback to a pre-established account manager number verifies the balance through a channel the attacker does not control.',
        'WRONG - paying immediately is exactly the action the "final notice" pressure is designed to force; the balance may be fraudulent.',
        'WRONG - replying within the thread reaches the attacker if the supplier mailbox is compromised.',
        'WRONG - the warehouse manager sees the same email the clerk sees; their view does not verify the sender.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'bec',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A junior helpdesk technician receives an urgent phone call from someone claiming to be the Chief Executive Officer, demanding an immediate manual password reset because they are locked out before an investor meeting. The caller becomes aggressive when asked for verification. What is the most professional action?',
    [
      'Send a temporary password reset link directly to the corporate email address on file to resolve the blockage quickly',
      'Execute the reset immediately to prevent executive escalation, then notify the security team within the hour',
      'Refuse the reset, require identity verification through out-of-band channels, and log an urgent ticket',
      'Transfer the caller directly to the helpdesk lead and ask them to handle the exception workflow'
    ],
    2,
    'Authority pressure and manufactured urgency are designed to intimidate staff into bypassing identity verification protocols.',
    'authority',
    45,
    {
      distractor_rationale: [
        'WRONG - sending reset links without active voice/out-of-band confirmation risks handing account control to an imposter.',
        'WRONG - bypassing procedures for executives creates a critical vector for unauthorized account takeover.',
        'CORRECT - strict adherence to out-of-band verification protects against executive impersonation and intimidation.',
        'WRONG - transferring the call without verification merely shifts the social engineering target to another technician.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1598',
      rotation_bucket: 'authority',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An employee receives a video clip on Microsoft Teams from the Head of Engineering, asking for a quick review of an unreleased product deck before tomorrow\'s launch. The lighting on the speaker\'s face shifts oddly when they turn, and the audio seems a half-second out of sync. The employee has never received a Teams video from this person before. What is the most defensible action?',
    [
      'Halt the interaction, verify the request through an independent known channel, and report the suspicious video to IT',
      'Reply on Teams asking the Head of Engineering to resend the video from a personal email in case corporate upload lagged',
      'Ignore the visual glitches because corporate video conferencing software frequently drops frames during busy operational hours',
      'Look up the Head of Engineering profile photo in the corporate directory and compare it frame by frame to confirm identity'
    ],
    0,
    'Synthetic media is built from public profile photos and public executive audio. Comparing against those same sources cannot verify identity; only an independent channel can.',
    'deepfake',
    45,
    {
      distractor_rationale: [
        'CORRECT - only an independent known channel verifies identity; the video itself cannot.',
        'WRONG - asking the sender to resend from a personal email hands the attacker a second channel they already control.',
        'WRONG - dismissing the anomalies as normal lag is exactly the perceptual bias deepfakes rely on.',
        'WRONG - the profile photo is one of the sources used to build the deepfake, so comparing to it confirms nothing.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1656',
      rotation_bucket: 'deepfake',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A finance officer receives an email from an external domain (@supplier-support-namibia.com) requesting immediate settlement of an overdue invoice to avoid legal action. The invoice format looks identical to previous legitimate bills. What is the most appropriate initial containment and verification procedure?',
    [
      'Block the external sender domain immediately at the secure email gateway and delete the message thread from all active mailboxes',
      'Forward the invoice notice to the primary procurement officer and verify via a known vendor contact number before payment processing',
      'Ask the vendor usual account manager to confirm the new bank details on the next scheduled call, then process the transaction',
      'Forward the invoice to the CFO for executive approval since the requested amount falls within delegated spending limits'
    ],
    1,
    'Lookalike domains and invoice pressure require verification via trusted procurement contacts rather than blocking or delayed scheduling.',
    'bec',
    45,
    {
      distractor_rationale: [
        'WRONG - gateway blocking prevents future emails but does not verify whether the pending invoice requires settlement.',
        'CORRECT - verifying through established procurement channels confirms invoice validity before financial exposure occurs.',
        'WRONG - waiting for a scheduled call leaves the fraudulent invoice pending while attacker pressure mounts.',
        'WRONG - escalating unverified invoices to executive leadership bypasses procurement validation controls.'
      ],
      cognitive_level: 2,
      difficulty: 2,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'bec',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An employee receives an SMS text message claiming to be from the internal HR Director, stating that annual tax rebate forms must be updated immediately via an attached mobile link to avoid payroll delays. The message includes the employee\'s correct department name. What is the appropriate initial response?',
    [
      'Click the mobile link to inspect the landing page URL and determine if the banking form looks authentic before submitting details',
      'Forward the SMS text message directly to a colleague in HR to ask if they know anything about the mandatory rebate forms',
      'Reply to the SMS asking the sender to provide their corporate employee identification number before you proceed further',
      'Ignore the SMS link, report the message via the enterprise phishing plugin, and verify directly through the internal portal'
    ],
    3,
    'Personalized SMS phishing (smishing) exploits financial incentives and trust in internal departments to induce hasty clicks.',
    'authority',
    45,
    {
      distractor_rationale: [
        'WRONG - visiting untrusted phishing landing pages risks browser exploits and credential harvesting.',
        'WRONG - forwarding unverified messages to coworkers defers security responsibility and spreads uncertainty.',
        'WRONG - replying to attackers on SMS engages the threat actor and confirms your mobile number is active.',
        'CORRECT - ignoring untrusted mobile links and reporting via official channels neutralizes smishing campaigns.'
      ],
      cognitive_level: 2,
      difficulty: 2,
      coverage_tag: 'T1598.003',
      rotation_bucket: 'authority',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A regional manager takes a VoIP call from someone who sounds like the Chief Operating Officer. The COO instructs the manager to approve an emergency equipment purchase outside normal procurement thresholds. The line has a faint echo on high notes, which the manager initially assumes is VoIP compression. The COO is using familiar procurement terminology and has the right context. What should the manager do?',
    [
      'Challenge the caller with a pre-established internal security passphrase and confirm through a callback on a known internal number',
      'Continue the active call but make a note to raise the procurement concern with the regional manager after the call concludes',
      'Comply with the purchase instruction because the voice characteristics, vocabulary, and context all match a real COO',
      'Ask the COO to send a follow-up email confirming the purchase so there is a paper trail for the unusual operational approval'
    ],
    0,
    'Voice cloning learns from public audio and can replicate cadence and vocabulary. Only a challenge phrase or an out-of-band callback, both pre-established, defeats it.',
    'deepfake',
    45,
    {
      distractor_rationale: [
        'CORRECT - a pre-agreed challenge phrase plus a callback on a known internal number verifies identity independent of the audio.',
        'WRONG - noting it for later lets the fraudulent purchase proceed while the manager feels diligent.',
        'WRONG - matching tone and vocabulary is exactly what a voice clone trained on public executive audio will do.',
        'WRONG - an email follow-up can be spoofed from a lookalike domain, and the purchase is already approved by voice.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1656',
      rotation_bucket: 'deepfake',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An accounts payable clerk receives an email thread that appears to be an ongoing discussion between the Chief Executive Officer and the Chief Financial Officer regarding a secret overseas acquisition, in which the clerk is suddenly CC\'d and instructed to wire funds. Which indicator most strongly suggests thread hijacking?',
    [
      'Header analysis showing that the malicious message was injected into an older legitimate conversation history via compromise',
      'The thread earlier messages were sent from a different geographic region than the executive normally operates within',
      'The attachment on the latest message is a compressed archive file, while earlier messages in the thread used PDF format',
      'The domain names in the email header match corporate DNS records and pass all standard SPF and DKIM authentication checks'
    ],
    0,
    'Thread hijacking involves injecting malicious instructions into existing legitimate email threads to establish false credibility.',
    'bec',
    45,
    {
      distractor_rationale: [
        'CORRECT - header analysis in thread hijacking often uncovers message injection into historical conversations.',
        'WRONG - geographic differences in messaging history can occur due to legitimate travel or VPN routing.',
        'WRONG - attachment type changes are secondary indicators and do not confirm message injection into historical threads.',
        'WRONG - passing SPF/DKIM indicates the sending server is authorized, but does not prove the account owner was not compromised.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'bec',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'Corporate reception receives a phone call from an individual claiming to be a senior national regulatory official, threatening immediate site closure and severe legal penalties unless the internal network topology diagram is emailed immediately. How should reception handle this pressure?',
    [
      'Take the caller name and direct office number, then call them back immediately on that same line to verify their official identity',
      'Refuse immediate disclosure, request official documentation through formal channels, and escalate to legal and security teams',
      'Email the network diagram with a password-protected link to satisfy the regulatory requirement while protecting sensitive data',
      'Note the deadline given by the caller and place the request in the normal compliance queue for next month scheduled review'
    ],
    1,
    'Regulator impersonation relies on legal intimidation; official requests must be verified through established institutional channels.',
    'authority',
    45,
    {
      distractor_rationale: [
        'WRONG - calling back a number provided by an unverified caller on the same line achieves zero independent verification.',
        'CORRECT - refusing rush disclosures and routing through formal legal/security teams neutralizes intimidation tactics.',
        'WRONG - password-protecting sensitive topology diagrams does not authorize sharing confidential infrastructure data with outsiders.',
        'WRONG - treating an active extortion attempt as a routine compliance ticket ignores an ongoing security threat.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1598',
      rotation_bucket: 'authority',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A marketing manager receives a pre-recorded video from a prominent industry partner inviting urgent participation in an executive survey via a link in the video description. The video shows the partner CEO, whose neck and shoulders look slightly unnatural in the lighting. The partnership is strategically important and the survey seems low-stakes. What is the most defensible response?',
    [
      'Ask a marketing colleague to click the link first and confirm it looks like a real survey before participating personally',
      'Look up the partner company public website to see if they announced a survey, then click the link if announcements match',
      'Participate in the survey because partnership relationships are vital, and declining an executive survey could cause friction',
      'Verify the invitation independently through the partner official published contact details before clicking any external links'
    ],
    3,
    'Synthetic video lures rely on recognizable figures and plausible business context. Only independent verification through the partner official channel confirms the invitation is real.',
    'deepfake',
    30,
    {
      distractor_rationale: [
        'WRONG - a colleague clicking first is equally likely to be phished; delegation does not verify anything.',
        'WRONG - an attacker can seed a fake announcement on a lookalike site, so a web search confirms only that a web page exists.',
        'WRONG - prioritizing the relationship over verification is exactly the pressure a synthetic lure is designed to create.',
        'CORRECT - verifying through the partner published contact bypasses the synthetic video and the phishing link entirely.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'deepfake',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An employee in human resources receives an email marked confidential from the board chairperson, demanding that employee salary schedules be sent over for an urgent executive review. What is the definitive verification check?',
    [
      'Check the email header to confirm whether the sender domain matches the standard board prefix, and proceed if clean',
      'Confirm the request through an independent internal communication channel before disclosing sensitive personal data records',
      'Forward the salary records with strong password encryption enabled to protect the data files during transit across networks',
      'Reply to the chairperson asking if payroll files can be transferred via an alternative corporate secure file-sharing link'
    ],
    1,
    'Confidentiality markers and executive pressure are used to extract sensitive PII; independent verification is mandatory.',
    'bec',
    45,
    {
      distractor_rationale: [
        'WRONG - header signature checks can be spoofed by attackers and do not replace independent out-of-band confirmation.',
        'CORRECT - verifying requests involving sensitive PII through independent channels prevents data exfiltration.',
        'WRONG - sending PII externally violates data privacy regulations regardless of file encryption settings.',
        'WRONG - offering alternative file-sharing links facilitates data exfiltration rather than validating identity.'
      ],
      cognitive_level: 2,
      difficulty: 2,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'bec',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A new admin assistant is asked by a senior executive whom they have never met to urgently send a confidential document to an external address for a board meeting. The assistant worries that refusing will reflect poorly in their first week. What is the most defensible action under this pressure?',
    [
      'Comply with the request because new employees should demonstrate reliability and trust senior leadership directives',
      'Ask a more experienced colleague to handle the request since the assistant lacks authority to refuse senior executives',
      'Send the document but copy the assistant manager on the email so that the transmission is officially recorded on file',
      'Verify independently through the executive known office or a colleague, and refuse external delivery until confirmed'
    ],
    3,
    'The pressure to comply as a new employee is exactly what authority-based social engineering exploits. Only independent verification confirms the request is legitimate.',
    'authority',
    45,
    {
      distractor_rationale: [
        'WRONG - compliance under pressure is the primary goal of the attack, not a demonstration of reliability.',
        'WRONG - delegating to a colleague without verification does not confirm the request is real; it only transfers the decision.',
        'WRONG - copying a manager on an email does not verify the sender, and the confidential document has already been sent.',
        'CORRECT - independent verification through the executive known office or a colleague verifies the request safely.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1598',
      rotation_bucket: 'authority',
      last_validated: '2026-11-13'
    }
  )
],
    8: [
  q(
    'A ransomware note has appeared on a finance file server. Encryption is ongoing across two other file shares. The CEO wants an immediate public statement denying a breach before the news gets it. The legal team says a statement can go out within 20 minutes. The IT director asks if they can just restore from last night\'s backup and not tell anyone. What is the incident commander\'s most defensible first priority?',
    [
      'Contain the spread across the remaining shares, then convene a legal/comms/technical call to decide what can truthfully be said',
      'Issue the statement now, then contain once the narrative is under control',
      'Restore from backup and close quietly if it works',
      'Draft the public statement first; forensics facts will emerge and can be published as confirmed'
    ],
    0,
    'Containment is the only action that stops ongoing harm. Statement timing and forensic facts follow containment; they do not precede or delay it.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - halting the spread is the only action that reduces business impact; all other decisions can proceed once damage is stopped.',
        'WRONG - issuing a statement first without facts creates false claims, not narrative control.',
        'WRONG - restoring from backup may work but leaves the attacker foothold intact; "close quietly" is a legal decision, not the IC\'s alone.',
        'WRONG - drafting first and verifying later delays containment and publishes unverified claims.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'Which telemetry input most strongly justifies declaring an enterprise major incident immediately?',
    [
      'A single automated spam email flagged and deleted successfully by the secure gateway during routine queue processing hours',
      'Active lateral movement into crown-jewel database systems with payment impact indicators and confirmed attacker persistence',
      'An employee altering their office desktop wallpaper theme without authorization from the IT asset management team',
      'Temporary wide-area network VPN latency spiking to 12 milliseconds during peak hours with no packet loss detected'
    ],
    1,
    'Incident severity scales directly with blast radius and business operational or financial safety impact.',
    'severity',
    35,
    {
      distractor_rationale: [
        'WRONG - standard spam interception is routine operational noise, not a major incident.',
        'CORRECT - active lateral movement into crown jewels represents high blast radius and immediate business risk.',
        'WRONG - aesthetic wallpaper changes are policy infractions, not active security breaches.',
        'WRONG - normal network latency variations are standard infrastructure events.'
      ],
      cognitive_level: 2,
      difficulty: 2,
      coverage_tag: 'T1210',
      rotation_bucket: 'severity',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An active ransomware infection is encrypting a primary file server. How should the response team balance volatile evidence collection against operational uptime containment?',
    [
      'Ignore evidence collection entirely and focus exclusively on long-term preventive policy updates',
      'Isolate the host now, capturing volatile memory and network connections where the playbook allows',
      'Leave the attacker connected for a week to observe their full methodology, then isolate and remediate',
      'Reimage the affected server immediately without notes to restore uptime before the business notices'
    ],
    1,
    'Immediate host isolation halts active encryption while disciplined playbook procedures preserve essential forensic artifacts.',
    'forensics',
    40,
    {
      distractor_rationale: [
        'WRONG - ignoring evidence collection prevents root-cause analysis and future hardening.',
        'CORRECT - rapid isolation stops encryption propagation while preserving necessary forensic scope.',
        'WRONG - leaving attackers active during encryption maximizes business damage.',
        'WRONG - reimaging without logging destroys critical root-cause attribution data.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'forensics',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The CFO forwards a forwarded email chain — originally from the "cyber insurance broker" — demanding an immediate ransom-payment decision "to preserve the policy." The email contains a Bitcoin address and a 48-hour deadline. What is the most defensible action?',
    [
      'Pay the ransom quickly to preserve the insurance claim and end the disruption before the deadline expires',
      'Engage the insurer on a recorded line through their published claims number, and do not respond to the email',
      'Reply to the broker asking for written confirmation of the payment amount and wallet address before proceeding',
      'Forward the email to the CEO and board chair and await their direction before responding to anyone'
    ],
    1,
    'Ransomware demands sent by email are themselves often fraudulent or attacker-originated. Only the insurer\'s published claims channel is authoritative for policy and payment questions.',
    'legal_comms',
    45,
    {
      distractor_rationale: [
        'WRONG - paying on email instruction is exactly how secondary fraud occurs on top of the original incident.',
        'CORRECT - the insurer\'s published claims channel is authoritative; the email is attacker-controlled or broker-compromised.',
        'WRONG - replying to the email confirms the mailbox is live and engages the attacker further.',
        'WRONG - escalation to the board is appropriate eventually, but forwarding attacker email to leadership is a decision delay, not a decision.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1657',
      rotation_bucket: 'legal_comms',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A staff member reports that a file server shows encrypted extensions on shared files, and a README.txt demands payment. The staff member has not disconnected the server from the network. What is the first action?',
    [
      'Disconnect the server from the network now, then notify the incident response lead and preserve the README as evidence',
      'Ask the staff member to check whether other users are also seeing encrypted files before disconnecting',
      'Restore the server from the most recent backup first, then confirm the attack is stopped before disconnecting',
      'Wait for the incident response lead to confirm the classification before taking any technical action'
    ],
    0,
    'Containment begins at the moment of recognition. Waiting for confirmation while encryption continues expands the blast radius.',
    'ransomware_containment',
    40,
    {
      distractor_rationale: [
        'CORRECT - isolate first, then notify. Every minute of connection is more encryption.',
        'WRONG - asking others to check while the server is still on the network spreads the encryption.',
        'WRONG - restoring from backup without disconnecting lets the attacker re-encrypt the restored files.',
        'WRONG - waiting for classification while the server remains connected is the classic delay that expands blast radius.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'T1486',
      rotation_bucket: 'ransomware_containment',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'During a ransomware incident, the CEO asks whether the company should publish a public statement that "no customer data was accessed." The forensics team has not yet scoped which systems were touched. What is the safest advice to the CEO?',
    [
      'Publish the statement — customer trust depends on confident leadership during a crisis and the forensics will likely confirm it',
      'Publish only what is verified: acknowledge the incident, state that the investigation is active, and commit to further updates',
      'Wait to publish anything until the full forensics report is complete, even if the news breaks before then',
      'Publish the customer data claim but add a legal disclaimer that early findings may change'
    ],
    1,
    'Statements during an active incident must be factual and verified. Unverified claims create liability regardless of the disclaimer.',
    'legal_comms',
    45,
    {
      distractor_rationale: [
        'WRONG - "likely confirm it" is not verified; publishing an unverified claim creates legal and reputational liability.',
        'CORRECT - publish only verified facts, acknowledge the incident, and commit to further updates as facts are confirmed.',
        'WRONG - waiting indefinitely for a full report lets the news cycle define the narrative; verified-facts-now is safer than silence.',
        'WRONG - disclaimers do not protect against a false claim of "no data accessed"; the statement itself is the liability.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1657',
      rotation_bucket: 'legal_comms',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The incident response team has contained a ransomware incident but not yet identified the initial access vector. The board wants to announce "the incident is closed." What should the incident commander recommend?',
    [
      'Announce closure once the file shares are restored and users are back at work — operational recovery is the business signal',
      'Do not announce closure until the initial access vector is identified and remediated, or a compensating control is in place',
      'Announce closure immediately — the longer the incident is open, the more damage to the brand and to investor confidence',
      'Announce closure but keep the investigation running quietly in the background under a different incident number'
    ],
    1,
    'An incident is not closed when files are restored. It is closed when the attacker cannot return through the same path.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - operational recovery with the entry vector unidentified means the attacker can re-enter.',
        'CORRECT - closure requires either remediation of the initial vector or a compensating control that blocks the same path.',
        'WRONG - announcing closure to protect the brand while the attacker can return is exactly the misrepresentation that damages credibility later.',
        'WRONG - a parallel "quiet" investigation is operationally possible but publicly it is still a misrepresentation of closure.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The ransom note demands payment in Monero and provides a Tor chat link. The CEO asks whether negotiating with the attacker is legal and advisable. What is the most defensible position to state?',
    [
      'Negotiation may be legal depending on jurisdiction, but it is a decision for legal and the insurer, not the IC alone, and only through the insurer\'s approved channel',
      'Never negotiate — paying or communicating with attackers is always illegal and creates sanctions exposure in every jurisdiction',
      'Engage the Tor chat immediately to buy time and gather intelligence while the technical team contains the spread',
      'Pay the ransom — decryption is faster and cheaper than rebuilding, and the insurer will reimburse the cost anyway'
    ],
    0,
    'Ransom negotiation is a legal and insurance decision with jurisdictional and sanctions implications. The IC provides operational input but does not decide it alone.',
    'legal_comms',
    45,
    {
      distractor_rationale: [
        'CORRECT - the legal/insurance decision belongs to legal/insurer; the IC\'s role is operational input and technical coordination.',
        'WRONG - "always illegal" is factually wrong; some jurisdictions permit payment under conditions, others restrict it, and sanctions regimes vary.',
        'WRONG - the IC engaging a Tor chat without legal/insurer approval is outside the role and could compromise the insurer\'s position.',
        'WRONG - "the insurer will reimburse" assumes the claim is approved; paying first and claiming later may forfeit coverage.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1657',
      rotation_bucket: 'legal_comms',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'Backups have been restored and file shares are working, but the SIEM still shows periodic outbound connections from a server that was supposedly cleaned. What should the IR lead do?',
    [
      'Treat the outbound connections as evidence the attacker is still active, re-isolate the server, and re-scope the investigation',
      'Assume the connections are benign scanning or update traffic and continue with the recovery and closure timeline',
      'Disable the SIEM alerts for that server so the recovery can complete without operational distraction',
      'Wait for the outbound connections to escalate before re-isolating, to avoid disrupting restored operations again'
    ],
    0,
    'Outbound connections from a "cleaned" host are the strongest signal the attacker never left. Re-isolate and re-scope.',
    'ransomware_containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - outbound connections from a cleaned host are evidence of persistence; re-isolation and re-scoping are required before closure.',
        'WRONG - assuming benign is exactly the complacency that allows second-stage attacks.',
        'WRONG - disabling detection to avoid operational disruption is how small incidents become major ones.',
        'WRONG - waiting for escalation is the attacker\'s preferred timeline; the IC controls the timeline, not the attacker.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1071',
      rotation_bucket: 'ransomware_containment',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The forensics team has identified the ransomware strain and the initial access vector. The legal team asks whether the company must notify a regulator within 72 hours. The company operates in Namibia and has EU customers. What is the most defensible response?',
    [
      'Notify both regulators immediately — 72 hours is the deadline in most jurisdictions and it is better to over-notify',
      'The obligation depends on which data was affected and which regimes apply; legal must determine scope before any notification',
      'Do not notify any regulator — the ransom was not paid and the incident was contained without customer data exfiltration',
      'Notify only the EU regulator — the 72-hour rule is a European rule and does not apply to Namibian operations'
    ],
    1,
    'Notification obligations depend on jurisdiction, affected data categories, and confirmed facts. Notification without legal scoping can be as wrong as failing to notify.',
    'legal_comms',
    45,
    {
      distractor_rationale: [
        'WRONG - over-notification has its own consequences (false claims, unnecessary reputation damage, possible regulatory confusion).',
        'CORRECT - the obligation is scoped by jurisdiction and by what data was affected; legal scopes, then notifies.',
        'WRONG - containment without confirmed exfiltration does not automatically remove notification obligations; the scope question still applies.',
        'WRONG - Namibian operations may have their own notification regime under national law, independent of GDPR.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1657',
      rotation_bucket: 'legal_comms',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'During a ransomware incident, a junior analyst says they have identified the attacker\'s initial access and knows the exact malware family. The analyst wants to post a warning to a public security forum to "help other organisations prepare." What should the IR lead say?',
    [
      'Do not post during the active incident — attribution and technical details can tip off the attacker and affect the investigation',
      'Post the warning immediately — protecting other organisations is more important than the current investigation timeline',
      'Post an anonymised version of the warning without the company name but with the technical details, since the technical details help defenders',
      'Wait for the investigation to close and then post the full details to the public forum for maximum community benefit'
    ],
    0,
    'During an active incident, all external communication — including "helpful" technical disclosure — must be gated by the IR plan. Attribution and technical details tip off the attacker.',
    'legal_comms',
    45,
    {
      distractor_rationale: [
        'CORRECT - during an active incident, external communication is gated by the IR plan; "helping others" is not the IC\'s call to make mid-incident.',
        'WRONG - protecting others does not override the requirement to not compromise the current investigation.',
        'WRONG - anonymisation does not protect against correlation; the attacker reads the same forums and can recognise their own tradecraft.',
        'WRONG - post-incident disclosure is a legitimate option but requires legal/comms coordination, not a unilateral analyst decision.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1657',
      rotation_bucket: 'legal_comms',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An investigation has confirmed that the ransomware entered through a compromised vendor account with weak MFA. The vendor is a national logistics provider that serves other companies in the same industry. What is the most defensible action?',
    [
      'Notify the vendor privately, provide the evidence of compromise, and coordinate on a joint response before any broader disclosure',
      'Publish the vendor\'s role publicly — the industry needs to know which vendors are compromised to protect themselves',
      'Do not notify the vendor — the compromise is the vendor\'s own security problem and reporting it shifts attention from your incident',
      'Notify the vendor only through their public security contact form and let them handle their own scope from there'
    ],
    0,
    'Third-party compromise requires coordinated private disclosure first. Public disclosure without giving the vendor a chance to act spreads risk and damages the relationship.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - private notification with evidence and coordination is the responsible disclosure path that gives the vendor a chance to act.',
        'WRONG - public disclosure without prior private notification is irresponsible disclosure and can spread risk to the vendor\'s other customers.',
        'WRONG - failing to notify a compromised vendor leaves other customers exposed and is a governance failure, not a security win.',
        'WRONG - the public security contact form is unlikely to route to the right people at the speed required for a compromised vendor account.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1199',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-13'
    }
  )
],
    11: [
  q(
    'During a ransomware tabletop exercise, the CTO asks whether the company\'s nightly database backups are "enough." The backups are stored on a NAS that is always online and accessible from the production network. What is the most defensible answer?',
    [
      'Enough — nightly backups capture all data within 24 hours of loss, which meets industry recovery time objectives for most SMEs',
      'Enough — as long as the NAS is protected by antivirus and a strong password policy, the backups are safe from ransomware',
      'Not enough — the backups sit on an always-online NAS reachable from production, one of the first targets in a ransomware attack',
      'Not enough — but the fix is simply to double the frequency so backups happen every 12 hours instead of every 24 hours'
    ],
    2,
    'Always-online backups reachable from the production network are the primary target in modern ransomware. Immutability and network separation matter more than frequency.',
    'backup_architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - frequency without separation still means the attacker encrypts the last 24 hours of backups along with production.',
        'WRONG - AV and passwords do not stop ransomware operators who already have domain admin from the initial compromise.',
        'CORRECT - online, network-reachable backups are compromised in the same attack; immutability and separation are the controls that matter.',
        'WRONG - more frequent backups on the same compromised NAS are more encrypted copies, not safer copies.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'backup_architecture',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A mid-sized SME has an on-premise backup server that runs nightly. The backup server uses the same domain administrator credentials as the production servers. What is the specific risk this represents?',
    [
      'Acceptable — the backup server is not internet-facing, so an attacker would need physical access to compromise it',
      'Minimal — the backup server is only used for backup, so compromise of production credentials does not affect it',
      'Only a concern if the backup server is in a different building from the production data centre',
      'Shared domain admin credentials mean that the same identity compromise that encrypts production also encrypts the backups in the same attack'
    ],
    3,
    'Shared domain admin credentials mean the same compromise that encrypts production encrypts backups. Backup infrastructure must be isolated at the identity layer, not just the network layer.',
    'identity_tiering',
    45,
    {
      distractor_rationale: [
        'WRONG - internet-facing is not the only attack path; identity compromise from a phishing email is the primary route.',
        'WRONG - shared credentials mean shared compromise; the "only used for backup" framing ignores the identity link.',
        'WRONG - physical separation does not help when the attack is at the identity layer.',
        'CORRECT - shared domain admin credentials mean the attacker who compromises production also owns the backups.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_tiering',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The company has restored file shares from backup following a ransomware incident, but four days later the shares are re-encrypted. What is the most likely explanation?',
    [
      'The attacker remained on the network with persistent access and encrypted the restored files after recovery',
      'The backup was corrupt, and the "restored" files were actually still encrypted copies of the original files',
      'A new ransomware variant was introduced by an employee during the recovery process through an email attachment',
      'The backup restore process itself accidentally re-encrypted the files as part of its normal restoration operation'
    ],
    0,
    'Re-encryption after restore is the clearest signal that the attacker never left. Restoring without re-scoping the network rebuilds the target.',
    'ransomware_defense',
    40,
    {
      distractor_rationale: [
        'CORRECT - re-encryption after restore means the attacker retained access; restoration without re-scoping rebuilt the target.',
        'WRONG - corrupted backups produce missing or broken files, not active re-encryption.',
        'WRONG - new variants come from new intrusion attempts; they do not appear spontaneously during recovery.',
        'WRONG - backup restore software does not encrypt files as part of restoration.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'ransomware_defense',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A backup administrator proposes moving the company\'s backup server off the domain and onto a separate, isolated network segment with its own local credentials. The IT director asks whether this is worth the operational complexity. What is the most defensible answer?',
    [
      'No — off-domain backups add operational complexity for a threat that is already covered by endpoint protection and email filtering',
      'Yes — isolating backup credentials from domain compromise is one of the highest-value controls available, because it removes the backup server from the attack path most ransomware uses',
      'Yes, but only if the backup server is also protected by a hardware security module and multi-factor authentication for all backup operations',
      'No — the backup server only needs to be protected by the same controls as production, since the attack surface is essentially identical'
    ],
    1,
    'Backup infrastructure is the last line of defense against ransomware. Isolating it from the identity plane the attacker compromises removes the primary path that leaves victims without recovery.',
    'backup_architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - endpoint protection and email filtering are preventive; they do not stop an attacker who is already on the network.',
        'CORRECT - off-domain, isolated backups remove the identity path that most ransomware operators use to encrypt backups.',
        'WRONG - HSM and MFA are good additions, but they are not prerequisites for the isolation benefit; isolation alone is worth doing.',
        'WRONG - the attack surface is not identical; backup servers have different access patterns and different credential exposure.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'backup_architecture',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A company has "immutable" backups that cannot be deleted or modified during a 30-day retention window. An attacker who compromised the environment 45 days ago is now encrypting files. What protection do the immutable backups provide?',
    [
      'Full protection — immutable backups cannot be encrypted by ransomware, so the data is always recoverable',
      'Reduced protection — immutability is best-effort and the attacker can defeat it with sufficient privilege escalation',
      'None — the attacker compromised the environment before the retention window began, so all current backups contain their implant',
      'Partial protection — recoverable to a point within 30 days, but any earlier compromise point is exposed'
    ],
    2,
    'Immutable backups protect against encryption, not against an attacker who was present before the retention window. Recovering to a clean point requires knowing when the compromise began.',
    'ransomware_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - full protection assumes the attacker is only present at encryption time, not 45 days before.',
        'WRONG - immutability is a hard technical guarantee, not best-effort; defeating it requires different attack paths.',
        'CORRECT - immutability protects the backup from encryption, but if the attacker was present 45 days ago, backups within the 30-day window contain their implant.',
        'WRONG - partial protection is a reasonable guess but misses the key point: without knowing when the compromise started, "recoverable" is uncertain.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1486',
      rotation_bucket: 'ransomware_defense',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The company wants to test its ransomware recovery capability. The IT team proposes restoring a production database from last week\'s backup to a staging environment. What should the security lead insist on before this test runs?',
    [
      'Confirm that the test is scheduled outside business hours so that it does not affect users if the restore goes wrong',
      'Confirm that the staging environment is fully isolated from production and that the restore does not touch live credentials or production encryption keys',
      'Confirm that the backup is at least 30 days old, since recent backups are more likely to contain malware from the current quarter',
      'Confirm that the staging environment has the same anti-ransomware software as production, to validate the security stack'
    ],
    1,
    'A restore test that touches production credentials or keys is not a test — it is a production operation. Isolation must be verified before the test runs, not assumed.',
    'restore_operations',
    45,
    {
      distractor_rationale: [
        'WRONG - scheduling outside business hours does not address the credential and key exposure risk.',
        'CORRECT - the staging environment must be isolated and credentials must be separate before the test runs; otherwise the test risks the production environment.',
        'WRONG - 30-day-old backups are not inherently safer, and forcing a longer retention is not the control that matters.',
        'WRONG - AV parity is not the primary concern; credential isolation is.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'restore_operations',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'After restoring from backup, the IT team wants to rejoin the restored file server to the production domain immediately. The security lead objects. What is the most defensible reason for the objection?',
    [
      'Rejoining the domain is fine as long as the server was restored from a backup that was taken before the incident',
      'Rejoining the restored server to the production domain re-exposes it to the same compromised identity plane that allowed the original attack',
      'Rejoining should wait until the backup has been scanned by the most recent antivirus signatures',
      'Rejoining should wait until the server has been patched to the most current operating system release'
    ],
    1,
    'Restored servers rejoined to a compromised domain will be re-attacked. The domain itself must be re-secured or the restored system must operate in an isolated state until it is.',
    'restore_operations',
    40,
    {
      distractor_rationale: [
        'WRONG - "before the incident" backups are safer but do not address the compromised domain itself.',
        'CORRECT - the domain is the compromised identity plane; rejoining re-exposes the server to the same attack path.',
        'WRONG - AV scanning is useful but does not verify the domain is safe to rejoin.',
        'WRONG - patching is useful but does not verify the domain is safe to rejoin.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'restore_operations',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A backup administrator has credentials to both the production domain and the isolated backup network. The security team recommends removing the administrator from the production domain entirely. What is the operational risk the security team should address in the same change?',
    [
      'Removing production domain credentials will immediately break the administrator\'s ability to log into their workstation',
      'The change is impossible — backup administrators must have production access to test restores against production data',
      'Without a designated backup-only identity, the administrator may use shared credentials in an emergency, restoring the very risk the change was meant to remove',
      'The change is unnecessary — the administrator is a trusted employee and their credentials are not part of the attack surface'
    ],
    2,
    'Tiering removes a risk only if the replacement identity is fully provisioned. Emergency "shared credentials" fallback restores the exact risk tiering was meant to remove.',
    'identity_tiering',
    45,
    {
      distractor_rationale: [
        'WRONG - workstation login is a separate concern and can be solved with a different local identity.',
        'WRONG - restore testing can happen in an isolated environment; production access is not required.',
        'CORRECT - without a fully provisioned backup-only identity, the admin will re-use shared credentials in an emergency, restoring the original risk.',
        'WRONG - "trusted employee" is exactly the assumption that breaks in a phishing compromise.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_tiering',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The company has a 3-2-1 backup strategy: three copies of data, on two different media, with one copy off-site. In a ransomware incident, the attacker encrypted the local copies and deleted the off-site copy through the cloud backup provider\'s API. What went wrong?',
    [
      'The 3-2-1 strategy protects against media failure, not against an attacker with credentials to all three copies; the off-site copy needed separate, unshared credentials',
      'The 3-2-1 strategy protects against ransomware by definition; the attack must have used a method outside the strategy\'s scope',
      'The cloud provider is at fault for allowing API deletions; a different provider would have prevented this',
      'The 3-2-1 strategy is outdated and should be replaced with a 4-3-2 strategy for modern threats'
    ],
    0,
    '3-2-1 is a resilience framework against failure, not a security framework against attackers. The off-site copy is only protected if the attacker cannot reach it with the same credentials.',
    'backup_architecture',
    45,
    {
      distractor_rationale: [
        'CORRECT - 3-2-1 is about media and location diversity; it does not address the credential path that lets an attacker delete all copies.',
        'WRONG - 3-2-1 does not "protect against ransomware by definition"; it protects against specific failure modes.',
        'WRONG - cloud providers offer immutability and object lock; the control exists but was not enabled.',
        'WRONG - a bigger number does not solve the credential problem; the issue is access separation, not copy count.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1486',
      rotation_bucket: 'backup_architecture',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'A ransomware incident is contained and the company wants to test whether backups will actually restore. The IT director asks for a "quick" test: restore one file from one backup and confirm it opens. Is this test sufficient?',
    [
      'Yes — if one file restores successfully, the backup mechanism works and the rest will follow the same process',
      'Yes, if the file chosen is the most important file in the backup set, since that represents the highest-value recovery target',
      'No — one file from one backup proves the file can be restored, not that the full environment can be recovered to an operational state',
      'No — but a test that restores 10 files from 3 backups is sufficient for any environment regardless of complexity'
    ],
    2,
    'A single-file restore tests the file, not the environment. Full recovery requires verifying credentials, network paths, service dependencies, and operational sequences — not just that a file opens.',
    'restore_operations',
    40,
    {
      distractor_rationale: [
        'WRONG - one file restoring says nothing about the environment, credentials, or service dependencies.',
        'WRONG - "most important file" is a heuristic, not a test of the recovery process.',
        'CORRECT - single-file tests prove very little; real recovery testing restores services, dependencies, and access paths.',
        'WRONG - "10 files from 3 backups" is better than 1 but still does not test operational recovery.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'T1486',
      rotation_bucket: 'restore_operations',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'An SME has a full backup from 8 months ago and incrementals every night since. The ransomware encrypted production 3 days ago. What is the most defensible recovery plan?',
    [
      'Restore from the most recent backup, since it contains the most up-to-date data and the incident was only 3 days ago',
      'Restore from the 8-month full backup only, since all incrementals after that point are suspect',
      'Wait for law enforcement to identify the attacker\'s entry point before restoring anything, to avoid re-compromise',
      'Identify the earliest point of compromise before restore, then restore to a point before that date — the full backup plus nightly incrementals to the chosen date'
    ],
    3,
    'Recovery requires a known-clean point. The most recent backup may contain the attacker\'s implant; the 8-month full backup may be too old. The correct point is the last one before compromise.',
    'ransomware_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - the most recent backup may contain the implant; restoring it re-compromises the environment.',
        'WRONG - the 8-month full is too far back; the incrementals up to the compromise date are exactly what is needed.',
        'WRONG - waiting for law enforcement delays recovery indefinitely; the defender can scope the compromise independently.',
        'CORRECT - the recovery point must be before compromise; the full + incrementals to that date is the correct approach.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1486',
      rotation_bucket: 'ransomware_defense',
      last_validated: '2026-11-13'
    }
  ),

  q(
    'The company uses a cloud backup provider whose API allows deleting objects with an API key. The security team recommends enabling object lock on the backup bucket. The cloud architect objects: "object lock makes normal backups harder because we cannot delete old versions." What is the most defensible response?',
    [
      'The architect is correct; object lock is too costly operationally and should only be used for regulated industries',
      'The architect is correct but object lock is still mandatory under cybersecurity regulations, so we have no choice',
      'Object lock is unnecessary if the API key is stored in a secrets manager and rotated regularly',
      'The immutability cost is acceptable: the tradeoff is that a compromised API key cannot delete the backups during a ransomware incident, which is the exact risk we are trying to prevent'
    ],
    3,
    'Immutability is the control that survives credential compromise. The operational cost is real but small compared to the risk of losing all backups to a compromised API key.',
    'identity_tiering',
    45,
    {
      distractor_rationale: [
        'WRONG - the architect is right about the operational cost but wrong about the priority; the security benefit outweighs it.',
        'WRONG - framing it as regulation is inaccurate; the reason is the security benefit, not a legal requirement.',
        'WRONG - a secrets manager reduces but does not eliminate the risk; object lock is the control that survives credential compromise.',
        'CORRECT - the tradeoff is worth it because credential compromise is the exact risk object lock addresses; operational cost is manageable.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_tiering',
      last_validated: '2026-11-13'
    }
  )
],
    18: [
  q(
    'A night-shift SOC analyst at a Windhoek-based managed security provider sees 900 medium-severity alerts per shift. The previous three shifts closed 40% of tickets as "benign" without investigation. The SOC manager asks what to do. What is the most defensible first response?',
    [
      'Tune the noisiest detection rules, enrich alert context, and protect the small set of high-fidelity rules — then reassess after 30 days',
      'Fire the analysts who closed tickets without investigation — the problem is discipline, not detection design',
      'Disable the noisiest alert rules entirely so the remaining alerts can be investigated properly',
      'Require analysts to investigate every alert regardless of severity — the volume is the job'
    ],
    0,
    'Alert fatigue is a detection engineering and resourcing problem, not a discipline problem. The correct response is to reduce the noise at the source, not to demand more output from exhausted analysts.',
    'alert_triage',
    45,
    {
      distractor_rationale: [
        'CORRECT - tuning noisy rules and protecting high-fidelity rules reduces the volume at the source; enrichment helps analysts make faster decisions.',
        'WRONG - firing analysts is the classic mistake that makes the problem worse (loss of context, retraining cost, remaining team morale).',
        'WRONG - disabling alert rules entirely is not tuning — it turns off detection rather than improving it.',
        'WRONG - "investigate every alert regardless of severity" does not address volume and cannot scale; analysts will still close tickets as benign, just later.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'alert_triage',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A service account shows a successful authentication from a new IP range, followed 4 minutes later by three administrative RDP hops across different servers. The analyst on shift sees this in the SIEM. What is the most defensible 10-minute action?',
    [
      'Close the ticket as a likely network glitch — service accounts often authenticate from unexpected places during updates',
      'Isolate the servers involved, revoke the service account sessions, and preserve authentication logs for the incident',
      'Wait for the next scheduled shift and hand over the alert as "needs investigation" without further action',
      'Email the service account owner asking them to confirm whether they ran any administrative scripts in the last hour'
    ],
    1,
    'This is a textbook identity compromise chain: spray success → fast lateral movement via administrative protocols. The 10-minute window is the moment to isolate, not to defer.',
    'alert_triage',
    45,
    {
      distractor_rationale: [
        'WRONG - a service account authenticating from a new IP and then performing admin hops is a specific attacker pattern, not routine updates.',
        'CORRECT - isolate hosts, revoke sessions, preserve logs; this is a confirmed compromise chain, not a suspicion.',
        'WRONG - handing over without action leaves the attacker with 8+ hours to move laterally; "needs investigation" is not a containment action.',
        'WRONG - emailing the owner gives the attacker time to act and assumes the owner will respond in the 10-minute window.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1021.001',
      rotation_bucket: 'alert_triage',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC analyst finishes a shift with three open investigations: one is a confirmed phishing report (link clicked, no credentials entered), one is an alert about a scheduled backup job that fired at an unusual hour, and one is a medium-severity alert about a user accessing files outside their normal department. What must the analyst hand over, and what can they close before leaving?',
    [
      'Hand over the phishing report only — the other two are routine and do not need the next shift\'s attention',
      'Close the backup job alert as benign and the phishing report as contained, hand over only the department-access alert with context',
      'Close all three as "no immediate threat" and hand over a summary noting they were reviewed',
      'Hand over all three with full context (what was checked, what remains, who owns each); close nothing without manager approval'
    ],
    3,
    'Handover quality is the single biggest determinant of SOC effectiveness across shifts. Closing items without explicit manager approval is the pattern that lets real incidents fall through shift boundaries.',
    'shift_handover',
    45,
    {
      distractor_rationale: [
        'WRONG - the backup job at an unusual hour and the department-access alert both deserve handover; they are not routine without investigation.',
        'WRONG - closing the phishing report as contained assumes no further action, and the backup job closure without approval is a handover failure.',
        'WRONG - closing all three without investigation is the exact failure mode this module exists to prevent.',
        'CORRECT - all three hand over with full context; closing items without approval is exactly the pattern that loses incidents at shift boundaries.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'shift_handover',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A day-shift analyst has been investigating a suspicious login for 5 hours. The login came from a country the user has never visited, but the user has confirmed via email that they are travelling. The SIEM alert has not been closed. The next shift is taking over in 10 minutes. What is the most defensible handover?',
    [
      'Document the user confirmation, the travel evidence, and the specific indicator to watch; hand over with a recommendation to close if no further anomalies appear in 24 hours',
      'Close the alert now — the user confirmed travel, so there is no further action needed and the next shift has enough work',
      'Hand over "suspicious login, user says travelling, needs follow-up" with no detail — the next shift can re-read the SIEM',
      'Leave the alert open without a handover note — the next shift will pick it up from the queue automatically'
    ],
    0,
    'Good handover records the state of knowledge, the specific indicator to watch, and the recommended action. "Needs follow-up" is not handover — it is abdication.',
    'shift_handover',
    45,
    {
      distractor_rationale: [
        'CORRECT - documents the evidence, names the specific next decision, and gives the next shift a clear recommendation with conditions.',
        'WRONG - closing without manager approval and without recording the travel verification means the next shift cannot audit the decision.',
        'WRONG - "needs follow-up" without context forces the next shift to re-investigate 5 hours of work; this is the classic handover failure.',
        'WRONG - leaving an alert open without a handover note is the pattern that lets real incidents sit for days.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'shift_handover',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC analyst sees an alert about a user opening a suspicious email attachment. The user is a mid-level finance employee. The email was quarantined by the gateway 30 seconds after delivery, and the user has not reported anything. What is the most defensible escalation decision?',
    [
      'Close the alert as contained — the gateway quarantined the email, so no user action was possible',
      'Escalate to the incident response team as a potential phishing incident — quarantine is not confirmation that the attachment was harmless',
      'Escalate to the user\'s manager asking them to confirm whether the user opened the attachment',
      'Wait for the user to report the email — proactive investigation of quarantined emails is overreach'
    ],
    1,
    'Gateway quarantine removes the email from the inbox, but if the user opened the attachment before quarantine, the payload has already executed. Quarantine is not containment of the user action.',
    'escalation',
    45,
    {
      distractor_rationale: [
        'WRONG - closing as contained assumes the user did not open the attachment before quarantine; this is the assumption that misses incidents.',
        'CORRECT - quarantine of the email does not retroactively un-execute a payload the user may have opened in the 30-second window.',
        'WRONG - asking the manager to confirm whether the user opened the attachment puts a non-technical person in the verification path.',
        'WRONG - waiting for user reports is the failure mode that lets phishing compromises sit undetected for hours.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566.001',
      rotation_bucket: 'escalation',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A tier-1 analyst identifies what they believe is a low-severity policy violation (an employee using a personal USB drive). The employee is a senior manager. The tier-1 analyst is unsure whether to escalate. What is the most defensible action?',
    [
      'Do not escalate — USB policy is a compliance issue, not a security incident, and the employee is a senior manager',
      'Escalate to the SOC lead with the specific evidence and let the lead decide on the appropriate handling — the analyst role is to surface, not to decide',
      'Escalate directly to the senior manager\'s manager, bypassing the SOC lead, to ensure it is handled',
      'Close the alert as a policy matter and note it in the shift log without further action'
    ],
    1,
    'Tier-1 analysts surface; they do not adjudicate. The escalation path preserves the lead ability to handle the incident proportionally and protects the analyst from either over- or under-reacting.',
    'escalation',
    45,
    {
      distractor_rationale: [
        'WRONG - "USB is not a security incident" is factually wrong; personal USB drives are a known exfiltration and malware path (T1091, T1052).',
        'CORRECT - escalate to the SOC lead with evidence; the lead makes the proportional-response decision.',
        'WRONG - bypassing the SOC lead is not the analyst call and creates a political incident that distracts from the security issue.',
        'WRONG - closing without escalation is the failure mode that lets senior-manager policy violations become senior-manager compromises.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1091',
      rotation_bucket: 'escalation',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A regional SOC analyst in Rundu receives an alert that a workstation on the same subnet as the CEO office is beaconing to an IP in a country the company has no business with. The alert is medium severity. The analyst shift ends in 30 minutes. What is the most defensible action before handover?',
    [
      'Hand over the alert to the day shift with a note that it is "medium severity, needs investigation" — it is not urgent',
      'Close the alert — the analyst is not sure the IP is malicious, and 30 minutes is not enough to investigate properly',
      'Isolate the workstation, preserve network flow logs, notify the day-shift lead, and hand over with the actions already taken',
      'Wait to see if other workstations show the same beaconing — if it is widespread, it is more likely benign'
    ],
    2,
    'Beaconing to a country the company has no business with is a textbook C2 indicator. The 30-minute window before handover is exactly when isolation should happen, not when handover should defer it.',
    'escalation',
    45,
    {
      distractor_rationale: [
        'WRONG - "medium severity, needs investigation" without action is the deferral pattern that lets beaconing become data theft overnight.',
        'WRONG - closing because "not sure" is the failure mode that lets real incidents sit closed; the analyst does not need to confirm maliciousness to isolate.',
        'CORRECT - isolate, preserve logs, notify the lead, and hand over with actions taken; this is the pattern of a professional SOC.',
        'WRONG - waiting for widespread beaconing before acting is the "wait for ransomware note" pattern; by then, the compromise is mature.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1071',
      rotation_bucket: 'escalation',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC lead at a Johannesburg-based bank notices that a detection rule for credential dumping has fired 47 times in 30 days, all against different users, and 45 of the 47 alerts were closed as "false positive — legitimate administrative tool." The rule has not been tuned in 18 months. What is the most defensible action?',
    [
      'Disable the rule — 96% false positive rate means it is not useful and is wasting analyst time',
      'Review the 45 closed alerts for pattern consistency, then tune the rule with exclusions that match the legitimate admin tool while preserving the detection for any other credential-dumping variant',
      'Leave the rule as-is — 2 true positives in 30 days is a signal that the rule is working as designed',
      'Raise the severity of the rule to critical so analysts investigate more carefully'
    ],
    1,
    'A high-false-positive rule is not a useless rule — it is a rule that needs tuning. 45 closed alerts may hide a real attack, and disabling the rule makes the team blind to the technique.',
    'detection_tuning',
    45,
    {
      distractor_rationale: [
        'WRONG - disabling the rule makes the team blind to all credential dumping, including real attacks; this is the failure mode that lets an incident mature.',
        'CORRECT - review the closed alerts for consistency, then tune with specific exclusions; this preserves detection while reducing noise.',
        'WRONG - leaving the rule untuned wastes 47 analyst hours per month and normalizes the pattern of closing alerts without investigating.',
        'WRONG - raising severity does not reduce volume; it makes the alert more prominent but still noisy, and analysts will still close it as false positive.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003',
      rotation_bucket: 'detection_tuning',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC team has just completed a purple-team exercise where the red team successfully used a specific lateral-movement technique (T1021.002 — SMB/Windows Admin Shares) to move from a compromised workstation to a database server. The technique was not detected. What is the most defensible next step?',
    [
      'Document the technique in the purple-team report and schedule a follow-up exercise in 90 days to see if detection improved',
      'Add a general "lateral movement" alert that fires on any SMB traffic to the database server — broad coverage is better than missing the technique',
      'Purchase a new EDR product that claims to detect T1021.002 specifically',
      'Write a detection rule based on the specific process, network, and credential patterns the red team used, and test it against the red-team replay before closing the exercise'
    ],
    3,
    'Purple-team value comes from closing the loop: writing a detection, testing it against the same technique, and verifying the detection fires. Documenting without detection work is a report, not an improvement.',
    'detection_tuning',
    45,
    {
      distractor_rationale: [
        'WRONG - documenting and scheduling a follow-up 90 days later leaves the gap open for 90 days; detection should be written now.',
        'WRONG - a general "any SMB to the database" alert will fire on every legitimate admin action and become another noisy rule that gets closed without investigation.',
        'WRONG - purchasing a new EDR product without testing whether it detects the specific technique is buying hope, not capability.',
        'CORRECT - write a specific detection based on the technique, test it against the red-team replay, then close; this is the purple-team loop.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1021.002',
      rotation_bucket: 'detection_tuning',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC analyst on shift sees an alert about a user account that has logged in successfully from three different countries in 20 minutes (Windhoek, Lagos, London). The user has no travel history on file. What is the most defensible first action?',
    [
      'Close the alert as a VPN artefact — users on corporate VPN often show multiple apparent geolocations',
      'Verify with the user through a known internal channel whether they are travelling, while revoking active sessions and checking for concurrent logins in the meantime',
      'Block all three countries at the gateway to prevent the possibility of further logins from those locations',
      'Wait for a second alert — one implausible travel pattern is not enough to act on'
    ],
    1,
    'The three-country pattern in 20 minutes cannot be physically real — it is a session-theft or credential-sharing indicator. Acting on it while verifying is the right sequence.',
    'alert_triage',
    45,
    {
      distractor_rationale: [
        'WRONG - VPN artefact does not produce three countries in 20 minutes; even with VPN, the geography would be the VPN exit, not the user.',
        'CORRECT - verify with the user while containing; revocation is the safe containment action that can be reversed if the user is legitimate.',
        'WRONG - blocking three countries is disproportionate and would affect other legitimate users; revoke the specific sessions instead.',
        'WRONG - waiting for a second alert assumes the attacker will repeat; they will not — this alert is the opportunity.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1539',
      rotation_bucket: 'alert_triage',
      last_validated: '2026-11-15'
    }
  ),

  q(
    'A SOC manager is preparing a quarterly report for the CISO. The team has closed 3,200 alerts this quarter, opened 180 investigations, and escalated 12 incidents. What is the most defensible way to present SOC performance to the CISO?',
    [
      'Present MTTD and MTTR trends on specific critical techniques, the ratio of escalations to incidents (false positive rate), and the number of detection rules tested and improved — with two specific gaps and a remediation plan',
      'Present the total alerts closed and investigations opened — these are the standard volume metrics that show throughput',
      'Present only the number of incidents prevented and the savings from prevented breaches — the CISO cares about business outcomes',
      'Present the number of slides delivered to the board and the number of analyst trainings completed — these show professional development'
    ],
    0,
    'Volume metrics measure activity; MTTD/MTTR on critical techniques measure effectiveness. Gaps with remediation plans turn reporting from vanity metrics into a business decision.',
    'detection_tuning',
    45,
    {
      distractor_rationale: [
        'CORRECT - MTTD/MTTR on critical techniques plus false-positive rate plus tested-and-improved rules plus named gaps equals an honest readiness picture.',
        'WRONG - volume metrics (alerts closed, investigations opened) measure activity, not effectiveness; a team could close 3,200 alerts and still miss every real attack.',
        'WRONG - "incidents prevented" is unprovable by construction and CISO audiences know it; it reads as marketing rather than reporting.',
        'WRONG - slides and trainings are process inputs, not security outcomes; the CISO needs to see whether the SOC is actually reducing risk.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1562',
      rotation_bucket: 'detection_tuning',
      last_validated: '2026-11-15'
    }
  )
,
  q(
    'A SOC manager is preparing a quarterly report for the CISO. The team has closed 3,200 alerts this quarter, opened 180 investigations, and escalated 12 incidents. What is the most defensible way to present SOC performance to the CISO?',
    [
      'Present MTTD and MTTR trends on specific critical techniques, the ratio of escalations to incidents (false positive rate), and the number of detection rules tested and improved — with two specific gaps and a remediation plan',
      'Present the total alerts closed and investigations opened — these are the standard volume metrics that show throughput',
      'Present only the number of incidents prevented and the savings from prevented breaches — the CISO cares about business outcomes',
      'Present the number of slides delivered to the board and the number of analyst trainings completed — these show professional development'
    ],
    0,
    'Volume metrics measure activity; MTTD/MTTR on critical techniques measure effectiveness. Gaps with remediation plans turn reporting from vanity metrics into a business decision.',
    'detection_tuning',
    45,
    {
      distractor_rationale: [
        'CORRECT - MTTD/MTTR on critical techniques plus false-positive rate plus tested-and-improved rules plus named gaps equals an honest readiness picture.',
        'WRONG - volume metrics (alerts closed, investigations opened) measure activity, not effectiveness; a team could close 3,200 alerts and still miss every real attack.',
        'WRONG - "incidents prevented" is unprovable by construction and CISO audiences know it; it reads as marketing rather than reporting.',
        'WRONG - slides and trainings are process inputs, not security outcomes; the CISO needs to see whether the SOC is actually reducing risk.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1562',
      rotation_bucket: 'detection_tuning',
      last_validated: '2026-11-15'
    }
  )
],
    21: [
  q(
    'A Windhoek-based bank runs a flat VPN that allows any authenticated laptop to reach sensitive SCADA jump hosts directly. The CISO asks what the first architectural change should be. What is the most defensible response?',
    [
      'Replace the VPN with longer pre-shared keys and rotate them quarterly — the flat access model is fine once the keys are stronger',
      'Segment the network so that the SCADA jump hosts are in a policy zone with explicit allow rules, and require device posture and continuous identity checks for each connection',
      'Remove the VPN entirely and require all engineers to use personal devices from home — this eliminates the office perimeter',
      'Add a second VPN layer on top of the existing one, so attackers need two credentials instead of one to reach the jump hosts'
    ],
    1,
    'Zero Trust does not mean no perimeter — it means the perimeter is around each resource, not around the network. Segmentation plus continuous verification is the architectural change; stronger VPN keys and layering are not.',
    'microsegmentation',
    45,
    {
      distractor_rationale: [
        'WRONG - stronger keys do not change the flat access model; a compromised laptop can still reach the SCADA jump hosts.',
        'CORRECT - policy zones around the sensitive resource, plus device and identity checks on every connection, is the architectural change.',
        'WRONG - removing the VPN without a replacement access model leaves engineers with no secure path and does not implement Zero Trust.',
        'WRONG - layering VPNs adds operational complexity without changing the trust model; one credential compromise still exposes both layers.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1133',
      rotation_bucket: 'microsegmentation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A contractor using an unmanaged personal laptop needs access to the ERP system for a 6-week project. The device has sideloaded apps and no MDM enrolment. What is the most defensible access design?',
    [
      'Issue the contractor a domain admin account so they can resolve any access issues themselves without needing IT support',
      'Publish the ERP as a virtual app through a ZTNA gateway that checks user identity on every session, restricts the session to the specific ERP functions the contractor needs, and logs all activity',
      'Allow full VPN access with no device checks — the contractor has signed an NDA, so the risk is covered by policy',
      'Require the contractor to install MDM on their personal device, and deny access if they refuse — BYOD must be managed or blocked'
    ],
    1,
    'ZTNA gives scoped access without managing the device. Device posture is one signal, not the only signal — for an unmanaged device, virtual app publishing plus per-session identity check and logging is the defensible path.',
    'continuous_validation',
    45,
    {
      distractor_rationale: [
        'WRONG - domain admin for a contractor is the exact over-privilege that Zero Trust exists to prevent.',
        'CORRECT - virtual app publishing with per-session identity check and audit trail provides scoped access without requiring device management.',
        'WRONG - NDA covers the risk is not a security control; an unmanaged device with full VPN access is a breach vector.',
        'WRONG - managed or blocked is one valid policy for employee BYOD, but it does not solve the access need for a 6-week contractor; ZTNA is the design that meets both requirements.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1133',
      rotation_bucket: 'continuous_validation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian government ministry wants to adopt Zero Trust but has 40% of staff on Windows 7 machines that cannot run modern device-posture agents. What is the most defensible phased approach?',
    [
      'Pause the Zero Trust program until all 40% of Windows 7 machines are replaced — partial Zero Trust is not Zero Trust',
      'Exempt the Windows 7 machines from Zero Trust controls entirely — they are a known legacy exception and should not block the program',
      'Apply stronger identity verification to all staff first, and use application-level controls for the legacy machines until they are replaced',
      'Roll out device-posture enforcement to all staff at once, accepting that 40% will lose access until they upgrade'
    ],
    2,
    'Zero Trust is phased by design. Identity controls apply to everyone; device-posture enforcement waits for the fleet to catch up; application-level controls bridge the gap. Pausing, exempting, or big-banging are the three failure modes.',
    'implementation_tradeoffs',
    45,
    {
      distractor_rationale: [
        'WRONG - pausing the program until fleet replacement delays the whole initiative by years and leaves identity controls unaddressed.',
        'WRONG - exempting 40% of staff leaves the largest attack surface outside the program.',
        'CORRECT - identity controls first, application-level controls as bridge, posture enforcement as machines are replaced — phased by capability.',
        'WRONG - big-bang enforcement blocks 40% of staff on day one and is not implementable; Zero Trust is a journey, not a switch.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'implementation_tradeoffs',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Lagos-based fintech wants to implement Zero Trust for its 200-person engineering team. The CTO asks what "identity as the new perimeter" actually means for the company VPN. What is the most defensible answer?',
    [
      'It means replacing the VPN with a ZTNA service that brokers per-application access based on user identity and device posture, keeping the VPN as a fallback for legacy apps',
      'It means keeping the VPN exactly as it is, but requiring users to authenticate twice — once for the VPN and once for each application',
      'It means removing the VPN and publishing every internal application directly to the internet, protected only by MFA',
      'It means moving all authentication to a single SSO provider and treating the VPN as the only enforcement point'
    ],
    0,
    'Identity as the perimeter means per-application access brokered by identity and posture, not double authentication on the same flat network. ZTNA replaces VPN with per-app access; legacy apps can stay on the VPN temporarily.',
    'identity_architecture',
    45,
    {
      distractor_rationale: [
        'CORRECT - ZTNA brokers per-app access with identity and posture; the VPN remains for legacy apps during transition.',
        'WRONG - double authentication on the same flat network does not change the access model; a compromised session still reaches every internal resource.',
        'WRONG - publishing internal apps directly to the internet with only MFA is not Zero Trust; it is a new attack surface.',
        'WRONG - SSO without ZTNA is still one credential, full network access; identity is centralised but the perimeter has not changed.'
      ],
      cognitive_level: 5,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_architecture',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Walvis Bay logistics company wants to enforce device posture on all employees, but 30% of staff use personal phones for email and Teams. The IT director proposes a strict "managed device or no access" policy. What is the most defensible response?',
    [
      'Accept the policy as proposed — managed device is the only defensible posture for email access',
      'Exempt all personal phones from posture enforcement because enforcing it will cause staff friction',
      'Implement app-level posture checks for mobile email while keeping managed-device enforcement for sensitive systems, and document the residual risk',
      'Require personal phones to be enrolled in MDM, and use remote wipe as a condition of employment'
    ],
    2,
    'Posture enforcement should be proportional to the sensitivity of the resource. Email on a personal phone is lower risk than ERP access; app-level controls plus documented residual risk are defensible. Managed or nothing and exempt everything are both failures.',
    'implementation_tradeoffs',
    45,
    {
      distractor_rationale: [
        'WRONG - managed or nothing for email access is disproportionate and will fail operationally; most staff will find workarounds.',
        'WRONG - exempting all personal phones removes the visibility that posture checks provide; app-level controls are the middle path.',
        'CORRECT - app-level controls for lower-risk resources, device management for higher-risk ones, with documented residual risk.',
        'WRONG - remote wipe as a condition of employment is a disproportionate privacy intrusion for email access and will not survive HR review.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'implementation_tradeoffs',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Johannesburg bank has 12 core applications, each with its own authentication system. The CIO wants to implement Zero Trust. What is the most defensible first architectural move?',
    [
      'Implement microsegmentation of the network first, and address identity federation in a later phase',
      'Keep the 12 authentication systems as they are and add a VPN requirement on top for all application access',
      'Federate the 12 authentication systems to a single identity provider with per-application access policy, before implementing network segmentation',
      'Replace the 12 applications with a single ERP system, which removes the identity fragmentation at the source'
    ],
    2,
    'Identity federation is the foundational move. Without a unified identity layer, per-application policy cannot be enforced consistently, and segmentation without identity control still allows lateral movement after authentication.',
    'identity_architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - segmentation without identity control still allows lateral movement once a user is authenticated; identity is the foundation.',
        'WRONG - VPN on top does not address identity fragmentation; it adds a network layer without fixing the access model.',
        'CORRECT - federating authentication to a single IdP with per-app policy is the architectural prerequisite for Zero Trust.',
        'WRONG - replacing 12 applications with one ERP is a multi-year strategic project, not a Zero Trust architectural first move.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_architecture',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Rundu-based clinic network uses a single flat VLAN for staff workstations, medical devices, and guest Wi-Fi. What is the most defensible microsegmentation design for a first phase?',
    [
      'Create separate policy zones for staff, medical devices, and guests, with explicit allow rules between them and monitoring for any traffic that crosses zones',
      'Replace the flat VLAN with one VLAN per floor of the building — physical topology is the right basis for segmentation',
      'Leave the flat VLAN but add a host-based firewall to every workstation — this achieves microsegmentation without changing the network',
      'Move all devices to a cloud-based network so the flat VLAN problem disappears'
    ],
    0,
    'Microsegmentation starts with policy zones defined by function, not by physical topology. Staff, medical devices, and guests are the three primary trust zones; explicit allow rules and zone-crossing monitoring are the first-phase controls.',
    'microsegmentation',
    45,
    {
      distractor_rationale: [
        'CORRECT - functional policy zones with explicit allow rules and crossing monitoring is the first-phase design.',
        'WRONG - physical topology is not the right basis for segmentation; the same function on different floors should be in the same zone.',
        'WRONG - host-based firewalls are a complementary control, not a substitute for network-level segmentation; a compromised host can still reach the flat VLAN.',
        'WRONG - moving to cloud does not eliminate segmentation requirements; the same zones are needed in the cloud network.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1021',
      rotation_bucket: 'microsegmentation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A SOC analyst notices that 60% of remote users are being prompted for MFA re-authentication multiple times per day because of a recent conditional-access policy change. The CTO asks whether this is a policy error or an acceptable trade-off. What is the most defensible analysis?',
    [
      'Accept the trade-off — frequent MFA prompts are the cost of strong security, and users will adapt',
      'Disable the policy — user productivity is more important than MFA and the previous state was acceptable',
      'Add more MFA prompts — if 60% are being re-prompted, the other 40% should be too, so all users are treated consistently',
      'Investigate whether the policy can achieve the same risk reduction with fewer prompts — session binding, trusted locations, and risk-based triggers can reduce friction without reducing protection'
    ],
    3,
    'Zero Trust is a trade-off between friction and protection. The right answer is to tune the policy to achieve the same protection with less friction, not to accept the friction or remove the protection.',
    'continuous_validation',
    45,
    {
      distractor_rationale: [
        'WRONG - users will adapt is not a policy analysis; excessive prompts drive workarounds that weaken security.',
        'WRONG - disabling the policy removes the protection entirely; this is the failure mode that leads to incidents.',
        'WRONG - more prompts treats frequency as a virtue; the goal is the right prompts at the right time, not maximum prompts.',
        'CORRECT - session binding, trusted locations, and risk-based triggers can achieve the same protection with less friction.'
      ],
      cognitive_level: 5,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'continuous_validation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian government agency wants to implement Zero Trust but the procurement process requires an 18-month timeline to acquire new technology. The CISO asks whether the agency can start Zero Trust without new purchases. What is the most defensible answer?',
    [
      'No — Zero Trust requires new ZTNA and microsegmentation technology; the agency must wait for procurement',
      'Yes — Zero Trust is a pure policy framework, and the agency can achieve it entirely with documentation',
      'Yes — the agency can start with identity controls and policy changes on existing infrastructure, and add technology as procurement completes',
      'No — Zero Trust is a vendor product category, and only a named Zero Trust solution qualifies'
    ],
    2,
    'Zero Trust is a strategy, not a product. Identity controls, policy changes, and configuration hardening are available on existing infrastructure. The 18-month procurement is not a blocker for Phase 1.',
    'implementation_tradeoffs',
    45,
    {
      distractor_rationale: [
        'WRONG - Zero Trust does not require new technology to start; the identity layer is where most agencies begin.',
        'WRONG - Zero Trust is not pure documentation; it requires technical implementation, but not necessarily new purchases.',
        'CORRECT - identity controls and policy changes can start now on existing infrastructure; technology acquisition follows.',
        'WRONG - treating Zero Trust as a vendor product category is exactly the framework tourism failure mode.'
      ],
      cognitive_level: 5,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'implementation_tradeoffs',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Nairobi-based law firm wants to restrict document access to only the specific client matters each lawyer works on, rather than by department. What is the most defensible design?',
    [
      'Create a separate network segment for each client matter and restrict lawyer workstations to the correct segment',
      'Implement attribute-based access control on the document management system, using user identity, client matter, and time-bound engagement as attributes',
      'Restrict all lawyers to the same department and rely on the department head to grant access per matter',
      'Add a second password to each client-matter document that only the assigned lawyer knows'
    ],
    1,
    'ABAC at the application layer is the right control for per-matter access. Network segmentation is the wrong layer — it does not scale to hundreds of client matters, and it does not enforce document-level access.',
    'microsegmentation',
    45,
    {
      distractor_rationale: [
        'WRONG - one network segment per client matter does not scale to hundreds of matters, and does not enforce document-level access.',
        'CORRECT - ABAC on the document management system, with matter and engagement attributes, enforces per-matter access at the data layer.',
        'WRONG - department head grants access is manual, slow, and does not provide continuous enforcement.',
        'WRONG - a shared password per document does not provide auditability and cannot be revoked per user.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1021',
      rotation_bucket: 'microsegmentation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A SOC analyst at a Windhoek-based bank sees that a service account used for database backups has authenticated successfully from a new IP range. The device posture check for the host shows it is unpatched and running an unsupported OS. What should happen, and what should the Zero Trust design have done to prevent this?',
    [
      'Allow the access — the service account credentials are valid, and database backups must run regardless of the host',
      'Deny the access but only after the service account owner confirms the new IP range in writing',
      'Allow the access but log it for after-hours review — this is a backup job, not a user login',
      'Deny the access because the device posture check failed; the Zero Trust design should have enforced posture on service-account connections, not just on user connections'
    ],
    3,
    'Continuous validation applies to service accounts too. A service account with valid credentials but a compromised or unpatched host is a lateral-movement path, not a backup. Posture enforcement for service accounts is part of the design.',
    'continuous_validation',
    45,
    {
      distractor_rationale: [
        'WRONG - backups must run regardless is the failure mode that lets a compromised host exfiltrate data using a service account.',
        'WRONG - email confirmation is not a security control; the host is unpatched, which is the actual risk.',
        'WRONG - log for later is exactly what a sophisticated attacker would prefer; the access should be denied now.',
        'CORRECT - posture check failure should deny access; the design should have enforced posture on service accounts, not just users.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'continuous_validation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A bank CISO is reviewing a Zero Trust proposal that costs N$14 million over three years. The board asks what would happen if the bank did nothing. What is the most defensible answer?',
    [
      'Without Zero Trust, the bank would be non-compliant with regulators, so the cost is mandatory regardless of the risk reduction',
      'Without Zero Trust, the bank will certainly be breached — the N$14 million is a fraction of the cost of a breach',
      'Without Zero Trust, the bank retains a flat trust model where a single compromised credential provides broad access; the specific risk reduction depends on which credentials are compromised, what they can reach, and whether the attack chain can be interrupted by other controls',
      'Without Zero Trust, the bank cyber insurance will not pay out on ransomware claims, so the cost is justified by insurance requirements'
    ],
    2,
    'The defensible answer names the specific risk reduction and connects it to the specific attack chain. Non-compliant, certainly breached, and insurance requires it are all unprovable or irrelevant claims.',
    'implementation_tradeoffs',
    45,
    {
      distractor_rationale: [
        'WRONG - Zero Trust is not yet a specific regulatory requirement in most jurisdictions; non-compliant overstates the case.',
        'WRONG - will certainly be breached is not a defensible claim and damages credibility with the board.',
        'CORRECT - names the specific risk reduction, connects it to the attack chain, and acknowledges what other controls mitigate without Zero Trust.',
        'WRONG - insurance requirements vary and are not the reason to invest in Zero Trust; this is an off-topic justification.'
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1078',
      rotation_bucket: 'implementation_tradeoffs',
      last_validated: '2026-11-16'
    }
  ),


],
    37: [
  q(
    'A Windhoek retail chain runs quarterly phishing simulations. Click rate has dropped from 40% to 8% over two years, but report rate has also dropped — from 15% to 3%. The security manager asks what to do. What is the most defensible response?',
    [
      "Change the program focus from click rate to report rate, and design the next simulation specifically to test whether staff report a suspicious email they receive",
      "Continue the simulations as they are — the click rate is what matters, and 8% is a good result",
      "Reduce the simulation frequency to once a year — quarterly simulations are exhausting the staff and driving the report rate down",
      "Stop the phishing simulations entirely — 8% click rate means the training has worked and staff no longer need simulations"
    ],
    0,
    'Click rate and report rate measure different things. Low click rate with low report rate means staff are deleting suspicious emails instead of reporting them — which means real incidents could sit unreported. The program must shift focus to reporting, which is the behaviour that shortens detection time.',
    'program_measurement',
    45,
    {
      distractor_rationale: [
      "CORRECT - shift the measurement to report rate and design simulations that test reporting, not just clicking.",
      "WRONG - low click rate with low report rate is a warning sign, not a success; it means staff are not reporting suspicious emails.",
      "WRONG - reducing frequency does not address the low report rate; it just gives fewer opportunities to detect whether staff report.",
      "WRONG - stopping the program removes the visibility into whether staff are reporting, and the 8% click rate does not tell the whole story."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'program_measurement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A staff member at a Rundu office receives a suspicious email and forwards it to two colleagues asking "is this a scam?" before reporting it to IT. The email is a real phishing email. What is the most defensible program response?',
    [
      "Remove the staff member from the next phishing simulation cohort because they did not follow procedure",
      "Praise the staff member for forwarding it and ask them to also use the report-phish button so the security team sees it immediately",
      "Tell the staff member not to forward suspicious emails to colleagues — they should report to IT only, and forwarding to colleagues spreads risk",
      "Ignore the case — the email was eventually reported and no one clicked, so there is no lesson to learn"
    ],
    1,
    'The staff member did the right thing by recognizing the email was suspicious. The behaviour to correct is the channel, not the instinct. Praise preserves the reporting instinct while adding the report-phish channel.',
    'reporting_culture',
    45,
    {
      distractor_rationale: [
      "WRONG - removing the staff member from the simulation punishes good behaviour and will stop future reporting.",
      "CORRECT - praise the instinct, redirect the channel; the staff member did the harder thing (recognizing it) right.",
      "WRONG - telling staff not to forward is the kind of response that suppresses reporting; the instinct to warn colleagues is good, the channel needs adjusting.",
      "WRONG - the lesson is that staff are not aware of the report-phish button, which is a program gap, not no lesson."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'reporting_culture',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian SME wants to improve password hygiene across 15 staff. The IT manager proposes a policy: minimum 16 characters, change every 60 days, no reuse of last 10 passwords. What is the most defensible alternative?',
    [
      "Keep the current policy but add a quarterly password training session to help staff remember the requirements",
      "Extend the minimum length to 20 characters and require special characters in at least 3 of the 4 character classes",
      "Implement a password manager for all staff with a single strong master password, remove the forced rotation policy, and require MFA on all accounts",
      "Ban password reuse across personal accounts as well as work accounts, and require staff to disclose their personal passwords to IT"
    ],
    2,
    'Forced rotation with 16 characters drives workarounds (sticky notes, predictable patterns). A password manager eliminates the memory burden, and MFA addresses the credential theft risk that password policies cannot. The combination is the modern recommendation (NIST SP 800-63B).',
    'habit_design',
    45,
    {
      distractor_rationale: [
      "WRONG - more training for an impossible policy makes the problem worse; staff will still use workarounds.",
      "WRONG - longer passwords with more complexity requirements increase workaround behaviour rather than improving security.",
      "CORRECT - password manager plus MFA is the modern best practice; it removes the memory burden and addresses credential theft.",
      "WRONG - requiring personal password disclosure is a privacy violation and will not be accepted; it also does not address work password hygiene."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'habit_design',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Walvis Bay logistics company runs a security awareness program for 200 staff. The CEO asks for one metric that shows whether the program is working. What is the most defensible metric?',
    [
      "The percentage of staff who completed the awareness training modules — completion rate shows engagement",
      "The number of staff who attended the annual security briefing — attendance shows executive support",
      "The number of phishing simulations run per quarter — frequency shows program intensity",
      "The ratio of reported suspicious emails to clicked phishing simulations over time — it measures whether staff are reporting and whether they are clicking"
    ],
    3,
    'Completion rate, simulation frequency, and attendance are activity metrics. The report-to-click ratio measures behaviour — whether staff are doing the thing you want them to do (report) and not doing the thing you want to prevent (click).',
    'program_measurement',
    45,
    {
      distractor_rationale: [
      "WRONG - completion rate measures attendance, not behaviour change; a staff member can complete training and still click.",
      "WRONG - attendance is an activity metric; it does not measure whether the briefing changed behaviour.",
      "WRONG - simulation frequency measures effort, not effectiveness.",
      "CORRECT - report-to-click ratio measures the two behaviours that matter: reporting suspicious emails and not falling for them."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'program_measurement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A senior manager at a Namibian government ministry receives a suspicious email and does not report it, because they are worried about looking foolish if the email turns out to be legitimate. What is the most defensible program change to address this?',
    [
      "Send a reminder to all senior managers that reporting is mandatory and that failure to report will be noted",
      "Implement blame-free reporting that rewards near-miss reports, and have senior leaders publicly report their own suspicious emails in team meetings to model the behaviour",
      "Require all senior managers to complete additional awareness training on the importance of reporting",
      "Reduce the number of suspicious emails reaching senior managers by tightening the email gateway"
    ],
    1,
    'The barrier is psychological — fear of looking foolish. Program changes that reduce this fear work; policy reminders and mandatory training do not. Senior leaders modelling the behaviour is the single highest-impact intervention.',
    'reporting_culture',
    45,
    {
      distractor_rationale: [
      "WRONG - making reporting mandatory reinforces the fear of looking foolish; it does not address the psychological barrier.",
      "CORRECT - blame-free reporting plus senior leader modelling addresses the actual barrier: fear of looking foolish.",
      "WRONG - more training for senior managers does not change the incentive to not report.",
      "WRONG - reducing email volume reduces the symptom, not the barrier; the next suspicious email will still not be reported."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'reporting_culture',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A clinic in Oshakati has one shared computer at the reception desk used by six staff across three shifts. What is the most defensible security awareness intervention for this environment?',
    [
      "Train all staff on the importance of logging out after each session, and configure the computer to auto-lock after 5 minutes of inactivity",
      "Post a reminder on the wall saying \"always log out\" and rely on staff to follow the reminder",
      "Require each staff member to have their own account with a strong password, train them on locking the screen, and remove administrator rights from the shared account",
      "Install a password manager that requires a master password to unlock before each session"
    ],
    2,
    'Shared computers require shared-environment controls: individual accounts (for auditability), screen lock training (for hygiene), and least privilege (for damage limitation). A simple reminder or auto-lock alone is insufficient for a shared environment.',
    'habit_design',
    45,
    {
      distractor_rationale: [
      "WRONG - auto-lock alone helps but does not address the lack of individual accounts or the shared admin rights.",
      "WRONG - a wall reminder is not a control; shared-computer environments need technical and policy controls, not just reminders.",
      "CORRECT - individual accounts plus screen lock plus removal of admin rights is the minimum for a shared computer environment.",
      "WRONG - a password manager does not address the shared computer problem; it may actually make it worse if staff store shared passwords in a shared manager."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'habit_design',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian SME runs an awareness program with quarterly phishing simulations. After 6 quarters, the click rate is 4% and the report rate is 60%. The finance team still fell for a real BEC email last week. What is the most defensible interpretation?',
    [
      "The program is failing — 4% click rate and 60% report rate are not good enough and the program needs to be redesigned",
      "The finance team should be replaced — they ignored the training and caused the loss",
      "The program should focus on phishing only — expanding to BEC is out of scope for awareness training",
      "The program is working for most staff but BEC is a different attack class than phishing; the finance team needs specific training on BEC patterns and authority-pressure tactics"
    ],
    3,
    'BEC requires different skills than phishing. A finance professional can recognize a standard phishing email and still fall for a BEC email that uses the CEO name, urgency, and a plausible supplier story. Awareness programs must cover both.',
    'program_measurement',
    45,
    {
      distractor_rationale: [
      "WRONG - the metrics are good; the problem is coverage, not general program failure.",
      "WRONG - replacing the team does not fix the training gap; the next team will make the same mistake.",
      "WRONG - BEC is the most expensive attack class for SMEs; awareness training that does not cover it is incomplete.",
      "CORRECT - BEC requires specific training on authority-pressure and finance-specific pretexts, which is a different skill from phishing recognition."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'program_measurement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Nairobi-based company wants to implement a security awareness program for 50 staff but has a budget of only N$5,000 (approximately N$100 per staff member). What is the most defensible way to allocate the budget?',
    [
      "Run quarterly phishing simulations using free tools and spend the budget on a password manager for all staff and one in-person BEC workshop",
      "Buy a commercial awareness platform with phishing simulations — commercial platforms offer better content than free tools",
      "Spend the entire budget on printed awareness posters and distribute them across the office",
      "Save the budget for next year and run the program without tools — good awareness training does not require budget"
    ],
    0,
    'A password manager is the highest-leverage spend because it changes behaviour permanently. A free phishing simulation tool covers the simulation need at zero cost. One in-person BEC workshop covers the highest-risk attack class for SMEs. This combination addresses the biggest risks within the budget.',
    'habit_design',
    45,
    {
      distractor_rationale: [
      "CORRECT - password manager plus free phishing simulations plus one BEC workshop addresses the biggest risks within the budget.",
      "WRONG - commercial platforms spend the budget on licenses, leaving little for behaviour change tools; free simulations plus a password manager is higher-leverage.",
      "WRONG - posters alone do not change behaviour; they are the classic low-impact spend.",
      "WRONG - saving the budget means no improvement this year; the vulnerability continues."
      ],
      cognitive_level: 5,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'habit_design',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Windhoek-based NGO has a WhatsApp group for finance staff. A staff member receives a WhatsApp message from a number that displays the CEO photo and name, asking them to send a payment link to a "new supplier." What is the most defensible response from the staff member?',
    [
      "Reply to the WhatsApp message asking for the supplier details and confirm the amount before sending the link",
      "Forward the WhatsApp message to the finance team group so others can verify whether the request is legitimate",
      "Do not act on the WhatsApp message; call the CEO on their known internal number or a verified contact to confirm the request",
      "Block the WhatsApp number and move on — this is clearly a scam and does not need to be reported"
    ],
    2,
    'WhatsApp is the primary attack surface for African SMEs. Display name and photo are not verification. The correct response is a callback on a known channel, which is the same principle established in Module 7. This question tests whether the awareness training generalises to the WhatsApp-first context.',
    'social_engineering_awareness',
    45,
    {
      distractor_rationale: [
      "WRONG - replying to the attacker confirms the number is active and gives them a channel to escalate.",
      "WRONG - forwarding to a group of colleagues does not verify; it spreads uncertainty and delays the correct action.",
      "CORRECT - callback on the CEO known number is the only verification that survives WhatsApp impersonation.",
      "WRONG - blocking without reporting means the security team has no visibility into the attack."
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1656',
      rotation_bucket: 'social_engineering_awareness',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A staff member at a Windhoek office tells the security team that they received a suspicious email, but they had already clicked the link and not entered credentials. They are embarrassed and ask not to be identified. What is the most defensible response?',
    [
      "Require the staff member to identify themselves so their account can be investigated, and add them to the next simulation cohort",
      "Log the report anonymously and take no further action — if credentials were not entered, there is nothing to investigate",
      "Report the staff member to their manager — clicking a link is a policy violation and they need to be held accountable",
      "Respect the anonymity, thank the staff member for reporting, and check the authentication logs for their account without naming them to anyone else"
    ],
    3,
    'The staff member did the right thing by reporting. Anonymity allows the security team to investigate the account without discouraging future reports. The investigation can proceed through technical channels without identifying the staff member.',
    'reporting_culture',
    45,
    {
      distractor_rationale: [
      "WRONG - requiring identification undermines the anonymous reporting path and will stop future reports; the same investigation can happen without naming the staff member.",
      "WRONG - even without entered credentials, the click can have exposed session data or browser information; the account needs investigation.",
      "WRONG - punishing the click is the exact opposite of a blame-free reporting culture and will suppress the next report.",
      "CORRECT - respect anonymity, investigate technically, and preserve the reporting instinct; the staff member did the hard thing right."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566.002',
      rotation_bucket: 'reporting_culture',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'An employee at a Windhoek SME receives a WhatsApp voice note from a "bank official" saying their business account has been flagged and they need to confirm their account details via a link. The employee is not sure whether to click, because the voice sounds professional and the bank name is correct. What is the most defensible response?',
    [
      "Do not click the link; call the bank on the number from the bank official website or a bank statement, and report the WhatsApp message to the security team",
      "Click the link to see what it asks for, but do not enter any details until verifying with the bank",
      "Reply to the WhatsApp message asking the bank official for their name and employee number to verify",
      "Forward the WhatsApp message to colleagues to see if they received the same message — safety in numbers"
    ],
    0,
    'Bank impersonation via WhatsApp voice note is a specific attack class in African markets. The correct response is a callback on the bank published number, not any link or number from the message. This is the same principle as Module 7, tested in the awareness context.',
    'social_engineering_awareness',
    45,
    {
      distractor_rationale: [
      "CORRECT - callback on the bank published number is the only verification that survives WhatsApp impersonation; report to security preserves visibility.",
      "WRONG - clicking to see what it asks for can trigger a credential harvester or proxy that captures the click.",
      "WRONG - the attacker is on the other end of the WhatsApp reply; verifying with the attacker is not verification.",
      "WRONG - forwarding to colleagues does not verify; it spreads uncertainty and delays the correct action."
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1656',
      rotation_bucket: 'social_engineering_awareness',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'An SME wants to run a phishing simulation but is worried that it will damage staff trust if some staff click and feel embarrassed. What is the most defensible design for the first simulation?',
    [
      "Run the simulation with no follow-up coaching — the embarrassment of clicking is the lesson, and following up will make it worse",
      "Run the simulation on a low-stakes benign email (e.g., \"cafeteria menu change\") and follow up with a blame-free debrief that explains what the simulation tested and why it matters",
      "Skip the simulation entirely — the risk of damaging trust is greater than the benefit of testing",
      "Run the simulation only on new staff who have not yet built relationships with the team"
    ],
    1,
    'The first simulation sets the tone. A benign scenario plus a blame-free debrief establishes that the program is about learning, not punishment. Simulations that shame or exclude staff damage trust; simulations that debrief transparently build it.',
    'social_engineering_awareness',
    45,
    {
      distractor_rationale: [
      "WRONG - no follow-up means clicks become a silent failure; staff do not learn what happened or why it matters.",
      "CORRECT - benign scenario plus blame-free debrief establishes the learning tone and preserves trust.",
      "WRONG - skipping simulations leaves the program without measurement and without practice.",
      "WRONG - targeting only new staff isolates them, damages trust with the cohort, and misses the experienced staff who are equally at risk."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'social_engineering_awareness',
      last_validated: '2026-11-16'
    }
  )
],
    46: [
        q(
            "An unapproved full-subnet SYN scan originates from a marketing employee laptop at 03:00. What is the appropriate SOC framing?",
            [
                "Assume it is always a benign automated Windows background update process",
                "Treat as active reconnaissance tradecraft and precursor activity until proven authorized",
                "Ignore night-shift network scans entirely as standard background noise",
                "Permanently ban all ICMP network traffic across the enterprise without analysis"
            ],
            1,
            "Port scanning and discovery tradecraft represent standard adversary precursor activity requiring validation against change logs.",
            "nmap",
            40,
            {
                distractor_rationale: [
                    "WRONG — assuming scans are benign Windows updates misses potential insider recon or host compromise.",
                    "CORRECT — treating unapproved scans as precursor activity ensures prompt investigation.",
                    "WRONG — ignoring night scans allows attackers to complete reconnaissance unchecked.",
                    "WRONG — blocking all ICMP breaks legitimate network diagnostics and monitoring."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1046",
                rotation_bucket: "nmap",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Which discovery finding represents the most urgent requirement for a ticket assigned with an explicit owner and strict SLA?",
            [
                "A closed port 9 responding on a standard local networked office printer",
                "Unexpected RDP and SMB service exposure on a crown-jewel subnet facing the internet",
                "A corporate workstation responding normally to standard network ping packets",
                "An observed Internet Protocol packet Time-To-Live value measuring exactly 64"
            ],
            1,
            "Exposing sensitive administrative services like RDP and SMB directly to the internet on critical assets creates immediate risk.",
            "nmap",
            35,
            {
                distractor_rationale: [
                    "WRONG — closed ports on peripheral devices present no exposure risk.",
                    "CORRECT — internet-exposed administrative services on crown-jewel subnets demand urgent remediation.",
                    "WRONG — responding to ping packets is standard network behavior.",
                    "WRONG — packet TTL values are standard diagnostic metrics."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1190",
                rotation_bucket: "nmap",
                last_validated: "2026-11-12"
            }
        )
    ],
    51: [
        q(
            "A Domain Administrator performs an interactive logon to a user workstation, followed by administrative lateral movement. What is the primary architectural lesson?",
            [
                "Cryptographic Kerberos authentication hashes are completely impossible to reuse",
                "Privileged credentials used on unhardened endpoints enable credential theft and lateral reuse",
                "Remote Desktop Protocol sessions are inherently secure under all operational conditions",
                "Cloud identity management systems render on-premises domain security controls obsolete"
            ],
            1,
            "Using privileged credentials on dirty or unhardened endpoints allows attackers to harvest and reuse materials for domain dominance.",
            "mimikatz",
            40,
            {
                distractor_rationale: [
                    "WRONG — Kerberos tickets and NTLM hashes are frequently targeted and reused by attackers.",
                    "CORRECT — logging onto dirty workstations with privileged accounts exposes credentials to theft tools.",
                    "WRONG — RDP sessions on compromised hosts do not protect credentials from memory scraping.",
                    "WRONG — on-premises domain security remains critical alongside cloud architectures."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1003.001",
                rotation_bucket: "mimikatz",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Credential Guard and Protected Users configurations most directly reduce which adversary capability?",
            [
                "The creation and distribution of malicious phishing emails across external gateways",
                "The ease of dumping, extracting, and reusing specific credential materials on endpoints",
                "The operational dependency on regular offline data backup and restore cycles",
                "The frequency and complexity of domain Name Resolution protocol queries"
            ],
            1,
            "Platform hardening controls like Credential Guard isolate secrets to raise the operational cost of credential theft.",
            "cred_guard",
            40,
            {
                distractor_rationale: [
                    "WRONG — endpoint credential hardening does not prevent external email phishing generation.",
                    "CORRECT — Credential Guard prevents unauthorized memory extraction of sensitive secrets.",
                    "WRONG — backup cycles are unrelated to endpoint credential storage mechanisms.",
                    "WRONG — DNS query behavior is unaffected by credential protection features."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1003",
                rotation_bucket: "cred_guard",
                last_validated: "2026-11-12"
            }
        )
    ],
    52: [
        q(
            "Malleable C2 profiles utilize legitimate-looking HTTP traffic patterns combined with randomized sleep jitter intervals. What is the most effective primary detection focus?",
            [
                "Searching specifically for executable file names matching \"cobaltstrike.exe\"",
                "Analyzing beacon cadence, process injection ancestry, and rare destination JA3 profiles",
                "Disabling encrypted HTTPS traffic inspection across all perimeter firewall devices",
                "Counting the total volume of daily PDF document downloads across user endpoints"
            ],
            1,
            "Focusing on behavioral indicators like beacon timing, process ancestry, and network metadata defeats malleable framing.",
            "c2",
            40,
            {
                distractor_rationale: [
                    "WRONG — attackers easily rename binaries, rendering filename searches ineffective.",
                    "CORRECT — behavioral analytics examining cadence, ancestry, and TLS fingerprints catch sophisticated C2.",
                    "WRONG — disabling HTTPS inspection blinds the enterprise to encrypted command and control channels.",
                    "WRONG — PDF download counts provide no visibility into active C2 beaconing."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1071.001",
                rotation_bucket: "c2",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "A host exhibits beaconing behavior every 60 seconds with jitter connecting to a rare SaaS-looking domain. What is the immediate containment priority?",
            [
                "Ignore the telemetry entirely until a formal ransomware note appears on screens",
                "Isolate host, preserve memory and disk state if playbook allows, block egress, hunt siblings",
                "Rename the destination domain entry within internal DNS lookup tables forever",
                "Reboot the workstation immediately and hope the network anomaly resolves itself"
            ],
            1,
            "Stopping C2 egress, preserving forensic state via isolation, and expanding the hunt across sibling hosts secures the environment.",
            "c2",
            40,
            {
                distractor_rationale: [
                    "WRONG — ignoring active beaconing allows attackers to establish deep persistence.",
                    "CORRECT — isolating the host and blocking egress stops communication while preserving forensic artifacts.",
                    "WRONG — renaming DNS entries does not block IP-based hardcoded connections or active sessions.",
                    "WRONG — rebooting without preservation destroys volatile memory evidence."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1071",
                rotation_bucket: "c2",
                last_validated: "2026-11-12"
            }
        )
    ],
    58: [
  q(
    'A Windhoek-based bank runs a BloodHound scan and finds a path from a Helpdesk group to a Tier-0-adjacent account through three GenericAll relationships. The IT director asks whether this is a real risk. What is the most defensible response?',
    [
      "Treat it as critical identity debt: remove the dangerous ACLs, enforce tiered admin boundaries, and audit who in Helpdesk has the credentials that start the path",
      "Close the finding — BloodHound paths are theoretical and require an attacker to already have Helpdesk credentials to exploit them",
      "Grant GenericAll to all corporate employees so the Helpdesk group is no longer a unique privilege target",
      "Add a new EDR agent to the Helpdesk workstations — the attack path is only exploitable if the workstation has malware"
    ],
    0,
    'BloodHound paths are not theoretical — they are exactly the privilege relationships attackers enumerate to find the shortest route to Tier-0. A three-hop path from Helpdesk is a real escalation vector, not a graph artefact. The remediation is identity-tiering, not detection on the workstation.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
      "CORRECT - remove the dangerous ACLs, enforce tiering, audit who in Helpdesk can start the path.",
      "WRONG - \"requires Helpdesk credentials\" is exactly the point: Helpdesk credentials are commonly compromised via phishing, and the path is what an attacker does next.",
      "WRONG - granting GenericAll to everyone is the opposite of tiering; it expands the attack surface catastrophically.",
      "WRONG - the path is exploitable through legitimate Helpdesk credentials; an EDR agent does not remove the privilege relationship."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1484',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Johannesburg-based insurer runs BloodHound and finds that the shortest path to Domain Admin is four hops through a service account that has unconstrained delegation on a print server. What is the most defensible first action?',
    [
      "Disable the print server and reimage it — print servers are low-value targets and the delegation is a residual legacy configuration",
      "Remove the unconstrained delegation from the service account, rotate its credentials, and audit what other services depend on it before restoring any of those dependencies",
      "Leave the delegation in place but add monitoring for authentication events involving the print server",
      "Restrict the print server to a separate VLAN — network segmentation removes the attack path without touching the service account"
    ],
    1,
    'Unconstrained delegation on a print server is a classic privilege escalation path — an attacker who compromises the print server can impersonate any user who authenticates to it, including Domain Admins. The fix is removing the delegation and understanding what depends on it, not reimaging or segmenting.',
    'privilege_escalation',
    45,
    {
      distractor_rationale: [
      "WRONG - reimaging the print server does not remove the delegation from the service account; the delegation follows the account.",
      "CORRECT - remove the delegation, rotate credentials, audit dependencies before restoring.",
      "WRONG - monitoring detects the exploit after the fact; it does not remove the delegation that enables it.",
      "WRONG - VLAN segmentation helps but does not remove the delegation privilege; an attacker who reaches the print server on any path can still exploit it."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1558',
      rotation_bucket: 'privilege_escalation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Lagos-based fintech runs a Kerberoasting test on its AD environment. Three service accounts have SPNs and passwords that were set four years ago. The test extracts all three hashes in under 5 minutes. What is the most defensible remediation?',
    [
      "Set the password policy to require a new password every 30 days for all service accounts",
      "Disable Kerberos entirely and switch authentication to NTLM for the affected accounts",
      "Rotate the passwords to 30+ character random values stored in a managed service account (gMSA), remove SPNs that are no longer required, and audit which accounts can request service tickets",
      "Delete the three service accounts and reinstall the applications they support"
    ],
    2,
    'Kerberoasting exploits weak service-account passwords by extracting the hash and cracking offline. Rotating to a 30+ character random password stored in a gMSA removes the crackability, and removing unused SPNs reduces the target set. Disabling Kerberos or deleting the accounts are disproportionate.',
    'privilege_escalation',
    45,
    {
      distractor_rationale: [
      "WRONG - forced rotation every 30 days does not help if the passwords are short or predictable; the hash is still crackable.",
      "WRONG - disabling Kerberos and switching to NTLM is a security downgrade; NTLM is weaker than Kerberos and does not fix the underlying problem.",
      "CORRECT - gMSA with a 30+ character password removes crackability; removing unused SPNs reduces the attack surface; auditing requestors closes the discovery step.",
      "WRONG - deleting the service accounts breaks the applications; the fix is to secure the accounts, not remove them."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1558.003',
      rotation_bucket: 'privilege_escalation',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian government agency detects a pass-the-hash attack: an attacker is using a stolen NTLM hash to authenticate to multiple servers. The SOC isolates one server but the attacker is still authenticating to others. What is the most defensible next action?',
    [
      "Force a password reset for the compromised user account — pass-the-hash requires the password to be known",
      "Reboot all servers on the network to clear any cached credentials",
      "Change the domain administrator password — this invalidates all hashes immediately",
      "Disable the compromised account, revoke all active sessions, identify which servers accepted the hash, and isolate those servers pending investigation"
    ],
    3,
    'Pass-the-hash does not require the password — it uses the NTLM hash directly. Disabling the account stops new authentications but does not revoke sessions the attacker already has. The correct response is to disable the account, revoke sessions, and isolate every server where the hash was accepted.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
      "WRONG - pass-the-hash uses the hash, not the password; changing the password does not invalidate the hash in the attacker cache.",
      "WRONG - rebooting servers does not clear credentials on the attacker side; it disrupts operations without containing the attack.",
      "WRONG - changing the DA password helps only for the DA account; it does not address the compromised user hash in use.",
      "CORRECT - disable the account, revoke sessions, isolate the servers that accepted the hash."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Rundu-based clinic\'s IT manager wants to reduce the AD attack surface but has no budget. What is the most defensible set of free/low-cost actions?',
    [
      "Purchase a commercial AD monitoring tool — free tools cannot detect attack paths",
      "Implement Local Administrator Password Solution (LAPS), remove Domain Users from the local Administrators group on workstations, and enable Windows Defender Credential Guard where the hardware supports it",
      "Disable all service accounts and require all users to use their own account for services",
      "Move all AD services to a cloud provider — cloud AD is immune to BloodHound attacks"
    ],
    1,
    'LAPS is free, removing Domain Users from local Administrators is a configuration change, and Credential Guard is available on Windows 10/11 Enterprise. All three reduce the attack surface without budget. Commercial tools, disabling service accounts, and cloud migration are not low-cost/immediate fixes.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
      "WRONG - free tools like PingCastle and BloodHound Community Edition detect attack paths; the claim that only commercial tools work is false.",
      "CORRECT - LAPS, removing Domain Users from local admins, and Credential Guard are all free/low-cost and materially reduce the attack surface.",
      "WRONG - service accounts are required for services to run; disabling them breaks operations.",
      "WRONG - cloud AD (Entra ID) is a different attack surface, but hybrid AD still has BloodHound paths; migrating does not eliminate them."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Nairobi-based bank runs BloodHound and finds that 14 Domain Users have direct paths to Tier-0 resources through group nesting. What is the most defensible first action?',
    [
      "Remove all 14 users from the groups immediately — the paths are critical and any delay is unacceptable",
      "Leave the paths in place but add monitoring for any Tier-0 access by these users",
      "Map which groups the 14 users actually need for their roles, reduce the nesting that creates the paths, and communicate with the affected managers before making changes",
      "Move the 14 users to a separate OU so the paths no longer show in BloodHound"
    ],
    2,
    'The correct first action is to understand which paths are legitimate (users who need the access) and which are excess (nesting that was never intentional). Removing without analysis breaks legitimate workflows. Moving OUs does not break privilege relationships — the path remains, it is just hidden from the default BloodHound view.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
      "WRONG - removing all 14 immediately will break legitimate access and cause operational disruption; analysis must precede removal.",
      "WRONG - monitoring detects the exploit after the fact; the path is still there.",
      "CORRECT - map actual need, reduce excess nesting, communicate with managers before changes.",
      "WRONG - moving OUs does not break privilege paths; the group nesting still exists."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Windhoek-based SME\'s domain controller has NTLM authentication enabled for backward compatibility with an old application. The security team wants to disable NTLM but the application owner says it will break. What is the most defensible approach?',
    [
      "Disable NTLM immediately — the security risk outweighs any application that depends on it",
      "Leave NTLM enabled permanently — backward compatibility for the application is more important than the risk",
      "Switch all authentication to a third-party product — this removes the NTLM problem entirely",
      "Audit which accounts and services actually use NTLM, upgrade or replace the legacy application to support Kerberos, then disable NTLM in stages with monitoring for authentication failures"
    ],
    3,
    'Disabling NTLM is the right end state, but doing it immediately breaks the application. The defensible path is audit, upgrade, staged disable, and monitoring — the same discipline as any legacy security removal.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
      "WRONG - disabling NTLM immediately without knowing what depends on it will break the application and other integrations you did not know existed.",
      "WRONG - leaving NTLM enabled permanently accepts the risk indefinitely; the goal is to remove it, not ignore it.",
      "WRONG - third-party authentication products may still use NTLM internally; the protocol problem is not removed by product substitution.",
      "CORRECT - audit, upgrade, staged disable, monitoring; the discipline for removing any legacy protocol."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A SOC analyst sees an alert for a successful Kerberos authentication from a user account that was disabled 40 minutes earlier. What is the most defensible interpretation?',
    [
      "The authentication is likely a golden ticket or a forged Kerberos ticket using a stolen krbtgt hash — the disabled account is still trusted by the domain",
      "The alert is a false positive — disabled accounts cannot authenticate",
      "The account was re-enabled by IT without the alert being updated; check the change log",
      "The user is on a legacy system that does not check the disabled flag; close the alert"
    ],
    0,
    'A disabled account that authenticates successfully is one of the strongest indicators of a forged ticket. The krbtgt hash is the domain-wide ticket-granting key; an attacker who has it can forge tickets for any account, including disabled ones. This is a golden ticket alert and requires immediate escalation.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
      "CORRECT - disabled account authenticating is a golden ticket indicator; escalate immediately and consider krbtgt reset.",
      "WRONG - the alert is real; disabled accounts should not authenticate, and the successful authentication is the anomaly.",
      "WRONG - checking the change log is reasonable but should not delay escalation; the more likely explanation is a forged ticket.",
      "WRONG - legacy systems do check the disabled flag for Kerberos; this interpretation is not supported by AD behaviour."
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1558.001',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian bank wants to prevent pass-the-hash attacks. Which control has the highest impact?',
    [
      "Deploying a new endpoint detection agent on all workstations — EDR detects pass-the-hash tools",
      "Requiring all users to change their passwords every 30 days",
      "Enforcing a tiered admin model where Domain Admin credentials are only used on Tier-0 systems, combined with Credential Guard on all admin workstations",
      "Disabling NTLM across the domain without any migration path"
    ],
    2,
    'Pass-the-hash is prevented by ensuring the hash never reaches a system the attacker can access. Tiered admin + Credential Guard means DA credentials are only entered on systems designed to protect them, and Credential Guard prevents hash extraction from LSASS.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
      "WRONG - EDR can detect pass-the-hash tools but does not prevent the technique; the hash still works if the attacker avoids the tool.",
      "WRONG - forced rotation does not prevent pass-the-hash; the hash of the new password is still crackable and reusable.",
      "CORRECT - tiered admin + Credential Guard prevents the hash from being exposed where the attacker can reach it.",
      "WRONG - disabling NTLM immediately breaks applications; the disciplined path is audit and migration, not wholesale disable."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A BloodHound scan shows that all Tier-0 Domain Admins have active sessions on user workstations. What is the most defensible interpretation and remediation?',
    [
      "The finding is benign — Domain Admins need to log into workstations to do their job",
      "The finding is a BloodHound bug — DA sessions should not appear on workstations",
      "The finding can be resolved by adding MFA to the workstations — MFA prevents credential theft",
      "The finding is critical: an attacker who compromises any workstation can capture Domain Admin credentials from memory. Remediation is enforcing tiered admin where DA credentials never touch user workstations"
    ],
    3,
    'DA sessions on workstations mean the DA credentials are exposed to any attacker who compromises the workstation — this is exactly how many major breaches escalate. Tiered admin (DA credentials only on Tier-0 systems) prevents the exposure. MFA on workstations does not prevent credential extraction from memory.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
      "WRONG - DA sessions on workstations are one of the top privilege escalation paths in real breaches; the finding is not benign.",
      "WRONG - BloodHound accurately reports sessions; it is not a bug.",
      "WRONG - MFA on the workstation protects the login, not the in-memory credentials after login; extraction from LSASS is unaffected.",
      "CORRECT - an attacker on any workstation with a DA session can extract DA credentials; tiered admin is the fix."
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Walvis Bay logistics company has AD audit logs but no alerting on Kerberos anomalies. The CISO asks whether this is acceptable given the risk of Kerberoasting and golden ticket attacks. What is the most defensible answer?',
    [
      "Not acceptable — Kerberos anomalies should be alerted in near-real-time, with specific detections for SPN ticket requests, RC4 encryption usage, and disabled accounts authenticating",
      "Acceptable — the logs are collected and reviewed quarterly, which is sufficient for a company of this size",
      "Acceptable — Kerberoasting and golden ticket attacks are rare in African SMEs and the cost of alerting is not justified",
      "Not acceptable — but the fix is to disable Kerberos entirely and rely on NTLM"
    ],
    0,
    'Kerberos attacks are detectable through specific signals (unusual SPN ticket requests, RC4 downgrade, disabled account success). Quarterly log review means the attack has hours-to-days to operate. Near-real-time alerting on these signals is the minimum for a company that has AD.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
      "CORRECT - near-real-time alerting on the specific signals that indicate Kerberos attacks is the minimum standard.",
      "WRONG - quarterly review means an attack can operate for up to 90 days undetected; this is not acceptable for the risk.",
      "WRONG - African SMEs are targeted; the assumption that these attacks are rare is not supported by the threat landscape.",
      "WRONG - disabling Kerberos and relying on NTLM is a security downgrade; NTLM is weaker and does not address the problem."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1558',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-16'
    }
  ),

  q(
    'A Namibian SME wants to run a BloodHound scan to understand its AD attack surface. The IT manager asks what to do with the results. What is the most defensible answer?',
    [
      "Archive the results for compliance purposes — the scan itself satisfies the risk assessment requirement",
      "Use the results to prioritise the highest-impact remediation steps: remove the shortest paths to Tier-0, reduce privilege nesting, and enforce tiering before chasing every finding",
      "Share the raw graph with all staff so everyone understands the attack surface",
      "Run the scan quarterly but do not act on the results until the next year budget cycle"
    ],
    1,
    'BloodHound results are most useful for prioritisation. The shortest paths to Tier-0 are the highest-leverage fixes; everything else is secondary. Archiving without action, sharing raw graphs, and waiting for budget are the three failure modes.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
      "WRONG - archiving without action does not reduce the attack surface; the finding is only useful if it drives remediation.",
      "CORRECT - prioritise by path length to Tier-0, reduce privilege nesting, enforce tiering; everything else is secondary.",
      "WRONG - sharing raw AD graphs with all staff exposes the attack surface; it is a security risk, not an awareness tool.",
      "WRONG - waiting for the next budget cycle leaves the attack paths open for a year; the highest-impact fixes are often configuration changes with no budget cost."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1484',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-16'
    }
  )
],
    60: [
        q(
            "Pass-the-Hash occurs after a Domain Admin touches a helpdesk PC. What is the direct cloud security analogue to teach executive stakeholders?",
            [
                "There is no conceptual analogue between cloud and on-premises environments",
                "Stolen session and refresh tokens require short-lived credentials and step-up auth",
                "Only physical hardware USB security risks remain relevant in modern cloud stacks",
                "Traditional antivirus signatures completely replace the need for identity security"
            ],
            1,
            "Session token theft in cloud environments is the direct modern analogue to Pass-the-Hash credential reuse.",
            "pth",
            40,
            {
                distractor_rationale: [
                    "WRONG — clear conceptual analogues exist between on-prem credential reuse and cloud token theft.",
                    "CORRECT — cloud session token theft mirrors traditional Pass-the-Hash attacks closely.",
                    "WRONG — physical USB risks do not cover cloud identity session dynamics.",
                    "WRONG — antivirus signatures do not mitigate cloud identity token misuse."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1539",
                rotation_bucket: "pth",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "What represents the most durable architectural mitigation against Pass-the-Hash exploitation classes in Active Directory?",
            [
                "Enforcing longer user account passwords across all standard organizational units",
                "Deploying a tiered admin model and PAWs so admin credentials never touch dirty hosts",
                "Disabling the Kerberos authentication protocol entirely across domain controllers",
                "Permitting Domain Admin logon sessions on every employee laptop for operational ease"
            ],
            1,
            "Implementing Privileged Access Workstations and a tiered administrative model prevents credential harvesting on dirty endpoints.",
            "tiering",
            40,
            {
                distractor_rationale: [
                    "WRONG — longer passwords do not prevent hash harvesting from workstation memory.",
                    "CORRECT — tiered administration and PAWs stop privileged credentials from landing on unsecure hosts.",
                    "WRONG — disabling Kerberos breaks core Windows domain functionality.",
                    "WRONG — allowing DA logons on user laptops guarantees credential theft."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1003.002",
                rotation_bucket: "tiering",
                last_validated: "2026-11-12"
            }
        )
    ],
    70: [
        q(
            "High-entropy DNS subdomain labels appearing every 45 seconds from a single workstation indicate what primary hypothesis?",
            [
                "Normal background Active Directory replication and global catalog traffic",
                "Possible DNS tunneling and covert command-and-control channel communication",
                "Routine enterprise software license verification checks with vendor portals",
                "Standard web browser bookmark synchronization across user profile shares"
            ],
            1,
            "High-entropy labels combined with regular query cadences strongly suggest covert DNS tunneling activity.",
            "dns_tunnel",
            40,
            {
                distractor_rationale: [
                    "WRONG — AD replication uses standard low-entropy SRV and LDAP queries, not high-entropy labels.",
                    "CORRECT — high-entropy query patterns and fixed timing indicate covert DNS tunneling channels.",
                    "WRONG — license checks utilize standard HTTP/HTTPS endpoints rather than high-entropy DNS.",
                    "WRONG — bookmark sync operates via encrypted cloud web protocols."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1071.004",
                rotation_bucket: "dns_tunnel",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Which control most effectively reduces DNS tunneling success without disrupting legitimate business operations?",
            [
                "Blocking all outbound and inbound user DNS traffic permanently across gateways",
                "Internal recursive resolvers with logging, pattern sinkholing, and EDR correlation",
                "Instructing corporate employees to type internet web domain names significantly slower",
                "Restricting security monitoring and traffic logging exclusively to network port 443"
            ],
            1,
            "Centralized recursive resolvers, comprehensive logging, and EDR telemetry correlation provide visibility without blind blocking.",
            "dns_tunnel",
            40,
            {
                distractor_rationale: [
                    "WRONG — blocking all DNS traffic breaks enterprise internet name resolution entirely.",
                    "CORRECT — recursive logging, sinkholing, and EDR correlation detect tunneling while preserving business DNS.",
                    "WRONG — typing speed has no technical impact on automated DNS tunneling tools.",
                    "WRONG — monitoring only port 443 leaves DNS (port 53) completely unmonitored."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1071.004",
                rotation_bucket: "dns_tunnel",
                last_validated: "2026-11-12"
            }
        )
    ],
    84: [
        q(
            "Why is mapping security toolmark findings to ATT&CK technique identifiers valuable in reporting?",
            [
                "It automatically applies software patches to vulnerable enterprise servers",
                "It provides a shared operational language for coverage gaps, purple tests, and funding",
                "It completely replaces the need for continuous security event log collection",
                "It serves as a marketing framework intended solely for red team engagement teams"
            ],
            1,
            "ATT&CK provides a standardized operational vocabulary for assessing detection coverage, planning tests, and justifying budgets.",
            "attack",
            35,
            {
                distractor_rationale: [
                    "WRONG — technique mapping does not perform automated server patch management.",
                    "CORRECT — ATT&CK offers a standardized taxonomy for tracking coverage and communicating with leadership.",
                    "WRONG — framework mapping does not replace event log ingestion requirements.",
                    "WRONG — ATT&CK is utilized extensively by blue teams, engineers, and executives."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1584",
                rotation_bucket: "attack",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "After mapping detection rules, you discover technique T1003 is fully covered while T1071 is completely blind. What is the best purple team follow-up step?",
            [
                "Conceal the detection blind spot from executive leadership reports to avoid scrutiny",
                "Emulate the blind technique safely under ROE, measure MTTD, and fund the gap",
                "Permanently delete the MITRE ATT&CK reference matrix from your engineering wiki",
                "Focus future security awareness training modules exclusively on email phishing"
            ],
            1,
            "Identifying blind spots should prompt safe emulation testing, metric measurement, and targeted funding to close the gap.",
            "attack",
            40,
            {
                distractor_rationale: [
                    "WRONG — concealing blind spots leaves the organization exposed to undetected attacks.",
                    "CORRECT — safely emulating blind techniques and measuring detection times drives effective security investment.",
                    "WRONG — deleting reference documentation hides reality rather than fixing gaps.",
                    "WRONG — limiting training to phishing ignores other critical attack vectors."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1071",
                rotation_bucket: "attack",
                last_validated: "2026-11-12"
            }
        )
    ],
    95: [
        q(
            "A purple team week reveals LSASS memory dumping was missed while phishing was detected in 4 minutes. Where should engineering sprint focus be directed?",
            [
                "Allocate 100% of sprint resources to further polish the already effective phishing rule",
                "Close credential-theft and covert-channel blind spots, validating with re-emulation proof",
                "Conceal the missed memory dumping finding from future internal compliance reports",
                "Purchase random security software tools without reviewing operational metrics"
            ],
            1,
            "Sprint capacity must prioritize closing dangerous defensive blind spots backed by empirical re-emulation validation.",
            "purple",
            40,
            {
                distractor_rationale: [
                    "WRONG — over-optimizing already effective controls ignores critical uncovered blind spots.",
                    "CORRECT — focusing engineering effort on closing validated detection gaps improves overall posture.",
                    "WRONG — concealing findings undermines the purpose of purple team validation.",
                    "WRONG — buying random tools without metric backing wastes budget."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1003.001",
                rotation_bucket: "purple",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "What defines the most effective purple team success criterion for executive leadership evaluation?",
            [
                "Achieving a higher volume of presentation slide decks than produced last year",
                "Demonstrating technique detection and containment within agreed SLAs on retest",
                "Ensuring the red team engineering personnel win every simulated engagement test",
                "Maintaining zero documentation records regarding testing activities or findings"
            ],
            1,
            "Measurable, retestable detection and containment outcomes within established SLAs provide concrete proof of security value.",
            "purple",
            35,
            {
                distractor_rationale: [
                    "WRONG — slide deck counts measure administrative output rather than security progress.",
                    "CORRECT — proving technique detection and containment on retest demonstrates tangible defensive growth.",
                    "WRONG — measuring success by red team wins treats security as a game rather than risk reduction.",
                    "WRONG — lacking documentation prevents tracking remediation progress."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1562",
                rotation_bucket: "purple",
                last_validated: "2026-11-12"
            }
        )
    ]
};

const TIER_A_ESSAYS = {
    1: [
  {
    question: 'You are the IT lead at a 10-person Namibian accounting firm in Windhoek. Three staff members have received a phishing email that looks like a legitimate invoice from a client. The email contains a link to a fake login portal. One staff member clicked the link but says they did not enter their password. Write an incident report to the firm partner: what happened, what you verified, what you contained, and what you recommend for the next 30 days.',
    guidelines: 'This is a credential-harvesting incident. Your report should distinguish between "clicked but did not enter credentials" and "entered credentials" — the containment differs. Name the specific controls you applied.',
    rubric: [
      { criterion: 'Distinguishes clicked-link from entered-credentials risk', points: 2, evidence_required: 'States clearly that clicking alone does not compromise the account, but entering credentials does; containment differs accordingly' },
      { criterion: 'Names specific containment actions', points: 2, evidence_required: 'Mentions session revocation (not just password reset), MFA status check, and review of sign-in logs for the affected account' },
      { criterion: 'Identifies the phishing mechanism', points: 2, evidence_required: 'Names the technique (T1566.002 spearphishing link, or credential harvesting via proxy) and explains why the portal looked real' },
      { criterion: 'Provides evidence of what was preserved', points: 2, evidence_required: 'Mentions the email headers, original URL, screenshot, and sign-in logs' },
      { criterion: 'Recommends specific 30-day improvements', points: 2, evidence_required: 'At least three concrete actions (e.g., phishing-resistant MFA rollout, email gateway rule, staff reporting drill) with an owner and date' }
    ]
  },
  {
    question: 'A staff member at your Rundu office forwards you an email that claims to be from the company bank, saying "your business account has been flagged for suspicious activity — click here to verify." The email uses the correct bank logo, the correct greeting name, and the sender address looks like the bank. Write the response you would send back to the staff member: what to do, what not to do, and what they should watch for in future messages like this.',
    guidelines: 'This is a user-facing response — the tone should be respectful and educational, not accusatory. It should teach the specific pattern, not just "be careful."',
    rubric: [
      { criterion: 'Tells the user not to click, and why', points: 2, evidence_required: 'States clearly that the link leads to a credential harvester or proxy and that clicking alone can expose them' },
      { criterion: 'Explains the specific indicators without blaming', points: 2, evidence_required: 'Names at least three indicators (sender domain, link destination, urgency, generic greeting) and explains why they matter' },
      { criterion: 'Names the correct channel to verify with the bank', points: 2, evidence_required: 'States that the bank should be contacted via its published phone number or app — not a link or number from the email' },
      { criterion: 'Provides a reporting path that preserves evidence', points: 2, evidence_required: 'States how to forward the email to IT/security with original headers intact, without deleting it' },
      { criterion: 'Gives one forward-looking habit', points: 2, evidence_required: 'Provides one specific habit (e.g., "always navigate to your bank via bookmark, never via email") rather than a general "stay safe"' }
    ]
  },
  {
    question: 'A junior staff member reports a suspicious email to you. When you examine it, you notice the sender domain is `@supplier-name.com` but the legitimate supplier is `@supplier.com.na`. The email body is an invoice with a PDF attachment. Write an incident triage note: what the attack is, what evidence to preserve, what to check across the rest of the organisation, and what to do about the attached PDF.',
    guidelines: 'This is a triage note — the audience is your security team or your manager. Specific technical detail is expected. The note should be short enough to act on.',
    rubric: [
      { criterion: 'Correctly identifies the lookalike domain pattern', points: 2, evidence_required: 'Names the attack as lookalike-domain BEC or T1566.002 spearphishing, and explains why the difference is significant (`.com.na` vs `.com`)' },
      { criterion: 'Explains what to preserve', points: 2, evidence_required: 'Mentions the email headers (full message source, not just the body), sender IP, and the PDF file hash' },
      { criterion: 'Recommends organisation-wide check', points: 2, evidence_required: 'States that the same sender should be searched across all mailboxes, and that any delivered messages should be quarantined' },
      { criterion: 'Explains what to do with the PDF', points: 2, evidence_required: 'States that the PDF should not be opened on a production machine; it should be analysed in a sandbox or by an incident response team' },
      { criterion: 'Recommends a gateway rule or block', points: 2, evidence_required: 'States that the sender domain should be blocked at the gateway, and that any similar domains should be monitored' }
    ]
  },
  {
    question: 'A staff member received a text message from a number claiming to be their line manager, asking them to urgently buy gift cards for a "client appreciation" and to send the codes. They did not comply, but they reported it. Write the internal security bulletin that you would send to the whole company. It should warn staff without spreading panic, and it should teach them what to do if they receive something similar.',
    guidelines: 'This is a communication exercise. The bulletin should be specific enough that staff recognise the pattern, but not alarmist. It should also reinforce that reporting is a good thing, not a mistake.',
    rubric: [
      { criterion: 'Names the attack pattern accurately', points: 2, evidence_required: 'Identifies the attack as gift-card fraud or BEC impersonation, and explains the pressure tactic (authority + urgency)' },
      { criterion: 'Provides a specific rule staff can follow', points: 2, evidence_required: 'States that gift-card requests from executives are always fraudulent, and that any such request should be reported' },
      { criterion: 'Reinforces that reporting is positive', points: 2, evidence_required: 'Thanks the reporter, states that reporting protects the whole company, and does not frame the report as a mistake' },
      { criterion: 'Names the correct verification channel', points: 2, evidence_required: 'States that the "manager" should be verified through the internal directory or a known channel, not by replying to the SMS' },
      { criterion: 'Provides a clear reporting path', points: 2, evidence_required: 'Names the specific reporting mechanism (IT ticket, phishing plugin, or a named person) and what to include in the report' }
    ]
  },
  {
    question: 'You are reviewing the firm\'s phishing defences for a meeting with the managing partner. Current state: no phishing-resistant MFA, staff reporting rate is 40%, IT response time to reported phishing is 4 hours. The partner asks: "What is the one change that would most reduce our risk?" Write the memo: state the recommendation, justify it with evidence, name the trade-offs, and explain how you would measure success.',
    guidelines: 'This is a business case — the partner wants a decision, not a lecture. The recommendation should be specific and defensible with a clear success metric.',
    rubric: [
      { criterion: 'Recommends phishing-resistant MFA (or equivalent structural control)', points: 2, evidence_required: 'Names a specific structural control (passkeys, FIDO2, hardware tokens) rather than "more training"' },
      { criterion: 'Justifies with a specific attack it prevents', points: 2, evidence_required: 'Explains that OTP and password-based defences are defeated by AiTM and proxy phishing; phishing-resistant MFA is the control that survives' },
      { criterion: 'Names trade-offs honestly', points: 2, evidence_required: 'Mentions at least two trade-offs (cost, user training, hardware tokens, legacy system support) with a realistic assessment' },
      { criterion: 'Provides measurable success criteria', points: 2, evidence_required: 'Names specific metrics (e.g., "successful AiTM against the firm drops to 0 per quarter", "reported-phishing response time under 30 min")' },
      { criterion: 'Sequences the rollout with owners and dates', points: 2, evidence_required: 'Provides at least three concrete implementation steps with named owners and a 30/60/90-day timeline' }
    ]
  }
],
    7: [
  {
    question: 'You are the finance lead at a 12-person Namibian logistics SME in Walvis Bay. A WhatsApp voice message arrives from someone claiming to be the company director, asking you to release an urgent supplier payment of N$180,000 before close of business. The voice sounds exactly like the director. The director is currently travelling in South Africa and is not reachable by phone. Write a one-page memo to the operations manager explaining what you will do next, why, and what evidence you will preserve for the audit trail.',
    guidelines: 'Focus on verification through a channel the attacker does not control. Name the specific risk (voice-cloning/BEC). Give concrete steps with owners and a timeline. Do not write generic "verify before paying" advice.',
    rubric: [
      { criterion: 'Names the attack type correctly', points: 2, evidence_required: 'Identifies voice cloning or BEC impersonation as the specific risk — not just "fraud"' },
      { criterion: 'Identifies verification through a known channel', points: 2, evidence_required: 'Names a callback on the directory number or a pre-agreed challenge phrase, not WhatsApp itself' },
      { criterion: 'Explains why the channel matters', points: 2, evidence_required: 'States that any channel the attacker can reach (WhatsApp, email, SMS) is compromised by default' },
      { criterion: 'Specifies what evidence to preserve', points: 2, evidence_required: 'Mentions the audio message, timestamp, sender number, WhatsApp metadata, and any subsequent attempts' },
      { criterion: 'Provides a defensible decision with escalation', points: 2, evidence_required: 'States clearly that payment is withheld until verification, and names who else is informed (operations manager, director on return)' }
    ]
  },
  {
    question: 'During a Microsoft Teams meeting, the CFO (who has never met you in person) asks you to approve a N$2.4 million supplier payment and to skip the standard dual-approval because "it is an emergency and the supplier is threatening legal action." You have been with the company for 3 weeks. The video is high quality but the CFO\'s voice occasionally sounds metallic on high notes. Write your response: what you will say in the meeting, what you will do immediately after, and how you will explain the decision to your manager.',
    guidelines: 'This is both a deepfake test and an authority-pressure test. Your response should demonstrate that you can refuse a senior request without accusing them of being fake, and that you have a procedural path to verify.',
    rubric: [
      { criterion: 'In-meeting response defers without accusing', points: 2, evidence_required: 'States a procedural deferral (e.g., "I will need to run this through the normal approval process") rather than a direct "you might be a deepfake"' },
      { criterion: 'Post-meeting verification through independent channel', points: 2, evidence_required: 'Names a specific known-directory callback or internal channel, not a number or email provided during the meeting' },
      { criterion: 'Recognises the dual-control bypass as the real risk', points: 2, evidence_required: 'Explains that the bypass is the control being attacked, not just an inconvenience' },
      { criterion: 'Explains the decision without accusing senior leadership', points: 2, evidence_required: 'Frames the verification as "protecting the CFO\'s authority" or "preserving the audit trail" rather than "I thought you were fake"' },
      { criterion: 'Names what evidence is preserved', points: 2, evidence_required: 'Mentions the meeting recording, meeting metadata, the payment request itself, and the callback attempt' }
    ]
  },
  {
    question: 'Your Windhoek-based construction firm receives an email from a long-standing supplier saying their bank account has changed and the next invoice should be paid to the new account. The email is signed by the usual account manager, the PDF letterhead looks authentic, and the previous three invoices match the format. Write the internal procedure that your accounts payable team should follow before any bank change is accepted. Name the specific controls that prevent this attack.',
    guidelines: 'This is a real-world BEC scenario. Your procedure should be operational, auditable, and enforceable — not a policy statement. Every control should be specific enough that an auditor can check whether it was followed.',
    rubric: [
      { criterion: 'Requires callback to a pre-established vendor number', points: 2, evidence_required: 'States that the callback must use a number from the ERP/vendor master, not one in the email or PDF' },
      { criterion: 'Requires approval by at least two roles', points: 2, evidence_required: 'Names specific roles (e.g., AP clerk + finance manager) and states that the person making the request cannot approve it' },
      { criterion: 'Requires a documented change request with evidence', points: 2, evidence_required: 'States what is recorded: callback date/time, who called, who was spoken to, verification outcome, and who approved the change' },
      { criterion: 'Explains why letterhead and signature are not verification', points: 2, evidence_required: 'States explicitly that PDFs, logos, and email signatures are trivially forgeable and do not establish identity' },
      { criterion: 'Provides a post-change audit check', points: 2, evidence_required: 'States that the first payment after a bank change is reviewed by a second person before release' }
    ]
  },
  {
    question: 'A junior helpdesk analyst receives a phone call from someone claiming to be the CEO, demanding an immediate password reset because they are locked out before an investor briefing. The caller becomes aggressive when asked to verify. Write the procedure the helpdesk should follow, the specific words the analyst should use to refuse without escalating, and the escalation path if the caller becomes abusive.',
    guidelines: 'The procedure needs to be so clear that a first-week analyst can follow it. The script needs to be respectful and firm — not "sorry, I can\'t" — and it needs to hold up under pressure.',
    rubric: [
      { criterion: 'Provides a specific refusal script', points: 2, evidence_required: 'Includes exact wording that names the verification requirement without accusing the caller' },
      { criterion: 'Specifies the out-of-band verification step', points: 2, evidence_required: 'Names the internal directory callback or a manager verification — not the number the caller provides' },
      { criterion: 'Names the escalation path if caller becomes abusive', points: 2, evidence_required: 'States who the analyst notifies (helpdesk lead, security team) and what is logged' },
      { criterion: 'Explains why executive title does not override procedure', points: 2, evidence_required: 'States clearly that authority does not bypass identity verification and that the procedure protects the executive' },
      { criterion: 'Documents what is preserved', points: 2, evidence_required: 'Mentions the call log, caller number, time, and any subsequent attempts, and that this is reported to security' }
    ]
  },
  {
    question: 'Design a 45-minute tabletop exercise for a 20-person Namibian professional services firm. The scenario: an employee receives a WhatsApp voice note from a "client" asking them to urgently forward an invoice to a new bank account. Design the exercise: the injects (what happens at each stage), the roles (who does what), the decision gates (when a decision is required), and the scoring rubric that distinguishes a good response from a lucky one.',
    guidelines: 'This is a design exercise — the rubric should score the quality of the tabletop, not the participants. Score what the exercise reveals: whether verification procedures exist, whether escalation paths are known, whether authority pressure is recognised.',
    rubric: [
      { criterion: 'Provides a coherent inject sequence', points: 2, evidence_required: 'At least three timed injects that escalate realistically (initial request → time pressure → confusion or escalation)' },
      { criterion: 'Assigns specific roles', points: 2, evidence_required: 'Names the roles present (finance, manager, IT/security, communications) and what each is expected to do' },
      { criterion: 'Identifies decision gates', points: 2, evidence_required: 'Names at least two moments where the team must decide, and what information is missing at those moments' },
      { criterion: 'Scoring rubric distinguishes good from lucky', points: 2, evidence_required: 'The rubric scores process (who was called, what was verified, what was logged) rather than outcome (whether the payment was withheld)' },
      { criterion: 'Debrief identifies procedural gaps and next steps', points: 2, evidence_required: 'States what to do after the exercise: update the procedure, retrain, rerun in 90 days' }
    ]
  }
],
    8: [
  {
    question: 'You are the incident commander at a mid-sized Namibian insurance company. Ransomware is actively encrypting files on the policy administration server. The CEO wants a public statement within the hour. Legal wants a breach notification assessment within 72 hours. The insurer is asking whether the ransom is covered. The technical team estimates containment is 45 minutes away. Write the first 60 minutes of your incident command log: what you do, in what order, and why.',
    guidelines: 'This is a prioritisation exercise under conflicting demands. The right answer is not "do everything" — it is "do the right thing in the right order, and document why the other demands wait."',
    rubric: [
      { criterion: 'Contains spread before anything else', points: 2, evidence_required: 'States that isolation or shutdown of the affected server is the first action, with the technical lead named' },
      { criterion: 'Preserves evidence before or during containment', points: 2, evidence_required: 'Mentions memory capture, screenshot of the ransom note, and preservation of the encryption trigger artifacts' },
      { criterion: 'Explicitly defers the CEO statement with reasoning', points: 2, evidence_required: 'States that a public statement cannot be issued before facts are confirmed, and names the legal/comms decision point' },
      { criterion: 'Names the 72-hour clock and its trigger', points: 2, evidence_required: 'States clearly that the 72-hour GDPR clock (or equivalent) starts at awareness of a personal data breach, not at containment' },
      { criterion: 'Addresses the insurance notification', points: 2, evidence_required: 'States that the insurer is notified through its published claims channel, not through any email or link received from the attacker' }
    ]
  },
  {
    question: 'The incident commander at a Windhoek-based logistics company has contained a ransomware incident. The attacker is still communicating through a Tor chat window, demanding payment. The CEO wants to know: should the company pay? Write a one-page brief for the CEO that covers the legal considerations, the practical risks of paying, the insurance position, and the recommended course of action.',
    guidelines: 'This is a CEO-level decision. The brief should give a clear recommendation, not a menu of options. It should acknowledge uncertainty honestly.',
    rubric: [
      { criterion: 'Correctly states that payment legality depends on jurisdiction and sanctions', points: 2, evidence_required: 'Names at least two relevant regimes (Namibian law, EU/UK sanctions, OFAC) and does not claim payment is "always illegal" or "always legal"' },
      { criterion: 'Names the practical risks of paying', points: 2, evidence_required: 'Mentions at least two (no guarantee of decryption, funding criminal operations, repeat targeting, sanctions violations) with specifics' },
      { criterion: 'States the insurer position accurately', points: 2, evidence_required: 'Explains that the insurer must authorise the payment decision and that "the insurer will reimburse" is not a safe assumption' },
      { criterion: 'Provides a clear recommendation with conditions', points: 2, evidence_required: 'States the recommended course (e.g., "do not pay unless the insurer confirms coverage and legal clears sanctions") with a condition' },
      { criterion: 'Addresses the decryption alternative', points: 2, evidence_required: 'States that recovery from backups and reimagining is the primary path, with payment as a last resort under specific conditions' }
    ]
  },
  {
    question: 'Your company has experienced a ransomware incident. The technical containment is done, but the scoping is incomplete. The CEO asks you to draft the internal message that will go to all staff at 5pm today. Write the message: what you say, what you do not say, and why the difference matters.',
    guidelines: 'This is an internal communications exercise during an active incident. The message should reassure without speculating, and it should give staff specific actions to take.',
    rubric: [
      { criterion: 'States facts only, no speculation', points: 2, evidence_required: 'The message contains only confirmed facts and does not speculate about scope, cause, or attacker identity' },
      { criterion: 'Gives specific actions staff must take', points: 2, evidence_required: 'Names concrete actions (do not power off, do not open files, report to IT, do not discuss externally) with clear instructions' },
      { criterion: 'Explains what NOT to do', points: 2, evidence_required: 'States clearly that staff should not discuss the incident on social media or with external parties until authorised' },
      { criterion: 'Explains the tone choice', points: 2, evidence_required: 'States why the message is calm and factual rather than alarming, and why speculation would be damaging' },
      { criterion: 'Names the communication cadence', points: 2, evidence_required: 'States when the next update will be, who will send it, and the channel (email, intranet) — so staff know when to expect information' }
    ]
  },
  {
    question: 'A ransomware incident at your company originated through a compromised vendor. The vendor is a national logistics provider that serves other companies in the same industry. Your incident commander asks: what do we tell the vendor, when, and how? Write the notification plan: what you disclose, what you do not, who signs off, and how you handle the relationship risk.',
    guidelines: 'This is a responsible-disclosure decision during an active incident. The plan must balance evidence-sharing with legal and commercial risk.',
    rubric: [
      { criterion: 'Recommends private notification first', points: 2, evidence_required: 'States that the vendor is notified privately through a known contact before any public statement, with a named owner and timeline' },
      { criterion: 'Names what to disclose and what to withhold', points: 2, evidence_required: 'States that evidence of the compromise path is shared, but the affected vendor\'s customer list is not disclosed without consent' },
      { criterion: 'Names the sign-off path', points: 2, evidence_required: 'States that legal and comms review the notification before it is sent, and that the incident commander approves the technical evidence' },
      { criterion: 'Addresses relationship risk', points: 2, evidence_required: 'States that the notification is framed as a shared threat (not a blame), and that the vendor is offered the opportunity to coordinate the industry response' },
      { criterion: 'Provides a follow-up mechanism', points: 2, evidence_required: 'States that a follow-up call is scheduled within 48 hours, and that both parties agree on what will be said publicly and when' }
    ]
  },
  {
    question: 'Six months after a ransomware incident, the board asks: "How do we know we are better prepared than we were?" Write the brief: what evidence demonstrates readiness, what gaps remain, and what specific investments are needed in the next 12 months.',
    guidelines: 'This is a board-level readiness assessment. The answer should be evidence-based, not a narrative of improvements. Name specific tests and metrics.',
    rubric: [
      { criterion: 'Names specific exercises or tests that prove readiness', points: 2, evidence_required: 'Mentions at least two (restore test, tabletop, red-team exercise) with dates and outcomes' },
      { criterion: 'Provides metrics with before/after comparison', points: 2, evidence_required: 'Names at least two metrics (e.g., MTTD, restore time, phishing-report rate) with baseline and current value' },
      { criterion: 'Names gaps honestly', points: 2, evidence_required: 'States at least two specific gaps that remain (e.g., no EDR on OT network, no immutable cloud backup, no after-hours response)' },
      { criterion: 'Recommends prioritised investments', points: 2, evidence_required: 'Provides a ranked list of three investments with cost estimate and the risk each reduces' },
      { criterion: 'Names the board decision required', points: 2, evidence_required: 'States clearly what decision the board must make (approve budget, accept residual risk, commission independent review) rather than ending with a summary' }
    ]
  }
],
    11: [
  {
    question: 'Your Namibian SME has a backup server that runs nightly to a NAS in the same office. The backup server uses the same domain administrator account as production. Write a risk assessment for the managing director: what specifically is wrong with this setup, what is the specific attack scenario that defeats it, and what minimal changes would materially reduce the risk in the next 30 days.',
    guidelines: 'The MD does not want a full architecture review — they want a specific problem and specific fixes. Name the attacker path, not the abstract vulnerability.',
    rubric: [
      { criterion: 'Names the specific attacker path', points: 2, evidence_required: 'Explains that the same domain admin credential compromise affects both production and backups — the attacker encrypts both in one move' },
      { criterion: 'Identifies the always-online NAS as a target', points: 2, evidence_required: 'States that ransomware encrypts any online backup destination it can reach, and the NAS is reachable via the same network' },
      { criterion: 'Provides three prioritised fixes', points: 2, evidence_required: 'Names at least three specific fixes (off-domain credential, air-gapped/offline backup, immutability) with the order of implementation' },
      { criterion: 'Addresses the 30-day constraint honestly', points: 2, evidence_required: 'Distinguishes what can be done in 30 days (credential separation, offline copy) from what takes longer (immutable cloud storage, tested restore)' },
      { criterion: 'Provides evidence the fix works', points: 2, evidence_required: 'States how success is measured: a restore test from the offline copy succeeds, and a penetration test cannot reach the backup from a compromised admin account' }
    ]
  },
  {
    question: 'Design a restore test plan for a mid-sized Namibian company that has never tested its backups. The plan should be detailed enough that an IT generalist can run it without further guidance. Include what is tested, how the test is isolated from production, what success looks like, and what evidence is recorded.',
    guidelines: 'A restore test that touches production is not a test — it is a production operation. Isolation is the first control.',
    rubric: [
      { criterion: 'Specifies isolation from production before testing', points: 2, evidence_required: 'States that the test environment is network-isolated and uses separate credentials from production' },
      { criterion: 'Names what is tested and why', points: 2, evidence_required: 'Covers at least three: a file restore, a database restore, and a service-level restore (email or application), with reasoning' },
      { criterion: 'Defines success criteria per test', points: 2, evidence_required: 'For each test, names the observable success condition (file opens correctly, database queries succeed, application starts)' },
      { criterion: 'Documents the evidence recorded', points: 2, evidence_required: 'Mentions the backup timestamp, restore timestamp, hash comparison, screenshot, and tester name' },
      { criterion: 'Provides a post-test review step', points: 2, evidence_required: 'States that the plan is updated based on the test findings, and that the next test is scheduled with a specific date' }
    ]
  },
  {
    question: 'Your company\'s backup administrator has both production domain admin credentials and isolated-backup-network credentials. The security team recommends removing production access entirely. Write the operational change plan: what needs to happen so the removal does not break backup operations, and what the risks of the change are.',
    guidelines: 'This is identity tiering — the theory is simple, the operational reality is hard. The plan should name the realistic failure modes.',
    rubric: [
      { criterion: 'Names the operational roles the backup admin needs', points: 2, evidence_required: 'States that a backup-only identity is created with the minimum permissions needed for backup and restore, before production access is removed' },
      { criterion: 'Addresses the emergency fallback risk', points: 2, evidence_required: 'States clearly that without a fully provisioned backup-only identity, the admin will re-use production credentials in an emergency, restoring the exact risk being removed' },
      { criterion: 'Provides a staged transition', points: 2, evidence_required: 'Names at least three transition stages (provision backup-only, run parallel for X weeks, remove production access, verify with a restore test)' },
      { criterion: 'Identifies what could break', points: 2, evidence_required: 'Names at least two things that could break (backup job failure, restore-time access issue) and how to test for each before the change' },
      { criterion: 'Names the sign-off and evidence', points: 2, evidence_required: 'States who approves the removal (security lead, IT director) and what evidence demonstrates the change succeeded (a successful restore test from the backup-only identity)' }
    ]
  },
  {
    question: 'Your company uses a cloud backup provider whose API allows deletion of objects with an API key. The security team recommends enabling object lock. The cloud architect objects that object lock makes normal backup operations harder. Write the memo to the CTO: what is the specific risk, what is the trade-off, and what is your recommendation.',
    guidelines: 'The argument is about a specific control (immutability) versus a specific operational cost. Both are real. The memo should not dismiss the architect\'s concern.',
    rubric: [
      { criterion: 'Names the specific risk that object lock addresses', points: 2, evidence_required: 'States that a compromised API key allows the attacker to delete all backups in the cloud, leaving the company with no recovery path' },
      { criterion: 'Acknowledges the operational cost honestly', points: 2, evidence_required: 'Names the specific operational cost (cannot delete versions during retention window, requires new object lifecycle management)' },
      { criterion: 'Provides a mitigating design', points: 2, evidence_required: 'Proposes a specific mitigation (e.g., short retention window with automated expiry, dedicated bucket for immutable copy, separate account for normal backups)' },
      { criterion: 'Compares to the alternative', points: 2, evidence_required: 'States what happens without object lock: an API-key compromise deletes all backups, and recovery depends on the attacker\'s goodwill or ransom payment' },
      { criterion: 'Provides a clear recommendation with acceptance criteria', points: 2, evidence_required: 'States the recommendation and defines what would change it (e.g., "unless the architect can demonstrate a design where API-key compromise cannot delete backups")' }
    ]
  },
  {
    question: 'Your company\'s full backup is 8 months old with daily incrementals since. Ransomware encrypted production 3 days ago. The CISO asks: "Which backup do we use, and why?" Write the answer: how you determine the recovery point, what you restore first, and what you verify before restoring.',
    guidelines: 'The answer requires determining the point of compromise before deciding on a recovery point. "Most recent backup" is the wrong default.',
    rubric: [
      { criterion: 'Explains why the most recent backup is not automatically safe', points: 2, evidence_required: 'States that the attacker may have been present for days or weeks before encryption, so recent backups may contain the implant' },
      { criterion: 'Names how the compromise point is determined', points: 2, evidence_required: 'Mentions log analysis (authentication, EDR, email) to identify the earliest evidence of attacker activity, before choosing the recovery point' },
      { criterion: 'Defines the recovery point explicitly', points: 2, evidence_required: 'States that the recovery point is the last backup taken before the compromise point, not the most recent one' },
      { criterion: 'Names what to restore first and why', points: 2, evidence_required: 'States that the recovery is staged: identity/infrastructure first, then data, then applications — not all at once' },
      { criterion: 'Names what to verify before restoring to production', points: 2, evidence_required: 'States that the restored environment is verified in isolation before reconnection to production, and that the domain is re-secured before restored servers join it' }
    ]
  }
],
    18: [
  {
    question: 'You are the SOC manager at a Windhoek-based managed security provider. Your night shift handles 900 medium-severity alerts per shift. The previous three shifts closed 40% of tickets as "benign" without investigation. The morning shift lead tells you the team is "just closing noise to survive." Write a one-page memo to the CISO: what is actually happening, what the risk is, and what you will do about it in the next 30 days.',
    guidelines: 'This is a management communication exercise. Name the specific failure mode (alert fatigue → ticket closure without investigation), the specific risk it creates (real incidents hidden in noise), and a specific 30-day plan. Do not write generic "we will improve training" advice.',
    rubric: [
      { criterion: 'Names the failure mode accurately', points: 2, evidence_required: 'Identifies alert fatigue leading to rubber-stamp ticket closure, not "analyst laziness" or "training gap"' },
      { criterion: 'Explains the specific risk it creates', points: 2, evidence_required: 'States that real incidents are now hidden in the noise, and that the SOC cannot distinguish benign from malicious at this closure rate' },
      { criterion: 'Provides a specific 30-day plan with actions', points: 2, evidence_required: 'At least three concrete actions (tune noisiest rules, add enrichment, protect high-fidelity rules, staff adjustment) with owners' },
      { criterion: 'Names what success looks like', points: 2, evidence_required: 'States specific measurable criteria (e.g., "false positive rate under 40%", "every closure above medium severity has investigation notes")' },
      { criterion: 'Acknowledges the resourcing constraint honestly', points: 2, evidence_required: 'States whether additional headcount is needed, and if so, the specific number and role — not "we need more resources" generically' }
    ]
  },
  {
    question: 'A tier-1 SOC analyst is finishing a shift. They have three open investigations: (1) a confirmed phishing report where the user clicked but did not enter credentials, (2) a backup job that fired at an unusual hour and is flagged medium severity, (3) a user accessing files outside their normal department with no other anomaly. Write the handover note the analyst should leave for the next shift. It must be detailed enough that the next analyst can act on each item without re-investigating from scratch.',
    guidelines: 'This is an operational handover document, not a summary. Each of the three items needs: what was checked, what remains uncertain, what the next analyst should do first, and who owns the decision. Do not write "needs follow-up" — that is abdication.',
    rubric: [
      { criterion: 'Handles all three items with equal rigour', points: 2, evidence_required: 'Each of the three investigations has its own paragraph with state-of-knowledge and next action' },
      { criterion: 'Documents what was checked, not just what was found', points: 2, evidence_required: 'For each item, states what the analyst reviewed (logs, user contact, baseline) so the next shift knows what not to repeat' },
      { criterion: 'Names the specific decision the next analyst must make', points: 2, evidence_required: 'For each item, states the specific next decision (escalate or close, isolate or monitor) and the condition that would trigger each' },
      { criterion: 'Names the owner and the deadline', points: 2, evidence_required: 'Each item has a named role (not "the team") and a specific timeframe (by end of shift, within 24 hours)' },
      { criterion: 'Avoids the "needs follow-up" abdication pattern', points: 2, evidence_required: 'No item says "needs follow-up" without a specific action and decision criterion' }
    ]
  },
  {
    question: 'You are a tier-1 SOC analyst at a Johannesburg bank. An alert fires: a service account has successfully authenticated from a new IP range, and 4 minutes later the same account made three RDP connections to different servers. The alert is marked medium severity by the SIEM. Your shift supervisor is in a meeting. Write the escalation message you would send to the SOC lead, and explain what you would do while waiting for a response.',
    guidelines: 'This is an escalation under time pressure with imperfect information. The escalation message should be short, factual, and action-oriented. The interim action should be specific and reversible if the escalation is confirmed benign.',
    rubric: [
      { criterion: 'Identifies the specific compromise chain', points: 2, evidence_required: 'Names the pattern: spray/credential success followed by lateral movement via admin protocol — and does not call it a "network anomaly"' },
      { criterion: 'Provides specific evidence in the escalation', points: 2, evidence_required: 'Includes the account name, source IP range, timestamps, target servers, and the specific alert IDs' },
      { criterion: 'Recommends an interim containment action', points: 2, evidence_required: 'Names a specific reversible action (isolate hosts, revoke sessions) and explains why it is safe if the alert turns out benign' },
      { criterion: 'States what the analyst needs from the SOC lead', points: 2, evidence_required: 'Names the specific decision required (approve isolation, escalate to IR) and the timeframe (within 10 minutes)' },
      { criterion: 'Explains what the analyst will do while waiting', points: 2, evidence_required: 'States specific actions: preserve logs, check other service accounts, notify affected server owners — not "wait for response"' }
    ]
  },
  {
    question: 'A detection rule for credential dumping (T1003) has fired 47 times in 30 days, all against different users. 45 of the 47 alerts were closed as "false positive — legitimate administrative tool." The rule has not been tuned in 18 months. Write the tuning plan: what you will review, what exclusions you will add, what you will keep, and how you will verify the tuned rule still detects the technique.',
    guidelines: 'This is a detection engineering exercise. The plan must preserve the detection for real attacks while removing the noise from a legitimate tool. Exclusions must be specific (not "any process that is signed"), and the verification must be concrete.',
    rubric: [
      { criterion: 'Reviews the closed alerts before tuning', points: 2, evidence_required: 'States that the 45 closed alerts are reviewed to identify the specific legitimate tool and its behaviour pattern' },
      { criterion: 'Proposes specific exclusions, not blanket ones', points: 2, evidence_required: 'Exclusions are scoped by process name, command line, parent process, or user context — not "any signed binary" or "any admin tool"' },
      { criterion: 'Preserves detection for other variants', points: 2, evidence_required: 'States that the rule must still fire if the same technique is used by a different tool or in a different context' },
      { criterion: 'Provides a verification plan', points: 2, evidence_required: 'Names a specific test (red-team replay, manual trigger with a known-malicious tool, or attack simulation) that proves the tuned rule still works' },
      { criterion: 'Addresses the root cause of the 18-month gap', points: 2, evidence_required: 'States that a review cadence (monthly or quarterly) will prevent rules from being left untuned for 18 months again' }
    ]
  },
  {
    question: 'You are the SOC manager at a mid-sized company. You have been asked to present a quarterly report to the CISO. The data: 3,200 alerts closed, 180 investigations opened, 12 incidents escalated, and 0 confirmed breaches. Write the report outline: what you will present, what you will NOT present, and why. Include at least three specific metrics you will use and two specific gaps you will disclose.',
    guidelines: 'This is a CISO-level communication exercise. The CISO needs to see whether the SOC is actually reducing risk, not whether it is busy. Name the specific metrics that prove effectiveness, and the specific gaps that reveal honesty.',
    rubric: [
      { criterion: 'Rejects volume metrics as the primary story', points: 2, evidence_required: 'States explicitly that "3,200 alerts closed" is activity, not effectiveness, and does not lead with it' },
      { criterion: 'Names at least three effectiveness metrics', points: 2, evidence_required: 'Includes MTTD/MTTR on specific critical techniques, false positive rate on high-fidelity rules, or coverage of ATT&CK techniques — with baseline and current values' },
      { criterion: 'Discloses two specific gaps with remediation plan', points: 2, evidence_required: 'Names two concrete gaps (e.g., "no EDR on OT network", "no after-hours triage for tier-1") and a plan with owner and date' },
      { criterion: 'Explains what is NOT being presented and why', points: 2, evidence_required: 'States which metrics are excluded (e.g., "alerts closed" as headline, "incidents prevented" as unprovable claim) and explains the reasoning' },
      { criterion: 'Names the specific decision the CISO must make', points: 2, evidence_required: 'States clearly what the CISO is being asked to decide (approve budget, accept residual risk, require a specific control) rather than ending with a summary' }
    ]
  }
],
    21: [
  {
    question: 'You are the newly appointed CISO at a 500-person Namibian bank. The board has approved a Zero Trust program with a 3-year, N$14 million budget. The CEO asks for a one-page memo: what will be different in 3 years, what are the phases, and what are the three decisions the board must make in the next 90 days. Write the memo.',
    guidelines: 'This is a board-level strategy document. The memo must be specific about phases (not "we will implement Zero Trust"), about measurable outcomes (not "improve security"), and about the specific decisions the board must make. Do not write a vendor pitch.',
    rubric: [
      { criterion: 'Defines "different in 3 years" in measurable terms', points: 2, evidence_required: 'At least three specific outcomes (e.g., per-application access for all critical systems, no flat VPN, device posture enforced on 90% of endpoints)' },
      { criterion: 'Provides a phased plan with dependencies', points: 2, evidence_required: 'Three phases with named deliverables per phase and the dependency between them (identity before segmentation, etc.)' },
      { criterion: 'Names three specific board decisions', points: 2, evidence_required: 'Each decision is a real choice with a trade-off (approve Phase 1 budget, accept the UX impact of MFA, approve legacy exception), not a generic "approve the plan"' },
      { criterion: 'Acknowledges the residual risk honestly', points: 2, evidence_required: 'States what Zero Trust will NOT fix in 3 years (e.g., unpatched legacy systems, supply chain risk) rather than claiming full protection' },
      { criterion: 'Avoids vendor-specific claims and marketing language', points: 2, evidence_required: 'No product names in the memo unless they are already in the bank stack; no "industry-leading" or "best-in-class" claims' }
    ]
  },
  {
    question: 'Your bank operates 12 core applications and 3 legacy systems that cannot be modified. You are asked to design the microsegmentation strategy for the first phase. Write the design: what zones you will create, what the allow rules between zones will be, how you will handle the legacy systems, and what you will monitor in the first 90 days.',
    guidelines: 'This is a technical design document. The zones must be based on function, not physical topology. The legacy systems are the hard part — the design must show how they fit without undermining the segmentation. Monitoring is how you prove the design works.',
    rubric: [
      { criterion: 'Defines zones by function, not topology', points: 2, evidence_required: 'Zones are defined by business function (core banking, payments, customer data, admin, legacy) with reasoning, not "floor 3" or "VLAN 40"' },
      { criterion: 'Specifies explicit allow rules with default deny', points: 2, evidence_required: 'The design states default-deny between zones, with each allow rule naming source zone, destination zone, port, and business justification' },
      { criterion: 'Addresses the legacy systems with a specific control', points: 2, evidence_required: 'Legacy systems are placed in a quarantine zone with compensating controls (proxy access, EDR, specific allow rules) and a documented review date' },
      { criterion: 'Defines monitoring for the first 90 days', points: 2, evidence_required: 'Names specific monitoring (zone-crossing traffic logs, anomaly alerts on denied flows, baseline per zone) with the question each monitor answers' },
      { criterion: 'Provides a rollback plan', points: 2, evidence_required: 'States how to revert a zone change if it breaks a business process, and who has authority to trigger the rollback' }
    ]
  },
  {
    question: 'A 40-year-old Namibian insurance company has 60% of staff on Windows 10, 30% on Windows 7, and 10% on a mix of macOS and Linux. The CISO wants to implement device posture checks. Write the implementation plan: which posture checks you will enforce first, which you will defer, and how you will handle the Windows 7 population without blocking their work entirely.',
    guidelines: 'This is a phased technical rollout. Posture checks must be risk-ranked — the highest-value checks first, the lowest-value checks deferred. The Windows 7 population is the hard constraint: they cannot run modern agents, so the plan must show how they are controlled without being exempted.',
    rubric: [
      { criterion: 'Ranks posture checks by risk', points: 2, evidence_required: 'Names at least three checks (OS patching, disk encryption, EDR presence, screen lock, admin rights) with a risk ranking and the reason for each ranking' },
      { criterion: 'Enforces highest-value checks on the modern populations first', points: 2, evidence_required: 'Windows 10, macOS, and Linux get specific first-phase checks with enforcement dates' },
      { criterion: 'Addresses Windows 7 without exempting it', points: 2, evidence_required: 'Windows 7 devices are treated as higher-risk and subject to compensating controls (network isolation, application allowlisting, enhanced monitoring) rather than exemption' },
      { criterion: 'Provides a timeline with owners', points: 2, evidence_required: 'At least three phases with named owners (IT, security, endpoint team) and specific dates per phase' },
      { criterion: 'Names the specific user-experience impact', points: 2, evidence_required: 'States the expected impact on each population (e.g., "Windows 7 users will notice longer boot times due to isolation checks") so the impact is anticipated, not discovered' }
    ]
  },
  {
    question: 'You are the CISO at a Nairobi-based fintech that serves customers in Kenya, Tanzania, and Uganda. The regulator in each country has different expectations for data protection, incident notification, and audit logging. Write the memo that explains how a single Zero Trust architecture can satisfy all three regulators without building three separate environments.',
    guidelines: 'This is a multi-jurisdiction architecture decision. The memo must identify the specific regulatory differences, show how the architecture accommodates them without duplication, and name the trade-offs. Do not write "we will comply with all regulations" — the memo must show how.',
    rubric: [
      { criterion: 'Identifies the specific regulatory differences', points: 2, evidence_required: 'Names at least two specific differences across the three jurisdictions (data residency, notification window, audit log retention) with the specific regulation cited' },
      { criterion: 'Proposes a single architecture that satisfies all three', points: 2, evidence_required: 'Shows how identity, access policy, and logging are enforced centrally while accommodating jurisdiction-specific constraints' },
      { criterion: 'Addresses data residency specifically', points: 2, evidence_required: 'States where data is stored for each jurisdiction, how access crosses borders (or does not), and how this is enforced technically — not just "in a compliant way"' },
      { criterion: 'Names the specific trade-offs', points: 2, evidence_required: 'States at least two trade-offs (operational cost, complexity, UX impact on cross-border staff) that the business must accept' },
      { criterion: 'Provides an audit mechanism', points: 2, evidence_required: 'States how the architecture produces the audit evidence each regulator requires, and how it is delivered without manual effort' }
    ]
  },
  {
    question: 'Six months into your Zero Trust implementation, the helpdesk is reporting a 300% increase in access tickets. Users are complaining that they cannot reach the resources they need. The CEO is frustrated. Write the incident review: what went wrong with the implementation, what the immediate fix is, and what the sustainable fix is. Do not write "we will improve communication" — name specific design and process failures.',
    guidelines: 'This is an implementation post-mortem. The failure is systemic (policy design, access provisioning, exception handling), not a communication problem. The immediate fix restores access; the sustainable fix prevents the problem from recurring.',
    rubric: [
      { criterion: 'Diagnoses the specific design failure', points: 2, evidence_required: 'Names the specific policy design issue (e.g., access rules written without analysing actual user workflows, no discovery phase before enforcement) — not "users were not ready"' },
      { criterion: 'Provides an immediate fix that restores access', points: 2, evidence_required: 'Names a specific action (temporary allow rules, re-enabling old access path for named roles) with a timeframe and an owner' },
      { criterion: 'Provides a sustainable fix with a specific process', points: 2, evidence_required: 'Names the process change (access review before policy change, staged rollout with pilot group, exception workflow with SLAs) — not "more training"' },
      { criterion: 'Addresses the exception backlog', points: 2, evidence_required: 'States how the existing 300% ticket backlog will be triaged, prioritised, and cleared — with a target date' },
      { criterion: 'Recommends a governance change to prevent recurrence', points: 2, evidence_required: 'States a specific governance change (change approval board must include business representatives, policy changes require a pilot group sign-off) rather than a generic "better planning" recommendation' }
    ]
  }
],
    37: [
  {
    question: 'You are the security awareness lead at a 120-person Namibian insurance company. The CEO has approved a budget for awareness training but wants a one-page plan before release. Write the plan: what you will do in the first 90 days, what you will measure, and what "success" looks like at the end of the year. Do not write a training catalogue — write a behaviour-change plan.',
    guidelines: 'This is a plan for a CEO who wants outcomes, not activities. The plan must name specific behaviours to change, specific measurements, and a specific definition of success. "We will run phishing simulations" is an activity; "we will measure report rate" is a behaviour change.',
    rubric: [
      { criterion: 'Names the specific behaviours to change', points: 2, evidence_required: 'At least three specific behaviours (report-phish button use, password manager adoption, BEC callback verification) rather than generic "security awareness"' },
      { criterion: 'Names the specific measurements', points: 2, evidence_required: 'At least two behavioural metrics (report rate, click rate, password manager usage) with baseline and target' },
      { criterion: 'Provides a 90-day phased plan with owners', points: 2, evidence_required: 'At least three phases with named owners and specific deliverables per phase' },
      { criterion: 'Defines success in measurable terms', points: 2, evidence_required: 'States a year-end outcome (e.g., "report rate above 60%, click rate below 5%") rather than "improved awareness"' },
      { criterion: 'Acknowledges at least one barrier honestly', points: 2, evidence_required: 'Names one real barrier (staff turnover, senior leader resistance, budget constraint) and how the plan addresses it' }
    ]
  },
  {
    question: 'A staff member at your Windhoek office receives a suspicious email, clicks the link, and does not enter credentials. They report it to the security team 20 minutes later. Write the response you would send: what you will do, what you need from them, and what you will not do. The tone should be blame-free but specific.',
    guidelines: 'This is a real interaction, not a policy statement. The staff member did the right thing by reporting. The response must preserve the reporting instinct while taking the investigation seriously. Do not write "please be more careful in future."',
    rubric: [
      { criterion: 'Thanks the staff member specifically', points: 2, evidence_required: 'Thanks them for reporting, and names why it matters (e.g., "we can now check your session before anything worse happens")' },
      { criterion: 'Names the specific investigation you will run', points: 2, evidence_required: 'States at least two actions (check authentication logs, revoke active sessions, check for forwarding rules) with a timeframe' },
      { criterion: 'Names what you need from them', points: 2, evidence_required: 'Asks for specific information (when they clicked, what they saw, whether they shared the email) rather than "more details"' },
      { criterion: 'States what you will not do', points: 2, evidence_required: 'Makes clear that reporting will not result in punishment, and that they should report future emails the same way' },
      { criterion: 'Avoids the vague-warning pattern', points: 2, evidence_required: 'No "be careful next time" or "watch for suspicious emails" — the response is specific to what happened' }
    ]
  },
  {
    question: 'You are designing a security awareness programme for a Namibian SME with 15 staff. Six staff are over 55, four are under 25, and the rest are in between. The SME has no security team and the owner wants the programme to run without his involvement. Write the design: how you will reach each cohort, what channel you will use, and how you will measure whether the programme is working without the owner having to chase staff.',
    guidelines: 'This is an awareness design exercise. Different cohorts respond to different channels and framing. The programme must be low-admin (the owner will not chase) and measurable without the owner. "We will send everyone an email" is the design that fails.',
    rubric: [
      { criterion: 'Differentiates the cohorts with reasoning', points: 2, evidence_required: 'Names how you will reach the over-55 cohort differently from the under-25 cohort, with a reason (e.g., WhatsApp voice notes for older staff, short videos for younger staff)' },
      { criterion: 'Uses channels the SME already has', points: 2, evidence_required: 'Channels named are already in use (WhatsApp, SMS, in-person briefing) rather than "we will launch a new platform"' },
      { criterion: 'Designs for low admin load', points: 2, evidence_required: 'The programme runs without the owner chasing staff — names the mechanism (e.g., automated reminders, one staff member as champion) with a specific role' },
      { criterion: 'Provides measurement that does not require owner involvement', points: 2, evidence_required: 'Names the measurement (e.g., quarterly phishing simulation results, report rate to a dedicated WhatsApp group) and who compiles it' },
      { criterion: 'Names a specific pilot cycle', points: 2, evidence_required: 'States the pilot length, the pilot cohort, and what would change based on the pilot results' }
    ]
  },
  {
    question: 'Your Namibian SME has run awareness training for two years. Staff can recite the policy but still fall for BEC emails. The CEO says the training is not working. Write the diagnostic memo: what you think is actually happening, three specific hypotheses you will test, and what you will do differently if any of the hypotheses turn out to be true.',
    guidelines: 'This is a diagnostic exercise, not a defence of the programme. The CEO is right that something is not working. The memo should propose specific tests, not generic "more training." Each hypothesis must be testable and each test must change the programme.',
    rubric: [
      { criterion: 'Names a plausible root cause honestly', points: 2, evidence_required: 'States a specific reason the training is not working (e.g., the training is generic phishing, but the attacks are BEC; the policy does not match practice) rather than "staff need more training"' },
      { criterion: 'Provides three testable hypotheses', points: 2, evidence_required: 'Each hypothesis can be tested with a specific method (e.g., "Hypothesis: the training does not cover authority-pressure tactics — Test: run a BEC simulation and measure")' },
      { criterion: 'Names the test for each hypothesis', points: 2, evidence_required: 'Each hypothesis is paired with a specific test, metric, and timeframe' },
      { criterion: 'Commits to a programme change if a hypothesis is true', points: 2, evidence_required: 'For each hypothesis, states what will change if the test confirms it (e.g., "if BEC simulation confirms the gap, we will add a finance-specific BEC module")' },
      { criterion: 'Avoids blaming the staff', points: 2, evidence_required: 'The memo locates the failure in the programme design, not in the staff, and does not propose "more discipline" as a fix' }
    ]
  },
  {
    question: 'You are the security lead at a mid-sized Namibian company. The CEO asks: "If I have N$50,000 for security awareness this year, how should I spend it?" Write the recommendation: what you will spend it on, why, what you will NOT spend it on, and how you will measure whether it worked. Be specific about numbers.',
    guidelines: 'This is a budget recommendation. The CEO wants specific numbers and a defence of each line item. "Training and tools" is not a recommendation. "N$15,000 on a password manager, N$10,000 on a BEC workshop, N$25,000 on..." is.',
    rubric: [
      { criterion: 'Provides a specific budget breakdown', points: 2, evidence_required: 'Every N$ accounted for with a specific line item, not a percentage range' },
      { criterion: 'Prioritises behaviour-change tools over content', points: 2, evidence_required: 'At least 50% of the budget goes to behaviour-change tools (password manager, MFA hardware, report-phish tooling) rather than content or video libraries' },
      { criterion: 'Names at least one thing NOT to buy and why', points: 2, evidence_required: 'States one category the CEO might expect (commercial video library, awareness posters, phishing simulation platform) and explains why it is not worth the budget' },
      { criterion: 'Provides measurable success criteria', points: 2, evidence_required: 'Names at least two metrics tied to the spend (password manager adoption rate, report rate, click rate) with a baseline and year-end target' },
      { criterion: 'Acknowledges the trade-off honestly', points: 2, evidence_required: 'States what the N$50,000 will NOT achieve (e.g., "this does not replace a security team, and BEC will still be a residual risk") rather than claiming the spend eliminates the risk' }
    ]
  }
],
    46: [
        essay(
            "Unauthorized 03:00 full-subnet SYN scan from a marketing laptop. Write the SOC case narrative and 48-hour hunt plan as if ransomware may follow.",
            "Recon as precursor. Isolation, authorization check, sibling hunt, ticket with owner."
        )
    ],
    51: [
        essay(
            "Explain to a board why Domain Admin on a helpdesk PC is an architectural failure, using Mimikatz-class theft and Pass-the-Hash as the story.",
            "PAW/tiering language. Avoid tool worship. Tie to business blast radius."
        )
    ],
    52: [
        essay(
            "Write a detection engineering brief for malleable HTTP C2 with sleep jitter. What do you hunt, what do you ignore, and how do you purple-test it?",
            "Beacon cadence, process ancestry, rare destinations. Retest after tuning."
        )
    ],
    58: [
        essay(
            "BloodHound shows Helpdesk GenericAll on a path to Tier-0. Write a risk-committee paper: severity, owners, 30/60/90 remediation, and retest proof.",
            "Attack paths as backlog. Shortest-path metric. No inventory theater."
        )
    ],
    60: [
        essay(
            "Teach executives Pass-the-Hash using cloud session-token theft as the analogy. Include the architectural fix and a 10-minute containment checklist.",
            "Reuse family of techniques. Tiering + short-lived creds. Clear containment steps."
        )
    ],
    70: [
        essay(
            "High-entropy DNS every 45s from one host. Write the hunt-to-contain playbook and the durable DNS architecture controls.",
            "Recursive resolvers, logging, sinkhole, EDR correlation. Avoid \"block all DNS.\""
        )
    ],
    84: [
        essay(
            "Build a one-page ATT&CK heatmap story for leadership: strong phishing coverage, blind credential dumping. Ask for funding with measurable MTTD targets.",
            "Shared vocabulary. Retestable outcomes. No fear theater."
        )
    ],
    95: [
        essay(
            "Purple week results: phishing MTTD 4 minutes; LSASS dump missed. Write the sprint plan and the re-emulation success criteria.",
            "Fund dangerous blinds. Owners, dates, retest proof. Emulate → remediate → re-emulate."
        )
    ]
};

const TIER_A_EXTRAS = {
    1: {
        why: "Phishing is still the cheapest reliable initial access — and AiTM kits now steal sessions after MFA.",
        concepts: [
            "Lookalike domains, AiTM proxies, MFA fatigue, and callback failures",
            "SPF/DKIM/DMARC alignment is necessary but not sufficient alone",
            "Reporting culture beats shame; phishing-resistant MFA beats OTP when AiTM appears"
        ],
        prevent: [
            "Passkeys/FIDO2 for VIP and finance",
            "DMARC enforcement path with monitoring first",
            "Measured simulations with coaching; one-click report buttons"
        ],
        caseStudy:
            "A Windhoek finance clerk nearly paid on a lookalike domain invoice. Dual-control callback to a known number stopped N$480k in loss the same afternoon.",
        futureScenario:
            "AI voice clone of your CFO during month-end. Challenge phrase + dual control is the brake — not \"it sounded real.\""
    },
    7: {
        why: "BEC and deepfake social engineering target payment trust more than malware.",
        concepts: [
            "Invoice redirect and vendor portal lookalikes",
            "Voice/video synthesis pressure on executives",
            "Out-of-band verification as a financial control, not optional etiquette"
        ],
        prevent: [
            "Dual control and callback on known numbers for payment changes",
            "Challenge phrases for executive voice requests",
            "Finance playbooks that slow urgency without killing business"
        ],
        caseStudy:
            "A supplier \"bank change\" email matched brand tone. Finance called the number on last year’s contract — fraud stopped before transfer.",
        futureScenario:
            "Real-time deepfake video in Teams. Process and dual control outrank \"I saw their face.\""
    },
    8: {
        why: "IR quality decides whether a bad day becomes an existential event — especially under executive pressure.",
        concepts: [
            "Severity models, escalation trees, and Incident Commander role clarity",
            "Containment can proceed while evidence is preserved selectively",
            "Comms must track facts — speculation creates legal and trust debt"
        ],
        prevent: [
            "Quarterly tabletop with pressure injects",
            "Named deputies for IC / comms / legal bridge",
            "Evidence kits and known-good rebuild paths tested"
        ],
        caseStudy:
            "A retailer paused public statements until containment stopped POS lateral movement. Customers got facts 90 minutes later — trust held.",
        futureScenario:
            "Regulators and WhatsApp rumors outrun your draft. Train dual-track: tech containment + careful public language."
    },
    11: {
        why: "Ransomware affiliates industrialize backup destruction and identity abuse before encryption.",
        concepts: [
            "Exfil-before-encrypt and VSS deletion as checklist items",
            "Immutable backup design and restore drills",
            "Negotiation is business/legal — IR keeps recovering"
        ],
        prevent: [
            "Offline/immutable backups with restore tests",
            "Tier admin model; reduce domain-wide blast radius",
            "EDR isolation playbooks rehearsed"
        ],
        caseStudy:
            "Hospital restores succeeded because backups were offline and tested — affiliates found encrypted disks but not leverage.",
        futureScenario:
            "Extortion includes stolen family photos of executives. Keep legal counsel in loop; do not halt technical recovery."
    },
    18: {
        why: "SOC value is judged by decisions under noise — not by alert count.",
        concepts: [
            "Alert chaining beats single-event tunnel vision",
            "Service accounts are crown jewels",
            "MTTD/MTTR on purple techniques prove maturity"
        ],
        prevent: [
            "Tune with ownership; never silent-disable high-risk rules",
            "Enrich identity context in the queue",
            "Staff to real volume; protect analysts from fatigue traps"
        ],
        caseStudy:
            "Night shift caught spray→admin$ by chaining three \"medium\" alerts. Flat VLAN made ERP risk real — segmentation funded next quarter.",
        futureScenario:
            "AI will summarize queues — your edge remains knowing which chain means hands-on-keyboard."
    },
    21: {
        why: "Zero Trust replaces \"trusted network location\" with continuous verification of identity, device, and context.",
        concepts: [
            "Per-request authorization and least privilege",
            "Device posture for remote/contractor access",
            "Segmentation as blast-radius control — especially near OT"
        ],
        prevent: [
            "Remove flat VPN paths to crown jewels",
            "Short-lived access and just-in-time elevation",
            "Monitor token misuse and impossible travel"
        ],
        caseStudy:
            "Contractor VPN once reached engineering jump hosts. ZTNA + device checks cut that path without killing productivity.",
        futureScenario:
            "Home routers and agentic tools request broad roles. Continuous auth and scoped tokens matter more than VPN myths."
    },
    37: {
        why: "Awareness is a control system — culture, channels, and drills — not an annual PDF.",
        concepts: [
            "Psychological safety increases reporting",
            "Train WhatsApp/SMS/BEC realities for African SMEs",
            "Measure behavior change, not completion checkboxes only"
        ],
        prevent: [
            "Micro-drills monthly on real channels",
            "Manager callback norms for payments",
            "Coach clickers; do not ritual-shame"
        ],
        caseStudy:
            "After a no-shame reporting campaign, phish-to-report time dropped from hours to minutes in a retail group.",
        futureScenario:
            "Deepfake supplier calls become normal. Awareness must teach process, not \"spot the artifact.\""
    },
    46: {
        why: "Reconnaissance tooling is stage-0 for both attackers and authorized testers — intent and authorization decide legality.",
        concepts: [
            "SYN/UDP scans as discovery tradecraft",
            "Internet-facing RDP/SMB as priority attack surface",
            "Change tickets and ROE separate purple from crime"
        ],
        prevent: [
            "External attack-surface monitoring with owners",
            "Network segmentation and expose-only-what-you-must",
            "Hunt unauthorized scanners as incidents"
        ],
        caseStudy:
            "03:00 full-subnet scan from a marketing laptop preceded ransomware by 48 hours. Early isolation cut blast radius.",
        futureScenario:
            "Automated scanners will blend with business bots. Authorization telemetry becomes the difference."
    },
    51: {
        why: "Credential dumping turns one privileged logon into domain-wide reuse.",
        concepts: [
            "LSASS/secrets as attacker gold",
            "Tiering and PAWs as architectural controls",
            "Credential Guard / Protected Users raise theft cost"
        ],
        prevent: [
            "Never administer Tier-0 from dirty workstations",
            "LAPS/gMSA; reduce standing admin",
            "EDR alerts on dump tooling + unusual LSASS access"
        ],
        caseStudy:
            "DA RDP to a helpdesk PC enabled hash reuse across file servers the same night. PAW project was funded after the postmortem.",
        futureScenario:
            "Cloud admin sessions will be the new LSASS. Session binding and short-lived tokens are the next tiering fight."
    },
    52: {
        why: "Commercial C2 frameworks teach defenders what \"quiet persistence\" looks like on the wire and host.",
        concepts: [
            "Malleable profiles and sleep jitter",
            "Process injection ancestry over filename IOCs",
            "Egress allowlists and beacon cadence hunts"
        ],
        prevent: [
            "Detect beacon patterns and rare destinations",
            "Isolate + memory capture playbooks",
            "Purple emulations that retest after tuning"
        ],
        caseStudy:
            "Beacon to a \"CDN\" domain every 60s with jitter was dismissed as SaaS until process ancestry showed Office→rundll32→injected thread.",
        futureScenario:
            "AI will rewrite malleable profiles weekly. Behavior and identity context stay your durable detectors."
    },
    58: {
        why: "Identity graphs expose how few ACL mistakes stand between an intern account and Domain Admin.",
        concepts: [
            "Dangerous edges: GenericAll, WriteDACL, force-change-password chains",
            "Shortest path metrics for remediation priority",
            "Tier-0 hygiene as continuous backlog, not a one-time project"
        ],
        prevent: [
            "Remove Helpdesk-to-Tier-0 paths",
            "Quarterly BloodHound / AD ACL reviews with owners",
            "Privileged access workstations and clean source of admin"
        ],
        caseStudy:
            "Helpdesk GenericAll on a resettable account that could reach Tier-0 was closed in a week after graph evidence hit the risk committee.",
        futureScenario:
            "Hybrid identity paths (Entra + on-prem) will be the new shortest path. Graph both sides."
    },
    60: {
        why: "Pass-the-Hash is credential reuse — the same story as stolen cloud tokens, older protocol.",
        concepts: [
            "NTLM hash reuse without cracking",
            "Privileged logons on dirty hosts create reusable material",
            "Cloud token theft is the executive-friendly analogue"
        ],
        prevent: [
            "Tiered admin / PAW",
            "Restrict NTLM where feasible; prefer modern auth",
            "Short-lived sessions and step-up for sensitive actions"
        ],
        caseStudy:
            "After PtH lateral movement, the board understood \"DA on a laptop\" as the root cause — not \"antivirus missed a file.\"",
        futureScenario:
            "PRT and refresh-token theft will dominate headlines. Teach reuse as a family of techniques."
    },
    70: {
        why: "When HTTP egress is watched, attackers still abuse DNS as a covert channel.",
        concepts: [
            "High-entropy labels and regular query cadence",
            "Internal resolvers as control points",
            "Correlate DNS anomalies with host EDR"
        ],
        prevent: [
            "Central recursive DNS with logging",
            "Sinkhole / alert rare patterns",
            "Host isolation playbooks for tunneling suspects"
        ],
        caseStudy:
            "A workstation queried entropy-heavy labels every 45s. Isolation found staging tools before exfil completed.",
        futureScenario:
            "DoH will hide some queries. Endpoint DNS telemetry becomes mandatory."
    },
    84: {
        why: "ATT&CK turns tool drama into a shared map of coverage, gaps, and funding asks.",
        concepts: [
            "Techniques as units of purple testing",
            "Heatmaps for leadership without fear theater",
            "Retest after each detection investment"
        ],
        prevent: [
            "Map detections and controls to technique IDs",
            "Fund blinds with measurable MTTD targets",
            "Keep matrices living — not annual wallpaper"
        ],
        caseStudy:
            "A heat map showed strong phishing detection and blind credential dumping. One sprint closed T1003 with proof on retest.",
        futureScenario:
            "Boards will ask \"which techniques can we detect?\" — ATT&CK fluency is career currency."
    },
    95: {
        why: "Purple teaming is how you prove defenses under controlled adversary pressure.",
        concepts: [
            "Emulate, measure, remediate, re-emulate",
            "Spend on dangerous blinds, not vanity metrics",
            "Shared red/blue language via ATT&CK"
        ],
        prevent: [
            "Scheduled purple weeks with ROE",
            "Publish MTTD/MTTR deltas",
            "Close findings with owners and retest dates"
        ],
        caseStudy:
            "Phishing caught in 4 minutes; LSASS dump missed. Next sprint funded credential controls — retest passed.",
        futureScenario:
            "Continuous automated emulation will replace annual theater. Humans still decide what \"good enough\" means for the business."
    }
};

const MODULE_ROTATION_MIN = 12;
const MODULE_ROTATION_MIN_BUCKETS = 3;

module.exports = {
    TIER_A_QUESTIONS,
    TIER_A_EXTRAS,
    TIER_A_ESSAYS,
    getTierAEssays: (moduleId) => TIER_A_ESSAYS[moduleId] || null,
    MODULE_ROTATION_MIN,
    MODULE_ROTATION_MIN_BUCKETS,
};