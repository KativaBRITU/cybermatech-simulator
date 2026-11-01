/**
 * Tier B paid-grade depth — second enrichment wave.
 * Merged with Tier A in assessmentEngine / contentLibrary.
 */

function q(question, options, correct, explanation, topic, time_expected = 40) {
    return { question, options, correct, explanation, topic, time_expected };
}

function essay(question, guidelines) {
    return { question, guidelines };
}

const TIER_B_QUESTIONS = {
    2: [
        q('Sandbox detonation shows no network, but users still get encrypted files. Best hypothesis?', ['Malware is harmless', 'Possibly environment-aware / delayed / human-operated stage — correlate host + identity, do not trust sandbox alone', 'Sandboxes always catch everything', 'Ignore EDR forever'], 1, 'Modern malware detects sandboxes or waits for hands-on operators.', 'malware', 40),
        q('First safe action on a suspected malicious Office macro sample from Finance?', ['Open on your laptop to “see”', 'Isolate host/account path; submit to controlled analysis; preserve original; block hash/URL', 'Forward to everyone for opinions', 'Delete all mail servers'], 1, 'Contain and analyze safely — curiosity is an infection vector.', 'malware', 35)
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
        q('Confirmed personal data exfil of EU customers. Parallel clocks?', ['Only restore servers; ignore law', 'Technical containment + legal/privacy notification assessment under applicable law', 'Wait a year', 'Pay ransom instead of notifying'], 1, 'Privacy incidents are dual-track: tech + legal.', 'privacy', 40),
        q('Vendor processes HR data without a DPA. Best action?', ['Ignore — vendors are trusted by default', 'Stop or constrain processing until contract/controls meet requirements', 'Email SSNs to speed onboarding', 'Post data publicly'], 1, 'Processors need contractual and technical guardrails.', 'privacy', 35)
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
    2: [essay('Write a SOC handling guide for a suspected malicious macro that sandbox-marked “clean.” Include isolation, analysis path, and user coaching.', 'Do not open samples on personal endpoints. Evidence + containment.')],
    4: [essay('Draft a 30/60/90 cloud hardening plan after a public bucket + leaked access key incident.', 'Include identity, exposure, CI secrets, and owners.')],
    12: [essay('Explain dual-track response for personal data exfil to a non-technical CEO in one page.', 'Legal clocks + technical containment; no speculation.')],
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
};

function getTierBEssays(moduleId) {
    return TIER_B_ESSAYS[moduleId] || null;
}

module.exports = {
    TIER_B_QUESTIONS,
    TIER_B_EXTRAS,
    TIER_B_ESSAYS,
    getTierBEssays
};
