/**
 * Tier C paid-grade depth — final enrichment wave (remaining modules).
 * Merged with Tier A/B in assessmentEngine / contentLibrary.
 */

function q(question, options, correct, explanation, topic, time_expected = 40) {
    return { question, options, correct, explanation, topic, time_expected };
}

function essay(question, guidelines) {
    return { question, guidelines };
}

const TIER_C_QUESTIONS = {
    6: [
        q('Default password on an internet-facing camera/NVR. First move?', ['Leave it — IoT is low value', 'Change creds / remove exposure; segment IoT; inventory; hunt abuse', 'Only paint the camera black', 'Disable all networking company-wide'], 1, 'Exposed IoT with defaults is free footholds.', 'iot', 40),
        q('Why flat IoT on the same VLAN as ERP is dangerous?', ['IoT cannot be compromised', 'Compromised gadgets become lateral pivots into business systems', 'VLANs are only cosmetic', 'Cameras harden ERP automatically'], 1, 'Segmentation is the IoT control that matters.', 'iot', 35)
    ],
    13: [
        q('Evil twin AP with captive portal near your office. User risk?', ['None if SSID looks familiar', 'Credential/session theft and MitM — prefer known networks / VPN/ZTNA; educate reporting', 'Evil twins only work on 2G', 'WPA3 makes social engineering impossible'], 1, 'Wireless social engineering still harvests trust.', 'wireless', 40),
        q('Guest Wi-Fi bridged into corporate AD. Fix?', ['Celebrate open access', 'Isolate guest; no path to crown jewels; monitor; enforce strong auth on corp WLAN', 'Disable all Wi-Fi forever', 'Share corp PSK on the lobby TV'], 1, 'Guest isolation is non-negotiable.', 'wireless', 35)
    ],
    26: [
        q('Serverless function with admin cloud role and public URL. Risk?', ['Serverless cannot be abused', 'Over-privilege + exposure = account takeover / data theft via the function', 'Only VMs have IAM risk', 'Public URLs are always safe'], 1, 'Functions inherit cloud identity power.', 'serverless', 40),
        q('Best identity pattern for serverless to access a database?', ['Hardcode long-lived keys in code', 'Short-lived role with least privilege; secrets from a vault; no public admin APIs', 'Share root keys', 'Disable logging'], 1, 'Least privilege + short life.', 'serverless', 35)
    ],
    28: [
        q('Honest near-term quantum risk narrative for leadership?', ['All crypto is broken tomorrow morning', 'Harvest-now-decrypt-later risk for long-lived secrets — plan crypto agility / PQC migration program', 'Ignore cryptography forever', 'Only blockchain is affected'], 1, 'Programmatic migration beats panic.', 'quantum', 40),
        q('What should you inventory first for PQC readiness?', ['Office chair brands', 'Systems using public-key crypto for long-lived confidentiality/authentication (VPN, TLS, code signing, archives)', 'Only printer firmware aesthetics', 'Coffee machines'], 1, 'Inventory drives migration priority.', 'quantum', 35)
    ],
    29: [
        q('Smart contract drain via unchecked external call. Lesson?', ['Blockchain is unhackable', 'Code and key custody are the security — audits, least privilege wallets, monitoring', 'Only exchanges get hacked', 'Public chains need no reviews'], 1, 'Chain security is software + ops security.', 'blockchain', 40),
        q('Seed phrase in a Slack screenshot. Action?', ['Leave it — Slack is private', 'Treat as compromise: rotate/migrate funds if possible; revoke; train; ban seed sharing channels', 'Post it to Twitter for transparency', 'Encrypt with ROT13 only'], 1, 'Key custody failures are final.', 'blockchain', 35)
    ],
    33: [
        q('Checkout page loads a third-party script that skims cards. Control family?', ['Trust all CDNs forever', 'CSP/SRI, vendor vetting, runtime monitoring, PCI scope discipline', 'Disable HTTPS', 'Store CVV in localStorage'], 1, 'Magecart-class risk is supply chain on the browser.', 'ecommerce', 40),
        q('Why logging full PAN on ecommerce servers is a problem?', ['Helps support tickets', 'Expands PCI/breach scope and attacker loot — tokenize and stop logging CHD', 'Required by all banks', 'Makes refunds faster forever'], 1, 'Do not keep what you should not hold.', 'ecommerce', 35)
    ],
    35: [
        q('Tailgating into the server room after a badge clone report. Dual control?', ['Ignore physical', 'Physical + logical: revoke badges, review CCTV, hunt VPN/console access from related times', 'Only change wallpaper', 'Leave doors unlocked for visitors'], 1, 'Physical breach enables logical compromise.', 'physical', 40),
        q('USB “found in parking lot” plugged into Finance PC. Framing?', ['Free hardware upgrade', 'Likely social-engineering drop — isolate host; hunt; ban unknown USB; coach without shame', 'Always safe if branded', 'Format the SAN immediately'], 1, 'USB drops are classic physical+malware paths.', 'physical', 35)
    ],
    44: [
        q('Suspect wiped a phone after insider theft allegation. Forensic reality?', ['Always full recovery', 'Mobile evidence is volatile/encrypted — lawful process, rapid seizure, cloud backups may matter more', 'Ignore cloud accounts', 'Only SIM cloning helps'], 1, 'Mobile forensics needs speed and legal authority.', 'mobile_forensics', 40),
        q('Best early sources when device is MDM-managed?', ['Only the broken screen', 'MDM inventory, app lists, location/compliance logs, correlated IdP sign-ins', 'Ignore MDM', 'Ask the suspect to factory reset again'], 1, 'Enterprise telemetry often beats late imaging.', 'mobile_forensics', 35)
    ],
    55: [
        q('John/Hashcat-class cracking of dumped NTLM. Defense priority?', ['Make posters about crackers', 'Prevent dumps; strong/unique creds; passwordless/MFA; treat cracked use as identity IR', 'Only throttle online guesses', 'Disable all password policies'], 1, 'Offline cracking races favor attackers after theft.', 'john', 40),
        q('Why “we use complexity rules” may still fail?', ['Complexity always wins', 'Short/predictable patterns and reuse still fall; length, uniques, and dump prevention matter more', 'Crackers cannot use GPUs', 'Complexity replaces MFA'], 1, 'Modern guidance favors length and uniqueness.', 'john', 35)
    ],
    57: [
        q('WPA PSK cracked after handshake capture near HQ. Immediate actions?', ['Ignore wireless', 'Rotate PSK/move to enterprise auth (802.1X); segment; hunt for evil twin/rogue use; coach staff', 'Print PSK larger in lobby', 'Disable Ethernet instead'], 1, 'Shared PSKs are shared secrets — fragile.', 'wireless_off', 40),
        q('Best long-term wireless auth for corp laptops?', ['One PSK forever', '802.1X/EAP with device/user identity; guest isolated', 'Open Wi-Fi with captive portal only', 'Hide SSID as the only control'], 1, 'Enterprise auth beats shared passwords.', 'wireless_off', 35)
    ],
    63: [
        q('SET-style cloned login page on LAN during unauthorized “test.” Response?', ['Congratulate creativity', 'Treat as phishing infrastructure — contain, investigate authorization, reset exposed creds', 'Ignore internal sites', 'Publish the clone for training without ROE'], 1, 'Unauthorized kits are incidents.', 'set', 40),
        q('Purple use of SET awareness?', ['Phish production customers randomly', 'Authorized emulation to test reporting and MFA quality under ROE', 'Disable email filters during tests secretly', 'Store harvested passwords in Excel'], 1, 'Emulate to measure defenses, not to collect loot.', 'set', 35)
    ],
    64: [
        q('Browser hook framework hooks an internal admin session. Priority?', ['Ignore XSS', 'Contain affected hosts/sessions; find XSS/entry; revoke sessions; patch app; hunt callbacks', 'Disable all browsers forever', 'Only clear cookies on one PC'], 1, 'Browser exploitation turns XSS into remote control.', 'beef', 40),
        q('Durable control against browser hook kits?', ['Trust intranet sites blindly', 'Fix XSS, CSP, HttpOnly/Secure cookies, least privilege admin browsing habits', 'Disable TLS', 'Allow all inline scripts'], 1, 'AppSec + browser hygiene.', 'beef', 35)
    ],
    66: [
        q('OSINT graph of executives’ emails and vendors leaked. Defensive use?', ['Dox staff further', 'Reduce public oversharing; monitor brand; harden VIP targets; feed awareness with real exposure', 'Ban all LinkedIn without alternatives', 'Ignore OSINT'], 1, 'See what attackers can see for free.', 'osint', 40),
        q('Ethical line for learner OSINT?', ['Hack mailboxes to verify emails', 'Use only public data; no unauthorized access; no harassment', 'Phish the CEO to confirm findings', 'Buy stolen dumps “for research”'], 1, 'Public collection ≠ intrusion.', 'osint', 35)
    ],
    67: [
        q('theHarvester-style email list used for spearphish. Best org control?', ['Publish more emails on the website footer', 'Reduce crawlable addresses; VIP protections; DMARC; reporting culture; phishing-resistant MFA', 'Disable DNS MX', 'Ignore email recon'], 1, 'Recon feeds social engineering.', 'harvester', 40),
        q('Why “security through obscure emails” fails alone?', ['It never fails', 'Attackers still find addresses via breaches, OSINT, and replies — MFA and process still required', 'Obscurity replaces DMARC', 'Never use email'], 1, 'Defense in depth.', 'harvester', 35)
    ],
    69: [
        q('Attacker traffic via Tor/VPN to your VPN portal. Detection stance?', ['Tor users are always innocent staff', 'Enrich with threat context; require stronger auth; monitor impossible travel; do not block blindly without policy', 'Ban all remote work', 'Disable MFA for Tor exits'], 1, 'Anonymity networks complicate attribution — raise assurance.', 'tor', 40),
        q('Why “we traced the IP, call the police on that cafe” can fail?', ['IPs never lie', 'Proxies/Tor/VPNs break naive attribution — preserve evidence; use lawful process; focus on your controls', 'Cafe owners are always attackers', 'GeoIP is courtroom-perfect'], 1, 'Attribution is hard; containment is local.', 'tor', 40)
    ],
    71: [
        q('Learner wants to “practice exploits” on random .za sites. Coaching?', ['Encourage real victims', 'Only owned/authorized labs — unauthorized exploitation is illegal', 'OK under 1MB traffic', 'Fine if for a degree'], 1, 'Authorization defines legality.', 'exploitdev', 35),
        q('Defensive value of exploit-dev literacy?', ['To attack competitors', 'Understand memory corruption classes to prioritize patching and mitigations (ASLR/DEP/CFG)', 'Replace patching', 'Only for malware authors'], 1, 'Literacy improves defense prioritization.', 'exploitdev', 40)
    ],
    72: [
        q('Classic stack overflow against an unpatched service. Mitigation stack?', ['Hope', 'Patch + memory protections + least exposure + monitoring crashes/anomalies', 'Disable NX only', 'Give service Domain Admin'], 1, 'Mitigations raise cost; patching removes the bug.', 'bof', 40),
        q('Why crash storms on a legacy listener deserve tickets?', ['Crashes are healthy', 'May indicate probing/exploitation attempts — investigate exposure and patch status', 'Ignore UDP forever', 'Only restart nightly'], 1, 'Anomalies can be attack signal.', 'bof', 35)
    ],
    73: [
        q('Ghidra used to reverse a suspicious internal binary. Defender goal?', ['Ship it to production faster', 'Understand capabilities (C2, persistence, crypto) to write detections and IR steps', 'Ignore static analysis', 'Only trust filenames'], 1, 'RE informs hunting and response.', 'ghidra', 40),
        q('Safe handling rule for unknown malware samples?', ['Open on your laptop', 'Isolated lab, no production creds, controlled network, evidence integrity', 'Email to friends for help', 'Upload secrets into the sample folder'], 1, 'Analysis hygiene prevents self-infection.', 'ghidra', 35)
    ],
    76: [
        q('“Ransomware builder” kits lower affiliate skill. Defender implication?', ['Only elites ransomware now', 'Volume of competent-enough attacks rises — backups, identity tiering, and EDR isolation matter more', 'Builders cannot encrypt', 'Ignore affiliates'], 1, 'Industrialization increases odds.', 'ransom_tools', 40),
        q('Affiliate checklist often includes backup destruction. Control?', ['Online NAS on same VLAN only', 'Immutable/offline backups + restore drills + stop domain-wide admin blast radius', 'Pay every ransom as policy', 'Disable EDR'], 1, 'Recoverability breaks extortion math.', 'ransom_tools', 40)
    ],
    77: [
        q('Initial access broker sells VPN creds to your tenant. Signal family?', ['Always new zero-day', 'Credential theft/reuse markets — monitor dark-web/intel, force resets, MFA, hunt sessions', 'Brokers only sell printers', 'Ignore marketplace chatter'], 1, 'IABs monetize your weak identity.', 'iab', 40),
        q('Best reduction of broker value against your org?', ['Longer usernames', 'Phishing-resistant MFA, no shared VPN passwords, rapid revoke, attack-surface reduction', 'Publish VPN hostnames widely', 'Disable logging'], 1, 'Make stolen passwords insufficient.', 'iab', 35)
    ],
    82: [
        q('Packed binary + process hollowing + log clearing combo. Theme?', ['Benign updater', 'Defense evasion — focus on behavior and log integrity, not one hash', 'Only AV signatures', 'Disable Sysmon to reduce noise'], 1, 'Evasion targets your visibility.', 'evasion', 40),
        q('Which control most resists “disable EDR” attempts?', ['Honor attacker requests', 'Earned admin reduction, tamper protection, monitored uninstall, PAW for admin work', 'Run EDR as a user-mode toy only', 'Give local admin to everyone'], 1, 'Protect the sensors.', 'evasion', 40)
    ],
    83: [
        q('Slow HTTPS exfil to rare cloud bucket blended with SaaS. Hunt approach?', ['Ignore HTTPS', 'Volume/destination rarity + identity context + DLP; baseline legitimate SaaS', 'Block all cloud forever', 'Only watch USB'], 1, 'Exfil hides in allowed channels.', 'exfil', 40),
        q('DNS tunneling when HTTP is watched. Response pattern?', ['Disable DNS company-wide', 'Central resolvers, detect entropy/cadence, isolate host, correlate EDR', 'Ignore DNS', 'Only monitor port 25'], 1, 'Covert channels need DNS visibility.', 'exfil', 40)
    ],
    87: [
        q('Adversarial ML example fools a fraud model. Security framing?', ['Only academic', 'Model integrity and monitoring are controls — treat evasion like other bypasses', 'Retrain never', 'Disable fraud checks'], 1, 'ML systems can be attacked as systems.', 'advml', 40),
        q('Poisoned training data risk?', ['None if cloud-hosted', 'Biased/backdoored models — govern data pipelines and evaluation', 'More data always safer blindly', 'Ignore provenance'], 1, 'Garbage/poison in → failure out.', 'advml', 35)
    ],
    89: [
        q('Container escape via privileged pod + host mount. Root cause?', ['Kubernetes magic immunity', 'Dangerous workload privileges and mounts — tighten SCC/PSP equivalents and policy', 'Only affects Windows', 'Alpine images cannot escape'], 1, 'Escape is misconfig more than sorcery.', 'ctr_escape', 40),
        q('Best baseline to reduce escape impact?', ['docker.sock in every pod', 'Non-root, no privileged, read-only FS where possible, no host mounts, least capabilities', 'Cluster-admin in all pods', 'Disable audit logs'], 1, 'Least privilege workloads.', 'ctr_escape', 35)
    ],
    91: [
        q('Mobile implant framework after sideloaded “update.” First moves?', ['Ignore mobile', 'Isolate device/account; revoke sessions; MDM wipe/restrict; hunt related accounts', 'Only change wallpaper', 'Factory reset without noting evidence needs'], 1, 'Mobile footholds reach mail and MFA.', 'mobile_atk', 40),
        q('Enterprise control vs sideload risk?', ['Allow unknown sources for all', 'Managed devices/app stores, MAM, phishing-resistant auth, separate work profiles', 'BYOD unmanaged for Tier-0', 'SMS OTP forever as only control'], 1, 'Manage the work surface.', 'mobile_atk', 35)
    ],
    92: [
        q('BadUSB presenting as keyboard types a malicious payload. User coaching?', ['Plug any found USB', 'Do not plug unknown devices; use allowlisting; report drops; hardware write-block where needed', 'USB is always storage only', 'Disable all USB including mice permanently without plan'], 1, 'USB can be a keyboard attacker.', 'usb', 40),
        q('Best technical reduction for BadUSB on Finance PCs?', ['Unrestricted USB', 'Device control / allowlisting; disable HID where policy allows; physical security of ports', 'Require USB for all auth', 'Trust branded cables only by logo'], 1, 'Control device classes.', 'usb', 35)
    ],
    93: [
        q('Modbus/unauthenticated OT write reachable from IT. Priority framing?', ['Confidentiality first always', 'Safety/availability — segment, monitor carefully, vendor access control, no reckless scanning', 'Portscan every PLC weekly from prod', 'Put PLCs on the guest Wi-Fi'], 1, 'OT protocols often lack modern auth.', 'ot_attack', 45),
        q('Why “just patch the PLC tomorrow” can be wrong mid-incident?', ['Patches are never needed', 'Change windows and safety validation matter — contain paths first; plan controlled updates', 'OT never needs updates', 'Always pull power without SOP'], 1, 'OT change discipline saves lives and uptime.', 'ot_attack', 40)
    ],
    94: [
        q('Chat shows “fullz,” “drops,” “cashout.” Defender value?', ['Ignore slang', 'Recognize underground economy language to triage intel and explain risk to leadership', 'Use slang in customer emails', 'Only memorize tool names'], 1, 'Language literacy aids intel.', 'attacker_lang', 35),
        q('Affiliate talks “initial access” then “exfil before encrypt.” Translate for execs?', ['Random gaming chat', 'Criminal supply chain: buy foothold, steal data, then ransomware for leverage', 'Only IT jargon', 'Harmless roleplay always'], 1, 'Translate markets into business risk.', 'attacker_lang', 40)
    ]
};

