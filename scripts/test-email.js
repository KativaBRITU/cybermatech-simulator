/**
 * Quick SMTP check — run: node scripts/test-email.js
 * Reads .env and prints the real Gmail/SMTP error.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
    const emailService = require('../services/emailService');
    console.log('Config:', emailService.getStatus());
    const ready = await emailService.ensureReady();
    console.log('Ready:', ready);
    if (!ready) {
        console.log('Status after verify:', emailService.getStatus());
        process.exit(1);
    }
    const to = process.argv[2] || process.env.EMAIL_USER;
    const result = await emailService.sendTestEmail(to);
    console.log('Send result:', result);
    process.exit(result.sent ? 0 : 1);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
