/**
 * Tier B paid-grade depth — second enrichment wave.
 * Merged with Tier A in assessmentEngine / contentLibrary.
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

const TIER_B_QUESTIONS = {
    2: [
  q(
    'A sandbox detonation of a suspicious document in Windhoek shows no network callouts, but 48 hours later users report encrypted files. What is the most defensible explanation?',
    [
      'The sample staged delayed execution or evaded sandbox hooks until live host conditions were met',
      'The initial sandbox run cleared the file safely, so the encryption came from an unrelated outage',
      'An administrator triggered bulk file encryption while testing storage quotas across shared folders',
      'Endpoint security updates corrupted user documents automatically after the sandbox scan finished'
    ],
    0,
    'Delayed triggers or sandbox evasion can cause a clean initial run followed by later execution.',
    'triage',
    45,
    {
      distractor_rationale: [
        'CORRECT - delayed execution or sandbox evasion explains clean early runs followed by later impact.',
        'WRONG - a clean sandbox run does not exclude delayed or conditional stages.',
        'WRONG - storage quota tests do not encrypt user files across shared paths.',
        'WRONG - legitimate updates do not encrypt user documents across shared paths.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'Execution',
      rotation_bucket: 'triage',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Finance in Walvis Bay forwards a suspicious macro document. What is the most defensible first safe action?',
    [
      'Open the macro on a finance workstation to check whether it triggers before escalating',
      'Quarantine the sample, extract metadata and indicators offline, and test in a sandbox',
      'Delete the file immediately and remind staff to avoid opening unexpected attachments',
      'Forward the attachment to multiple IT staff so everyone can inspect it at once'
    ],
    1,
    'Quarantining, inspecting metadata/IOCs offline, and detonating in isolation preserves evidence safely.',
    'analysis_safety',
    45,
    {
      distractor_rationale: [
        'WRONG - opening on a workstation risks live execution and spread.',
        'CORRECT - quarantine, offline IOC extraction, and isolated detonation keep handling safe.',
        'WRONG - deleting immediately removes sample evidence and indicator context.',
        'WRONG - forwarding multiplies exposure and complicates handling.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Phishing',
      rotation_bucket: 'analysis_safety',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A file hash appears in threat intelligence as a known dropper and is found unexecuted on an HR laptop in Frankfurt. What is best?',
    [
      'Delete the file after confirming with the user that it was not opened and close the alert',
      'Wait a day to see if the file executes on its own before taking endpoint action',
      'Isolate the laptop, preserve the sample for analysis, and check for dropped payloads',
      'Add the hash to a blocklist and watch for the same hash across other endpoints'
    ],
    2,
    'Isolating the host, preserving the file, and hunting for dropped payloads addresses prior staging.',
    'family_recognition',
    45,
    {
      distractor_rationale: [
        'WRONG - deleting without scoping misses payloads that may already be staged.',
        'WRONG - waiting lets a staged dropper execute or spread.',
        'CORRECT - host isolation, sample preservation, and payload checks contain potential staging.',
        'WRONG - blocklisting helps other hosts but does not scope the flagged laptop.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Ingress Tool Transfer',
      rotation_bucket: 'family_recognition',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An analyst in Singapore needs to inspect a suspicious binary without a dedicated commercial sandbox. Which setup is most defensible?',
    [
      'Run the sample on an analyst workstation after scanning it with local endpoint antivirus',
      'Run the sample inside a production virtual machine using a restricted standard user account',
      'Rely on built-in endpoint scan verdicts alone without opening or analyzing the sample',
      'Run the sample in a clean isolated VM with network disabled and snapshot rollback'
    ],
    3,
    'An isolated, network-disabled VM with snapshot rollback provides safe containment for analysis.',
    'analysis_safety',
    45,
    {
      distractor_rationale: [
        'WRONG - analyst workstations are not isolated containment environments.',
        'WRONG - a production VM with restricted rights still sits inside an operational environment.',
        'WRONG - scan verdicts alone do not substitute for controlled analysis when needed.',
        'CORRECT - network isolation, clean state, and snapshot rollback contain execution risk.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Execution',
      rotation_bucket: 'analysis_safety',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After confirming malware on a workstation in London, a user asks why rebooting to keep working is risky. What is the strongest explanation?',
    [
      'Rebooting clears volatile memory evidence and may leave persistence mechanisms active',
      'Rebooting forces dormant payloads to encrypt files faster than leaving the host running',
      'Rebooting only creates risk for ransomware, whereas other malware families never persist',
      'Rebooting is unnecessary because endpoint antivirus removes all traces automatically'
    ],
    0,
    'Rebooting discards volatile process/memory evidence while persistence entries can survive across restarts.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - rebooting loses volatile evidence while persistence can survive.',
        'WRONG - the primary technical concern here is lost volatile state and surviving persistence.',
        'WRONG - volatile evidence and persistence matter across malware families, not just ransomware.',
        'WRONG - detection does not guarantee full removal of persistence mechanisms.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Process Injection',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'An endpoint in Oshakati flags a file first, then a follow-up scan reports it clean. What is the most defensible interpretation?',
    [
      'Treat the initial alert as a false positive and close the investigation without further checks',
      'The file may have changed, been replaced, or been affected by rule updates, needing review',
      'Repeat the same local scan three times in a row until the result stays consistent',
      'Reinstall the endpoint agent and re-run a quick scan on the folder the next day'
    ],
    1,
    'Changing scan results can reflect file modification, replacement, or detection updates requiring independent review.',
    'family_recognition',
    45,
    {
      distractor_rationale: [
        'WRONG - conflicting scan outcomes require verification rather than automatic dismissal.',
        'CORRECT - file changes, replacement, or rule updates warrant independent inspection.',
        'WRONG - repeating identical scans does not explain why the verdict shifted.',
        'WRONG - agent reinstallation does not analyze the file or explain the discrepancy.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'Obfuscated Files or Information',
      rotation_bucket: 'family_recognition',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Ransomware is confirmed on three file servers in Nairobi. What is the most defensible first step before recovery or decryption decisions?',
    [
      'Preserve ransom notes, extension patterns, and file timestamps before altering systems',
      'Run the decryption utility supplied in the ransom note to test file recovery right away',
      'Delete encrypted files immediately and restore from the latest backup without scoping',
      'Pay the ransom demand immediately so decryption keys arrive before any deadline passes'
    ],
    0,
    'Preserving ransom notes, extension patterns, and timestamps supports family identification, timeline scoping, and recovery planning.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'CORRECT - preserving notes, extensions, and timestamps supports scoping and recovery.',
        'WRONG - untrusted attacker tools pose severe security and integrity risks.',
        'WRONG - deleting evidence or restoring blindly before scoping can miss active footholds.',
        'WRONG - payment is a leadership/legal decision after scoping and recovery assessment.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Data Encrypted for Impact',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'Which combination provides a stronger indicator of a malicious dropper in São Paulo than a single broad file attribute alone?',
    [
      'A file downloaded from the internet that lacks a vendor digital code signature',
      'A file with a common executable extension sent via an external email message',
      'Packing or high entropy combined with embedded URLs or script execution strings',
      'A file created and modified by the same user account during a single work session'
    ],
    2,
    'Packing/high entropy paired with embedded network or execution indicators is a stronger dropper signal than broad attributes.',
    'family_recognition',
    45,
    {
      distractor_rationale: [
        'WRONG - unsigned downloads occur frequently in legitimate software and development.',
        'WRONG - executable extensions in email are common and carry high false-positive rates.',
        'CORRECT - packing/entropy plus embedded URLs or execution strings aligns with dropper behavior.',
        'WRONG - single-session creation and edits happen routinely in normal work.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'Software Packing',
      rotation_bucket: 'family_recognition',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A user in Rotterdam reports a PDF did nothing when opened, while telemetry flags reader exploitation. What is best?',
    [
      'Dismiss the alert because the user saw no visual change or pop-up after opening the file',
      'Investigate the host and process tree because exploitation often runs silently in the background',
      'Mark the alert as a false positive unless the user clicked an embedded link inside the PDF',
      'Tell the user to avoid opening PDFs in the future and close the security case immediately'
    ],
    2,
    'Document exploits frequently execute silently without visible prompts, making telemetry investigation essential.',
    'triage',
    45,
    {
      distractor_rationale: [
        'WRONG - lack of visible UI changes does not rule out silent exploitation.',
        'CORRECT - silent execution is common in document exploits and requires telemetry review.',
        'WRONG - exploitation can occur on document open without extra link clicks.',
        'WRONG - closing without investigation leaves potential post-exploitation unexamined.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'Exploitation for Client Execution',
      rotation_bucket: 'triage',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'After confirming malware on a workstation in Swakopmund, an analyst gathers indicators of compromise. Which set is most defensible?',
    [
      'Only the original file hash because cryptographic hashes uniquely identify every sample',
      'Only network packet captures because file hashes can collide and are unreliable',
      'Only dropped file names because filenames directly identify the threat actor family',
      'File hashes, command domains or IPs, persistence entries, and dropped file paths'
    ],
    3,
    'Combining file hashes, network indicators, persistence entries, and dropped paths supports multi-layer hunting and containment.',
    'analysis_safety',
    45,
    {
      distractor_rationale: [
        'WRONG - a single hash does not capture C2 infrastructure or host persistence.',
        'WRONG - packet captures alone miss host persistence and local dropped artifacts.',
        'WRONG - filenames are easily randomized and unreliable on their own.',
        'CORRECT - pairing host, persistence, path, and network IOCs strengthens hunting.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Application Layer Protocol',
      rotation_bucket: 'analysis_safety',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A process in a public temp folder on a Windhoek host makes an outbound connection to an unfamiliar IP. What is most defensible?',
    [
      'Wait for the next analyst shift to review the process lineage and network connection',
      'Isolate the host, capture memory and process lineage, and preserve the binary',
      'Terminate the process and delete the binary immediately so the connection stops',
      'Keep the host connected while capturing traffic to observe what the process does next'
    ],
    1,
    'Isolating the host, capturing live memory/process lineage, and preserving the binary protects evidence and limits spread.',
    'incident_response',
    45,
    {
      distractor_rationale: [
        'WRONG - delaying allows continued outbound activity or lateral movement.',
        'CORRECT - isolation, live capture, and binary preservation balance containment and forensics.',
        'WRONG - killing and deleting without capture loses volatile process and memory evidence.',
        'WRONG - leaving the host online risks further spread or data exposure.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Process Injection',
      rotation_bucket: 'incident_response',
      last_validated: '2026-11-19'
    }
  ),

  q(
    'A small business in Windhoek has a tight security budget and wants stronger endpoint malware detection. What is the best first step?',
    [
      'Buy a standalone file detonation sandbox without endpoint telemetry feeding it suspects',
      'Deploy endpoint detection and response across workstations for host visibility',
      'Replace the edge firewall appliance with a higher-throughput hardware model',
      'Run a single annual phishing awareness workshop with no endpoint monitoring'
    ],
    3,
    'Endpoint detection provides direct host visibility where execution, script chains, and local tampering occur.',
    'triage',
    45,
    {
      distractor_rationale: [
        'WRONG - sandboxes help analyze suspects but do not replace endpoint visibility across hosts.',
        'CORRECT - endpoint detection provides foundational host telemetry for malware detection.',
        'WRONG - edge firewall upgrades focus on perimeter traffic rather than endpoint execution.',
        'WRONG - awareness sessions alone do not provide technical endpoint detection.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'Execution',
      rotation_bucket: 'triage',
      last_validated: '2026-11-19'
    }
  )
],
    3: [
        q('East-west traffic on a flat VLAN shows SMB admin$ from a marketing PC to ERP. Best control response?', ['Trust internal traffic always', 'Segment critical assets; hunt lateral movement; remove flat trust', 'Only harden the firewall edge', 'Disable logging to reduce noise'], 1, 'Perimeter-only thinking fails on lateral movement.', 'network', 40),
        q('Which monitoring gap most often blinds defenders to lateral movement?', ['No edge firewall', 'No east-west / identity-correlated visibility inside the LAN', 'Too many DNS servers', 'Having TLS'], 1, 'Internal visibility + identity context beats border fetish.', 'network', 35)
    ],
    4: [
        q('Public S3/blob with customer PII discovered. Immediate priority?', ['Leave it — cloud is shared responsibility of the vendor only', 'Remove public access; inventory exposure; rotate keys; notify per policy', 'Delete the entire cloud account', 'Post the URL on social media'], 1, 'Stop exposure first, then scope and legal clocks.', 'cloud', 40),
        q('Long-lived access keys in a Git commit — durable fix?', ['Hope nobody finds the repo', 'Rotate/revoke; remove from history where feasible; prefer short-lived roles/OIDC; scan secrets in CI', 'Disable MFA', 'Email the keys to Slack for “tracking”'], 1, 'Identity hygiene + pipeline controls beat hope.', 'cloud', 40)
    ],
    5: [
        q('BYOD with sideloaded banking APK used for company WhatsApp approvals. Risk framing?', ['Mobile is always safe', 'Unmanaged devices blur personal malware into business approval workflows — manage posture or isolate apps', 'Ban all phones without alternative', 'Only desktop phishing matters'], 1, 'Mobile is a business channel now — treat it as such.', 'mobile', 40),
        q('Best pattern for contractor phone access to ERP?', ['Full domain join of personal phones', 'Managed container/VDI/app + short-lived auth; no broad network immersion', 'Shared VIP password', 'Disable MDM forever'], 1, 'Scoped apps beat network immersion.', 'mobile', 35)
    ],
    9: [
        q('Auditor asks for “evidence of control operation,” not a policy PDF. What do you provide?', ['A motivational poster', 'Tickets, logs, screenshots, sampling, dates proving the control ran', 'Verbal assurance only', 'Delete old evidence'], 1, 'Compliance is evidence of operation over time.', 'compliance', 35),
        q('Policy says MFA required; 40% of VIP accounts lack it. Honest statement?', ['Fully compliant', 'Control designed but not effectively operated — risk accepted or remediating with owners/dates', 'Ignore VIPs', 'MFA is optional marketing'], 1, 'Design ≠ operating effectiveness.', 'compliance', 40)
    ],
    10: [
        q('A “friendly” scan of a customer without written authorization is…', ['Always legal if educational', 'Unauthorized testing — illegal/unethical regardless of intent', 'Fine on weekends', 'Allowed if no damage occurred'], 1, 'Authorization defines ethical hacking.', 'ethics', 35),
        q('Best ROE element before any offensive technique in a lab or engagement?', ['Surprise the blue team with production ransomware', 'Written scope, systems, times, data handling, emergency stop, and reporting rules', 'Anonymous Twitter liveblog', 'Use personal cloud for loot'], 1, 'ROE is the contract that keeps purple legal.', 'ethics', 40)
    ],
    12: [
  q(
    'A Windhoek SME receives an email from a customer in Berlin requesting a copy of all personal data held about them and asking why it is being kept. The SME owner is unsure whether to respond, because the customer is not in Namibia. What is the most defensible first action?',
    [
      'Ignore the request — GDPR applies only to organisations established in the EU, not to Namibian companies',
      'Respond within one month with the requested data and the purpose of processing — the customer is a data subject under GDPR regardless of where the SME is located',
      'Forward the request to the customer embassy for official verification before responding to anything',
      'Delete the customer data immediately to remove any obligation to respond to the request'
    ],
    1,
    'GDPR Article 3(2) applies to organisations outside the EU when they offer goods or services to EU residents. The one-month response window (Article 12(3)) applies to a Namibian SME serving German customers.',
    'data_subject_rights',
    45,
    {
      distractor_rationale: [
        'WRONG - GDPR Article 3(2) explicitly covers non-EU organisations that offer goods or services to EU residents.',
        'CORRECT - GDPR has extraterritorial scope; the one-month access response obligation applies to non-EU controllers serving EU data subjects.',
        'WRONG - embassies do not verify data subject access requests; verification is done by the controller using reasonable means.',
        'WRONG - deleting data to avoid a request is itself a breach (Article 17 limits erasure) and separate spoliation.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-15',
      rotation_bucket: 'data_subject_rights',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Mariental agricultural exporter discovers that a ransomware attack exfiltrated the personal data of 400 EU customers 3 days ago. The technical team is still scoping which files were taken. The CEO asks whether the company must "report this to someone." What is the most defensible answer?',
    [
      'Wait until the technical scoping is complete before notifying anyone, since the scope determines whether the breach is reportable',
      'Notify every affected customer immediately with full details before notifying any regulator, to preserve customer trust',
      'Notify the lead supervisory authority within 72 hours of becoming aware unless the breach is unlikely to result in a risk — the clock started 3 days ago',
      'The 72-hour rule does not apply to non-EU companies, so notification timing is at the company own discretion'
    ],
    2,
    'GDPR Article 33 requires controller notification to the supervisory authority within 72 hours of awareness unless the breach is unlikely to result in a risk. Scope does not pause the clock; phased notification is permitted under Article 33(4).',
    'breach_notification',
    45,
    {
      distractor_rationale: [
        'WRONG - waiting for scope completion is a common error; the clock runs from awareness, and Art 33(4) permits phased updates.',
        'WRONG - customer notification is Art 34 and depends on high risk; the regulator notification under Art 33 comes first.',
        'CORRECT - the 72-hour clock starts at awareness, not at scope completion; phased notification under Art 33(4) is the correct approach.',
        'WRONG - Art 33 applies to controllers established outside the EU when Art 3 applies; non-EU location does not exempt notification.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-33',
      rotation_bucket: 'breach_notification',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'An HR manager in Rundu wants to send employee salary records to a cloud storage provider whose servers are in the United States. The provider is not covered by an EU adequacy decision. What is the most defensible first step?',
    [
      'Send the data — the United States is a trusted jurisdiction and salary data is low-risk compared to customer data',
      'Encrypt the records with a password and send them by email, since encryption removes any transfer restriction',
      'Ask employees to consent in writing, since employee consent is sufficient to authorise any international transfer',
      'Check whether the transfer has a valid legal mechanism under GDPR Chapter V — adequacy, Standard Contractual Clauses, or an equivalent safeguard — before sending anything'
    ],
    3,
    'GDPR Chapter V restricts transfers outside the EEA. Encryption is a security measure, not a transfer mechanism. Employee consent is rarely valid under GDPR due to the power imbalance in employment.',
    'cross_border_transfer',
    45,
    {
      distractor_rationale: [
        'WRONG - the US is not automatically adequate for all data types; the Schrems II ruling requires case-by-case assessment.',
        'WRONG - encryption does not remove the transfer restriction; it is a security control, not a legal basis.',
        'WRONG - employee consent is generally not valid for transfers under GDPR due to the employment power imbalance.',
        'CORRECT - cross-border transfers require a Chapter V mechanism; adequacy, SCCs, or BCRs are the lawful paths.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'GDPR-Chapter-V',
      rotation_bucket: 'cross_border_transfer',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Lagos-based fintech processes payroll data for a client company in Windhoek. The Namibian client has not signed a data processing agreement. What is the most defensible action for the Namibian client?',
    [
      'Pause the payroll data processing until a written DPA with POPIA-compliant terms is in place — the processor relationship requires contractual safeguards',
      'Continue processing but add a confidentiality clause to the existing service agreement, since POPIA allows short-form processor terms',
      'Continue processing — POPIA only applies to the processor, not to the responsible party sending the data',
      'Ask the Lagos fintech to self-certify compliance with POPIA and continue processing once the self-certification is received'
    ],
    0,
    'POPIA section 20 requires a written contract between the responsible party and the operator (processor) before processing personal information. Self-certification and short-form clauses do not satisfy the requirement.',
    'processor_management',
    45,
    {
      distractor_rationale: [
        'CORRECT - POPIA s.20 requires a written contract with specific terms before the operator processes personal information on behalf of the responsible party.',
        'WRONG - a confidentiality clause alone does not satisfy the specific requirements of POPIA s.20.',
        'WRONG - POPIA s.20 places the obligation on the responsible party to ensure the operator relationship is contracted.',
        'WRONG - self-certification is not a substitute for the contractual requirement in POPIA s.20.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'POPIA-s20',
      rotation_bucket: 'processor_management',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Windhoek marketing team wants to use a customer email list for a new product launch. The list was collected for "account notifications only" 18 months ago. The team asks if they can just send the launch email. What is the most defensible answer?',
    [
      'No — using the list for a purpose it was not collected for is a purpose-limitation issue; the launch requires a new lawful basis such as fresh consent or a legitimate-interest assessment',
      'Yes — the customers already consented to marketing when they signed up for the account, so no new consent is needed',
      'Yes — 18 months is old enough that the original purpose has lapsed and the data is effectively fair game',
      'Yes, but only if the launch email includes an opt-out link at the bottom of the message'
    ],
    0,
    'Purpose limitation is a core data protection principle. Using data for a new purpose requires a new lawful basis. Consent for account notifications does not extend to product marketing.',
    'data_minimization',
    45,
    {
      distractor_rationale: [
        'CORRECT - purpose limitation requires a fresh lawful basis for new processing purposes; account notifications do not cover product marketing.',
        'WRONG - consent for account notifications is not consent for product marketing; purposes must be specified at collection.',
        'WRONG - lapsed time does not open data for new purposes; the original purpose still governs until a new basis exists.',
        'WRONG - an opt-out link is a transparency measure, not a lawful basis for the new processing purpose.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-5',
      rotation_bucket: 'data_minimization',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A customer in Nairobi asks a Namibian online store to delete all their personal data. The store also has a legal obligation to retain transaction records for 7 years under Namibian tax law. What is the most defensible response?',
    [
      'Refuse the request entirely because the tax retention obligation overrides any right to deletion under data protection law',
      'Delete what is not legally required, explain which records must be kept and why, and confirm the deletion of the rest in writing',
      'Delete every record including the tax-retained transaction data to comply with the customer request in full',
      'Forward the request to the Namibian tax authority and wait for their decision before responding to the customer'
    ],
    1,
    'GDPR Article 17(3)(b) and POPIA s.24(1)(c) both limit the right to erasure when processing is necessary for legal obligations. The correct response is partial deletion with transparent explanation.',
    'data_subject_rights',
    45,
    {
      distractor_rationale: [
        'WRONG - a blanket refusal is disproportionate; the correct approach is partial deletion with transparent reasoning.',
        'CORRECT - legal retention obligations limit the erasure right; the controller should erase the rest and explain the retained records.',
        'WRONG - deleting tax-retained records is a separate legal breach; erasure cannot override a legal retention obligation.',
        'WRONG - tax authorities do not adjudicate data subject requests; the controller remains responsible for the response.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-17',
      rotation_bucket: 'data_subject_rights',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Windhoek clinic experiences a breach affecting HIV status data. POPIA section 22 requires notification to the Information Regulator and affected data subjects. The clinic director asks whether they can notify affected patients by SMS only. What is the most defensible answer?',
    [
      'SMS alone is sufficient — POPIA does not specify the form of notification, so any method that reaches the data subject satisfies section 22',
      'Notifications to the Information Regulator and to data subjects can be delayed until the investigation is complete to avoid causing panic',
      'SMS may be part of the notification but must clearly describe the breach and the steps patients should take; POPIA requires the notification to be in a form that is likely to reach the data subjects with adequate detail',
      'Because the data is medical, the clinic only needs to notify the Information Regulator, not the affected patients'
    ],
    2,
    'POPIA s.22 requires notification to both the Regulator and the data subjects. The notification form must adequately describe the breach and mitigation steps; SMS is possible but must meet those requirements.',
    'breach_notification',
    45,
    {
      distractor_rationale: [
        'WRONG - POPIA does specify requirements for the form and content of notification; a bare SMS without adequate content may not comply.',
        'WRONG - POPIA does not permit indefinite delay; notification should happen as soon as reasonably possible after discovery.',
        'CORRECT - POPIA s.22 requires notification to both the Regulator and the data subject with sufficient detail; SMS can be used but must be adequate.',
        'WRONG - medical data does not exempt notification to data subjects; both notifications are required.'
      ],
      cognitive_level: 4,
      difficulty: 4,
      coverage_tag: 'POPIA-s22',
      rotation_bucket: 'breach_notification',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Johannesburg insurance company uses a Kenyan cloud provider to store policyholder data. The Kenyan provider subcontracts storage to a third party in India without notifying the insurer. What is the most defensible action?',
    [
      'Require the primary processor to disclose all sub-processors and obtain the insurer prior authorisation for any sub-processing, then assess whether the India transfer has a valid transfer mechanism',
      'Terminate the relationship with the Kenyan provider immediately, since any sub-processor use is a breach of the GDPR',
      'Continue the relationship — the Kenyan provider is the controller contracted processor, so sub-processor changes are their internal matter',
      'Accept the sub-processor arrangement but require the Kenyan provider to sign an additional confidentiality clause'
    ],
    0,
    'GDPR Article 28(2) requires prior authorisation for sub-processors, and Article 28(4) requires the same data protection obligations to flow down. A new jurisdiction triggers a fresh Chapter V transfer assessment.',
    'processor_management',
    45,
    {
      distractor_rationale: [
        'CORRECT - Art 28(2) and 28(4) require prior authorisation and flow-down of obligations, and the India transfer requires a separate Chapter V assessment.',
        'WRONG - termination is not automatically required; prior authorisation and assessment are the first steps.',
        'WRONG - sub-processors are not an internal matter for the processor; the controller must authorise and flow down obligations.',
        'WRONG - a confidentiality clause is not enough; the new jurisdiction and sub-processor change require a full Art 28 and Chapter V review.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-28',
      rotation_bucket: 'processor_management',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Gaborone-based bank collects customer addresses for account opening, then uses the same addresses to run a targeted wealth-management marketing campaign. Under Botswana Data Protection Act, what is the most defensible first action?',
    [
      'Proceed — the data was collected lawfully for account opening and marketing is a natural extension of the customer relationship',
      'Confirm whether the original collection notice covered marketing, and if not, either obtain fresh consent or conduct a lawful-basis assessment before the campaign runs',
      'Proceed but include an opt-out link at the bottom of every marketing email to satisfy the transparency requirement',
      'Anonymise the addresses by removing the customer names before using them for the marketing campaign'
    ],
    1,
    'Botswana Data Protection Act and the equivalent provisions in POPIA and GDPR require purpose specification at collection. A new purpose requires a new lawful basis.',
    'data_minimization',
    45,
    {
      distractor_rationale: [
        'WRONG - "natural extension" is not a lawful basis; the collection purpose was specified at account opening.',
        'CORRECT - purpose specification at collection governs later use; a new purpose requires a new lawful basis.',
        'WRONG - an opt-out is a transparency measure, not a lawful basis for the new processing purpose.',
        'WRONG - anonymisation is relevant only if the data is truly anonymised (not pseudonymised); addresses with customer names can often be re-identified.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'BWA-DPA',
      rotation_bucket: 'data_minimization',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Namibian SME has customers in Namibia and Germany. It wants to design a privacy notice that works for both. What is the most defensible approach?',
    [
      'Write two fully separate notices — one for Namibia and one for Germany — because no common template can satisfy both regimes',
      'Write one notice based on GDPR alone, since GDPR is the stricter standard and compliance with it automatically satisfies POPIA',
      'Write one notice based on POPIA alone, since the company is Namibian and its home jurisdiction controls the notice',
      'Write a single notice that meets the higher standard — GDPR — and add Namibia-specific items where POPIA requires different content or a different regulator contact'
    ],
    3,
    'POPIA and GDPR overlap but are not identical — POPIA adds the Information Regulator as the local authority and has different breach-notification terms. A single high-standard notice with local addenda is the practical approach.',
    'cross_border_transfer',
    45,
    {
      distractor_rationale: [
        'WRONG - two fully separate notices create confusion and duplication; a single high-standard notice with local addenda is workable.',
        'WRONG - GDPR compliance does not automatically satisfy POPIA; local regulator contacts and breach timelines differ.',
        'WRONG - a POPIA-only notice will not satisfy GDPR higher requirements for EU data subjects.',
        'CORRECT - a single notice meeting GDPR plus POPIA-specific additions is the practical approach; regimes overlap but are not identical.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'GDPR-POPIA-overlap',
      rotation_bucket: 'cross_border_transfer',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Namibian hospital group discovers that a shared drive had been accessible to unauthorised staff for 6 months, exposing patient records. The breach was found during an internal audit, not by an attacker. The board asks whether this counts as a breach that needs notifying. What is the most defensible answer?',
    [
      'No — the exposure was internal and no external attacker was involved, so this is an internal governance matter, not a reportable breach',
      'No — the exposure was discovered by an internal audit, and only breaches discovered by external parties must be reported',
      'Yes — a security incident leading to accidental or unlawful access is a personal data breach under POPIA s.22 regardless of whether the access was malicious',
      'Yes, but only if the hospital can confirm that specific patient records were actually viewed by unauthorised staff'
    ],
    2,
    'POPIA s.22 and GDPR Art 4(12) define a personal data breach as a security incident leading to accidental or unlawful destruction, loss, alteration, or unauthorised disclosure or access. Intent is irrelevant.',
    'breach_notification',
    45,
    {
      distractor_rationale: [
        'WRONG - internal exposure is still unauthorised access under the breach definition; no external attacker is required.',
        'WRONG - the mode of discovery (internal audit, external report) does not affect whether a breach occurred.',
        'CORRECT - the definition of a breach covers accidental or unlawful access regardless of intent or attacker involvement.',
        'WRONG - the breach is defined by the exposure itself, not by confirmed viewing of specific records; notification decisions turn on risk, not confirmation of use.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'POPIA-s22',
      rotation_bucket: 'breach_notification',
      last_validated: '2026-11-14'
    }
  ),

  q(
    'A Windhoek software company offers a free mobile app to users in Namibia, Kenya, and the United Kingdom. The app collects location data "to improve the service." A UK user asks what lawful basis the company is relying on for the location collection. What is the most defensible answer?',
    [
      'State that "legitimate interest" covers all collection, since improving the service is a legitimate business purpose by definition',
      'Specify a lawful basis for each processing purpose — for location data this is typically consent, and it must be specific, informed, and withdrawable at any time',
      'State that the app terms of service constitute consent, since users agreed to the terms when they installed the app',
      'State that the location data is not personal data because it is aggregated before being used by the company'
    ],
    1,
    'GDPR Article 6 requires a lawful basis for each processing purpose. Location data is personal data; "improve the service" is not a lawful basis by itself, and bundling consent into terms of service is not valid consent.',
    'data_subject_rights',
    45,
    {
      distractor_rationale: [
        'WRONG - "legitimate interest" requires a balancing test and is not automatic; blanket reliance on it is not valid.',
        'CORRECT - Art 6 requires a specified lawful basis per purpose; location data typically relies on consent, which must be specific and withdrawable.',
        'WRONG - bundling consent into terms of service is not valid consent; consent must be freely given and separate.',
        'WRONG - location data is personal data even when aggregated at rest; the collection is the processing that requires a basis.'
      ],
      cognitive_level: 3,
      difficulty: 3,
      coverage_tag: 'GDPR-Art-6',
      rotation_bucket: 'data_subject_rights',
      last_validated: '2026-11-14'
    }
  ),

  
],
    14: [
        q('App account has db_owner “for convenience.” Primary risk?', ['Faster reports only', 'Blast radius: SQLi or app compromise becomes full DB takeover / data theft', 'None if SSL is on', 'Only affects NoSQL'], 1, 'Least privilege is a database control, not a slogan.', 'database', 40),
        q('Production DB reachable from the internet with weak auth. First move?', ['Celebrate remote admin', 'Remove exposure; enforce strong auth/network controls; rotate credentials; hunt access', 'Disable backups', 'Grant PUBLIC full rights'], 1, 'Attack surface reduction first.', 'database', 35)
    ],
    15: [
        q('CI pipeline deploys with a cloud admin key in plaintext variables. Fix pattern?', ['Leave it for speed', 'OIDC/short-lived roles, secret stores, least privilege deploy identities, scan pipelines', 'Disable all CI', 'Commit more secrets for redundancy'], 1, 'Pipeline identity is production identity.', 'devsecops', 40),
        q('Security gate fails on critical CVE; product wants “ship anyway.” Professional path?', ['Silent bypass forever', 'Document risk owner, compensating controls, time-boxed exception, follow-up ticket', 'Fire the developer publicly', 'Delete the scanner'], 1, 'Exceptions need owners and expiry.', 'devsecops', 40)
    ],
    16: [
        q('Live ransomware host still encrypting. Evidence vs containment?', ['Always image for 12 hours first', 'Contain to stop harm; capture volatile/critical evidence if playbook-safe; document chain of custody', 'Pull power on every site randomly', 'Wipe without notes'], 1, 'IR balances evidence with blast radius.', 'forensics', 45),
        q('Which artifact best answers “what ran?” on a Windows endpoint after reboot?', ['Only the wallpaper', 'Prefetch/Amcache/Shimcache/event logs/EDR telemetry (and memory if captured early)', 'The sticky note on the monitor', 'DHCP lease alone'], 1, 'Host artifacts + EDR beat guesses.', 'forensics', 40)
    ],
    17: [
        q('Threat intel PDF lists 200 IOCs with no context. Best use?', ['Block all blindly and break business', 'Prioritize by relevance to your assets/TTPs; enrich; hunt with detections not only blocks', 'Ignore intel forever', 'Email IOCs to all staff'], 1, 'Intel without context is noise.', 'threat_intel', 40),
        q('Best CTI output for SOC leadership?', ['Raw dump of dark-web slang', 'Relevant adversary TTPs, likely targets, detection gaps, and recommended actions', 'Only meme screenshots', 'Unverified rumors'], 1, 'Actionable intel beats collection theater.', 'threat_intel', 35)
    ],
    19: [
        q('Standing Domain Admin for 12 helpdesk techs “in case of emergency.” Fix?', ['Add more DA', 'JIT/PAM, role split, PAWs, remove standing Tier-0', 'Disable all logging', 'Share one DA password'], 1, 'Standing privilege is identity debt.', 'iam', 40),
        q('Service account password never rotates and has SPN. Risk family?', ['None', 'Kerberoasting / credential theft leading to lateral movement', 'Only phishing risk', 'Only physical theft'], 1, 'Service identity hygiene is core IAM.', 'iam', 40)
    ],
    20: [
        q('TLS terminates at a proxy that logs full request bodies including secrets. Concern?', ['Encryption solved everything', 'Cleartext at the proxy expands insider/compromise risk — minimize logging of secrets, protect the proxy', 'Disable TLS', 'Ignore certificates'], 1, 'Crypto moves trust; it does not erase it.', 'crypto', 40),
        q('Password stored as unsalted MD5. Correct remediation narrative?', ['Fine for SMEs', 'Broken storage — migrate to modern KDF (e.g. Argon2/bcrypt), force resets, hunt reuse', 'Add one more MD5 round forever', 'Email passwords as backup'], 1, 'Broken crypto storage is a breach waiting to happen.', 'crypto', 35)
    ],
    22: [
        q('Vendor SSO outage + their ransomware becomes your outage. Lesson?', ['Outsource risk completely', 'Third parties are part of your attack surface — assess, contract, monitor, plan alternatives', 'Never use vendors', 'Trust marketing PDFs only'], 1, 'Supply chain is operational dependency risk.', 'supply_chain', 40),
        q('npm package typosquat in CI. Best control set?', ['Blind auto-update everything', 'Pin versions, lockfiles, allowlists, SCA, review new deps, signed provenance where available', 'Disable package managers', 'Run CI as Domain Admin'], 1, 'Dependency hygiene is supply-chain defense.', 'supply_chain', 40)
    ],
    23: [
        q('API returns other users’ invoices by changing ?id=. Failure class?', ['XSS only', 'Broken object-level authorization (BOLA/IDOR)', 'DNS failure', 'Perfect design'], 1, 'AuthN ≠ AuthZ on every object.', 'api', 35),
        q('Machine client gets a long-lived admin token in a mobile app. Fix?', ['Ship it; tokens are secret by nature', 'Short-lived tokens, scoped roles, rotate, bind to client where possible, monitor abuse', 'Put token in the URL forever', 'Disable TLS'], 1, 'API identity needs least privilege and lifetime limits.', 'api', 40)
    ],
    24: [
        q('Container runs as root, mounts docker.sock, and is internet-exposed. Outcome risk?', ['Hardened by default', 'Host compromise via container escape / socket abuse', 'Only affects Kubernetes', 'None if image is alpine'], 1, 'Privileged containers inherit host risk.', 'container', 40),
        q('Best baseline for production images?', ['Latest :latest always', 'Minimal base, non-root, no secrets in layers, scan, signed provenance, least capabilities', 'Install full desktop in every image', 'Disable updates'], 1, 'Image hygiene is workload security.', 'container', 35)
    ],
    25: [
        q('Pod with cluster-admin ServiceAccount token stolen. Impact?', ['Namespace-only always', 'Cluster-wide compromise potential — tighten RBAC and secret exposure', 'Kubernetes cannot be attacked', 'Only affects DNS'], 1, 'K8s identity is the new Domain Admin.', 'kubernetes', 40),
        q('etcd / API server exposed without auth on a mismanaged cluster. First move?', ['Leave for debugging', 'Isolate exposure; rotate credentials; audit; rebuild trust boundaries', 'Grant anonymous admin', 'Turn off audit logs'], 1, 'Control plane exposure is game over.', 'kubernetes', 40)
    ],
    27: [
        q('Internal chatbot follows a poisoned doc and tries to exfiltrate via a plugin. Failure?', ['Model accuracy only', 'Prompt injection + over-privileged tools — need boundaries and human approval gates', 'Antivirus signatures', 'Disable all documentation'], 1, 'AI systems are tool-using agents with new abuse paths.', 'ai_security', 40),
        q('Best control when LLM can call payment APIs?', ['Trust the model’s tone', 'Strict tool allowlists, authZ checks, human confirm for high-risk actions, logging', 'Give it Domain Admin', 'Hide all errors'], 1, 'Treat model tools like untrusted operators.', 'ai_security', 40)
    ],
    30: [
        q('IT ransomware lateral path reaches a flat OT network. Priority framing?', ['Confidentiality first always', 'Safety and availability may dominate — segment, careful change control, do not “patch recklessly” mid-crisis', 'Pull every PLC offline forever without plan', 'Ignore OT'], 1, 'OT risk is safety-shaped.', 'ot', 45),
        q('Why are default OT protocol passwords still a crisis theme?', ['OT devices are never networked', 'Long lifecycles + uptime culture + flat networks leave weak auth reachable', 'ICS cannot speak IP', 'Antivirus replaces segmentation'], 1, 'Architecture and lifecycle drive OT debt.', 'ot', 40)
    ],
    31: [
        q('Clinic laptop with ePHI left in a taxi. Dual response?', ['Only buy a new laptop', 'Technical containment (wipe/remote if possible) + breach assessment under applicable health privacy rules', 'Post patient names publicly', 'Ignore because encrypted maybe'], 1, 'Health data incidents mix tech and regulatory clocks.', 'hipaa', 40),
        q('Staff share patient charts over personal WhatsApp for “speed.” Control?', ['Encourage it', 'Approved secure channels, training, DLP where feasible, and clear sanctions + coaching', 'Ban all clinical communication', 'Email unencrypted ZIP forever'], 1, 'Convenience channels become disclosure channels.', 'hipaa', 35)
    ],
    32: [
        q('Cardholder data found in application logs. PCI posture?', ['Fine if TLS exists', 'Sensitive auth data in logs is a control failure — stop logging PAN/secrets; purge; assess scope', 'Increase log retention of PANs', 'Store CVV for retries'], 1, 'PCI cares where CHD lives — including logs.', 'pci', 40),
        q('Why network segmentation matters for PCI scope?', ['It paints racks blue', 'Limits which systems are in CHD environment — reduces assessment and blast radius', 'Replaces encryption', 'Makes firewalls optional'], 1, 'Scope reduction is strategy.', 'pci', 35)
    ],
    34: [
        q('Engineer downloads entire CRM before resignation. Best detection family?', ['Only badge logs', 'UEBA/DLP + access anomalies + HR offboarding triggers', 'Wallpaper changes', 'Ping sweeps'], 1, 'Insider risk is identity + data movement.', 'insider', 40),
        q('Manager asks IT to read an employee’s mailbox “quietly.” Professional response?', ['Do it secretly always', 'Follow lawful process/policy with authorization and audit — no vigilante surveillance', 'Post mail on Slack', 'Disable all email audit'], 1, 'Insider programs need legal/process guardrails.', 'insider', 40)
    ],
    36: [
        q('Backups succeed nightly; restore never tested. Honest BCP status?', ['Fully resilient', 'Backup existence ≠ recoverability — untested restores are assumed failure', 'DR is only for enterprises', 'Ransomware cannot hit backups'], 1, 'Test restores or admit the gap.', 'bcp', 35),
        q('Ransomware hits production and the backup VLAN. What failed architecturally?', ['Nothing', 'Lack of offline/immutable isolation and restore drills', 'Too much MFA', 'Having a DR plan document'], 1, 'Blast radius includes backup infrastructure.', 'bcp', 40)
    ],
    38: [
        q('Risk register lists “cyber” as one row with no owner. Fix?', ['Add more buzzwords', 'Decompose risks, assign owners, treatments, dates, residual risk, review cadence', 'Delete the register', 'Only track after breaches'], 1, 'Risk management is ownership theater-killer.', 'risk', 35),
        q('Critical vuln, no patch for 60 days, compensating WAF. How to record?', ['Pretend patched', 'Time-boxed risk acceptance with owner, compensating controls, and revisit date', 'Hide from auditors', 'Disable detection'], 1, 'Acceptance is a decision, not silence.', 'risk', 40)
    ],
    39: [
        q('Scanner finds 12,000 “medium” findings. Prioritization key?', ['Alphabetical', 'Exploitability + asset criticality + exposure + threat context — not raw severity alone', 'Only CVSS 10s forever', 'Ignore authenticated scans'], 1, 'Vulnerability management is triage under resource limits.', 'vuln', 40),
        q('Internet-facing RCE on ERP vs internal info disclosure on a printer. Order?', ['Printer first for easy wins only', 'ERP RCE first — business impact and exposure dominate', 'Neither matters', 'Wait for ransomware note'], 1, 'Impact × exposure beats ticket count.', 'vuln', 35)
    ],
    40: [
        q('Pentest report dumps 80 findings with no business context. Ask the provider for?', ['More jargon', 'Risk-ranked findings, exploit paths, evidence, and remediation guidance tied to assets', 'Only screenshots of tools', 'A free hoodie'], 1, 'Pentests should enable remediation.', 'pentest', 40),
        q('Retest after fixing authZ bugs. Why mandatory?', ['Billing only', 'Proves closure; finds regressions; builds trust with leadership', 'Retests are optional marketing', 'Disable logging during retest'], 1, 'Closure without retest is hope.', 'pentest', 35)
    ],
    41: [
        q('Red team “wins” by phishing; blue detected in 3 days. Best after-action?', ['Shame blue publicly', 'Measure MTTD/MTTR, fund gaps, re-emulate — shared learning not scoreboard ego', 'Fire SOC', 'Hide the report'], 1, 'Red/blue value is improvement proof.', 'redblue', 40),
        q('Why share ATT&CK IDs between red and blue?', ['Decoration', 'Common language for coverage, detections, and purple planning', 'Replaces EDR', 'Only for compliance PDFs'], 1, 'Shared vocabulary accelerates fixes.', 'redblue', 35)
    ],
    42: [
        q('NIST CSF used only as a slide title. Make it operational how?', ['Memorize acronyms', 'Map controls/processes to Identify/Protect/Detect/Respond/Recover with owners and evidence', 'Buy a tool named NIST', 'Ignore profiles'], 1, 'Frameworks are operating systems for programs.', 'frameworks', 40),
        q('CIS Controls vs ATT&CK — complementary how?', ['They conflict', 'CIS prioritizes defensive safeguards; ATT&CK describes adversary techniques to test those safeguards', 'Only one should exist', 'Neither helps SMEs'], 1, 'Safeguards + adversary map = purple fuel.', 'frameworks', 40)
    ],
    43: [
        q('Cloud account compromised; instances terminated. Forensics challenge?', ['Disks always remain forever', 'Ephemeral evidence — need prior logging/snapshots/cloud trail retention design', 'Cloud forensics is impossible', 'Only capture screenshots'], 1, 'Prepare logging before the fire.', 'cloud_forensics', 40),
        q('Best early cloud IR evidence sources?', ['Only the attacker’s blog', 'Cloud audit trails, IAM history, VPC flow, load balancer logs, snapshots if available', 'Office wallpaper', 'DHCP alone'], 1, 'Provider logs are your black box.', 'cloud_forensics', 35)
    ],
    45: [
        q('Employee runs exploit kit against a random .na site “for practice.” Legal framing?', ['Fine if educational', 'Unauthorized access is illegal — use owned/authorized labs only', 'Allowed under 5MB damage', 'OK if VPN is on'], 1, 'Law does not care about your learning intent.', 'cyber_law', 35),
        q('When leadership asks to “hack back” an attacker server, counsel says?', ['Always hack back', 'Usually unlawful/dangerous — contain, evidence, law enforcement channels per policy', 'Dox the attacker on Facebook', 'Wipe your own logs'], 1, 'Hack-back is not a DIY IR tactic.', 'cyber_law', 40)
    ],
    47: [
        q('PCAP shows regular HTTPS to rare domain every 60s with JA3 novelty. Hunt next?', ['Ignore HTTPS', 'Host process ancestry + destination rarity + beacon jitter — possible C2', 'Disable all TLS', 'Only trust filename IOCs'], 1, 'Packets + host context beat either alone.', 'pcap', 40),
        q('Why defenders still need packet skills when EDR exists?', ['They do not', 'Network blind spots, OT, encrypted C2 patterns, and validation of host stories', 'Packets replace identity', 'Wireshark patches servers'], 1, 'Defense in depth includes the wire.', 'pcap', 35)
    ],
    48: [
        q('Metasploit-style post modules appear in telemetry. SOC framing?', ['Always a CTF', 'Possible exploitation framework use — verify authorization, contain, hunt pivots', 'Ignore framework names', 'Ban all Python'], 1, 'Framework marks are technique clues.', 'metasploit', 40),
        q('Best purple use of Metasploit awareness?', ['Attack production randomly', 'Emulate known techniques safely to test detections — not to glorify exploits', 'Teach ransomware deployment', 'Disable EDR during tests without ROE'], 1, 'Awareness serves detection proof.', 'metasploit', 35)
    ],
    49: [
        q('Burp replay shows IDOR on invoice API. Developer says “but we have JWT.” Reply?', ['JWT fixes AuthZ automatically', 'Authentication ≠ object authorization — fix server-side checks', 'Hide the finding', 'Rate-limit only'], 1, 'Tokens do not equal per-object AuthZ.', 'burp', 40),
        q('Stored XSS via Burp-found field. Priority if session cookies lack HttpOnly?', ['Low forever', 'High — session theft risk; fix output encoding + cookie flags', 'Only CSS issue', 'Ignore on intranet'], 1, 'XSS + weak cookies = account takeover.', 'burp', 40)
    ],
    50: [
        q('SQLMap-style noisy union probes in WAF logs. Immediate action?', ['Ignore scanners', 'Block/tune; hunt whether injection succeeded; fix parameterized queries at source', 'Disable WAF', 'Grant db_owner to app'], 1, 'Tool noise can hide successful exploitation.', 'sqli', 40),
        q('Durable SQLi fix?', ['Blacklist quotes only', 'Parameterized queries / ORM bind variables + least-privilege DB accounts', 'Hide error messages only', 'MD5 the SQL'], 1, 'Fix the query construction.', 'sqli', 35)
    ],
    53: [
        q('Sliver/Empire-like agent with sleep and named-pipe pivoting. Detection focus?', ['Filename only', 'Beacon cadence, peer-to-peer quirks, process injection ancestry, rare egress', 'Disable SMB company-wide blindly', 'Trust internal IPs'], 1, 'Behavior over brand.', 'c2', 40),
        q('Why multiple C2 frameworks in training?', ['Marketing', 'Operators switch tools; techniques recur — train the pattern language', 'Only Cobalt exists', 'Frameworks cannot be detected'], 1, 'Technique literacy transfers.', 'c2', 35)
    ],
    54: [
        q('Hash dump leaves the network; cracking is “offline.” Defense implication?', ['Offline cracking is irrelevant', 'Prevent dump and reuse; treat cracked passwords as credential incidents; enforce length/MFA/passwordless', 'Only online spray matters', 'Captchas stop Hashcat'], 1, 'Once dumped, time favors the attacker.', 'hashcat', 40),
        q('Best control against cracked service account passwords?', ['Longer user password posters', 'gMSA/managed identities, rotation, no interactive SPNs where avoidable, detect dumps', 'Reuse admin passwords', 'Disable monitoring'], 1, 'Architecture beats cracking races.', 'hashcat', 40)
    ],
    56: [
        q('Hydra-like spray against VPN then success. 10-minute response?', ['Close as noise', 'Contain account/session; hunt lateral; enforce lockout/MFA/passwordless; review logs', 'Disable VPN for all', 'Congratulate the user'], 1, 'Spray success is identity compromise.', 'hydra', 40),
        q('Why MFA alone may not stop spray+AiTM combos?', ['MFA is useless always', 'OTP can be phished/proxied; prefer phishing-resistant MFA and session controls', 'Spraying cannot work', 'Disable passwords only'], 1, 'MFA quality matters.', 'hydra', 40)
    ],
    59: [
        q('Kerberoasting succeeds on a high-privilege SPN. Root debt?', ['Kerberos is obsolete', 'Over-privileged service accounts with weak passwords / excessive SPNs', 'DNS failure', 'Having EDR'], 1, 'Service identity design is the fix.', 'kerberos', 40),
        q('AS-REP Roasting targets which misconfig family?', ['Disabled accounts only', 'Accounts without pre-auth where crackers can attack the AS-REP offline', 'Smart card only users', 'gMSA correctly configured'], 1, 'Pre-auth gaps enable offline attacks.', 'kerberos', 40)
    ],
    61: [
        q('rundll32/regsvr32/mshta chain launches encoded payload. Classification?', ['Benign Windows Update always', 'LOLBin abuse — living-off-the-land execution', 'Only Mac risk', 'Printer drivers'], 1, 'Trusted binaries can be attacker loaders.', 'lolbins', 40),
        q('Best detection approach for LOLBins?', ['Block every Windows binary', 'Parent/child ancestry + unusual script/network context + allowlists for admin use', 'Ignore signed binaries', 'Filename contains “lol”'], 1, 'Context detects LOLBins.', 'lolbins', 40)
    ],
    62: [
        q('Constrained Language Mode bypass attempts in PowerShell logs. SOC action?', ['Ignore scripts', 'Treat as suspicious tradecraft; investigate host/user; harden logging (ScriptBlock) and constrain where possible', 'Disable all logging', 'Allow unrestricted forever'], 1, 'PowerShell is both admin glue and attacker glue.', 'powershell', 40),
        q('Why ScriptBlock logging matters?', ['Pretty dashboards', 'Reveals encoded/obfuscated attacker intent that filename IOCs miss', 'Replaces AMSI always', 'Slows attackers to zero'], 1, 'Content visibility beats hash lists.', 'powershell', 35)
    ],
    65: [
        q('Phishing kit mirrors your bank portal and relays MFA. Control family?', ['Pixel-perfect logos', 'Phishing-resistant MFA + user reporting + takedown/intel + conditional access', 'Longer passwords only', 'Disable online banking'], 1, 'Kits industrialize AiTM.', 'phishkit', 40),
        q('Kit uses your exact CSS from a public CDN. Lesson?', ['Brand theft is impossible', 'Visual trust is weak — teach process verification and passkeys', 'CSS integrity stops phishing', 'Only email filters matter'], 1, 'Users cannot out-see modern kits alone.', 'phishkit', 35)
    ],
    68: [
        q('Shodan shows your RDP and NAS on the public internet. First move?', ['Celebrate remote work', 'Remove exposure; VPN/ZTNA; patch; hunt for abuse; assign owners', 'Change wallpaper', 'Post the banner for fun'], 1, 'Attack surface discovery is free for adversaries.', 'shodan', 40),
        q('Best ongoing use of internet scanners for defenders?', ['Ignore them', 'Continuous external ASM with ticketed owners and SLAs', 'Scan random third parties without auth', 'Only annual audits'], 1, 'See yourself as attackers do.', 'shodan', 35)
    ],
    74: [
        q('Memory-only implant suspected; disk clean. Priority artifact?', ['Wallpaper', 'RAM capture if still powered and playbook allows; EDR telemetry; network sessions', 'Only recycle bin', 'BIOS password'], 1, 'Volatility-class work needs timely memory.', 'memory', 40),
        q('Why reboot can destroy evidence of fileless malware?', ['It never does', 'Memory-resident payloads vanish; capture before reboot when safe', 'Reboots patch CVEs', 'Disk always has everything'], 1, 'Order of volatility is real.', 'memory', 35)
    ],
    75: [
        q('YARA rule hits on a packing trait with high false positives. Next?', ['Alert-flood forever', 'Tighten rule, add context (path/process), tune before production severity', 'Disable all scanning', 'Ship FP to executives daily'], 1, 'Hunting rules need operational care.', 'yara', 40),
        q('Best YARA role in a SOC?', ['Replace EDR', 'Scalable hunting/classification aid alongside behavioral detections', 'Only malware author use', 'Block every match automatically always'], 1, 'YARA amplifies hunters.', 'yara', 35)
    ],
    78: [
        q('China Chopper-like POST to odd .aspx under wwwroot. Action?', ['Ignore web logs', 'Isolate web server; preserve; hunt webshells; rotate creds; review deploy integrity', 'chmod 777 everything', 'Disable WAF only'], 1, 'Web shells are persistence + remote control.', 'webshell', 40),
        q('How do webshells often arrive?', ['Magic', 'Vulnerable apps, weak admin, supply-chain deploy, or prior foothold', 'Only USB', 'Printer firmware only'], 1, 'Fix entry + integrity monitoring.', 'webshell', 35)
    ],
    79: [
        q('WMI/WinRM/PsExec-style lateral after one workstation phish. Priority?', ['Wait for ransomware note', 'Contain identity+hosts; reset creds; hunt admin shares and remote execution; segment', 'Disable Ethernet building-wide', 'Only reimage the first PC'], 1, 'Lateral tooling turns one host into many.', 'lateral', 40),
        q('Best architectural brake on lateral movement?', ['Flat VLAN forever', 'Segmentation + least privilege + PAW + monitored privileged remote execution', 'More screensavers', 'Longer DHCP leases'], 1, 'Architecture limits hop distance.', 'lateral', 40)
    ],
    80: [
        q('Local admin → SYSTEM via unquoted service path. Prevention?', ['Ignore service ACLs', 'Hardened images, least privilege, patch, control writable service paths, EDR on privesc', 'Give all users local admin', 'Disable services monitoring'], 1, 'Privesc is often misconfig, not magic.', 'privesc', 40),
        q('Why remove standing local admin on workstations?', ['Inconvenience only', 'Stops trivial privesc/credential theft paths and ransomware ease', 'Breaks all software forever', 'Required by printers'], 1, 'Local admin is a gift to attackers.', 'privesc', 35)
    ],
    81: [
        q('New Run key + scheduled task after hours on a server. Classification?', ['Always Windows Update', 'Possible persistence — investigate publisher, parent, network, and scope', 'Ignore registry', 'Reboot only'], 1, 'Persistence is how intrusions survive.', 'persist', 40),
        q('Cloud persistence analogue to Run keys?', ['None', 'Backdoor users, access keys, federation trusts, malicious automations/functions', 'Only EC2 wallpapers', 'DHCP reservations'], 1, 'Identity and automation are cloud persistence.', 'persist', 40)
    ],
    85: [
        q('Adversary emulation plan without detections mapped. Problem?', ['None', 'You generate noise without learning — map techniques to expected alerts and owners first', 'Emulation replaces IR', 'Only red needs plans'], 1, 'Emulation is a test harness for defenses.', 'emulation', 40),
        q('Success criterion for an emulation week?', ['Red team entertainment', 'Documented detect/respond outcomes and funded gaps with retest dates', 'Maximum stealth forever', 'No reporting'], 1, 'Proof over theater.', 'emulation', 35)
    ],
    86: [
        q('AI voice clone of CFO demands wire transfer. Surviving control?', ['Caller ID', 'Pre-agreed challenge + dual control on known channels', 'Trust urgency', 'Approve if under N$10m'], 1, 'Process beats synthetic audio.', 'deepfake', 40),
        q('Why “it sounded exactly like them” is a weak control?', ['Voices cannot be cloned', 'Synthesis quality is high — verification process is the control', 'Deepfakes only exist in movies', 'WhatsApp verifies identity automatically'], 1, 'Train process, not ear accuracy.', 'deepfake', 35)
    ],
    88: [
        q('Stolen cloud access key used from unfamiliar ASN. First moves?', ['Ignore cloud IAM', 'Revoke/rotate; review Trail; constrain with SCP/conditional access; hunt resource abuse', 'Delete the org', 'Share keys in ticket for clarity'], 1, 'Cloud credential theft is identity IR.', 'cloud_cred', 40),
        q('Preferable to long-lived keys for CI?', ['More long-lived keys', 'OIDC/federated short-lived roles', 'Root account everyday use', 'Disable CloudTrail'], 1, 'Short-lived federation reduces theft value.', 'cloud_cred', 35)
    ],
    90: [
        q('Typosquat package in build steals CI secrets. Dual impact?', ['Only open source drama', 'Your pipeline becomes attacker infra — rotate secrets, audit artifacts, pin/allowlist deps', 'Ignore transitive deps', 'Ban all builds'], 1, 'Poisoned toolchains compromise trust.', 'supply_poison', 40),
        q('Best preventive pattern for build supply chain?', ['Blind latest tags', 'Lockfiles, provenance/signatures, private mirrors, review new deps, least-privilege CI', 'Run builds as Domain Admin', 'Disable SCA'], 1, 'Integrity of inputs protects outputs.', 'supply_poison', 40)
    ]
};

const TIER_B_EXTRAS = {
    2: { why: 'Malware defense fails when you trust a single sandbox verdict or filename.', concepts: ['Environment-aware and human-operated malware', 'Safe handling and evidence-minded triage', 'Identity + host correlation beats single tools'], prevent: ['EDR isolation playbooks', 'Application allowlisting where feasible', 'User coaching without shame'], caseStudy: 'A “clean” sandbox sample still encrypted Finance after a delayed second stage — EDR isolation in minutes limited blast radius.', futureScenario: 'AI-generated loaders will mutate weekly; behavior and identity context stay durable.' },
    3: { why: 'Networks fail from flat trust and blind east-west paths more than from missing logos on firewalls.', concepts: ['Lateral movement on flat VLANs', 'Segmentation as blast-radius control', 'Identity-aware network monitoring'], prevent: ['Segment crown jewels', 'Hunt admin$ and unusual SMB/WinRM', 'Remove “internal = trusted”'], caseStudy: 'Marketing laptop → ERP via admin$ forced a segmentation project after near-miss ransomware.', futureScenario: 'ZTNA will not erase the need to see east-west in hybrid campuses.' },
    4: { why: 'Cloud breaches are usually identity and exposure failures, not sci-fi zero-days.', concepts: ['Public storage and long-lived keys', 'Shared responsibility clarity', 'Short-lived roles and secret scanning'], prevent: ['Block public ACLs by policy', 'OIDC for CI', 'CSPM with owners'], caseStudy: 'A public bucket of invoices was closed in an hour; key rotation and CI secret scanning followed the same week.', futureScenario: 'Agentic tools with over-broad roles will be the next accidental exfil path.' },
    5: { why: 'Phones are business approval devices — malware and phishing travel with them.', concepts: ['BYOD vs managed containers', 'Sideloaded APK risk', 'Scoped app access over network immersion'], prevent: ['MDM/MAM or VDI for sensitive apps', 'Phishing-resistant auth on mobile', 'Separate personal sideload from work'], caseStudy: 'A contractor WhatsApp approval on a sideloaded APK nearly authorized a fraudulent payment — VDI cut the path.', futureScenario: 'Deepfake video calls on mobile will pressure managers; process still wins.' },
    9: { why: 'Compliance that cannot show evidence is theater.', concepts: ['Operating effectiveness vs policy intent', 'Sampling and tickets as proof', 'VIP exceptions are still risk'], prevent: ['Evidence lockers for controls', 'Owners and due dates', 'Close MFA gaps on privileged accounts'], caseStudy: 'An auditor accepted MFA screenshots and ticket samples — not a 40-page policy reprint.', futureScenario: 'Continuous control monitoring will replace annual binders.' },
    10: { why: 'Ethical hacking without authorization is just hacking.', concepts: ['Written ROE and scope', 'Legal boundaries for learners', 'Responsible disclosure paths'], prevent: ['Use owned labs only', 'Document stop conditions', 'Separate personal curiosity from production'], caseStudy: 'A well-meant “test” of a client Wi-Fi without a letter created legal exposure — ROE training fixed the culture.', futureScenario: 'AI will make exploit attempts easier; authorization culture must get stronger.' },
    12: { why: 'Privacy incidents start legal clocks alongside technical work.', concepts: ['Notification duties', 'Processor contracts', 'Minimize and protect personal data'], prevent: ['DPAs and vendor reviews', 'Encryption and access logs', 'Incident playbooks with legal bridge'], caseStudy: 'A misdirected HR export triggered dual-track IR and privacy assessment the same day — trust held.', futureScenario: 'Cross-border AI training data will create new privacy debt.' },
    14: { why: 'Databases concentrate crown jewels — privilege and exposure decide outcomes.', concepts: ['Least-privilege app accounts', 'SQLi blast radius', 'Internet-facing DB is malpractice'], prevent: ['Remove public DB ports', 'Parameterized queries', 'Encrypt sensitive fields and backups'], caseStudy: 'db_owner “for convenience” turned a web bug into a full customer dump — privileges were cut the next sprint.', futureScenario: 'AI agents querying prod DBs will need strict AuthZ.' },
    15: { why: 'Your CI identity is production power.', concepts: ['Secrets in pipelines', 'OIDC deploy roles', 'Risk exceptions with owners'], prevent: ['Secret scanning', 'Least-privilege deploy', 'Break-glass with audit'], caseStudy: 'A leaked CI admin key minted compute for crypto mining — OIDC migration followed.', futureScenario: 'Autonomous merge bots will need tighter gates, not fewer.' },
    16: { why: 'Forensics without containment can burn the business; containment without notes burns the case.', concepts: ['Order of volatility', 'Chain of custody', 'EDR + host artifacts'], prevent: ['Playbooks for live response', 'Time sync and log retention', 'Practice imaging drills'], caseStudy: 'Memory captured before reboot revealed a fileless loader EDR had partially seen — hunt expanded cleanly.', futureScenario: 'Ephemeral cloud workloads will demand pre-built forensic logging.' },
    17: { why: 'Threat intelligence is only valuable when it changes detections or decisions.', concepts: ['Relevance over volume', 'TTP-focused intel', 'Feedback loops to SOC'], prevent: ['Curate sources', 'Map to ATT&CK coverage', 'Retire stale IOC feeds'], caseStudy: 'A TTP brief on service-account spray funded MFA for non-humans — more useful than 5,000 hashes.', futureScenario: 'AI-written intel spam will rise; human relevance filters win.' },
    19: { why: 'Identity is the new perimeter — standing privilege is debt.', concepts: ['JIT/PAM and PAWs', 'Service account hygiene', 'Kerberos-related identity attacks'], prevent: ['Remove standing DA', 'Rotate/monitor service identities', 'Phishing-resistant MFA for humans'], caseStudy: 'Twelve standing DAs became three JIT roles after a near-miss PtH event.', futureScenario: 'Machine identities will outnumber humans — govern them like Tier-0.' },
    20: { why: 'Cryptography moves trust; weak storage and proxy logging move risk.', concepts: ['TLS trust boundaries', 'Modern password KDFs', 'Secret minimization in logs'], prevent: ['Stop logging secrets', 'Migrate broken hashes', 'Protect key material and HSM where needed'], caseStudy: 'Proxy body logging leaked API keys — logging policy changed faster than any cipher debate.', futureScenario: 'Post-quantum migration will be a program, not a weekend change.' },
    22: { why: 'Your vendors’ incidents become your incidents.', concepts: ['Dependency and SaaS risk', 'Contractual security requirements', 'Typosquat and build poisoning'], prevent: ['Vendor tiering', 'SCA and pin deps', 'Exit plans for critical SaaS'], caseStudy: 'A payroll SaaS outage halted salaries — contractual uptime and offline process were added.', futureScenario: 'AI-generated malicious packages will increase supply-chain pressure.' },
    23: { why: 'APIs expose business objects at scale — AuthZ bugs scale with them.', concepts: ['BOLA/IDOR', 'Token lifetime and scope', 'Server-side authorization'], prevent: ['Object-level AuthZ tests', 'Short-lived tokens', 'Schema and rate controls'], caseStudy: 'Changing ?invoiceId= revealed other customers — a single AuthZ middleware fix closed the class.', futureScenario: 'Agentic API clients will abuse over-broad tokens unless scoped.' },
    24: { why: 'Containers inherit host risk when privileged and exposed.', concepts: ['Non-root and capabilities', 'docker.sock danger', 'Image provenance'], prevent: ['Minimal images', 'Scan and sign', 'No privileged internet-facing workloads'], caseStudy: 'A root container with docker.sock became a host compromise — baselines banned the pattern.', futureScenario: 'AI-built images will need provenance more than ever.' },
    25: { why: 'Kubernetes RBAC mistakes recreate Domain Admin in YAML.', concepts: ['ServiceAccount privilege', 'Control plane exposure', 'Network policies'], prevent: ['Least-privilege RBAC', 'Audit API access', 'Private control plane'], caseStudy: 'Stolen cluster-admin token from a pod led to a full cluster rebuild and RBAC rewrite.', futureScenario: 'Multi-cluster identity will be the next BloodHound problem.' },
    27: { why: 'AI systems add prompt injection and tool abuse to classic AppSec.', concepts: ['Untrusted content as instructions', 'Tool allowlists', 'Human approval for high-risk actions'], prevent: ['Separate trust domains', 'Log tool calls', 'Least-privilege plugins'], caseStudy: 'A poisoned wiki page made a bot attempt secret exfil via a connector — tool gates stopped it.', futureScenario: 'Autonomous agents will require continuous AuthZ, not one-time prompts.' },
    30: { why: 'OT incidents can threaten safety and uptime, not only data.', concepts: ['Flat IT/OT risk', 'Change control discipline', 'Weak protocol auth'], prevent: ['Segmentation and DMZs', 'Monitor carefully', 'Vendor access control'], caseStudy: 'IT ransomware stopped at a newly installed OT firewall — safety systems stayed up.', futureScenario: 'Remote vendor access will remain the soft underbelly of plants.' },
    31: { why: 'Health data combines clinical urgency with strict privacy expectations.', concepts: ['ePHI handling', 'Secure channels vs WhatsApp convenience', 'Breach assessment discipline'], prevent: ['Approved messaging', 'Device encryption', 'Access audits'], caseStudy: 'WhatsApp chart sharing was replaced with an approved app after a near-disclosure.', futureScenario: 'AI scribes will create new ePHI leakage paths if ungoverned.' },
    32: { why: 'PCI is about where card data lives — including logs and flat networks.', concepts: ['CHD in logs', 'Segmentation for scope', 'No CVV storage'], prevent: ['Stop logging PAN', 'Encrypt and tokenize', 'Quarterly scope reviews'], caseStudy: 'PAN in debug logs expanded PCI scope overnight — logging filters became a release gate.', futureScenario: 'API-heavy payments will keep AuthZ and logging in the spotlight.' },
    34: { why: 'Insiders already have trust — detect data movement and govern access.', concepts: ['UEBA/DLP signals', 'Offboarding triggers', 'Lawful investigation process'], prevent: ['Least privilege', 'High-risk access reviews', 'HR-IT joiners/movers/leavers'], caseStudy: 'CRM bulk download before resignation was caught by DLP — legal handled cleanly with audit.', futureScenario: 'Remote work will make behavioral baselines more important than badge readers alone.' },
    36: { why: 'Disaster recovery is proven only by restores, not backup job green checks.', concepts: ['Immutable/offline copies', 'Restore drills', 'Backup VLAN isolation'], prevent: ['Quarterly restore tests', 'Separate backup credentials', 'Document RTO/RPO honestly'], caseStudy: 'Ransomware hit the backup NAS on the same VLAN — immutable copies offsite saved the company.', futureScenario: 'Cloud snapshot deletion by attackers will punish missing immutability.' },
    38: { why: 'Risk management assigns owners to uncertainty — it is not a spreadsheet hobby.', concepts: ['Treatment options', 'Residual risk', 'Time-boxed acceptance'], prevent: ['Living risk register', 'Link to vulns and incidents', 'Board-ready language'], caseStudy: 'A dated risk acceptance for an unpatchable VPN concentrated funding for ZTNA.', futureScenario: 'AI risk entries will need the same owners as classic cyber risks.' },
    39: { why: 'Vulnerability management is prioritization under constraint.', concepts: ['Exploitability × exposure × criticality', 'Authenticated scanning', 'Exception expiry'], prevent: ['SLA by severity/exposure', 'Threat-informed triage', 'Fix verification'], caseStudy: '12k mediums shrank to 40 real actions when ERP exposure drove the queue.', futureScenario: 'EPSS-like scoring will help — asset context still decides.' },
    40: { why: 'Penetration tests should change risk, not decorate shelves.', concepts: ['Risk-ranked findings', 'Remediation guidance', 'Retest proof'], prevent: ['Scope that matches business', 'Fix sprints with owners', 'Retest criticals'], caseStudy: 'AuthZ findings retested green in 30 days — leadership funded the AppSec lane.', futureScenario: 'Continuous automated testing will still need human risk narrative.' },
    41: { why: 'Red and blue succeed when the organization learns — not when egos win.', concepts: ['MTTD/MTTR', 'ATT&CK shared language', 'Purple funding loops'], prevent: ['Blameless after-action', 'Retest gaps', 'Protect detections during exercises via ROE'], caseStudy: 'A 3-day phishing dwell time became 12 minutes after mailbox detections funded by the AAR.', futureScenario: 'Continuous emulation platforms will need human prioritization.' },
    42: { why: 'Frameworks are how you explain and operate a security program.', concepts: ['NIST CSF functions', 'CIS safeguards', 'ATT&CK as adversary map'], prevent: ['Map controls to owners', 'Evidence per function', 'Purple tests against mapped techniques'], caseStudy: 'A CSF profile turned “we need tools” into funded Detect/Respond outcomes.', futureScenario: 'Boards will ask for framework language — fluency is career currency.' },
    43: { why: 'Cloud forensics rewards preparation — instances die, logs remain if you kept them.', concepts: ['Ephemeral evidence', 'CloudTrail/IAM history', 'Snapshot discipline'], prevent: ['Centralize audit logs', 'Immutable log sinks', 'IR runbooks per CSP'], caseStudy: 'Terminated instances left a Trail of IAM key misuse — enough to scope the breach.', futureScenario: 'Serverless will push IR even further into logs and identity.' },
    45: { why: 'Cyber law draws bright lines around authorization and hack-back fantasies.', concepts: ['Unauthorized access', 'Evidence preservation', 'Lawful process'], prevent: ['Authorized labs only', 'Legal review for active defense claims', 'Clear acceptable use'], caseStudy: 'A learner’s unauthorized scan created a legal letter — training now starts with law.', futureScenario: 'AI attack tools will not change the authorization rule.' },
    47: { why: 'Packet literacy validates host stories and finds what EDR never saw.', concepts: ['Beacon patterns', 'JA3/rarity', 'PCAP + process correlation'], prevent: ['Full-packet where justified', 'NetFlow everywhere', 'Hunt C2 cadence'], caseStudy: '60s HTTPS beacons looked like SaaS until PCAP + ancestry showed C2.', futureScenario: 'Encrypted traffic still leaks timing — defenders will keep timing skills.' },
    48: { why: 'Exploitation frameworks leave technique fingerprints defenders can rehearse against.', concepts: ['Post-exploitation module marks', 'Authorization vs crime', 'Purple emulation'], prevent: ['Detect framework behaviors', 'ROE for tests', 'Patch and harden common paths'], caseStudy: 'Metasploit-like telemetry during an unauthorized event triggered containment before domain impact.', futureScenario: 'Frameworks will keep changing names; techniques will rhyme.' },
    49: { why: 'Web attack proxies teach the difference between AuthN theater and AuthZ reality.', concepts: ['IDOR/BOLA', 'XSS session risk', 'Replay and logic flaws'], prevent: ['Object AuthZ tests', 'Cookie flags + encoding', 'WAF as seatbelt not steering wheel'], caseStudy: 'Burp replay of invoice IDs funded a week of AuthZ middleware work.', futureScenario: 'GraphQL and APIs will keep IDOR alive without discipline.' },
    50: { why: 'Injection tooling is loud — successful exploitation can be quiet afterward.', concepts: ['Parameterized queries', 'Least-privilege DB', 'WAF + fix source'], prevent: ['Secure coding gates', 'Block noisy probes', 'Hunt data exfil after probes'], caseStudy: 'SQLMap noise hid one successful extract — DB privileges were cut the same day.', futureScenario: 'AI-assisted injection will increase probe volume; AuthZ and bind variables still win.' },
    53: { why: 'Modern C2 frameworks emphasize stealth, sleep, and flexible transports.', concepts: ['Beacon jitter', 'Named-pipe pivoting', 'Multi-framework technique overlap'], prevent: ['Detect cadence and ancestry', 'Egress control', 'Purple retests'], caseStudy: 'A quiet agent using pipes laterally was caught by unusual parent/child plus rare egress.', futureScenario: 'AI will rewrite profiles; behavior remains the constant.' },
    54: { why: 'Offline cracking turns dumped hashes into passwords on the attacker’s clock.', concepts: ['Dump prevention', 'Strong service identities', 'Passwordless and length'], prevent: ['Protect LSASS/secrets', 'gMSA', 'Detect dump tooling'], caseStudy: 'A hash dump cracked a reused admin password — passwordless + PAM followed.', futureScenario: 'GPU cracking will keep accelerating; theft prevention matters more.' },
    56: { why: 'Online guessing still works where MFA is weak and lockouts are absent.', concepts: ['Password spray', 'VPN as target', 'MFA quality'], prevent: ['Lockouts/slowdown', 'Phishing-resistant MFA', 'Hunt success-after-fail'], caseStudy: 'Spray against VPN succeeded on a service-like user — non-human MFA and alerts were added.', futureScenario: 'Credential stuffing will blend with AiTM; session binding helps.' },
    59: { why: 'Kerberos attacks punish weak service identities and pre-auth gaps.', concepts: ['Kerberoasting', 'AS-REP Roasting', 'SPN hygiene'], prevent: ['Strong/managed service passwords', 'Audit SPNs', 'Detect unusual TGS requests'], caseStudy: 'A roastable DA-equivalent SPN was removed after a purple test cracked it offline.', futureScenario: 'Hybrid Kerberos/cloud paths will need continuous graphing.' },
    61: { why: 'LOLBins abuse trust in signed operating system binaries.', concepts: ['Parent/child anomalies', 'Script host abuse', 'Allowlists for admin'], prevent: ['ASR/allowlisting', 'EDR ancestry rules', 'Reduce local admin'], caseStudy: 'mshta launching encoded content from Outlook led to a LOLBin detection pack.', futureScenario: 'New living-off-the-land binaries will appear; ancestry stays key.' },
    62: { why: 'PowerShell is administrative superpower and attacker camouflage.', concepts: ['ScriptBlock logging', 'Constrained language', 'Encoded command tradecraft'], prevent: ['Centralize PS logs', 'AMSI + EDR', 'Just Enough Admin'], caseStudy: 'ScriptBlock logs revealed a download cradle EDR partially blocked — hunt finished the job.', futureScenario: 'Cross-platform scripting will broaden the same lessons.' },
    65: { why: 'Phishing kits industrialize brand theft and MFA relay.', concepts: ['AiTM kits', 'Visual trust failure', 'Takedown + passkeys'], prevent: ['Phishing-resistant MFA', 'Rapid reporting', 'Brand monitoring'], caseStudy: 'A bank-lookalike kit stole OTP sessions until passkeys rolled to VIP finance.', futureScenario: 'Kit quality will keep rising; process and passkeys remain the brake.' },
    68: { why: 'Internet scanners show your accidental attack surface for free — to everyone.', concepts: ['Exposed RDP/NAS', 'Continuous ASM', 'Owner SLAs'], prevent: ['Remove exposure', 'ZTNA', 'Ticket every finding'], caseStudy: 'Shodan found a forgotten NAS; it was offline before weekend scanners piled on.', futureScenario: 'AI will summarize your exposed banners into exploit plans faster.' },
    74: { why: 'Memory forensics catches what disk never saw — if you capture in time.', concepts: ['Order of volatility', 'Fileless implants', 'EDR + RAM'], prevent: ['Live response kits', 'Avoid blind reboots', 'Retain EDR process telemetry'], caseStudy: 'A RAM image showed an injected thread disk scans missed — scope expanded correctly.', futureScenario: 'Memory encryption and ephemerality will make EDR telemetry even more critical.' },
    75: { why: 'YARA scales hunting when rules are tuned like production detections.', concepts: ['False positive management', 'Contextual matches', 'Malware classification aid'], prevent: ['Staging rules', 'Pair with behavior', 'Retire noisy signatures'], caseStudy: 'A loose packer rule was tightened with path context — hunter signal returned.', futureScenario: 'AI-assisted rule writing will need the same FP discipline.' },
    78: { why: 'Web shells turn a vulnerable site into durable remote control.', concepts: ['Odd ASPX/PHP POST patterns', 'Deploy integrity', 'Credential reuse after shells'], prevent: ['Patch apps', 'File integrity monitoring', 'Least privilege app pools'], caseStudy: 'A forgotten upload form hosted a shell for weeks — FIM and WAF rules closed the class.', futureScenario: 'Serverless functions will have shell analogues via poisoned automations.' },
    79: { why: 'Lateral movement tooling converts one phish into domain impact.', concepts: ['WMI/WinRM/PsExec patterns', 'Admin share abuse', 'Identity containment'], prevent: ['Segment', 'Monitor privileged remote exec', 'PAW'], caseStudy: 'PsExec-like hops from a phished PC hit FILE01 — segmentation and LAPS limited the rest.', futureScenario: 'Cloud lateral via roles will parallel on-prem hops.' },
    80: { why: 'Privilege escalation often walks through misconfiguration, not genius.', concepts: ['Writable service paths', 'Local admin removal', 'EDR on privesc'], prevent: ['Hardened baselines', 'Patch', 'Least privilege'], caseStudy: 'Unquoted service paths on a golden image were fixed once — hundreds of endpoints improved.', futureScenario: 'Container and cloud privesc will need the same hygiene mindset.' },
    81: { why: 'Persistence is how attackers survive your first cleanup.', concepts: ['Run keys and tasks', 'Cloud identity backdoors', 'Scope beyond one host'], prevent: ['Hunt persistence locations', 'Baseline systems', 'Rotate trust materials'], caseStudy: 'A scheduled task resurrected access after reimage of one PC — fleet hunt found siblings.', futureScenario: 'SaaS OAuth apps will be common stealth persistence.' },
    85: { why: 'Adversary emulation is a test harness for detections — not entertainment.', concepts: ['Map techniques to alerts', 'Measure MTTD', 'Retest after fixes'], prevent: ['Written plans and ROE', 'Owner per technique', 'Publish outcomes'], caseStudy: 'An emulation without mapped detections taught nothing; the rewrite funded three high-value alerts.', futureScenario: 'Continuous automated emulation will still need human prioritization.' },
    86: { why: 'Synthetic media attacks authority and urgency — process is the control.', concepts: ['Voice clone wires', 'Challenge phrases', 'Dual control'], prevent: ['Out-of-band verification', 'Train finance managers', 'Limit public voice samples where feasible'], caseStudy: 'A CFO clone call failed a challenge phrase — N$ transfer never left.', futureScenario: 'Real-time video deepfakes will make process discipline non-negotiable.' },
    88: { why: 'Cloud credential theft is identity breach at hyperscale.', concepts: ['Access key theft', 'CloudTrail hunting', 'OIDC over long-lived keys'], prevent: ['Rotate and eliminate static keys', 'Conditional access', 'Least privilege'], caseStudy: 'A leaked CI key mined crypto until Trail + revoke stopped it in 18 minutes.', futureScenario: 'Workload identity federation will be table stakes.' },
    90: { why: 'Poisoned toolchains make your build system the attacker’s distribution network.', concepts: ['Typosquat', 'CI secret theft', 'Provenance and pinning'], prevent: ['Allowlists', 'SCA', 'Least-privilege CI'], caseStudy: 'A typosquat stole a publish token — packages were yanked and CI rebuilt with pins.', futureScenario: 'AI will mass-produce convincing malicious packages; provenance becomes mandatory.' }
};

const TIER_B_ESSAYS = {
    2: [
  {
    question: 'A SOC analyst in Windhoek detonates a suspicious document in a sandbox with no network callouts, and it marks "clean." Forty-eight hours later, users report encrypted files on a shared drive. Write a SOC handling guide covering containment, evidence preservation, analysis path, and user coaching.',
    guidelines: 'Write operationally and avoid generic awareness slogans. Address why a clean sandbox run can precede later impact, what volatile and host evidence to preserve before rebooting, how to scope lateral/share spread, and how users should report suspicious files.',
    rubric: [
      { criterion: 'Explains sandbox blind spots and delayed triggers', points: 2, evidence_required: 'Addresses delayed execution, environmental checks, or multi-stage delivery not observed during initial detonation' },
      { criterion: 'Defines containment and volatile evidence preservation', points: 2, evidence_required: 'Isolates affected hosts and preserves memory, running processes, and network state before rebooting' },
      { criterion: 'Establishes a safe analysis and scoping path', points: 2, evidence_required: 'Uses an isolated VM/sandbox without running samples on production endpoints and scopes shared drive impact' },
      { criterion: 'Provides concrete user reporting and coaching', points: 2, evidence_required: 'Instructs users to stop activity, avoid local cleanup/reboots, and report exact timestamps and file names' },
      { criterion: 'Maintains operational clarity without generic fluff', points: 2, evidence_required: 'Actionable runbook steps with clear sequencing rather than vague security slogans' }
    ]
  },
  {
    question: 'Finance staff in Walvis Bay forward a suspicious macro-enabled spreadsheet (.xlsm) that prompts users to enable content. Draft a first-response procedure for handling the sample safely and scoping potential exposure.',
    guidelines: 'Emphasize safe sample handling (quarantine, offline metadata/IOC extraction, isolated analysis) over running macros on live endpoints, and check whether any user already enabled macros or spawned child processes.',
    rubric: [
      { criterion: 'Enforces safe sample handling', points: 2, evidence_required: 'Quarantines the attachment and extracts metadata/IOCs before any controlled detonation in isolation' },
      { criterion: 'Checks for prior macro execution', points: 2, evidence_required: 'Verifies whether recipients opened the file, enabled content, or spawned script/shell processes' },
      { criterion: 'Extracts actionable indicators', points: 2, evidence_required: 'Captures file hashes, embedded URLs/domains, macro strings, and sender/header details' },
      { criterion: 'Avoids unsafe testing on live systems', points: 2, evidence_required: 'Explicitly prohibits opening or testing suspicious macros on finance or analyst production workstations' },
      { criterion: 'Documents clear escalation and handoff', points: 2, evidence_required: 'Defines when to escalate to incident response and what artifacts accompany the ticket' }
    ]
  },
  {
    question: 'A threat intelligence feed flags a file hash as a known dropper, and endpoint telemetry shows the file sitting in a user downloads folder in Frankfurt without a confirmed execution event. Write your investigation and containment steps.',
    guidelines: 'Do not assume non-execution without checking dropped payloads, persistence entries, or earlier execution logs. Address host isolation, artifact preservation, and hunting across other endpoints.',
    rubric: [
      { criterion: 'Questions unverified non-execution assumptions', points: 2, evidence_required: 'Checks process creation, script/service logs, and dropped files rather than relying solely on no obvious launch' },
      { criterion: 'Isolates and preserves the host artifact', points: 2, evidence_required: 'Isolates the workstation and preserves the binary, metadata, and surrounding directory artifacts' },
      { criterion: 'Hunts for dropped second-stage payloads', points: 2, evidence_required: 'Searches common drop paths, scheduled tasks, run keys, and services for follow-on components' },
      { criterion: 'Scans fleet-wide for related indicators', points: 2, evidence_required: 'Checks other endpoints for the hash, related domains/IPs, or similar download patterns' },
      { criterion: 'Applies proportional containment before clearing', points: 2, evidence_required: 'Verifies host cleanliness before returning the workstation to normal service' }
    ]
  },
  {
    question: 'An analyst in Singapore needs to examine a suspicious Windows executable without access to a commercial detonation platform. Write a safe local lab setup and analysis checklist.',
    guidelines: 'Focus on isolation controls (clean VM, disabled or controlled network, pre-execution snapshot), evidence capture, and avoiding production or personal host exposure.',
    rubric: [
      { criterion: 'Specifies strong environment isolation', points: 2, evidence_required: 'Uses a clean virtual machine with network disabled or tightly controlled and a pre-run snapshot' },
      { criterion: 'Prohibits unsafe host environments', points: 2, evidence_required: 'Rules out running untrusted binaries on analyst workstations or production/shared VMs' },
      { criterion: 'Captures baseline and post-run state', points: 2, evidence_required: 'Records hashes, process trees, file/registry/network changes, and reverts snapshots cleanly' },
      { criterion: 'Protects indicator and sample integrity', points: 2, evidence_required: 'Handles samples safely in restricted archives and avoids leaking internal host names or credentials' },
      { criterion: 'Summarizes findings clearly for triage', points: 2, evidence_required: 'Produces clear observations, IOCs, and recommended next steps for responders' }
    ]
  },
  {
    question: 'After confirming malware activity on a workstation in London, the user asks to reboot the machine immediately so they can finish urgent work. Write your response explaining the forensic and operational risks and the steps you will take instead.',
    guidelines: 'Explain why rebooting loses volatile memory evidence while persistence mechanisms can survive restarts, and outline isolation, volatile capture, scoping, and safe recovery.',
    rubric: [
      { criterion: 'Explains volatile memory loss on reboot', points: 2, evidence_required: 'Notes that restarting clears running processes, network connections, and in-memory artifacts' },
      { criterion: 'Addresses surviving persistence', points: 2, evidence_required: 'Explains that scheduled tasks, services, or autoruns can persist across reboots' },
      { criterion: 'Defines immediate containment and capture steps', points: 2, evidence_required: 'Isolates the endpoint and collects key volatile/host artifacts before remediation or rebuild' },
      { criterion: 'Scopes credential and lateral exposure', points: 2, evidence_required: 'Checks active sessions, account usage, and nearby hosts for signs of spread' },
      { criterion: 'Communicates constructively with the user', points: 2, evidence_required: 'Explains the risk plainly without lecturing and sets expectations for restoration' }
    ]
  }
],
    4: [essay('Draft a 30/60/90 cloud hardening plan after a public bucket + leaked access key incident.', 'Include identity, exposure, CI secrets, and owners.')],
    12: [
  {
    question: 'You are the newly appointed privacy officer at a 15-person Namibian marketing agency. The agency runs campaigns for clients in Namibia, South Africa, and the EU. During your first week you discover that the agency has been collecting email addresses from client websites "for future campaigns" without a privacy notice, without a documented lawful basis, and without any retention policy. The CEO asks you to write a one-page memo outlining what must change in the next 30 days to avoid regulatory exposure. Write the memo.',
    guidelines: 'Focus on the highest-risk gaps first. Name the specific POPIA sections and GDPR articles that are being violated, and give concrete actions with named owners and 30-day deadlines. Do not write generic privacy slogans.',
    rubric: [
      { criterion: 'Identifies the missing lawful basis for email collection', points: 2, evidence_required: 'Names POPIA s.11 or GDPR Art 6 and specifies which basis is absent for the current practice' },
      { criterion: 'Identifies the missing privacy notice', points: 2, evidence_required: 'Names POPIA s.18 or GDPR Art 13/14 and describes what a compliant notice must contain for this agency' },
      { criterion: 'Identifies the missing retention policy', points: 2, evidence_required: 'Names POPIA s.14 or GDPR Art 5(1)(e) and proposes a retention period per data category' },
      { criterion: 'Prioritises actions with deadlines and owners', points: 2, evidence_required: 'At least three concrete actions, each with a named owner and a 30-day deadline' },
      { criterion: 'Avoids generic advice without legal citation', points: 2, evidence_required: 'Every recommendation cites a specific law, article, or section; no "best practice" claims without a legal anchor' }
    ]
  },
  {
    question: 'A customer in Nairobi has emailed your Windhoek-based online store asking for a copy of all personal data held about them, the purpose of each processing activity, and the identity of every third party who has received their data. Your store uses a Lagos payment processor, a Kenyan cloud host, and a German email marketing platform. The customer has given you 30 days. Write the response plan: what you will provide, what you may withhold and why, and how you will handle the third-party disclosure requirement.',
    guidelines: 'This is a data subject access request under GDPR Art 15 (the customer is in Kenya but your store serves EU customers, so GDPR applies). Show how you will meet the one-month deadline and what exemptions apply. Be specific about each processor.',
    rubric: [
      { criterion: 'Correctly identifies the one-month response deadline and the extension mechanism', points: 2, evidence_required: 'Names GDPR Art 12(3) and the two-month extension for complex requests, with a reason that would justify it' },
      { criterion: 'Lists the specific information the response must include', points: 2, evidence_required: 'Covers purposes, categories, recipients, retention, source, and rights — the Art 15(1) list' },
      { criterion: 'Identifies the third-party recipient disclosure requirement correctly', points: 2, evidence_required: 'Names all three processors (payment, cloud, email) and explains whether each counts as a "recipient" under Art 15(1)(c)' },
      { criterion: 'Correctly distinguishes what may be withheld', points: 2, evidence_required: 'Cites at least one Art 15(4) or Art 12(5) exemption with a real basis — not "confidentiality" as a blanket refusal' },
      { criterion: 'Provides a realistic operational plan with owners and steps', points: 2, evidence_required: 'At least four steps with the team or role responsible, and a stated completion date within the 30-day window' }
    ]
  },
  {
    question: 'Your Windhoek software company wants to move its customer support ticketing system to a cloud provider headquartered in the United States. The ticketing system holds customer names, email addresses, support conversation histories, and occasionally screenshots that contain national ID numbers. Your customers are in Namibia, South Africa, Kenya, and the EU. Write a one-page risk assessment for the board that identifies the transfer mechanism you will rely on, the risks the board should accept, and the compensating controls you will put in place.',
    guidelines: 'This is a cross-border transfer under GDPR Chapter V and POPIA s.72. The US provider is not covered by an adequacy decision. Identify the specific transfer mechanism and the practical safeguards. The board wants a decision, not a legal treatise.',
    rubric: [
      { criterion: 'Identifies the correct transfer mechanism under GDPR Chapter V', points: 2, evidence_required: 'Names Standard Contractual Clauses (2021/914) or an equivalent Art 46 mechanism; does not claim adequacy for the US' },
      { criterion: 'Addresses the Schrems II supplementary measures requirement', points: 2, evidence_required: 'Names at least two supplementary measures (e.g., encryption with keys held in the EEA, pseudonymisation, split processing) and explains why they are necessary' },
      { criterion: 'Addresses POPIA s.72 cross-border transfer requirements', points: 2, evidence_required: 'Explains how the transfer satisfies POPIA s.72 (adequate protection, data subject consent, or contractual necessity) and does not rely on GDPR compliance alone' },
      { criterion: 'Identifies the national ID screenshot risk specifically', points: 2, evidence_required: 'Flags national ID data as sensitive/high-risk and proposes a specific mitigation (redaction at upload, separate storage, or exclusion from the cloud system)' },
      { criterion: 'Provides a defensible board-level decision with residual risk stated', points: 2, evidence_required: 'States a clear recommendation with the residual risk that remains after controls, not a "we will be compliant" conclusion' }
    ]
  },
  {
    question: 'Your retail chain operates stores in Windhoek, Rundu, and Oshakati. The company keeps customer purchase history, loyalty programme data, and CCTV footage for 10 years "for analytics." The board has asked you to design a retention policy that meets POPIA. Write the policy: for each data category, state the retention period, the legal or business justification, the disposal method, and the person responsible. Do not write a general statement about "retaining data only as long as necessary" — the board needs specific periods and reasons.',
    guidelines: 'POPIA s.14 requires that personal information not be retained longer than necessary for the purpose for which it was collected. Each category needs a defensible period tied to a specific purpose or legal obligation, not a round number.',
    rubric: [
      { criterion: 'Separates data categories and treats each one differently', points: 2, evidence_required: 'At least three distinct categories (purchase history, loyalty data, CCTV) each with its own retention period and justification' },
      { criterion: 'Justifies each retention period with a specific legal or business reason', points: 2, evidence_required: 'Every period is tied to a named obligation (e.g., tax retention under Namibian Income Tax Act, POPIA s.14, CCTV security purpose) — not "industry standard"' },
      { criterion: 'Addresses the CCTV footage specifically', points: 2, evidence_required: 'CCTV has a shorter retention period than purchase history, with a reason tied to the security purpose — 10 years for CCTV is indefensible' },
      { criterion: 'Specifies a disposal method and responsible person per category', points: 2, evidence_required: 'Each category names the disposal method (secure deletion, shredding, anonymisation) and the role responsible for execution' },
      { criterion: 'Provides a review mechanism and change control', points: 2, evidence_required: 'States how often the policy is reviewed, who approves changes, and how exceptions are documented' }
    ]
  },
  {
    question: 'Your Namibian SME has customers in Namibia and Germany. The board wants a single privacy notice that works for both jurisdictions, because maintaining two notices is operationally expensive. Write a one-page memo to the board explaining whether a single notice is possible, what it would need to contain to satisfy both POPIA and GDPR, and where the two regimes require different or additional content. End with a clear recommendation.',
    guidelines: 'The two regimes overlap significantly but are not identical. The memo should identify where a single high-standard notice is sufficient, where local addenda are needed, and why the board should care about the differences.',
    rubric: [
      { criterion: 'Correctly states whether a single notice can satisfy both regimes', points: 2, evidence_required: 'States clearly that a single high-standard notice with Namibia-specific addenda is workable, or explains why not, with reasoning' },
      { criterion: 'Names the core content requirements shared by both regimes', points: 2, evidence_required: 'Covers identity of controller, purposes, lawful basis, recipients, retention, and rights — the common core' },
      { criterion: 'Names the GDPR-specific requirements', points: 2, evidence_required: 'Cites at least two GDPR-specific items (e.g., Art 13(2)(e) transfers, Art 13(2)(d) legitimate interest detail, Art 22 automated decisions) that POPIA does not require in the same form' },
      { criterion: 'Names the POPIA-specific requirements', points: 2, evidence_required: 'Cites at least two POPIA-specific items (e.g., Information Regulator contact, s.18(1)(f) cross-border transfer notice, POPIA complaint procedure) that GDPR does not require in the same form' },
      { criterion: 'Provides a defensible recommendation with implementation cost awareness', points: 2, evidence_required: 'Recommends single notice with addenda or two notices, and states the operational cost of the chosen path (translation, maintenance, update cycle)' }
    ]
  }
],
    15: [essay('Design a DevSecOps exception process for shipping with a critical CVE.', 'Owner, expiry, compensating controls, retest.')],
    16: [essay('Create a live-response order-of-operations for ransomware still encrypting a file server.', 'Containment vs volatile evidence; chain of custody.')],
    19: [essay('Propose removing standing Domain Admin for helpdesk with JIT/PAM without breaking operations.', 'PAW, roles, emergency break-glass.')],
    23: [essay('Write an AppSec fix brief for BOLA on an invoices API, including regression tests.', 'Server-side AuthZ; token scope.')],
    25: [essay('Board brief: stolen cluster-admin token — impact, containment, 90-day Kubernetes identity program.', 'RBAC, audit, private control plane.')],
    27: [essay('Policy for an internal LLM that can call HR and payment tools.', 'Allowlists, human approval, logging, prompt-injection assumptions.')],
    30: [essay('Tabletop inject: IT ransomware approaches flat OT. Decision criteria for safety vs investigation.', 'Segmentation, change control, no reckless patching.')],
    34: [essay('Insider investigation playbook when CRM bulk download precedes resignation.', 'Lawful process, DLP evidence, HR partnership.')],
    36: [essay('Honest BCP memo: backups green, restores untested, backup VLAN flat with production.', 'Immutable copies, drill schedule, RTO/RPO truth.')],
    39: [essay('Triage policy for 10k+ scanner findings in an SME with one sysadmin.', 'Exposure × criticality; SLAs; exceptions.')],
    41: [essay('After-action template for red/blue exercises that leadership will fund.', 'MTTD/MTTR, ATT&CK, retest dates.')],
    45: [essay('Train new hires: why unauthorized scanning and hack-back are unacceptable.', 'Law, ROE, authorized labs.')],
    49: [essay('Translate a Burp IDOR + XSS finding pair into a sprint backlog for developers.', 'Risk language + concrete fixes.')],
    59: [essay('Remediation plan after purple-team Kerberoasting of a privileged SPN.', 'gMSA, SPN audit, detection for unusual TGS.')],
    61: [essay('Detection engineering brief for LOLBin chains launching from Office.', 'Ancestry rules, ASR, admin allowlists.')],
    65: [essay('Executive brief on AiTM phishing kits vs OTP MFA — what to buy and what to train.', 'Passkeys, reporting, dual control.')],
    78: [essay('IR runbook for suspected webshell on a public IIS site.', 'Isolate, preserve, hunt, credential rotate, deploy integrity.')],
    86: [essay('Finance dual-control procedure that survives deepfake voice and video.', 'Challenge phrases, known-number callbacks.')],
    88: [essay('Cloud IR checklist for stolen access keys used from a foreign ASN.', 'Revoke, Trail, SCP, hunt, eliminate static keys.')],
    90: [essay('Supply-chain incident memo after a typosquat steals CI secrets.', 'Rotate, audit artifacts, pin/allowlist, least-privilege CI.')]
,

  3: [
  {
    question: 'You are the security lead at a 200-person Namibian bank. The network is a flat VLAN spanning workstations, application servers, and databases. The CISO asks for a one-page segmentation plan: what zones you will create, what the first-phase allow rules will be, how you handle the 14 legacy applications that were not designed for segmentation, and how you will measure success in 90 days.',
    guidelines: 'This is a segmentation design exercise. The plan must name functional zones (not physical topology), specify the allow rules between zones, address the legacy application dependency problem, and define a measurable success criterion. "We will segment the network" is not a plan.',
    rubric: [
      { criterion: 'Defines zones by function', points: 2, evidence_required: 'At least three functional zones (workstations, application, database, management) with the reasoning for each, not physical topology' },
      { criterion: 'Specifies explicit allow rules with default deny', points: 2, evidence_required: 'The plan states default-deny between zones and names at least three specific allow rules with source, destination, port, and business justification' },
      { criterion: 'Addresses the 14 legacy applications specifically', points: 2, evidence_required: 'Names the approach for legacy apps (monitor-only phase, compensating controls, per-app exemptions with review dates) rather than treating them as a single problem' },
      { criterion: 'Provides a 90-day measurement', points: 2, evidence_required: 'States the specific metric for success (e.g., "east-west flows between zones reduced from 340 to under 50", "zero critical apps still on the flat VLAN")' },
      { criterion: 'Names the rollback plan', points: 2, evidence_required: 'States how a zone change is reverted if it breaks a business process, and who has authority to trigger the rollback' }
    ]
  },
  {
    question: 'A Johannesburg insurer has a firewall with 340 rules. 60 allow any-to-any on ports 135 and 445. The network team says the rules are "needed for legacy file access." Write the remediation memo to the CISO: what you will remove, what you will keep and why, how you will verify no business process depends on the removed rules, and what the timeline is.',
    guidelines: 'This is a firewall rule hygiene exercise. The memo must distinguish between rules that are genuinely needed and rules that are legacy accumulation. The verification step is the part that makes removal safe.',
    rubric: [
      { criterion: 'Identifies the specific rules to remove', points: 2, evidence_required: 'States that the 60 any-to-any rules on 135/445 are the removal target, and names what replaces them (scoped allow rules per source-destination pair)' },
      { criterion: 'Identifies what to keep and why', points: 2, evidence_required: 'Names the specific rules that must be kept (business-critical allow rules) and the justification for each' },
      { criterion: 'Provides a verification method', points: 2, evidence_required: 'States that firewall logs are analysed for the traffic the rules are currently permitting, and the results are checked with the app owners before removal' },
      { criterion: 'Provides a timeline with owners', points: 2, evidence_required: 'At least three phases (analysis, scoped replacement, removal) with named owners and dates' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what remains after the change (e.g., "some legacy apps may still need 445 to specific servers, which are now scoped but not eliminated")' }
    ]
  },
  {
    question: 'A Namibian government agency has 40 staff on VPN. The VPN concentrator is exposed directly to the internet and uses password-only authentication. The CISO wants a 90-day remediation plan. Write the plan: what you fix first, what compensating controls you add, and how you measure the reduction in exposure by day 90.',
    guidelines: 'This is a VPN security exercise. The plan must show a phased approach: immediate exposure reduction, then structural fix. The measurement must be verifiable.',
    rubric: [
      { criterion: 'Prioritises the internet exposure reduction first', points: 2, evidence_required: 'States that the concentrator is moved behind a reverse proxy or management interface is hidden within 14 days, before any other change' },
      { criterion: 'Adds MFA within 30 days', points: 2, evidence_required: 'States that phishing-resistant MFA is enforced on all VPN access within 30 days' },
      { criterion: 'Provides compensating controls', points: 2, evidence_required: 'At least two specific compensating controls (device posture, session timeout, geo-restriction) with the specific risk each addresses' },
      { criterion: 'Provides a measurable day-90 outcome', points: 2, evidence_required: 'States the specific metric (e.g., "zero password-only logins", "zero direct internet exposure on the management interface")' },
      { criterion: 'Names the structural fix beyond 90 days', points: 2, evidence_required: 'States the longer-term direction (ZTNA replacement, VPN concentrator retirement) and why it is not in the 90-day scope' }
    ]
  },
  {
    question: 'A SOC analyst sees SMB traffic from a user workstation to 12 servers over 30 minutes. The user says they ran a "network file search." Write the triage decision: what you check, how you verify the explanation, what would confirm malicious intent, and what you do if the explanation is plausible but unverified.',
    guidelines: 'This is an SMB lateral movement triage exercise. The analyst must decide between accepting, investigating further, or containing. The verification step is the part that distinguishes competent triage from guessing.',
    rubric: [
      { criterion: 'Names the specific checks', points: 2, evidence_required: 'At least three checks (server-side auth logs, file access logs, source workstation process tree, comparison to baseline SMB traffic) with the specific evidence each produces' },
      { criterion: 'Verifies the user explanation', points: 2, evidence_required: 'States how the analyst verifies the "network file search" claim against actual file access records or tool inventory' },
      { criterion: 'Names the confirm-malicious indicators', points: 2, evidence_required: 'Names at least two specific indicators that would confirm malicious intent (unusual file access pattern, access to admin shares, connections to servers outside the user role)' },
      { criterion: 'Names the confirm-benign indicators', points: 2, evidence_required: 'Names at least two specific indicators that would confirm the legitimate explanation (matching file access, known tool on the workstation, pattern matches baseline)' },
      { criterion: 'Provides the disposition when unverified', points: 2, evidence_required: 'States what the analyst does if the explanation is plausible but unverified (monitor the workstation, alert on further SMB, request specific tool information from the user)' }
    ]
  },
  {
    question: 'You are the CISO at a Windhoek SME. The board asks: "If we spend N$500,000 on network security this year, what changes?" Write the answer: three specific outcomes, three specific investments, one residual risk that the spend will not eliminate, and how the board will measure whether the spend worked.',
    guidelines: 'This is a board-level investment case for network security. The outcomes must be verifiable, the investments costed, and the residual risk named. "We will be more secure" is not an outcome; "east-west SMB traffic reduced from 340 daily flows to under 50" is.',
    rubric: [
      { criterion: 'Provides three verifiable outcomes', points: 2, evidence_required: 'Three measurable outcomes (e.g., "east-west SMB traffic under 50 daily flows", "no password-only VPN logins", "all critical server zones segmented")' },
      { criterion: 'Provides three costed investments', points: 2, evidence_required: 'Each investment has a specific N$ amount within the N$500,000 total and what it buys' },
      { criterion: 'Names the residual risk honestly', points: 2, evidence_required: 'States what the spend will not eliminate (e.g., "a determined attacker with valid credentials can still move laterally within a zone")' },
      { criterion: 'Provides a board-level measurement cadence', points: 2, evidence_required: 'States what the board sees quarterly (metrics, incidents, gaps) and who reports it' },
      { criterion: 'Provides a trade-off the board must accept', points: 2, evidence_required: 'States one operational impact (e.g., "users will need MFA on VPN, adding 30 seconds per login", "segmentation will require application changes for two legacy systems") rather than claiming zero friction' }
    ]
  }

  ]
};

function getTierBEssays(moduleId) {
    return TIER_B_ESSAYS[moduleId] || null;
}
const MODULE_ROTATION_MIN = 12;
const MODULE_ROTATION_MIN_BUCKETS = 3;

module.exports = {
    TIER_B_QUESTIONS,
    TIER_B_EXTRAS,
    TIER_B_ESSAYS,
    getTierBEssays,
    MODULE_ROTATION_MIN,
    MODULE_ROTATION_MIN_BUCKETS,
};