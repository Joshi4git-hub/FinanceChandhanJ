import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { verifySmtpConnection } from './config/email.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// 1. Health Check Endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  const smtpStatus = await verifySmtpConnection();
  res.json({
    status: 'ok',
    service: 'Spendora Auth & Gmail SMTP API',
    port: PORT,
    timestamp: new Date().toISOString(),
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      sender: process.env.SMTP_USER || 'spendorafinancetracker@gmail.com',
      configured: !!process.env.SMTP_PASSWORD,
      status: smtpStatus.message,
    },
  });
});

// 2. Authentication API Routes
app.use('/api/auth', authRouter);

// 3. Root Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Spendora Auth Server',
    version: '1.0.0',
    health: '/api/health',
    endpoints: [
      'POST /api/auth/send-login-otp',
      'POST /api/auth/verify-login-otp',
      'POST /api/auth/signup',
      'POST /api/auth/resend-otp',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
    ],
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Spendora Auth Server running on http://localhost:${PORT}`);
  console.log(`📧 Sender: ${process.env.SMTP_USER || 'spendorafinancetracker@gmail.com'}`);
  console.log(`==================================================\n`);

  // Verify SMTP in background and report status
  const smtpResult = await verifySmtpConnection();
  if (smtpResult.ok) {
    console.log(`[SMTP Ready] ${smtpResult.message}`);
  } else {
    console.warn(`[SMTP Notice] ${smtpResult.message}`);
  }
});
