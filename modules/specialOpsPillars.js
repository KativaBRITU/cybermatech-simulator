/**
 * Special Ops modules 96 (red cell) and 97 (blue cell).
 * Four-pillar curriculum: adversary language, hunt, purple loop, rules of engagement.
 * Evidence Workbench / study judgment only — not a pentest gym, VM range, or exploit runbook.
 */

function q(question, options, correct, explanation, topic, time_expected = 42) {
    return { question, options, correct, explanation, topic, time_expected };
}

function essay(question, guidelines) {
    return { question, guidelines };
}

const RED_EXTRAS = {
    why:
        'Special Ops Red is authorized adversary-language training: how operators move and talk, which ATT&CK techniques they chain, and which artifacts a SOC should expect. TRIBAMS does not run live exploits, Kali ranges, or unscoped tooling. You rehearse judgment on artifacts and written rules of engagement.',
    concepts: [
        'Know the enemy by how they move and talk — tooling families, slang, and attack chains mapped to ATT&CK, not brand names alone',
        'Tool purpose, typical operator workflow, and tell-tale artifacts in logs and EDR (process tree, DNS, beacon cadence, credential-store access)',
        'Map techniques to ATT&CK so local SOCs share a common language (for example credential access vs lateral movement)',
        'Popular frameworks leave detectable footprints when you know what to hunt — odd DNS, repetitive outbound timing, LSASS-class access',
        'Those footprints look the same on African SME logs as on a global SOC floor: commodity hardware, living-off-the-land binaries, identity abuse',
        'Purple-team skill: describe the technique, then prove a detection and a response — without executing it on systems you do not own',
        'Chain thinking: initial access → execution → persistence → lateral movement — break the river at the cheapest control',
        'Safe study vs illegal misuse — written authorization and scope are the legal firewall; TRIBAMS trains defense and purple-team awareness only'
    ],
    prevent: [
        'Use MITRE ATT&CK Navigator conceptually to heat-map a named cluster (for example a ransomware affiliate set) against your hypothetical assets — visualize coverage gaps, do not emulate the cluster on the internet',
        'For every tool family you study, name the workflow step it serves (recon, delivery, install, C2, objectives) and the log source that would show it',
        'Hunt behaviors in Evidence Workbench artifacts: unusual DNS length/entropy, metronomic outbound connections, credential-store process access — not a shopping list of malware names',
        'Treat living-off-the-land (signed admin binaries used at odd hours) as a detection problem, not a signature problem',
        'Never run offensive procedures on neighbor, campus, or production networks. Personal isolated labs and consented ranges stay outside this product',
        'A real engagement starts with written IP ranges, time windows, techniques in/out of scope, and an abort path'
    ],
    caseStudy:
        'A purple cell had written lab-only ROE. A red operator proposed “one production directory collect so the graph is real.” Blue held the paper: staging graph, detections tuned, findings ticketed. The win was authorization plus technique IDs on the report — not a cooler tool demo.',
    futureScenario:
        'An AI assistant proposes “just run the public atomic test on the office Wi-Fi so Sysmon lights up.” Mission-Ready answer: refuse. Study the ATT&CK page, score the workbench artifacts, write the detection logic, and keep the live fire in a consented lab you own.',
    essayQuestions: [
        essay(
            'Pick one ATT&CK technique (for example a PowerShell execution technique). In one page: what the technique is for, which operator-workflow step it serves, which artifacts a SOC should expect, and how you would stop and revoke access — without writing an exploit or live command sequence.',
            'Education-grade. Name the technique ID, the control that breaks the chain, and the evidence you would preserve. No attack procedures.'
        ),
        essay(
            'Draft a one-page rules of engagement for a TRIBAMS-style purple exercise: in-scope systems (lab only), out-of-scope (production, neighbors, internet scan), time window, abort criteria, and how findings become detections.',
            'Authorization is the product. If a step needs a real network, mark it out of product and point to consented labs only.'
        ),
        essay(
            'Translate three hunt ideas — odd DNS, repetitive outbound timing, credential-store access — into a SOC lead brief for an African SME with Sysmon-class logs and no full-time threat hunter.',
            'Behavioral anomalies, not malware brand names. State what you would ask the log source, not how to weaponize the tool.'
        )
    ]
};

