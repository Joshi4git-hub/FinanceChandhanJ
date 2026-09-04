import { useState, useEffect, useCallback, useMemo } from 'react';
import { budgetApi } from '../api/budgetApi';
import { expenseApi } from '../../expense/api/expenseApi';
import type { BudgetLimit } from '../types';
import type { ExpenseEntry } from '../../expense/types';
import { calculateBudgetProgress } from '../utils/budgetThresholds';

export const useBudgetData = (monthStr: string) => {
  const [budgetLimit, setBudgetLimit] = useState<BudgetLimit | null>(null);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [budgetData, expenseData] = await Promise.all([
        budgetApi.getBudgetLimit(monthStr),
        expenseApi.getExpenses() // In a real app, we'd pass monthStr to filter at DB level
      ]);
      setBudgetLimit(budgetData);
      
      // Filter expenses to just this month
      const filteredExpenses = expenseData.filter(exp => exp.date.startsWith(monthStr));
      setExpenses(filteredExpenses);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch budget data');
    } finally {
      setIsLoading(false);
    }
  }, [monthStr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const aggregatedData = useMemo(() => {
    let totalSpent = 0;
    const categorySpent: Record<string, number> = {};

    expenses.forEach(exp => {
      totalSpent += exp.amount;
      categorySpent[exp.category] = (categorySpent[exp.category] || 0) + exp.amount;
    });

    const overallLimit = budgetLimit?.overallLimit || 0;
    const overallProgress = calculateBudgetProgress(totalSpent, overallLimit);

    const categoryProgress: Record<string, ReturnType<typeof calculateBudgetProgress>> = {};
    
    // Calculate for all categories that have a limit set OR have spending
    const categoryLimits = budgetLimit?.categoryLimits || {};
    const allCategories = new Set([...Object.keys(categoryLimits), ...Object.keys(categorySpent)]);

    allCategories.forEach(catId => {
      const spent = categorySpent[catId] || 0;
      const limit = categoryLimits[catId] || 0;
      categoryProgress[catId] = calculateBudgetProgress(spent, limit);
    });

    return {
      totalSpent,
      overallProgress,
      categoryProgress
    };
  }, [expenses, budgetLimit]);

  return {
    budgetLimit,
    ...aggregatedData,
    isLoading,
    error,
    refetch: fetchData
  };
};
