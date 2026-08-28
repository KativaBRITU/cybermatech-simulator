# TRIBAMS privacy — operator note

This is an internal checklist for whoever runs tribams.com. It is **not** a DPA, DPIA, or lawyer opinion.

## What the product surfaces say (keep them aligned)

- **Home law:** Republic of Namibia, establishment Windhoek. Courts of Namibia.
- **Not in force:** Namibia Data Protection Bill (as of August 2026). Do not tell buyers “we are GDPR in Namibia” or “POPIA applies because we are in Southern Africa.”
- **In-force frame we cite:** Constitution Article 13 (privacy); Communications Act 8 of 2009 (comms regulation, not a general DPA); Electronic Transactions Act 4 of 2019 as it applies to an online service. Cybercrime remains a **bill** — do not claim a dedicated Act is in force.
- **Extra, not replacement:** GDPR / UK GDPR-style rights for EEA/UK (and similarly situated) users, wired through `/profile` export/delete and `/contact#privacy`.
- **Money:** USD list + PayPal. N$ is display reference.

Public pages: `/privacy`, `/cookies`, `/terms`. In-account: `/profile`.

## What this codebase does **not** include

- Signed customer DPA generator / SCC pack
- Formal DPIA or RoPA (record of processing) artefact
- Licensed attorney review
- Cookie consent wall (there are no analytics/ad cookies to gate)
- Namibia-only data residency switch

If an enterprise buyer needs a DPA, draft it offline and email it. Do not fake a portal.

## Processors you actually turn on

| Piece | When it leaves the origin |
| --- | --- |
| PayPal | Paid checkout (`PAYPAL_*`) |
| SMTP / Gmail | Password reset and mail (`EMAIL_*`) |
| Cloudflare | DNS / HTTPS / WAF in front of Node |
| Hosted Postgres | `DATABASE_URL` in production |
| OpenAI | Only if `OPENAI_API_KEY` is set (Matte K) |

## Learner tools

- `GET /api/account/export` — JSON pack, no password hashes
- `POST /api/account/delete` — same purge as admin user delete; admins in `ADMIN_EMAILS` cannot self-delete here
