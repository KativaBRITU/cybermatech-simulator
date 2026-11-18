[
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
]