const TIER_C_EXTRAS = {
    6: { why: 'IoT expands attack surface with weak defaults and long lifecycles.', concepts: ['Default credentials', 'Segmentation from ERP/AD', 'Inventory and exposure management'], prevent: ['Change defaults', 'Isolate IoT VLANs', 'Remove internet exposure'], caseStudy: 'A public NVR with admin/admin became a foothold into a flat LAN — segmentation stopped the next hop.', futureScenario: 'Cheap cameras will keep shipping insecure; architecture must assume compromise.' },
    13: { why: 'Wireless is a physical-adjacent network edge attackers love.', concepts: ['Evil twin / captive portals', 'Guest isolation', 'Enterprise 802.1X'], prevent: ['Separate guest', 'Prefer ZTNA/VPN off untrusted Wi-Fi', 'Detect rogues'], caseStudy: 'An evil twin outside HQ harvested VPN passwords until 802.1X and reporting drills landed.', futureScenario: 'Public Wi-Fi will stay hostile; device trust matters more than SSID names.' },
    26: { why: 'Serverless moves servers out of sight — not privilege out of reach.', concepts: ['Function IAM roles', 'Public triggers', 'Secrets in env vars'], prevent: ['Least privilege roles', 'Private triggers where possible', 'Vault secrets'], caseStudy: 'A public function with admin role minted keys overnight — role cut to read-only DB access.', futureScenario: 'AI-generated functions will need the same IAM discipline.' },
    28: { why: 'Quantum risk is a migration program, not a single weekend panic.', concepts: ['Harvest-now-decrypt-later', 'Crypto agility', 'Inventory of long-lived protected data'], prevent: ['Track PQC standards', 'Prefer agility in designs', 'Protect archives and keys'], caseStudy: 'A board brief reframed quantum as a multi-year crypto inventory — funding followed without hype.', futureScenario: 'PQC rollouts will break old clients; test early.' },
    29: { why: 'Blockchain security is key custody and code correctness under irreversible failure modes.', concepts: ['Smart contract bugs', 'Seed phrase handling', 'Wallet least privilege'], prevent: ['Audits', 'Hardware wallets for treasury', 'Monitoring drains'], caseStudy: 'A Slack-shared seed emptied a hot wallet — policy banned seed screenshots permanently.', futureScenario: 'Cross-chain bridges will remain high-value targets.' },
    33: { why: 'Ecommerce breaches often start in the browser supply chain or careless CHD storage.', concepts: ['Skimming scripts', 'CSP/SRI', 'PCI logging discipline'], prevent: ['Vendor vetting', 'Runtime page monitoring', 'Tokenization'], caseStudy: 'A third-party chat widget skimmed cards — CSP and script allowlisting closed the class.', futureScenario: 'Tag managers will stay a Magecart favorite without governance.' },
    35: { why: 'Physical access bypasses many logical controls.', concepts: ['Tailgating', 'Badge hygiene', 'USB drops'], prevent: ['Door controls + coaching', 'Device control', 'Server room dual control'], caseStudy: 'A parking-lot USB infected Finance; device control and coaching cut repeat incidents.', futureScenario: 'Hybrid offices will keep making badge sharing a soft target.' },
    44: { why: 'Mobile forensics races encryption, cloud sync, and legal process.', concepts: ['MDM telemetry', 'Rapid lawful seizure', 'Cloud backups as evidence'], prevent: ['MDM on work devices', 'Clear custody procedures', 'IdP correlation'], caseStudy: 'A wiped phone still left MDM and IdP trails that scoped insider exfil.', futureScenario: 'Work profiles and continuous auth will shape what you can recover.' },
    55: { why: 'Password cracking tools punish dumped hashes and weak patterns.', concepts: ['Offline attacks', 'Length vs complexity myths', 'Dump prevention'], prevent: ['Protect secrets stores', 'Passwordless/MFA', 'Unique service creds'], caseStudy: 'Cracked NTLM from a dump reused on VPN — passwordless for admins followed.', futureScenario: 'GPU economics will keep favoring attackers after theft.' },
    57: { why: 'Wireless offensive tooling turns weak PSKs into campus access.', concepts: ['Handshake capture', 'Evil twin adjacency', '802.1X migration'], prevent: ['Enterprise WLAN auth', 'Rogue detection', 'Segment corp SSIDs'], caseStudy: 'A cracked guest-bridged PSK reached printers on corp — isolation and 802.1X fixed it.', futureScenario: 'IoT Wi-Fi islands will need the same discipline.' },
    63: { why: 'Social engineering toolkits industrialize cloned logins on any network.', concepts: ['Unauthorized kits as incidents', 'MFA quality under phishing', 'ROE for purple'], prevent: ['Phishing-resistant MFA', 'Rapid report buttons', 'Authorized labs only'], caseStudy: 'An unauthorized SET clone on LAN forced resets and a ROE reset for the “curious admin.”', futureScenario: 'AI will personalize clones; process still wins.' },
    64: { why: 'Browser exploitation frameworks turn XSS into interactive attacker sessions.', concepts: ['Hooked browsers', 'Session theft', 'Admin browsing risk'], prevent: ['Fix XSS', 'CSP and cookie flags', 'Separate admin workstations'], caseStudy: 'A hooked intranet admin session showed why CSP debt is identity debt.', futureScenario: 'Browser agents will expand the hook surface.' },
    66: { why: 'OSINT is free reconnaissance — defenders should see it first.', concepts: ['Executive exposure', 'Vendor graphs', 'Ethical boundaries'], prevent: ['Reduce oversharing', 'VIP hardening', 'Brand monitoring'], caseStudy: 'A Maltego-like public graph of vendors predicted a spearphish path — awareness used real examples.', futureScenario: 'AI OSINT will scale personalization of BEC.' },
    67: { why: 'Email recon feeds spray and spearphish at industrial scale.', concepts: ['Crawlable addresses', 'Breach corpuses', 'VIP protections'], prevent: ['DMARC path', 'Reduce public mailboxes', 'Phishing-resistant MFA'], caseStudy: 'Harvester lists matched a later spray — lockouts and MFA gaps were closed.', futureScenario: 'More leaked corpuses will keep refreshing target lists.' },
    69: { why: 'Anonymity networks break naive IP attribution and raise assurance needs.', concepts: ['Tor/VPN ingress', 'Impossible travel', 'Evidence over cafe myths'], prevent: ['Stronger remote auth', 'Risk-based access', 'Preserve logs for lawful process'], caseStudy: 'Tor hits on VPN succeeded on a password-only account — passkeys ended the pattern.', futureScenario: 'Residential proxies will muddy attribution further.' },
    71: { why: 'Exploit development literacy helps prioritize patches and mitigations — not freelancing crime.', concepts: ['Authorization boundaries', 'Memory corruption classes', 'Mitigation stacks'], prevent: ['Owned labs only', 'Rapid patching of exposed services', 'Crash monitoring'], caseStudy: 'A learner’s unauthorized scan created legal exposure — curriculum now starts with law and labs.', futureScenario: 'AI-assisted exploit drafting will tempt shortcuts; ROE must be louder.' },
    72: { why: 'Buffer overflows still appear on legacy listeners and careless C code.', concepts: ['Memory safety mitigations', 'Exposure reduction', 'Crash as signal'], prevent: ['Patch', 'Remove internet reachability', 'Deploy ASLR/DEP/CFG where applicable'], caseStudy: 'Crash storms on a legacy agent preceded a successful exploit — the listener was finally retired.', futureScenario: 'Memory-safe rewrites will lag; exposure management remains critical.' },
    73: { why: 'Reverse engineering turns unknown binaries into detection and IR intelligence.', concepts: ['Capabilities mapping', 'Safe malware labs', 'Detection from behavior'], prevent: ['Isolated analysis', 'Share IOCs/TTPs with SOC', 'Never analyze on production endpoints'], caseStudy: 'Ghidra revealed a custom C2 path EDR missed — a network detection closed the gap.', futureScenario: 'Obfuscation will rise; hybrid static/dynamic analysis stays needed.' },
    76: { why: 'Ransomware builders turn affiliates into volume threats.', concepts: ['Exfil-before-encrypt', 'Backup destruction', 'Identity blast radius'], prevent: ['Immutable backups', 'EDR isolation drills', 'Tier admin'], caseStudy: 'Builder-based affiliates hit a peer SME; tested offline backups recovered operations in days.', futureScenario: 'Builders will keep lowering the skill floor.' },
    77: { why: 'Initial access brokers sell your footholds as products.', concepts: ['Stolen VPN/citrix creds', 'Marketplace intel', 'Session revoke speed'], prevent: ['Phishing-resistant MFA', 'Hunt leaked creds', 'Reduce exposed portals'], caseStudy: 'Broker chatter about a VPN account triggered resets before ransomware affiliates bought in.', futureScenario: 'Brokers will specialize by industry vertical.' },
    82: { why: 'Defense evasion is an attack on your sensors and judgment.', concepts: ['Packing/injection', 'Log clearing', 'EDR tamper'], prevent: ['Tamper protection', 'Least admin', 'Immutable log sinks'], caseStudy: 'Log clears on a jump host were the tell — intact remote logs saved the timeline.', futureScenario: 'Living-off-the-land evasion will stay the default.' },
    83: { why: 'Exfiltration prefers channels you already allow.', concepts: ['Cloud bucket slow bleed', 'DNS tunnels', 'DLP + baselines'], prevent: ['Destination controls', 'Detect rarity/volume', 'Encrypt-sensitive DLP'], caseStudy: 'SaaS-looking HTTPS exfil was caught by rare destination + unusual identity — DLP rules followed.', futureScenario: 'AI will camouflage exfil in normal SaaS patterns; identity context wins.' },
    87: { why: 'Adversarial ML attacks the model like any other bypassable control.', concepts: ['Evasion examples', 'Data poisoning', 'Pipeline governance'], prevent: ['Monitor model outputs', 'Secure training data', 'Human review on high impact'], caseStudy: 'Fraud model evasion prompted monitoring and a secondary rule layer — not blind trust in scores.', futureScenario: 'AI vs AI arms races will need governance, not vibes.' },
    89: { why: 'Container escapes punish privileged workloads and host mounts.', concepts: ['Privileged pods', 'HostPath/docker.sock', 'Policy engines'], prevent: ['Admission control', 'Non-root', 'No host mounts by default'], caseStudy: 'A privileged debug pod became a node compromise — policies banned the pattern.', futureScenario: 'AI ops bots requesting privileged debug will need guardrails.' },
    91: { why: 'Mobile attack frameworks follow sideloads and phishing into mail and MFA.', concepts: ['Sideload risk', 'Session revoke', 'MDM containment'], prevent: ['Managed app distribution', 'Work profiles', 'Passkeys'], caseStudy: 'A sideloaded “update” stole an inbox; MDM wipe + IdP revoke contained it.', futureScenario: 'Mobile deepfake calls will pair with device implants.' },
    92: { why: 'USB attack tools abuse trust in peripherals.', concepts: ['BadUSB HID', 'Drop attacks', 'Device allowlisting'], prevent: ['Device control', 'User coaching', 'Physical port locks where needed'], caseStudy: 'A “forgot USB” typed a payload in Finance — HID allowlisting ended the class.', futureScenario: 'Cable-chip implants will stay a high-trust-environment risk.' },
    93: { why: 'OT protocols often assume trusted networks — flat IT/OT breaks that assumption.', concepts: ['Unauthenticated writes', 'Safety-first IR', 'Vendor remote access'], prevent: ['Segmentation', 'Controlled change windows', 'Monitor IT→OT paths'], caseStudy: 'An IT worm stopped at a new OT firewall — production kept running.', futureScenario: 'Remote vendor jump hosts will remain the soft door.' },
    94: { why: 'Attacker slang is a map of the criminal economy — useful for intel literacy.', concepts: ['Markets and roles', 'Affiliate language', 'Exec translation'], prevent: ['Train analysts on jargon', 'Tie slang to ATT&CK stories', 'Avoid glamorizing crime'], caseStudy: 'Recognizing “exfil before encrypt” in chat intel funded backup immutability the same quarter.', futureScenario: 'AI will invent new slang; underlying business models will rhyme.' }
};

