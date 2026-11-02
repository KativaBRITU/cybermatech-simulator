# Known issues (post-baseline, discovered during use)

## Issue 001 — Registration shows two conflicting errors

**Discovered:** 2026-11-02
**Severity:** High (blocks new user registration)
**Affects:** Registration form

### Symptom
When registering a new user with a username and email that have never been used,
the UI displays BOTH:
- "Invalid username or email"
- "Username or email already exist"

Both cannot be true simultaneously for the same input.

### Reproduction
1. Open /register (or /signup)
2. Enter an unused username and unused email
3. Submit
4. Both error messages appear

### Suspected causes (unconfirmed)
1. Two validators running, both reporting errors even when one passes
2. Double form submission
3. Database lookup returning null treated as "match found"
4. Overly strict format regex on username/email
5. Column name mismatch causing both checks to fail with fallback text

### Investigation plan
- Capture the actual request via DevTools → Network → Copy as cURL
- Inspect the backend route that handles registration
- Log the values being compared
- Check for double-submission in the frontend

### Baseline state
This bug was NOT introduced by Step 0 (git tag pre-rewrite-baseline).
It pre-existed in commit 552fa07 and earlier.