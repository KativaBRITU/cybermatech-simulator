/**
 * Engaging definition + summary for every catalog module (1–95).
 * Used in study guides, resource center, and essay relevance scoring.
 */

'use strict';

const { ATTACKER_TOOLKIT_MODULES } = require('./attackerToolkitModules');

const CORE = {
    1: {
        definition: 'Phishing detection is the skill of spotting deceptive messages that steal credentials, money, or access.',
        summary: 'Train your eye for spoofed senders, urgency traps, and fake login pages — the attacks that hit African inboxes and WhatsApp every day.',
        hook: 'One convincing email can empty a finance desk in minutes.'
    },
    2: {
        definition: 'Malware analysis is the disciplined study of malicious files and behavior to understand impact and containment.',
        summary: 'Learn to triage suspicious attachments, recognize families like trojans and droppers, and decide isolate-vs-analyze without panic.',
        hook: 'Analysts who understand malware stop outbreaks before they become ransom days.'
    },
    3: {
        definition: 'Network security protects data in motion and at rest across LANs, WANs, and remote access paths.',
        summary: 'Segmentation, firewalls, VPN hygiene, and monitoring — how to keep lateral movement expensive for attackers.',
        hook: 'Most breaches cross the network you already own.'
    },
    4: {
        definition: 'Cloud security governs identity, configuration, and data in shared-responsibility environments (AWS, Azure, GCP).',
        summary: 'Misconfigured buckets and over-privileged IAM roles cause more cloud incidents than exotic zero-days.',
        hook: 'Your perimeter is now an API key.'
    },
    5: {
        definition: 'Mobile security protects smartphones and tablets used as primary banking and work devices across Africa.',
        summary: 'SIM swap, sideloaded apps, and smishing target mobile-first users — lock down devices like pocket data centers.',
        hook: 'For many users, the phone is the only computer that matters.'
    },
    6: {
        definition: 'IoT security covers cameras, sensors, and smart devices that often ship with default passwords and no patches.',
        summary: 'Inventory shadow IoT, segment guest networks, and stop botnets from recruiting your CCTV.',
        hook: 'Unpatched gadgets become the back door nobody monitors.'
    },
    7: {
        definition: 'Social engineering exploits human trust through pretext, authority, urgency, and channel-hopping (email + WhatsApp).',
        summary: 'Move beyond posters — practice verification habits that survive BEC, vishing, and deepfake pressure.',
        hook: 'Attackers hack people when technology holds.'
    },
    8: {
        definition: 'Incident response is the structured process to contain, eradicate, and recover from security events.',
        summary: 'Run the NIST-style loop under time pressure: who owns the ticket, what gets isolated first, what evidence survives.',
        hook: 'The first hour decides whether an incident becomes a crisis.'
    },
    9: {
        definition: 'Security compliance maps controls to laws, contracts, and frameworks auditors expect to see evidenced.',
        summary: 'Translate policies into daily habits — not checkbox theater — for regulators and boards.',
        hook: 'Compliance is proof, not a poster on the wall.'
    },
    10: {
        definition: 'Ethical hacking uses authorized testing to find weaknesses before criminals do.',
        summary: 'Scope, rules of engagement, and reporting — how red-team mindset serves blue-team defense.',
        hook: 'Permission and documentation separate professionals from criminals.'
    },
    11: {
        definition: 'Ransomware defense combines prevention, detection, backup integrity, and recovery without paying as a strategy.',
        summary: 'Practice containment when encryption starts, test restores, and protect backup paths from deletion.',
        hook: 'Backups you cannot restore are just expensive hope.'
    },
    12: {
        definition: 'Data privacy (GDPR and African DP regimes) governs lawful collection, retention, and breach notification.',
        summary: 'Know data-subject rights, lawful bases, and the legal clock when personal data leaks.',
        hook: 'Privacy failures have legal deadlines, not just technical ones.'
    },
    13: {
        definition: 'Wireless security protects Wi‑Fi, guest networks, and rogue access points in offices and campuses.',
        summary: 'WPA3, segmentation, and rogue AP hunts — stop attackers from parking in your airspace.',
        hook: 'Free Wi‑Fi is often the most expensive connection you make.'
    },
    14: {
        definition: 'Database security protects structured data stores from injection, over-privileged accounts, and exfiltration.',
        summary: 'Least privilege, encryption at rest, and query monitoring for the systems holding customer records.',
        hook: 'One over-privileged DB account can export the whole business.'
    },
    15: {
        definition: 'DevSecOps embeds security into CI/CD so vulnerabilities are caught before production.',
        summary: 'Shift-left scanning, secrets management, and pipeline gates for teams shipping fast.',
        hook: 'Fixing a bug in Git is cheaper than fixing it in production at 2 a.m.'
    },
    16: {
        definition: 'Digital forensics preserves and analyzes digital evidence with chain-of-custody discipline.',
        summary: 'Image disks, build timelines, and document tools so findings hold up in HR or legal proceedings.',
        hook: 'Wiped logs tell a story too — usually the wrong one.'
    },
    17: {
        definition: 'Threat intelligence turns indicators and adversary reports into actionable detection and prioritization.',
        summary: 'Consume feeds wisely, map to ATT&CK, and focus on threats relevant to your sector and region.',
        hook: 'Intelligence without action is expensive noise.'
    },
    18: {
        definition: 'Security Operations (SOC) is the 24/7 correlation of alerts, tickets, and escalation to contain harm.',
        summary: 'Shift work, SIEM triage, and handover quality — how operations floors actually stop breaches.',
        hook: 'SOC analysts win by reducing blast radius, not by panic-closing tickets.'
    },
    19: {
        definition: 'Identity and Access Management (IAM) governs who gets which access, for how long, and with what proof.',
        summary: 'MFA, lifecycle joins/moves/leaves, and privilege reviews — identity is the new perimeter.',
        hook: 'Stolen credentials are the most reusable weapon in cybercrime.'
    },
    20: {
        definition: 'Cryptography protects confidentiality and integrity through algorithms, keys, and protocol choices.',
        summary: 'TLS, hashing, key management, and when crypto fails because of implementation, not math.',
        hook: 'Bad crypto deployment beats good math every time.'
    },
    21: {
        definition: 'Zero Trust Architecture assumes breach and verifies every request regardless of network location.',
        summary: 'Micro-segmentation, continuous validation, and least privilege for hybrid African enterprises.',
        hook: '“Inside the firewall” is not a trust relationship anymore.'
    },
    22: {
        definition: 'Supply chain security assesses vendor, software, and update integrity before trust is granted.',
        summary: 'Third-party risk, SBOM awareness, and signing — when your vendor becomes your attacker.',
        hook: 'You inherit your suppliers’ security failures.'
    },
    23: {
        definition: 'API security protects programmatic interfaces that expose business logic at scale.',
        summary: 'AuthZ flaws, excessive data exposure, and rate limits — APIs are the fast lane for data theft.',
        hook: 'Broken object-level authorization still tops API incident lists.'
    },
    24: {
        definition: 'Container security hardens images, runtimes, and orchestration for Docker-style workloads.',
        summary: 'Scan images, restrict capabilities, and protect the host from container escape paths.',
        hook: 'A single privileged container can own the node.'
    },
    25: {
        definition: 'Kubernetes security governs clusters, RBAC, network policies, and secrets for container orchestration.',
        summary: 'Stop public dashboards, tighten service accounts, and audit admission controls.',
        hook: 'K8s misconfigurations scale mistakes cluster-wide.'
    },
    26: {
        definition: 'Serverless security addresses event-driven functions, permissions, and ephemeral attack surface.',
        summary: 'Function IAM, injection in triggers, and logging for invisible infrastructure.',
        hook: 'No server to patch does not mean no server to breach.'
    },
    27: {
        definition: 'AI & ML security covers model abuse, prompt injection, data leakage, and supply-chain risk in AI systems.',
        summary: 'Tool boundaries, training data hygiene, and adversarial inputs for the AI era.',
        hook: 'Your chatbot can become an exfiltration channel if tools are over-privileged.'
    },
    28: {
        definition: 'Quantum computing threats focus on harvest-now-decrypt-later and crypto-agility planning.',
        summary: 'Inventory long-lived secrets and plan transitions before asymmetric crypto weakens.',
        hook: 'Some adversaries store encrypted traffic for future decryption.'
    },
    29: {
        definition: 'Blockchain security addresses smart-contract flaws, wallet compromise, and consensus abuse.',
        summary: 'Key custody, audit patterns, and scam awareness for fintech and Web3 curiosity.',
        hook: 'Irreversible transactions mean irreversible mistakes.'
    },
    30: {
        definition: 'OT/ICS security protects industrial control systems where safety and availability dominate confidentiality.',
        summary: 'Segment plant networks, monitor Modbus/DNP3 anomalies, and plan failsafe recovery.',
        hook: 'A tripped plant can hurt people, not just spreadsheets.'
    },
    31: {
        definition: 'Healthcare security (HIPAA-style) protects patient data and clinical system availability.',
        summary: 'PHI handling, access logging, and ransomware response for hospitals and clinics.',
        hook: 'Medical records are worth more on criminal markets than credit cards.'
    },
    32: {
        definition: 'Financial security (PCI-DSS) protects cardholder data and payment processing environments.',
        summary: 'Segmentation, tokenization, and monitoring for banks, fintech, and merchants.',
        hook: 'Payment data attracts organized crime — design controls accordingly.'
    },
    33: {
        definition: 'E-commerce security protects online storefronts, checkout flows, and customer accounts.',
        summary: 'Cart fraud, account takeover, and skimming — defend revenue and reputation.',
        hook: 'Checkout is where trust and money meet attackers.'
    },
    34: {
        definition: 'Insider threat detection identifies risky behavior from employees, contractors, and partners.',
        summary: 'UEBA signals, exit procedures, and culture that rewards reporting without shame.',
        hook: 'Trusted insiders bypass perimeter defenses by design.'
    },
    35: {
        definition: 'Physical security integration aligns badges, CCTV, and cyber access for defense in depth.',
        summary: 'Tailgating, server-room access, and aligning physical events with logical logs.',
        hook: 'The best firewall fails if the door stays propped open.'
    },
    36: {
        definition: 'Disaster recovery & BCP ensure organizations survive outages, ransomware, and regional failures.',
        summary: 'RTO/RPO targets, tested restores, and comms plans when primary sites fail.',
        hook: 'Untested backups are a plan written in fiction.'
    },
    37: {
        definition: 'Security awareness training builds repeatable human defenses against scams and unsafe habits.',
        summary: 'Positive reporting culture, micro-learning, and drills that mirror WhatsApp-first fraud.',
        hook: 'Awareness that shames users fails; awareness that empowers them wins.'
    },
    38: {
        definition: 'Risk management prioritizes controls using likelihood, impact, and treatment decisions.',
        summary: 'Risk registers, exceptions with expiry, and language boards understand.',
        hook: 'You cannot fix everything — you must fix what matters most.'
    },
    39: {
        definition: 'Vulnerability management finds, prioritizes, and remediates flaws before exploitation.',
        summary: 'Scanning cadence, patch SLAs, and compensating controls when fixes lag.',
        hook: 'Unpatched critical CVEs are invitations with timestamps.'
    },
    40: {
        definition: 'Penetration testing simulates attacker techniques under contract to validate real-world exposure.',
        summary: 'Scope, safety rails, and actionable reports — not checkbox scans.',
        hook: 'A pentest tells you what attackers would actually try first.'
    },
    41: {
        definition: 'Red Team / Blue Team exercises pit offensive simulation against defensive detection and response.',
        summary: 'Purple-team loops that improve controls, not just scores on a slide.',
        hook: 'Teams that never get tested are teams that only hope they are ready.'
    },
    42: {
        definition: 'Cybersecurity frameworks (NIST, ISO 27001, CIS) provide structured control libraries and assurance language.',
        summary: 'Pick a framework, map controls, and evidence — avoid framework tourism without implementation.',
        hook: 'Frameworks are maps; your organization still has to walk the terrain.'
    },
    43: {
        definition: 'Cloud forensics collects and analyzes evidence across SaaS, IaaS, and hybrid logs.',
        summary: 'Cloud API trails, shared custody, and rapid containment when instances are ephemeral.',
        hook: 'The crime scene disappears when you terminate the VM without snapshots.'
    },
    44: {
        definition: 'Mobile forensics extracts and analyzes data from smartphones under legal and technical constraints.',
        summary: 'Acquisition, encryption hurdles, and messaging artifacts for investigations.',
        hook: 'Phones hold the story of modern fraud — if preserved correctly.'
    },
    45: {
        definition: 'Cyber law & ethics covers authorized testing, evidence admissibility, and professional duty of care.',
        summary: 'Know what requires written permission, what crosses criminal lines, and how to document decisions.',
        hook: 'Curiosity without authorization is a career-ending mistake.'
    }
};

