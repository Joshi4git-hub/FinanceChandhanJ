import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, type ProfileRow } from '../lib/supabase';
import { db, type UserAccount, type UserProfile } from '../services/db';
import { authApi } from '../services/authApi';

export interface AuthContextType {
  user: UserAccount | null;
  supabaseUser: SupabaseUser | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    fullName: string,
    email: string,
    password: string,
    country?: string,
    occupation?: string
  ) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>;
  sendLoginOtp: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyLoginOtp: (email: string, otp: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  // Backwards compatibility aliases
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    country?: string,
    occupation?: string
  ) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>;
  loginWithGoogle: (email?: string, fullName?: string, googleId?: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile> & { fullName?: string }) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyEmailCode: (code: string, email?: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'finpilot_auth_token';
const USER_ID_KEY = 'finpilot_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to load or sync profile from Supabase and local DB
  const syncUserProfile = async (sbUser: SupabaseUser) => {
    try {
      const email = sbUser.email || '';
      const fullName =
        sbUser.user_metadata?.full_name ||
        sbUser.user_metadata?.name ||
        email.split('@')[0] ||
        'User';
      const country = sbUser.user_metadata?.country || 'India';
      const occupation = sbUser.user_metadata?.occupation || 'Professional';
      const avatarUrl =
        sbUser.user_metadata?.avatar_url ||
        sbUser.user_metadata?.picture ||
        undefined;

      // 1. Check Supabase profiles table
      let supabaseProfile: ProfileRow | null = null;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .maybeSingle();

        if (!error && data) {
          supabaseProfile = data;
        } else if (!data) {
          // Attempt upsert in Supabase profiles
          const { data: inserted, error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: sbUser.id,
              email,
              full_name: fullName,
              country,
              occupation,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            })
            .select()
            .maybeSingle();

          if (!insertError && inserted) {
            supabaseProfile = inserted;
          }
        }
      } catch (e) {
        console.warn('Supabase profiles query error (falling back to local cache):', e);
      }

      // 2. Sync to local UserAccount representation
      const account: UserAccount = {
        id: sbUser.id,
        email,
        fullName: supabaseProfile?.full_name || fullName,
        passwordHash: '',
        isVerified: !!sbUser.email_confirmed_at || true,
        createdAt: sbUser.created_at || new Date().toISOString(),
      };
      await db.put('users', account);
      setUser(account);

      // 3. Sync to local UserProfile representation
      let localProfile = await db.get<UserProfile>('profiles', sbUser.id);
      if (!localProfile) {
        localProfile = {
          userId: sbUser.id,
          country: supabaseProfile?.country || country,
          currency: (supabaseProfile?.country || country) === 'United States' ? 'USD' : (supabaseProfile?.country || country) === 'United Kingdom' ? 'GBP' : 'INR',
          timezone: 'Asia/Kolkata',
          occupation: supabaseProfile?.occupation || occupation,
          monthlyIncome: 0,
          savingsGoal: 0,
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          avatarUrl: supabaseProfile?.avatar_url || avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        await db.put('profiles', localProfile);
        await db.clearDummyDataForUser(sbUser.id);
      } else {
        localProfile = {
          ...localProfile,
          country: supabaseProfile?.country || localProfile.country || country,
          occupation: supabaseProfile?.occupation || localProfile.occupation || occupation,
          avatarUrl: supabaseProfile?.avatar_url || localProfile.avatarUrl || avatarUrl,
        };
        await db.put('profiles', localProfile);
      }
      setProfile(localProfile);
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (supabaseUser) {
      await syncUserProfile(supabaseUser);
    } else if (user) {
      const p = await db.get<UserProfile>('profiles', user.id);
      setProfile(p);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // First check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Supabase getSession error:', error.message);
        }

        if (session?.user && mounted) {
          setSupabaseUser(session.user);
          setToken(session.access_token);
          localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
          localStorage.setItem(USER_ID_KEY, session.user.id);
          await syncUserProfile(session.user);
        } else {
          // Fallback to local storage
          const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
          const storedUserId = localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);

          if (storedToken && storedUserId && mounted) {
            const foundUser = await db.get<UserAccount>('users', storedUserId);
            if (foundUser) {
              setUser(foundUser);
              setToken(storedToken);
              const foundProfile = await db.get<UserProfile>('profiles', foundUser.id);
              setProfile(foundProfile);
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setSupabaseUser(session.user);
          setToken(session.access_token);
          localStorage.setItem(TOKEN_STORAGE_KEY, session.access_token);
          localStorage.setItem(USER_ID_KEY, session.user.id);
          await syncUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setUser(null);
          setProfile(null);
          setToken(null);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_ID_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(USER_ID_KEY);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 1. Sign In With Email and Password
  const signInWithEmail = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const lowerEmail = email.toLowerCase().trim();

        // Check local DB for updated password hash
        const localUser = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);

        // Since passwordHash in local DB is overwritten with btoa(newPassword) during reset:
        // - Entering the NEW password matches localUser.passwordHash -> LOGIN SUCCEEDS
        // - Entering the OLD password does NOT match localUser.passwordHash -> LOGIN REJECTED
        if (localUser && localUser.passwordHash === btoa(password)) {
          const dummyToken = `jwt_token_${Date.now()}_${localUser.id}`;
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(TOKEN_STORAGE_KEY, dummyToken);
          storage.setItem(USER_ID_KEY, localUser.id);
          setUser(localUser);
          setToken(dummyToken);
          const userProfile = await db.get<UserProfile>('profiles', localUser.id);
          setProfile(userProfile);
          return { success: true };
        }

        return {
          success: false,
          error: error.message || 'Invalid login credentials.',
        };
      }

      if (data.session && data.user) {
        const lowerEmail = email.toLowerCase().trim();
        setSupabaseUser(data.user);
        setToken(data.session.access_token);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
        storage.setItem(USER_ID_KEY, data.user.id);
        await syncUserProfile(data.user);

        // Keep local IndexedDB password hash in sync
        const localUser = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);
        if (localUser) {
          await db.put('users', { ...localUser, passwordHash: btoa(password) });
        }

        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return {
        success: false,
        error: err?.message || 'An unexpected error occurred during login.',
      };
    }
  };

  // 2. Sign Up With Email and Password
  const signUpWithEmail = async (
    fullName: string,
    email: string,
    password: string,
    country: string = 'India',
    occupation: string = 'Professional'
  ) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const cleanName = fullName.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            country,
            occupation,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to create account. Please try again.',
        };
      }

      if (data.user) {
        // Insert/upsert into profiles table
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: cleanEmail,
            full_name: cleanName,
            country,
            occupation,
            updated_at: new Date().toISOString(),
          });
        } catch (profileErr) {
          console.warn('Could not immediately write to profiles table:', profileErr);
        }

        await syncUserProfile(data.user);

        // Check if email confirmation is required
        const requiresEmailVerification =
          !data.session && data.user.identities && data.user.identities.length > 0;

        return {
          success: true,
          requiresEmailVerification: !!requiresEmailVerification,
        };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return {
        success: false,
        error: err?.message || 'Failed to create account. Please try again.',
      };
    }
  };

  // 3. Sign In With Google OAuth
  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const redirectUrl =
        redirectTo || `${window.location.origin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      return {
        success: false,
        error: err?.message || 'Google sign-in could not be completed.',
      };
    }
  };

  // 4. Sign Out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    setSupabaseUser(null);
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  // 5. Update Profile
  const updateProfile = async (
    updated: Partial<UserProfile> & { fullName?: string }
  ): Promise<boolean> => {
    const currentUserId = supabaseUser?.id || user?.id;
    if (!currentUserId || !profile) return false;

    try {
      const { fullName, ...profileUpdates } = updated;
      const mergedProfile: UserProfile = { ...profile, ...profileUpdates };

      // Update Supabase profiles table
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: fullName || user?.fullName,
            phone: mergedProfile.phone,
            country: mergedProfile.country,
            occupation: mergedProfile.occupation,
            avatar_url: mergedProfile.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUserId);
      } catch (e) {
        console.warn('Supabase profile update warning:', e);
      }

      // Update local storage
      await db.put('profiles', mergedProfile);
      setProfile(mergedProfile);

      if (user && fullName && fullName.trim() !== user.fullName) {
        const updatedUser = { ...user, fullName: fullName.trim() };
        await db.put('users', updatedUser);
        setUser(updatedUser);
      }

      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      return false;
    }
  };

  // 6. Send Login OTP via Node.js Gmail SMTP
  const sendLoginOtp = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await authApi.sendLoginOtp(cleanEmail);
      return {
        success: res.success,
        message: res.message || `Login code sent to ${cleanEmail}. Check your inbox!`,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to send login verification code.',
      };
    }
  };

  // 7. Verify Login OTP via Node.js Backend
  const verifyLoginOtp = async (email: string, otp: string, rememberMe: boolean = true) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await authApi.verifyLoginOtp(cleanEmail, otp);

      if (res.success && res.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(TOKEN_STORAGE_KEY, res.token);
        const userId = res.user?.id || `usr_${Date.now()}`;
        storage.setItem(USER_ID_KEY, userId);

        const account: UserAccount = {
          id: userId,
          email: cleanEmail,
          fullName: res.user?.user_metadata?.full_name || cleanEmail.split('@')[0] || 'User',
          passwordHash: '',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };

        await db.put('users', account);
        setUser(account);
        setToken(res.token);

        let userProfile = await db.get<UserProfile>('profiles', userId);
        if (!userProfile) {
          userProfile = {
            userId,
            country: 'India',
            currency: 'INR',
            timezone: 'Asia/Kolkata',
            occupation: 'Professional',
            monthlyIncome: 0,
            savingsGoal: 0,
            emailNotifications: true,
            pushNotifications: true,
            weeklyReports: true,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          };
          await db.put('profiles', userProfile);
          await db.clearDummyDataForUser(userId);
        }
        setProfile(userProfile);
        return { success: true };
      }

      return { success: false, error: 'Invalid OTP. You have entered wrong OTP code.' };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Invalid OTP. You have entered wrong OTP code.',
      };
    }
  };

  // 8. Reset Password Request (Custom Spendora Email via Gmail SMTP)
  const resetPasswordRequest = async (email: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await authApi.forgotPassword(cleanEmail);
      return {
        success: res.success,
        message: res.message || `Password reset code sent to ${cleanEmail}. Check your inbox!`,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Unable to send password reset code.',
      };
    }
  };

  // 9. Reset Password with OTP via Node.js Backend & Supabase
  const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Check if new password matches existing password in local DB
      const localUser = await db.getByIndex<UserAccount>('users', 'email', cleanEmail);
      if (localUser && localUser.passwordHash && localUser.passwordHash === btoa(newPassword)) {
        return {
          success: false,
          error: 'Your new password cannot be the same as your old password. Please choose a different password.',
        };
      }

      const res = await authApi.resetPassword({ email: cleanEmail, otp, newPassword });

      if (res.success) {
        // Permanently replace password hash in local IndexedDB store
        const existingUser = await db.getByIndex<UserAccount>('users', 'email', cleanEmail);
        const updatedAccount: UserAccount = existingUser
          ? { ...existingUser, passwordHash: btoa(newPassword) }
          : {
              id: `usr_${Date.now()}`,
              email: cleanEmail,
              fullName: cleanEmail.split('@')[0],
              passwordHash: btoa(newPassword),
              isVerified: true,
              createdAt: new Date().toISOString(),
            };
        await db.put('users', updatedAccount);

        // Also update default demo user if resetting demo account
        if (cleanEmail === 'john.doe@example.com') {
          const demoUser = await db.get<UserAccount>('users', 'user_demo_default');
          if (demoUser) {
            await db.put('users', { ...demoUser, passwordHash: btoa(newPassword) });
          }
        }
      }

      return {
        success: res.success,
        message: res.message || 'Password reset successfully! You can now log in.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Invalid OTP or failed to reset password.',
      };
    }
  };

  // 10. Verify Email OTP / Code
  const verifyEmailCode = async (code: string, emailParam?: string) => {
    const targetEmail = emailParam || user?.email || supabaseUser?.email;
    const cleanCode = code.trim();

    if (!cleanCode || cleanCode.length < 6) {
      return false;
    }

    if (targetEmail) {
      try {
        const verifyRes = await authApi.verifyLoginOtp(targetEmail, cleanCode);
        if (verifyRes.success) {
          if (user) {
            const updated = { ...user, isVerified: true };
            await db.put('users', updated);
            setUser(updated);
          }
          return true;
        }
      } catch (e) {
        console.warn('Backend verifyOtp error (falling back to client verify):', e);
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: targetEmail,
          token: cleanCode,
          type: 'signup',
        });
        if (!error && data.user) {
          setSupabaseUser(data.user);
          await syncUserProfile(data.user);
          return true;
        }
      } catch (e) {
        console.warn('Supabase verifyOtp error (checking demo codes):', e);
      }
    }

    // Demo / fallback verification - only allow exact demo code 123456
    if (cleanCode === '123456') {
      if (user) {
        const updated = { ...user, isVerified: true };
        await db.put('users', updated);
        setUser(updated);
      }
      return true;
    }

    return false;
  };

  // Aliases for compatibility
  const login = signInWithEmail;
  const signup = signUpWithEmail;
  const logout = () => {
    signOut();
  };
  const loginWithGoogle = async (
    gEmail?: string,
    gName?: string,
    gId?: string,
    avatarUrl?: string
  ) => {
    if (!gEmail && !gId) {
      return signInWithGoogle();
    }
    // Handle mock modal callback if invoked directly
    try {
      const lowerEmail = (gEmail || 'user@example.com').toLowerCase().trim();
      let existingUser = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);
      if (!existingUser) {
        existingUser = {
          id: `google_${gId || Date.now()}`,
          email: lowerEmail,
          fullName: (gName || '').trim() || lowerEmail.split('@')[0],
          passwordHash: '',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        await db.put('users', existingUser);

        const newProfile: UserProfile = {
          userId: existingUser.id,
          country: 'India',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          monthlyIncome: 0,
          savingsGoal: 0,
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        await db.put('profiles', newProfile);
        await db.clearDummyDataForUser(existingUser.id);
      }

      const sessionToken = `google_token_${Date.now()}_${existingUser.id}`;
      localStorage.setItem(TOKEN_STORAGE_KEY, sessionToken);
      localStorage.setItem(USER_ID_KEY, existingUser.id);

      setUser(existingUser);
      setToken(sessionToken);
      const userProf = await db.get<UserProfile>('profiles', existingUser.id);
      setProfile(userProf);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Google sign-in could not be completed.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        profile,
        token,
        isAuthenticated: !!user || !!supabaseUser,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        sendLoginOtp,
        verifyLoginOtp,
        signInWithGoogle,
        signOut,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        resetPasswordRequest,
        resetPasswordWithOtp,
        verifyEmailCode,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
