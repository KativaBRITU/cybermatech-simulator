[
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
]
