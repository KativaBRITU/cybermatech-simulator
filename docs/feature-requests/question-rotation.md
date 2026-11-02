# Feature request — Daily question rotation until module completion

**Raised:** 2026-11-02
**Status:** Design decision made, scheduled for Step 11 of rewrite
**Blocked on:** rewrite producing >=12 questions per module (Step 10)

## Requirement

When a user signs in and starts a module, they should see a genuinely
different rotation of the module's questions every day until they complete
the module.

## Design decisions (confirmed 2026-11-02)

**Rotation definition:** The user sees a genuinely different set each day.

**Implications confirmed:**

- Each rotation-eligible module must have >=12 questions
- Daily sets must be stratified across cognitive_level and rotation_bucket
- Per-user per-module seen-question ledger is required
- Modules with <12 questions fall back to static presentation and are
  NOT rotation-eligible until Step 10 fills them in
- "Rotate what you have" is NOT acceptable — the honest fallback is
  "rotation not yet available for this module"

## Plan impact

- Step 1 gains per-question rotation_bucket field and per-module rotation_eligible flag
- Step 4 (pilot) must produce 12 questions for Module 1, spanning >=3 buckets
  and >=2 cognitive levels
- Step 10 target depth per module: 12 questions minimum
- New Step 11 (rotation engine) and Step 12 (rotation UI) inserted
- Plan duration revised to 10-14 weeks
- Maturity gate (old Step 14, now Step 16) includes "rotation engine live"

## Open decisions still to make before Step 4

See docs/feature-requests/completion-definition.md for the completion
definition and daily-quiz parameters.