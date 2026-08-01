import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CountrySelect } from '../../components/ui/CountrySelect';
import { Modal } from '../../components/ui/Modal';
import { GoogleAuthModal } from '../../components/ui/GoogleAuthModal';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle, verifyEmailCode } = useAuth();
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

  // Google Modal
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Email verification step
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Weak', color: 'bg-gray-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-danger' };
    if (score === 2 || score === 3) return { score: 3, label: 'Good', color: 'bg-warning' };
    return { score: 4, label: 'Strong', color: 'bg-success' };
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!acceptedTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const res = await signup(fullName, email, password, country, occupation);
    setIsLoading(false);

    if (res.success) {
      setIsVerifyModalOpen(true);
    } else {
      setErrorMessage(res.error || 'Failed to create account.');
    }
  };

  const handleGoogleSubmit = async (gEmail: string, gName: string, gId: string, avatarUrl?: string) => {
    setIsLoading(true);
    const res = await loginWithGoogle(gEmail, gName, gId, avatarUrl);
    setIsLoading(false);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMessage(res.error || 'Google authentication failed.');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');
    setIsVerifying(true);

    const valid = await verifyEmailCode(verifyCode);
    setIsVerifying(false);

    if (valid) {
      setIsVerifyModalOpen(false);
      navigate('/dashboard');
    } else {
      setVerifyError('Invalid verification code. Use 123456 or any 6-digit code for demo.');
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

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountrySelect value={country} onChange={setCountry} label="Country" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-main dark:text-gray-200">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="px-4 py-3 bg-background dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main dark:text-gray-100"
              >
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Strength: <span className="font-semibold text-text-main dark:text-gray-200">{strength.label}</span>
            </p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-text-secondary dark:text-gray-400 text-sm mt-4">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
            />
            <span>
              I accept the <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a> and{' '}
              <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
            </span>
          </label>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
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
          onClick={() => setIsGoogleModalOpen(true)}
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
        onSelectAccount={handleGoogleSubmit}
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
              We've sent a 6-digit confirmation code to <span className="font-bold">{email}</span>. Please enter it below.
            </p>
          </div>

          {verifyError && (
            <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-medium">
              {verifyError}
            </div>
          )}

          <Input
            label="Verification Code"
            type="text"
            placeholder="e.g. 123456"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsVerifyModalOpen(false);
                navigate('/dashboard');
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
