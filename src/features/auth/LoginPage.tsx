import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { GoogleAuthModal } from '../../components/ui/GoogleAuthModal';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail, KeyRound, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    signInWithEmail,
    signInWithGoogle,
    sendLoginOtp,
    verifyLoginOtp,
    resetPasswordRequest,
    resetPasswordWithOtp,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login Mode: 'password' | 'otp'
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; otp?: string }>({});

  // OTP Login State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Google Modal fallback
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1); // 1: Email, 2: OTP + New Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success?: boolean; message?: string }>({});
  const [isResetting, setIsResetting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const validateForm = () => {
    const errors: { email?: string; password?: string; otp?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (loginMode === 'password' && !password) {
      errors.password = 'Password is required.';
    }

    if (loginMode === 'otp' && otpSent && (!otpCode || otpCode.trim().length !== 6)) {
      errors.otp = 'Please enter the 6-digit code received in your email.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm() || isLoading) {
      return;
    }

    setIsLoading(true);

    if (loginMode === 'password') {
      const res = await signInWithEmail(email, password, rememberMe);
      setIsLoading(false);

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid login credentials.');
      }
    } else {
      // OTP Login Flow
      if (!otpSent) {
        const sendRes = await sendLoginOtp(email);
        setIsLoading(false);
        if (sendRes.success) {
          setOtpSent(true);
          setResendCooldown(60);
        } else {
          setErrorMessage(sendRes.error || 'Failed to send OTP code.');
        }
      } else {
        const verifyRes = await verifyLoginOtp(email, otpCode, rememberMe);
        setIsLoading(false);
        if (verifyRes.success) {
          navigate(from, { replace: true });
        } else {
          const otpErrMsg = verifyRes.error || 'Invalid OTP. You have entered wrong OTP code.';
          setErrorMessage(otpErrMsg);
          setFieldErrors((prev) => ({ ...prev, otp: otpErrMsg }));
        }
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage('');
    const res = await sendLoginOtp(email);
    setIsLoading(false);
    if (res.success) {
      setResendCooldown(60);
    } else {
      setErrorMessage(res.error || 'Failed to resend code.');
    }
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const res = await signInWithGoogle();
    setIsLoading(false);
    if (!res.success) {
      setIsGoogleModalOpen(true);
    }
  };

  // 1. Request Password Reset Code
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      setResetStatus({ success: false, message: 'Please enter a valid email address.' });
      return;
    }
    setIsResetting(true);
    setResetStatus({});
    const result = await resetPasswordRequest(resetEmail);
    setIsResetting(false);
    setResetStatus(result);
    if (result.success) {
      setResetStep(2);
    }
  };

  // 2. Submit OTP + New Password
  const handleForgotSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length !== 6) {
      setResetStatus({ success: false, message: 'Please enter the 6-digit reset code.' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setResetStatus({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    if (password && newPassword === password) {
      setResetStatus({
        success: false,
        message: 'Your new password cannot be the same as your old password. Please choose a different password.',
      });
      return;
    }

    setIsResetting(true);
    setResetStatus({});
    const result = await resetPasswordWithOtp(resetEmail, resetOtp, newPassword);
    setIsResetting(false);

    if (result.success) {
      setResetStatus({ success: true, message: result.message || 'Password reset successfully!' });
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setResetStep(1);
        setEmail(resetEmail);
      }, 2500);
    } else {
      setResetStatus({
        success: false,
        message: result.error || 'Invalid OTP. You have entered wrong OTP code.',
      });
    }
  };

  const handleGoogleModalSubmit = async () => {
    setIsGoogleModalOpen(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <SplitLayout
      illustrationHeading="Take Control of Your Financial Future"
      illustrationSubheading="Track expenses, optimize debt, and achieve your financial goals with AI-powered insights."
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Welcome Back</h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            Enter your credentials or use secure email OTP to access your account.
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loginMode === 'password'
                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                : 'text-text-secondary dark:text-gray-400 hover:text-text-main'
            }`}
          >
            <KeyRound size={14} />
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              loginMode === 'otp'
                ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                : 'text-text-secondary dark:text-gray-400 hover:text-text-main'
            }`}
          >
            <Mail size={14} />
            Email OTP Login
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            disabled={loginMode === 'otp' && otpSent}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            required
          />

          {loginMode === 'password' ? (
            <>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-primary transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setResetStatus({});
                    setResetStep(1);
                    setIsForgotModalOpen(true);
                  }}
                  className="font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading} className="mt-2">
                Login
              </Button>
            </>
          ) : (
            <>
              {otpSent ? (
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium flex items-center justify-between">
                    <span>Code sent to <strong>{email}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode('');
                      }}
                      className="underline font-bold ml-2"
                    >
                      Change
                    </button>
                  </div>

                  {fieldErrors.otp && (
                    <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-semibold flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{fieldErrors.otp}</span>
                    </div>
                  )}

                  <Input
                    label="6-Digit Verification Code"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    error={fieldErrors.otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtpCode(val);
                      if (fieldErrors.otp) {
                        setFieldErrors((prev) => ({ ...prev, otp: undefined }));
                      }
                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    required
                  />

                  <div className="flex items-center justify-between text-xs text-text-secondary dark:text-gray-400">
                    <span>Did not receive the email?</span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className={`font-semibold ${
                        resendCooldown > 0 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-primary hover:underline'
                      }`}
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>

                  <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading} className="mt-2">
                    Verify & Login <ArrowRight size={16} />
                  </Button>
                </div>
              ) : (
                <Button type="submit" fullWidth isLoading={isLoading} disabled={isLoading} className="mt-2">
                  Send Login Code <Mail size={16} />
                </Button>
              )}
            </>
          )}
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-400">OR</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={handleGoogleClick}
          disabled={isLoading}
          className="mt-6 gap-3 dark:border-gray-700 dark:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-text-secondary dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-hover">
            Create Account
          </Link>
        </p>
      </div>

      {/* Google Sign In Modal Fallback */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleModalSubmit}
      />

      {/* Forgot Password Modal with 2-Step OTP Reset */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => {
          setIsForgotModalOpen(false);
          setResetStep(1);
        }}
        title="Reset Your Password"
      >
        {resetStep === 1 ? (
          <form onSubmit={handleForgotRequestOtp} className="space-y-4">
            <p className="text-sm text-text-secondary dark:text-gray-400">
              Enter your registered email address. We'll send a 6-digit verification code from <strong>spendorafinancetracker@gmail.com</strong>.
            </p>

            {resetStatus.message && (
              <div className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-2 ${
                resetStatus.success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {resetStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {resetStatus.message}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setIsForgotModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isResetting}>
                Send Reset Code
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmitNewPassword} className="space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-medium flex items-center justify-between">
              <span>Code sent to <strong>{resetEmail}</strong></span>
              <button
                type="button"
                onClick={() => setResetStep(1)}
                className="underline font-bold"
              >
                Change Email
              </button>
            </div>

            {resetStatus.message && (
              <div className={`p-4 rounded-2xl text-sm font-medium flex items-center gap-2 ${
                resetStatus.success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {resetStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {resetStatus.message}
              </div>
            )}

            <Input
              label="6-Digit Reset Code"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={resetOtp}
              onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />

            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              value={newPassword}
              error={
                !resetStatus.success && resetStatus.message?.toLowerCase().includes('old password')
                  ? resetStatus.message
                  : undefined
              }
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (resetStatus.message) {
                  setResetStatus({});
                }
              }}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="hover:text-primary transition-colors focus:outline-none"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" type="button" onClick={() => setResetStep(1)}>
                Back
              </Button>
              <Button type="submit" isLoading={isResetting}>
                Update Password
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </SplitLayout>
  );
};
