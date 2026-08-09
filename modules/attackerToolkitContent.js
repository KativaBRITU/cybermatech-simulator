/**
 * Unique study extras, essays, and practice/quiz banks for modules 46–95.
 * Defensive / purple-team framing only — how adversaries move and talk.
 */

const { ATTACKER_TOOLKIT_MODULES } = require('./attackerToolkitModules');

/** Per-module specialist profiles (not copy-paste templates). */
const PROFILES = {
    46: {
        tool: 'Nmap',
        focus: 'host discovery, port/service enumeration, and NSE scripting footprints',
        artifacts: 'burst SYN/ACK scans, unusual ICMP, rapid sequential port probes, banner grabs in IDS',
        defenses: 'rate-limit scanning, network segmentation, honeypots, alert on aggressive discovery from non-scanner hosts',
        case: 'An unapproved laptop ran a full subnet SYN scan at 03:00. SOC treated it as reconnaissance preceding a ransomware affiliate landing.',
        future: 'AI-orchestrated scanners will throttle to look “human.” Hunt for intent (target lists + timing) not only packet rate.',
        techniques: ['T1046', 'T1595'],
        slang: 'ports, banners, top-1000, stealth scan'
    },
    47: {
        tool: 'Wireshark',
        focus: 'packet capture analysis for C2 beacons, cleartext secrets, and protocol anomalies',
        artifacts: 'PCAP with periodic beacons, TLS JA3 anomalies, DNS tunneling length patterns, SMB credential exposure',
        defenses: 'span/tap strategy, encrypted DNS monitoring, TLS inspection where lawful, retain PCAPs for IR windows',
        case: 'Analysts found HTTP POST beacons every 60s to a lookalike CDN after correlating Wireshark with EDR process trees.',
        future: 'Encrypted-everything reduces payload visibility — metadata, timing, and certificate hygiene become primary signals.',
        techniques: ['T1040', 'T1071'],
        slang: 'follow TCP stream, export objects, display filters'
    },
    48: {
        tool: 'Metasploit',
        focus: 'exploit modules, payloads, handlers, and post-exploitation automation signatures',
        artifacts: 'msfvenom-like payload patterns, meterpreter staging, default handler ports, staged vs stageless binaries',
        defenses: 'patch SLAs, EDR behavioral blocks on injection, disable unused services, purple-team msf labs offline only',
        case: 'A forgotten Tomcat manager led to a Metasploit module foothold; lateral movement began within 12 minutes.',
        future: 'Auto-exploit chains will pick modules from vuln scanners. Your edge is asset inventory + blast-radius containment.',
        techniques: ['T1190', 'T1055'],
        slang: 'handler, payload, session, post module'
    },
    49: {
        tool: 'Burp Suite',
        focus: 'intercepting proxies, repeater/intruder abuse of authZ and business logic',
        artifacts: 'parameter tampering, IDOR probes, JWT manipulation, mass assignment attempts in access logs',
        defenses: 'server-side authorization, WAF tuned for logic abuse, short-lived tokens, object-level access tests in CI',
        case: 'Repeater changed a user_id and exported another customer invoice — classic IDOR found during a web assessment.',
        future: 'AI will fuzz business workflows faster. Continuous API authZ tests beat one-off pen tests.',
        techniques: ['T1190', 'T1059'],
        slang: 'intercept, repeater, intruder, match/replace'
    },
    50: {
        tool: 'SQLMap',
        focus: 'automated SQL injection discovery, dumping, and DBMS fingerprinting',
        artifacts: 'boolean/time-based SQLi payloads, UNION selects, information_schema probes in WAF logs',
        defenses: 'parameterized queries, least-privilege DB accounts, WAF + query anomaly detection, disable verbose errors',
        case: 'SQLMap against a legacy search box dumped PII; root cause was string-concatenated SQL from 2014.',
        future: 'No-code apps will reintroduce injection. Secure defaults and ORM discipline still matter.',
        techniques: ['T1190', 'T1213'],
        slang: 'boolean blind, time-based, dump, tamper scripts'
    },
    51: {
        tool: 'Mimikatz',
        focus: 'LSASS credential dumping, ticket theft, and cleartext/password reuse artifacts',
        artifacts: 'lsass access, sekurlsa patterns, unusual debug privilege, dumped .dmp files',
        defenses: 'Credential Guard, LSA protection, reduce admin logons to workstations, detect lsass handle opens',
        case: 'Domain admin RDP’d to a user PC; Mimikatz harvested the hash and the blast radius became enterprise-wide.',
        future: 'Cloud tokens replace many hashes — same lesson: privileged sessions on dirty endpoints are lethal.',
        techniques: ['T1003', 'T1558'],
        slang: 'sekurlsa, tickets, PTH, golden ticket'
    },
    52: {
        tool: 'Cobalt Strike',
        focus: 'beacon tradecraft, malleable C2 profiles, and named-pipe / HTTP staging patterns',
        artifacts: 'sleep jitter beacons, spoofed User-Agents, process injection into explorer/svchost, SMB beacons',
        defenses: 'network detection for beacon cadence, EDR injection alerts, hunt cracked/leaked team servers',
        case: 'A cracked Cobalt Strike license beaconed over HTTPS mimicking jQuery CDN traffic until DNS sinkholing cut it.',
        future: 'Commercial and open C2 will keep mimicking browser traffic — behavior + identity beats URL blocklists.',
        techniques: ['T1071', 'T1055', 'T1021'],
        slang: 'beacon, malleable C2, sleep, spawn-to'
    },
    53: {
        tool: 'Empire / Sliver C2',
        focus: 'agent frameworks, listener configs, and multi-protocol callback habits',
        artifacts: 'PowerShell stagers, gRPC/HTTP2 callbacks, unusual service installs, long-lived agents',
        defenses: 'script block logging, constrain language mode, detect uncommon listeners, isolate build servers',
        case: 'Sliver agents used DoH callbacks that bypassed legacy proxy filters; DNS analytics caught the tunnel.',
        future: 'C2 frameworks will blend with legitimate remote-management tools — inventory authorized RMM first.',
        techniques: ['T1059.001', 'T1071', 'T1573'],
        slang: 'listener, stager, implant, callback'
    },
    54: {
        tool: 'Hashcat',
        focus: 'offline password cracking speed, rule attacks, and leaked-hash hygiene',
        artifacts: 'GPU cracking rigs, rules/masks, cracked credential stuffing lists entering your environment',
        defenses: 'strong unique passwords + MFA, ban known-breached passwords, monitor for stuffing, hash with modern KDFs',
        case: 'A dumped bcrypt set was cracked with rules; reused passwords unlocked VPN and SaaS within hours.',
        future: 'Passkeys reduce crackable secrets — migrate privileged accounts first.',
        techniques: ['T1110', 'T1003'],
        slang: 'wordlist, rules, mask, potfile'
    },
    55: {
        tool: 'John the Ripper',
        focus: 'hash format recognition, incremental/mode attacks, and audit of weak password stores',
        artifacts: 'unshadowed passwd/shadow copies, zip/PDF hash extraction, weak default credentials',
        defenses: 'eliminate reversible storage, rotate after any dump risk, enforce complexity + breach checks',
        case: 'An old ZIP of “client exports” used a company-name password; John cracked it and exposed contracts.',
        future: 'Legacy file encryption remains a soft underbelly long after “good AD policy.”',
        techniques: ['T1110', 'T1552'],
        slang: 'unshadow, incremental, wordlist, format'
    },
    56: {
        tool: 'Hydra',
        focus: 'online brute force / password spray against SSH, RDP, web forms, and APIs',
        artifacts: 'distributed failed logins, spray patterns across many users, source IP rotation',
        defenses: 'lockout + smart throttling, MFA, fail2ban/WAF, password spray detections, disable unused auth surfaces',
        case: 'Hydra sprayed seasonal passwords against OWA; three service accounts without MFA fell before dawn.',
        future: 'Botnets will spray slower and from residential proxies — look for spray math, not only volume.',
        techniques: ['T1110.003', 'T1110.001'],
        slang: 'spray, combo list, parallel tasks, module'
    },
    57: {
        tool: 'Aircrack-ng',
        focus: 'wireless capture, WPA handshake attacks, and rogue AP awareness',
        artifacts: 'deauth floods, handshake captures, evil-twin SSIDs, weak PSK reuse',
        defenses: 'WPA3/enterprise auth, rogue AP detection, disable WPS, separate guest Wi-Fi, certificate EAP',
        case: 'A conference evil twin harvested WPA handshakes from a shared booth password reused at HQ.',
        future: 'Open “free Wi-Fi” social engineering will still beat crypto when users ignore captive-portal warnings.',
        techniques: ['T1557', 'T1040'],
        slang: 'handshake, deauth, PSK, monitor mode'
    },
    58: {
        tool: 'BloodHound',
        focus: 'AD attack-path graphing: ACL abuse, nested groups, and shortest path to Domain Admin',
        artifacts: 'SharpHound collection spikes, LDAP enumeration volume, unusual Kerberos/LDAP reconnaissance',
        defenses: 'tiered admin model, clean ACL debt, privileged access workstations, detect mass LDAP enumeration',
        case: 'BloodHound showed Helpdesk could reset a Tier-0 user’s password via nested groups — path closed in a week.',
        future: 'Identity graphs will include SaaS roles. Attack path thinking extends beyond on-prem AD.',
        techniques: ['T1087', 'T1069', 'T1484'],
        slang: 'attack path, owned, shortest path, ACL'
    },
    59: {
        tool: 'Kerberoasting / AS-REP',
        focus: 'service ticket cracking and accounts without pre-auth',
        artifacts: 'RC4 TGS requests spikes, AS-REP for preauth-disabled users, weak SPN account passwords',
        defenses: 'long random gMSA/SPN passwords, AES-only where possible, alert on unusual TGS volume, disable preauth carefully',
        case: 'A SQL SPN with Password1! was roasted offline; the service account had local admin on finance servers.',
        future: 'Cloud identity tickets differ, but “crackable service secrets” remain a pattern.',
        techniques: ['T1558.003', 'T1558.004'],
        slang: 'SPN, TGS, roast, preauth'
    },
    60: {
        tool: 'Pass-the-Hash / Pass-the-Ticket',
        focus: 'reusing NTLM hashes and Kerberos tickets without knowing the cleartext password',
        artifacts: 'NTLM auth from odd hosts, ticket reuse, lateral SMB/WMI with stolen creds',
        defenses: 'Credential Guard, restrict NTLM, Protected Users, LAPS, segment admin tiers',
        case: 'A workstation hash hopped via PtH to a file server, then to a jump box — classic credential relay of trust.',
        future: 'Token theft in browsers/IdPs is the cloud twin of PtH — session hygiene is the new hash hygiene.',
        techniques: ['T1550.002', 'T1550.003'],
        slang: 'hash, ticket, relay, overpass-the-hash'
    },
    61: {
        tool: 'LOLBins',
        focus: 'abusing signed living-off-the-land binaries (certutil, mshta, rundll32, etc.)',
        artifacts: 'rare parent/child chains, certutil downloading, mshta javascript, bitsadmin transfers',
        defenses: 'ASR rules, application control, detect unusual LOLBin args, reduce local admin',
        case: 'Ransomware staged via `certutil -urlcache` — no “malware.exe” appeared until encryption.',
        future: 'Every new OS utility is a potential LOLBin. Baseline “who normally runs what” matters more each year.',
        techniques: ['T1218', 'T1105'],
        slang: 'lolbin, signed binary proxy, parent-child'
    },
    62: {
        tool: 'PowerShell offensive tradecraft',
        focus: 'encoded commands, download cradles, AMSI bypass attempts, and remote management abuse',
        artifacts: 'powershell -enc, IEX downloadstrings, constrained language escapes, WinRM lateral moves',
        defenses: 'Script Block Logging, AMSI, Constrained Language Mode, JEA, signed scripts only',
        case: 'Encoded PowerShell pulled a second-stage loader; logging reconstructed the cradle despite obfuscation.',
        future: 'Cross-platform shells will join PowerShell — log command lines everywhere, not only Windows.',
        techniques: ['T1059.001', 'T1027'],
        slang: 'cradle, -enc, AMSI, Invoke-Expression'
    },
    63: {
        tool: 'Social Engineering Toolkit (SET)',
        focus: 'cloned sites, credential harvesters, and payload delivery via pretext',
        artifacts: 'lookalike login pages, sudden phishing infra, QR/pretext campaigns tied to cloned brands',
        defenses: 'DMARC/BIMI, phishing-resistant MFA, user reporting, brand monitoring, URL rewriting + sandbox',
        case: 'SET cloned the VPN portal before a “mandatory MFA reset” campaign; passkeys would have neutered the steal.',
        future: 'Clone kits will include deepfake helpdesk videos — process verification beats “the page looks real.”',
        techniques: ['T1566', 'T1598'],
        slang: 'credential harvester, clone, payload, spear'
    },
    64: {
        tool: 'BeEF',
        focus: 'browser hooking, XSS to C2 in the browser, and session abuse from hooked clients',
        artifacts: 'hook.js loads, unusual websocket callbacks, XSS reflected in apps, cookie theft attempts',
        defenses: 'CSP, XSS fixes, HttpOnly/Secure cookies, isolate admin browsers, patch browsers fast',
        case: 'A reflected XSS on an internal wiki hooked browsers via BeEF and pivoted to intranet screenshots.',
        future: 'Browser-based C2 will grow with SaaS-heavy work. Treat XSS as initial access, not “just a bug.”',
        techniques: ['T1189', 'T1059.007'],
        slang: 'hook, zombie, XSS, browser module'
    },
    65: {
        tool: 'Phishing kit anatomy',
        focus: 'kit structure: exfil endpoints, anti-bot, victim panels, and brand assets',
        artifacts: 'kits on bulletproof hosts, telegram/discord exfil, victim IP logs, cloned CSS/JS',
        defenses: 'takedown playbooks, block known kit panels, hunt similar domains, MFA resistant to AiTM where possible',
        case: 'Analysts reversed a kit’s exfil URL and sinkholed credentials before the operator harvested the night shift.',
        future: 'AiTM kits that proxy real MFA will dominate — phishing-resistant MFA and number matching matter.',
        techniques: ['T1566.002', 'T1557'],
        slang: 'kit, panel, AiTM, exfil hook'
    },
    66: {
        tool: 'Maltego / Recon-ng',
        focus: 'OSINT graphing of people, domains, infrastructure, and relationships',
        artifacts: 'WHOIS pivots, DNS historical links, employee email patterns, third-party breaches correlated',
        defenses: 'reduce public footprint, monitor brand/domain lookalikes, train staff on oversharing',
        case: 'Recon linked a staging subdomain to an exposed Jenkins; that became the initial access story.',
        future: 'AI will summarize OSINT into ready-made pretexts in seconds — minimize what you publish.',
        techniques: ['T1589', 'T1596'],
        slang: 'transform, entity, pivot, footprint'
    },
    67: {
        tool: 'theHarvester',
        focus: 'email and subdomain harvesting from public sources for targeting lists',
        artifacts: 'bulk email enumeration, naming-convention discovery, exposed employee lists',
        defenses: 'email security + MFA, remove outdated public lists, monitor paste sites, catch sprays early',
        case: 'Harvested HR emails fed a payroll-themed spear phish the same week bonuses were announced.',
        future: 'Public people-data brokers amplify harvesting — treat naming conventions as sensitive.',
        techniques: ['T1589.002', 'T1593'],
        slang: 'harvest, sources, emails, hosts'
    },
    68: {
        tool: 'Shodan / Censys',
        focus: 'internet-wide exposure discovery for banners, certs, and forgotten services',
        artifacts: 'RDP/SSH/DB on 0.0.0.0, expired certs, IoT dashboards, default login pages',
        defenses: 'attack-surface management, close unused ports, VPN/Zero Trust, continuous external scans you run first',
        case: 'Shodan showed an Elasticsearch with no auth from a contractor laptop hotspot — data leak avoided by hours.',
        future: 'Shadow SaaS and ephemeral cloud IPs make continuous ASM mandatory, not annual.',
        techniques: ['T1595', 'T1592'],
        slang: 'banner, facet, dork, exposure'
    },
    69: {
        tool: 'Tor / proxies',
        focus: 'attribution evasion, multi-hop egress, and operational security habits of intruders',
        artifacts: 'Tor exit traffic, residential proxy ASNs, VPN hop changes mid-session',
        defenses: 'geo/ASN risk scoring, detect anonymizer egress on sensitive apps, require stronger step-up auth',
        case: 'Admin portal logins from Tor exits triggered step-up; the real user was traveling — policy still saved a later attack.',
        future: 'Residential proxies blur “VPN = bad.” Behavior + device posture beats crude geo blocks alone.',
        techniques: ['T1090', 'T1027'],
        slang: 'exit node, chain, OPSEC, bridge'
    },
    70: {
        tool: 'DNS tunneling',
        focus: 'covert C2/exfil via DNS queries and anomalous subdomain entropy',
        artifacts: 'long subdomain labels, high NXDOMAIN, unusual TXT/NULL query volume, beacon-like DNS cadence',
        defenses: 'DNS logging + anomaly detection, block external resolvers, DoH policy, sinkhole suspicious zones',
        case: 'A malware family exfiltrated screenshots as base32 DNS labels; recursive logs made the channel obvious.',
        future: 'DoH/DoT will hide tunnels from some appliances — endpoint DNS telemetry becomes critical.',
        techniques: ['T1071.004', 'T1048'],
        slang: 'tunnel, entropy, TXT, recursive'
    },
    71: {
        tool: 'Exploit development basics',
        focus: 'vulnerability classes, PoC ethics, and patch/mitigation thinking for defenders',
        artifacts: 'crash dumps, exploit mitigations bypass attempts, suspicious debugger/tooling on build hosts',
        defenses: 'ASLR/DEP/CFG, rapid patching, bug bounty intake, isolate research VMs',
        case: 'A public PoC hit unpatched VPN appliances industry-wide within 48 hours — inventory decided who burned.',
        future: 'AI will draft PoCs faster; mean-time-to-patch and compensating controls decide survivors.',
        techniques: ['T1203', 'T1190'],
        slang: 'PoC, exploit, mitigation, crash'
    },
    72: {
        tool: 'Buffer overflow mechanics',
        focus: 'memory corruption concepts defenders need to prioritize patches and hardening',
        artifacts: 'overflow crashes, exploit attempts against legacy C services, disabled mitigations',
        defenses: 'memory-safe rewrites where feasible, compiler mitigations, fuzzing in CI, kill legacy services',
        case: 'An ancient C parser on a print server was overflowed; segmentation would have limited the pivot.',
        future: 'Memory-unsafe code remains in OT and embedded — inventory language risk, not only CVEs.',
        techniques: ['T1203', 'T1068'],
        slang: 'stack, heap, EIP/RIP, shellcode'
    },
    73: {
        tool: 'Ghidra',
        focus: 'reverse engineering malware/config extract for detections and YARA',
        artifacts: 'unpacked payloads, C2 configs, string decryption routines, packer layers',
        defenses: 'malware sandbox + RE pipeline, share IOCs, block configs fast, train hunters on RE outputs',
        case: 'Ghidra revealed a hardcoded Cloudflare Workers C2; DNS blocks stopped new beacons the same day.',
        future: 'Malware authors will AI-obfuscate — config extraction automation becomes a SOC skill.',
        techniques: ['T1027', 'T1140'],
        slang: 'decompiler, xref, unpack, config'
    },
    74: {
        tool: 'Volatility',
        focus: 'memory forensics: processes, injected code, network artifacts in RAM',
        artifacts: 'hollowed processes, injected DLLs, plaintext credentials in memory, hidden connections',
        defenses: 'capture memory early in IR, EDR dumps, train on plugins, preserve volatility order',
        case: 'Disk looked clean after wiper; Volatility showed injected beacon still resident in memory.',
        future: 'Credential material in browser memory will keep IR teams on Volatility-class tools for years.',
        techniques: ['T1055', 'T1003'],
        slang: 'pslist, malfind, dump, hibernation'
    },
    75: {
        tool: 'YARA',
        focus: 'rule writing for hunting malware families and toolmarks across endpoints/repos',
        artifacts: 'rule hits on packs, false positives on common strings, CI scanning of artifacts',
        defenses: 'tune rules, test against goodware, deploy to EDR/sandbox, version-control detections',
        case: 'A YARA rule for a packer stub caught a new ransomware affiliate before AV signatures existed.',
        future: 'Rules will combine with ML scores — still need human-readable detections auditors trust.',
        techniques: ['T1027', 'T1036'],
        slang: 'rule, strings, condition, false positive'
    },
    76: {
        tool: 'Ransomware builder awareness',
        focus: 'affiliate builders, encryptor options, and leak-site pressure tactics',
        artifacts: 'builder configs, note templates, volume shadow deletion, backup targeting',
        defenses: 'immutable backups, least privilege, EDR isolation, rehearsed recovery, identity hardening',
        case: 'Builder logs showed affiliates choosing “delete VSS + exfil first”; backups offline saved the hospital.',
        future: 'RaaS UX will look like SaaS dashboards — defend outcomes (recovery + identity), not brand names.',
        techniques: ['T1486', 'T1490'],
        slang: 'affiliate, encryptor, note, leak site'
    },
    77: {
        tool: 'Initial Access Brokers',
        focus: 'stolen VPN/RDP/citrix access markets that skip phishing entirely',
        artifacts: 'fresh VPN sessions from odd geos, bought valid accounts, sudden MFA fatigue after purchase',
        defenses: 'phishing-resistant MFA, device trust, detect impossible travel, rotate after employee offboarding',
        case: 'IAB-sold VPN creds for a contractor account started the ransomware week — no phish email existed.',
        future: 'Identity marketplaces will price your weak MFA. Treat accounts as inventory with owners.',
        techniques: ['T1078', 'T1133'],
        slang: 'IAB, access, listing, valid accounts'
    },
    78: {
        tool: 'Web shells',
        focus: 'persistent server-side backdoors and post-exploitation on web apps',
        artifacts: 'odd ASPX/PHP/JSP files, anomalous process from w3wp/nginx, rare user-agents to admin paths',
        defenses: 'FIM on web roots, least privilege app pools, WAF, outbound restrict from web servers',
        case: 'A one-line PHP shell in /uploads called out nightly; FIM would have caught the write.',
        future: 'Serverless and container webshells look different — still “unexpected code execution on the edge.”',
        techniques: ['T1505.003', 'T1059'],
        slang: 'shell, upload, eval, China Chopper-style'
    },
    79: {
        tool: 'Lateral movement tooling',
        focus: 'WMI, PsExec-like, RDP, WinRM, and remote service abuse patterns',
        artifacts: 'remote service creation, admin$ traffic, unusual WinRM, RDP from non-VDI hosts',
        defenses: 'tiering, disable unused remoting, Privileged Access Workstations, detect remote execution chains',
        case: 'PsExec-like lateral moves from a helpdesk jump box lit up EDR — PAW design stopped Tier-0 contact.',
        future: 'SaaS lateral movement (OAuth app consent) joins on-prem remoting — identity is the new LAN.',
        techniques: ['T1021', 'T1047', 'T1569.002'],
        slang: 'psexec, wmi, winrm, admin share'
    },
    80: {
        tool: 'Privilege escalation',
        focus: 'local and domain priv-esc: misconfigs, tokens, kernel, and service ACL abuse',
        artifacts: 'whoami /priv anomalies, service binary overwrites, token impersonation, UAC bypass attempts',
        defenses: 'patch, harden services, remove local admin sprawl, detect privilege changes',
        case: 'Writable service path → SYSTEM → domain pivot. Hardening checklist closed 40 similar paths.',
        future: 'Cloud IAM privilege escalation (role chaining) is the twin skill — same graph thinking.',
        techniques: ['T1068', 'T1134'],
        slang: 'token, UAC, SYSTEM, misconfig'
    },
    81: {
        tool: 'Persistence mechanisms',
        focus: 'run keys, services, scheduled tasks, WMI subscriptions, and account persistence',
        artifacts: 'new autoruns, suspicious tasks, hidden users, OAuth grants, inbox rules',
        defenses: 'autoruns auditing, EDR persistence detections, periodic identity grant reviews',
        case: 'A WMI event subscription relaunched malware after every reimage until the subscription was removed.',
        future: 'Identity persistence (app consents, API keys) will outlive host reimaging — hunt both planes.',
        techniques: ['T1547', 'T1053', 'T1546'],
        slang: 'autorun, task, WMI, implant'
    },
    82: {
        tool: 'Defense evasion & obfuscation',
        focus: 'packing, encoding, process hollowing, and disabling security tools',
        artifacts: 'AMSI bypass strings, packed binaries, unhooking attempts, security service stops',
        defenses: 'tamper protection, kernel EDR, detect tool-disabling, allowlisting critical paths',
        case: 'Attackers tried to stop the EDR service; tamper protection + alert let IR contain before encryption.',
        future: 'Living-off-trusted-sites downloads will keep obfuscation fresh — focus on behavior.',
        techniques: ['T1027', 'T1562', 'T1055'],
        slang: 'pack, unhook, bypass, hollow'
    },
    83: {
        tool: 'Exfiltration & DLP bypass',
        focus: 'channels: cloud sync, DNS, steganography, encrypted archives, approved SaaS abuse',
        artifacts: 'large uncommon egress, archive + rename tricks, personal cloud uploads, DNS tunnels',
        defenses: 'DLP + CASB, egress allowlists, detect archive entropy, watermarking, least data access',
        case: 'Exfil used personal OneDrive labeled “vacation photos” — CASB policies flagged the volume anomaly.',
        future: 'AI will summarize and exfil smaller high-value extracts — DLP must understand meaning, not only size.',
        techniques: ['T1048', 'T1567'],
        slang: 'exfil, staging, archive, covert'
    },
    84: {
        tool: 'MITRE ATT&CK mapping',
        focus: 'translating toolmarks into techniques, tactics, and detection coverage gaps',
        artifacts: 'coverage heatmaps, unmapped alerts, technique-centric hunts',
        defenses: 'map detections to techniques, close coverage gaps, purple-team to ATT&CK IDs',
        case: 'Mapping showed strong ransomware coverage but almost none for T1550 credential reuse — next quarter’s priority.',
        future: 'Boards will ask for ATT&CK coverage language — teach operators to speak it fluently.',
        techniques: ['T1087', 'T1078'],
        slang: 'tactic, technique, sub-technique, coverage'
    },
    85: {
        tool: 'Adversary emulation',
        focus: 'planning purple-team exercises that prove controls without reckless live fire',
        artifacts: 'emulation plans, success criteria, detection gaps, safety boundaries',
        defenses: 'scoped ROE, production safeguards, measure detect/respond times, track remediations',
        case: 'Emulating IAB→VPN→PtH revealed MFA gaps on contractors; fixed before a real affiliate bought access.',
        future: 'Continuous automated emulation will join CI — still need human judgment on business risk.',
        techniques: ['T1078', 'T1021'],
        slang: 'emulation, ROE, purple, detect/respond'
    },
    86: {
        tool: 'Deepfake / AI voice clones',
        focus: 'synthetic media for BEC, helpdesk resets, and authority abuse',
        artifacts: 'urgent voice calls, video approvals, mismatched channel metadata, refusal of challenge phrases',
        defenses: 'challenge phrases, dual control, known-channel callbacks, deepfake awareness drills',
        case: 'A CFO voice clone nearly moved funds; a pre-agreed passphrase failed and finance froze the wire.',
        future: 'Real-time face/voice clones will be cheap — process is the control, not “spot the artifact.”',
        techniques: ['T1534', 'T1566'],
        slang: 'clone, deepfake, challenge phrase, AiTM social'
    },
    87: {
        tool: 'Adversarial ML tooling',
        focus: 'evading ML detectors, poisoning data, and prompt/tool abuse against AI systems',
        artifacts: 'adversarial samples, poisoned training sets, prompt injection into tools with secrets',
        defenses: 'model monitoring, human approval for sensitive tools, data provenance, red-team ML systems',
        case: 'Prompt injection in a support bot tried to dump API keys via a connected plugin — tool allowlists stopped it.',
        future: 'Every AI agent with tools is an identity. Treat agents like privileged service accounts.',
        techniques: ['T1204', 'T1559'],
        slang: 'poisoning, evasion, prompt injection, model'
    },
    88: {
        tool: 'Cloud credential theft',
        focus: 'access keys, session tokens, metadata SSRF, and OAuth token theft',
        artifacts: 'IMDS probing, long-lived keys in git, unusual AssumeRole, stolen refresh tokens',
        defenses: 'short-lived creds, IMDSv2, secret scanning, conditional access, disable legacy keys',
        case: 'SSRF to cloud metadata minted temporary creds; IMDSv2 and egress controls would have blocked it.',
        future: 'Workload identity federation reduces static keys — migrate aggressively.',
        techniques: ['T1552', 'T1078.004'],
        slang: 'access key, IMDS, AssumeRole, token'
    },
    89: {
        tool: 'Container escape',
        focus: 'break mounts, privileged pods, kernel exploits, and cluster RBAC abuse',
        artifacts: 'privileged containers, docker.sock mounts, hostPath abuse, breakout attempts',
        defenses: 'PSS/PSA, no privileged by default, minimal capabilities, runtime security, RBAC least privilege',
        case: 'A debug pod with docker.sock became cluster-admin — policy-as-code now blocks that pattern.',
        future: 'AI coding agents will request privileged debug pods — guardrails must be automated.',
        techniques: ['T1611', 'T1610'],
        slang: 'breakout, privileged, docker.sock, RBAC'
    },
    90: {
        tool: 'Supply-chain poisoning',
        focus: 'dependency confusion, malicious packages, build pipeline compromise',
        artifacts: 'typosquat packages, unexpected publish events, build agent anomalies, signed-but-malicious updates',
        defenses: 'pin hashes, private registries, provenance (SLSA), review publish rights, SCA in CI',
        case: 'A typosquat npm package ran a preinstall script; lockfile pinning + deny scripts policy contained it.',
        future: 'Trusted publishers and attestations will matter more than “download count.”',
        techniques: ['T1195', 'T1072'],
        slang: 'typosquat, confusion, provenance, lockfile'
    },
    91: {
        tool: 'Mobile attack frameworks',
        focus: 'MDM abuse, sideload malware, spyware indicators, and insecure mobile apps',
        artifacts: 'profile installs, accessibility abuse, sideload APKs, SMS-stealer permissions',
        defenses: 'MDM/MAM, block sideload, app vetting, phishing-resistant MFA not SMS-only',
        case: 'A fake “battery saver” APK harvested OTP SMS; moving VIP MFA to passkeys ended the pattern.',
        future: 'Commercial spyware and stalkerware blur — treat unexplained MDM profiles as incidents.',
        techniques: ['T1476', 'T1417'],
        slang: 'sideload, MDM, spyware, OTP steal'
    },
    92: {
        tool: 'Hardware / USB attacks',
        focus: 'BadUSB, malicious chargers, and physical implant risks',
        artifacts: 'HID keyboard injection, unexpected USB device classes, rubber-ducky timings',
        defenses: 'USB allowlisting, disable HID on sensitive hosts, physical security, user drills on found media',
        case: 'A “vendor gift” USB typed PowerShell in seconds on a kiosk — USB policy would have blocked HID.',
        future: 'Cable chips get cheaper — treat unknown peripherals like unknown binaries.',
        techniques: ['T1200', 'T1091'],
        slang: 'BadUSB, HID, rubber ducky, implant'
    },
    93: {
        tool: 'OT protocol attacks',
        focus: 'Modbus/DNP3/ICS protocol abuse where availability and safety dominate',
        artifacts: 'unexpected engineering workstation traffic, protocol function code anomalies, flat OT networks',
        defenses: 'OT segmentation, isolate engineering hosts, monitoring with protocol awareness, change control',
        case: 'Unauthorized Modbus writes from a compromised jump host; unidirectional gateways later limited blast radius.',
        future: 'IT ransomware crews increasingly touch OT — safety-first IR playbooks are mandatory.',
        techniques: ['T0855', 'T0867'],
        slang: 'Modbus, historian, engineering workstation, zone/conduit'
    },
    94: {
        tool: 'Attacker language & social cues',
        focus: 'slang, urgency scripts, underground jargon, and social pressure tells',
        artifacts: 'scripted urgency, authority name-drops, underground slang in chats, inconsistent stories',
        defenses: 'verification culture, challenge protocols, coaching without shame, tabletop social injects',
        case: 'Helpdesk recognized “reset now or CEO fires you” as classic pressure language and refused without proofing.',
        future: 'AI will personalize slang per culture — teach principles of pressure, not one English script.',
        techniques: ['T1598', 'T1566'],
        slang: 'pretext, OPSEC, drop, access, kit'
    },
    95: {
        tool: 'Purple Team correlation',
        focus: 'linking offensive toolmarks to detections, tickets, and measurable control proof',
        artifacts: 'emulation logs vs SIEM hits, missed techniques, MTTD/MTTR metrics',
        defenses: 'closed-loop purple process, ATT&CK coverage tracking, remediation SLAs',
        case: 'Purple week proved DNS tunneling was invisible; a new analytic cut MTTD from unknown to 4 minutes.',
        future: 'Boards will fund what you can measure — purple correlation is how tooling spend becomes proof.',
        techniques: ['T1071', 'T1021'],
        slang: 'MTTD, coverage, emulate, detect, prove'
    },
    96: {
        tool: 'Authorized red-team emulation',
        focus: 'ROE-bound objective planning, initial access rehearsal, credential abuse paths, and safe debrief — never unauthorized hacking',
        artifacts: 'scoped target lists, phishing lure drafts under ROE, BloodHound-style path notes, C2 beacon timing hypotheses, kill-chain debrief slides',
        defenses: 'written authorization, dual-control ROE, isolated lab ranges, stop-work authority, evidence-safe teardown',
        case: 'Emulation cell used WhatsApp pretext against a Namibia finance desk under written ROE; found MFA fatigue gap and closed it before criminals did.',
        future: 'AI will speed pretexting — elite red teams win by disciplined ROE and measurable detection proof, not reckless live fire.',
        techniques: ['T1566', 'T1078', 'T1021', 'T1003', 'T1041'],
        slang: 'ROE, objective, assume-breach, path, beacon, debrief'
    },
    97: {
        tool: 'Blue-team crisis cell',
        focus: 'live containment, hunt hypotheses, evidence preservation, and executive briefing under inject pressure',
        artifacts: 'SIEM alert storms, EDR isolations, timeline boards, dual-channel verification logs, board one-pagers',
        defenses: 'playbooks, network segmentation, identity revocation, chain of custody, measured MTTD/MTTR',
        case: 'Crisis cell contained a BEC + ransomware dual-track by isolating finance VDI first, preserving mail evidence, and briefing the CEO in 90 seconds of truth.',
        future: 'Crisis cells that rehearse deepfake CFO calls and mobile-money fraud will out-perform checklist-only SOC teams.',
        techniques: ['T1566', 'T1486', 'T1078', 'T1048', 'T1005'],
        slang: 'contain, hunt, isolate, brief, residual risk'
    }
};

