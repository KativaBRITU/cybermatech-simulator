# Assessment Quality-Assurance Dossier

## Purpose

This dossier comprises the quality-assurance artifacts for TRIBAMS training
modules. It is prepared for review by curriculum committees, external examiners,
and program-validation panels at higher-education institutions, and is structured
to serve as the evidentiary foundation for formal accreditation application
when such application is initiated.

The dossier is module-scoped. Each module is documented independently so that
reviewers may evaluate modules without evaluating the entire catalogue.

## Dossier scope

**Modules with complete assessment-quality artifacts:** 1
- Module 1 — Phishing Detection

**Modules with content only (no assessment-quality artifacts):** 94
- Content rewrite in progress; see docs/coverage-matrix.md

The imbalance is declared. Reviewers should treat the single complete module as
a worked example of the assessment standard this program is committed to, not as
evidence that the remaining catalogue meets it.

## Structure of a complete module dossier

Each complete module dossier comprises three documents, all cross-referenced:

**1. Learning outcomes specification**
Location: learning-outcomes/module-{id}.md

Contents:
- Measurable learning outcomes (3–5 per module)
- Cognitive-level classification of each outcome
- Mapping to national level descriptors
- Notional learning hours and credit calculation
- Entry requirements

**2. Assessment blueprint (test specification table)**
Location: ssessment-blueprints/module-{id}.md

Contents:
- Item-by-item specification: item number, cognitive level, difficulty,
  outcome tested, technique alignment, rotation category, item weight
- Distribution analysis: cognitive-level distribution, outcome coverage
  distribution, rotation-category distribution
- Item quality gates: option-length parity, distractor plausibility,
  distractor rationale completeness
- Assessment conditions: time allocation, scoring methodology, retake policy,
  integrity controls
- Moderation pathway

**3. Level rationale**
Location: 
qf-rationale/module-{id}.md

Contents:
- Assigned level and descriptor justification
- Comparative analysis against adjacent levels (why not lower, why not higher)
- Cognitive-evidence basis
- Credit calculation
- Review cycle

## How reviewers should verify dossier integrity

The dossier is only valid if the content it describes matches the content that
is actually delivered. To verify:

1. Read the learning outcomes specification
2. Inspect the delivered item bank for the module (source: modules/tierADepth.js,
   modules/tierBDepth.js, or modules/tierCDepth.js)
3. Cross-reference each outcome against the items the blueprint claims assess it
4. Verify the item content matches the outcome's cognitive level
5. Flag any item whose content contradicts its claimed outcome

A dossier that overstates the cognitive level of its items is not evidence of
quality. It is misrepresentation. The dossier is structured to make this
verifiable.

## Declared limitations and non-claims

**This dossier does not constitute a formal accreditation submission.**

The dossier is prepared *in anticipation of* accreditation application. No
accreditation application has been initiated. Reviewers should not treat
this dossier as evidence of accredited status.

**This dossier does not assert employer recognition.**

Employer recognition requires third-party validation independent of this
dossier. The dossier enables such validation but does not itself constitute it.

**This dossier does not cover the 94 modules without artifacts.**

Those modules have content-quality defects documented in
docs/methodology/generic-content-defect.md. They are not claimed to meet
the assessment-quality standard demonstrated in Module 1.

**This dossier has not undergone attributed external review.**

The Module 1 content was reviewed informally during the project's
action-research phase. A signed, attributed attestation from an independent
reviewer has not yet been obtained. See "Attributed external review status" below.

## Attributed external review status

**Status: pending.**

External review by a named practitioner or academic, willing to be identified
as a reviewer of the Module 1 assessment, is pending. The dossier does not
claim external endorsement prior to obtaining a signed attestation.

Once obtained, the attestation will be stored at
docs/nqa/attestations/module-1-review.md with the reviewer's name, role,
affiliation (if the reviewer consents to disclosure), date, and scope of review.

**Until the attestation exists, external reviewers should treat this dossier as
self-attested.** Self-attestation is sufficient for internal quality management;
it is not sufficient for accreditation or partnership discussion.

## Proposed validation pilot

**Proposed scope (design proposal, not external standard):** n=20 participants using Module 1 over an 8-week observation window. Both parameters are the program's proposed pilot design; partner institutions may adjust either to align with their own validation practice.

**What is proposed:**
- No fee for the pilot
- Two supervisor-hours from the partner institution
- Participant cohort recruited by the partner institution
- Outcome data collected by TRIBAMS; results shared with the partner institution
- Data collected: completion rate, score distribution, item-level performance,
  participant feedback (structured instrument), observed misuse patterns

**What the partner institution decides at completion:**
- Whether the module achieves its claimed learning outcomes in their context
- Whether to extend the pilot to additional modules
- Whether to consider the curriculum for integration

**Why a pilot and not adoption:** pilots are low-commitment for the partner
institution and high-information for both parties. Adoption decisions should
be evidence-based; the pilot produces the evidence.

## Accreditation pathway

**Current stage:** dossier preparation (this document set).

**Next stages, in order:**

1. Complete dossiers for all modules intended for pilot (in progress)
2. Obtain attributed external review for pilot modules
3. Approach one or more partner institutions for validation pilot
4. Conduct pilot; collect outcome data
5. Engage accreditation authority for informational consultation (not formal
   application)
6. Adjust dossier based on feedback received
7. Submit formal accreditation application when evidence is complete and a
   partner institution has committed to a validation cohort

**No timeline is asserted.** Premature application damages institutional
credibility. Application follows evidence, not ambition.

## Change history

Dossier initiated: 2026-11-12
Module 1 dossier completed: 2026-11-12
Next planned dossier: Module 7 (pending content rewrite)