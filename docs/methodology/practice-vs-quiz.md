# Practice vs Quiz — design intent

**Decided:** 2026-11-05

## Current state

- Practice and Quiz both sample from the same pool (real + shared).
- Practice is not required before Quiz — the learner chooses.
- Overlap is high because the bank is small (12-14 per module).
- Feedback: Practice shows per-question feedback; Quiz shows end-of-quiz summary.
  (Confirmed in UI — verify by manual test.)

## After rotation is live (Step 11)

- Practice samples 5 questions from the day's rotation.
- Quiz samples 5 different questions from the same rotation pool.
- Overlap between practice and quiz within a single day: 0-1 questions.
- Two quiz attempts on different days: 0-2 overlap.
- Learner can practice before quiz, but is not required to.

## Pilot acceptance criteria (Step 4)

Module 1's pilot:
- Practice shows 5-6 questions with per-question feedback.
- Quiz shows 12 questions (all real, no filler) with end-of-quiz feedback.
- Practice and quiz can be taken in any order.
- Rotation is NOT active yet — that's Step 11.

## What NOT to do

- Do not force practice before quiz. Adults skip practice if they know the material.
- Do not reuse the exact same questions in practice and quiz in the same session.
- Do not show quiz answers per-question. That makes quiz indistinguishable from practice.