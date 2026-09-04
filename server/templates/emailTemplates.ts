/**
 * Spendora Premium Email Templates
 * Branded transactional emails for OTP, Password Reset, Security Notices, and Onboarding.
 */

export interface EmailTemplatePayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}
const getBaseHtmlLayout = (title: string, contentHtml: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0b0f19;
      padding: 40px 10px;
    }
    .main-table {
      max-width: 580px;
      margin: 0 auto;
      background: #131b2e;
      border-radius: 16px;
      border: 1px solid #1e293b;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 32px 30px;
      text-align: center;
    }
    .brand-logo {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      text-decoration: none;
      display: inline-block;
    }
    .brand-tagline {
      color: #c7d2fe;
      font-size: 13px;
      margin-top: 4px;
      font-weight: 500;
    }
    .content {
      padding: 36px 32px;
      color: #cbd5e1;
      font-size: 15px;
      line-height: 1.6;
    }
    .otp-container {
      margin: 28px 0;
      text-align: center;
    }
    .otp-box {
      display: inline-block;
      background: #1e293b;
      border: 2px solid #6366f1;
      border-radius: 12px;
      padding: 16px 36px;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #ffffff;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      text-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    .badge-expiry {
      display: inline-block;
      margin-top: 10px;
      font-size: 12px;
      color: #94a3b8;
      background: #0f172a;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid #334155;
    }
    .button-link {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
    }
    .security-notice {
      margin-top: 30px;
      padding: 16px;
      background: #0f172a;
      border-left: 4px solid #eab308;
      border-radius: 8px;
      font-size: 13px;
      color: #94a3b8;
    }
    .footer {
      padding: 24px 30px;
      background: #0d1322;
      border-top: 1px solid #1e293b;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td class="header">
          <div class="brand-logo">✨ Spendora</div>
          <div class="brand-tagline">Intelligent AI Personal Finance & Wealth Management</div>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${contentHtml}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px 0;">This is an automated security email sent from <strong>spendorafinancetracker@gmail.com</strong>.</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} Spendora Finance. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

/**
 * 1. Login OTP Email
 */
export const getLoginOtpEmail = (email: string, otp: string, expiryMinutes: number = 10): EmailTemplatePayload => {
  const content = `
    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Your Spendora Login Code</h2>
    <p style="margin: 0 0 20px 0;">We received a login request for your Spendora account (<strong>${email}</strong>). Use the one-time verification code below to sign in:</p>
    
    <div class="otp-container">
      <div class="otp-box">${otp}</div>
      <div><span class="badge-expiry">⏱️ Valid for ${expiryMinutes} minutes</span></div>
    </div>

    <div class="security-notice">
      <strong>Security Alert:</strong> If you did not attempt to sign in to Spendora, please ignore this email. Never share this code with anyone; Spendora support will never ask for your verification code.
    </div>
  `;

  return {
    to: email,
    subject: `Your Spendora Verification Code: ${otp}`,
    html: getBaseHtmlLayout('Spendora Login Code', content),
    text: `Your Spendora login verification code is: ${otp}. It is valid for ${expiryMinutes} minutes. If you did not request this, please ignore.`,
  };
};

/**
 * 2. Signup / Welcome OTP Email
 */
export const getSignupOtpEmail = (email: string, otp: string, fullName?: string, expiryMinutes: number = 10): EmailTemplatePayload => {
  const nameGreeting = fullName ? `Hello ${fullName},` : 'Hello,';
  const content = `
    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Welcome to Spendora!</h2>
    <p style="margin: 0 0 16px 0;">${nameGreeting}</p>
    <p style="margin: 0 0 20px 0;">Thank you for starting your financial journey with Spendora. To complete your account verification, please enter your 6-digit confirmation code:</p>
    
    <div class="otp-container">
      <div class="otp-box">${otp}</div>
      <div><span class="badge-expiry">⏱️ Valid for ${expiryMinutes} minutes</span></div>
    </div>

    <div class="security-notice">
      <strong>Security Notice:</strong> This code was sent to verify <strong>${email}</strong>. If you did not register for Spendora, you can safely ignore this email.
    </div>
  `;

  return {
    to: email,
    subject: `Verify your Spendora account: ${otp}`,
    html: getBaseHtmlLayout('Welcome to Spendora - Verify Account', content),
    text: `Welcome to Spendora! Your verification code is: ${otp}. It expires in ${expiryMinutes} minutes.`,
  };
};

/**
 * 3. Password Reset OTP / Code Email
 */
export const getPasswordResetOtpEmail = (email: string, otp: string, expiryMinutes: number = 15): EmailTemplatePayload => {
  const content = `
    <h2 style="margin: 0 0 12px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Password Reset Request</h2>
    <p style="margin: 0 0 20px 0;">We received a request to reset the password for your Spendora account (<strong>${email}</strong>). Use the verification code below to authorize your new password:</p>
    
    <div class="otp-container">
      <div class="otp-box">${otp}</div>
      <div><span class="badge-expiry">⏱️ Expires in ${expiryMinutes} minutes</span></div>
    </div>

    <div class="security-notice">
      <strong>⚠️ Warning:</strong> If you did not request a password reset, please change your password immediately or contact our security team at spendorafinancetracker@gmail.com.
    </div>
  `;

  return {
    to: email,
    subject: `Spendora Password Reset Code: ${otp}`,
    html: getBaseHtmlLayout('Spendora Password Reset', content),
    text: `Your Spendora password reset code is: ${otp}. It is valid for ${expiryMinutes} minutes. If you did not request this, secure your account.`,
  };
};

/**
 * 4. Password Reset Success / Security Notification
 */
export const getPasswordResetSuccessEmail = (email: string): EmailTemplatePayload => {
  const timestamp = new Date().toUTCString();
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">🔒</span>
      <h2 style="margin: 12px 0 6px 0; color: #ffffff; font-size: 20px; font-weight: 700;">Password Changed Successfully</h2>
      <p style="margin: 0; color: #10b981; font-weight: 600; font-size: 14px;">Security Confirmation</p>
    </div>
    
    <p style="margin: 0 0 16px 0;">The password for your Spendora account (<strong>${email}</strong>) was successfully updated on <strong>${timestamp}</strong>.</p>
    <p style="margin: 0 0 24px 0;">You can now log in to Spendora with your new password.</p>

    <div class="security-notice" style="border-left-color: #ef4444;">
      <strong>Did not make this change?</strong> If you did not change your password, your account may be compromised. Please contact support immediately at <strong>spendorafinancetracker@gmail.com</strong> to secure your account.
    </div>
  `;

  return {
    to: email,
    subject: `Security Alert: Your Spendora password was successfully changed`,
    html: getBaseHtmlLayout('Password Reset Successful', content),
    text: `Your Spendora account password for ${email} was successfully updated on ${timestamp}. If you did not perform this change, contact spendorafinancetracker@gmail.com immediately.`,
  };
};

/**
 * 5. Welcome Email after verification
 */
export const getWelcomeEmail = (email: string, fullName?: string): EmailTemplatePayload => {
  const name = fullName || 'Financial Pioneer';
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="font-size: 48px;">🚀</span>
      <h2 style="margin: 12px 0 6px 0; color: #ffffff; font-size: 22px; font-weight: 700;">Welcome to Spendora, ${name}!</h2>
      <p style="margin: 0; color: #6366f1; font-weight: 600;">Your smart AI financial coach is ready</p>
    </div>
    
    <p style="margin: 0 0 16px 0;">Your Spendora account is now active and ready to use. Here is what you can do next:</p>
    <ul style="padding-left: 20px; margin-bottom: 24px; color: #cbd5e1; line-height: 1.8;">
      <li><strong>Track daily expenses & income</strong> seamlessly with categorized breakdown</li>
      <li><strong>Set financial goals</strong> and track your debt payoff acceleration</li>
      <li><strong>Receive AI recommendations</strong> to maximize your monthly savings</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="http://localhost:5173/dashboard" class="button-link">Open Spendora Dashboard &rarr;</a>
    </div>
  `;

  return {
    to: email,
    subject: `Welcome to Spendora - Let's grow your wealth!`,
    html: getBaseHtmlLayout('Welcome to Spendora', content),
    text: `Welcome to Spendora, ${name}! Your account is now active. Start tracking your finances at http://localhost:5173/dashboard`,
  };
};
