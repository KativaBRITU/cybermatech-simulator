# TRIBAMS — The Project Book

**Product:** Tribams (tribams.com)  
**Working title:** Public Launch Edition v14.2  
**Scope:** Full technical and product reference for the cybersecurity training platform  
**Audience:** Founder, engineers, investors, beta partners, and operators  

---

## Preface

Tribams is an Africa-first cybersecurity training platform. Learners study structured modules, practice under timed pressure, complete evidence-style labs, and earn verifiable proof of readiness. Guests see how the product operates and why membership helps; members unlock the catalog, drills, labs, dashboards, and certificates.

This book documents **what the system is**, **how it is built**, **how it is operated**, and **how it is meant to go to market**. It reflects the codebase as of the Tribams.com branding pass.

---

## Part I — Vision and positioning

### 1.1 Problem

Organisations and individuals across Africa need practical cyber skills: phishing judgment, social engineering awareness, network and cloud hygiene, incident response, and the ability to show employers or managers that training happened. Many products either:

- over-claim (“AI-powered everything”, full attack-range parity), or  
- ignore local context (WhatsApp fraud, mobile money, ministry BEC, regional compliance).

### 1.2 Solution

Tribams delivers:

1. **Structured learning** — ~95 modules with study content and questions.  
2. **Pressure** — timed live drills scored on the server.  
3. **Evidence Workbench** — artifact-oriented labs with ATT&CK technique credits.  
4. **Proof** — certificates and Force Readiness transcripts that can be verified.  
5. **Access control** — Free / Pro / Pro+ plus B2B org licensing.  
6. **African context** — Namibia-rooted and continent-relevant scenarios and study framing.

### 1.3 Honest market claims

Tribams **does claim**: judgment training, drills, labs, readiness transcripts, African scenario depth.

Tribams **does not claim**: being a full interactive network / VM attack-range substitute, a live red-team engagement certificate, or a university degree.

### 1.4 Brand

| Item | Value |
|------|--------|
| Product name | Tribams / TRIBAMS |
| Domain | tribams.com |
| Public contact (human inbox) | tribams@gmail.com |
| System SMTP sender (configurable) | EMAIL_USER in `.env` (often a dedicated Gmail) |
| Legal / operating note | Brand as Tribams; set `APP_BASE_URL=https://tribams.com` in production |

---

## Part II — Product experience

### 2.1 Guest experience (unauthenticated)

Guests may see marketing pages only:

- Home (`/`) — how Tribams operates, benefits of joining, high-level topics  
- About (`/about`)  
- Contact (`/contact`)  
- Login / Register / password reset  
- Terms / Privacy  
- Certificate verify pages (public verification use-case)

Guests **must not** reach member assets without signing in: resource center, labs, scenarios, health-check UI, leaderboard, badges, darkweb module UI, training pages, dashboard, profile, organization hub, module catalog API (`/api/modules`).

### 2.2 Member journey

1. Register → optional email welcome (requires working SMTP).  
2. Dashboard → progress, streaks, next actions.  
3. Resource Center → browse catalog (paid locks + progress gates apply).  
4. Module path: **Learn → Practice → Live drill**.  
5. Labs (Evidence Workbench) when available for that module.  
6. Certificate eligibility after passing live drills at the required mark.  
7. Optional upgrade via `/payment` (PayPal) or org seat via `/organization`.

### 2.3 Free vs paid

Default free sampler module IDs (configurable via `FREE_MODULE_IDS`):

- Phishing Detection  
- Social Engineering  
- Security Awareness  

Pro unlocks the live catalog. Pro+ adds deeper attacker-toolkit style labs where configured. Admins listed in `ADMIN_EMAILS` bypass locks for review.

### 2.4 Integrity model

- Live drills are graded **server-side**.  
- Direct score posting endpoints are disabled or rejected.  
- Matte K (optional guide) is blocked on exam/lab pages and for guests on marketing pages.  
- Focus/risk signals may feed integrity-aware readiness views.

---

## Part III — Architecture

### 3.1 High-level stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js, Express 5 |
| Session | `express-session` + file store (SQLite/Postgres/Redis options exist in deps) |
| Database | SQLite by default (`database/tribams.db`); PostgreSQL optional |
| Auth | Session cookies + bcrypt passwords |
| Email | Nodemailer → Gmail SMTP (App Password) |
| Payments | PayPal Orders API (sandbox/live) |
| PDFs | PDFKit certificates |
| Security headers | Helmet, compression, rate limits |
| Content | Markdown/HTML views, module content library, assessment engine |