function q(question, options, correct, explanation, topic, time_expected = 40) {
    return { question, options, correct, explanation, topic, time_expected };
}

function buildQuestionsForProfile(id, p, moduleName) {
    const t = p.tool;
    return [
        q(
            `During a ${moduleName} drill, SOC sees artifacts consistent with ${p.artifacts}. What is the best first defensive move?`,
            [
                'Ignore it unless antivirus shows a known hash for ${t}',
                `Contain the suspected host/account path, preserve evidence, and hunt related ${t} tradecraft`,
                'Announce the breach on social media to crowdsource advice',
                'Reboot every server in the company immediately'
            ].map(s => s.replace('${t}', t)),
            1,
            `For ${t}, prioritize containment and evidence while hunting technique artifacts — not brand-name signatures alone.`,
            p.tool.toLowerCase().replace(/\s+/g, '_'),
            40
        ),
        q(
            `Which statement best describes how adversaries use ${t} in real operations?`,
            [
                `${t} is only a marketing myth and never appears in incidents`,
                `Operators use ${t} for ${p.focus} — defenders must recognize the move and the talk (${p.slang})`,
                `${t} can only be detected by disabling the internet`,
                `${t} always leaves the exact same file hash forever`
            ],
            1,
            `Know the enemy by how they move and talk: ${t} supports ${p.focus}.`,
            'tradecraft',
            35
        ),
        q(
            `Which control set most directly reduces risk from ${t}-style activity?`,
            [
                'Hope and a strong password written on a sticky note',
                p.defenses,
                'Turning off all logging to reduce noise',
                'Sharing domain admin with every contractor for speed'
            ],
            1,
            `Layered controls matter for ${t}: ${p.defenses}`,
            'controls',
            40
        ),
        q(
            `Purple-team lesson from a ${t} case: ${p.case} What principle does this reinforce?`,
            [
                'Tool brand names matter more than techniques',
                'Technique-aware detection, least privilege, and rehearsal beat logo-chasing',
                'Never investigate after hours',
                'Only executives can declare incidents'
            ],
            1,
            'Tribams trains technique recognition and response quality — not tool worship.',
            'purple_team',
            40
        ),
        q(
            `Future horizon for ${t}: ${p.future} Best readiness action this quarter?`,
            [
                'Wait until after the first breach in your sector',
                'Map detections to ATT&CK, close coverage gaps, and practice the human verification habits now',
                'Buy every security product brochure without measurement',
                'Ban all new technology including patches'
            ],
            1,
            `Train for the coming shape of ${t} abuse while proving today’s controls.`,
            'future_threats',
            45
        ),
        q(
            `An analyst maps ${t} activity to MITRE techniques such as ${(p.techniques || []).join(', ') || 'relevant ATT&CK IDs'}. Why does that help?`,
            [
                'It replaces the need for any logging',
                'Shared technique language improves hunts, purple reports, and coverage gap analysis',
                'ATT&CK IDs automatically patch servers',
                'It proves the attacker used Windows only'
            ],
            1,
            'ATT&CK vocabulary lets teams correlate tools → techniques → detections.',
            'attack_mapping',
            35
        )
    ];
}

