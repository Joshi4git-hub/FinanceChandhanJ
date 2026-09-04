import crypto from 'node:crypto';
import { getSupabaseAdmin } from './supabaseAdmin.js';

const OTP_HASH_SECRET = process.env.OTP_HASH_SECRET || 'spendora_secure_otp_default_hmac_secret_key_2026';
const OTP_EXPIRY_MINUTES = 10;
const COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

export type OtpType = 'login' | 'signup' | 'password_reset';

export interface OtpChallenge {
  id: string;
  email: string;
  otp_hash: string;
  otp_type: OtpType;
  attempts: number;
  max_attempts: number;
  is_used: boolean;
  used_at?: string | null;
  expires_at: string;
  created_at: string;
}

// In-memory fallback cache in case Supabase migration has not been applied yet
const memoryOtpStore = new Map<string, OtpChallenge>();

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export const generateSecureOtp = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Securely hash the OTP using HMAC-SHA256 salted with normalized email
 */
export const hashOtp = (otp: string, email: string): string => {
  const normalizedEmail = email.trim().toLowerCase();
  return crypto
    .createHmac('sha256', OTP_HASH_SECRET)
    .update(`${normalizedEmail}:${otp.trim()}`)
    .digest('hex');
};

/**
 * Check if the user is in a resend cooldown period
 */
export const checkCooldown = async (
  email: string,
  otpType: OtpType
): Promise<{ canSend: boolean; retryAfterSeconds: number }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from('auth_otp_challenges')
      .select('created_at')
      .eq('email', normalizedEmail)
      .eq('otp_type', otpType)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data?.created_at) {
      const createdTime = new Date(data.created_at).getTime();
      const elapsedSeconds = Math.floor((Date.now() - createdTime) / 1000);
      if (elapsedSeconds < COOLDOWN_SECONDS) {
        return {
          canSend: false,
          retryAfterSeconds: COOLDOWN_SECONDS - elapsedSeconds,
        };
      }
    }
  } catch (_err) {
    // continue to memory store fallback
  }

  // Check memory store
  const existing = memoryOtpStore.get(`${normalizedEmail}:${otpType}`);
  if (existing) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existing.created_at).getTime()) / 1000);
    if (elapsedSeconds < COOLDOWN_SECONDS) {
      return {
        canSend: false,
        retryAfterSeconds: COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
  }

  return { canSend: true, retryAfterSeconds: 0 };
};

/**
 * Create and persist a new OTP challenge in Supabase (with in-memory fallback)
 */
export const createOtpChallenge = async (
  email: string,
  otp: string,
  otpType: OtpType = 'login',
  expiryMinutes: number = OTP_EXPIRY_MINUTES
): Promise<{ success: boolean; challengeId: string; error?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const otpHash = hashOtp(otp, normalizedEmail);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryMinutes * 60 * 1000).toISOString();
  const supabase = getSupabaseAdmin();

  const newChallenge: OtpChallenge = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    otp_hash: otpHash,
    otp_type: otpType,
    attempts: 0,
    max_attempts: MAX_ATTEMPTS,
    is_used: false,
    used_at: null,
    expires_at: expiresAt,
    created_at: now.toISOString(),
  };

  // Always update memory store as backup
  memoryOtpStore.set(`${normalizedEmail}:${otpType}`, newChallenge);

  try {
    // 1. Invalidate any existing unused challenges for this email and type
    await supabase
      .from('auth_otp_challenges')
      .update({ is_used: true, used_at: now.toISOString() })
      .eq('email', normalizedEmail)
      .eq('otp_type', otpType)
      .eq('is_used', false);

    // 2. Insert new challenge
    const { data, error } = await supabase
      .from('auth_otp_challenges')
      .insert({
        id: newChallenge.id,
        email: normalizedEmail,
        otp_hash: otpHash,
        otp_type: otpType,
        attempts: 0,
        max_attempts: MAX_ATTEMPTS,
        is_used: false,
        expires_at: expiresAt,
        created_at: newChallenge.created_at,
      })
      .select('id')
      .single();

    if (error) {
      console.warn('[OTP Service] Supabase insert warning (using memory fallback):', error.message);
    }

    return {
      success: true,
      challengeId: data?.id || newChallenge.id,
    };
  } catch (err: any) {
    console.warn('[OTP Service] Supabase error (using memory store):', err?.message);
    return {
      success: true,
      challengeId: newChallenge.id,
    };
  }
};

/**
 * Verify an OTP entered by the user
 */
export const verifyOtpChallenge = async (
  email: string,
  enteredOtp: string,
  otpType: OtpType = 'login'
): Promise<{ valid: boolean; error?: string }> => {
  const normalizedEmail = email.trim().toLowerCase();
  const enteredHash = hashOtp(enteredOtp, normalizedEmail);
  const now = new Date();
  const supabase = getSupabaseAdmin();

  let challenge: OtpChallenge | null = null;
  let isDbBacked = false;

  try {
    const { data, error } = await supabase
      .from('auth_otp_challenges')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('otp_type', otpType)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      challenge = data as OtpChallenge;
      isDbBacked = true;
    }
  } catch (_err) {
    // continue to fallback
  }

  if (!challenge) {
    // Check in-memory store
    const mem = memoryOtpStore.get(`${normalizedEmail}:${otpType}`);
    if (mem && !mem.is_used) {
      challenge = mem;
    }
  }

  if (!challenge) {
    return {
      valid: false,
      error: 'No active verification code found. Please request a new one.',
    };
  }

  // 1. Check expiration
  if (new Date(challenge.expires_at).getTime() < now.getTime()) {
    // Invalidate
    if (isDbBacked) {
      await supabase
        .from('auth_otp_challenges')
        .update({ is_used: true, used_at: now.toISOString() })
        .eq('id', challenge.id);
    }
    challenge.is_used = true;
    return {
      valid: false,
      error: 'Verification code has expired. Please request a new one.',
    };
  }

  // 2. Check maximum attempts
  if (challenge.attempts >= challenge.max_attempts) {
    if (isDbBacked) {
      await supabase
        .from('auth_otp_challenges')
        .update({ is_used: true, used_at: now.toISOString() })
        .eq('id', challenge.id);
    }
    challenge.is_used = true;
    return {
      valid: false,
      error: 'Too many failed attempts. Please request a new verification code.',
    };
  }

  // 3. Verify OTP Hash (Timing-safe comparison)
  const isHashMatch =
    challenge.otp_hash.length === enteredHash.length &&
    crypto.timingSafeEqual(Buffer.from(challenge.otp_hash), Buffer.from(enteredHash));

  if (!isHashMatch) {
    // Increment attempts
    const newAttempts = challenge.attempts + 1;
    if (isDbBacked) {
      await supabase
        .from('auth_otp_challenges')
        .update({ attempts: newAttempts })
        .eq('id', challenge.id);
    }
    challenge.attempts = newAttempts;

    const remaining = challenge.max_attempts - newAttempts;
    return {
      valid: false,
      error: remaining > 0
        ? `Invalid OTP. You have entered wrong OTP code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining)`
        : 'Too many failed attempts. Please request a new verification code.',
    };
  }

  // 4. Mark challenge as used
  if (isDbBacked) {
    await supabase
      .from('auth_otp_challenges')
      .update({ is_used: true, used_at: now.toISOString() })
      .eq('id', challenge.id);
  }
  challenge.is_used = true;
  challenge.used_at = now.toISOString();

  return { valid: true };
};
