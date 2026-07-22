import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <SplitLayout 
      illustrationHeading="Join the Financial Revolution"
      illustrationSubheading="Sign up in seconds and get access to personalized insights, budgeting tools, and debt optimizers."
    >
      <div className="bg-white p-8 rounded-[24px] shadow-soft border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-main mb-2">Create Account</h2>
          <p className="text-text-secondary text-sm">Start optimizing your finances today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <Input label="Full Name" type="text" placeholder="John Doe" required />
          <Input label="Email Address" type="email" placeholder="name@example.com" required />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-main">Country</label>
              <select className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-main">Occupation</label>
              <select className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all">
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <Input label="Password" type="password" placeholder="••••••••" required />
            <div className="flex gap-1 mt-2">
              <div className="h-1 flex-1 bg-success rounded-full"></div>
              <div className="h-1 flex-1 bg-success rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
              <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-xs text-text-secondary mt-1">Strength: Good</p>
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-text-secondary text-sm mt-4">
            <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary" />
            <span>I accept the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</span>
          </label>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-4">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign In
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
};
