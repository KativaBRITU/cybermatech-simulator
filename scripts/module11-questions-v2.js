[
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
]
