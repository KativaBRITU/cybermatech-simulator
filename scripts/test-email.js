/**
 * Quick SMTP check — run: node scripts/test-email.js
 * Reads .env and prints the real Gmail/SMTP error.
 */
'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Match server startup: disable TLS rejection before loading email service.
if (process.env.EMAIL_TLS_INSECURE !== 'false') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

async function main() {
    const emailService = require('../services/emailService');
    console.log('Config:', emailService.getStatus());
    const ready = await emailService.ensureReady();
    console.log('Ready:', ready);
    if (!ready) {
        console.log('Status after verify:', emailService.getStatus());
        console.log('');
        console.log('If you see self-signed certificate errors:');
        console.log('  1. Confirm EMAIL_TLS_INSECURE=true in .env');
        console.log('  2. Restart and retry: node scripts/test-email.js');
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
