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
    'An incident responder analyzing a compromised Windows server discovers malicious PowerShell execution logs containing base64-encoded strings. What is the most appropriate first analysis step?',
    [
      'Decode the base64 string offline within a secure sandbox environment to inspect the underlying commands safely',
      'Execute the encoded PowerShell payload directly on a production domain controller to observe live runtime behavior',
      'Delete the local PowerShell executable binary from all enterprise endpoints to permanently prevent execution',
      'Disable all event logging services across the entire server infrastructure to conserve storage capacity'
    ],
    0,
    'Decoding base64 strings offline in a sandbox safely exposes the script intent without risking production integrity.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - decoding base64 strings offline in a sandbox safely exposes the underlying script intent.',
        'WRONG - executing unknown obfuscated scripts on production endpoints risks immediate compromise or damage.',
        'WRONG - deleting the PowerShell binary breaks legitimate system administration tools and dependencies.',
        'WRONG - disabling logging blinds the security team and destroys crucial forensic visibility.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1059.001',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A SOC analyst reviewing SIEM telemetry notices repeated failed logins followed by a single successful authentication from an unknown external IP address targeting an administrative account. What is the most defensible initial action?',
    [
      'Assume the login was a legitimate administrative system maintenance task and close the SIEM alert ticket immediately',
      'Isolate the administrative account and associated endpoints, then verify the activity directly with the account owner',
      'Send an unencrypted broadcast email to all enterprise employees disclosing the exact administrative credentials involved',
      'Reboot all corporate domain controllers simultaneously without checking event logs to disrupt potential active sessions'
    ],
    1,
    'Brute-force followed by success indicates potential account takeover; immediate isolation and verification are essential.',
    'triage',
    45,
    {
      distractor_rationale: [
        'WRONG - closing security alerts without verification leaves active compromise indicators uninvestigated.',
        'CORRECT - isolating accounts and verifying activity with the owner is the standard triage response to potential compromise.',
        'WRONG - broadcasting unencrypted credentials via email creates a catastrophic secondary security exposure.',
        'WRONG - rebooting all domain controllers without log analysis disrupts operations and destroys volatile forensic data.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'triage',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise security team discovers that an attacker exfiltrated sensitive customer records by tunneling traffic through custom DNS query requests. Which defensive control mitigates this technique most effectively?',
    [
      'Installing standard commercial antivirus software with signature databases updated once every calendar quarter',
      'Enabling basic HTTP web browsing proxies for all employee internet connections across enterprise subnets',
      'Deploying an internal recursive DNS forwarding architecture that inspects and restricts abnormal query volume and length',
      'Configuring dynamic host configuration protocol scopes to rotate client IP lease addresses every 24 hours'
    ],
    2,
    'Monitoring and restricting DNS query patterns, lengths, and volumes disrupts DNS tunneling communication channels.',
    'network_security',
    45,
    {
      distractor_rationale: [
        'WRONG - quarterly antivirus updates do not detect or block protocol-based DNS tunneling techniques.',
        'WRONG - HTTP web browsing proxies manage standard web traffic rather than custom DNS query protocols.',
        'CORRECT - internal recursive DNS filtering and rate-limiting abnormal query volumes directly disrupts DNS tunneling.',
        'WRONG - daily DHCP lease rotation changes IP addresses but does not inspect or restrict DNS traffic.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1071.004',
      rotation_bucket: 'network_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A financial institution wants to verify whether its security operations center can detect a simulated credential dumping attack against LSASS memory. Which testing methodology is most appropriate?',
    [
      'Executing a controlled adversarial simulation using native tools like Mimikatz during an authorized red team engagement',
      'Performing a paper-based administrative walkthrough of physical server room badge access policies',
      'Reviewing automated vulnerability scanner compliance PDF reports generated once every calendar year',
      'Conducting an employee survey regarding password complexity preferences and corporate policy awareness'
    ],
    0,
    'Adversarial simulation using actual post-exploitation tools tests whether EDR and SIEM rules successfully detect LSASS dumping.',
    'testing',
    45,
    {
      distractor_rationale: [
        'CORRECT - controlled adversarial simulation tests actual detection and alerting capabilities against real memory dumping TTPs.',
        'WRONG - paper-based badge walkthroughs verify physical security rather than endpoint memory protection controls.',
        'WRONG - annual vulnerability scanner reports test software patching rather than active behavioral detection.',
        'WRONG - employee password surveys measure user awareness rather than technical security monitoring efficacy.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'testing',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An administrator reviewing cloud tenant access logs notices a newly created API access key assigned full global administrative permissions, generated outside normal operational windows. What is the immediate priority?',
    [
      'Submit a formal IT service desk ticket requesting an administrative review meeting during the next scheduled quarter',
      'Revoke the unauthorized API key immediately, review cloud audit logs for recent activity, and rotate master credentials',
      'Delete the primary enterprise cloud storage bucket to prevent potential unauthorized data viewing by the key holder',
      'Disable multi-factor authentication requirements globally across the cloud tenant to simplify emergency access recovery'
    ],
    1,
    'Revoking unauthorized credentials and reviewing audit trails stops potential cloud persistence and data exfiltration immediately.',
    'cloud_security',
    45,
    {
      distractor_rationale: [
        'WRONG - scheduling a quarterly ticket delays response and leaves unauthorized administrative keys active for months.',
        'CORRECT - revoking unauthorized API keys, auditing logs, and rotating credentials halts potential cloud compromise instantly.',
        'WRONG - deleting storage buckets destroys business data rather than addressing the unauthorized API credential.',
        'WRONG - disabling MFA globally drastically weakens security posture during an active cloud security incident.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1098',
      rotation_bucket: 'cloud_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security architect is designing an enterprise identity management strategy to protect against pass-the-hash and credential theft attacks on Windows domains. Which combination of controls is mandatory?',
    [
      'Mandating that all standard domain users update their account passwords every thirty days without exception',
      'Disabling Kerberos authentication across all network domains and relying exclusively on legacy NTLM protocols',
      'Deploying commercial email gateway spam filtering software to block inbound phishing attachments at the perimeter',
      'Enforcing tiered administrative models and enabling Credential Guard to isolate sensitive credentials in memory'
    ],
    3,
    'Tiered admin models and Credential Guard prevent administrative credentials from being cached in LSASS where hashes can be stolen.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - forced monthly password changes for standard users do not prevent administrative hash theft or pass-the-hash.',
        'WRONG - disabling Kerberos in favor of NTLM is a critical security downgrade that increases exposure to hash attacks.',
        'WRONG - email gateway spam filtering blocks inbound email threats rather than protecting domain credential memory.',
        'CORRECT - tiered administrative models and Credential Guard prevent administrative hash extraction from LSASS memory.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An incident response team recovering from a complex intrusion wants to ensure that all introduced persistence mechanisms are eradicated. What is the most robust validation procedure?',
    [
      'Performing a comprehensive forensic review of scheduled tasks, registry run keys, services, and authorized user accounts',
      'Confirming that all office printer hardware devices are powered on and connected to local network switches',
      'Checking that the enterprise website loads successfully for external customers browsing from public networks',
      'Verifying that the monthly electricity bill for the server data center facility matches historical averages'
    ],
    0,
    'Thoroughly auditing all common persistence vectors (tasks, registry keys, services, accounts) ensures complete threat eradication.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - comprehensive forensic review of persistence locations ensures no hidden backdoors remain in the environment.',
        'WRONG - printer connectivity checks ensure peripheral operations rather than validating host-level security hygiene.',
        'WRONG - public web page loading verifies basic web service availability rather than system-level persistence removal.',
        'WRONG - electricity billing reviews monitor facility utility costs rather than enterprise server security state.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1547',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An organization is updating its enterprise vulnerability management program. Which metric provides the most meaningful evaluation of remediation performance over time?',
    [
      'Total financial expenditure allocated toward third-party penetration testing consultant retainers',
      'Aggregate gigabytes of raw log data ingested daily by the centralized SIEM analytics platform',
      'Mean Time to Remediate critical and high-severity vulnerabilities across production asset groups',
      'Total count of general support tickets submitted by internal employees to the IT helpdesk'
    ],
    2,
    'Mean Time to Remediate (MTTR) measures how efficiently security and IT teams patch identified vulnerabilities.',
    'metrics',
    45,
    {
      distractor_rationale: [
        'WRONG - penetration testing retainer expenditures measure budgeting scale rather than vulnerability patch velocity.',
        'WRONG - raw log ingestion volume measures data collection scale rather than vulnerability remediation speed.',
        'CORRECT - MTTR tracks the speed and efficiency with which vulnerability remediation is executed across assets.',
        'WRONG - helpdesk support ticket counts measure general IT assistance volume rather than security patching.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'M1047',
      rotation_bucket: 'metrics',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Following a successful phishing attack that compromised employee credentials, executive leadership asks how to prevent similar recurrences. What is the most effective strategic control?',
    [
      'Requiring employees to print out and physically sign a paper pledge agreeing never to click suspicious links',
      'Transitioning the entire enterprise authentication model from passwords to phishing-resistant FIDO2 hardware tokens',
      'Disabling external email communication entirely and restricting all messaging exclusively to internal memos',
      'Increasing the minimum required enterprise password length from eight characters up to nine characters'
    ],
    1,
    'Phishing-resistant FIDO2 hardware tokens render credential harvesting and credential-stealing phishing pages ineffective.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - paper pledges rely on administrative policy compliance rather than technical cryptographic controls.',
        'CORRECT - FIDO2 hardware tokens provide phishing-resistant authentication that cannot be bypassed via credential harvest pages.',
        'WRONG - disabling external email communication paralyzes external business operations and client interactions.',
        'WRONG - increasing password length by a single character fails to protect against modern phishing-based interception.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security engineer is configuring network segmentation for an industrial control network. Which principle should guide the architecture between IT and OT environments?',
    [
      'Connecting all enterprise workstations directly to industrial control switches to maximize network speed and throughput',
      'Removing all perimeter firewalls between IT and OT to eliminate network latency and simplify management overhead',
      'Relying entirely on employee verbal security assurances rather than technical firewall packet filtering rules',
      'Implementing strict unidirectional or firewall-enforced gateway controls to isolate operational networks from corporate IT'
    ],
    3,
    'Isolating OT networks from IT via strict firewall gateways prevents corporate compromises from spilling into critical industrial systems.',
    'architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - connecting IT workstations to OT switches exposes critical industrial control systems to general malware spread.',
        'WRONG - removing perimeter firewalls between IT and OT creates catastrophic security exposure across critical infrastructure.',
        'WRONG - relying on verbal assurances rather than technical packet filters violates foundational security architecture.',
        'CORRECT - strict firewall gateway isolation protects industrial control systems from IT network compromise vectors.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'M1030',
      rotation_bucket: 'architecture',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise incident response plan requires a post-incident review meeting following any Severity-1 security event. What is the primary governance outcome expected from this session?',
    [
      'Determining which specific technical staff members should receive formal written employment termination notices',
      'Drafting misleading public press statements designed to minimize regulatory scrutiny and conceal breach scope',
      'Permanently disabling all centralized security monitoring and audit logging tools to reduce operational costs',
      'Producing a prioritized corrective action list with assigned owners to close root-cause security gaps permanently'
    ],
    3,
    'Post-incident reviews must yield actionable, assigned corrective actions to fix root causes and prevent recurrence.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - focusing meetings on staff termination fosters a toxic culture and discourages transparent incident reporting.',
        'WRONG - drafting misleading statements to conceal breach scope violates regulatory compliance and corporate ethics.',
        'WRONG - disabling security monitoring tools blinds the organization and guarantees future catastrophic failures.',
        'CORRECT - prioritized corrective actions with assigned owners ensure root-cause vulnerabilities are permanently fixed.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'M1016',
      rotation_bucket: 'governance',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An incident responder analyzing a compromised endpoint discovers a suspicious scheduled task configured to execute an obfuscated PowerShell script every system startup. What MITRE ATT&CK technique is represented here?',
    [
      'Scheduled Task execution leveraging built-in OS operating system utilities for persistence and automated startup',
      'Process Injection targeting active runtime memory spaces of legitimate system administration binaries',
      'Account Manipulation involving the creation of hidden local administrative shadow user accounts',
      'Boot or Logon Initialization Scripts executed automatically during user session establishment'
    ],
    0,
    'Configuring scheduled tasks to run scripts upon system startup is a primary technique for maintaining persistence (T1053.005).',
    'persistence',
    45,
    {
      distractor_rationale: [
        'CORRECT - scheduled tasks configured at startup match MITRE technique T1053.005 for persistence.',
        'WRONG - process injection manipulates active runtime memory rather than creating scheduled tasks.',
        'WRONG - account manipulation creates or modifies user accounts rather than scheduling startup tasks.',
        'WRONG - logon scripts execute during user login sessions rather than general system startup.'
      ],
      cognitive_level: 2,
      difficulty: 3,
      coverage_tag: 'T1053.005',
      rotation_bucket: 'persistence',
      last_validated: '2026-11-19'
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
    'A Windhoek financial services firm suffers a ransomware attack that encrypts primary file shares and domain controllers. SOC analysts confirm the deployment payload was executed via Group Policy. What is the immediate priority?',
    [
      'Contact external threat actor negotiation representatives immediately to discuss payment terms and decryption timelines',
      'Isolate infected hosts, preserve volatile memory forensics, and disconnect offline immutable backups from the core network',
      'Reinstall the operating system on all impacted endpoints simultaneously while keeping all core network switches online',
      'Power down all domain controllers instantly to prevent the encryption key from propagating further across replication links'
    ],
    1,
    'Isolating hosts and safeguarding offline immutable backups prevents reinfection while preserving evidence for forensic analysis.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - engaging threat actors prematurely finances criminal operations without guaranteeing decryption key delivery.',
        'CORRECT - immediate isolation and protecting immutable backups stops the spread and preserves recovery options.',
        'WRONG - reinstalling systems without disconnecting networks risks immediate reinfection through persistent vectors.',
        'WRONG - abrupt power down of domain controllers can corrupt Active Directory databases and complicate recovery.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1486',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'During a ransomware containment operation, an administrator discovers that shadow copies have been deleted across all workstations via `vssadmin.exe`. What MITRE ATT&CK technique does this represent?',
    [
      'Data Destruction via low-level storage overwriting tools deployed by secondary threat actors',
      'Indicator Removal on Host through deleting logs and clearing audit event tracking records',
      'Service Stop or Modify executed to disable security controls and monitoring agents',
      'Inhibit System Recovery via service manipulation and automated scheduled task creation procedures'
    ],
    3,
    'Deleting volume shadow copies prevents local file recovery, aligning directly with Inhibit System Recovery (T1490).',
    'defense_evasion',
    30,
    {
      distractor_rationale: [
        'WRONG - data destruction targets file integrity or partition tables rather than backup snapshots.',
        'WRONG - indicator removal focuses on clearing event logs rather than file system shadow storage.',
        'WRONG - service stopping targets running daemons rather than file system volume shadow services.',
        'CORRECT - deleting shadow copies directly matches the MITRE technique for inhibiting system recovery.'
      ],
      cognitive_level: 2,
      difficulty: 3,
      coverage_tag: 'T1490',
      rotation_bucket: 'defense_evasion',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Johannesburg healthcare provider recovers from a ransomware deployment but finds persistent command-and-control beacons calling out every 60 seconds. What is the most defensible containment action?',
    [
      'Ignore the outbound network traffic since the primary ransomware encryption payload has already been neutralized',
      'Block the destination IP addresses at the perimeter firewall and isolate the beaconing hosts for offline triage',
      'Disable the local host firewall entirely to allow incident response agents unhindered telemetry access',
      'Upgrade the core enterprise firewall software license to unlock advanced deep packet inspection modules'
    ],
    1,
    'Persistent beacons indicate remaining persistence mechanisms (scheduled tasks or registry keys) requiring immediate network isolation and perimeter blocking.',
    'containment',
    45,
    {
      distractor_rationale: [
        'WRONG - ignoring outbound beacons leaves active command-and-control channels open for threat actor re-entry.',
        'CORRECT - blocking C2 IPs and isolating hosts stops potential secondary payload delivery and data exfiltration.',
        'WRONG - disabling host firewalls exposes endpoints directly to internal lateral movement vectors.',
        'WRONG - firewall license upgrades do not remediate infected endpoints exhibiting active beacon behavior.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1071',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Lagos enterprise experiences a ransomware event where the attackers exfiltrated 500GB of sensitive customer data prior to encryption. The extortionists demand a ransom under threat of public publication. How should leadership respond?',
    [
      'Pay the ransom immediately in cryptocurrency to ensure the stolen data is permanently deleted by the threat actor',
      'Refuse payment, notify data protection regulators, engage legal counsel, and prepare transparent stakeholder communications',
      'Deny the data exfiltration publicly in the press and take no further technical remediation actions on database servers',
      'Transfer all enterprise operations to an unverified cloud provider while negotiations with the extortionists continue'
    ],
    1,
    'Data extortion requires regulatory reporting, legal guidance, and stakeholder transparency; paying offers zero guarantee of data deletion.',
    'extortion',
    45,
    {
      distractor_rationale: [
        'WRONG - paying cybercriminals provides zero cryptographic or contractual guarantee that exfiltrated data is destroyed.',
        'CORRECT - regulatory reporting, legal guidance, and stakeholder transparency form the standard defensible response to extortion.',
        'WRONG - public denial without technical containment or regulatory notification violates compliance mandates.',
        'WRONG - shifting operations to unverified environments during an active breach compounds operational risk.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1567',
      rotation_bucket: 'extortion',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An incident responder analyzing an infected endpoint finds that the ransomware binary injected itself into `explorer.exe` to evade security tools. What process injection technique was likely utilized?',
    [
      'Portable Executable mapping and direct thread creation via undocumented system calls',
      'Dynamic Link Library injection targeting standard Windows explorer memory spaces',
      'Process Hollowing or Process Injection into a legitimate running system binary',
      'Registry Run Key modification to ensure execution persistence across system reboots'
    ],
    2,
    'Injecting code into legitimate system binaries like explorer.exe to mask activity is characteristic of process injection (T1055).',
    'defense_evasion',
    45,
    {
      distractor_rationale: [
        'WRONG - PE mapping loads binaries differently from standard runtime process injection models.',
        'WRONG - DLL injection loads external libraries rather than executing direct memory payload migration.',
        'CORRECT - process injection or hollowing into legitimate binaries allows execution under trusted process contexts.',
        'WRONG - registry modifications provide persistence across reboots rather than active memory execution.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1055',
      rotation_bucket: 'defense_evasion',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Namibian parastatal discovers that ransomware operators gained initial access via compromised VPN credentials lacking multi-factor authentication. What is the most robust structural remediation?',
    [
      'Require remote workers to submit manual weekly login access logs via secure corporate email forms',
      'Disable remote virtual private network access entirely and mandate physical on-site terminal connections',
      'Enforce phishing-resistant multi-factor authentication across all remote access gateways immediately',
      'Increase the corporate password complexity threshold from eight characters to twelve characters minimum'
    ],
    2,
    'Phishing-resistant MFA on remote gateways eliminates credential stuffing and single-factor compromise vectors.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - manual login logs introduce administrative overhead and fail to prevent unauthorized access in real time.',
        'WRONG - completely disabling remote access paralyzes modern business operations unnecessarily.',
        'CORRECT - enforcing phishing-resistant MFA directly neutralizes credential-based remote access compromises.',
        'WRONG - complex passwords alone remain vulnerable to credential stuffing if multi-factor authentication is absent.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A security team is designing a backup strategy for enterprise file servers to protect against modern ransomware that attempts to compromise backup repositories. What design principle is essential?',
    [
      'Storing primary backup snapshots on secondary operational network shares accessible via standard service accounts',
      'Implementing offline or WORM (Write Once, Read Many) immutable storage tiers isolated from domain admin credentials',
      'Relying solely on continuous real-time cloud synchronization folders to mirror active production databases instantly',
      'Configuring automated daily backup rotations that overwrite previous historical archives to conserve storage capacity'
    ],
    1,
    'WORM immutable storage and air-gapped or role-separated access prevents ransomware from encrypting or deleting backup repositories.',
    'backup_security',
    45,
    {
      distractor_rationale: [
        'WRONG - secondary operational network shares can be accessed and encrypted by ransomware if domain credentials are compromised.',
        'CORRECT - WORM immutable storage and separation from domain admin access prevents ransomware encryption of backups.',
        'WRONG - continuous synchronization replicates malicious encryption changes immediately to backup targets.',
        'WRONG - overwriting historical archives eliminates point-in-time recovery options prior to infection discovery.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1490',
      rotation_bucket: 'backup_security',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'During post-incident recovery, an analyst notices that ransomware binaries were distributed through an unpatched vulnerability in an edge gateway device. What overarching program deficiency does this highlight?',
    [
      'Inadequate employee security awareness training regarding phishing email attachment handling',
      'Improper configuration of workstation endpoint detection and response agent heartbeat telemetry',
      'Excessive database administrator permissions granted across local departmental SQL servers',
      'Failure of enterprise vulnerability management, asset discovery, and rapid perimeter patch orchestration'
    ],
    3,
    'Edge gateway compromises point directly to gaps in vulnerability management, asset visibility, and patch cadence.',
    'vulnerability_management',
    45,
    {
      distractor_rationale: [
        'WRONG - phishing awareness targets user email behavior rather than unpatched perimeter network appliances.',
        'WRONG - EDR heartbeat issues impact endpoint monitoring rather than initial edge gateway exploitation.',
        'WRONG - internal SQL permissions do not account for external perimeter gateway vulnerabilities.',
        'CORRECT - edge device compromises highlight structural failures in asset discovery, vulnerability tracking, and patching.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1190',
      rotation_bucket: 'vulnerability_management',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An enterprise security architect wants to prevent lateral movement of ransomware across departmental subnetworks within the internal data center. Which technical control provides the strongest containment?',
    [
      'Deploying micro-segmentation policies using internal host firewalls to restrict unnecessary SMB and RPC traffic',
      'Installing enterprise antivirus software with signature definitions updated once every business quarter',
      'Configuring dynamic host configuration protocol scopes to rotate client IP addresses every 24 hours',
      'Enabling standard HTTP web filtering proxies for outbound employee internet browsing traffic'
    ],
    0,
    'Internal micro-segmentation blocks lateral movement protocols (SMB/RPC) between systems even if perimeter defenses are breached.',
    'network_segmentation',
    45,
    {
      distractor_rationale: [
        'CORRECT - micro-segmentation restricts internal SMB and RPC communication, stopping ransomware lateral spread.',
        'WRONG - quarterly signature updates are far too slow to protect against modern polymorphic ransomware variants.',
        'WRONG - daily DHCP IP rotation does not restrict protocol communication or prevent lateral movement.',
        'WRONG - web filtering proxies manage outbound internet access rather than internal server-to-server traffic.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1021',
      rotation_bucket: 'network_segmentation',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An incident response team is preparing a post-mortem report following a ransomware containment exercise. Which metric best evaluates the operational effectiveness of their detection controls?',
    [
      'Total financial expenditure allocated toward third-party incident response retainer contracts',
      'Mean Time to Detect (MTTD) from initial threat actor dwell time to verified SOC alert generation',
      'Aggregate volume of log storage consumed by secondary archival cloud logging buckets',
      'Total count of employee support tickets submitted to internal IT helpdesk during the quarter'
    ],
    1,
    'MTTD measures how quickly detection systems identify and flag malicious activity within the environment.',
    'metrics',
    45,
    {
      distractor_rationale: [
        'WRONG - financial retainer expenditures reflect budgeting rather than technical detection efficiency.',
        'CORRECT - MTTD directly measures how rapidly detection mechanisms identify anomalous threat behavior.',
        'WRONG - log storage volume measures data retention scale rather than detection control performance.',
        'WRONG - helpdesk ticket counts measure general IT support volume rather than security detection efficacy.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'M1047',
      rotation_bucket: 'metrics',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A ransomware group threatens to leak proprietary financial records unless a corporate executive pays a private fee. The executive asks the CISO if law enforcement should be contacted. What is the standard defensible guidance?',
    [
      'Decline law enforcement involvement entirely to prevent public regulatory scrutiny and media exposure',
      'Offer a partial ransom payment directly to the threat actors while concealing the event from authorities',
      'Engage law enforcement agencies immediately to share threat intelligence and coordinate potential intervention',
      'Rely exclusively on social media statements to negotiate directly with the extortion group publicly'
    ],
    2,
    'Involving law enforcement provides critical threat intelligence sharing and aligns with legal reporting obligations.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - concealing incidents from law enforcement violates reporting obligations and hampers broader tracking.',
        'WRONG - making partial payments encourages criminal syndicates and violates extortion mitigation protocols.',
        'CORRECT - engaging law enforcement supports intelligence sharing, legal compliance, and coordinated response.',
        'WRONG - public social media negotiations compromise tactical advantage and escalate corporate exposure.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'M1058',
      rotation_bucket: 'governance',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'Following a major ransomware incident, the board of directors requests a strategic review to ensure future resilience. What deliverable should the CISO prioritize first?',
    [
      'An immediate 50 percent budget reduction across all core cybersecurity monitoring software licenses',
      'A comprehensive root-cause analysis report accompanied by an prioritized hardening and remediation roadmap',
      'A public press release blaming junior IT staff members for operational security misconfigurations',
      'The termination of all external vendor software partnerships without evaluating dependency risks'
    ],
    1,
    'A thorough root-cause analysis and a prioritized remediation roadmap provide the actionable strategic guidance leadership needs.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - budget reductions degrade security visibility and increase vulnerability to subsequent attacks.',
        'CORRECT - root-cause analysis and a prioritized remediation roadmap provide the actionable guidance leadership requires.',
        'WRONG - public blame shifting damages organizational culture without addressing systemic vulnerabilities.',
        'WRONG - terminating vendor partnerships arbitrarily disrupts operations without resolving security gaps.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'M1054',
      rotation_bucket: 'governance',
      last_validated: '2026-11-18'
    }
  )
],
    18: [
  q(
    'An incident responder analyzing a compromised corporate server notices a hidden web shell embedded within the public-facing application directory. What is the most defensible immediate containment action?',
    [
      'Delete the single web shell file directly via SSH and leave the web server running in production to maintain business uptime',
      'Modify the file permissions of the web shell to read-only so that external threat actors can no longer execute arbitrary commands',
      'Isolate the compromised host from the network, preserve full forensic artifacts, and restore from a verified clean baseline backup',
      'Block the specific attacker IP address at the perimeter firewall while keeping the compromised application server fully active online'
    ],
    2,
    'Isolating the host, capturing forensic data, and restoring from a clean baseline is the only reliable way to handle web shell compromises.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - deleting a single web shell leaves underlying system compromises or alternative backdoors unaddressed.',
        'WRONG - setting files to read-only prevents modification but does not remove existing malicious code execution capabilities.',
        'CORRECT - full host isolation and clean restoration eliminates persistent backdoors and preserves forensic evidence.',
        'WRONG - blocking an attacker IP leaves the already deployed web shell accessible to secondary threat actor entry points.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1505.003',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security analyst reviewing endpoint telemetry detects an unexpected outbound connection on TCP port 4443 to an unknown external IP address originating from a finance workstation. What is the most appropriate initial investigation step?',
    [
      'Query the endpoint management inventory system to determine the exact hardware asset procurement date',
      'Terminate the active process ID associated with the network socket and inspect associated process creation command lines',
      'Reboot the enterprise core perimeter firewall to flush all active connection tables and routing caches',
      'Disable the user account associated with the finance workstation across the Active Directory domain controller'
    ],
    1,
    'Terminating the suspicious process and checking command lines identifies the executing binary and prevents data staging.',
    'investigation',
    45,
    {
      distractor_rationale: [
        'WRONG - hardware procurement dates are irrelevant to active network security investigations.',
        'CORRECT - inspecting process creation command lines and terminating the offending process identifies the threat source.',
        'WRONG - rebooting core firewalls disrupts all enterprise network traffic without resolving endpoint infection.',
        'WRONG - disabling the user account halts business operations without confirming whether the process was user-driven or malware.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1071',
      rotation_bucket: 'investigation',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise security team discovers that an attacker exfiltrated sensitive database records by tunneling traffic through DNS query requests. Which defensive control mitigates this technique most effectively?',
    [
      'Installing standard commercial antivirus software with signature databases updated once every calendar quarter',
      'Deploying an internal recursive DNS forwarding architecture that inspects and restricts abnormal query volume and length',
      'Enabling basic HTTP web browsing proxies for all employee internet connections across enterprise subnets',
      'Configuring dynamic host configuration protocol scopes to rotate client IP lease addresses every 24 hours'
    ],
    1,
    'Monitoring and restricting DNS query patterns, lengths, and volumes disrupts DNS tunneling communication channels.',
    'network_security',
    45,
    {
      distractor_rationale: [
        'WRONG - quarterly antivirus updates do not detect or block protocol-based DNS tunneling techniques.',
        'CORRECT - internal recursive DNS filtering and rate-limiting abnormal query volumes directly disrupts DNS tunneling.',
        'WRONG - HTTP web browsing proxies manage standard web traffic rather than custom DNS query protocols.',
        'WRONG - daily DHCP lease rotation changes IP addresses but does not inspect or restrict DNS traffic.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1071.004',
      rotation_bucket: 'network_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A financial institution wants to verify whether its security operations center can detect a simulated credential dumping attack against LSASS memory. Which testing methodology is most appropriate?',
    [
      'Performing a paper-based administrative walkthrough of physical server room badge access policies',
      'Reviewing automated vulnerability scanner compliance PDF reports generated once every calendar year',
      'Conducting an employee survey regarding password complexity preferences and corporate policy awareness',
      'Executing a controlled adversarial simulation using native tools like Mimikatz during an authorized red team engagement'
    ],
    3,
    'Adversarial simulation using actual post-exploitation tools tests whether EDR and SIEM rules successfully detect LSASS dumping.',
    'testing',
    45,
    {
      distractor_rationale: [
        'WRONG - paper-based badge walkthroughs verify physical security rather than endpoint memory protection controls.',
        'WRONG - annual vulnerability scanner reports test software patching rather than active behavioral detection.',
        'WRONG - employee password surveys measure user awareness rather than technical security monitoring efficacy.',
        'CORRECT - controlled adversarial simulation tests actual detection and alerting capabilities against real memory dumping TTPs.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'testing',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An administrator reviewing cloud tenant access logs notices a newly created API access key assigned full global administrative permissions, generated outside normal operational windows. What is the immediate priority?',
    [
      'Submit a formal IT service desk ticket requesting an administrative review meeting during the next scheduled quarter',
      'Delete the primary enterprise cloud storage bucket to prevent potential unauthorized data viewing by the key holder',
      'Revoke the unauthorized API key immediately, review cloud audit logs for recent activity, and rotate master credentials',
      'Disable multi-factor authentication requirements globally across the cloud tenant to simplify emergency access recovery'
    ],
    2,
    'Revoking unauthorized credentials and reviewing audit trails stops potential cloud persistence and data exfiltration immediately.',
    'cloud_security',
    45,
    {
      distractor_rationale: [
        'WRONG - scheduling a quarterly ticket delays response and leaves unauthorized administrative keys active for months.',
        'WRONG - deleting storage buckets destroys business data rather than addressing the unauthorized API credential.',
        'CORRECT - revoking unauthorized API keys, auditing logs, and rotating credentials halts potential cloud compromise instantly.',
        'WRONG - disabling MFA globally drastically weakens security posture during an active cloud security incident.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1098',
      rotation_bucket: 'cloud_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security architect is designing an enterprise identity management strategy to protect against pass-the-hash and credential theft attacks on Windows domains. Which combination of controls is mandatory?',
    [
      'Mandating that all standard domain users update their account passwords every thirty days without exception',
      'Disabling Kerberos authentication across all network domains and relying exclusively on legacy NTLM protocols',
      'Enforcing tiered administrative models and enabling Credential Guard to isolate sensitive credentials in memory',
      'Deploying commercial email gateway spam filtering software to block inbound phishing attachments at the perimeter'
    ],
    2,
    'Tiered admin models and Credential Guard prevent administrative credentials from being cached in LSASS where hashes can be stolen.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - forced monthly password changes for standard users do not prevent administrative hash theft or pass-the-hash.',
        'WRONG - disabling Kerberos in favor of NTLM is a critical security downgrade that increases exposure to hash attacks.',
        'CORRECT - tiered administrative models and Credential Guard prevent administrative hash extraction from LSASS memory.',
        'WRONG - email gateway spam filtering blocks inbound email threats rather than protecting domain credential memory.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An incident response team recovering from a complex intrusion wants to ensure that all introduced persistence mechanisms are eradicated. What is the most robust validation procedure?',
    [
      'Confirming that all office printer hardware devices are powered on and connected to local network switches',
      'Performing a comprehensive forensic review of scheduled tasks, registry run keys, services, and authorized user accounts',
      'Checking that the enterprise website loads successfully for external customers browsing from public networks',
      'Verifying that the monthly electricity bill for the server data center facility matches historical averages'
    ],
    1,
    'Thoroughly auditing all common persistence vectors (tasks, registry keys, services, accounts) ensures complete threat eradication.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - printer connectivity checks ensure peripheral operations rather than validating host-level security hygiene.',
        'CORRECT - comprehensive forensic review of persistence locations ensures no hidden backdoors remain in the environment.',
        'WRONG - public web page loading verifies basic web service availability rather than system-level persistence removal.',
        'WRONG - electricity billing reviews monitor facility utility costs rather than enterprise server security state.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1547',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security operations analyst notices an unusual spike in failed login attempts followed by a single successful authentication from an administrative account outside normal business hours. What should the analyst do first?',
    [
      'Assume the login was a legitimate administrative system maintenance task and close the SIEM alert ticket immediately',
      'Isolate the administrative account and associated endpoints, then verify the activity directly with the account owner',
      'Send an unencrypted broadcast email to all enterprise employees disclosing the exact administrative credentials involved',
      'Reboot all corporate domain controllers simultaneously without checking event logs to disrupt potential active sessions'
    ],
    1,
    'Brute-force followed by success indicates potential account takeover; immediate isolation and verification are essential.',
    'triage',
    45,
    {
      distractor_rationale: [
        'WRONG - closing security alerts without verification leaves active compromise indicators uninvestigated.',
        'CORRECT - isolating accounts and verifying activity with the owner is the standard triage response to potential compromise.',
        'WRONG - broadcasting unencrypted credentials via email creates a catastrophic secondary security exposure.',
        'WRONG - rebooting all domain controllers without log analysis disrupts operations and destroys volatile forensic data.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'triage',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An organization is updating its enterprise vulnerability management program. Which metric provides the most meaningful evaluation of remediation performance over time?',
    [
      'Total financial expenditure allocated toward third-party penetration testing consultant retainers',
      'Aggregate gigabytes of raw log data ingested daily by the centralized SIEM analytics platform',
      'Mean Time to Remediate (MTTR) critical and high-severity vulnerabilities across production asset groups',
      'Total count of general support tickets submitted by internal employees to the IT helpdesk'
    ],
    2,
    'Mean Time to Remediate (MTTR) measures how efficiently security and IT teams patch identified vulnerabilities.',
    'metrics',
    45,
    {
      distractor_rationale: [
        'WRONG - penetration testing retainer expenditures measure budgeting scale rather than vulnerability patch velocity.',
        'WRONG - raw log ingestion volume measures data collection scale rather than vulnerability remediation speed.',
        'CORRECT - MTTR tracks the speed and efficiency with which vulnerability remediation is executed across assets.',
        'WRONG - helpdesk support ticket counts measure general IT assistance volume rather than security patching.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'M1047',
      rotation_bucket: 'metrics',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Following a successful phishing attack that compromised employee credentials, executive leadership asks how to prevent similar recurrences. What is the most effective strategic control?',
    [
      'Transitioning the entire enterprise authentication model from passwords to phishing-resistant FIDO2 hardware tokens',
      'Requiring employees to print out and physically sign a paper pledge agreeing never to click suspicious links',
      'Disabling external email communication entirely and restricting all messaging exclusively to internal memos',
      'Increasing the minimum required enterprise password length from eight characters up to nine characters'
    ],
    0,
    'Phishing-resistant FIDO2 hardware tokens render credential harvesting and credential-stealing phishing pages ineffective.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'CORRECT - FIDO2 hardware tokens provide phishing-resistant authentication that cannot be bypassed via credential harvest pages.',
        'WRONG - paper pledges rely on administrative policy compliance rather than technical cryptographic controls.',
        'WRONG - disabling external email communication paralyzes external business operations and client interactions.',
        'WRONG - increasing password length by a single character fails to protect against modern phishing-based interception.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security engineer is configuring network segmentation for an industrial control network. Which principle should guide the architecture between IT and OT environments?',
    [
      'Connecting all enterprise workstations directly to industrial control switches to maximize network speed and throughput',
      'Removing all perimeter firewalls between IT and OT to eliminate network latency and simplify management overhead',
      'Relying entirely on employee verbal security assurances rather than technical firewall packet filtering rules',
      'Implementing strict unidirectional or firewall-enforced gateway controls to isolate operational networks from corporate IT'
    ],
    3,
    'Isolating OT networks from IT via strict firewall gateways prevents corporate compromises from spilling into critical industrial systems.',
    'architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - connecting IT workstations to OT switches exposes critical industrial control systems to general malware spread.',
        'WRONG - removing perimeter firewalls between IT and OT creates catastrophic security exposure across critical infrastructure.',
        'WRONG - relying on verbal assurances rather than technical packet filters violates foundational security architecture.',
        'CORRECT - strict firewall gateway isolation protects industrial control systems from IT network compromise vectors.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'M1030',
      rotation_bucket: 'architecture',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise incident response plan requires a post-incident review meeting following any Severity-1 security event. What is the primary governance outcome expected from this session?',
    [
      'Determining which specific technical staff members should receive formal written employment termination notices',
      'Drafting misleading public press statements designed to minimize regulatory scrutiny and conceal breach scope',
      'Permanently disabling all centralized security monitoring and audit logging tools to reduce operational costs',
      'Producing a prioritized corrective action list with assigned owners to close root-cause security gaps permanently'
    ],
    3,
    'Post-incident reviews must yield actionable, assigned corrective actions to fix root causes and prevent recurrence.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - focusing meetings on staff termination fosters a toxic culture and discourages transparent incident reporting.',
        'WRONG - drafting misleading statements to conceal breach scope violates regulatory compliance and corporate ethics.',
        'WRONG - disabling security monitoring tools blinds the organization and guarantees future catastrophic failures.',
        'CORRECT - prioritized corrective actions with assigned owners ensure root-cause vulnerabilities are permanently fixed.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'M1016',
      rotation_bucket: 'governance',
      last_validated: '2026-11-19'
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
    'A security analyst reviewing an enterprise SIEM notices multiple successful authentications from unusual IP addresses followed immediately by high volumes of sensitive customer data downloads. What is the most likely threat classification?',
    [
      'An internal privilege escalation campaign exploiting vulnerable unpatched domain controllers',
      'A credential-stuffing attack executed by automated botnets targeting legacy web portals',
      'A credential compromise followed by data exfiltration via unauthorized external channels',
      'A distributed denial-of-service event designed to exhaust corporate bandwidth allocations'
    ],
    2,
    'Unusual authentication sources followed by rapid data access patterns indicate compromised credentials leading directly to data exfiltration.',
    'credential_access',
    45,
    {
      distractor_rationale: [
        'WRONG - privilege escalation targets internal administrative permissions rather than external source IPs.',
        'WRONG - credential stuffing focuses on automated account takeover rather than targeted data exfiltration.',
        'CORRECT - unusual source IPs combined with high-volume downloads indicate compromised credentials and exfiltration.',
        'WRONG - denial-of-service events disrupt service availability rather than executing quiet data theft.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'credential_access',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'During a forensic investigation of a compromised Linux server, analysts discover a modified SSH binary (`sshd`) allowing backdoor access using a hardcoded master password. What defense mechanism would best detect this file integrity alteration?',
    [
      'An enterprise email gateway filtering inbound SMTP traffic for known malicious attachment signatures',
      'A host-based intrusion detection system performing cryptographic file integrity monitoring on system binaries',
      'A network perimeter firewall blocking unauthorized inbound TCP connections across non-standard ports',
      'A centralized domain controller policy enforcing complex password rotation rules every thirty days'
    ],
    1,
    'Host-based File Integrity Monitoring (FIM) computes cryptographic hashes of critical binaries to detect unauthorized modifications.',
    'defense_evasion',
    45,
    {
      distractor_rationale: [
        'WRONG - email gateways inspect inbound mail traffic and cannot audit local operating system binary integrity.',
        'CORRECT - file integrity monitoring detects unauthorized cryptographic hash changes in critical system binaries.',
        'WRONG - perimeter firewalls regulate network packet flows rather than inspecting local file modifications.',
        'WRONG - password rotation policies manage account credentials rather than detecting compromised system binaries.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1546',
      rotation_bucket: 'defense_evasion',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An incident responder analyzing a Windows endpoint discovers a suspicious scheduled task configured to execute an obfuscated PowerShell script every system startup. What MITRE ATT&CK sub-technique is represented here?',
    [
      'Process Injection targeting running memory spaces of legitimate system administration binaries',
      'Scheduled Task execution leveraging built-in OS utilities for persistence and automated startup',
      'Account Manipulation involving the creation of hidden local administrative shadow users',
      'Boot or Logon Initialization Scripts executed automatically during user session establishment'
    ],
    1,
    'Configuring scheduled tasks to run scripts upon system startup is a primary technique for maintaining persistence (T1053.005).',
    'persistence',
    45,
    {
      distractor_rationale: [
        'WRONG - process injection manipulates active runtime memory rather than creating scheduled tasks.',
        'CORRECT - scheduled tasks configured at startup match MITRE technique T1053.005 for persistence.',
        'WRONG - account manipulation creates or modifies user accounts rather than scheduling tasks.',
        'WRONG - logon scripts execute during user login sessions rather than general system startup.'
      ],
      cognitive_level: 2,
      difficulty: 3,
      coverage_tag: 'T1053.005',
      rotation_bucket: 'persistence',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC team detects a surge of outbound HTTPS traffic directed at a known cloud storage provider from a service account typically used only for internal database backups. What is the most appropriate initial containment response?',
    [
      'Reboot all regional database servers to flush active memory caches and network sockets',
      'Revoke active session tokens and disable the compromised service account immediately',
      'Upgrade the enterprise bandwidth allocation to accommodate the large data transfer rate',
      'Modify the corporate firewall rules to permit all outbound cloud storage traffic globally'
    ],
    1,
    'Revoking tokens and disabling compromised accounts stops ongoing data exfiltration immediately.',
    'containment',
    45,
    {
      distractor_rationale: [
        'WRONG - rebooting servers disrupts operations without terminating the underlying compromised session tokens.',
        'CORRECT - revoking tokens and disabling the account halts unauthorized data exfiltration instantly.',
        'WRONG - upgrading bandwidth accommodates the attack rather than stopping the unauthorized transfer.',
        'WRONG - modifying firewall rules to allow all traffic expands the exposure and worsens security posture.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1567.002',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An enterprise administrator notices that multiple domain user accounts are experiencing frequent lockout events after an external phishing campaign. What attack vector is most directly correlated with these symptoms?',
    [
      'A malicious kernel-level rootkit modifying system partition tables during boot sequences',
      'An unauthorized modification of Active Directory group policy administrative templates',
      'A brute-force or password-spraying attack attempting to discover valid account credentials',
      'A structured query language injection attack targeting external web application portals'
    ],
    2,
    'Repeated authentication failures across multiple accounts following phishing campaigns indicate automated brute-forcing or password spraying.',
    'credential_access',
    45,
    {
      distractor_rationale: [
        'WRONG - rootkits modify system files or kernels rather than triggering network account lockouts.',
        'WRONG - group policy modifications alter configuration settings rather than causing authentication lockouts.',
        'CORRECT - multiple account lockouts correlate directly with automated password spraying or brute-force attempts.',
        'WRONG - SQL injection targets web database applications rather than enterprise domain authentication thresholds.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1110.003',
      rotation_bucket: 'credential_access',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'During a security audit, engineers find that local administrator passwords across workstation endpoints are identical and hardcoded. What enterprise hardening control eliminates this vulnerability?',
    [
      'Enabling standard HTTP web filtering proxies for all outbound employee internet browsing traffic',
      'Deploying commercial antivirus software with signature definitions updated once every quarter',
      'Configuring dynamic host configuration protocol scopes to rotate client IP addresses daily',
      'Implementing Local Administrator Password Solution (LAPS) to randomize and manage unique credentials'
    ],
    3,
    'LAPS solves static local admin password reuse by automatically managing unique, randomized passwords per endpoint.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - web filtering proxies control outbound web access rather than endpoint administrator credentials.',
        'WRONG - quarterly antivirus updates do not address static local administrator password configurations.',
        'WRONG - daily DHCP IP rotation alters network addresses rather than managing endpoint credentials.',
        'CORRECT - LAPS randomizes and manages unique local administrator passwords across all domain endpoints.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'T1078.003',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A security analyst identifies a suspicious process executing PowerShell with the `-EncodedCommand` parameter and a heavily obfuscated base64 payload. What analysis step should be performed first?',
    [
      'Execute the encoded PowerShell script directly on a production workstation to observe live behavior',
      'Decode the base64 string offline in a secure sandbox to inspect the underlying execution commands',
      'Delete the local PowerShell executable binary from all enterprise endpoints to prevent execution',
      'Disable all logging services across the domain controller infrastructure to conserve disk space'
    ],
    1,
    'Decoding base64 payloads offline safely reveals the intent without risking execution on production systems.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - executing unknown obfuscated scripts on production endpoints risks immediate compromise or damage.',
        'CORRECT - decoding base64 strings offline in a sandbox safely exposes the underlying script intent.',
        'WRONG - deleting the PowerShell binary breaks legitimate system administration tools and dependencies.',
        'WRONG - disabling logging blinds the security team and destroys crucial forensic visibility.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1059.001',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An incident response team discovers that threat actors maintained access to a compromised cloud tenant by creating an unauthorized administrative service principal. What mitigation category applies here?',
    [
      'System Firmware integrity checks to verify bootloader cryptographic signatures',
      'Network Segmentation policies to restrict internal inter-subnet SMB traffic',
      'Physical Security controls restricting facility access to server rack enclosures',
      'Valid Accounts auditing and restricting cloud API credential creation privileges'
    ],
    3,
    'Auditing valid accounts and restricting creation privileges for service principals or API keys secures cloud tenants.',
    'cloud_security',
    45,
    {
      distractor_rationale: [
        'WRONG - system firmware checks verify hardware boot integrity rather than cloud service principal creation.',
        'WRONG - network segmentation manages internal subnet traffic rather than cloud tenant API credentials.',
        'WRONG - physical security controls protect server hardware facilities rather than cloud software identities.',
        'CORRECT - auditing valid accounts and restricting administrative API credential creation secures cloud environments.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1098.001',
      rotation_bucket: 'cloud_security',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A financial institution wants to evaluate the resilience of its defensive controls against sophisticated multi-stage intrusion campaigns. Which operational engagement provides the most realistic assessment?',
    [
      'Running an automated vulnerability scanner report once every calendar quarter for compliance',
      'Conducting an adversarial emulation exercise simulating specific threat actor tactics and procedures',
      'Reviewing static firewall configuration ruleset documents during an internal management meeting',
      'Inspecting physical security badge access logs at the main corporate reception desk daily'
    ],
    1,
    'Adversarial emulation (threat simulation) tests actual defensive detection and response capabilities against realistic TTPs.',
    'assessment',
    45,
    {
      distractor_rationale: [
        'WRONG - automated vulnerability scanners check known software flaws but do not test holistic SOC response.',
        'CORRECT - adversarial emulation simulates realistic threat TTPs to thoroughly test defensive detection capabilities.',
        'WRONG - reviewing static firewall documentation is a paper audit rather than a live security test.',
        'WRONG - inspecting badge logs verifies physical facility access rather than cyber defense resilience.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1485',
      rotation_bucket: 'assessment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'An organization implements a Zero Trust architecture. Which foundational principle governs resource access decisions within this model?',
    [
      'Implicit trust granted to all endpoints connected directly to the internal corporate physical network',
      'Permanent administrative privileges assigned to verified corporate employees after initial onboarding',
      'Continuous verification of identity, device health, and context before granting least-privilege access',
      'Unrestricted data sharing across internal departmental subnets to streamline workflow efficiency'
    ],
    2,
    'Zero Trust relies on continuous explicit verification and least privilege rather than trusting internal network perimeters.',
    'zero_trust',
    45,
    {
      distractor_rationale: [
        'WRONG - trusting internal network connections violates the core Zero Trust premise of verifying everything.',
        'WRONG - assigning permanent admin privileges violates the principle of least privilege.',
        'CORRECT - continuous verification of identity and context with least-privilege access defines Zero Trust architecture.',
        'WRONG - unrestricted inter-departmental data sharing creates excessive lateral movement exposure.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'M1037',
      rotation_bucket: 'zero_trust',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A security engineer is configuring SIEM correlation rules to detect potential lateral movement. Which event log signature indicates potential PsExec or remote service execution?',
    [
      'Standard HTTP status code 200 indicating successful web server page load requests',
      'Windows Event ID 7045 indicating a new service installation or Event ID 4697 service creation',
      'DHCP lease renewal event logs indicating a client IP address assignment update',
      'Printer spooler activity logs recording standard document print job completions'
    ],
    1,
    'Windows Event ID 7045 and 4697 record the installation of new services, frequently used by lateral movement tools like PsExec.',
    'monitoring',
    45,
    {
      distractor_rationale: [
        'WRONG - HTTP status code 200 represents standard web traffic rather than remote service installation.',
        'CORRECT - Windows Event IDs 7045 and 4697 record new service creation, characteristic of PsExec lateral movement.',
        'WRONG - DHCP lease renewals manage network IP allocations rather than tracking lateral movement.',
        'WRONG - printer spooler logs record document printing rather than administrative service creation.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1569.002',
      rotation_bucket: 'monitoring',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'Following a security incident, the incident response lead schedules a blameless post-mortem review with the technical team. What is the primary objective of this meeting?',
    [
      'Determine which individual employee staff members should face formal disciplinary warnings',
      'Minimize the severity of the security breach in official public press releases and disclosures',
      'Identify systemic operational improvements and refine detection rules without assigning personal blame',
      'Reduce internal logging retention periods to lower long-term cloud storage operational expenditures'
    ],
    2,
    'Blameless post-mortems focus on process, tooling, and systemic improvements to enhance future resilience.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - assigning personal blame undermines psychological safety and discourages transparent incident reporting.',
        'WRONG - minimizing severity for PR purposes compromises organizational integrity and stakeholder trust.',
        'CORRECT - blameless post-mortems focus on uncovering systemic gaps and improving detection without personal blame.',
        'WRONG - reducing log retention destroys historical data necessary for effective forensic investigations.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'M1016',
      rotation_bucket: 'governance',
      last_validated: '2026-11-18'
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
    'A Windhoek-based bank uses the same Domain Admin account for both server administration and daily email on a helpdesk laptop. A penetration test extracts the DA hash from the laptop within 20 minutes of getting local admin. What is the most defensible architectural fix?',
    [
      "Separate the DA account from daily-use accounts, enforce tiered admin where DA credentials only touch Tier-0 systems, and deploy Credential Guard on admin workstations",
      "Enforce a longer password policy on the DA account — 20 characters and 30-day rotation will make the hash uncrackable",
      "Disable the DA account entirely and use local admin accounts on each server",
      "Add EDR to the helpdesk laptop — EDR detects pass-the-hash tools and blocks them"
    ],
    0,
    'The problem is not the password — it is that the DA credential was exposed to a system the attacker could access. The architectural fix is tiering (DA credentials never touch user systems) plus Credential Guard (prevents hash extraction from LSASS). A longer password does not help if the hash is extracted from memory; EDR can miss pass-the-hash if the attacker uses native tools.',
    'credential_theft_techniques',
    45,
    {
      distractor_rationale: [
      "CORRECT - tiered admin plus Credential Guard prevents the hash from being exposed on systems the attacker can access.",
      "WRONG - a longer password does not help if the hash is extracted from LSASS; the attacker does not need the password to pass-the-hash.",
      "WRONG - disabling DA and using local admins everywhere is operationally unworkable in a domain and does not remove the credential-theft vector.",
      "WRONG - EDR can detect pass-the-hash tools but cannot prevent the technique if the attacker uses native tools or bypasses the EDR rule."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'credential_theft_techniques',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A SOC analyst sees a Sysmon Event ID 10 alert: `rundll32.exe` accessed `lsass.exe` with `GrantedAccess: 0x1010`. The process path is `C:\\Users\\Public\\rundll32.exe` and the parent process is `cmd.exe`. What is the most defensible interpretation?',
    [
      "The alert is a false positive — rundll32 accesses lsass as part of normal Windows operation",
      "This is a credential theft attempt: the non-standard path, the parent process, and the access mask are consistent with a Mimikatz-style LSASS dump. Isolate the host, preserve memory, and hunt for lateral movement",
      "The alert is low priority — access to lsass is expected and only the process path is unusual",
      "The alert can be closed after checking whether the user is an administrator — admins access lsass routinely"
    ],
    1,
    'Sysmon Event ID 10 with rundll32 accessing lsass from a non-standard path, spawned by cmd.exe, and using the 0x1010 access mask is a textbook credential-dump indicator. The access mask 0x1010 (PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ) is specifically what Mimikatz needs to read LSASS memory. This is not routine.',
    'detection_engineering',
    45,
    {
      distractor_rationale: [
      "WRONG - rundll32 does interact with lsass in some legitimate scenarios, but not from C:\\Users\\Public\\ and not spawned by cmd.exe with the 0x1010 access mask.",
      "CORRECT - the combination of non-standard path, anomalous parent process, and specific access mask is a credential-dump indicator; isolate and preserve.",
      "WRONG - the process path and parent process are the diagnostic indicators here, not the fact that lsass was accessed.",
      "WRONG - administrator status does not explain rundll32 running from C:\\Users\\Public\\ with cmd.exe as parent."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'detection_engineering',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Namibian government agency wants to enable Credential Guard on all workstations but 60% are running Windows 10 Home, which does not support it. What is the most defensible approach?',
    [
      "Accept that 60% of workstations are unprotected and document the risk — Credential Guard is not available on Windows Home",
      "Upgrade all Home workstations to Enterprise immediately — Credential Guard is essential and the cost is justified",
      "Deploy Credential Guard where supported on Enterprise, and for the Home workstations implement compensating controls: LAPS for local admin passwords, removal of Domain Admin credentials from these systems, and detection for LSASS access",
      "Disable Credential Guard everywhere so all workstations are treated equally"
    ],
    2,
    'Credential Guard requires Enterprise; Home does not support it. The defensible path is Credential Guard where possible plus compensating controls where not. Accepting the gap without compensating controls, upgrading without budget, and disabling everywhere are all failures.',
    'credential_defense',
    45,
    {
      distractor_rationale: [
      "WRONG - documenting the risk without compensating controls leaves the Home workstations unprotected; the tiering and detection controls can still be applied.",
      "WRONG - upgrading all workstations immediately is a budget decision, not a security decision; the compensating controls are available now.",
      "CORRECT - Credential Guard where supported, plus LAPS, removal of DA credentials, and LSASS detection on unsupported systems.",
      "WRONG - disabling Credential Guard everywhere reduces protection on the workstations that support it."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003',
      rotation_bucket: 'credential_defense',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Windhoek-based SME detects Mimikatz activity on a finance manager laptop. The SOC analyst is a one-person team and the laptop has the finance manager logged in with cached credentials. What is the most defensible first action?',
    [
      "Immediately reset all domain passwords — Mimikatz may have taken everything",
      "Wait until the next business day to investigate — the attacker may still be in the environment and rushing could tip them off",
      "Reboot the laptop to clear the attacker session",
      "Isolate the laptop from the network, capture memory for forensics, and reset the finance manager account credentials and revoke sessions in parallel"
    ],
    3,
    'The correct first action is to contain the host (isolate), preserve evidence (capture memory), and revoke the compromised credential in parallel. Resetting all domain passwords is disproportionate and disruptive; waiting lets the attacker move; rebooting destroys the memory evidence that proves what was extracted.',
    'incident_response',
    45,
    {
      distractor_rationale: [
      "WRONG - resetting all domain passwords is disproportionate and will cause operational disruption; revoke the specific compromised credentials first.",
      "WRONG - waiting a day gives the attacker hours to move laterally; the incident is live.",
      "WRONG - rebooting destroys the memory evidence and does not remove attacker persistence on the network.",
      "CORRECT - isolate, capture memory, revoke the finance manager account and sessions in parallel."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Kerberos ticket was extracted from a workstation five hours ago. The attacker is using it for lateral movement. The SOC team has revoked the user session but has not reset the krbtgt account. What is the most defensible explanation of the residual risk?',
    [
      "The risk is contained — revoking the user session invalidates the extracted ticket",
      "The residual risk is high: a Kerberos ticket-granting ticket (TGT) remains valid until it expires or the krbtgt is reset. Session revocation does not revoke already-issued tickets, and the attacker can request new tickets using the stolen TGT",
      "The risk is zero — Kerberos tickets are tied to the user password and expire after one hour",
      "The risk is moderate — the attacker cannot reuse the ticket outside the local network segment"
    ],
    1,
    'Kerberos tickets are not invalidated by password reset or session revocation until the krbtgt account is reset (twice, for the current and previous password history). A stolen TGT remains valid until it expires (default 10 hours) and can be used to request new service tickets. The residual risk is high and krbtgt reset is required.',
    'incident_response',
    45,
    {
      distractor_rationale: [
      "WRONG - session revocation does not invalidate already-issued Kerberos tickets; the TGT remains valid.",
      "CORRECT - the TGT remains valid until expiry; krbtgt reset (twice) is required to invalidate all issued tickets.",
      "WRONG - Kerberos TGTs have a 10-hour default lifetime, not one hour, and password reset does not invalidate them.",
      "WRONG - the extracted ticket can be used from anywhere the domain controller accepts Kerberos authentication, not just the local segment."
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1550.003',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Nairobi-based bank wants to detect Mimikatz-style credential theft at scale. Which detection approach has the highest coverage without excessive false positives?',
    [
      "Alert on any process accessing lsass.exe — this catches all credential dumping",
      "Alert on any process named \"mimikatz\" — signature-based detection catches the tool",
      "Alert on the specific combination of process path, parent process, and access mask for LSASS access, correlated with subsequent lateral movement from the same host",
      "Alert on the presence of any unsigned process on workstations"
    ],
    2,
    'Alerting on every process accessing lsass creates so much noise it will be ignored. Alerting on the specific combination (path, parent, access mask) plus correlation with lateral movement gives high signal. Signature-based detection misses renamed or obfuscated tooling; unsigned process detection is too broad.',
    'detection_engineering',
    45,
    {
      distractor_rationale: [
      "WRONG - too many legitimate processes access lsass; this alert will be ignored within a week.",
      "WRONG - signature-based detection misses renamed or obfuscated tools; Mimikatz source code is public and easy to recompile.",
      "CORRECT - the specific combination plus correlation catches the actual credential-dump pattern.",
      "WRONG - unsigned process detection generates enormous noise from legitimate tools and third-party applications."
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'detection_engineering',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A domain administrator at a Namibian bank asks: "If we deploy Credential Guard everywhere, do we still need to worry about Mimikatz?" What is the most defensible answer?',
    [
      "Yes — Credential Guard fully protects against Mimikatz and no other controls are needed",
      "Credential Guard is only relevant for Windows servers, not workstations",
      "Credential Guard is a Microsoft-only technology and provides no protection against third-party tools",
      "Credential Guard prevents LSASS memory extraction for the credentials it protects, but does not protect credentials outside the guarded scope (e.g., Kerberos tickets cached on unhardened systems), and does not eliminate pass-the-hash if hashes are extracted elsewhere"
    ],
    3,
    'Credential Guard protects the LSASS process from memory extraction for credentials that are in the Credential Guard scope, but it is not a complete defense. Credentials cached outside LSASS, tickets stored elsewhere, and hashes extracted from non-guarded systems remain exposure paths. Credential Guard is one layer, not a complete solution.',
    'credential_defense',
    45,
    {
      distractor_rationale: [
      "WRONG - Credential Guard is a strong control but not a complete solution; it protects a specific scope, not everything.",
      "WRONG - Credential Guard applies to workstations and servers where supported.",
      "WRONG - Credential Guard is a virtualization-based security control, not limited to Microsoft tools; it protects against any memory extraction.",
      "CORRECT - Credential Guard protects LSASS scope; other credential paths remain, and the answer names them."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1003',
      rotation_bucket: 'credential_defense',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A SOC analyst sees that a user account has successfully authenticated with both NTLM and Kerberos in the same 5-minute window, from two different IPs. The NTLM authentication is to a legacy file server. What is the most defensible interpretation?',
    [
      "Suspicious — the NTLM authentication from a second IP is likely a pass-the-hash attempt: the attacker has the NTLM hash and is using it to access the legacy server while the legitimate user is authenticated via Kerberos from their normal workstation",
      "Normal — the user has both a legacy application session and a modern application session",
      "Benign — NTLM and Kerberos are used interchangeably by Windows and no action is needed",
      "Low priority — NTLM authentication to a legacy server is expected and should not be alerted"
    ],
    0,
    'The combination of NTLM authentication from a different IP while the legitimate user is authenticated via Kerberos is a classic pass-the-hash indicator. The attacker has the NTLM hash and is using it from a different system. This is a specific detection pattern — NTLM plus different source IP plus concurrent Kerberos is worth escalating.',
    'detection_engineering',
    45,
    {
      distractor_rationale: [
      "CORRECT - NTLM from a second IP while the legitimate user is on Kerberos is a pass-the-hash pattern.",
      "WRONG - concurrent NTLM and Kerberos from different IPs for the same account in a 5-minute window is not normal; it is a specific indicator.",
      "WRONG - while Windows uses both, the concurrent use from different source IPs is the anomaly.",
      "WRONG - NTLM to a legacy server alone is expected; NTLM to a legacy server from a different IP while the user is on Kerberos elsewhere is not."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'detection_engineering',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Walvis Bay logistics company wants a 90-day plan to reduce Mimikatz risk. Which prioritization is most defensible?',
    [
      "Deploy Credential Guard to all workstations in month 1, deploy LAPS in month 2, enforce admin tiering in month 3",
      "Roll out EDR with LSASS protection to all workstations in month 1, and defer all other changes until the EDR is fully deployed",
      "Enforce admin tiering and remove Domain Admin credentials from user workstations first, then deploy LAPS and Credential Guard where supported, then add LSASS access detection",
      "Purchase a privileged access management product and defer all configuration changes until it is implemented"
    ],
    2,
    'The highest-leverage change is reducing where DA credentials are exposed. Tiering does that. LAPS and Credential Guard reduce the attack surface further but are less impactful if DA credentials are still on workstations. Detection is the safety net for what the preventive controls miss.',
    'incident_response',
    45,
    {
      distractor_rationale: [
      "WRONG - deploying Credential Guard first without removing DA from workstations still leaves DA credentials exposed on unsupported systems.",
      "WRONG - EDR is useful but deployment takes months and does not address the architectural exposure.",
      "CORRECT - tiering first removes the highest-leverage exposure; LAPS and Credential Guard follow; detection closes the residual gap.",
      "WRONG - PAM products are valuable but implementing one takes 6+ months; the configuration changes are available immediately."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A Namibian SME has an older domain controller that does not support Protected Users security group enforcement. The security team wants to reduce credential theft risk. What is the most defensible approach?',
    [
      "Abandon the domain controller and migrate to a modern one immediately — Protected Users is essential",
      "Rely on Protected Users alone — the group enforces credential protection across all domain controllers automatically",
      "Disable NTLM authentication for the legacy DC entirely, which removes the credential theft risk",
      "Add high-value accounts to Protected Users on the controllers that support it, and for the legacy DC, implement compensating controls: prohibit these accounts from authenticating to the legacy DC, restrict NTLM for these accounts, and add detection for their use on the legacy segment"
    ],
    3,
    'Protected Users is enforced per-domain-controller based on the controller OS. If a legacy DC does not support it, adding accounts to Protected Users may prevent authentication on the legacy DC or fall back to unprotected authentication. The defensible path is partial deployment with compensating controls on the legacy segment.',
    'credential_defense',
    45,
    {
      distractor_rationale: [
      "WRONG - immediate migration is a large project; the accounts need protection now with the controls available.",
      "WRONG - Protected Users enforcement depends on the domain controller OS; a legacy DC may not enforce it.",
      "WRONG - disabling NTLM entirely on the legacy DC may break applications that depend on it.",
      "CORRECT - Protected Users where supported, plus compensating controls (block authentication to legacy DC, restrict NTLM, detect usage) for the legacy segment."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1003',
      rotation_bucket: 'credential_defense',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A SOC analyst sees an alert for LSASS access from a legitimate-looking process: `C:\\Windows\\System32\\svchost.exe` accessing `lsass.exe`. The parent process is `explorer.exe`. What is the most defensible interpretation?',
    [
      "The alert is suspicious — svchost.exe should not be a child of explorer.exe and should not directly access lsass. This is likely a process-masquerading attack: an attacker has renamed Mimikatz to svchost.exe and launched it from explorer",
      "The alert is benign — svchost.exe is a legitimate Windows process",
      "The alert is low priority — svchost access to lsass is routine Windows behaviour",
      "The alert should be closed — svchost is a signed binary and only signed binaries can access lsass"
    ],
    0,
    'Process masquerading is a common technique: the attacker renames Mimikatz to svchost.exe, places it in a writable path, and runs it. The parent process (explorer.exe) is the tell — legitimate svchost instances are children of services.exe, not explorer. The path C:\\Windows\\System32\\svchost.exe is correct, which makes the masquerade more convincing but the parent process is the diagnostic indicator.',
    'detection_engineering',
    45,
    {
      distractor_rationale: [
      "CORRECT - process masquerading is indicated by the anomalous parent process; this is likely a renamed Mimikatz.",
      "WRONG - svchost.exe is legitimate, but the parent process (explorer.exe) is wrong; svchost should be a child of services.exe.",
      "WRONG - svchost accessing lsass is not routine; and the parent process is the diagnostic indicator regardless.",
      "WRONG - a signed binary path does not guarantee the running process is legitimate; the attacker can place a renamed tool in a signed path or use a signed tool for DLL sideloading."
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1036.005',
      rotation_bucket: 'detection_engineering',
      last_validated: '2026-11-17'
    }
  ),

  q(
    'A bank CISO asks: "If we detect Mimikatz and reset every password, are we safe?" What is the most defensible answer?',
    [
      "Yes — password reset removes the credential theft risk and the attacker cannot return",
      "No — the attacker may have stolen Kerberos tickets, golden tickets, or persisted via other means before detection. A full incident response is required: reset krbtgt twice, revoke all sessions, hunt for persistence, and validate that the attacker is not still active",
      "Partially — password reset helps for NTLM hashes but not for anything else",
      "No, but resetting all passwords and adding MFA is sufficient to prevent return"
    ],
    1,
    'Password reset does not invalidate Kerberos tickets (krbtgt reset is required), does not remove persistence mechanisms, and does not detect whether the attacker has stolen anything else. The defensible answer is a full IR that includes krbtgt reset, session revocation, persistence hunting, and validation of clean state.',
    'incident_response',
    45,
    {
      distractor_rationale: [
      "WRONG - password reset does not invalidate Kerberos tickets or persistence mechanisms; the attacker can remain active.",
      "CORRECT - full IR: krbtgt reset twice, revoke sessions, hunt persistence, validate clean state.",
      "WRONG - password reset helps for passwords but not for tickets or persistence; the answer should name what is still required.",
      "WRONG - MFA helps but does not remove stolen tickets or persistence; the attacker with a valid TGT bypasses MFA for ticket requests."
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1003.001',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-17'
    }
  )
],
    52: [
  q(
    'An incident response lead is reviewing a compromised Linux server and finds unusual processes communicating with an external command-and-control server. What is the most defensible immediate containment action?',
    [
      'Isolate the host from the network, preserve volatile memory artifacts, and initiate a clean system recovery baseline',
      'Terminate the active network socket connections while leaving the server connected to the production network online',
      'Modify the host firewall configuration to block outbound TCP port 80 traffic while maintaining all other routes',
      'Reboot the physical server hardware immediately without preserving volatile memory to disrupt the active process tree'
    ],
    0,
    'Isolating the host and preserving volatile memory before remediation ensures forensic integrity and stops active C2 traffic.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - host isolation and volatile memory preservation halt C2 communications while maintaining forensic integrity.',
        'WRONG - terminating active sockets alone leaves persistent malware and backdoors active on the running system.',
        'WRONG - blocking only port 80 ignores alternative C2 communication channels operating over ports 443, 53, or custom ports.',
        'WRONG - rebooting without memory preservation destroys critical volatile forensic artifacts stored in RAM.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1071',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security analyst reviewing SIEM alerts discovers multiple failed login attempts using common passwords against an external SSH gateway. What MITRE ATT&CK technique classification applies here?',
    [
      'Brute Force via Password Guessing or Password Spraying against exposed remote authentication portals',
      'Valid Accounts manipulation utilizing legitimate enterprise credentials to bypass perimeter access controls',
      'Account Discovery via local system user enumeration scripts executed within a privileged shell',
      'Exploitation of Remote Services targeting unpatched vulnerabilities in SSH server daemons'
    ],
    0,
    'Repeated login attempts using common passwords against a remote service match Brute Force (T1110).',
    'credential_access',
    30,
    {
      distractor_rationale: [
        'CORRECT - multiple failed login attempts with common passwords directly match the brute force technique.',
        'WRONG - valid accounts involve using known good credentials rather than iterative trial and error guessing.',
        'WRONG - account discovery enumerates existing user accounts locally rather than attempting external logins.',
        'WRONG - remote service exploitation targets software vulnerabilities rather than guessing authentication passwords.'
      ],
      cognitive_level: 2,
      difficulty: 3,
      coverage_tag: 'T1110',
      rotation_bucket: 'credential_access',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise security architect wants to prevent lateral movement of malware across internal departmental subnets within a corporate data center. Which technical control provides the most robust containment?',
    [
      'Installing standard commercial antivirus software with signature definitions updated once every business quarter',
      'Deploying internal micro-segmentation policies via host-based firewalls to restrict unnecessary SMB and RPC traffic',
      'Configuring dynamic host configuration protocol scopes to rotate client IP lease addresses every 24 hours',
      'Enabling standard HTTP web browsing proxies for all employee internet connections across enterprise subnets'
    ],
    1,
    'Internal micro-segmentation restricts critical lateral movement protocols (SMB/RPC) between internal network hosts.',
    'network_segmentation',
    45,
    {
      distractor_rationale: [
        'WRONG - quarterly antivirus signature updates are far too slow to mitigate active lateral movement vectors.',
        'CORRECT - micro-segmentation restricts internal protocol communications, effectively stopping lateral movement spread.',
        'WRONG - daily DHCP IP address rotation changes client addresses but does not restrict inter-host network traffic.',
        'WRONG - web browsing proxies manage outbound internet access rather than internal host-to-host data flows.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1021',
      rotation_bucket: 'network_segmentation',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A financial institution discovers that threat actors exfiltrated sensitive customer database records prior to deploying ransomware. The extortionists demand a ransom under threat of public leak. How should leadership respond?',
    [
      'Pay the ransom immediately in cryptocurrency to ensure the stolen data is permanently deleted by the threat actor',
      'Deny the data exfiltration publicly in the press and take no further technical remediation actions on database servers',
      'Transfer all enterprise operations to an unverified cloud provider while negotiations with the extortionists continue',
      'Refuse payment, notify data protection regulators, engage legal counsel, and prepare transparent stakeholder communications'
    ],
    3,
    'Data extortion requires regulatory notification, legal consultation, and stakeholder transparency rather than ransom payment.',
    'extortion',
    45,
    {
      distractor_rationale: [
        'WRONG - paying cybercriminals provides zero cryptographic or contractual guarantee that exfiltrated data is destroyed.',
        'WRONG - public denial without technical containment or regulatory notification violates compliance mandates.',
        'WRONG - shifting operations to unverified environments during an active breach compounds operational risk.',
        'CORRECT - regulatory reporting, legal guidance, and stakeholder transparency form the standard defensible response.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1567',
      rotation_bucket: 'extortion',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An administrator reviewing cloud tenant access logs notices a newly created API access key assigned full global administrative permissions, generated outside normal operational windows. What is the immediate priority?',
    [
      'Revoke the unauthorized API key immediately, review cloud audit logs for recent activity, and rotate master credentials',
      'Submit a formal IT service desk ticket requesting an administrative review meeting during the next scheduled quarter',
      'Delete the primary enterprise cloud storage bucket to prevent potential unauthorized data viewing by the key holder',
      'Disable multi-factor authentication requirements globally across the cloud tenant to simplify emergency access recovery'
    ],
    0,
    'Revoking unauthorized credentials and auditing logs stops potential cloud persistence and data exfiltration immediately.',
    'cloud_security',
    45,
    {
      distractor_rationale: [
        'CORRECT - revoking unauthorized API keys, auditing logs, and rotating credentials halts potential cloud compromise instantly.',
        'WRONG - scheduling a quarterly ticket delays response and leaves unauthorized administrative keys active for months.',
        'WRONG - deleting storage buckets destroys business data rather than addressing the unauthorized API credential.',
        'WRONG - disabling MFA globally drastically weakens security posture during an active cloud security incident.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1098',
      rotation_bucket: 'cloud_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security team is designing a backup strategy for enterprise file servers to protect against modern ransomware that attempts to compromise backup repositories. What design principle is essential?',
    [
      'Storing primary backup snapshots on secondary operational network shares accessible via standard service accounts',
      'Implementing offline or WORM immutable storage tiers isolated from administrative credentials',
      'Relying solely on continuous real-time cloud synchronization folders to mirror active production databases instantly',
      'Configuring automated daily backup rotations that overwrite previous historical archives to conserve storage capacity'
    ],
    1,
    'WORM immutable storage and air-gapped or role-separated access prevents ransomware from encrypting backup repositories.',
    'backup_security',
    45,
    {
      distractor_rationale: [
        'WRONG - secondary operational network shares can be accessed and encrypted by ransomware if domain credentials are compromised.',
        'CORRECT - WORM immutable storage and separation from administrative access prevents ransomware encryption of backups.',
        'WRONG - continuous synchronization replicates malicious encryption changes immediately to backup targets.',
        'WRONG - overwriting historical archives eliminates point-in-time recovery options prior to infection discovery.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1490',
      rotation_bucket: 'backup_security',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'During post-incident recovery, an analyst notices that ransomware binaries were distributed through an unpatched vulnerability in an edge gateway device. What overarching program deficiency does this highlight?',
    [
      'Inadequate employee security awareness training regarding phishing email attachment handling',
      'Failure of enterprise vulnerability management, asset discovery, and rapid perimeter patch orchestration',
      'Improper configuration of workstation endpoint detection and response agent heartbeat telemetry',
      'Excessive database administrator permissions granted across local departmental SQL servers'
    ],
    1,
    'Edge gateway compromises point directly to gaps in vulnerability management, asset visibility, and patch cadence.',
    'vulnerability_management',
    45,
    {
      distractor_rationale: [
        'WRONG - phishing awareness targets user email behavior rather than unpatched perimeter network appliances.',
        'CORRECT - edge device compromises highlight structural failures in asset discovery, vulnerability tracking, and patching.',
        'WRONG - EDR heartbeat issues impact endpoint monitoring rather than initial edge gateway exploitation.',
        'WRONG - internal SQL permissions do not account for external perimeter gateway vulnerabilities.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1190',
      rotation_bucket: 'vulnerability_management',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An organization is updating its enterprise vulnerability management program. Which metric provides the most meaningful evaluation of remediation performance over time?',
    [
      'Mean Time to Remediate critical and high-severity vulnerabilities across production asset groups',
      'Total financial expenditure allocated toward third-party penetration testing consultant retainers',
      'Aggregate gigabytes of raw log data ingested daily by the centralized SIEM analytics platform',
      'Total count of general support tickets submitted by internal employees to the IT helpdesk'
    ],
    0,
    'Mean Time to Remediate (MTTR) measures how efficiently security and IT teams patch identified vulnerabilities.',
    'metrics',
    45,
    {
      distractor_rationale: [
        'CORRECT - MTTR tracks the speed and efficiency with which vulnerability remediation is executed across assets.',
        'WRONG - penetration testing retainer expenditures measure budgeting scale rather than vulnerability patch velocity.',
        'WRONG - raw log ingestion volume measures data collection scale rather than vulnerability remediation speed.',
        'WRONG - helpdesk support ticket counts measure general IT assistance volume rather than security patching.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'M1047',
      rotation_bucket: 'metrics',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Following a successful phishing attack that compromised employee credentials, executive leadership asks how to prevent similar recurrences. What is the most effective strategic control?',
    [
      'Requiring employees to print out and physically sign a paper pledge agreeing never to click suspicious links',
      'Disabling external email communication entirely and restricting all messaging exclusively to internal memos',
      'Transitioning the entire enterprise authentication model from passwords to phishing-resistant FIDO2 hardware tokens',
      'Increasing the minimum required enterprise password length from eight characters up to nine characters'
    ],
    2,
    'Phishing-resistant FIDO2 hardware tokens render credential harvesting and credential-stealing phishing pages ineffective.',
    'identity_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - paper pledges rely on administrative policy compliance rather than technical cryptographic controls.',
        'WRONG - disabling external email communication paralyzes external business operations and client interactions.',
        'CORRECT - FIDO2 hardware tokens provide phishing-resistant authentication that cannot be bypassed via credential harvest pages.',
        'WRONG - increasing password length by a single character fails to protect against modern phishing-based interception.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1566',
      rotation_bucket: 'identity_hardening',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security engineer is configuring network segmentation for an industrial control network. Which principle should guide the architecture between IT and OT environments?',
    [
      'Connecting all enterprise workstations directly to industrial control switches to maximize network speed and throughput',
      'Removing all perimeter firewalls between IT and OT to eliminate network latency and simplify management overhead',
      'Relying entirely on employee verbal security assurances rather than technical firewall packet filtering rules',
      'Implementing strict unidirectional or firewall-enforced gateway controls to isolate operational networks from corporate IT'
    ],
    3,
    'Isolating OT networks from IT via strict firewall gateways prevents corporate compromises from spilling into critical industrial systems.',
    'architecture',
    45,
    {
      distractor_rationale: [
        'WRONG - connecting IT workstations to OT switches exposes critical industrial control systems to general malware spread.',
        'WRONG - removing perimeter firewalls between IT and OT creates catastrophic security exposure across critical infrastructure.',
        'WRONG - relying on verbal assurances rather than technical packet filters violates foundational security architecture.',
        'CORRECT - strict firewall gateway isolation protects industrial control systems from IT network compromise vectors.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'M1030',
      rotation_bucket: 'architecture',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise incident response plan requires a post-incident review meeting following any Severity-1 security event. What is the primary governance outcome expected from this session?',
    [
      'Determining which specific technical staff members should receive formal written employment termination notices',
      'Drafting misleading public press statements designed to minimize regulatory scrutiny and conceal breach scope',
      'Producing a prioritized corrective action list with assigned owners to close root-cause security gaps permanently',
      'Permanently disabling all centralized security monitoring and audit logging tools to reduce operational costs'
    ],
    2,
    'Post-incident reviews must yield actionable, assigned corrective actions to fix root causes and prevent recurrence.',
    'governance',
    45,
    {
      distractor_rationale: [
        'WRONG - focusing meetings on staff termination fosters a toxic culture and discourages transparent incident reporting.',
        'WRONG - drafting misleading statements to conceal breach scope violates regulatory compliance and corporate ethics.',
        'CORRECT - prioritized corrective actions with assigned owners ensure root-cause vulnerabilities are permanently fixed.',
        'WRONG - disabling security monitoring tools blinds the organization and guarantees future catastrophic failures.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'M1016',
      rotation_bucket: 'governance',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An incident responder analyzing a compromised endpoint discovers a suspicious scheduled task configured to execute an obfuscated PowerShell script every system startup. What MITRE ATT&CK technique is represented here?',
    [
      'Scheduled Task execution leveraging built-in OS operating system utilities for persistence and automated startup',
      'Process Injection targeting active runtime memory spaces of legitimate system administration binaries',
      'Account Manipulation involving the creation of hidden local administrative shadow user accounts',
      'Boot or Logon Initialization Scripts executed automatically during user session establishment'
    ],
    0,
    'Configuring scheduled tasks to run scripts upon system startup is a primary technique for maintaining persistence (T1053.005).',
    'persistence',
    45,
    {
      distractor_rationale: [
        'CORRECT - scheduled tasks configured at startup match MITRE technique T1053.005 for persistence.',
        'WRONG - process injection manipulates active runtime memory rather than creating scheduled tasks.',
        'WRONG - account manipulation creates or modifies user accounts rather than scheduling startup tasks.',
        'WRONG - logon scripts execute during user login sessions rather than general system startup.'
      ],
      cognitive_level: 2,
      difficulty: 3,
      coverage_tag: 'T1053.005',
      rotation_bucket: 'persistence',
      last_validated: '2026-11-19'
    }
  )
],
    58: [
  q(
    'A Windhoek bank runs a BloodHound scan and finds a Helpdesk group with GenericAll over a Tier-0-adjacent account. What is the most defensible response?',
    [
      'Close as theoretical — the path only matters if Helpdesk credentials are already compromised elsewhere',
      'Remove the dangerous ACLs, enforce tiered admin boundaries, and audit which Helpdesk users can start the path',
      'Assign explicit deny ACEs on all intermediate objects so the Helpdesk path is blocked globally',
      'Add EDR to Helpdesk workstations, since the path only works if the workstation already has malware'
    ],
    1,
    'BloodHound paths are the exact privilege relationships attackers enumerate. A three-hop path from Helpdesk is a real escalation vector. The fix is identity tiering: remove the excess ACLs, enforce tier boundaries, and audit who in Helpdesk can start the chain.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
        'WRONG - "requires Helpdesk credentials" is the point: Helpdesk credentials are commonly phished, and the path is what the attacker does next.',
        'CORRECT - remove the dangerous ACLs, enforce tiering, audit which Helpdesk users can start the path.',
        'WRONG - explicit deny ACEs can introduce complex precedence issues and administrative overhead in enterprise environments.',
        'WRONG - the path is exploitable through legitimate credentials; EDR does not remove the privilege relationship.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1484',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Johannesburg insurer finds a four-hop BloodHound path to Domain Admin through a service account with unconstrained delegation on a print server. What is the most defensible first action?',
    [
      'Disable the print server and reimage it — print servers are low-value and the delegation is legacy',
      'Leave the delegation but add monitoring for any authentication events involving the print server itself',
      'Restrict the print server to a separate VLAN, which removes the attack path without touching the account',
      'Remove the unconstrained delegation, rotate the account credentials, and audit dependent services first'
    ],
    3,
    'Unconstrained delegation on a print server is a classic escalation path: an attacker who compromises the server can impersonate any user who authenticates to it, including Domain Admins. The fix is removing the delegation and understanding what depends on it — not reimaging the server or adding a VLAN.',
    'privilege_escalation',
    45,
    {
      distractor_rationale: [
        'WRONG - reimaging the print server does not remove the delegation from the service account; the delegation follows the account.',
        'WRONG - monitoring detects the exploit after the fact; it does not remove the delegation that enables it.',
        'WRONG - VLAN segmentation does not remove the delegation privilege; an attacker reaching the server on any path can still exploit it.',
        'CORRECT - remove the delegation, rotate credentials, audit dependencies before restoring.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1558',
      rotation_bucket: 'privilege_escalation',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Lagos fintech runs a Kerberoasting test and extracts three service account hashes in under 5 minutes. The passwords were set four years ago and are 12 characters. What is the most defensible remediation?',
    [
      'Rotate to 30+ character random passwords in gMSAs, remove unused SPNs, and audit ticket requestors',
      'Set the domain password policy to require a new password every 30 days for all service accounts',
      'Disable Kerberos authentication entirely and switch the affected accounts to NTLM for compatibility',
      'Delete the three service accounts and reinstall the applications they support on new infrastructure'
    ],
    0,
    'Kerberoasting exploits weak service account passwords by extracting the ticket hash and cracking it offline. Rotating to a 30+ character random password in a gMSA removes the crackability; removing unused SPNs reduces the target set; auditing requestors closes the discovery step.',
    'privilege_escalation',
    45,
    {
      distractor_rationale: [
        'CORRECT - gMSA with a 30+ character password removes crackability; removing unused SPNs reduces the target set.',
        'WRONG - forced rotation every 30 days does not help if passwords remain short or predictable.',
        'WRONG - disabling Kerberos and switching to NTLM is a security downgrade; NTLM is weaker.',
        'WRONG - deleting the service accounts breaks the applications; the fix is to secure the accounts, not remove them.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1558.003',
      rotation_bucket: 'privilege_escalation',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Namibian agency detects pass-the-hash: an attacker is using a stolen NTLM hash to authenticate to multiple servers. The SOC isolated one server but the attacker is still authenticating elsewhere. What next?',
    [
      'Force a password reset for the compromised user — pass-the-hash requires the password to be known',
      'Reboot all servers on the network to clear any cached credentials stored in memory',
      'Change the domain administrator password immediately — this invalidates all hashes on the domain',
      'Disable the account, revoke active sessions, and isolate every server that accepted the hash'
    ],
    3,
    'Pass-the-hash uses the NTLM hash directly, not the password. Disabling the account stops new authentications but does not revoke sessions the attacker already has. The response is to disable the account, revoke sessions, and isolate every server where the hash was accepted.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
        'WRONG - pass-the-hash uses the hash, not the password; changing the password does not invalidate the hash.',
        'WRONG - rebooting does not clear credentials on the attacker side; it disrupts operations.',
        'WRONG - changing the DA password only affects the DA account; it does not address the compromised user hash.',
        'CORRECT - disable the account, revoke sessions, isolate servers that accepted the hash.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Rundu clinic IT manager wants to reduce the AD attack surface but has no budget. What is the most defensible set of free or low-cost actions?',
    [
      'Deploy LAPS, remove Domain Users from local Administrators, and enable Credential Guard',
      'Purchase a commercial AD monitoring tool — free tools cannot detect realistic attack paths',
      'Consolidate all administrative rights into a single shared account to simplify access logs',
      'Move all AD services to a cloud provider — cloud AD is immune to BloodHound-style attacks'
    ],
    0,
    'LAPS is free, removing Domain Users from local Administrators is a configuration change, and Credential Guard is available on supported Windows editions. All three reduce the attack surface without budget. Commercial tools, shared accounts, and cloud migration are not immediate fixes.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
        'CORRECT - LAPS, removing Domain Users from local admins, and Credential Guard are free and materially reduce exposure.',
        'WRONG - free tools like PingCastle and BloodHound Community Edition detect attack paths.',
        'WRONG - consolidating admin rights into a shared account destroys auditability and violates least privilege.',
        'WRONG - cloud AD is a different attack surface; hybrid AD still has BloodHound paths.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Nairobi bank finds 14 Domain Users with direct BloodHound paths to Tier-0 resources through group nesting. What is the most defensible first action?',
    [
      'Remove all 14 from the groups immediately — the paths are critical and delay is unacceptable',
      'Leave the paths in place but add monitoring for any Tier-0 access by any of the 14 users now',
      'Move the 14 users to a separate OU so the paths no longer appear in default BloodHound view',
      'Map which groups each user actually needs, reduce excess nesting, and notify managers first'
    ],
    3,
    'The correct first action is to understand which paths are legitimate and which are excess nesting that was never intentional. Removing without analysis breaks legitimate workflows. Moving OUs does not break privilege relationships — the path remains, just hidden from the default view.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
        'WRONG - removing all 14 immediately breaks legitimate access and causes operational disruption.',
        'WRONG - monitoring detects the exploit after the fact; the path is still there.',
        'WRONG - moving OUs does not break privilege paths; the group nesting still exists.',
        'CORRECT - map actual need, reduce excess nesting, communicate with managers before changes.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Windhoek SME domain controller has NTLM enabled for an old application. The security team wants to disable NTLM but the application owner says it will break. What is the most defensible approach?',
    [
      'Disable NTLM immediately — the security risk outweighs any application that depends on it',
      'Leave NTLM enabled permanently — backward compatibility for the application matters more',
      'Audit NTLM use, upgrade the application to Kerberos, and disable NTLM in stages',
      'Switch to a third-party authentication product — this removes the NTLM problem entirely'
    ],
    2,
    'Disabling NTLM is the right end state, but doing it immediately breaks the application. The defensible path is audit, upgrade, staged disable, and monitoring — the same discipline as any legacy protocol removal.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - disabling NTLM immediately without knowing dependencies will break integrations.',
        'WRONG - leaving NTLM enabled permanently accepts the risk indefinitely.',
        'CORRECT - audit, upgrade, staged disable, monitoring; the discipline for removing any legacy protocol.',
        'WRONG - third-party authentication products may still use NTLM internally; the protocol problem remains.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC analyst sees a successful Kerberos authentication from a user account disabled 40 minutes earlier. What is the most defensible interpretation?',
    [
      'A false positive — disabled accounts cannot authenticate, so the alert is wrong',
      'The account was re-enabled by IT without the alert being updated; check the change log',
      'A golden ticket or forged Kerberos ticket using a stolen krbtgt hash is the likely cause',
      'The user is on a legacy system that does not check the disabled flag; close the alert'
    ],
    2,
    'A disabled account authenticating successfully is one of the strongest indicators of a forged ticket. The krbtgt hash is the domain-wide ticket-granting key; an attacker with it can forge tickets for any account, including disabled ones. This is a golden ticket alert and requires immediate escalation.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
        'WRONG - the alert is real; disabled accounts should not authenticate, and success is the anomaly.',
        'WRONG - checking the change log is reasonable but should not delay escalation.',
        'CORRECT - disabled account authenticating is a golden ticket indicator; escalate and consider krbtgt reset.',
        'WRONG - legacy systems do check the disabled flag for Kerberos; the interpretation is not supported.'
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1558.001',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Namibian bank wants to prevent pass-the-hash. Which control has the highest impact?',
    [
      'Deploying EDR on all workstations — EDR detects pass-the-hash tools when they execute',
      'Enforcing tiered admin plus Credential Guard on all admin workstations across the domain',
      'Requiring all users to change their passwords every 30 days with high complexity rules',
      'Disabling NTLM across the domain without any migration path for legacy applications'
    ],
    1,
    'Pass-the-hash is prevented by ensuring the hash never reaches a system the attacker can access. Tiered admin plus Credential Guard means DA credentials are only entered on hardened systems, and Credential Guard prevents hash extraction from LSASS.',
    'ad_hardening',
    45,
    {
      distractor_rationale: [
        'WRONG - EDR can detect pass-the-hash tools but does not prevent the technique if native tools are used.',
        'CORRECT - tiered admin plus Credential Guard prevents the hash from being exposed where the attacker can reach it.',
        'WRONG - forced rotation does not prevent pass-the-hash; the hash of the new password is still reusable.',
        'WRONG - disabling NTLM immediately breaks applications; the disciplined path is audit and migration.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'ad_hardening',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A BloodHound scan shows all Tier-0 Domain Admins have active sessions on user workstations. What is the most defensible interpretation and remediation?',
    [
      'The finding is benign — Domain Admins need to log in to workstations to do their job',
      'The finding is critical: an attacker on any workstation can capture DA credentials from memory',
      'The finding is a BloodHound bug — DA sessions should not appear on standard user workstations',
      'The finding can be resolved by adding MFA to the workstations, which prevents credential theft'
    ],
    1,
    'DA sessions on workstations mean the DA credentials are exposed to any attacker who compromises the workstation. Tiered admin (DA credentials only on Tier-0 systems) prevents the exposure. MFA on workstations does not prevent credential extraction from memory.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
        'WRONG - DA sessions on workstations are one of the top privilege escalation paths in real breaches.',
        'CORRECT - an attacker on any workstation with a DA session can extract DA credentials; tiered admin is the fix.',
        'WRONG - BloodHound accurately reports sessions; it is not a bug.',
        'WRONG - MFA on the workstation protects the login, not the in-memory credentials after login.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'T1078',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Walvis Bay logistics company has AD audit logs but no alerting on Kerberos anomalies. The CISO asks whether that is acceptable. What is the most defensible answer?',
    [
      'Acceptable — the logs are reviewed quarterly, which is sufficient for a company of this size',
      'Acceptable — Kerberoasting and golden tickets are rare in African SMEs, so alerting is overkill',
      'Not acceptable — near-real-time alerting on Kerberos anomalies is the minimum standard',
      'Not acceptable — but the fix is to disable Kerberos entirely and rely on NTLM instead'
    ],
    2,
    'Kerberos attacks are detectable through specific signals: unusual SPN ticket requests, RC4 downgrade, disabled account success. Quarterly log review means the attack has hours-to-days to operate. Near-real-time alerting is the minimum for a company that has AD.',
    'lateral_movement',
    45,
    {
      distractor_rationale: [
        'WRONG - quarterly review means an attack can operate for up to 90 days undetected.',
        'WRONG - African SMEs are targeted; the assumption that these attacks are rare is not supported.',
        'CORRECT - near-real-time alerting on the specific Kerberos signals is the minimum standard.',
        'WRONG - disabling Kerberos and relying on NTLM is a security downgrade.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1558',
      rotation_bucket: 'lateral_movement',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Namibian SME wants to run a BloodHound scan to understand its AD attack surface. The IT manager asks what to do with the results. What is the most defensible answer?',
    [
      'Archive the results for compliance purposes — the scan satisfies the risk assessment',
      'Prioritise the highest-impact fixes: shortest paths to Tier-0, privilege nesting, and tiering',
      'Share the raw graph with all staff so everyone understands the full attack surface',
      'Run the scan quarterly but do not act on the results until the next budget cycle'
    ],
    1,
    'BloodHound results are most useful for prioritisation. The shortest paths to Tier-0 are the highest-leverage fixes; everything else is secondary. Archiving without action, sharing raw graphs, and waiting for budget are the three failure modes.',
    'ad_attack_paths',
    45,
    {
      distractor_rationale: [
        'WRONG - archiving without action does not reduce the attack surface.',
        'CORRECT - prioritise by path length to Tier-0, reduce privilege nesting, enforce tiering.',
        'WRONG - sharing raw AD graphs with all staff exposes the attack surface; it is a security risk.',
        'WRONG - waiting for the next budget cycle leaves the attack paths open for a year.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1484',
      rotation_bucket: 'ad_attack_paths',
      last_validated: '2026-11-18'
    }
  )
],
    60: [
  q(
    'A logistics hub in Walvis Bay detects an internal application server beaconing to an unfamiliar external IP over HTTPS every few minutes. What is the most defensible immediate response?',
    [
      'Isolate the host from the network, capture volatile memory forensics, and block the destination indicator',
      'Block the outbound IP at the edge firewall first and keep the server online to preserve customer traffic',
      'Restart the application service and rotate local service passwords before taking the host off the network',
      'Collect a disk image while the server stays live in production so ongoing sessions remain observable'
    ],
    0,
    'Isolating the host, preserving volatile memory, and blocking C2 stops active control while protecting forensic evidence.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - isolates the compromised host, preserves volatile evidence, and blocks C2 traffic.',
        'WRONG - keeping the host online allows alternative C2 channels or lateral movement to continue.',
        'WRONG - restarting services and rotating passwords locally before isolation risks tampering with active threats.',
        'WRONG - live imaging without isolation can miss active memory state and allows continued access.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Command and Control',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'During a security audit at a financial hub in Frankfurt, analysts find domain admin and local admin rights held persistently by several operations accounts. What is the most defensible fix?',
    [
      'Keep standing admin rights in place and require two-person approval before running high-risk changes',
      'Enforce least-privilege role separation, remove standing excess privileges, and require just-in-time elevation',
      'Move privileged accounts onto dedicated jump hosts while keeping broad domain group memberships active',
      'Enforce longer password rotation intervals on privileged accounts to reduce credential reuse risk'
    ],
    1,
    'Removing standing privileges and enforcing least privilege with just-in-time elevation shrinks credential blast radius.',
    'privilege_management',
    45,
    {
      distractor_rationale: [
        'WRONG - two-person approval adds friction without removing standing privileges if an account is hijacked.',
        'CORRECT - least privilege and just-in-time elevation remove standing access paths used for lateral spread.',
        'WRONG - jump hosts help access paths, but standing broad privileges still allow wide lateral movement.',
        'WRONG - password rotation alone does not stop an attacker who steals an active session or token.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Privilege Escalation',
      rotation_bucket: 'privilege_management',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A retail operation across Oshakati and Windhoek sees slow, distributed login failures across hundreds of user accounts from external IPs, followed by occasional sign-in successes. What best counters this?',
    [
      'Enforce stricter password complexity and 60-day expiry across all user accounts to block guessing',
      'Restrict logins to regional IP ranges while keeping legacy push-based MFA enabled for convenience',
      'Enforce phishing-resistant multi-factor authentication, apply adaptive rate limiting, and alert on anomalies',
      'Require users to acknowledge updated acceptable-use policies before completing webmail authentication'
    ],
    2,
    'Phishing-resistant MFA paired with adaptive rate limiting and anomaly alerts stops password spraying and token theft.',
    'identity_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - password spraying relies on common passwords rather than weak complexity or rare expiries.',
        'WRONG - IP allowlists can be bypassed via VPNs/proxies, and push MFA is vulnerable to prompt fatigue.',
        'CORRECT - phishing-resistant MFA, adaptive rate limiting, and anomaly monitoring directly counter spraying.',
        'WRONG - policy acknowledgments do not block automated or phishing-assisted authentication attempts.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'Credential Access',
      rotation_bucket: 'identity_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise environment in Singapore permits broad east-west traffic between corporate workstations and internal database subnets after a VPN compromise. What architectural change best limits spread?',
    [
      'Place an inline intrusion prevention sensor between the VPN gateway and internal core switches',
      'Require network access control health checks on laptops before granting internal VLAN membership',
      'Deploy host-based endpoint detection across all workstations and database servers for faster alerting',
      'Enforce network segmentation and strict east-west firewall policies limiting access to required ports and hosts'
    ],
    3,
    'Segmenting zones and enforcing strict east-west access rules blocks lateral movement even if an endpoint is reached.',
    'network_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - inline inspection helps detect known patterns but does not enforce explicit least-privilege segmentation.',
        'WRONG - NAC checks device posture at entry but still leaves wide internal reachability once connected.',
        'WRONG - EDR improves detection and response, yet network segmentation prevents lateral paths upfront.',
        'CORRECT - segmentation and east-west controls directly restrict lateral movement between zones.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Lateral Movement',
      rotation_bucket: 'network_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A SOC lead in London notices endpoint security agents occasionally stopping during maintenance windows while administrators deploy software updates. What is the most defensible operational control?',
    [
      'Protect security services with tamper protection, alert on service stops, and audit administrative changes',
      'Allow local administrators to pause endpoint agents during scheduled change windows if documented in tickets',
      'Rely on daily configuration drift scans to detect when an endpoint agent was stopped the previous day',
      'Increase endpoint agent health-check intervals so brief service restarts do not generate false alerts'
    ],
    0,
    'Tamper protection, real-time stop alerts, and change auditing protect visibility without creating blind spots.',
    'telemetry_integrity',
    45,
    {
      distractor_rationale: [
        'CORRECT - tamper protection, stop alerts, and change audits preserve telemetry and flag evasion attempts.',
        'WRONG - allowing agent pauses creates windows an attacker can use to evade detection or disable controls.',
        'WRONG - next-day drift scans react too late if an intrusion occurs while the agent is stopped.',
        'WRONG - widening health-check intervals delays detection of genuine agent tampering or crashes.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Defense Evasion',
      rotation_bucket: 'telemetry_integrity',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After containing an intrusion at a Swakopmund plant, responders find a scheduled task launching an encoded script. What should they do next to ensure thorough eradication?',
    [
      'Remove the scheduled task and verify that the associated service account password has been rotated',
      'Audit all common persistence locations, validate authorized accounts and tasks, and re-scan the host',
      'Quarantine the script binary and monitor the host for 72 hours before cleaning remaining startup entries',
      'Rebuild only the affected application directory from a clean image while keeping OS configuration intact'
    ],
    1,
    'Auditing all persistence paths, validating accounts and tasks, and re-scanning prevents re-entry via hidden footholds.',
    'eradication',
    45,
    {
      distractor_rationale: [
        'WRONG - removing one task and rotating one password misses other persistence hooks on the system.',
        'CORRECT - full persistence auditing, account/task validation, and re-scanning confirm thorough cleanup.',
        'WRONG - waiting 72 hours with known persistence remnants leaves active footholds in place.',
        'WRONG - application-only rebuilds leave OS-level scheduled tasks, services, or run keys untouched.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Persistence',
      rotation_bucket: 'eradication',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An organization operating across Nairobi and São Paulo wants to ensure recovery if an attacker gains administrative control over production systems. Which backup practice is most defensible?',
    [
      'Store encrypted backups on a dedicated backup server with separate local credentials and daily verification',
      'Replicate critical databases continuously to a secondary region using the same service account permissions',
      'Maintain immutable or offline backups isolated from production credentials and test restores regularly',
      'Keep two independent backup copies on separate storage arrays managed by the same IT operations team'
    ],
    2,
    'Immutable or offline backups isolated from production credentials—with tested restores—survive identity compromise.',
    'resilience',
    45,
    {
      distractor_rationale: [
        'WRONG - dedicated servers with daily checks help, but without immutability or offline isolation backups can be altered.',
        'WRONG - continuous replication with shared permissions can replicate destructive changes or encryption.',
        'CORRECT - immutable/offline isolation from production credentials plus tested restores protects recovery.',
        'WRONG - separate arrays under the same credential/access scope still risk coordinated deletion or encryption.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Impact',
      rotation_bucket: 'resilience',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security team at a port hub in Rotterdam spots large outbound transfers from an internal file server to an unfamiliar cloud endpoint at night. What is the most defensible response?',
    [
      'Throttle outbound bandwidth on the file server and review firewall logs at the start of the next shift',
      'Place a packet capture on the egress interface and monitor whether the transfer completes cleanly',
      'Revoke the file server service account token and wait for DLP alerts to classify the transferred files',
      'Contain the affected server, block the destination, review access logs for staged data, and scope exposure'
    ],
    3,
    'Containing the host, blocking the destination, and auditing file access logs limits exfiltration and scopes impact.',
    'exfiltration_response',
    45,
    {
      distractor_rationale: [
        'WRONG - throttling and waiting until morning lets exfiltration continue over hours.',
        'WRONG - passive capture alone does not stop ongoing data loss to an external destination.',
        'WRONG - waiting on DLP classification delays containment while sensitive data continues leaving.',
        'CORRECT - host containment, destination blocking, and access log review address exfiltration directly.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'Exfiltration',
      rotation_bucket: 'exfiltration_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A company experiences a targeted spear-phishing wave using malicious attachments and lookalike login pages. Which layered defense best reduces both delivery and user compromise?',
    [
      'Deploy banner warnings on external emails and run quarterly phishing simulation exercises for staff',
      'Combine email authentication controls, attachment/link filtering, and phishing-resistant MFA with reporting',
      'Block all ZIP and macro-enabled attachments at the mail gateway while keeping standard SMS one-time codes',
      'Require users to open suspicious attachments inside a browser-isolated viewer without changing MFA policy'
    ],
    1,
    'Email authentication, attachment/link inspection, phishing-resistant MFA, and reporting address multiple attack stages.',
    'phishing_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - banners and simulations alone do not block lookalike login pages or credential capture.',
        'CORRECT - layered technical controls plus user reporting reduce both delivery and compromise.',
        'WRONG - attachment rules alone do not stop credential harvesting on lookalike sign-in pages, and SMS MFA is weaker.',
        'WRONG - isolated viewers do not stop credential capture on phishing links or malicious web forms.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'Initial Access',
      rotation_bucket: 'phishing_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An administrator in Windhoek finds an internet-facing application server running a vulnerable component with a public exploit available. What is the most defensible risk reduction approach?',
    [
      'Add a web application firewall rule to block known exploit payloads while scheduling patching next quarter',
      'Move the server to a DMZ subnet and restrict SSH/management ports to internal VPN IP addresses',
      'Patch or retire the vulnerable service, restrict exposure via network controls, and track remediation SLAs',
      'Accept the residual risk temporarily since internal databases sit behind a separate application tier'
    ],
    2,
    'Patching or retiring vulnerable exposure and restricting network reachability—tracked by SLA—removes the root flaw.',
    'vulnerability_remediation',
    45,
    {
      distractor_rationale: [
        'WRONG - WAF rules can be bypassed and delay fixing the underlying vulnerability when exploits are public.',
        'WRONG - restricting management ports helps administration, but the exposed vulnerable service still remains.',
        'CORRECT - patching/retiring, restricting exposure, and enforcing SLAs reduce risk systematically.',
        'WRONG - multi-tier design alone does not neutralize an actively exploitable edge vulnerability.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Initial Access',
      rotation_bucket: 'vulnerability_remediation',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A global SOC manager sees analysts spending most of their shift triaging low-fidelity alerts while high-risk detections sit queued. What is the most defensible operational improvement?',
    [
      'Tune noisy rules, prioritize high-fidelity detections mapped to key risks, and standardize triage playbooks',
      'Add more tier-1 analysts to the queue so every low-fidelity alert receives a full manual investigation',
      'Raise alert severity thresholds globally so only critical alerts appear on the main SOC monitoring board',
      'Forward all raw endpoint and firewall events to an external managed service without tuning existing rules'
    ],
    0,
    'Tuning noisy detections, prioritizing high-risk signals, and standardizing playbooks raises signal quality and speed.',
    'soc_operations',
    45,
    {
      distractor_rationale: [
        'CORRECT - tuning noise, prioritizing high-risk signals, and playbooks improve triage focus.',
        'WRONG - adding headcount to low-fidelity noise wastes capacity without fixing poor signal quality.',
        'WRONG - blanket threshold hikes can hide medium-severity early intrusion steps that lead to breaches.',
        'WRONG - forwarding untuned volume moves noise elsewhere without improving detection fidelity.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Discovery',
      rotation_bucket: 'soc_operations',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After containing a major security incident, leadership holds a review meeting. Which approach best supports long-term organizational learning and stronger defenses?',
    [
      'Document the incident timeline and update the incident response policy to reflect lessons from the event',
      'Conduct a blameless post-incident review to document root causes, refine controls, and track action items',
      'Review detection rule performance with the SOC team and close the incident once containment is confirmed',
      'Assign specific corrective actions to individual system owners based on who handled each alert during the event'
    ],
    1,
    'Blameless post-incident reviews uncover systemic root causes across people, process, and controls with tracked follow-through.',
    'post_incident_review',
    45,
    {
      distractor_rationale: [
        'WRONG - updating policy documents alone without systemic root-cause analysis and tracked fixes leaves gaps open.',
        'CORRECT - blameless reviews surface systemic root causes and drive durable control improvements.',
        'WRONG - stopping at rule tuning and containment misses broader process, identity, or architectural causes.',
        'WRONG - tying fixes to who handled an alert rather than systemic root causes misdirects accountability.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'Collection',
      rotation_bucket: 'post_incident_review',
      last_validated: '2026-11-19'
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
,

  2: [
  q(
    'A SOC team in Windhoek sees an internal endpoint connecting to an unfamiliar external IP over HTTPS at regular intervals. What is the most defensible immediate response?',
    [
      'Isolate the host from the network, capture volatile memory forensics, and block the destination indicator',
      'Block the outbound IP at the edge firewall first and keep the server online to preserve customer traffic',
      'Restart the host service and rotate local service passwords before taking the host off the network',
      'Collect a disk image while the server stays live in production so ongoing sessions remain observable'
    ],
    0,
    'Host isolation, volatile memory capture, and indicator blocking contain control while preserving evidence.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - isolates the host, preserves volatile state, and blocks outbound command traffic.',
        'WRONG - keeping the host online allows alternative channels or lateral movement to continue.',
        'WRONG - restarting and rotating locally before isolation risks altering active threat state.',
        'WRONG - live imaging without isolation risks missed memory state and ongoing access.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Command and Control',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'During a security audit at a financial center in Frankfurt, analysts find standing administrative access held by several standard operations accounts. What is the most defensible fix?',
    [
      'Keep standing admin rights in place and require two-person approval before running high-risk changes',
      'Enforce least-privilege role separation, remove standing excess privileges, and require just-in-time elevation',
      'Move privileged accounts onto dedicated jump hosts while keeping broad group memberships active',
      'Enforce longer password rotation intervals on privileged accounts to reduce credential reuse risk'
    ],
    1,
    'Removing standing privileges and enforcing least privilege with just-in-time elevation limits blast radius.',
    'privilege_management',
    45,
    {
      distractor_rationale: [
        'WRONG - approval workflows add friction without removing standing access if hijacked.',
        'CORRECT - least privilege and just-in-time elevation remove standing paths for lateral spread.',
        'WRONG - jump hosts constrain access paths but leave broad standing rights active.',
        'WRONG - password rotation alone does not stop stolen active sessions or tokens.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Privilege Escalation',
      rotation_bucket: 'privilege_management',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A retail group with sites in Walvis Bay and Swakopmund sees slow, distributed login failures across many user accounts from external IPs, followed by occasional successes. What best counters this?',
    [
      'Enforce stricter password complexity and 60-day expiry across all user accounts to block guessing',
      'Restrict logins to regional IP ranges while keeping legacy push-based MFA enabled for convenience',
      'Enforce phishing-resistant multi-factor authentication, apply adaptive rate limiting, and alert on anomalies',
      'Require users to acknowledge updated acceptable-use policies before completing webmail authentication'
    ],
    2,
    'Phishing-resistant MFA paired with adaptive rate limiting and anomaly alerts counters password spraying.',
    'identity_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - password spraying targets common passwords rather than complexity or rare expiries.',
        'WRONG - IP allowlists can be bypassed via VPNs/proxies, and push MFA faces prompt fatigue.',
        'CORRECT - phishing-resistant MFA, adaptive rate limiting, and anomaly alerts counter spraying.',
        'WRONG - policy acknowledgments do not block automated or phishing-assisted sign-ins.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'Credential Access',
      rotation_bucket: 'identity_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An enterprise network in Singapore allows broad east-west traffic between office workstations and internal database subnets after a VPN compromise. What architectural change best limits spread?',
    [
      'Place an inline intrusion prevention sensor between the VPN gateway and internal core switches',
      'Require network access control health checks on laptops before granting internal VLAN membership',
      'Deploy host-based endpoint detection across all workstations and database servers for faster alerting',
      'Enforce network segmentation and strict east-west firewall policies limiting access to required ports and hosts'
    ],
    3,
    'Network segmentation and strict east-west firewall policies block lateral movement across internal zones.',
    'network_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - inline inspection detects known patterns but does not enforce least-privilege reachability.',
        'WRONG - NAC checks posture at entry but leaves broad internal access once connected.',
        'WRONG - EDR aids detection and response, whereas segmentation prevents lateral paths upfront.',
        'CORRECT - segmentation and east-west controls directly restrict lateral movement.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Lateral Movement',
      rotation_bucket: 'network_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A SOC lead in London notices endpoint security agents occasionally stopping during maintenance windows while administrators deploy software updates. What is the most defensible operational control?',
    [
      'Protect security services with tamper protection, alert on service stops, and audit administrative changes',
      'Allow local administrators to pause endpoint agents during scheduled change windows if documented in tickets',
      'Rely on daily configuration drift scans to detect when an endpoint agent was stopped the previous day',
      'Increase endpoint agent health-check intervals so brief service restarts do not generate false alerts'
    ],
    0,
    'Tamper protection, stop alerts, and change auditing preserve telemetry without opening blind spots.',
    'telemetry_integrity',
    45,
    {
      distractor_rationale: [
        'CORRECT - tamper protection, stop alerts, and change audits protect monitoring integrity.',
        'WRONG - allowing pauses creates windows an attacker can use to evade or disable controls.',
        'WRONG - next-day drift scans react late if tampering happens while agents are stopped.',
        'WRONG - longer health-check intervals delay spotting genuine tampering or service failures.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Defense Evasion',
      rotation_bucket: 'telemetry_integrity',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After containing an intrusion at a northern branch in Oshakati, responders find a scheduled task launching an encoded script. What should they do next to ensure thorough eradication?',
    [
      'Remove the scheduled task and verify that the associated service account password has been rotated',
      'Audit all common persistence locations, validate authorized accounts and tasks, and re-scan the host',
      'Quarantine the script binary and monitor the host for 72 hours before cleaning remaining startup entries',
      'Rebuild only the affected application directory from a clean image while keeping OS configuration intact'
    ],
    1,
    'Auditing all persistence paths, validating accounts and tasks, and re-scanning prevents re-entry.',
    'eradication',
    45,
    {
      distractor_rationale: [
        'WRONG - removing one task and rotating one password can miss other persistence hooks.',
        'CORRECT - full persistence auditing, account/task validation, and re-scanning confirm cleanup.',
        'WRONG - waiting 72 hours with known persistence remnants leaves active footholds in place.',
        'WRONG - application-only rebuilds leave OS scheduled tasks, services, or run keys intact.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Persistence',
      rotation_bucket: 'eradication',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An organization operating across Nairobi and São Paulo wants to ensure recovery if an attacker gains administrative control over production systems. Which backup practice is most defensible?',
    [
      'Store encrypted backups on a dedicated backup server with separate local credentials and daily verification',
      'Replicate critical databases continuously to a secondary region using the same service account permissions',
      'Maintain immutable or offline backups isolated from production credentials and test restores regularly',
      'Keep two independent backup copies on separate storage arrays managed by the same IT operations team'
    ],
    2,
    'Immutable or offline backups isolated from production credentials—with tested restores—survive compromise.',
    'resilience',
    45,
    {
      distractor_rationale: [
        'WRONG - dedicated servers with daily checks alone lack immutability or offline isolation guarantees.',
        'WRONG - continuous replication with shared permissions can replicate destructive changes.',
        'CORRECT - immutable/offline isolation from production credentials plus tested restores protects recovery.',
        'WRONG - separate arrays under shared access scope still risk coordinated deletion or encryption.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Impact',
      rotation_bucket: 'resilience',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A security team at a logistics hub in Rotterdam spots large outbound transfers from an internal file server to an unfamiliar cloud endpoint at night. What is the most defensible response?',
    [
      'Throttle outbound bandwidth on the file server and review firewall logs at the start of the next shift',
      'Place a packet capture on the egress interface and monitor whether the transfer completes cleanly',
      'Revoke the file server service account token and wait for DLP alerts to classify the transferred files',
      'Contain the affected server, block the destination, review access logs for staged data, and scope exposure'
    ],
    3,
    'Containing the host, blocking the destination, and auditing file access logs limits exfiltration and scopes impact.',
    'exfiltration_response',
    45,
    {
      distractor_rationale: [
        'WRONG - throttling and waiting until morning lets exfiltration continue over hours.',
        'WRONG - passive capture alone does not stop ongoing data loss to an external target.',
        'WRONG - waiting on DLP classification delays containment while data continues leaving.',
        'CORRECT - host containment, destination blocking, and access log review address exfiltration.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'Exfiltration',
      rotation_bucket: 'exfiltration_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A company experiences a targeted spear-phishing wave using malicious attachments and lookalike login pages. Which layered defense best reduces both delivery and user compromise?',
    [
      'Deploy banner warnings on external emails and run quarterly phishing simulation exercises for staff',
      'Combine email authentication controls, attachment/link filtering, and phishing-resistant MFA with reporting',
      'Block all ZIP and macro-enabled attachments at the mail gateway while keeping standard SMS one-time codes',
      'Require users to open suspicious attachments inside a browser-isolated viewer without changing MFA policy'
    ],
    1,
    'Email authentication, attachment/link inspection, phishing-resistant MFA, and reporting address key stages.',
    'phishing_defense',
    45,
    {
      distractor_rationale: [
        'WRONG - banners and simulations alone do not block lookalike login pages or token capture.',
        'CORRECT - layered technical controls plus user reporting reduce delivery and compromise risk.',
        'WRONG - attachment rules do not stop lookalike login pages, and SMS MFA is weaker.',
        'WRONG - isolated viewers do not stop credential capture on phishing links or web forms.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'Initial Access',
      rotation_bucket: 'phishing_defense',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An administrator finds an internet-facing application server running a vulnerable component with a public exploit available. What is the most defensible risk reduction approach?',
    [
      'Add a web application firewall rule to block known exploit payloads while scheduling patching next quarter',
      'Move the server to a DMZ subnet and restrict SSH/management ports to internal VPN IP addresses',
      'Patch or retire the vulnerable service, restrict exposure via network controls, and track remediation SLAs',
      'Accept the residual risk temporarily since internal databases sit behind a separate application tier'
    ],
    2,
    'Patching or retiring vulnerable exposure and restricting network reachability—tracked by SLA—closes the flaw.',
    'vulnerability_remediation',
    45,
    {
      distractor_rationale: [
        'WRONG - WAF rules can be bypassed and delay fixing an actively exploitable flaw.',
        'WRONG - restricting management ports leaves the vulnerable public service exposed.',
        'CORRECT - patching/retiring, restricting exposure, and enforcing SLAs reduce risk systematically.',
        'WRONG - multi-tier separation alone does not neutralize an exposed edge vulnerability.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Initial Access',
      rotation_bucket: 'vulnerability_remediation',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A regional SOC manager sees analysts spending most of their shift triaging low-fidelity alerts while high-risk detections sit queued. What is the most defensible operational improvement?',
    [
      'Tune noisy rules, prioritize high-fidelity detections mapped to key risks, and standardize triage playbooks',
      'Add more tier-1 analysts to the queue so every low-fidelity alert receives a full manual investigation',
      'Raise alert severity thresholds globally so only critical alerts appear on the main SOC monitoring board',
      'Forward all raw endpoint and firewall events to an external managed service without tuning existing rules'
    ],
    0,
    'Tuning noisy detections, prioritizing high-risk signals, and standardizing playbooks raises signal quality.',
    'soc_operations',
    45,
    {
      distractor_rationale: [
        'CORRECT - tuning noise, prioritizing high-risk signals, and playbooks improve triage focus.',
        'WRONG - adding staff to low-fidelity noise wastes capacity without fixing signal fidelity.',
        'WRONG - blanket severity hikes can hide medium-severity early intrusion activity.',
        'WRONG - forwarding untuned volume moves noise without improving detection fidelity.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Discovery',
      rotation_bucket: 'soc_operations',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After containing a major security incident, leadership holds a review meeting. Which approach best supports long-term organizational learning and stronger defenses?',
    [
      'Document the incident timeline and update the incident response policy to reflect lessons from the event',
      'Conduct a blameless post-incident review to document root causes, refine controls, and track action items',
      'Review detection rule performance with the SOC team and close the incident once containment is confirmed',
      'Assign specific corrective actions to individual system owners based on who handled each alert during the event'
    ],
    1,
    'Blameless post-incident reviews uncover systemic root causes across people, process, and controls.',
    'post_incident_review',
    45,
    {
      distractor_rationale: [
        'WRONG - policy edits alone without systemic root-cause fixes and tracking leave gaps open.',
        'CORRECT - blameless reviews surface systemic root causes and drive durable improvements.',
        'WRONG - stopping at rule tuning and containment misses broader process or identity causes.',
        'WRONG - tying fixes to alert handlers rather than systemic root causes misdirects effort.'
      ],
      cognitive_level: 3,
      difficulty: 2,
      coverage_tag: 'Collection',
      rotation_bucket: 'post_incident_review',
      last_validated: '2026-11-19'
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
  {
    question: 'You are the security lead at a 200-person Namibian bank. A Sysmon Event ID 10 alert shows `rundll32.exe` accessing `lsass.exe` with `GrantedAccess: 0x1010`, launched from `C:\\Users\\Public\\` with `cmd.exe` as the parent process, on a finance manager laptop. The finance manager has Domain Admin rights on their daily account. Write the first-hour incident runbook: what you do, in what order, what you preserve, and what you escalate.',
    guidelines: 'This is an active credential-theft incident on a host with DA credentials. The runbook must prioritise containment of the credential exposure over forensic completeness. Name the specific actions in the specific order, and name what you preserve at each step.',
    rubric: [
      { criterion: 'Contains the credential exposure first', points: 2, evidence_required: 'States that the finance manager DA account is disabled/revoked before any other action, because the DA hash may already be extracted' },
      { criterion: 'Isolates the host without destroying evidence', points: 2, evidence_required: 'States that the laptop is network-isolated but not rebooted or powered off, preserving memory for forensic capture' },
      { criterion: 'Preserves the specific evidence', points: 2, evidence_required: 'Names the specific artifacts (memory dump, Sysmon log extract, cmd.exe command-line history, rundll32 binary hash, users files) with where each is preserved' },
      { criterion: 'Identifies the escalation path', points: 2, evidence_required: 'States who is notified (CISO, IR lead, bank regulator if applicable) and what the trigger is for a full incident declaration' },
      { criterion: 'Provides a post-incident action for the DA-on-workstation misconfiguration', points: 2, evidence_required: 'States that the DA-on-daily-account configuration is the root cause and is remediated before restoration' }
    ]
  },
  {
    question: 'A Windhoek-based logistics company runs Windows 10 Home on 60% of its laptops and Windows 10 Enterprise on 40%. The CISO wants Credential Guard on all admin workstations. Write the deployment plan: what you will deploy on Enterprise, what compensating controls you will use on Home, how you will measure coverage, and what residual risk remains. Be specific about the control names.',
    guidelines: 'This is a partial-deployment plan with a specific hardware constraint. The plan must show what is possible on Enterprise, what compensating controls replace Credential Guard on Home, and how coverage is measured. "We will deploy Credential Guard everywhere" is not a plan on mixed OS.',
    rubric: [
      { criterion: 'Identifies what can and cannot be deployed on each OS version', points: 2, evidence_required: 'States that Credential Guard requires Enterprise and is not available on Home; names the specific Enterprise features being deployed' },
      { criterion: 'Names specific compensating controls for Home', points: 2, evidence_required: 'At least three compensating controls (LAPS, removal of DA credentials from Home laptops, LSASS access detection, Protected Users, admin tiering) with the specific role each plays' },
      { criterion: 'Provides a coverage measurement', points: 2, evidence_required: 'States how coverage is measured (e.g., "Credential Guard status report from Intune on Enterprise, LSASS alert rate on Home") and who reports it' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what remains after the plan (e.g., "Home laptops still allow LSASS memory extraction if the attacker has admin; detection is the only defence")' },
      { criterion: 'Provides a decision on whether to upgrade Home', points: 2, evidence_required: 'States whether upgrading Home to Enterprise is recommended, and if so the cost per workstation and the business case' }
    ]
  },
  {
    question: 'A SOC analyst at a Nairobi-based fintech has no detection rule for Mimikatz. Write the detection rule design: what field you would watch, what logic you would use, what the expected false positive rate is, and how you would tune it in the first 30 days. Include a sample Sigma or KQL rule as pseudocode.',
    guidelines: 'This is a detection engineering exercise. The rule must be specific enough that another engineer could implement it, with the field names and logic clear. The false positive discussion is the part that makes it operational — a rule that fires on everything is not a rule.',
    rubric: [
      { criterion: 'Identifies the specific telemetry source and field', points: 2, evidence_required: 'Names the event source (Sysmon Event ID 10, Windows Event ID 4688, or EDR LSASS access telemetry) and the specific field to watch (GrantedAccess, Image, ParentImage)' },
      { criterion: 'Provides a specific detection logic', points: 2, evidence_required: 'The rule logic names the combination of conditions (non-standard path + parent process anomaly + access mask) not a single-condition alert' },
      { criterion: 'Estimates the false positive rate realistically', points: 2, evidence_required: 'States an expected false positive rate (e.g., "5-10 per week in our environment based on past LSASS access pattern") rather than "low"' },
      { criterion: 'Provides a tuning plan for the first 30 days', points: 2, evidence_required: 'States what will be tuned (specific exclusions for legitimate processes, confidence scoring) and how often' },
      { criterion: 'Provides the pseudocode rule', points: 2, evidence_required: 'Includes a Sigma or KQL rule that is syntactically realistic, with field names and logic, not a description' }
    ]
  },
  {
    question: 'A bank CISO asks: "We detected Mimikatz, we reset every password, we added MFA. Are we clean?" Write the response memo: what is still at risk, what specific steps are required before you can say the environment is clean, and what the timeline is. Be specific about krbtgt and Kerberos tickets.',
    guidelines: 'This is the post-incident validation memo. "Clean" is a specific state, not a feeling. The memo must name what password reset and MFA do not address, and the specific steps that do. Krbtgt reset is the key point — the memo should be specific about the number of resets.',
    rubric: [
      { criterion: 'States what password reset and MFA do NOT address', points: 2, evidence_required: 'Names Kerberos tickets, golden tickets, persistence mechanisms as unaddressed by password reset and MFA' },
      { criterion: 'Names the krbtgt reset requirement specifically', points: 2, evidence_required: 'States that krbtgt must be reset twice to invalidate both current and previous password history, and that this is a domain-wide change with replication impact' },
      { criterion: 'Names the persistence hunt', points: 2, evidence_required: 'States at least three persistence mechanisms that must be checked (scheduled tasks, services, WMI subscriptions, AD ACLs, delegated permissions)' },
      { criterion: 'Provides a timeline with a clean-state definition', points: 2, evidence_required: 'States what "clean" means in verifiable terms (no new Kerberos tickets from stale hashes, no persistence found, krbtgt reset replicated to all DCs) and how long the validation takes' },
      { criterion: 'Acknowledges what remains at risk after the response', points: 2, evidence_required: 'States at least one residual risk (e.g., the attacker may have exfiltrated data that has not been discovered) rather than claiming full remediation' }
    ]
  },
  {
    question: 'You are the CISO at a Namibian bank. The CEO asks: "If we spend N$2 million on credential theft defence this year, what changes?" Write the answer: three specific outcomes, three specific investments, one residual risk that the spend will not eliminate, and how the board will measure whether the spend worked. Be specific enough that the board can challenge each number.',
    guidelines: 'This is a board-level investment case for a specific threat (credential theft). The outcomes must be verifiable, the investments costed, the residual risk named, and the measurement defined. "We will be more secure" is not an outcome.',
    rubric: [
      { criterion: 'Provides three verifiable outcomes', points: 2, evidence_required: 'Three measurable outcomes (e.g., "zero DA credentials on user workstations", "all admin workstations on Enterprise with Credential Guard", "Mimikatz detection rule live with under 5 false positives per week")' },
      { criterion: 'Provides three costed investments', points: 2, evidence_required: 'Each investment has a specific N$ amount (within the N$2M total) and what it buys — not "security tools" generically' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what the spend will not eliminate (e.g., "a determined attacker with physical access to a DA workstation can still extract credentials before Credential Guard detects")' },
      { criterion: 'Provides a board-level measurement cadence', points: 2, evidence_required: 'States what the board sees quarterly (metrics, incidents, gaps) and who reports it' },
      { criterion: 'Provides a trade-off the board must accept', points: 2, evidence_required: 'States one operational impact (e.g., "admin workstations will require hardware refresh for Enterprise", "helpdesk tickets may increase during tiering migration") rather than claiming zero friction' }
    ]
  }
],
    52: [
  {
    question: 'You are the SOC lead at a Windhoek-based bank. A Cobalt Strike beacon has been detected on a file server, with a JA3 hash that does not match the claimed SaaS vendor. The C2 traffic is encrypted, so you cannot see the commands. Write the first-hour runbook: what you do first, what you preserve, how you hunt for sibling beacons, and what you tell the CISO in the first 15 minutes.',
    guidelines: 'This is a live C2 incident. The runbook must prioritise containment of the beacon while preserving the memory evidence that reveals what the attacker did. The CISO brief in the first 15 minutes should be specific about what is known and what is not.',
    rubric: [
      { criterion: 'Isolates the host without destroying evidence', points: 2, evidence_required: 'States that the server is network-isolated but not rebooted or powered off, preserving memory for forensic capture' },
      { criterion: 'Names the specific evidence preserved', points: 2, evidence_required: 'Memory dump, network connection table, JA3 hash extracted from traffic, and process list from the isolated host' },
      { criterion: 'Hunts for sibling beacons using the shared indicator', points: 2, evidence_required: 'States that the same JA3 hash is searched across proxy or TLS logs to find other hosts beaconing to the same infrastructure' },
      { criterion: 'Provides a specific CISO brief in the first 15 minutes', points: 2, evidence_required: 'States what is confirmed (beacon on one host), what is not yet known (scope, data accessed), and what the CISO should tell the board if asked' },
      { criterion: 'Names the post-incident action', points: 2, evidence_required: 'States one specific change to prevent recurrence (e.g., egress allowlist, JA3 alerting rule, segmentation of the file server zone)' }
    ]
  },
  {
    question: 'A Cobalt Strike beacon uses a legitimate cloud CDN as a redirector. The destination IP changes every few minutes, and the domain looks like a CDN-hosted SaaS application. Write the containment strategy: what you block, what you preserve, what you tell the CDN provider, and how you avoid breaking legitimate CDN traffic for the rest of the company.',
    guidelines: 'This is the tricky case — the attacker is hiding in legitimate infrastructure. Blocking the CDN is wrong, blocking nothing is wrong. The defensible strategy isolates the host and blocks the specific pattern at the proxy, not the CDN.',
    rubric: [
      { criterion: 'Isolates the beaconing host specifically', points: 2, evidence_required: 'States that the host is removed from the network, not the CDN blocked' },
      { criterion: 'Blocks the specific URI pattern at the proxy', points: 2, evidence_required: 'States that the C2 URI path or pattern is blocked at the proxy, while the CDN domain remains reachable for legitimate users' },
      { criterion: 'Preserves the beacon samples for analysis', points: 2, evidence_required: 'States that the beacon traffic is captured (PCAP or proxy logs) and the sample binary or memory is preserved' },
      { criterion: 'Describes the CDN provider notification correctly', points: 2, evidence_required: 'States that the CDN abuse team is notified through its published channel with the specific URI pattern and timestamp, not an expectation of immediate takedown' },
      { criterion: 'Names the risk of the pattern-block approach', points: 2, evidence_required: 'States that the attacker may change the URI pattern and the block will need updating; monitoring is required to detect the change' }
    ]
  },
  {
    question: 'A Namibian government agency has no TLS inspection, no EDR, and a small IT team. The CISO wants to detect C2 traffic. Write the detection plan: what you can detect with existing tools, what you cannot, and what the minimum procurement would be to close the biggest gap. Be specific about what each detection requires.',
    guidelines: 'This is a capability-gap plan. The plan must be honest about what is possible without TLS inspection and EDR, and what the specific missing capabilities are. "We will deploy new tools" is not a plan if it does not name the tools and the gap each one closes.',
    rubric: [
      { criterion: 'Names what is detectable with existing tools', points: 2, evidence_required: 'At least three detections (JA3/JARM fingerprinting, DNS logging, netflow timing analysis, email gateway logs, firewall logs) with the specific indicator each uses' },
      { criterion: 'Names what cannot be detected without TLS inspection', points: 2, evidence_required: 'States that encrypted C2 content cannot be inspected, which means some indicators (URL paths, HTTP headers) are not visible' },
      { criterion: 'Names what cannot be detected without EDR', points: 2, evidence_required: 'States that process injection, LSASS access, and host-side command execution are not visible without endpoint telemetry' },
      { criterion: 'Provides a minimum procurement list with costs', points: 2, evidence_required: 'At least two specific tools (e.g., free JA3 sensor on the perimeter, EDR on critical endpoints) with the specific gap each closes and a cost estimate' },
      { criterion: 'Prioritises what to buy first', points: 2, evidence_required: 'States which single capability closes the biggest gap for the agency, and why (e.g., DNS logging first because it is free and catches covert channels)' }
    ]
  },
  {
    question: 'You are the incident commander at a bank. A Cobalt Strike beacon has been on the network for 3 days. The C2 traffic is encrypted, and the attacker used it to steal credentials and move laterally. The SOC has contained the initial host. The CEO asks: "Are we clean now?" Write the answer: what is known, what is not yet known, what must be done before you can say "clean," and what the timeline is.',
    guidelines: 'This is the honest containment briefing. The CEO wants to hear "yes." The correct answer is "no, not yet, and here is why and how long." The memo must name the specific unknowns and the specific actions that close them.',
    rubric: [
      { criterion: 'States what is confirmed', points: 2, evidence_required: 'Beacon on one host, credential theft confirmed, initial containment done' },
      { criterion: 'States what is not yet known', points: 2, evidence_required: 'Names at least three unknowns (scope of lateral movement, whether persistence remains on other hosts, whether data was exfiltrated)' },
      { criterion: 'Names the specific steps to reach "clean"', points: 2, evidence_required: 'States the specific actions (network-wide beacon hunt, krbtgt reset twice, session revocation, persistence hunt, log analysis for exfiltration) that must complete' },
      { criterion: 'Provides a realistic timeline', points: 2, evidence_required: 'States the time required to complete the actions (e.g., "5-7 days minimum for full scoping and eradication") rather than "as soon as possible"' },
      { criterion: 'Acknowledges the residual risk honestly', points: 2, evidence_required: 'States what remains uncertain even after the actions (e.g., "we may not detect a second beacon that uses a different channel")' }
    ]
  },
  {
    question: 'You are the CISO at a Namibian bank. The board asks: "If we spend N$3 million on C2 defence this year, what changes?" Write the answer: three specific outcomes, three specific investments, one residual risk that the spend will not eliminate, and how the board will measure whether the spend worked. Be specific about which C2 techniques the investments are designed to detect.',
    guidelines: 'This is a board-level investment case for C2 defence. The outcomes must be verifiable, the investments costed, the residual risk named, and the measurement defined. "We will be more secure" is not an outcome; "zero successful C2 beacons going undetected for more than 24 hours" is.',
    rubric: [
      { criterion: 'Provides three verifiable outcomes', points: 2, evidence_required: 'Three measurable outcomes (e.g., "zero successful C2 beacons undetected for more than 24 hours", "all critical endpoints have EDR", "quarterly C2 simulation tested and detected")' },
      { criterion: 'Provides three costed investments', points: 2, evidence_required: 'Each investment has a specific N$ amount (within the N$3M total) and what C2 technique it detects' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what the spend will not eliminate (e.g., "a well-resourced attacker using novel C2 infrastructure may evade detection for hours")' },
      { criterion: 'Provides a board-level measurement cadence', points: 2, evidence_required: 'States what the board sees quarterly (metrics, incidents, gaps) and who reports it' },
      { criterion: 'Provides a trade-off the board must accept', points: 2, evidence_required: 'States one operational impact (e.g., "users will notice slower internet access due to increased TLS inspection", "the SOC needs two additional analysts") rather than claiming zero friction' }
    ]
  }
],
    58: [
  {
    question: 'You are the newly appointed security lead at a 200-person Namibian bank. A BloodHound scan reveals a four-hop path from a Helpdesk account to Domain Admin through three GenericAll ACLs. The IT director asks for a one-page remediation plan. Write the plan: what you will fix first, what you will defer, and how you will measure whether the attack path is actually broken.',
    guidelines: 'This is a priority-ordered remediation plan. The four-hop path must be broken at the highest-leverage edge, not at every edge at once. "We will fix all the ACLs" is not a plan — it is a wish. Name the specific edge, the specific fix, and the specific verification.',
    rubric: [
      { criterion: 'Identifies the highest-leverage edge to break first', points: 2, evidence_required: 'Names a specific edge (the Helpdesk-to-X relationship) and explains why removing it is cheaper and safer than removing the others' },
      { criterion: 'Provides a specific fix per edge with owner and date', points: 2, evidence_required: 'At least three specific fixes with named owners (AD team, identity team) and dates, not "we will clean up ACLs"' },
      { criterion: 'Names what is deferred and why', points: 2, evidence_required: 'States at least one edge or path that is not fixed in the first phase, with a reason (business dependency, change-window constraint)' },
      { criterion: 'Provides verification that the path is broken', points: 2, evidence_required: 'States that BloodHound is re-run after remediation and the specific path no longer appears — not just "we removed the ACL"' },
      { criterion: 'Acknowledges the residual risk honestly', points: 2, evidence_required: 'States what new paths might be created by the remediation (e.g., new group nesting introduced by the fix) and how they will be checked' }
    ]
  },
  {
    question: 'A Windhoek-based insurer runs a Kerberoasting test and extracts three service account hashes in under 5 minutes. The service account passwords were set four years ago and are 12 characters. The CISO asks for a one-page remediation: what to fix now, what to fix over 90 days, and what to accept as residual risk. Write the memo.',
    guidelines: 'This is a remediation memo with a time dimension. The immediate fix removes the crackability of the current hashes. The 90-day plan removes the structural conditions (stale SPNs, password age) that allowed them to be cracked. Residual risk must be named, not denied.',
    rubric: [
      { criterion: 'Provides an immediate fix for the crackability', points: 2, evidence_required: 'Names a specific action (gMSA migration, 30+ character password rotation, SPN removal) that changes the crackability of the three hashes' },
      { criterion: 'Provides a 90-day structural fix', points: 2, evidence_required: 'States at least three actions over 90 days that prevent recurrence (SPN inventory, password age limits, service-account management policy)' },
      { criterion: 'Names a verification method', points: 2, evidence_required: 'States how the fix is verified (re-run Kerberoasting test, check hash crackability, audit service-account password age)' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what Kerberoasting risk remains after the fix (e.g., "any account with an SPN is still a target if its password is short") rather than claiming it is eliminated' },
      { criterion: 'Assigns owners and change-window constraints', points: 2, evidence_required: 'Each action has a named owner and states any change-window constraint (application must be restarted, service must be migrated)' }
    ]
  },
  {
    question: 'A SOC analyst at a Johannesburg bank sees an alert for a successful Kerberos authentication from a user account disabled 40 minutes ago. The analyst has no playbook for golden ticket detection. Write the first-hour incident runbook: what to check, who to notify, what to preserve, and what to do if the alert is confirmed as a forged ticket.',
    guidelines: 'This is an incident runbook for a specific alert type. "Escalate to IR" is not a runbook — it is an escalation. The runbook must name what the analyst checks in the first 10 minutes, what evidence is preserved, and the exact escalation trigger.',
    rubric: [
      { criterion: 'Names the specific checks in the first 10 minutes', points: 2, evidence_required: 'At least three checks (confirm account is still disabled, check krbtgt password age, check other disabled accounts for the same pattern, check DC security logs)' },
      { criterion: 'Names the specific evidence to preserve', points: 2, evidence_required: 'States the specific logs and artifacts (DC security logs, Kerberos ticket metadata, session information from the affected systems)' },
      { criterion: 'Names the escalation trigger and path', points: 2, evidence_required: 'States exactly when the analyst escalates to IR (confirmed forged ticket, multiple disabled accounts, krbtgt compromise indicator) and to whom' },
      { criterion: 'Names the containment if confirmed', points: 2, evidence_required: 'States the specific containment actions (krbtgt reset twice, all admin sessions revoked, DA account password rotation) rather than "isolate the DC"' },
      { criterion: 'Provides a post-incident action', points: 2, evidence_required: 'States one specific change that prevents recurrence (krbtgt rotation schedule, protected users group, alert on disabled account authentication)' }
    ]
  },
  {
    question: 'A Rundu-based clinic\'s IT manager wants to reduce the AD attack surface with no budget. Write the 30-day plan: three free configuration changes, three free tools to install, and three "do not do" items that would make things worse. Explain why each item is on the list.',
    guidelines: 'This is a no-budget hardening plan. "Install LAPS" is correct but generic — the memo must explain what LAPS does and why it matters in this specific clinic. "Do not do" items are the important part: they show the manager what looks like a fix but is not.',
    rubric: [
      { criterion: 'Names three specific free configuration changes', points: 2, evidence_required: 'Each change names a specific setting (LAPS on all workstations, remove Domain Users from local Administrators, enable Windows Defender Credential Guard) with a reason' },
      { criterion: 'Names three specific free tools with reasons', points: 2, evidence_required: 'At least three tools (PingCastle, BloodHound Community Edition, Purple Knight) with what each one detects' },
      { criterion: 'Names three "do not do" items with reasoning', points: 2, evidence_required: 'At least three items (do not disable all service accounts, do not disable NTLM immediately, do not grant all users DA) and why each would make the situation worse' },
      { criterion: 'Explains what success looks like in 30 days', points: 2, evidence_required: 'States at least two measurable outcomes (e.g., "BloodHound paths to Tier-0 reduced from 14 to 3", "LAPS deployed to all 40 workstations")' },
      { criterion: 'Acknowledges the limitations of the no-budget approach', points: 2, evidence_required: 'States what cannot be achieved with free tools alone (e.g., "Credential Guard requires Windows 10/11 Enterprise; if the clinic runs Home, this is deferred")' }
    ]
  },
  {
    question: 'You are the CISO at a Nairobi-based fintech. The board asks: "If we spend N$500,000 on AD security this year, what will be different in 12 months?" Write the answer: three specific outcomes, three specific investments, and one specific risk that will remain even after the spend. Be specific enough that the board can challenge each item.',
    guidelines: 'This is a board-level investment case. The outcomes must be verifiable, the investments must be costed, and the residual risk must be named rather than denied. "We will be more secure" is not an outcome; "no Domain Admin credentials on user workstations" is.',
    rubric: [
      { criterion: 'Provides three specific verifiable outcomes', points: 2, evidence_required: 'At least three measurable outcomes (e.g., "zero DA sessions on user workstations", "BloodHound paths to Tier-0 under 5 hops", "all service accounts on gMSA with 30+ character passwords")' },
      { criterion: 'Provides three costed investments', points: 2, evidence_required: 'Each investment has a specific cost (N$ amount or range) and what it buys (not "security tools" generically)' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States one specific risk that remains after the spend (e.g., "supply chain compromise of the AD vendor") rather than claiming the spend eliminates the risk' },
      { criterion: 'Provides a measurement cadence', points: 2, evidence_required: 'States how the outcomes will be measured (quarterly BloodHound scans, monthly credential-guard coverage report) and who reports to the board' },
      { criterion: 'Acknowledges at least one trade-off', points: 2, evidence_required: 'States one operational impact the board should accept (e.g., "helpdesk will spend more time on password resets during gMSA migration") rather than claiming zero friction' }
    ]
  }
],
    60: [
  {
    question: 'You are the security lead at a 200-person Namibian bank. A SOC analyst has identified a pass-the-hash attack: a stolen NTLM hash is being used from a helpdesk workstation to authenticate to three servers. The affected user is still logged in. Write the first-hour incident runbook: what you disable and revoke, in what order, what you preserve, and what you tell the CISO in the first 15 minutes.',
    guidelines: 'This is a live pass-the-hash incident. The runbook must prioritise stopping the credential reuse and revoking the attacker sessions, while preserving evidence for scope. The CISO brief in the first 15 minutes must be specific about what is known and what is not.',
    rubric: [
      { criterion: 'Disables the compromised account and revokes sessions before anything else', points: 2, evidence_required: 'States that the account is disabled and all active sessions/tokens are revoked as the first action, before any investigation' },
      { criterion: 'Isolates every server that accepted the hash', points: 2, evidence_required: 'Names the specific servers that need isolation and states that they are preserved, not rebooted, for forensic capture' },
      { criterion: 'Preserves the specific evidence', points: 2, evidence_required: 'Names the Event ID 4624 logs, the memory of the helpdesk workstation, and the network flow logs showing the source of the hash authentications' },
      { criterion: 'Provides a specific CISO brief in the first 15 minutes', points: 2, evidence_required: 'States what is confirmed (pass-the-hash from a specific workstation), what is not known (scope, data accessed), and what not to tell the board yet' },
      { criterion: 'Explains why password reset alone is insufficient', points: 2, evidence_required: 'States that the attacker uses the hash, not the password, and that session revocation plus krbtgt reset (if ticket theft is suspected) is required' }
    ]
  },
  {
    question: 'A Johannesburg insurer finds a Kerberoasting attack in progress: an attacker with low-privilege domain credentials is requesting service tickets for three service accounts with weak passwords. Write the remediation memo for the CISO: what you fix now, what you fix over 90 days, and what residual risk remains even after both.',
    guidelines: 'This is a remediation plan for Kerberoasting, not an incident response. The memo should be specific about what makes Kerberoasting possible (SPNs on weak service accounts), what fixes it now, and what structural changes prevent recurrence. The residual risk must be named.',
    rubric: [
      { criterion: 'Names the immediate fix', points: 2, evidence_required: 'States that the three service account passwords are rotated to 30+ character values in gMSAs within the first 24 hours' },
      { criterion: 'Names the 90-day structural fix', points: 2, evidence_required: 'At least three actions (SPN inventory, service account inventory, password age limits, gMSA migration for all service accounts) with owners' },
      { criterion: 'Explains what makes Kerberoasting possible', points: 2, evidence_required: 'States that any domain user can request TGS tickets for accounts with SPNs, and the ticket hash is crackable offline if the password is weak' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what remains after the fix (e.g., a new service account with a short password would be vulnerable again) rather than claiming Kerberoasting is eliminated' },
      { criterion: 'Names the verification method', points: 2, evidence_required: 'States that a Kerberoasting test is re-run after 30 days and the hashes are checked for crackability, or the requesters are audited' }
    ]
  },
  {
    question: 'You are the CISO at a Windhoek bank. The board asks: "If we spend N$2 million on credential theft defence this year, what changes?" Write the answer: three specific outcomes, three specific investments, one residual risk that the spend will not eliminate, and how the board will measure whether the spend worked.',
    guidelines: 'This is a board-level investment case. The outcomes must be verifiable, the investments costed, and the residual risk named. "We will be more secure" is not an outcome; "no Domain Admin credentials on user workstations" is.',
    rubric: [
      { criterion: 'Provides three verifiable outcomes', points: 2, evidence_required: 'At least three measurable outcomes (e.g., "zero DA credentials on user workstations", "all admin workstations on Enterprise with Credential Guard", "all service accounts in gMSAs with 30+ character passwords")' },
      { criterion: 'Provides three costed investments', points: 2, evidence_required: 'Each investment has a specific N$ amount within the N$2M total and what it buys' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what the spend will not eliminate (e.g., "a determined attacker with physical access to an admin workstation can still extract credentials before Credential Guard detects")' },
      { criterion: 'Provides a board-level measurement cadence', points: 2, evidence_required: 'States what the board sees quarterly (metrics, incidents, gaps) and who reports it' },
      { criterion: 'Provides a trade-off the board must accept', points: 2, evidence_required: 'States one operational impact (e.g., "admin workstations will need hardware refresh", "helpdesk tickets may increase during tiering migration") rather than claiming zero friction' }
    ]
  },
  {
    question: 'A SOC analyst at a Nairobi bank sees a successful Kerberos authentication from a user account that was disabled 40 minutes ago. The analyst has no playbook for golden ticket detection. Write the first-hour runbook: what to check, who to notify, what to preserve, and what to do if the alert is confirmed as a forged ticket.',
    guidelines: 'This is an incident runbook for a specific alert type. "Escalate to IR" is not a runbook. The runbook must name what the analyst checks in the first 10 minutes, what evidence is preserved, and the exact escalation trigger.',
    rubric: [
      { criterion: 'Names the specific checks in the first 10 minutes', points: 2, evidence_required: 'At least three checks (confirm account is still disabled, check krbtgt password age, check other disabled accounts for the same pattern, check DC security logs)' },
      { criterion: 'Names the specific evidence to preserve', points: 2, evidence_required: 'States the specific logs and artifacts (DC security logs, Kerberos ticket metadata, session information from the affected systems)' },
      { criterion: 'Names the escalation trigger and path', points: 2, evidence_required: 'States exactly when the analyst escalates to IR (confirmed forged ticket, multiple disabled accounts, krbtgt compromise indicator) and to whom' },
      { criterion: 'Names the containment if confirmed', points: 2, evidence_required: 'States the specific containment actions (krbtgt reset twice, all admin sessions revoked, DA account password rotation) rather than "isolate the DC"' },
      { criterion: 'Provides a post-incident action', points: 2, evidence_required: 'States one specific change that prevents recurrence (krbtgt rotation schedule, protected users group, alert on disabled account authentication)' }
    ]
  },
  {
    question: 'A Namibian government agency has 40% of workstations on Windows 10 without Credential Guard support and 60% on Windows 11. The CISO wants to prevent pass-the-hash across the whole fleet. Write the deployment plan: what you deploy where, what compensating controls replace Credential Guard on the legacy systems, how you measure coverage, and what residual risk remains.',
    guidelines: 'This is a partial-deployment plan with a hardware constraint. The plan must show what is possible on each platform, what compensating controls replace the missing capability, and how coverage is measured. "We will deploy Credential Guard everywhere" is not a plan on mixed OS.',
    rubric: [
      { criterion: 'Identifies what can and cannot be deployed on each OS version', points: 2, evidence_required: 'States that Credential Guard requires Enterprise and is not available on the Windows 10 Home fleet; names the specific Enterprise features being deployed' },
      { criterion: 'Names specific compensating controls for legacy systems', points: 2, evidence_required: 'At least three compensating controls (LAPS, removal of DA credentials from legacy workstations, LSASS access detection, admin tiering) with the specific role each plays' },
      { criterion: 'Provides a coverage measurement', points: 2, evidence_required: 'States how coverage is measured (e.g., "Credential Guard status report from Intune on Enterprise, LSASS alert rate on legacy") and who reports it' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what remains after the plan (e.g., "legacy workstations still allow LSASS memory extraction if the attacker has admin; detection is the only defence")' },
      { criterion: 'Provides a decision on whether to upgrade the legacy fleet', points: 2, evidence_required: 'States whether upgrading legacy to Enterprise is recommended, and if so the cost per workstation and the business case' }
    ]
  }
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