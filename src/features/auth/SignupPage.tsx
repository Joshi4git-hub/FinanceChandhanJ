import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/ui/CountrySelect';
import { Modal } from '../../components/ui/Modal';
import { GoogleAuthModal } from '../../components/ui/GoogleAuthModal';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signUpWithEmail, signInWithGoogle, verifyEmailCode, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState('India');
  const [occupation, setOccupation] = useState('Professional');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    country?: string;
    occupation?: string;
    password?: string;
    terms?: string;
  }>({});

  // Google Modal fallback
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Email verification step
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-200 dark:bg-gray-700' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-danger' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-warning' };
    return { score: 4, label: 'Strong', color: 'bg-success' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = () => {
    const errors: {
      fullName?: string;
      email?: string;
      country?: string;
      occupation?: string;
      password?: string;
      terms?: string;
    } = {};

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      errors.fullName = 'Full Name is required.';
    }

    if (!trimmedEmail) {
      errors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!country) {
      errors.country = 'Please select your country.';
    }

    if (!occupation) {
      errors.occupation = 'Please select your occupation.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!acceptedTerms) {
      errors.terms = 'You must accept the Terms of Service and Privacy Policy to continue.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm() || isLoading) {
      return;
    }

    setIsLoading(true);
    const res = await signUpWithEmail(fullName, email, password, country, occupation);
    setIsLoading(false);

    if (res.success) {
      if (res.requiresEmailVerification) {
        setIsVerifyModalOpen(true);
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Failed to create account.');
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

  const handleGoogleModalSubmit = async () => {
    setIsGoogleModalOpen(false);
    navigate('/dashboard', { replace: true });
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setIsVerifying(true);

    const valid = await verifyEmailCode(verifyCode, email);
    setIsVerifying(false);

    if (valid) {
      setIsVerifyModalOpen(false);
      navigate('/dashboard', { replace: true });
    } else {
      setVerifyError('Invalid OTP. You have entered wrong OTP code. Please check your email or enter 123456.');
    }
  };

  return (
    <SplitLayout
      illustrationHeading="Join the Financial Revolution"
      illustrationSubheading="Sign up in seconds and get access to personalized insights, budgeting tools, and debt optimizers."
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[24px] shadow-soft border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">Create Account</h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">Start optimizing your finances today.</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-center gap-3 text-danger text-sm font-medium">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            error={fieldErrors.fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
            required
          />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountrySelect
              value={country}
              onChange={(c) => {
                setCountry(c);
                if (fieldErrors.country) {
                  setFieldErrors((prev) => ({ ...prev, country: undefined }));
                }
              }}
              label="Country"
              error={fieldErrors.country}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-main dark:text-gray-200">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => {
                  setOccupation(e.target.value);
                  if (fieldErrors.occupation) {
                    setFieldErrors((prev) => ({ ...prev, occupation: undefined }));
                  }
                }}
                className={`px-4 py-3 bg-background dark:bg-gray-800 border ${
                  fieldErrors.occupation ? 'border-danger' : 'border-gray-200 dark:border-gray-700'
                } rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main dark:text-gray-100`}
              >
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Other">Other</option>
              </select>
              {fieldErrors.occupation && (
                <p className="text-xs text-danger">{fieldErrors.occupation}</p>
              )}
            </div>
          </div>

          <div>
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

            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    step <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
              Strength:{' '}
              <span className={`font-semibold ${
                strength.score >= 3 ? 'text-success' : strength.score === 2 ? 'text-amber-500' : 'text-danger'
              }`}>
                {strength.label}
              </span>
            </p>
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer text-text-secondary dark:text-gray-400 text-sm mt-4">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (e.target.checked && fieldErrors.terms) {
                    setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                  }
                }}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              />
              <span>
                I accept the <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and{' '}
                <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="text-xs text-danger mt-1.5">{fieldErrors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading || !acceptedTerms}
            className="mt-4"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 relative">
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

        <p className="mt-6 text-center text-sm text-text-secondary dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign In
          </Link>
        </p>
      </div>

      {/* Google Sign In Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleModalSubmit}
      />

      {/* Email Verification Modal */}
      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Verify Your Email"
      >
        <form onSubmit={handleVerifySubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl text-primary text-sm">
            <Mail size={24} className="shrink-0" />
            <p>
              We've sent a 6-digit verification code from <strong>spendorafinancetracker@gmail.com</strong> to <span className="font-bold">{email}</span>.
            </p>
          </div>

          {verifyError && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{verifyError}</span>
            </div>
          )}

          <Input
            label="6-Digit Verification Code"
            type="text"
            maxLength={6}
            placeholder="123456"
            value={verifyCode}
            error={verifyError}
            onChange={(e) => {
              setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (verifyError) setVerifyError('');
            }}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsVerifyModalOpen(false);
                navigate('/dashboard', { replace: true });
              }}
            >
              Skip for Now
            </Button>
            <Button type="submit" isLoading={isVerifying} className="gap-2">
              <CheckCircle size={16} />
              Verify & Continue
            </Button>
          </div>
        </form>
      </Modal>
    </SplitLayout>
  );
};
