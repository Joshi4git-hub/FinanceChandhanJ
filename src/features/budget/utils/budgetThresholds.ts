import type { BudgetProgress } from '../types';

export const BUDGET_THRESHOLDS = {
  WARNING_PERCENTAGE: 75,
  DANGER_PERCENTAGE: 100,
};

export const calculateBudgetProgress = (spent: number, limit: number): BudgetProgress => {
  // If no limit is set, default to a safe state
  if (limit <= 0) {
    return {
      spent,
      limit,
      remaining: 0,
      percentage: 0,
      status: 'SUCCESS'
    };
  }

  const remaining = limit - spent;
  const percentage = Math.min((spent / limit) * 100, 200); // Cap visual percentage at 200% for extreme over-budget

  let status: BudgetProgress['status'] = 'SUCCESS';
  if (percentage >= BUDGET_THRESHOLDS.DANGER_PERCENTAGE) {
    status = 'DANGER';
  } else if (percentage >= BUDGET_THRESHOLDS.WARNING_PERCENTAGE) {
    status = 'WARNING';
  }

  return {
    spent,
    limit,
    remaining,
    percentage,
    status
  };
};

export const getProgressColorClass = (status: BudgetProgress['status']) => {
  switch (status) {
    case 'SUCCESS': return 'bg-success';
    case 'WARNING': return 'bg-warning';
    case 'DANGER': return 'bg-danger';
  }
};
