# Deployment notes — production DB refresh

**Discovered:** 2026-11-08

## Problem
The code fix for synthesizeTrendQuestion mangling was deployed to
Railway (commit 2bcb6cf), but production still showed mangled questions.
The code was fine; the database still had old quiz_bank content from
August (generation 1). The 90-day refresh cycle (REFRESH_CYCLE_DAYS = 90)
had not expired, so the DB never re-generated.

## Fix
Force a refresh via admin API:

    POST /api/admin/refresh-content?force=1
    Body: {"module_id": 1}
    Headers: Cookie: connect.sid=<admin session>

Result: {"success": true, "refreshed": true, "generation": 2}

## Consequence for future module rewrites
After rewriting a module's questions in tierADepth.js, a code deploy
alone does NOT update production. You must also force-refresh:

    POST /api/admin/refresh-content?force=1
    Body: {"module_id": <id>}

## Admin session cookie
The admin session cookie must be obtained by logging in as an admin
in the browser. It is named connect.sid (or sessionId depending on
the session middleware config).

## Do NOT force-refresh a module that has manual DB edits
Force-refresh overwrites quiz_bank and practice_bank for that module.
If you've manually edited the DB rows, those edits are lost. Check
before running.

## Two production URLs
The project has two services:
- cybermatech-simulator-production-4b29.up.railway.app
- cybermatech-simulator-production-6b75.up.railway.app

Verify BOTH serve the current content after each deploy. If they
share a database, one refresh fixes both. If separate, refresh each.