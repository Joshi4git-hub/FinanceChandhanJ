export interface BudgetLimit {
  id: string;
  month: string; // Format: 'YYYY-MM'
  overallLimit: number;
  categoryLimits: Record<string, number>; // Key is category ID, value is limit
}

export interface BudgetHistoryEntry {
  month: string; // Format: 'YYYY-MM'
  overallLimit: number;
  totalSpent: number;
  isOverBudget: boolean;
}

export interface BudgetProgress {
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
  status: 'SUCCESS' | 'WARNING' | 'DANGER'; // <75%, 75-100%, >100%
}
