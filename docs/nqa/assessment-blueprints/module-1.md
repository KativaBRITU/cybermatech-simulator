# Assessment Blueprint (Test Specification) — Module 1

**Module:** Phishing Detection
**Item bank size:** 12 items
**Items served per assessment:** 12 (full bank; no sampling)
**Pass threshold:** 70% (9 of 12 correct)
**Time allocation:** 12 items × 40-second mean = 8 minutes
**Retake policy:** Unlimited retakes. First-pass score counts toward
certificate eligibility. Retakes are formative, not summative.
**Integrity controls:** Server-side scoring; focus-loss logging;
tab-switching recorded; integrity pledge required pre-attempt.

## Item specification table

| Item | Cognitive | Difficulty | Outcome | Technique alignment | Rotation category | Weight |
|---|---|---|---|---|---|---|
| 1 | Analysis | 3 | O3 | T1539 | aitm | 8.33% |
| 2 | Analysis | 3 | O2 | T1656 | bec | 8.33% |
| 3 | Analysis | 3 | O4 | T1566.002 | reporting | 8.33% |
| 4 | Analysis | 3 | O4 | T1566.002 | reporting | 8.33% |
| 5 | Analysis | 3 | O1 | T1566.002 | aitm | 8.33% |
| 6 | Analysis | 3 | O3 | T1078 | reporting | 8.33% |
| 7 | Evaluation | 3 | O1 | T1539 | aitm | 8.33% |
| 8 | Analysis | 3 | O2 | T1656 | bec | 8.33% |
| 9 | Analysis | 3 | O3 | T1566 | reporting | 8.33% |
| 10 | Application | 2 | O5 | T1598.003 | awareness | 8.33% |
| 11 | Analysis | 3 | O1 | T1556.006 | aitm | 8.33% |
| 12 | Analysis | 3 | O3 | T1656 | deepfake | 8.34% |

## Distribution analysis

**Cognitive distribution:**
- Recall / comprehension: 0 items (0%)
- Application: 1 item (8.33%)
- Analysis: 10 items (83.33%)
- Evaluation: 1 item (8.33%)

Cognitive profile exceeds minimum for the declared level. All items assess at
application or above; no item tests pure recall.

**Outcome coverage distribution:**

| Outcome | Items assessing | Count |
|---|---|---|
| O1 (authentication quality) | 5, 7, 11 | 3 |
| O2 (out-of-band verification) | 2, 8 | 2 |
| O3 (impersonation discrimination) | 1, 6, 9, 12 | 4 |
| O4 (priority adjudication) | 3, 4 | 2 |
| O5 (reporting culture) | 10 | 1 |

**Coverage flag:** O5 has single-item coverage. This is below the intended
minimum of two items per outcome. Remediation: add one additional item
assessing O5 during next content extension cycle. Not blocking for pilot use.

**Rotation-category distribution:**

| Category | Items | Count |
|---|---|---|
| aitm | 1, 5, 7, 11 | 4 |
| bec | 2, 8, 12 | 3 |
| reporting | 3, 4, 6, 9 | 4 |
| deepfake | 12 | 1 |
| awareness | 10 | 1 |

**Distribution flag:** The rotation-category distribution is asymmetric
because item 12 is categorized as deepfake while its technique alignment
and outcome are aligned with ec. Recategorization would consolidate to
bec:4, reporting:4, aitm:4, awareness:1. Retained as-is pending rotation
engine implementation, which will validate category semantics.

## Item-quality gates

**Gate 1 — Option-length parity**
Threshold: maximum option length ≤ 1.30× minimum option length within any item.
**Status:** All 12 items pass at ≤ 1.10× ratio. Verified by automated audit
(scripts/audit-questions.js).

**Gate 2 — Distractor plausibility**
Threshold: no distractor may be eliminable on grounds of absurdity, humor, or
category mismatch without domain reasoning.
**Status:** All 12 items pass. Verified by pattern-matching resistance test
(analyst cannot pass by selecting longest or most-professional option).
Per-item rationale recorded in distractor_rationale field of source.

**Gate 3 — Distractor rationale completeness**
Threshold: every item must have an explicit rationale for each of four options.
**Status:** All 12 items pass. 48 distinct rationales recorded.

**Gate 4 — Technique alignment accuracy**
Threshold: every item must map to a valid ATT&CK technique or equivalent
control-framework reference.
**Status:** All 12 items pass. Technique IDs verified against current
MITRE ATT&CK Enterprise matrix.

**Gate 5 — Content validity**
Threshold: item content must test the outcome claimed, not a proximate concept.
**Status:** Manually verified. No items test proxies for the claimed outcomes.

**Gate 6 — Item freshness**
Threshold: item last-validated date must be within 12 months.
**Status:** All 12 items last-validated 2026-11-12. Fresh.

## Assessment conditions

**Administration:**
- Duration: 8 minutes
- Attempts: unlimited; first-pass score is the summative score
- Location: browser-based, proctor-free, integrity-pledge enforced
- Materials: no external aids; AI assistance invalidates attempt

**Scoring:**
- Correct response: +1 item weight
- Incorrect response: 0
- No partial credit; no negative marking
- Score reported as percentage of weight earned

**Integrity controls:**
- Server-side item delivery and scoring
- Client cannot access correct answers pre-submission
- Tab-switch and focus-loss events logged
- Implausibly fast perfect scores flagged for review
- Pledge acknowledgments recorded with attempt

**Accessibility:**
- Timer paused on documented accessibility request
- Alternative delivery available on institutional request

## Moderation pathway

**Initial moderation (completed 2026-11-12):**
- Primary author review: complete
- Automated audit gate: pass
- Pattern-matching resistance test: pass

**External moderation (pending):**
- Named external reviewer required before partner-institution use
- Reviewer attests item construct validity and outcome alignment
- Attestation retained at docs/nqa/attestations/module-1-review.md

**Re-moderation triggers:**
- Any item replacement
- Any outcome modification
- Any level reclassification
- Any partner-institution adoption decision

## Blueprint maintenance

**Owner:** Primary author
**Review cadence:** 12 months or on material content change
**Storage:** Version-controlled (this document)
**Change record:** Preserved in git commit history