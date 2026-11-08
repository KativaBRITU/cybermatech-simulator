# Coverage Matrix — Rewrite Queue

**Created:** 2026-11-04
**Source:** docs/audit/audit-before.json (193 questions, 95/95 modules under 12)
**Target:** 12 questions per module, at least 2 at cognitive_level ≥ 3, at least 3 rotation buckets

## Status legend

- \pending\ — not started
- \in-progress\ — pilot or batch in progress
- \done\ — 12 questions written, audit passes, essays have rubric
- \
ot-eligible\ — cannot reach 12 questions; not certificate-bearing

## Priority queue — first 20 modules

These are the Tier A modules (entry-point) plus the four highest-visibility Tier B modules. Fill them in before Step 4.

| Module ID | Module name | Tier | Current Q | Target Q | Primary ATT&CK / Control | Rotation buckets | Status | Owner | Target week |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Phishing Detection | A | 3 | 12 | T1566.002 | aitm, bec, reporting | done | Britu | W1 (pilot) |
| 7 | BEC & Deepfake | A | 2 | 12 | T1566.001 / T1656 | bec, deepfake, payment-callback | pending | Britu | W2 |
| 8 | Incident Response | A | 3 | 12 | T1486 / T1569 | ir, severity, forensics | pending | Britu | W2 |
| 11 | Ransomware | A | 2 | 12 | T1486 | ransomware, extortion, backups | pending | Britu | W3 |
| 18 | SOC Operations | A | 3 | 12 | T1078 / T1021 | soc, lateral, metrics | pending | Britu | W3 |
| 21 | Zero Trust | A | 2 | 12 | T1133 / T1021 | zero_trust, ztna, segmentation | pending | Britu | W4 |
| 37 | Awareness Training | A | 2 | 12 | T1566 | awareness, bec, channels | pending | Britu | W4 |
| 46 | Reconnaissance | A | 2 | 12 | T1595 / T1046 | nmap, exposure, asm | pending | Britu | W5 |
| 51 | Credential Dumping | A | 2 | 12 | T1003.001 | mimikatz, tiering, paW | pending | Britu | W5 |
| 52 | Command & Control | A | 2 | 12 | T1071 / T1105 | c2, beacon, egress | pending | Britu | W6 |
| 58 | BloodHound / AD | A | 2 | 12 | T1078.002 / T1484 | bloodhound, tiering, acl | pending | Britu | W6 |
| 60 | Pass-the-Hash | A | 2 | 12 | T1550.002 | pth, tiering, cloud-token | pending | Britu | W7 |
| 70 | DNS Tunneling | A | 2 | 12 | T1071.004 | dns_tunnel, exfil, resolvers | pending | Britu | W7 |
| 84 | ATT&CK Mapping | A | 2 | 12 | T1595 / T1071 | attack, coverage, purple | pending | Britu | W8 |
| 95 | Purple Teaming | A | 2 | 12 | T1595 / T1599 | purple, emulation, retest | pending | Britu | W8 |
| 2 | Malware Analysis | B | 2 | 12 | T1204 / T1059 | malware, sandbox, host | pending | Britu | W9 |
| 4 | Cloud Security | B | 2 | 12 | T1078.004 / T1530 | cloud, keys, exposure | pending | Britu | W9 |
| 12 | Privacy (POPIA/GDPR) | B | 2 | 12 | T1530 | privacy, dpa, notification | pending | Britu | W10 |
| 14 | Database Security | B | 2 | 12 | T1190 / T1213 | database, sqli, least-priv | pending | Britu | W10 |
| 19 | IAM | B | 2 | 12 | T1078 / T1556 | iam, jit, service-accounts | pending | Britu | W11 |

## Remaining 75 modules

Fill in as you get closer. Pull from docs/audit/audit-before.json — the JSON has every module ID, question count, and essay count. Suggested fill-in order after the 20 above:

1. Tier A remaining (already done above — all 15 Tier A modules are in the 20)
2. Tier B highest-visibility (modules 3, 5, 9, 10, 15, 16, 17, 19, 20, 22, 23, 24, 25, 27, 30, 31, 32, 34, 36, 38, 39, 40, 41, 42, 43, 45, 47, 48, 49, 50, 53, 54, 56, 59, 61, 62, 65, 68, 74, 75, 78, 79, 80, 81, 85, 86, 88, 90)
3. Tier C (28 modules: 6, 13, 26, 28, 29, 33, 35, 44, 55, 57, 63, 64, 66, 67, 69, 71, 72, 73, 76, 77, 82, 83, 87, 89, 91, 92, 93, 94)

## Rewrite progress

Track progress by running:

    node scripts/audit-questions.js

after each batch. Compare the "MODULES UNDER 12 QUESTIONS" count to the baseline (95). The target is 0.

Log each batch below:

| Date | Modules rewritten | Modules before | Modules after | Notes |
|---|---|---|---|---|
| (empty — fill in after Step 4) | | | | |