const TOOLKIT_DEFS = {
    nmap: ['Network mapping discovers live hosts, open ports, and services adversaries recon first.', 'See scans like an attacker, then harden exposure and detection.'],
    wireshark: ['Packet analysis inspects traffic to validate hypotheses during incidents.', 'Follow TCP streams and spot C2 beaconing without guessing.'],
    metasploit: ['Metasploit awareness teaches exploit modules and post-exploitation chains defenders must recognize.', 'Know the framework so EDR rules target behavior, not just filenames.'],
    burp: ['Burp Suite maps web attack paths — auth, session, and injection flaws at scale.', 'Think like a web attacker to prioritize fixes developers will accept.'],
    sqlmap: ['SQL injection tooling automates database takeover via flawed queries.', 'Defenders learn input validation, WAF limits, and DB least privilege.'],
    mimikatz: ['Credential theft from memory remains a dominant AD attack pattern.', 'Detect LSASS access and enforce Credential Guard where possible.'],
    cobalt: ['Cobalt Strike is the benchmark C2 platform blue teams must signature behaviorally.', 'Recognize beacons, malleable profiles, and lateral staging.'],
    c2: ['Command-and-control frameworks (Empire, Sliver) orchestrate post-exploitation at scale.', 'Hunt for persistence and outbound callbacks, not just malware names.'],
    hashcat: ['Offline password cracking turns stolen hashes into usable credentials.', 'Enforce strong hashing, lockouts, and MFA to shrink cracking windows.'],
    john: ['John the Ripper patterns reveal weak corporate password choices.', 'Pair policy with breach detection and MFA.'],
    hydra: ['Online brute force targets exposed login surfaces and default credentials.', 'Rate limits, CAPTCHA, and lockouts are your first lines.'],
    aircrack: ['Wireless offensive ops crack weak Wi‑Fi keys and rogue AP setups.', 'Upgrade to WPA3, monitor airspace, and segment guest networks.'],
    bloodhound: ['BloodHound maps Active Directory attack paths to high-value targets.', 'Trim excessive privileges attackers graph automatically.'],
    kerberos: ['Kerberoasting and AS-REP roasting abuse ticket mechanics for offline cracks.', 'Strong service account passwords and monitoring ticket anomalies.'],
    pth: ['Pass-the-Hash and Pass-the-Ticket reuse credentials without knowing plaintext.', 'Tier admin accounts and limit lateral authentication.'],
    lolbins: ['Living-off-the-land binaries hide in signed Windows tools attackers abuse.', 'Behavioral detection beats blocking powershell.exe blindly.'],
    powershell: ['Offensive PowerShell tradecraft encodes downloaders and memory-only payloads.', 'Script block logging and constrained language where feasible.'],
    set: ['The Social Engineering Toolkit automates phishing and payload delivery demos.', 'Use awareness of SET to design anti-phishing controls and tests.'],
    beef: ['BeEF hooks browsers for post-exploitation via the user session.', 'Train users and deploy CSP, isolation, and egress controls.'],
    phishkit: ['Phishing kits are turnkey fake login sites sold to low-skill criminals.', 'Block lookalike domains and monitor brand abuse fast.'],
    osint: ['OSINT with Maltego and Recon-ng maps people, domains, and relationships.', 'Reduce public exposure and monitor impersonation.'],
    harvester: ['theHarvester collects emails and subdomains for pretexting and phishing.', 'Minimize published contact paths and monitor new subdomains.'],
    shodan: ['Shodan and Censys index internet-facing assets attackers query first.', 'Continuous attack surface management beats annual pen tests alone.'],
    tor: ['Tor and proxies obscure attacker attribution and host illegal services.', 'Detect outbound Tor where policy forbids it; investigate anomalies.'],
    dnstunnel: ['DNS tunneling exfiltrates data through a protocol firewalls often allow.', 'DNS logging and anomaly detection catch slow exfil channels.'],
    exploitdev: ['Exploit development basics explain memory corruption and shellcode concepts.', 'Patch, ASLR, DEP, and sandboxing reduce exploit reliability.'],
    bof: ['Buffer overflows overwrite memory to hijack execution — classic but still taught.', 'Safe coding and compiler mitigations are the defense story.'],
    ghidra: ['Ghidra reverse-engineering reveals what suspicious binaries actually do.', 'Analysts extract IOCs and behavior without running malware live.'],
    volatility: ['Volatility analyzes memory dumps for hidden processes and injected code.', 'Preserve RAM early in incidents before reboot destroys evidence.'],
    yara: ['YARA rules hunt files and memory with pattern signatures threat teams share.', 'Write rules for families targeting your sector, not generic noise.'],
    ransomtools: ['Ransomware builders lower the bar for affiliate crime programs.', 'Segmentation and immutable backups break the builder business model.'],
    iab: ['Initial access brokers sell footholds — the marketplace behind many ransomware hits.', 'Patch edge services and monitor for sold access patterns.'],
    webshell: ['Web shells persist on compromised servers for remote command execution.', 'File integrity monitoring and WAF rules catch upload paths.'],
    lateral: ['Lateral movement tooling spreads compromise across the estate.', 'East-west segmentation and tiered admin contain spread.'],
    privesc: ['Privilege escalation elevates footholds to admin — the pivot point of most attacks.', 'Patch locally, restrict admin tokens, and audit misconfigurations.'],
    persist: ['Persistence mechanisms survive reboots — scheduled tasks, services, registry keys.', 'Baseline autoruns and hunt for new persistence after incidents.'],
    evasion: ['Defense evasion obfuscates payloads and disables security tools.', 'Tamper protection and behavioral analytics resist blind disablement.'],
    exfil: ['Exfiltration channels bypass DLP via cloud sync, DNS, and encrypted tunnels.', 'Egress filtering and user behavior analytics catch slow leaks.'],
    attack: ['MITRE ATT&CK maps tools and techniques to a shared defensive language.', 'Build detections and tabletop scenarios from technique IDs, not vendor names.'],
    emulation: ['Adversary emulation plans purple-team tests that prove controls work.', 'Test hypotheses with safety rails and measurable outcomes.'],
    deepfake: ['Deepfake and AI voice clones weaponize authority in BEC and helpdesk fraud.', 'Out-of-band verification beats trusting video or voice alone.'],
    advml: ['Adversarial ML attacks poison models and evade classifiers.', 'Validate training data and monitor model drift in production.'],
    cloudcred: ['Cloud credential theft targets keys in repos, metadata, and stolen laptops.', 'Short-lived credentials and secret scanning in CI prevent static keys.'],
    ctrlescape: ['Container escape breaks isolation to reach the host kernel.', 'Non-root containers, seccomp, and patched runtimes reduce escape odds.'],
    supplypoison: ['Supply-chain poisoning inserts malicious code into dependencies and updates.', 'Verify signatures, pin versions, and monitor package registries.'],
    mobileatk: ['Mobile attack frameworks target sideloading, MDM gaps, and device theft.', 'MDM, encryption, and remote wipe for lost devices.'],
    usbattack: ['USB attacks range from BadUSB to HID keystroke injection.', 'Port control policies and user discipline at shared workstations.'],
    otattack: ['OT protocol attacks target Modbus, DNP3, and legacy plant gear.', 'Segment OT, monitor engineering workstations, and plan safe failsafe modes.'],
    attackerlang: ['Attacker language and social cues reveal tradecraft in chats and forums.', 'Threat hunters recognize slang tied to markets and affiliate programs.'],
    purple: ['Purple team correlation labs connect offensive emulation to defensive detection gaps.', 'Close the loop with measurable control improvements each sprint.']
};

