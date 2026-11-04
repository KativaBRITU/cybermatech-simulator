# Generic and meaningless content — code-level defects

**Identified:** 2026-11-04

The assessment engine synthesizes and pads questions to reach UI target counts.
This produces questions that are neither module-specific nor judgment-testing.

## Defect 1 — padJudgmentQuestions (assessmentEngine.js ~1050)

12 questions per module, all using the same template:
  'Dual control is slowing a [module] decision and a senior voice is angry.'

Every question has the same correct answer pattern:
  'Verify on a known channel and keep the written control.'

This tests recognition of a phrase, not judgment.

## Defect 2 — synthesizeModuleQuestions (assessmentEngine.js ~720)

12 questions per module, all using the module name as substitution:
  '[Phishing Detection] It is 02:17. Alerts indicate an active Phishing Detection event...'
  '[OT/ICS] It is 02:17. Alerts indicate an active OT/ICS event...'

The content is identical across modules. This is fake differentiation.

## Defect 3 — normalizeMcqOptions (assessmentEngine.js ~52)

Pads distractor options with generic tails to defeat the 'longest answer wins' tell:
  'Ban WhatsApp company-wide without alternative without verifying identity first'

This produces grammatically broken, semantically doubled strings.
It defeats one tell by adding a worse one.

## Fixes

- normalizeMcqOptions: bypass (return q unchanged)
- padJudgmentQuestions: do not call from generateModuleQuestions
- synthesizeModuleQuestions: do not call from buildQuestionPool
- The UI may show fewer questions per module after this — that is honest.
- Modules with fewer than 12 real questions are marked non-rotation in the coverage matrix.

## What real content should look like

- 12 questions per module, written by hand for that module's topic
- Each question tests a specific decision (not a slogan)
- Each distractor is a plausible practitioner mistake
- No template substitution, no padding, no synthesizer

The rewrite (Steps 4-10) produces this content. Until then, modules
serve their current real content (3-7 questions) plus their scenario,
not 16 items of which most are template filler.