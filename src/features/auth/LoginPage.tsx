import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { GoogleAuthModal } from '../../components/ui/GoogleAuthModal';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signInWithEmail, signInWithGoogle, resetPasswordRequest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Field level validation errors
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Google Modal fallback
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ success?: boolean; message?: string }>({});
  const [isResetting, setIsResetting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
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

    const res = await signInWithEmail(email, password, rememberMe);
    setIsLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid login credentials.');
    }
  };

  const handleGoogleClick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const res = await signInWithGoogle();
    setIsLoading(false);
    if (!res.success) {
      // If OAuth redirect fails or is not supported in current environment, open modal
      setIsGoogleModalOpen(true);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsResetting(true);
    const result = await resetPasswordRequest(resetEmail);
    setIsResetting(false);
    setResetStatus(result);
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Welcome Back</h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">Enter your credentials to access your account.</p>
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
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            required
          />

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

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Password"
      >
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            Enter your registered email address and we'll send you a password reset link.
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
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </SplitLayout>
  );
};
