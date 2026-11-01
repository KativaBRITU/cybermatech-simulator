# Baseline snapshot — Step 0

Captured: 2026-10-29

## Purpose

This folder captures the state of the assessment content BEFORE the rewrite begins.
The git tag `pre-rewrite-baseline` points at commit 552fa07. See `git show pre-rewrite-baseline --stat`.

## Files

- `tierADepth.js`  — Tier A questions and essays (from `modules/tierADepth.js`)
- `tierBDepth.js`  — Tier B questions and essays (from `modules/tierBDepth.js`)
- `tierCDepth.js`  — Tier C questions and essays (from `modules/tierCDepth.js`)
- `trainingPhases.js` — phase logic (from `modules/trainingPhases.js`)
- `test-output-before.txt` — output of `npm test` at baseline (or note if no tests)
- `smoke-before/` — screenshots of the platform before the rewrite

## Known baseline defects (per audit)

The three tier files contain questions with these documented issues:

- Tone-matchable distractors (longest/most cautious answer often wins)
- Absurd distractors (e.g., "Disable all email", "Fire all analysts")
- Many modules with 2 or fewer questions
- Essays with no rubric

Rewrite steps that address these:

- Step 1: extend q() and essay() helpers with new optional fields
- Step 2: audit script detects these defects
- Step 4: pilot module rewrite eliminates them
- Step 10: batch rewrite covers remaining modules

## Rollback

To restore the pre-rewrite state at any time:

    git checkout pre-rewrite-baseline -- .

Or compare current state to baseline:

    git diff pre-rewrite-baseline -- modules/tierADepth.js