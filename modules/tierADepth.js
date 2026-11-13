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
            "Legal requests a customer notification draft while active ransomware encryption is still spreading across network segments. What is the Incident Commander's primary operational priority?",
            [
                "Draft perfect public relations prose before initiating any host isolation procedures",
                "Contain the spread first, using dual-track workflows for technical containment and factual comms",
                "Power off every corporate workstation blindly across all physical branch offices",
                "Delete all local event logs immediately to reduce regulatory liability exposure"
            ],
            1,
            "NIST incident response principles dictate stopping active harm first while maintaining factual, non-speculative communication tracks.",
            "incident_response",
            45,
            {
                distractor_rationale: [
                    "WRONG — delaying containment to craft PR statements allows ransomware lateral movement to expand.",
                    "CORRECT — immediate containment paired with controlled, factual communication satisfies both operational and legal needs.",
                    "WRONG — blind site-wide power-offs destroy volatile memory artifacts needed for forensic scoping.",
                    "WRONG — deleting event logs violates legal compliance and destroys vital forensic timelines."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1486",
                rotation_bucket: "incident_response",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Which telemetry input provides the strongest justification for declaring an enterprise major security incident status immediately?",
            [
                "A single automated spam email flagged and deleted successfully by the secure gateway",
                "Active lateral movement into crown-jewel database systems with payment impact indicators",
                "An employee altering their office desktop wallpaper theme without authorization",
                "Temporary wide-area network VPN latency spiking to 12 milliseconds during peak hours"
            ],
            1,
            "Incident severity scales directly with blast radius and business operational or financial safety impact.",
            "severity",
            35,
            {
                distractor_rationale: [
                    "WRONG — standard spam interception is routine operational noise, not a major incident.",
                    "CORRECT — active lateral movement into crown jewels represents high blast radius and immediate business risk.",
                    "WRONG — aesthetic wallpaper changes are policy infractions, not active security breaches.",
                    "WRONG — normal network latency variations are standard infrastructure events."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1210",
                rotation_bucket: "severity",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "An active ransomware infection is actively encrypting a primary file server. How should the response team balance volatile evidence collection against operational uptime containment?",
            [
                "Ignore evidence collection entirely and focus exclusively on long-term preventive policy updates",
                "Isolate the host immediately to halt spread, capturing critical volatile data where playbook-safe",
                "Leave the attacker connected to the system for one week to observe their complete methodology",
                "Reimage the affected server immediately without taking notes or preserving system state"
            ],
            1,
            "Immediate host isolation halts active encryption while disciplined playbook procedures preserve essential forensic artifacts.",
            "forensics",
            40,
            {
                distractor_rationale: [
                    "WRONG — ignoring evidence collection prevents root-cause analysis and future hardening.",
                    "CORRECT — rapid isolation stops encryption propagation while preserving necessary forensic scope.",
                    "WRONG — leaving attackers active on systems during ongoing encryption maximizes business damage.",
                    "WRONG — reimaging without logging destroys critical root-cause attribution data."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1486",
                rotation_bucket: "forensics",
                last_validated: "2026-11-12"
            }
        )
    ],
    11: [
        q(
            "An affiliate ransomware checklist includes clearing Volume Shadow Copies and exfiltrating data prior to execution. Which control combination most directly breaks their extortion leverage?",
            [
                "Deploying motivational security posters throughout office hallways and break rooms",
                "Maintaining offline immutable backups with restore testing alongside identity tiering",
                "Relying solely on standard antivirus signature definitions updated once daily",
                "Establishing a corporate policy to pay every ransomware demand immediately upon notice"
            ],
            1,
            "Robust recoverability via tested immutable backups and domain tiering removes the attacker's primary extortion leverage.",
            "ransomware",
            40,
            {
                distractor_rationale: [
                    "WRONG — awareness posters do not technical disrupt active ransomware encryption workflows.",
                    "CORRECT — offline immutable backups ensure recoverability while tiering slows lateral movement.",
                    "WRONG — traditional antivirus signatures easily miss novel ransomware binaries and custom loaders.",
                    "WRONG — paying ransoms encourages further attacks and does not guarantee data recovery."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1490",
                rotation_bucket: "ransomware",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Double extortion involves data exfiltration combined with local system encryption, putting severe pressure on executives. What is the recommended professional response posture?",
            [
                "Allow IT administrators to handle ransom payment negotiations entirely in secret",
                "Empower legal and leadership with IR facts while continuing recovery; do not halt containment",
                "Publicly livestream ongoing negotiation chats on social media to shame the actors",
                "Wipe all company backup servers immediately to deny thieves any satisfaction"
            ],
            1,
            "Ransom payment decisions remain executive business and legal calls, while incident responders maintain rigorous containment and recovery.",
            "extortion",
            45,
            {
                distractor_rationale: [
                    "WRONG — leaving financial decisions entirely to isolated IT staff violates governance and risk controls.",
                    "CORRECT — structured executive leadership guided by forensic facts ensures sound crisis management.",
                    "WRONG — livestreaming negotiations escalates instability and compromises ongoing crisis strategy.",
                    "WRONG — wiping backup servers destroys the organization's recovery capability."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1486",
                rotation_bucket: "extortion",
                last_validated: "2026-11-12"
            }
        )
    ],
    18: [
        q(
            "Night-shift analysts are overwhelmed by 900 medium alerts daily and begin closing tickets without investigation. What is the most effective leadership remediation strategy?",
            [
                "Terminate all underperforming shift analysts immediately and hire fresh contractors",
                "Tune detections, enrich event context, staff appropriately, and protect high-fidelity rules",
                "Turn off the security information and event management system entirely during night hours",
                "Configure alerting rules to trigger exclusively on low-severity informational events"
            ],
            1,
            "Alert fatigue is an operational architecture and workflow design failure requiring detection tuning and proper resourcing.",
            "soc",
            40,
            {
                distractor_rationale: [
                    "WRONG — firing analysts does not fix the underlying noisy detection engineering flaw.",
                    "CORRECT — tuning noisy rules, enriching context, and protecting core rules resolves burnout root causes.",
                    "WRONG — disabling SIEM monitoring leaves the enterprise entirely blind to active threats.",
                    "WRONG — restricting alerts to low severity misses critical high-fidelity indicators."
                ],
                cognitive_level: 4,
                difficulty: 3,
                coverage_tag: "T1078",
                rotation_bucket: "soc",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "A service account shows successful authentication following a password spray, followed immediately by administrative remote service hops. What is the appropriate 10-minute analytic narrative?",
            [
                "This represents a standard network glitch or automated service update; close ticket",
                "This indicates identity compromise and lateral movement; contain hosts and preserve logs",
                "This is a benign diagnostic script execution; wait for a formal ransomware note",
                "This requires sending a polite reminder email to the user regarding policy compliance"
            ],
            1,
            "Chained security telemetry combining authentication anomalies with administrative remote service usage indicates active lateral movement.",
            "lateral",
            40,
            {
                distractor_rationale: [
                    "WRONG — dismissing spray followed by admin hops as a glitch ignores clear compromise indicators.",
                    "CORRECT — linking authentication spikes to remote administrative movement confirms active compromise.",
                    "WRONG — waiting for ransomware notes allows attackers to complete domain dominance.",
                    "WRONG — polite reminder emails are ineffective against active adversary lateral movement."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1021",
                rotation_bucket: "lateral",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Which metric provides the most accurate empirical demonstration of SOC improvement following purple team emulation exercises?",
            [
                "The total count of presentation slide decks delivered to the board of directors",
                "The delta in MTTD and MTTR on emulated adversary techniques before versus after tuning",
                "The total volume of caffeinated beverages consumed by analysts during night shifts",
                "The aggregate count of unread alert notifications ignored across shift rotations"
            ],
            1,
            "Measuring mean time to detect and respond on specific emulated techniques provides objective proof of defensive maturation.",
            "metrics",
            35,
            {
                distractor_rationale: [
                    "WRONG — slide deck volume measures administrative output rather than operational effectiveness.",
                    "CORRECT — tracking MTTD and MTTR improvements on emulated techniques measures true detection capability.",
                    "WRONG — beverage consumption is unrelated to security operational performance.",
                    "WRONG — ignored alert counts indicate process failure rather than improvement."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1562",
                rotation_bucket: "metrics",
                last_validated: "2026-11-12"
            }
        )
    ],
    21: [
        q(
            "A flat VPN configuration allows any authenticated laptop to reach sensitive SCADA jump hosts directly. What is the correct Zero Trust architectural response?",
            [
                "Trust the existing VPN tunnel perimeter permanently without introducing changes",
                "Segment architecture; continuously verify identity and device posture; enforce least privilege",
                "Remove all user authentication requirements to streamline remote engineering workflows",
                "Implement a longer and more complex pre-shared VPN password for remote workers"
            ],
            1,
            "Zero Trust architecture relies on continuous verification, explicit least privilege, and strict micro-segmentation.",
            "zero_trust",
            40,
            {
                distractor_rationale: [
                    "WRONG — trusting static VPN perimeters violates core Zero Trust principles.",
                    "CORRECT — micro-segmentation and continuous posture verification reduce lateral blast radius.",
                    "WRONG — removing authentication eliminates perimeter security entirely.",
                    "WRONG — longer passwords do not fix flat network architecture risks."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1133",
                rotation_bucket: "zero_trust",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "A contractor using an unmanaged personal device with sideloaded applications requires access to the enterprise ERP system. What is the optimal secure access pattern?",
            [
                "Grant full domain administrator privileges directly to the personal mobile device",
                "Utilize managed device posture checking or VDI/virtual apps with short-lived access sessions",
                "Share a generic administrative login credential written on a physical office sticky note",
                "Disable all access logging and monitoring telemetry for contractor workstation sessions"
            ],
            1,
            "Device posture validation and virtualized session isolation provide secure access without requiring broad network immersion.",
            "ztna",
            40,
            {
                distractor_rationale: [
                    "WRONG — granting domain admin to unmanaged personal devices creates severe enterprise risk.",
                    "CORRECT — VDI and posture validation ensure secure access without exposing internal networks.",
                    "WRONG — shared generic credentials destroy audit accountability.",
                    "WRONG — disabling logging prevents security visibility during contractor sessions."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1133",
                rotation_bucket: "ztna",
                last_validated: "2026-11-12"
            }
        )
    ],
    37: [
        q(
            "An awareness training program that relies exclusively on shaming employees who click simulated phishing links typically produces what organizational outcome?",
            [
                "Significantly higher employee reporting rates for actual suspicious emails",
                "Hidden security clicks and lower reporting rates due to a toxic culture of fear",
                "Flawless perimeter security compliance across all department business units",
                "Automatic patching of underlying operating system vulnerabilities on endpoints"
            ],
            1,
            "Shame-based awareness creates psychological fear, driving employees to hide mistakes and suppressing vital incident reporting.",
            "awareness",
            35,
            {
                distractor_rationale: [
                    "WRONG — shaming suppresses reporting rather than encouraging transparency.",
                    "CORRECT — fear of punishment drives employees to hide security mistakes.",
                    "WRONG — awareness programs do not replace technical patching or perimeter controls.",
                    "WRONG — employee awareness has no direct technical effect on OS patching."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1566",
                rotation_bucket: "awareness",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "What is the most effective micro-drill strategy for a retail enterprise operating in a region where staff rely heavily on mobile messaging apps?",
            [
                "Focus training exclusively on advanced Border Gateway Protocol routing hijacks",
                "Practice invoice verification, fake delivery text scenarios, and manager callback norms",
                "Ignore mobile messaging channels entirely and focus solely on desktop web browsers",
                "Require employees to memorize numeric TCP/UDP port numbers for common protocols"
            ],
            1,
            "Training must focus realistically on the specific communication channels and social engineering vectors staff actually use.",
            "awareness",
            40,
            {
                distractor_rationale: [
                    "WRONG — BGP routing is irrelevant to retail employee social engineering awareness.",
                    "CORRECT — drilling real-world mobile messaging and invoice vectors builds practical resilience.",
                    "WRONG — ignoring mobile channels leaves employees vulnerable to SMS and WhatsApp attacks.",
                    "WRONG — memorizing port numbers provides no practical defense against social engineering."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1656",
                rotation_bucket: "awareness",
                last_validated: "2026-11-12"
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
            "BloodHound reveals a Helpdesk group holds GenericAll rights over an object that can reset a Tier-0-adjacent account. What is the appropriate remediation action?",
            [
                "Celebrate the successful inventory completion and close the security ticket",
                "Treat as critical identity debt; remove dangerous ACLs and enforce strict tiering rules",
                "Grant GenericAll permissions to all corporate employees for administrative parity",
                "Ignore attack path graphs as theoretical visualizations with no real risk"
            ],
            1,
            "Dangerous access control lists representing direct privilege escalation paths must be remediated as critical technical debt.",
            "bloodhound",
            40,
            {
                distractor_rationale: [
                    "WRONG — inventory completion without remediation leaves severe privilege escalation paths active.",
                    "CORRECT — removing dangerous ACL paths eliminates critical privilege escalation vectors.",
                    "WRONG — granting broad administrative rights expands the attack surface catastrophically.",
                    "WRONG — attack path graphs illustrate actual exploitable paths used by real adversaries."
                ],
                cognitive_level: 3,
                difficulty: 3,
                coverage_tag: "T1484",
                rotation_bucket: "bloodhound",
                last_validated: "2026-11-12"
            }
        ),
        q(
            "Why do \"shortest path to Domain Admin\" findings hold higher operational priority than raw object count metrics in risk reviews?",
            [
                "They generate visually appealing graphics for executive presentation slide decks",
                "They reveal how few steps an attacker needs, prioritizing real blast-radius debt",
                "They automatically patch Microsoft Exchange server vulnerabilities on domain controllers",
                "They replace the need for endpoint detection and response monitoring agents"
            ],
            1,
            "Shortest path metrics highlight immediate exploitable privilege escalation edges, driving precise remediation priorities.",
            "bloodhound",
            35,
            {
                distractor_rationale: [
                    "WRONG — visual appeal is secondary to identifying actual operational security risk.",
                    "CORRECT — path length dictates attacker efficiency, making shortest paths vital remediation targets.",
                    "WRONG — graph analysis does not perform software patch management.",
                    "WRONG — attack path analysis complements but does not replace EDR agents."
                ],
                cognitive_level: 2,
                difficulty: 2,
                coverage_tag: "T1484",
                rotation_bucket: "bloodhound",
                last_validated: "2026-11-12"
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
        essay(
            "Write a 90-second executive brief after an AiTM campaign stole three finance sessions despite OTP MFA. Cover: what happened, immediate containment, why OTP failed, and a 30-day control plan.",
            "Plain language, no jargon dumps. Name phishing-resistant MFA and session controls. Include dual-control payment freeze."
        ),
        essay(
            "Design a Namibian SME phishing program for WhatsApp + email invoice fraud. Include measurement, coaching (no shame), and escalation to SOC.",
            "Channel-realistic. Define KPIs (report time, callback adherence) not just completion rates."
        )
    ],
    7: [
        essay(
            "A deepfake \"CFO\" voice asks for an urgent wire during month-end. Write the finance playbook step-by-step for the first 10 minutes.",
            "Challenge phrase, dual control, known-number callback, what not to do under authority pressure."
        )
    ],
    8: [
        essay(
            "You are Incident Commander. Encryption is spreading; Legal wants a public statement in 20 minutes. Write dual-track orders for tech containment and communications.",
            "Facts only in comms. Named owners. Unsafe actions under panic listed explicitly."
        )
    ],
    11: [
        essay(
            "Affiliates deleted VSS and began exfil before encrypt. Draft a board recovery narrative: backups, identity tiering, and whether ransom negotiation is an IR decision.",
            "Separate business/legal payment decisions from technical recovery. Cite restore-test evidence."
        )
    ],
    18: [
        essay(
            "Night shift closed 200 medium alerts without reading due to fatigue. Write a SOC lead remediation plan covering tuning ownership, staffing, and protection of high-fidelity rules.",
            "Treat fatigue as design failure. Include MTTD/MTTR on purple techniques as success metrics."
        )
    ],
    21: [
        essay(
            "Contractors on flat VPN can reach SCADA jump hosts. Propose a Zero Trust migration that keeps the plant running.",
            "Segmentation, device posture, least privilege, short-lived access. No \"trust the VPN\" leftovers."
        )
    ],
    37: [
        essay(
            "Rewrite an annual shame-based awareness program into a monthly micro-drill system for retail staff who live on WhatsApp.",
            "Psychological safety, channel realism, manager callback norms, measurable behavior change."
        )
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