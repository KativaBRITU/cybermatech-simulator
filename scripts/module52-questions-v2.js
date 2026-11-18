[
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
]
