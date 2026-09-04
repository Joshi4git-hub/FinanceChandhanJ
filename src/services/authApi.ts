/**
 * Spendora Backend Auth & OTP API Client
 * Connects frontend React components to the Node.js Express server on port 3001
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

async function postJson<T = any>(endpoint: string, data: Record<string, any>): Promise<T> {
  const url = `${API_BASE_URL}/api/auth/${endpoint}`.replace(/\/{2,}/g, '/').replace(':/', '://');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json().catch(() => ({ success: false, error: 'Network response was not JSON' }));

  if (!response.ok) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }

  return json;
}

export const authApi = {
  /**
   * Request a 6-digit login OTP code to be sent via Gmail SMTP
   */
  async sendLoginOtp(email: string) {
    return postJson<{ success: boolean; message: string; emailSent: boolean }>('send-login-otp', { email });
  },

  /**
   * Verify the 6-digit OTP code and retrieve authenticated user session
   */
  async verifyLoginOtp(email: string, otp: string) {
    return postJson<{ success: boolean; message: string; token: string; user: any }>('verify-login-otp', { email, otp });
  },

  /**
   * Register a new account and dispatch a verification OTP via Gmail SMTP
   */
  async signup(data: {
    fullName: string;
    email: string;
    password: string;
    country?: string;
    occupation?: string;
  }) {
    return postJson<{ success: boolean; message: string; user: any; requiresEmailVerification: boolean; emailSent: boolean }>(
      'signup',
      data
    );
  },

  /**
   * Resend an OTP code with cooldown verification
   */
  async resendOtp(email: string, type: 'login' | 'signup' | 'password_reset' = 'login', fullName?: string) {
    return postJson<{ success: boolean; message: string; emailSent: boolean }>('resend-otp', { email, type, fullName });
  },

  /**
   * Request a password reset OTP code
   */
  async forgotPassword(email: string) {
    return postJson<{ success: boolean; message: string; emailSent: boolean }>('forgot-password', { email });
  },

  /**
   * Reset password with the 6-digit OTP
   */
  async resetPassword(data: { email: string; otp: string; newPassword: string }) {
    return postJson<{ success: boolean; message: string; supabaseUpdated: boolean }>('reset-password', data);
  },

  /**
   * Check backend health status
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`.replace(/\/{2,}/g, '/').replace(':/', '://'));
      return await res.json();
    } catch (e: any) {
      return { status: 'offline', error: e?.message };
    }
  },
};
