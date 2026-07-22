import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Current Balance - Glassmorphism hero */}
      <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-hover rounded-[24px] p-8 text-white shadow-soft relative overflow-hidden flex flex-col justify-between">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-medium">
              <Wallet size={16} />
              Total Balance
            </div>
            <select className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20 text-white text-sm rounded-full px-4 py-1.5 outline-none cursor-pointer appearance-none">
              <option className="text-text-main" value="all">All Accounts</option>
              <option className="text-text-main" value="checking">Checking</option>
              <option className="text-text-main" value="savings">Savings</option>
            </select>
          </div>
          
          <div>
            <div className="flex items-end gap-4 mb-2">
              <h2 className="text-5xl font-bold tracking-tight">₹45,800</h2>
              <div className="flex items-center gap-1 text-success bg-success/20 px-2 py-1 rounded-md text-sm font-semibold mb-1 backdrop-blur-md">
                <TrendingUp size={16} />
                +12.5%
              </div>
            </div>
            <p className="text-white/80 font-medium">vs last month (₹40,710)</p>
          </div>
        </div>
      </div>

      {/* Monthly Metrics */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-success/10 flex items-center justify-center text-success">
              <ArrowDownRight size={20} />
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-semibold bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp size={14} /> 12%
            </div>
          </div>
          <p className="text-text-secondary text-sm font-medium mb-1">Monthly Income</p>
          <h3 className="text-2xl font-bold text-text-main">₹20,000</h3>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-danger/10 flex items-center justify-center text-danger">
              <ArrowUpRight size={20} />
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-semibold bg-success/10 px-2 py-1 rounded-full">
              <TrendingDown size={14} /> 8%
            </div>
          </div>
          <p className="text-text-secondary text-sm font-medium mb-1">Monthly Expenses</p>
          <h3 className="text-2xl font-bold text-text-main">₹11,250</h3>
        </div>
      </div>

      {/* Health Score & Debt */}
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex-1 flex flex-col justify-center">
           <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-warning/10 flex items-center justify-center text-warning">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-text-secondary text-sm font-medium mb-1">Total Debt</p>
          <h3 className="text-2xl font-bold text-text-main">₹80,000</h3>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[24px] p-6 shadow-soft text-white flex-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Health Score</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-bold">82</h3>
                <span className="text-white/50 text-sm">/100</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-success/30 flex items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-success" strokeDasharray="289" strokeDashoffset="52" strokeLinecap="round" />
              </svg>
              <span className="text-success font-bold text-sm">Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
