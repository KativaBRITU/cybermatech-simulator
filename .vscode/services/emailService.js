const { Resend } = require('resend');

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send welcome email
async function sendWelcomeEmail(email, username) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0a0a2a, #1a1a3a); color: #00ff88; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #0a0a2a; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛡️ Welcome to Tribams!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${username}!</h2>
                    <p>Thank you for joining Tribams - your AI-powered cybersecurity training platform.</p>
                    <p>You're now ready to:</p>
                    <ul>
                        <li>🎣 Complete Phishing Detection training</li>
                        <li>🦠 Learn Malware Analysis</li>
                        <li>🔒 Master Network Security</li>
                        <li>☁️ Explore Cloud Security</li>
                        <li>📱 Secure Mobile Devices</li>
                        <li>🏠 Protect IoT Devices</li>
                        <li>🎭 Recognize Social Engineering</li>
                        <li>🚨 Handle Incident Response</li>
                        <li>📋 Understand Security Compliance</li>
                        <li>🎓 Practice Ethical Hacking</li>
                    </ul>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5000/dashboard" class="button">Start Training Now</a>
                    </p>
                </div>
                <div class="footer">
                    <p>Tribams - Building cyber resilience worldwide</p>
                    <p>© 2025 Tribams. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: 'Tribams <noreply@tribams.com>',
            to: email,
            subject: 'Welcome to Tribams! 🚀',
            html: html
        });
        console.log(`✅ Welcome email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
        return false;
    }
}

// Send password reset email
async function sendPasswordResetEmail(email, username, resetLink) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0a0a2a, #1a1a3a); color: #00ff88; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #0a0a2a; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hello ${username}!</h2>
                    <p>We received a request to reset your password for your TRIBAMS account.</p>
                    <p>Click the button below to create a new password:</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" class="button">Reset My Password</a>
                    </p>
                    <div class="warning">
                        <strong>⚠️ This link expires in 1 hour.</strong><br>
                        If you didn't request this, please ignore this email or contact support.
                    </div>
                    <hr>
                    <p style="font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="font-size: 12px; color: #666; word-break: break-all;">${resetLink}</p>
                </div>
                <div class="footer">
                    <p>TRIBAMS - Building cyber resilience worldwide</p>
                    <p>© 2025 TRIBAMS. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: 'Tribams <noreply@tribams.com>',
            to: email,
            subject: 'Reset Your Tribams Password 🔐',
            html: html
        });
        console.log(`✅ Password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send reset email to ${email}:`, error.message);
        return false;
    }
}

// Send certificate email
async function sendCertificateEmail(email, username, moduleName, score) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #0a0a2a, #1a1a3a); color: #00ff88; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f5f5f5; padding: 30px; border-radius: 0 0 10px 10px; }
                .badge { font-size: 48px; text-align: center; margin: 20px 0; }
                .score { font-size: 24px; color: #00ff88; font-weight: bold; }
                .button { display: inline-block; padding: 12px 24px; background: #00ff88; color: #0a0a2a; text-decoration: none; border-radius: 5px; font-weight: bold; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏆 Congratulations!</h1>
                </div>
                <div class="content">
                    <div class="badge">🎓</div>
                    <h2>Certificate of Completion</h2>
                    <p>Dear <strong>${username}</strong>,</p>
                    <p>Congratulations on completing the <strong>${moduleName}</strong> module!</p>
                    <p>Your score: <span class="score">${score}%</span></p>
                    <p>You've demonstrated excellent understanding of cybersecurity concepts.</p>
                    <p style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5000/dashboard" class="button">View Your Certificate</a>
                    </p>
                    <p>Keep learning and protecting the digital world!</p>
                </div>
                <div class="footer">
                    <p>TRIBAMS - Building cyber resilience worldwide</p>
                    <p>© 2025 Tribams. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await resend.emails.send({
            from: 'Tribams <noreply@tribams.com>',
            to: email,
            subject: `🎓 Certificate Earned: ${moduleName} - TRIBAMS`,
            html: html
        });
        console.log(`✅ Certificate email sent to ${email}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send certificate email to ${email}:`, error.message);
        return false;
    }
}

module.exports = {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendCertificateEmail
};