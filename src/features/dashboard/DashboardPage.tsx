import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { HeroSection } from './components/HeroSection';
import { QuickActions } from './components/QuickActions';
import { AICoachCard } from './components/AICoachCard';
import { ChartsSection } from './components/ChartsSection';
import { RecentTransactions } from './components/RecentTransactions';
import { UpcomingEMIs } from './components/UpcomingEMIs';
import { GoalProgress } from './components/GoalProgress';

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Text */}
        <div>
          <h1 className="text-3xl font-bold text-text-main">Welcome back, John! 👋</h1>
          <p className="text-text-secondary mt-1">Here's your financial overview for this month.</p>
        </div>

        <HeroSection />
        <QuickActions />
        <AICoachCard />
        <ChartsSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
          <div className="flex flex-col gap-6">
            <UpcomingEMIs />
            <GoalProgress />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