const BLUE_EXTRAS = {
    why:
        'Special Ops Blue is the crisis-cell counterpart: contain, hunt, and brief while an intrusion story unfolds. You train the same four pillars from the defender’s desk — ATT&CK language, universal footprints, purple proof of detection, and non-negotiable scope — on artifacts, playbooks, and tickets. Not a SIEM appliance to install, and not a pentest.',
    concepts: [
        'ATT&CK is the shared language with red: technique IDs on tickets beat “it looked like malware”',
        'Build a mental heat map: which techniques does this incident actually show, and which of your log sources could have seen them',
        'Universal footprints: odd DNS, beacon-like timing, credential-store access — same tells on African SME commodity gear as on a bank SOC',
        'Living-off-the-land: signed admin tools at 02:00 from a laptop that never administers anything',
        'Purple loop: after red names a technique, blue must show a detection hypothesis and a response step (isolate, revoke, eradicate persistence)',
        'Break the chain: stop initial access when you can; if they are in, prioritize stopping lateral movement and credential reuse',
        'Dwell time is the metric: how long from first artifact to containment, not how many dashboards you own',
        'Responders stay inside authorization too — imaging a host you do not own, or “testing” a neighbor PC, is still unlawful'
    ],
    prevent: [
        'Ask for ATT&CK IDs on every high-severity ticket; map them on a Navigator-style coverage sketch for the shift handoff',
        'Write detections as questions to the log: DNS entropy/cadence, metronomic egress, process-access to credential stores, unusual parent-child pairs (office app spawning a shell)',
        'Prefer Sigma-class logic (generic, portable) over one vendor’s screenshot — then prove it against workbench artifacts, not against a live victim',
        'Playbook: contain blast radius, preserve evidence, revoke sessions/tokens, hunt persistence, brief leadership in 90 seconds',
        'African SME reality: do not wait for a zero-day story; hunt commodity behavior on ISP-range endpoints',
        'RoE for blue: whose data you may collect, how long you keep it, who you notify, and when legal holds beat a hasty wipe'
    ],
    caseStudy:
        'Night shift saw HTTPS to a new domain every 60 seconds from finance VDI. Blue isolated the VDI, preserved proxy/EDR, hunted the same identity on other hosts, and briefed: suspected C2 cadence, not “encrypted so safe.” Red later mapped the same chain on ATT&CK. Dwell time dropped because the ticket used technique language from minute one.',
    futureScenario:
        'Leadership wants the server reimaged before memory is captured and asks you to “quickly scan the partner network to see if they are patient zero.” Hold both: evidence plus authorization. Partner scanning without written scope is a new incident, not heroism.',
    essayQuestions: [
        essay(
            'You are the blue-cell lead. Artifacts suggest office software spawned a shell, then odd DNS, then credential-store access. Write the first 30 minutes: containment, evidence, ATT&CK labels, and the question you would ask a SIEM — without providing attack commands.',
            'Crisis-cell tone. Owners, times, and what you still do not know.'
        ),
        essay(
            'Explain dwell time to a three-person African SME IT team. Which three footprints they can hunt in existing logs, and which control they should not skip under WhatsApp pressure.',
            'No product pitch for a SIEM they cannot afford. Behavioral hygiene first.'
        ),
        essay(
            'A junior wants to disable noisy high-severity detections “until the purple exercise ends.” Coach them, and write the detection you would keep on for lateral movement.',
            'Blind gaps during exercises are how real breaches hide. Keep high-risk coverage.'
        )
    ]
};

const RED_QUESTIONS = [
    q(
        'Someone wants to run public “atomic” attack procedures on the office Wi-Fi so the class can watch Sysmon. TRIBAMS Special Ops Red response?',
        [
            'Approve — live fire on any network is the only honest training',
            'Refuse: study ATT&CK and workbench artifacts here; live procedures stay in isolated labs you own or have written permission to use',
            'Run it silently after hours so legal never knows',
            'Post the procedure on a public forum for extra credit'
        ],
        1,
        'This product trains judgment and detection language. Unauthorized live techniques are out of scope and unlawful.',
        'roe',
        45
    ),
    q(
        'For a credential-theft tool family, which question must you answer before you talk like an operator?',
        [
            'Where to download a working build',
            'Which operator-workflow step it serves and which artifacts defenders should expect',
            'How to disable EDR so the demo is clean',
            'Which neighbor subnet is easiest'
        ],
        1,
        'Purpose, workflow step, artifacts. Not a how-to-attack.',
        'workflow',
        40
    ),
    q(
        'Why map a ransomware affiliate to ATT&CK Navigator in this module?',
        [
            'To copy their exact malware onto a USB',
            'To heat-map techniques against hypothetical assets and see detection gaps in a shared language',
            'To replace all logging with the matrix PNG',
            'To prove Africa does not see those techniques'
        ],
        1,
        'Navigator is a coverage and language tool in TRIBAMS — not an emulation kit.',
        'attack',
        40
    ),
    q(
        'Odd DNS, metronomic outbound connections, and credential-store process access. Correct hunt framing?',
        [
            'Three unrelated glitches; close the tickets',
            'Universal C2 / credential-access footprints — investigate host and identity, preserve logs',
            'Proof that encryption makes traffic safe',
            'A reason to scan random internet hosts for “the attacker”'
        ],
        1,
        'Same tells on African SME logs as elsewhere. Hunt behavior on assets you are authorized to see.',
        'hunt',
        42
    ),
    q(
        'Red proposes production directory enumeration “so the graph is real.” Written ROE is lab-only. Correct call?',
        [
            'Approve for realism',
            'Hold ROE: use a representative lab graph; production needs written scope, time box, and abort criteria',
            'Do it from a personal laptop to avoid logs',
            'Dump the domain database to USB for study'
        ],
        1,
        'Tool knowledge is not a license. Scope is the engagement.',
        'roe',
        45
    ),
    q(
        'You block phishing (initial access) in tabletop. The chain still shows later. Where should blue spend the next hour if they are already in?',
        [
            'Rewrite the company homepage',
            'Stop lateral movement and credential reuse — break the river after the foothold',
            'Turn off all detections until marketing drafts a statement',
            'Attack the suspected infrastructure on the internet'
        ],
        1,
        'Purple skill is breaking the chain at the next cheapest control, not revenge hacking.',
        'chain',
        42
    )
];