function toolkitEntry(mod) {
    const key = mod.icon_key || 'attack';
    const pair = TOOLKIT_DEFS[key] || [
        `${mod.name} teaches defender recognition of adversary tooling and tradecraft.`,
        `Study how operators abuse ${mod.name} so your SOC can detect behavior, not buzzwords.`
    ];
    return {
        definition: pair[0],
        summary: pair[1],
        hook: 'Know the enemy’s tools to design controls that actually fire.'
    };
}

function getModuleDefinition(moduleOrId) {
    const mod = typeof moduleOrId === 'object'
        ? moduleOrId
        : { id: moduleOrId, name: `Module ${moduleOrId}`, category: 'network' };
    if (CORE[mod.id]) return { id: mod.id, name: mod.name, ...CORE[mod.id] };
    return { id: mod.id, name: mod.name, ...toolkitEntry(mod) };
}

function getAllDefinitions() {
    const coreIds = Object.keys(CORE).map(Number);
    const toolkit = ATTACKER_TOOLKIT_MODULES.map((m) => getModuleDefinition(m));
    const core = coreIds.map((id) => getModuleDefinition({ id, name: CORE[id] ? `Module ${id}` : '' }));
    return [...core, ...toolkit.filter((t) => !coreIds.includes(t.id))];
}

function moduleKeywords(module) {
    const def = getModuleDefinition(module);
    const words = new Set();
    tokenize(def.definition).concat(tokenize(def.summary), tokenize(module.name)).forEach((w) => {
        if (w.length > 3) words.add(w);
    });
    return [...words];
}

function tokenize(text) {
    return String(text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

module.exports = {
    CORE,
    getModuleDefinition,
    getAllDefinitions,
    moduleKeywords
};
