import React from 'react';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { useHealthScore } from '../hooks/useHealthScore';
import { ScoreGaugeCard } from './ScoreGaugeCard';
import { FactorBreakdownList } from './FactorBreakdownList';
import { ImprovementSuggestions } from './ImprovementSuggestions';
import { Button } from '../../../components/ui/Button';

export const HealthScoreDashboard: React.FC = () => {
  const { result, isLoading, error, refetch } = useHealthScore();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-1 h-96 bg-white rounded-3xl"></div>
          <div className="lg:col-span-2 h-96 bg-white rounded-3xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center">
          <p className="text-danger font-medium mb-4">{error}</p>
          <Button variant="outline" onClick={refetch}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!result) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-1">Financial Health Score</h1>
        <p className="text-text-secondary">Your overall financial well-being, measured across 5 key pillars.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Gauge & Suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <ScoreGaugeCard score={result.overallScore} />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 delay-75">
            <ImprovementSuggestions suggestions={result.suggestions} />
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 delay-150">
          <FactorBreakdownList factors={result.breakdown} />
        </div>
      </div>

    </DashboardLayout>
  );
};