### 3.2 Important directories

```
server.js                 # HTTP routes, auth gates, admin APIs, launch readiness
modules/                  # Domain logic (access, labs, assessment, org, Matte K, …)
services/emailService.js  # SMTP
views/                    # HTML pages
public/                   # Static JS/CSS
scripts/                  # Smoke tests, SMTP diagnose, migrations
database/                 # SQLite file + sessions
.env                      # Secrets and runtime config (never commit)
```

### 3.3 Request flow (simplified)

```
Browser → Express → session middleware → route
  ├─ sendView() injects theme / auth-nav / (member-only) Matte K
  ├─ requireLogin() redirects guests to /login?next=…
  ├─ accessControl.canAccessModule() for paid content
  └─ JSON APIs return 401/403 when locked
```

### 3.4 Access control summary

Implemented in `modules/accessControl.js`:

- Normalizes subscription tier/status and org license grants.  
- Annotates modules with `paid_locked` / progress locks.  
- Free IDs from env; Pro max ID configurable.

### 3.5 Content engines

- **assessmentEngine** — questions, briefings, skill profiles.  
- **contentLibrary** — study guides / enrichment.  
- **labEngine** — Evidence Workbench catalog and grading.  
- **progressGate** — unlock bands and rank snapshots.  
- **africanContext / namibiaScenarios** — local scenario framing.  
- **marketSignals** — honest buyer/employer claim set.  
- **orgService** — B2B seats and custom training requests.  
- **matteK / matteKKnowledge** — optional on-platform guide for members.

---

## Part IV — Data model (conceptual)

Core entities (SQLite/Postgres):

| Entity | Purpose |
|--------|---------|
| users | Accounts, streaks, subscription fields |
| modules | Catalog metadata |
| module_contents | Study material, resources, essay prompts |
| scores / quiz results | Drill outcomes (server-authored) |
| lab_completions | Workbench results |
| certificates | Issued cert IDs |
| organizations / seats | B2B licensing |
| process_monitor | Ops activity log (admin) |
| sessions | File or DB-backed sessions |

Legacy note: older installs may still have a file named `cybermatech.db`. The DB layer renames/migrates that file to `tribams.db` when present. That filename string is **migration-only**, not product branding.

---

## Part V — Configuration (`.env`)

### 5.1 Required for serious beta

| Variable | Purpose |
|----------|---------|
| `PORT` | Default in this project often `3080` |
| `SESSION_SECRET` | Long random secret (≥32, prefer 64+) |
| `APP_BASE_URL` | Production: `https://tribams.com` |
| `ADMIN_EMAILS` | Comma-separated ops admins |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail + **App Password** |
| `EMAIL_FROM` | Display From header |
| `EMAIL_HOST` / `EMAIL_PORT` | Usually `smtp.gmail.com` / `587` |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Payments |
| `PAYPAL_MODE` | `sandbox` for beta, `live` for real money |

### 5.2 Pricing / access knobs

- `PRICE_*_NAD`, `NAD_PER_USD`  
- `FREE_MODULE_IDS`, `PRO_MAX_MODULE_ID`  
- B2B pack prices (`PRICE_LICENSE_*`)

### 5.3 Production checklist flags

Admin endpoint `GET /api/launch-readiness` scores:

- session secret  
- non-localhost `APP_BASE_URL`  
- PayPal configured / live  
- email configured / verify ready  
- admin emails  
- `NODE_ENV=production`  

Target for public launch: **≥ 80%**.

---

## Part VI — Operations runbook

### 6.1 Local start

```bash
cp .env.example .env   # if needed
npm install
npm start              # or npm run dev
```

Health: `GET /api/health`  
Smoke: `npm test` (server must be running)

### 6.2 Email

Gmail will reject normal account passwords (`535 BadCredentials`). Use an App Password for the mailbox in `EMAIL_USER`. Outbound TCP **587/465** to `smtp.gmail.com` must be allowed (firewall/antivirus). Diagnose with:

```bash
node scripts/smtp-diagnose.js
```

Human support contact on the site is **tribams@gmail.com** — that is the monitored inbox for people, separate from whatever SMTP identity sends automated mail.

### 6.3 Payments

