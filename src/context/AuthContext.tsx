import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { UserAccount, UserProfile } from '../services/db';

interface AuthContextType {
  user: UserAccount | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, fullName: string, googleId: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, email: string, password: string, country?: string, occupation?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile> & { fullName?: string }) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailCode: (code: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'finpilot_auth_token';
const USER_ID_KEY = 'finpilot_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    if (!user) return;
    const p = await db.get<UserProfile>('profiles', user.id);
    setProfile(p);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await db.ensureDefaultUser();

        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUserId = localStorage.getItem(USER_ID_KEY) || sessionStorage.getItem(USER_ID_KEY);

        if (!storedToken || !storedUserId) return;

        const foundUser = await db.get<UserAccount>('users', storedUserId);
        if (!foundUser) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_ID_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(USER_ID_KEY);
          return;
        }

        setUser(foundUser);
        setToken(storedToken);
        const foundProfile = await db.get<UserProfile>('profiles', foundUser.id);
        setProfile(foundProfile);
      } catch (err) {
        console.error('Failed to initialize session', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, _password: string, rememberMe: boolean = false) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      let existingUser = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);

      if (!existingUser) {
        return { success: false, error: 'No account found with this email address.' };
      }

      if (existingUser.passwordHash !== btoa(_password)) {
        return { success: false, error: 'Incorrect password.' };
      }

      const dummyToken = `jwt_token_${Date.now()}_${existingUser.id}`;
      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem(TOKEN_STORAGE_KEY, dummyToken);
      storage.setItem(USER_ID_KEY, existingUser.id);

      setUser(existingUser);
      setToken(dummyToken);

      const userProfile = await db.get<UserProfile>('profiles', existingUser.id);
      setProfile(userProfile);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'An unexpected error occurred during login.' };
    }
  };

  const loginWithGoogle = async (email: string, fullName: string, googleId: string, avatarUrl?: string) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      let existingUser = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);
      if (!existingUser) {
        existingUser = {
          id: `google_${googleId || Date.now()}`,
          email: lowerEmail,
          fullName: fullName.trim() || lowerEmail.split('@')[0],
          passwordHash: '',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        await db.put<UserAccount>('users', existingUser);

        const newProfile: UserProfile = {
          userId: existingUser.id,
          country: 'India',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          monthlyIncome: 65000,
          savingsGoal: 100000,
          emailNotifications: true,
          pushNotifications: true,
          weeklyReports: true,
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        await db.put<UserProfile>('profiles', newProfile);
        await db.seedUserData(existingUser.id);
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

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    country: string = 'India',
    occupation: string = 'Professional'
  ) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const existing = await db.getByIndex<UserAccount>('users', 'email', lowerEmail);
      if (existing) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUserId = `user_${Date.now()}`;
      const newUser: UserAccount = {
        id: newUserId,
        email: lowerEmail,
        fullName: fullName.trim(),
        passwordHash: btoa(password),
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      await db.put<UserAccount>('users', newUser);
      const newProfile: UserProfile = {
        userId: newUserId,
        country,
        currency: country === 'United States' ? 'USD' : country === 'United Kingdom' ? 'GBP' : 'INR',
        timezone: 'Asia/Kolkata',
        occupation,
        monthlyIncome: 0,
        savingsGoal: 0,
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
      };
      await db.put<UserProfile>('profiles', newProfile);
      setProfile(newProfile);

      const dummyToken = `jwt_token_${Date.now()}_${newUserId}`;
      localStorage.setItem(TOKEN_STORAGE_KEY, dummyToken);
      localStorage.setItem(USER_ID_KEY, newUserId);

      setUser(newUser);
      setToken(dummyToken);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Failed to create account. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_KEY);
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  const updateProfile = async (updated: Partial<UserProfile> & { fullName?: string }): Promise<boolean> => {
    if (!user || !profile) return false;
    try {
      const { fullName, ...profileUpdates } = updated;
      const mergedProfile: UserProfile = { ...profile, ...profileUpdates };
      await db.put<UserProfile>('profiles', mergedProfile);
      setProfile(mergedProfile);
      if (fullName && fullName.trim() !== user.fullName) {
        const updatedUser = { ...user, fullName: fullName.trim() };
        await db.put<UserAccount>('users', updatedUser);
        setUser(updatedUser);
      }
      return true;
    } catch (err) {
      console.error('Failed to update profile', err);
      return false;
    }
  };

  const resetPasswordRequest = async (email: string) => {
    const existing = await db.getByIndex<UserAccount>('users', 'email', email.toLowerCase().trim());
    if (!existing) {
      return { success: false, message: 'If an account exists for this email, password reset instructions have been sent.' };
    }
    return { success: true, message: `Password reset link sent to ${email}. Check your inbox!` };
  };

  const verifyEmailCode = async (code: string) => {
    if (code === '123456' || code.length === 6) {
      if (user) {
        const updated = { ...user, isVerified: true };
        await db.put<UserAccount>('users', updated);
        setUser(updated);
      }
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        resetPasswordRequest,
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
