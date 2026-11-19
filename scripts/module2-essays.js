[
  {
    question: 'A SOC analyst in Windhoek detonates a suspicious document in a sandbox with no network callouts, and it marks "clean." Forty-eight hours later, users report encrypted files on a shared drive. Write a SOC handling guide covering containment, evidence preservation, analysis path, and user coaching.',
    guidelines: 'Write operationally and avoid generic awareness slogans. Address why a clean sandbox run can precede later impact, what volatile and host evidence to preserve before rebooting, how to scope lateral/share spread, and how users should report suspicious files.',
    rubric: [
      { criterion: 'Explains sandbox blind spots and delayed triggers', points: 2, evidence_required: 'Addresses delayed execution, environmental checks, or multi-stage delivery not observed during initial detonation' },
      { criterion: 'Defines containment and volatile evidence preservation', points: 2, evidence_required: 'Isolates affected hosts and preserves memory, running processes, and network state before rebooting' },
      { criterion: 'Establishes a safe analysis and scoping path', points: 2, evidence_required: 'Uses an isolated VM/sandbox without running samples on production endpoints and scopes shared drive impact' },
      { criterion: 'Provides concrete user reporting and coaching', points: 2, evidence_required: 'Instructs users to stop activity, avoid local cleanup/reboots, and report exact timestamps and file names' },
      { criterion: 'Maintains operational clarity without generic fluff', points: 2, evidence_required: 'Actionable runbook steps with clear sequencing rather than vague security slogans' }
    ]
  },
  {
    question: 'Finance staff in Walvis Bay forward a suspicious macro-enabled spreadsheet (.xlsm) that prompts users to enable content. Draft a first-response procedure for handling the sample safely and scoping potential exposure.',
    guidelines: 'Emphasize safe sample handling (quarantine, offline metadata/IOC extraction, isolated analysis) over running macros on live endpoints, and check whether any user already enabled macros or spawned child processes.',
    rubric: [
      { criterion: 'Enforces safe sample handling', points: 2, evidence_required: 'Quarantines the attachment and extracts metadata/IOCs before any controlled detonation in isolation' },
      { criterion: 'Checks for prior macro execution', points: 2, evidence_required: 'Verifies whether recipients opened the file, enabled content, or spawned script/shell processes' },
      { criterion: 'Extracts actionable indicators', points: 2, evidence_required: 'Captures file hashes, embedded URLs/domains, macro strings, and sender/header details' },
      { criterion: 'Avoids unsafe testing on live systems', points: 2, evidence_required: 'Explicitly prohibits opening or testing suspicious macros on finance or analyst production workstations' },
      { criterion: 'Documents clear escalation and handoff', points: 2, evidence_required: 'Defines when to escalate to incident response and what artifacts accompany the ticket' }
    ]
  },
  {
    question: 'A threat intelligence feed flags a file hash as a known dropper, and endpoint telemetry shows the file sitting in a user downloads folder in Frankfurt without a confirmed execution event. Write your investigation and containment steps.',
    guidelines: 'Do not assume non-execution without checking dropped payloads, persistence entries, or earlier execution logs. Address host isolation, artifact preservation, and hunting across other endpoints.',
    rubric: [
      { criterion: 'Questions unverified non-execution assumptions', points: 2, evidence_required: 'Checks process creation, script/service logs, and dropped files rather than relying solely on no obvious launch' },
      { criterion: 'Isolates and preserves the host artifact', points: 2, evidence_required: 'Isolates the workstation and preserves the binary, metadata, and surrounding directory artifacts' },
      { criterion: 'Hunts for dropped second-stage payloads', points: 2, evidence_required: 'Searches common drop paths, scheduled tasks, run keys, and services for follow-on components' },
      { criterion: 'Scans fleet-wide for related indicators', points: 2, evidence_required: 'Checks other endpoints for the hash, related domains/IPs, or similar download patterns' },
      { criterion: 'Applies proportional containment before clearing', points: 2, evidence_required: 'Verifies host cleanliness before returning the workstation to normal service' }
    ]
  },
  {
    question: 'An analyst in Singapore needs to examine a suspicious Windows executable without access to a commercial detonation platform. Write a safe local lab setup and analysis checklist.',
    guidelines: 'Focus on isolation controls (clean VM, disabled or controlled network, pre-execution snapshot), evidence capture, and avoiding production or personal host exposure.',
    rubric: [
      { criterion: 'Specifies strong environment isolation', points: 2, evidence_required: 'Uses a clean virtual machine with network disabled or tightly controlled and a pre-run snapshot' },
      { criterion: 'Prohibits unsafe host environments', points: 2, evidence_required: 'Rules out running untrusted binaries on analyst workstations or production/shared VMs' },
      { criterion: 'Captures baseline and post-run state', points: 2, evidence_required: 'Records hashes, process trees, file/registry/network changes, and reverts snapshots cleanly' },
      { criterion: 'Protects indicator and sample integrity', points: 2, evidence_required: 'Handles samples safely in restricted archives and avoids leaking internal host names or credentials' },
      { criterion: 'Summarizes findings clearly for triage', points: 2, evidence_required: 'Produces clear observations, IOCs, and recommended next steps for responders' }
    ]
  },
  {
    question: 'After confirming malware activity on a workstation in London, the user asks to reboot the machine immediately so they can finish urgent work. Write your response explaining the forensic and operational risks and the steps you will take instead.',
    guidelines: 'Explain why rebooting loses volatile memory evidence while persistence mechanisms can survive restarts, and outline isolation, volatile capture, scoping, and safe recovery.',
    rubric: [
      { criterion: 'Explains volatile memory loss on reboot', points: 2, evidence_required: 'Notes that restarting clears running processes, network connections, and in-memory artifacts' },
      { criterion: 'Addresses surviving persistence', points: 2, evidence_required: 'Explains that scheduled tasks, services, or autoruns can persist across reboots' },
      { criterion: 'Defines immediate containment and capture steps', points: 2, evidence_required: 'Isolates the endpoint and collects key volatile/host artifacts before remediation or rebuild' },
      { criterion: 'Scopes credential and lateral exposure', points: 2, evidence_required: 'Checks active sessions, account usage, and nearby hosts for signs of spread' },
      { criterion: 'Communicates constructively with the user', points: 2, evidence_required: 'Explains the risk plainly without lecturing and sets expectations for restoration' }
    ]
  }
]
