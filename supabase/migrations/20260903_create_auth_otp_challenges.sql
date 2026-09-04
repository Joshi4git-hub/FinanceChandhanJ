-- ==============================================================================
-- Supabase Migration: Create Auth OTP Challenges Table with Indexes & RLS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.auth_otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  otp_type TEXT NOT NULL DEFAULT 'login', -- 'login', 'signup', 'password_reset'
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast lookups & rate limiting checks
CREATE INDEX IF NOT EXISTS idx_auth_otp_lookup 
  ON public.auth_otp_challenges (email, otp_type, is_used, expires_at);

CREATE INDEX IF NOT EXISTS idx_auth_otp_created_at 
  ON public.auth_otp_challenges (created_at DESC);

-- Enable RLS
ALTER TABLE public.auth_otp_challenges ENABLE ROW LEVEL SECURITY;

-- Allow Service Role to have full access (Backend Server)
CREATE POLICY "Service role full access on auth_otp_challenges"
  ON public.auth_otp_challenges
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
