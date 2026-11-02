# Module completion — definition

**Decided:** 2026-11-02

A user has completed a rotation-eligible module when they have done BOTH:

1. Answered all questions in that module's bank at least once (>=12 for rotation modules)
2. Achieved a passing score (>=70%) on the module's daily quiz on at least
   three separate calendar days

Rationale: requirement 1 ensures coverage of the full bank (no cherry-picking
easy questions across days). Requirement 2 prevents lucky single-day passes.

Daily quiz size: 5 questions per day (from a bank of 12+).

Days to completion (minimum): 3 (>=12 questions / 5 per day = 3 days minimum).

Behaviour on day N > 3 without completion:

  - The ledger continues; previously-seen questions may repeat in the daily set
    if the unseen pool is exhausted, but the rotation preferentially selects
    unseen questions
  - User sees "X of Y questions seen, need 70% on N more days" in the UI