function buildExtras(id, p, moduleName) {
    return {
        why: `${moduleName} trains defenders to recognize ${p.tool} tradecraft — ${p.focus}. If you only hunt brand names, renamed or living-off-the-land variants will slip past.`,
        concepts: [
            `${p.tool} purpose and operator workflow: ${p.focus}`,
            `Detectable artifacts: ${p.artifacts}`,
            `Operator language/cues: ${p.slang}`,
            `ATT&CK anchors: ${(p.techniques || []).join(', ') || 'technique mapping'}`
        ],
        prevent: p.defenses.split(',').map(s => s.trim()).filter(Boolean),
        caseStudy: p.case,
        futureScenario: p.future,
        essayQuestions: [
            {
                question: `You are purple-teaming ${moduleName}. Write an emulation + detection plan for ${p.tool}: safe scope, expected artifacts (${p.artifacts}), detections to prove, and rollback/safety rules.`,
                guidelines: 'Include ROE, ATT&CK IDs, success metrics (MTTD/MTTR), and what must never be run on production.'
            },
            {
                question: `Translate this ${p.tool} finding into a board brief: ${p.case} Cover business risk, compensating controls, and a 30/60/90-day hardening plan.`,
                guidelines: 'Use residual risk language and measurable outcomes. Map to NIST CSF Identify/Protect/Detect/Respond/Recover.'
            },
            {
                question: `Design a 45-minute tabletop where staff face social pressure while ${p.tool}-related alerts fire. Include injects using attacker language (${p.slang}) and a scoring rubric for verification habits.`,
                guidelines: 'Score judgment and process, not trivia. Include one deepfake/urgency inject.'
            },
            {
                question: `Near-future scenario: ${p.future} Coach a junior analyst through the first 10 minutes of response for ${moduleName} without panicking or disabling critical detections.`,
                guidelines: 'Containment first, evidence second, clear escalation, no blind tool shutdowns.'
            }
        ],
        links: []
    };
}