const BLUE_QUESTIONS = [
    q(
        'HTTPS to a newly registered domain every 60 seconds from a finance VDI. First professional move?',
        [
            'Ignore — encryption means the channel is safe',
            'Treat as suspected C2 cadence: isolate the VDI, preserve proxy/EDR, hunt the identity, do not detonate samples on the analyst PC',
            'Download the payload at home to reverse it',
            'Block all HTTPS for the company'
        ],
        1,
        'Beacon timing is a hunt signal. Contain and preserve; do not become the second victim.',
        'beacon',
        45
    ),
    q(
        'Office application spawns a shell, then DNS queries look high-entropy. Best ticket language?',
        [
            '“Weird laptop, reboot it”',
            'ATT&CK-relevant execution and command-and-control hypotheses, with parent-child and DNS artifacts attached',
            '“User is the problem — shame them in the all-hands”',
            'Close as noise because the binary is signed'
        ],
        1,
        'Shared language plus artifacts. Signed LOLBins still need behavioral review.',
        'lolbins',
        42
    ),
    q(
        'Leadership wants a partner network scanned “to see if they are patient zero.” You have no written authorization covering them. Correct response?',
        [
            'Scan immediately to look heroic',
            'Refuse the scan; contain your estate; engage the partner through authorized channels',
            'Use a VPN exit so it is not attributable',
            'Ask a student to scan from a café'
        ],
        1,
        'Blue stays inside authorization. Unauthorized scanning is a new incident.',
        'roe',
        45
    ),
    q(
        'Why should a three-person African SME hunt LSASS-class access, odd DNS, and beacon timing even without a named APT?',
        [
            'They should not — those only happen in Hollywood',
            'Commodity operators use the same footprints on local ISP endpoints; zero-days are the exception',
            'Only after buying a six-figure SIEM',
            'Because TRIBAMS requires Kali Linux for certificates'
        ],
        1,
        'Living-off-the-land and identity abuse are the realistic hunt, not exotic exploits.',
        'africa_hunt',
        40
    ),
    q(
        'A junior wants to disable high-severity detections until the purple exercise ends. Coaching?',
        [
            'Approve a full detection holiday',
            'Reject blind gaps; tune noise and keep coverage that would catch lateral movement and credential theft',
            'Turn off EDR estate-wide until Friday',
            'Delete the SIEM project'
        ],
        1,
        'Exercises that blind production detections train the wrong muscle.',
        'detection_hygiene',
        40
    ),
    q(
        'Legal wants a hold; operations wants an instant wipe. Advanced blue resolution?',
        [
            'Ignore legal and wipe',
            'Preserve required evidence or snapshot per playbook, then rebuild from known-good media — document the decision',
            'Leave the attacker on the box for a week to observe',
            'Delete logs to reduce liability'
        ],
        1,
        'Crisis cells dual-track evidence and recovery.',
        'ir',
        48
    )
];

const SPECIAL_OPS_EXTRAS = {
    96: RED_EXTRAS,
    97: BLUE_EXTRAS
};

const SPECIAL_OPS_QUESTIONS = {
    96: RED_QUESTIONS,
    97: BLUE_QUESTIONS
};

function getSpecialOpsExtras(module) {
    const id = module && module.id;
    const extra = SPECIAL_OPS_EXTRAS[id];
    return extra || null;
}

function getSpecialOpsEssayQuestions(module) {
    const extra = getSpecialOpsExtras(module);
    return extra && extra.essayQuestions ? extra.essayQuestions : null;
}

function getSpecialOpsQuestions(module) {
    const id = module && module.id;
    return SPECIAL_OPS_QUESTIONS[id] || [];
}

module.exports = {
    SPECIAL_OPS_EXTRAS,
    SPECIAL_OPS_QUESTIONS,
    getSpecialOpsExtras,
    getSpecialOpsEssayQuestions,
    getSpecialOpsQuestions
};
