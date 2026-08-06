# AGENTS.md

## Cursor Cloud specific instructions

### What this is
A single Node.js/Express app: "Cybermatech / TRIBAMS", a cybersecurity training
simulator. It serves static HTML views (`views/`) plus a JSON API (`server.js`),
uses `express-session` for auth, `bcrypt` for passwords, and a local SQLite
database (`database/cybermatech.db`, auto-created on first run). Training content
(modules + quizzes) lives in `content/*.json`; there is no build step or frontend
framework.

### Running the app (single service)
- Dev (auto-reload): `npm run dev` (nodemon) — the standard way to develop.
- Prod-style: `npm start`.
- Serves on `http://127.0.0.1:3080` (override with `PORT`). Health: `/api/health`.
- Config: copy `.env.example` to `.env`. Email/SMTP is OPTIONAL — leave
  `EMAIL_USER` / `EMAIL_PASS` blank and the app runs fine (forgot-password just
  logs/returns the reset link instead of emailing). The app intentionally sets
  `NODE_TLS_REJECT_UNAUTHORIZED=0` for SMTP (a Windows-antivirus workaround); this
  is expected, not a bug.

### Test / lint / build
- Tests: `npm test` — a lightweight content sanity check only (no test framework).
  `npm run test:email` requires real SMTP credentials.
- Lint: none configured (no ESLint/Prettier). There is no `lint` script.
- Build: none (static views + Node server; nothing to compile).

### Verifying member features (auth-gated API)
Member pages depend on a logged-in session cookie. The full flow works via the
JSON API and is the reliable way to verify functionality end to end:
- `POST /api/register` `{username,email,password}` (password min 8 chars)
- `POST /api/login` `{email,password}` (sets the `cm.sid` session cookie)
- `GET /api/modules`, `GET /api/modules/:id/quiz`, `POST /api/modules/:id/submit`
  `{quizToken,answers}`, `GET /api/progress`
- Module ids come from `content/modules.json` and are short (e.g. `phishing`,
  `malware`), NOT slugs like `phishing-basics`.

### Non-obvious gotchas
- GUI rendering limitation in this VM: pages that build their DOM via JavaScript
  after load — the dashboard (`/dashboard`), training (`/training/:module`), and
  resources (`/resources`) — render as a BLANK white page in this VM's
  software-rendered Chrome (the DOM and CSS are correct, but layout collapses to
  zero height). This is a browser/VM compositing limitation, NOT an app bug. The
  static/auth pages (`/`, `/login`, `/register`, `/forgot-password`) render
  normally. To visually test the member area, use a GPU-enabled browser; otherwise
  verify member features through the JSON API above.
- `node_modules/` is committed to this repo (tracked despite being listed in
  `.gitignore`). The committed copy can be incomplete/have wrong file modes, so a
  fresh `npm install` is required to get a working setup (it adds missing packages
  like `nodemailer` and restores executable bits on `node_modules/.bin/*`). Running
  `npm install` will therefore leave working-tree churn under `node_modules/`; do
  NOT commit that churn.
- `database/cybermatech.db` is a tracked SQLite file that changes as you register
  users / take quizzes. Avoid committing local test data.
