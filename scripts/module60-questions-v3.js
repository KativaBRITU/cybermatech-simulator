[
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
]
