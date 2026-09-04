import { useMemo } from 'react';
import type { BudgetProgress } from '../types';

export interface BudgetAlert {
  id: string;
  type: 'OVERALL' | 'CATEGORY';
  categoryId?: string;
  status: 'WARNING' | 'DANGER';
  message: string;
}

export const useBudgetAlerts = (
  overallProgress: BudgetProgress, 
  categoryProgress: Record<string, BudgetProgress>
) => {
  const alerts = useMemo(() => {
    const newAlerts: BudgetAlert[] = [];

    // Check overall budget
    if (overallProgress.status !== 'SUCCESS' && overallProgress.limit > 0) {
      newAlerts.push({
        id: 'overall',
        type: 'OVERALL',
        status: overallProgress.status,
        message: overallProgress.status === 'DANGER' 
          ? `You have exceeded your overall monthly budget by ₹${Math.abs(overallProgress.remaining).toLocaleString()}`
          : `You have used ${overallProgress.percentage.toFixed(0)}% of your overall monthly budget.`
      });
    }

    // Check individual categories
    Object.entries(categoryProgress).forEach(([categoryId, progress]) => {
      if (progress.status !== 'SUCCESS' && progress.limit > 0) {
        newAlerts.push({
          id: `cat_${categoryId}`,
          type: 'CATEGORY',
          categoryId,
          status: progress.status,
          message: progress.status === 'DANGER'
            ? `Category over budget: exceeded by ₹${Math.abs(progress.remaining).toLocaleString()}`
            : `Category nearing limit: ${progress.percentage.toFixed(0)}% used`
        });
      }
    });

    return newAlerts;
  }, [overallProgress, categoryProgress]);

  return alerts;
};
