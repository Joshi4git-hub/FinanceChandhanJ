import React from 'react';
import type { ReactNode } from 'react';

interface SplitLayoutProps {
  children: ReactNode;
  illustrationHeading: string;
  illustrationSubheading: string;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  children,
  illustrationHeading,
  illustrationSubheading
}) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Premium Illustration */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle gradients / shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-white mt-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
            </div>
            <span className="font-bold text-xl tracking-tight">Spendora</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {illustrationHeading}
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            {illustrationSubheading}
          </p>
        </div>

        {/* Abstract Floating Elements */}
        <div className="relative z-10 w-full h-64 mt-12 perspective-1000">
           {/* Mockup or abstract cards */}
           <div className="absolute top-4 right-12 w-64 h-36 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transform rotate-[-5deg] p-5">
             <div className="w-8 h-8 rounded-full bg-white/20 mb-4"></div>
             <div className="w-24 h-3 bg-white/20 rounded-full mb-2"></div>
             <div className="w-16 h-2 bg-white/10 rounded-full"></div>
           </div>
           
           <div className="absolute bottom-0 left-4 w-72 h-40 bg-white shadow-2xl rounded-2xl transform rotate-[2deg] p-6 text-text-main flex flex-col justify-center">
             <div className="text-xs text-text-secondary mb-1">Total Balance</div>
             <div className="text-2xl font-bold text-primary mb-4">₹45,800</div>
             <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-success rounded-full"></div>
             </div>
           </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 text-primary justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
            <span className="font-bold text-xl tracking-tight">Spendora</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
