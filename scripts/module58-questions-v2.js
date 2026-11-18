[
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
]