const TIER_C_ESSAYS = {
    6: [essay('Design an IoT segmentation and default-credential eradication plan for a retail chain.', 'Inventory, VLANs, exposure removal, owners.')],
    13: [essay('Write a staff guide for evil twin Wi-Fi near HQ and the technical migration to 802.1X.', 'Reporting + enterprise auth + guest isolation.')],
    26: [essay('Harden a public-triggered serverless function that currently uses an admin role.', 'Least privilege, secrets, logging, private alternatives.')],
    28: [essay('Board one-pager: harvest-now-decrypt-later and a 24-month crypto-agility plan.', 'No panic; inventory; owners; milestones.')],
    33: [essay('Magecart response runbook for ecommerce: detect, contain, PCI/privacy tracks.', 'Script allowlisting, CSP, notification assessment.')],
    35: [essay('Physical + logical IR checklist after tailgating into a server room.', 'Badges, CCTV, console/VPN hunt.')],
    44: [essay('Mobile evidence plan for an MDM-managed phone in an insider case.', 'Lawful process, MDM/IdP sources, custody.')],
    57: [essay('Wireless hardening proposal after a cracked PSK incident.', '802.1X, rogue detection, segmentation.')],
    64: [essay('AppSec + SOC joint response to a browser-hooked admin session.', 'XSS fix, session revoke, CSP, admin PAW browsing.')],
    69: [essay('Explain to executives why Tor-sourced VPN logins break cafe-IP attribution myths.', 'Assurance controls + lawful process.')],
    76: [essay('Translate ransomware-builder industrialization into budget asks: backups, identity, EDR.', 'Recoverability metrics.')],
    77: [essay('Playbook when intel says an IAB is selling your VPN accounts.', 'Reset, MFA, hunt sessions, reduce portal exposure.')],
    82: [essay('Detection strategy against defense evasion: packing, injection, log clears, EDR tamper.', 'Tamper protect + immutable logs.')],
    83: [essay('Exfil hunt guide for slow HTTPS to rare cloud and DNS tunneling.', 'Baselines, rarity, isolation.')],
    89: [essay('Kubernetes admission policy set to prevent container escape class issues.', 'No privileged, no host mounts, non-root.')],
    92: [essay('Finance USB device-control policy that blocks BadUSB without breaking scanners.', 'Allowlisting, coaching, exceptions.')],
    93: [essay('IT/OT tabletop: worm in IT approaching unauthenticated Modbus network.', 'Safety first, segment, no reckless scans.')],
    94: [essay('Glossary memo for leadership: IAB, fullz, affiliate, exfil-before-encrypt — mapped to controls.', 'Business language, not edgy slang.')]
};

function getTierCEssays(moduleId) {
    return TIER_C_ESSAYS[moduleId] || null;
}

module.exports = {
    TIER_C_QUESTIONS,
    TIER_C_EXTRAS,
    TIER_C_ESSAYS,
    getTierCEssays
};
