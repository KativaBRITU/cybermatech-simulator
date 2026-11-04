# Audit script is a heuristic, not a proof

**Decided:** 2026-11-04

The audit script (scripts/audit-questions.js) uses heuristics to detect:
  - tone-match distractors (correct answer >1.5x average distractor length)
  - joke options (keyword list)
  - truncated questions (short or ending with ...)
  - missing metadata fields

These are first-pass filters, not proof of defect.

A question that passes all heuristics may still be tone-matchable in practice.
A question that fails all heuristics may be genuinely excellent.

The audit tells you which questions need human review. It does not tell you
which questions are broken.

Every question that passes the audit in a pilot module must still be read
aloud to a real practitioner and confirmed genuinely discriminating before the
method is scaled.