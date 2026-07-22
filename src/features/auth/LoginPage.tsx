import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from './SplitLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <SplitLayout 
      illustrationHeading="Take Control of Your Financial Future"
      illustrationSubheading="Track expenses, optimize debt, and achieve your financial goals with AI-powered insights."
    >
      <div className="bg-white p-8 rounded-[24px] shadow-soft border border-gray-100">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-main mb-2">Welcome Back</h2>
          <p className="text-text-secondary text-sm">Enter your credentials to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="name@example.com"
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary" />
              Remember Me
            </label>
            <a href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Forgot Password?
            </a>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
            Login
          </Button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-text-secondary">OR</span>
          </div>
        </div>

        <Button variant="outline" fullWidth className="mt-6 gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-hover">
            Create Account
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
};
