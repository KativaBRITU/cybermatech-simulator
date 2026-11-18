[
  q(
    'A Domain Administrator logs into a helpdesk PC to fix a printer, then logs off. Six hours later, a SOC analyst sees the DA account authenticating to three servers from that same PC. What is the most defensible interpretation?',
    [
      'Pass-the-hash: the DA hash was extracted from the helpdesk PC memory and is being reused from a different session',
      'The DA account is scheduled for backup verification, which routinely authenticates to multiple servers from a helpdesk PC',
      'The DA account is being used for a legitimate admin task, so the analyst should check with the DA owner first before escalating',
      'The DA account password has been cracked offline and the attacker is using the cleartext password from the helpdesk PC'
    ],
    0,
    'The tell is the combination: DA logged into a user PC, logged off, and the DA account is now authenticating from that PC to other servers. That is the pass-the-hash pattern. The hash was extracted from the helpdesk PC memory (because DA credentials were exposed to that PC), and the attacker is reusing it. The fix is not "check with the DA owner" — the fix is containing the PC and resetting the DA credentials plus krbtgt.',
    'pth_techniques',
    45,
    {
      distractor_rationale: [
        'CORRECT - DA session on a user PC plus subsequent authentications from that PC is the pass-the-hash signature.',
        'WRONG - backup verification does not authenticate to three servers from the helpdesk PC after a DA logon.',
        'WRONG - checking with the DA owner is reasonable but should not delay containment; the pattern is a compromise indicator.',
        'WRONG - pass-the-hash uses the hash, not the password; password cracking is a different attack with a different response.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'pth_techniques',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Windhoek-based bank has 40% of workstations on Windows 10 (no Credential Guard) and 60% on Windows 11. The CISO asks for a phased pass-the-hash plan. What is the most defensible approach?',
    [
      'Deploy Credential Guard on the 60% that support it, enforce admin tiering so DA credentials never touch user workstations, and add LSASS access detection on the 40% that cannot run Credential Guard',
      'Deploy Credential Guard on all 100% of workstations by upgrading the Windows 10 machines to Enterprise first',
      'Implement a longer DA password (20+ characters) with 30-day rotation so the extracted hash is not crackable',
      'Disable NTLM authentication across the entire domain immediately to eliminate the pass-the-hash vector'
    ],
    0,
    'Credential Guard where supported, plus admin tiering on every system, plus LSASS detection on the systems that cannot run Credential Guard. Tiering is the highest-leverage control because it removes the DA credentials from the workstations entirely. A longer password does not help (the hash is extracted from memory, not cracked). Disabling NTLM breaks applications.',
    'containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - tiering removes the exposure, Credential Guard protects where supported, LSASS detection covers the gap.',
        'WRONG - upgrading all Windows 10 to Enterprise is a budget cycle and does not need to block the plan.',
        'WRONG - longer passwords do not prevent pass-the-hash; the hash is used directly, not cracked.',
        'WRONG - disabling NTLM across the domain immediately will break applications that depend on it.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC analyst sees a Kerberos service ticket (TGS) issued to a service account with a weak password and a non-standard SPN. The request came from a workstation with no relationship to the service. What is the most defensible interpretation?',
    [
      'Kerberoasting: the attacker is requesting a service ticket for the weak service account to extract the hash and crack it offline',
      'Legitimate: the workstation needs to access the service and the SPN is standard',
      'Benign: TGS requests are normal traffic and the alert is a false positive',
      'Low priority: service accounts often request tickets to other services'
    ],
    0,
    'Kerberoasting is the technique: an attacker with any domain user credentials requests TGS tickets for service accounts with SPNs, then cracks the ticket hash offline. The tell is a workstation that does not normally access the service requesting a ticket for a weak service account. The correct response is to identify the requesting user and the service account, reset the service account password to a 30+ character random value in a gMSA, and hunt for the source.',
    'ptt_techniques',
    45,
    {
      distractor_rationale: [
        'CORRECT - the combination of non-standard SPN request from an unrelated workstation for a weak service account is the Kerberoasting signature.',
        'WRONG - the SPN is non-standard and the workstation has no relationship to the service.',
        'WRONG - not all TGS requests are benign; the specific pattern here is an attack indicator.',
        'WRONG - service accounts do not typically request tickets for themselves; the pattern is a request FROM a user FOR a service account.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1558.003',
      rotation_bucket: 'ptt_techniques',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Namibian SME has a small IT team and no EDR. The team wants to detect pass-the-hash using only Windows Event Logs and firewall logs. What is the most defensible detection approach?',
    [
      'Alert on Event ID 4624 with Logon Type 3 and NTLM authentication from an IP that does not normally authenticate to the target, correlated with Event ID 4672 (special privileges assigned) on the target',
      'Alert on any NTLM authentication — NTLM is always suspicious and should be eliminated from the environment',
      'Alert on the presence of any service account activity — service accounts are the primary pass-the-hash target',
      'Alert on Event ID 4624 with Logon Type 2 (interactive) — pass-the-hash always uses interactive logon'
    ],
    0,
    'Pass-the-hash shows up as a Logon Type 3 (network) with NTLM authentication, usually from an IP that does not normally authenticate to the target, and often followed by 4672 (special privileges). This combination is the high-signal detection without EDR. Alerting on all NTLM is too broad. Service account activity is normal. Pass-the-hash uses network logon (Type 3), not interactive (Type 2).',
    'detection',
    45,
    {
      distractor_rationale: [
        'CORRECT - Type 3 + NTLM + unusual source IP + 4672 is the pass-the-hash detection pattern with Event Logs only.',
        'WRONG - NTLM is still required for many legacy applications; alerting on all NTLM generates too much noise.',
        'WRONG - service account activity is normal; the anomaly is the pattern of authentication, not the account type.',
        'WRONG - pass-the-hash uses network logon (Type 3), not interactive (Type 2).'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'detection',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A bank detects a possible golden ticket attack: a user account authenticating with a Kerberos ticket that has a very long lifetime and a domain admin SID. What is the most defensible response?',
    [
      'Reset the krbtgt account password twice, revoke all domain sessions, and hunt for the source of the forged tickets',
      'Reset the user account password — the user is the compromised account',
      'Wait for the ticket to expire naturally — the attack window closes on its own',
      'Block the user account from the network — this contains the attack'
    ],
    0,
    'A golden ticket is a forged Kerberos ticket created with the krbtgt hash, with an arbitrary lifetime and any SID. The only mitigation is to reset the krbtgt account password twice (to invalidate current and previous krbtgt hashes), revoke all sessions (to invalidate existing tickets), and hunt for the source. Resetting the user account does not help (the ticket is forged, not issued). Waiting for expiry gives the attacker a long window. Blocking the user account is cosmetic.',
    'containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - krbtgt reset twice, session revocation, and hunting for the source is the only defense against golden tickets.',
        'WRONG - the ticket is forged, not issued to the user; resetting the user password does not invalidate it.',
        'WRONG - golden tickets can have a 10-year lifetime; waiting for expiry is not a response.',
        'WRONG - blocking the user account does not invalidate the ticket, which can be used for any account.'
      ],
      cognitive_level: 5,
      difficulty: 5,
      coverage_tag: 'T1558.001',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC analyst sees a host authenticating to multiple servers in a pattern that matches a pass-the-hash attack from an earlier alert on the same network. The host has no EDR. What is the most defensible action?',
    [
      'Isolate the host, preserve the Windows Event Logs, and investigate the authentication chain across the servers',
      'Wait for the next pass-the-hash alert — the pattern is not confirmed yet',
      'Reboot the host to clear the credential cache',
      'Reset the host computer account password — this invalidates the cached credentials'
    ],
    0,
    'The pattern matching an earlier pass-the-hash alert is the correlation signal. Isolation preserves the evidence (Windows Event Logs) and removes the immediate threat. Rebooting destroys the evidence. Waiting for a next alert gives the attacker time. Resetting the computer account password does not invalidate user hash material.',
    'detection',
    45,
    {
      distractor_rationale: [
        'CORRECT - isolation preserves evidence and removes the threat; investigate the authentication chain across servers.',
        'WRONG - waiting for the next alert gives the attacker time to complete lateral movement.',
        'WRONG - rebooting destroys the Windows Event Logs that prove the attack.',
        'WRONG - the computer account password is not the compromised credential; the user hash is.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'detection',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Windhoek company discovers a service account with an SPN and a password unchanged for 5 years. What is the most defensible response?',
    [
      'Migrate the service account to a Group Managed Service Account with automatic 240-character password rotation, remove the SPN if not required, and audit who can request service tickets for this account',
      'Reset the password to a 14-character complex value and schedule a 90-day rotation',
      'Disable the service account — the account is clearly compromised',
      'Leave it as-is — service accounts are not targeted by attackers'
    ],
    0,
    'The gMSA migration is the structural fix: 240-character automatic rotation removes crackability; SPN removal reduces the target surface; auditing ticket requesters closes the discovery step. A 14-character password is still crackable offline. Disabling the account breaks the service. Leaving it as-is ignores the risk.',
    'pth_techniques',
    45,
    {
      distractor_rationale: [
        'CORRECT - gMSA migration is the structural fix for service account password exposure.',
        'WRONG - a 14-character password is crackable offline via Kerberoasting in hours-to-days.',
        'WRONG - the account is not necessarily compromised; the problem is the stale password, not an active attack.',
        'WRONG - service accounts are a primary target for Kerberoasting and other credential theft attacks.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1558.003',
      rotation_bucket: 'pth_techniques',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC analyst is asked whether a single NTLM authentication from a Linux server to a Windows file server is suspicious. What is the most defensible interpretation?',
    [
      'Suspicious only if correlated with other indicators — a single NTLM authentication is common in mixed environments, but the pattern is worth investigating if it is from an unexpected server, at an unexpected time, or with an unexpected account',
      'Always suspicious — Linux servers should never use NTLM',
      'Never suspicious — mixed environments require NTLM',
      'Close the alert — NTLM is a legacy protocol that is not used in modern environments'
    ],
    0,
    'Single NTLM authentication is not suspicious by itself. The signal is the context: unexpected source, unexpected account, unexpected time, or correlation with other events. Alerting on every NTLM authentication generates noise. Closing without context is careless. The defensible answer is correlation-based.',
    'detection',
    45,
    {
      distractor_rationale: [
        'CORRECT - single events need context; the pattern is the signal, not the protocol alone.',
        'WRONG - Linux servers can use NTLM (via Samba or similar) for mixed-environment access.',
        'WRONG - never suspicious is as wrong as always suspicious; the context matters.',
        'WRONG - NTLM is still widely used for legacy and mixed-environment access.'
      ],
      cognitive_level: 4,
      difficulty: 3,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'detection',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A bank wants to prevent pass-the-ticket attacks. Which control has the highest impact?',
    [
      'Enforce Protected Users security group for high-value accounts, restrict their authentication to hardened admin workstations, and monitor for Kerberos ticket anomalies',
      'Deploy a commercial anti-pass-the-ticket product — commercial tools detect all ticket-based attacks',
      'Require all users to change passwords every 30 days — this invalidates stolen tickets',
      'Block Kerberos authentication across the domain and use NTLM'
    ],
    0,
    'Protected Users disables NTLM, DES, and RC4 for members and limits credential caching. Restricting authentication to hardened workstations reduces exposure. Monitoring Kerberos anomalies catches the attacks that get through. Commercial tools are not a complete answer. Password reset does not invalidate Kerberos tickets (krbtgt reset does). Blocking Kerberos and using NTLM is a security downgrade.',
    'containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - Protected Users plus hardened workstations plus Kerberos anomaly monitoring is the highest-impact combination.',
        'WRONG - no commercial tool detects all pass-the-ticket variants; the detection depends on configuration and monitoring.',
        'WRONG - password reset does not invalidate Kerberos tickets; krbtgt reset is required.',
        'WRONG - blocking Kerberos and using NTLM is a security downgrade; NTLM is weaker and vulnerable to pass-the-hash.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.003',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A SOC analyst sees an alert for Kerberos authentication with RC4 encryption for a user account that normally uses AES. What is the most defensible interpretation?',
    [
      'The RC4 downgrade is a likely indicator of a Kerberoasting or ticket-forging attempt — the attacker is using RC4 because the hash is easier to crack or the forged ticket requires it',
      'The RC4 downgrade is benign — Windows falls back to RC4 for compatibility',
      'The RC4 downgrade is normal for users who log in from older workstations',
      'The RC4 downgrade is a false positive — the domain should be configured to disable RC4 alerts'
    ],
    0,
    'A user account that normally uses AES suddenly using RC4 is a specific Kerberos anomaly. Attackers use RC4 because it produces a hash that is easier to crack (for Kerberoasting) or because their forged ticket requires RC4. The anomaly is the change of encryption type for a specific account, not the use of RC4 itself.',
    'detection',
    45,
    {
      distractor_rationale: [
        'CORRECT - the change from AES to RC4 for a specific account is the anomaly; it is a known indicator of Kerberos attacks.',
        'WRONG - Windows does not fall back to RC4 for compatibility unless the client or service does not support AES; the specific change is the signal.',
        'WRONG - older workstations use AES if they are domain-joined and updated; RC4 fallback is not normal behaviour.',
        'WRONG - disabling RC4 alerts removes the detection for a known attack pattern.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1558',
      rotation_bucket: 'detection',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A Nairobi-based insurer wants to reduce pass-the-hash risk in a mixed environment with Windows 10, Windows 11, and Linux workstations. What is the most defensible plan?',
    [
      'Enforce tiered admin on all platforms, deploy Credential Guard on Windows 11, use LAPS on Windows 10, and implement Linux PAM restrictions plus Kerberos-only authentication for domain-joined Linux hosts',
      'Deploy Credential Guard on Windows and ignore Linux — Linux is not a pass-the-hash target',
      'Migrate all workstations to Windows 11 — the only way to prevent pass-the-hash',
      'Disable NTLM across all platforms — this eliminates the pass-the-hash vector entirely'
    ],
    0,
    'Tiering is the universal control. Credential Guard on Win11, LAPS on Win10, PAM restrictions plus Kerberos-only on Linux — each platform gets the specific controls it supports. Linux domain-joined hosts can be pass-the-hash targets if they cache credentials for Windows service access. Migrating all to Win11 is a budget decision, not a security one. Disabling NTLM breaks applications.',
    'containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - tiering is universal; each platform gets the specific controls it supports.',
        'WRONG - domain-joined Linux hosts can cache credentials and be pass-the-hash targets.',
        'WRONG - migrating all to Win11 is a multi-year project and does not need to block the plan.',
        'WRONG - disabling NTLM across all platforms will break legacy applications that depend on it.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  ),

  q(
    'A bank CISO asks: "If we reset every password and add MFA, are we protected from pass-the-hash and pass-the-ticket?" What is the most defensible answer?',
    [
      'No — password reset does not invalidate NTLM hashes cached in memory, nor does it invalidate Kerberos tickets. MFA protects the initial login but not the reuse of a stolen hash or ticket. Full protection requires tiering, Credential Guard, krbtgt reset, and NTLM restriction',
      'Yes — password reset removes the credentials and MFA prevents reuse',
      'Partially — MFA blocks pass-the-hash but not pass-the-ticket',
      'No, but resetting all passwords plus adding MFA is sufficient to prevent return'
    ],
    0,
    'Password reset does not invalidate cached NTLM hashes (the attacker uses the hash, not the password), and does not invalidate Kerberos tickets (krbtgt reset is required). MFA protects the initial login but not the reuse of a stolen hash or ticket. The full answer names the specific controls: tiering, Credential Guard, krbtgt reset, NTLM restriction.',
    'containment',
    45,
    {
      distractor_rationale: [
        'CORRECT - names what password reset and MFA do not address, and the specific controls that do.',
        'WRONG - password reset does not invalidate cached hashes or tickets; MFA does not protect against reuse.',
        'WRONG - MFA does not block pass-the-hash; the attacker is not logging in with a password.',
        'WRONG - MFA does not prevent a reused hash or ticket; the answer should name the specific controls that do.'
      ],
      cognitive_level: 5,
      difficulty: 4,
      coverage_tag: 'T1550.002',
      rotation_bucket: 'containment',
      last_validated: '2026-11-18'
    }
  )
]