function buildToolkitExtrasMap() {
    const map = {};
    for (const m of ATTACKER_TOOLKIT_MODULES) {
        const p = PROFILES[m.id];
        if (!p) continue;
        map[m.id] = buildExtras(m.id, p, m.name);
    }
    return map;
}

function buildToolkitQuestionBanks() {
    const banks = {};
    for (const m of ATTACKER_TOOLKIT_MODULES) {
        const p = PROFILES[m.id];
        if (!p) continue;
        banks[m.id] = buildQuestionsForProfile(m.id, p, m.name);
    }
    return banks;
}

const TOOLKIT_EXTRAS = buildToolkitExtrasMap();
const TOOLKIT_MODULE_QUESTIONS = buildToolkitQuestionBanks();

const OFFENSIVE_TOOLS_CATEGORY_QUESTIONS = [
    q(
        'A cracked offensive framework beacon uses HTTPS with a common browser User-Agent and 60s jitter. Best detection mindset?',
        [
            'Ignore HTTPS because encryption means safe',
            'Hunt beacon cadence, process ancestry, and rare destinations — not User-Agent alone',
            'Block all HTTPS company-wide',
            'Only rely on the filename cobaltstrike.exe'
        ],
        1,
        'Malleable C2 mimics browsers. Behavior and identity context beat cosmetic strings.',
        'c2',
        40
    ),
    q(
        'You find SharpHound-like LDAP enumeration from a helpdesk account at 02:00. Priority action?',
        [
            'Wait for the helpdesk ticket to close tomorrow',
            'Treat as AD recon: contain the account/host, review attack paths, and check for follow-on Kerberoast/PtH',
            'Disable the domain controller immediately without a plan',
            'Congratulate the helpdesk on thorough inventory'
        ],
        1,
        'Mass LDAP enumeration often precedes privilege escalation. Contain and hunt paths.',
        'ad_recon',
        40
    ),
    q(
        'Which rule is non-negotiable when studying attacker tooling in Tribams?',
        [
            'Practice exploits on any internet host that looks poorly secured',
            'Only use authorized labs / written permission — Tribams trains defense and purple-team awareness, not crime',
            'Share live ransomware builders with friends for “research vibes”',
            'Disable all logging so labs stay stealthy'
        ],
        1,
        'Legal and ethical boundaries are part of professional readiness.',
        'ethics',
        30
    ),
    q(
        'Pass-the-Hash succeeded after a domain admin logged into a user workstation. Root lesson?',
        [
            'Domain admins should browse and RDP everywhere for convenience',
            'Tiered administration and PAWs — privileged credentials must not touch dirty endpoints',
            'Hashes cannot be reused ever',
            'Only cloud accounts matter now'
        ],
        1,
        'Credential exposure on workstations enables lateral movement. Tier your admins.',
        'credential_theft',
        40
    ),
    q(
        'DNS queries show high-entropy long subdomains every 45 seconds from one host. Suspect?',
        [
            'Normal Windows update behavior always looks like that',
            'Possible DNS tunneling / covert C2 — investigate host, block tunnel, preserve DNS logs',
            'Disable DNS for the whole company',
            'Ignore because DNS is never used for exfil'
        ],
        1,
        'DNS is a classic covert channel. Entropy + cadence are tells.',
        'dns_tunnel',
        40
    ),
    q(
        'An initial access broker sold valid VPN credentials — no phishing email exists. Best prevention focus?',
        [
            'Only train users to spot email logos',
            'Phishing-resistant MFA, device trust, rapid offboarding, and monitoring for bought-access patterns',
            'Ban VPN forever without replacement access',
            'Publish all VPN passwords in Confluence for transparency'
        ],
        1,
        'IABs skip the inbox. Identity and session controls are the front line.',
        'iab',
        40
    )
];

function getToolkitExtras(module) {
    const id = module && module.id;
    return TOOLKIT_EXTRAS[id] || null;
}

function getToolkitEssayQuestions(module) {
    const extras = getToolkitExtras(module);
    return extras && extras.essayQuestions ? extras.essayQuestions : null;
}

module.exports = {
    PROFILES,
    TOOLKIT_EXTRAS,
    TOOLKIT_MODULE_QUESTIONS,
    OFFENSIVE_TOOLS_CATEGORY_QUESTIONS,
    getToolkitExtras,
    getToolkitEssayQuestions
};
