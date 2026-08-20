/**
 * African / Namibia-context cyber scenarios — Tribams competitive edge.
 * Used by assessmentEngine for localized, realistic drills.
 */

const NAMIBIA_SCENARIOS = {
    'social-engineering': [
        {
            briefing: 'Windhoek — a Ministry finance clerk receives a WhatsApp voice note claiming to be the Permanent Secretary demanding an urgent payment to a "supplier in Walvis Bay".',
            stressCues: ['Authority pressure', 'WhatsApp urgency', 'Public-sector fraud'],
            question: 'The voice sounds familiar but slightly off. Payment must clear before 16:00. Safest first move?',
            options: [
                'Pay immediately — delaying a PS request is career risk',
                'Call the PS on a known office number (not WhatsApp) and verify before any transfer',
                'Forward the voice note to colleagues asking if it sounds real',
                'Reply on WhatsApp asking for bank details confirmation'
            ],
            correct: 1,
            explanation: 'Namibia has seen BEC/vishing against public and private finance. Verify out-of-band on known channels — never authorize from the same chat that delivered the demand.',
            difficulty: 'medium',
            timeLimit: 55
        },
        {
            briefing: 'A UNAM student receives an SMS: "Bursary top-up — confirm student number at this link before midnight."',
            stressCues: ['Financial urgency', 'Student targeting', 'Smishing'],
            question: 'Which action best protects the student and campus credentials?',
            options: [
                'Open the link on campus Wi-Fi so traffic is "safer"',
                'Ignore the SMS and check bursary status only via official student portal bookmarks',
                'Enter student number only, never the password',
                'Share the link in the class WhatsApp group to warn others by clicking first'
            ],
            correct: 1,
            explanation: 'Smishing clones trusted education/finance brands. Use official portals you navigate to yourself — never links from SMS.',
            difficulty: 'easy',
            timeLimit: 45
        },
        {
            briefing: 'Lagos — a fintech support agent gets a "customer" on WhatsApp with a selfie ID and asks to reset 2FA because "SIM was swapped during fuel scarcity travel".',
            stressCues: ['SIM-swap narrative', 'KYC pressure', 'Support empathy'],
            question: 'Best identity proofing step?',
            options: [
                'Reset 2FA immediately — selfie is enough',
                'Follow written step-up proofing: known device challenge, cooling-off, and out-of-band verification that cannot be completed only in the attacker-controlled chat',
                'Ask them to send the SMS OTP they receive',
                'Accept a voice note saying "I am the real customer"'
            ],
            correct: 1,
            explanation: 'SIM-swap and WhatsApp support fraud are common in African fintech. Empathy without process is how accounts empty.',
            difficulty: 'hard',
            timeLimit: 60
        },
        {
            briefing: 'Nairobi — payroll WhatsApp group gets a message from a spoofed HR number: "New M-Pesa payout shortcode — send ID number to confirm".',
            stressCues: ['Payroll trust', 'Mobile money', 'Group chat'],
            question: 'Correct staff action?',
            options: [
                'Reply with ID so salary is not delayed',
                'Stop; report to IT/HR via known channels; HR confirms only through official payroll systems',
                'Send ID privately to the admin only',
                'Vote in the group whether it looks real'
            ],
            correct: 1,
            explanation: 'Payroll and M-Pesa pretexting thrives in group chats. Official systems beat WhatsApp "HR".',
            difficulty: 'easy',
            timeLimit: 45
        }
    ],
    forensics: [
        {
            briefing: 'A Windhoek bank SOC sees after-hours VPN logins from a residential ISP, then a large payment file staged. CEO is offline at a coastal conference.',
            stressCues: ['Banking impact', 'Executive unavailable', 'Containment clock'],
            question: 'Best immediate containment while preserving evidence?',
            options: [
                'Shut down the entire core banking host immediately',
                'Disable the suspect VPN session/account, quarantine the staging host, preserve VPN and EDR logs, escalate to IR lead',
                'Wait for the CEO to approve any action after the keynote',
                'Publicly announce a breach on social media to warn customers'
            ],
            correct: 1,
            explanation: 'Contain the access path, preserve logs, escalate — do not wait on executive availability for first containment in financial IR.',
            difficulty: 'hard',
            timeLimit: 60
        },
        {
            briefing: 'Johannesburg — a municipal billing system shows odd admin logins overnight after load-shedding recovery. Cashiers report screens “working slowly”.',
            stressCues: ['Load-shedding chaos', 'Municipal services', 'Persistence'],
            question: 'What should IR prioritize after power returns?',
            options: [
                'Ignore — slowness is always power-related',
                'Validate integrity of billing hosts, review admin auth during outage window, isolate suspicious sessions, preserve logs before reboot storms',
                'Wipe all cashiers’ PCs without imaging',
                'Turn off logging to speed the system up'
            ],
            correct: 1,
            explanation: 'Outages create cover for persistence. Integrity checks and auth review beat assuming “it’s just Eskom”.',
            difficulty: 'medium',
            timeLimit: 55
        }
    ],
    governance: [
        {
            briefing: 'A Windhoek clinic runs patient records on a shared PC. A ransomware note appears. Management wants to pay in crypto "to reopen tomorrow for ART patients".',
            stressCues: ['Healthcare duty of care', 'Ransomware payment pressure', 'Data protection'],
            question: 'What is the most professional first recommendation?',
            options: [
                'Pay immediately — patient care overrides security process',
                'Isolate affected systems, activate downtime procedures for care continuity, notify leadership/DP authorities as required, restore from known-good backups — do not treat payment as plan A',
                'Wipe every PC in the clinic without imaging',
                'Post patient names online so they can "watch for fraud"'
            ],
            correct: 1,
            explanation: 'Healthcare IR prioritizes care continuity and lawful notification. Paying ransoms is last resort and never a substitute for isolation + restore.',
            difficulty: 'medium',
            timeLimit: 60
        },
        {
            briefing: 'A Namibian SME wins a government tender and must show basic cyber hygiene before onboarding onto a ministry portal.',
            stressCues: ['Compliance deadline', 'SME resource limits'],
            question: 'Which starter control set best matches a practical Namibia SME posture?',
            options: [
                'Buy an expensive SIEM before MFA',
                'Enable MFA on email/admin accounts, patch internet-facing systems, backups tested offline, phishing awareness for staff',
                'Only install a free antivirus and skip backups',
                'Outsource everything and keep a single shared admin password'
            ],
            correct: 1,
            explanation: 'Foundational hygiene (MFA, patching, backups, awareness) delivers the most risk reduction per dollar for SMEs.',
            difficulty: 'easy',
            timeLimit: 50
        },
        {
            briefing: 'Accra — a telco processor asks a partner SME for a data-protection impact note before sharing subscriber metadata for fraud analytics.',
            stressCues: ['Partner pressure', 'Personal data', 'African DP laws'],
            question: 'Best governance response?',
            options: [
                'Share everything in a WhatsApp zip — speed wins contracts',
                'Minimize data, document purpose/legal basis, apply access controls, and align with applicable African DP expectations plus contract terms',
                'Refuse all analytics forever',
                'Publish the metadata publicly for transparency'
            ],
            correct: 1,
            explanation: 'African data-protection regimes increasingly expect purpose limitation and safeguards — not informal WhatsApp transfers.',
            difficulty: 'medium',
            timeLimit: 55
        }
    ],
    network: [
        {
            briefing: 'A mining contractor near Swakopmund reports OT engineering workstations on the same flat VLAN as guest Wi-Fi after a "temporary" network change.',
            stressCues: ['OT/IT boundary', 'Guest network risk'],
            question: 'Highest-priority fix before production resumes?',
            options: [
                'Leave it — temporary changes are fine for a week',
                'Segment OT from IT/guest, block lateral paths, require jump-host access for engineering changes',
                'Only change the Wi-Fi password',
                'Disable all logging to reduce noise'
            ],
            correct: 1,
            explanation: 'OT exposure via flat networks is a classic Africa mining/industrial risk. Segmentation and controlled access come first.',
            difficulty: 'hard',
            timeLimit: 60
        },
        {
            briefing: 'Kigali — a university campus opens guest Wi-Fi that can reach the exam result database subnet after a misapplied firewall rule.',
            stressCues: ['Campus network', 'Exam integrity'],
            question: 'Correct emergency action?',
            options: [
                'Announce on Twitter that exams are cancelled',
                'Revert/fix firewall rules, segment student/guest from academic records, force password resets for DB admins, review access logs',
                'Shutdown the entire campus internet for a month',
                'Move the database to a public S3 bucket'
            ],
            correct: 1,
            explanation: 'Contain exposure, restore segmentation, reset privileged creds, investigate — protect exam integrity.',
            difficulty: 'medium',
            timeLimit: 55
        }
    ],
    cloud: [
        {
            briefing: 'A Namibian insurer stores claims PDFs in a misconfigured public cloud bucket discovered by a researcher who emailed responsible disclosure.',
            stressCues: ['Public bucket', 'PII/claims data', 'Reputation'],
            question: 'Correct sequence?',
            options: [
                'Ignore the researcher and hope nobody else finds it',
                'Make the bucket private immediately, rotate exposed credentials, assess what was accessed, notify per policy/law, thank the researcher via proper channel',
                'Delete the bucket without checking access logs',
                'Move data to another public bucket in a different region'
            ],
            correct: 1,
            explanation: 'Close exposure, rotate secrets, investigate scope, meet notification duties — standard cloud incident hygiene.',
            difficulty: 'medium',
            timeLimit: 55
        },
        {
            briefing: 'Cairo — a ride-hailing startup’s staging API keys were committed to a public GitHub fork used by an intern in a shared cyber café.',
            stressCues: ['Secret leak', 'Startup speed', 'Shared PC risk'],
            question: 'Best response?',
            options: [
                'Leave keys — staging does not matter',
                'Revoke/rotate keys immediately, scan for abuse, block public secret commits with scanning, educate on café/shared-PC risk',
                'Only delete the repo without rotating keys',
                'Ask the intern to edit commit history from the café PC'
            ],
            correct: 1,
            explanation: 'Rotate first. Shared African café PCs plus public git is a recurring secret-leak pattern.',
            difficulty: 'medium',
            timeLimit: 50
        }
    ],
    malware: [
        {
            briefing: 'Staff at a logistics firm in Walvis Bay opened a "port clearance" Excel macro. Endpoints show unusual outbound DNS to a rare TLD.',
            stressCues: ['Macro malware', 'Port operations downtime'],
            question: 'Best next step for the IT lead?',
            options: [
                'Allow macros company-wide so work continues',
                'Isolate affected hosts, block the DNS/C2 indicators, collect disk/memory samples, reset credentials used on those hosts',
                'Format all servers including backups',
                'Only run a full antivirus scan and leave machines online'
            ],
            correct: 1,
            explanation: 'Contain, block C2, preserve evidence, reset credentials — classic malware IR for document-borne payloads.',
            difficulty: 'medium',
            timeLimit: 55
        },
        {
            briefing: 'Dakar — a microfinance branch PC used for both customer onboarding and YouTube shows a ransomware note before end-of-day collections.',
            stressCues: ['Shared-use PC', 'Cash operations', 'Ransomware'],
            question: 'Immediate priority?',
            options: [
                'Keep collecting cash on the infected PC',
                'Isolate the PC, switch to downtime collection procedure, restore from clean backup, separate browsing from finance roles going forward',
                'Pay the ransom from till cash',
                'Unplug the router for the whole city block'
            ],
            correct: 1,
            explanation: 'Isolate, continue business via downtime process, restore clean — then fix role separation on branch PCs.',
            difficulty: 'medium',
            timeLimit: 55
        }
    ],
    emerging: [
        {
            briefing: 'A deepfake video of a Namibian CEO circulates on Facebook urging staff to buy gift cards for a "surprise audit".',
            stressCues: ['Deepfake', 'Social virality', 'CEO fraud'],
            question: 'What should security communications do first?',
            options: [
                'Assume the video is real because it looks perfect',
                'Issue an internal alert: no financial actions from social video; verify via known internal channels; report the post for takedown',
                'Ask staff to debate authenticity in comments',
                'Disable all company social media forever'
            ],
            correct: 1,
            explanation: 'Treat deepfake CEO fraud as BEC 2.0 — out-of-band verification and rapid internal warning beat engagement with the fake.',
            difficulty: 'medium',
            timeLimit: 50
        },
        {
            briefing: 'Addis Ababa — an AI chatbot used by a bank helpdesk starts approving password resets when users paste “policy documents” containing hidden prompt-injection text.',
            stressCues: ['AI abuse', 'Helpdesk', 'Identity'],
            question: 'Correct control direction?',
            options: [
                'Trust the model — AI is smarter than staff',
                'Remove autonomous reset privileges; require human step-up verification; sanitize tool outputs; log and rate-limit AI actions',
                'Feed the bot more customer ID numbers to improve accuracy',
                'Put the bot on WhatsApp with admin rights'
            ],
            correct: 1,
            explanation: 'AI helpdesk tools need hard privilege boundaries — prompt injection is an African bank risk as adoption accelerates.',
            difficulty: 'hard',
            timeLimit: 60
        }
    ],
    'offensive-tools': [
        {
            briefing: 'Gaborone — a purple-team exercise shows repeated Nmap-like sweeps from a contractor laptop against a card-fee processor VLAN outside the written scope.',
            stressCues: ['Scope creep', 'Authorization', 'Third party'],
            question: 'What should the CISO do?',
            options: [
                'Ignore — scanning is always fine',
                'Stop the activity, review authorization/scope, treat out-of-scope scanning as an incident until proven authorized',
                'Praise the contractor for initiative and expand prod scanning',
                'Post the results on LinkedIn'
            ],
            correct: 1,
            explanation: 'Authorization and scope are the law and ethics line. Out-of-scope scanning is not “learning”.',
            difficulty: 'medium',
            timeLimit: 50
        },
        {
            briefing: 'Lusaka SOC sees LSASS access patterns consistent with credential dumping on a jump box used by remote admins across SADC clients.',
            stressCues: ['Credential access', 'MSSP jump box', 'Lateral movement'],
            question: 'Best first response framing?',
            options: [
                'Assume antivirus will clean it overnight',
                'Isolate jump box, reset credentials/tokens used from it, hunt lateral movement with ATT&CK credential-access techniques',
                'Only rename the jump box hostname',
                'Share the dump file in WhatsApp for “analysis”'
            ],
            correct: 1,
            explanation: 'Credential access on shared African MSSP jump boxes is high blast-radius — isolate and reset identity material fast.',
            difficulty: 'hard',
            timeLimit: 60
        }
    ]
};

function pickNamibiaScenario(category, dayNumber) {
    const bank = NAMIBIA_SCENARIOS[category];
    if (!bank || !bank.length) return null;
    return bank[(Math.max(1, dayNumber) - 1) % bank.length];
}

/**
 * Prefer African/Namibia scenarios most days (3 of 4) when available.
 * Locale labels surface in the Cyber Range UI.
 */
function resolveScenarioTemplate(category, dayNumber, fallbackBank) {
    const preferLocal = dayNumber % 4 !== 0;
    if (preferLocal) {
        const local = pickNamibiaScenario(category, dayNumber);
        if (local) return { template: local, locale: 'africa' };
    }
    if (fallbackBank && fallbackBank.length) {
        return {
            template: fallbackBank[(dayNumber - 1) % fallbackBank.length],
            locale: 'global'
        };
    }
    const local = pickNamibiaScenario(category, dayNumber);
    if (local) return { template: local, locale: 'africa' };
    return null;
}

module.exports = {
    NAMIBIA_SCENARIOS,
    AFRICAN_SCENARIOS: NAMIBIA_SCENARIOS,
    pickNamibiaScenario,
    resolveScenarioTemplate
};
