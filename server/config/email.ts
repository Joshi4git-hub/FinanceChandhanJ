import nodemailer from 'nodemailer';
import type { EmailTemplatePayload } from '../templates/emailTemplates.js';

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = (process.env.SMTP_USER || 'spendorafinancetracker@gmail.com').trim();
  // Strip all whitespace and surrounding quotes from the Google App Password
  const pass = (process.env.SMTP_PASSWORD || '').replace(/[\s"']/g, '').trim();
  const from = (process.env.EMAIL_FROM || `Spendora <${user}>`).trim();

  return { host, port, secure, user, pass, from };
};

let cachedTransporter: nodemailer.Transporter | null = null;
let lastPass = '';

export const getTransporter = (): nodemailer.Transporter => {
  const { host, port, secure, user, pass } = getSmtpConfig();

  if (!cachedTransporter || pass !== lastPass) {
    lastPass = pass;
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }
  return cachedTransporter;
};

/**
 * Verify Gmail SMTP connection status
 */
export const verifySmtpConnection = async (): Promise<{ ok: boolean; message: string }> => {
  const { user, pass } = getSmtpConfig();

  if (!pass) {
    return {
      ok: false,
      message: 'SMTP_PASSWORD is empty. Please set a 16-character Google App Password in .env.',
    };
  }

  try {
    const t = getTransporter();
    await t.verify();
    return {
      ok: true,
      message: `Gmail SMTP connected successfully (${user})`,
    };
  } catch (error: any) {
    console.error('Gmail SMTP Verification Error:', error);
    return {
      ok: false,
      message: error?.message || 'Failed to authenticate with Gmail SMTP.',
    };
  }
};

/**
 * Send an email using Spendora Gmail SMTP
 */
export const sendEmail = async (template: EmailTemplatePayload): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const { pass, from } = getSmtpConfig();

  if (!pass) {
    const err = 'Cannot send email: SMTP_PASSWORD is not configured in .env. Use a 16-character Google App Password.';
    console.warn(`[Spendora Email Warning] ${err}`);
    return { success: false, error: err };
  }

  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from,
      to: template.to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    console.log(`[Spendora Email] Successfully sent "${template.subject}" to ${template.to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Spendora Email Error] Failed sending email to ${template.to}:`, error);
    return {
      success: false,
      error: error?.message || 'Failed to send email via Gmail SMTP.',
    };
  }
};
