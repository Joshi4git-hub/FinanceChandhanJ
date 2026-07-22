import React, { useState } from 'react';
import { DashboardLayout } from '../../dashboard/DashboardLayout';
import { useOptimizer } from '../hooks/useOptimizer';
import { ExtraPaymentInput } from './ExtraPaymentInput';
import { BestStrategyHighlight } from './BestStrategyHighlight';
import { StrategyComparison } from './StrategyComparison';
import { Button } from '../../../components/ui/Button';

export const OptimizerDashboard: React.FC = () => {
  const [extraPayment, setExtraPayment] = useState<number>(0);
  
  const { debts, optimizerData, isLoading, error, refetch } = useOptimizer(extraPayment);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-64 bg-white rounded-3xl animate-pulse mb-6"></div>
        <div className="h-96 bg-white rounded-3xl animate-pulse"></div>
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

  if (debts.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-text-main mb-2">No Debts to Optimize</h2>
          <p className="text-text-secondary">Add some debts in the Debt Management module first.</p>
        </div>
      </DashboardLayout>
    );
  }

  // If optimizerData is somehow null but debts exist, show fallback
  if (!optimizerData) return null;

  const bestResult = optimizerData.bestStrategy 
    ? optimizerData[optimizerData.bestStrategy.toLowerCase() as 'avalanche' | 'snowball'] 
    : null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-1">Debt Optimizer</h1>
        <p className="text-text-secondary">Discover the fastest, cheapest path to becoming debt-free.</p>
      </div>

      <ExtraPaymentInput 
        value={extraPayment} 
        onChange={setExtraPayment} 
      />

      {bestResult && extraPayment > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <BestStrategyHighlight 
            bestResult={bestResult} 
            extraPayment={extraPayment} 
          />
        </div>
      )}

      {extraPayment === 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <BestStrategyHighlight 
            bestResult={optimizerData.base} 
            extraPayment={0} 
          />
        </div>
      )}

      <StrategyComparison data={optimizerData} />

    </DashboardLayout>
  );
};
