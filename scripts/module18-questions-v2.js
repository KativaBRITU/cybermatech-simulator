[
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
]
