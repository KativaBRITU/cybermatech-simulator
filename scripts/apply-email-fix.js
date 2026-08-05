/**
 * One-command email TLS fix for Desktop TRIBAMS / Cybermatech.
 *
 * Usage (from project root):
 *   node scripts/apply-email-fix.js
 *
 * Or double-click: fix-email.bat
 *
 * What it does:
 *  1. Backs up services/emailService.js
 *  2. Writes/refreshes the TLS-safe emailService.js
 *  3. Adds EMAIL_TLS_INSECURE + NODE_TLS_REJECT_UNAUTHORIZED to .env
 *     without wiping your App Password or other vars
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const SERVICE_PATH = path.join(ROOT, 'services', 'emailService.js');
const ENV_PATH = path.join(ROOT, '.env');
const BAK_PATH = path.join(ROOT, 'services', 'emailService.js.bak');

const RAW_URL =
    'https://raw.githubusercontent.com/KativaBRITU/cybermatech-simulator/cursor/fix-email-tls-553d/services/emailService.js';

const ENV_DEFAULTS = {
    EMAIL_HOST: 'smtp.gmail.com',
    EMAIL_PORT: '587',
    APP_BASE_URL: 'http://127.0.0.1:3080',
    EMAIL_TLS_INSECURE: 'true',
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    PORT: '3080'
};

function download(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, { headers: { 'User-Agent': 'tribams-email-fix' } }, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return download(res.headers.location).then(resolve, reject);
                }
                if (res.statusCode !== 200) {
                    reject(new Error(`Download failed HTTP ${res.statusCode}`));
                    res.resume();
                    return;
                }
                const chunks = [];
                res.on('data', (c) => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
            })
            .on('error', reject);
    });
}

function upsertEnv(filePath, defaults) {
    let text = '';
    if (fs.existsSync(filePath)) {
        text = fs.readFileSync(filePath, 'utf8');
    } else {
        console.log('Creating .env …');
    }

    const lines = text.length ? text.split(/\r?\n/) : [];
    const seen = new Set();

    const next = lines.map((line) => {
        const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
        if (!m) return line;
        const key = m[1];
        if (Object.prototype.hasOwnProperty.call(defaults, key)) {
            seen.add(key);
            // Never overwrite secrets the user already set.
            if (key === 'EMAIL_PASS' || key === 'EMAIL_USER' || key === 'SESSION_SECRET') {
                return line;
            }
            return `${key}=${defaults[key]}`;
        }
        return line;
    });

    for (const [key, value] of Object.entries(defaults)) {
        if (!seen.has(key)) {
            next.push(`${key}=${value}`);
        }
    }

    // Ensure EMAIL_USER key exists (empty if missing) so user sees it.
    if (!next.some((l) => /^EMAIL_USER=/.test(l))) {
        next.push('EMAIL_USER=');
    }
    if (!next.some((l) => /^EMAIL_PASS=/.test(l))) {
        next.push('EMAIL_PASS=');
    }

    const out = next.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');
    fs.writeFileSync(filePath, out.endsWith('\n') ? out : `${out}\n`, 'utf8');
}

function ensureNodemailer() {
    try {
        require.resolve('nodemailer');
        return;
    } catch (_) {
        /* install below */
    }
    console.log('Installing nodemailer …');
    const { spawnSync } = require('child_process');
    const r = spawnSync('npm', ['install', 'nodemailer', 'dotenv', '--save'], {
        cwd: ROOT,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    });
    if (r.status !== 0) {
        throw new Error('npm install nodemailer failed. Run: npm install');
    }
}

async function main() {
    console.log('TRIBAMS email TLS fix');
    console.log('Project root:', ROOT);

    fs.mkdirSync(path.join(ROOT, 'services'), { recursive: true });
    ensureNodemailer();

    let source = null;
    const localCandidate = SERVICE_PATH;
    if (fs.existsSync(localCandidate)) {
        const current = fs.readFileSync(localCandidate, 'utf8');
        if (
            current.includes("rejectUnauthorized: false") &&
            current.includes("NODE_TLS_REJECT_UNAUTHORIZED")
        ) {
            source = current;
            console.log('Using local hardened services/emailService.js');
        }
    }

    if (!source) {
        console.log('Downloading fixed emailService.js from GitHub …');
        try {
            source = await download(RAW_URL);
        } catch (err) {
            console.error('Download failed:', err.message);
            console.error('Open the Raw file in a browser and save it over services\\emailService.js');
            console.error(RAW_URL);
            process.exit(1);
        }
    }

    if (fs.existsSync(SERVICE_PATH)) {
        fs.copyFileSync(SERVICE_PATH, BAK_PATH);
        console.log('Backup:', BAK_PATH);
    }

    fs.writeFileSync(SERVICE_PATH, source, 'utf8');
    console.log('Wrote:', SERVICE_PATH);

    upsertEnv(ENV_PATH, ENV_DEFAULTS);
    console.log('Updated:', ENV_PATH);
    console.log('');
    console.log('Next steps:');
    console.log('  1. Confirm EMAIL_USER and EMAIL_PASS (Gmail App Password) are set in .env');
    console.log('  2. Stop the server (Ctrl+C)');
    console.log('  3. Start again:  node server.js');
    console.log('  4. Look for: ✅ Email service ready (... TLS verify off)');
    console.log('  5. Test:       node scripts/test-email.js');
    console.log('  6. Forgot password at http://127.0.0.1:3080/forgot-password');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