- Sandbox for beta testers.  
- Without PayPal credentials, non-production/admin can still **dev-activate** plans for testing.  
- Live mode requires `PAYPAL_MODE=live` and live credentials; return URLs depend on `APP_BASE_URL`.

### 6.4 Database

- Default SQLite is fine for early beta if backups are taken.  
- Postgres path: Docker compose + migrate script when scaling.

### 6.5 Security basics before beta

1. Never commit `.env`.  
2. Rotate any secret that was ever pasted into chat, tickets, or screenshots.  
3. Use HTTPS on tribams.com (reverse proxy / host SSL).  
4. Confirm rate limits on login/register/payment.  
5. Confirm guest routes stay locked after deploy.  
6. Review admin email list carefully.

---

## Part VII — Feature map by route

### 7.1 Public pages

`/`, `/about`, `/contact`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/terms`, `/privacy`, `/verify`, `/verify-readiness`

### 7.2 Member pages (login required)

`/dashboard`, `/profile`, `/resource-center`, `/resources`, `/training/:module`, `/lab`, `/scenario`, `/health-check`, `/leaderboard`, `/badges`, `/certificate`, `/review`, `/organization`, `/payment*`, `/darkweb`, …

### 7.3 Notable APIs

- `/api/modules` — catalog (auth required)  
- `/api/labs*` — workbench  
- `/api/dashboard-data`, `/api/progress`, `/api/readiness`  
- `/api/paypal/*` — checkout  
- `/api/launch-readiness` — admin launch score  
- `/api/admin/*` — ops  

---

## Part VIII — Business model

### 8.1 Individual

- Free starter modules  
- Pro monthly / annual (NAD pricing, PayPal USD conversion)  
- Pro+ deeper labs  

### 8.2 B2B

- SME / Institution / Enterprise seat packs  
- Org hub for seats and readiness  
- Custom training requests (Namibia/industry packs)

### 8.3 Beta pricing advice

For closed beta: keep PayPal in **sandbox**, or manually grant Pro to invited testers via admin. Do not advertise live card charging until email + HTTPS + live PayPal are verified end-to-end.

---

## Part IX — Quality and testing

### 9.1 Automated

- `scripts/smoke-test.js` — brand and critical paths against a running server  
- `scripts/smtp-diagnose.js` — SMTP connectivity/auth shape  

### 9.2 Manual beta script (recommended)

1. Guest: open home — no AI overclaim, no catalog deep links.  
2. Guest: hit `/resource-center` and `/lab` — redirect to login.  
3. Register new user — email arrives (or document known SMTP gap).  
4. Complete one free module Learn → Practice → Live drill.  
5. Confirm score cannot be forged via client.  
6. Attempt paid module — payment or lock message.  
7. Admin: launch-readiness ≥ expected for beta tier.  
8. Contact page shows tribams@gmail.com.  

### 9.3 Content honesty

Replace or clearly label any placeholder testimonials before public marketing. Beta users trust candor more than invented social proof.

---

## Part X — Roadmap sketch

### Near-term (beta)

- Working SMTP  
- `APP_BASE_URL=https://tribams.com` + TLS  
- DNS pointed to hosting  
- Closed tester cohort + feedback form  
- Fix session-store ENOENT noise if sessions expire oddly  

### Mid-term

- PayPal live + receipt emails  
- Postgres for multi-instance  
- Stronger backup/restore runbooks  
- Org onboarding polish  

### Later

- Mobile UX pass  
- Employer verification portal polish  
- Expanded African scenario packs  

---

## Part XI — Glossary

| Term | Meaning |
|------|---------|
| Live drill | Timed, server-scored assessment |
| Evidence Workbench | Artifact lab environment |
| Force Readiness | Shareable transcript / integrity-aware proof |
| Matte K | Optional member guide (not on guest marketing pages) |
| Pro / Pro+ | Paid tiers |
| Launch readiness | Weighted config score for go-live |

---

## Part XII — File of record

This document lives at:

`docs/TRIBAMS_PROJECT_BOOK.md`

Update it when:

- pricing or tiers change  
- access rules change  
- domain or payment provider changes  
- major module count / lab count changes  

---

## Closing

Tribams is already a substantial training product: catalog, drills, labs, certificates, B2B hooks, and guest-safe marketing. Market readiness for **closed beta** is close once email and domain HTTPS work. Market readiness for **public paid launch** still requires production mode, live payments, reliable mail, and an honesty pass on marketing claims.

Build for Africa. Prove readiness. Charge only when the rails work.
