import React from 'react';
import { DashboardLayout } from '../../../../features/dashboard/DashboardLayout';
import { MonthlyBudgetCard } from './MonthlyBudgetCard';
import { BudgetAlertsBanner } from './BudgetAlertsBanner';
import { CategoryBudgetList } from '../CategoryBudgets/CategoryBudgetList';
import { BudgetHistory } from '../BudgetHistory/BudgetHistory';
import { useBudgetData } from '../../hooks/useBudgetData';
import { useBudgetMutation } from '../../hooks/useBudgetMutation';
import { useBudgetAlerts } from '../../hooks/useBudgetAlerts';
import { Button } from '../../../../components/ui/Button';

export const BudgetOverview: React.FC = () => {
  // Use current month 'YYYY-MM'
  const currentMonth = new Date().toISOString().substring(0, 7);

  const {
    overallProgress,
    categoryProgress,
    isLoading,
    error,
    refetch
  } = useBudgetData(currentMonth);

  const { updateOverallLimit, updateCategoryLimit, isSubmitting } = useBudgetMutation({
    onSuccess: refetch
  });

  const alerts = useBudgetAlerts(overallProgress, categoryProgress);

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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-1">Budget Planner</h1>
        <p className="text-text-secondary">Set limits and stick to your financial goals.</p>
      </div>

      <BudgetAlertsBanner alerts={alerts} />

      <MonthlyBudgetCard 
        progress={overallProgress}
        onUpdateLimit={(limit) => updateOverallLimit(currentMonth, limit)}
        isUpdating={isSubmitting}
      />

      <CategoryBudgetList 
        categoryProgress={categoryProgress}
        overallLimit={overallProgress.limit}
        onUpdateCategoryLimit={(catId, limit) => updateCategoryLimit(currentMonth, catId, limit)}
        isUpdating={isSubmitting}
      />

      <BudgetHistory />
      
    </DashboardLayout>
  );
};
