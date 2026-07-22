import { useState, useEffect, useCallback, useMemo } from 'react';
import { expenseApi } from '../api/expenseApi';
import type { ExpenseEntry, CustomExpenseCategory } from '../types';
import type { DateRangeFilter, SortOption } from './useExpenseListState';

interface UseExpenseDataParams {
  debouncedSearchQuery: string;
  dateRange: DateRangeFilter;
  sort: SortOption;
  selectedCategories: string[];
}

export const useExpenseData = ({
  debouncedSearchQuery,
  dateRange,
  sort,
  selectedCategories
}: UseExpenseDataParams) => {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [expData, catData] = await Promise.all([
        expenseApi.getExpenses(),
        expenseApi.getCustomCategories()
      ]);
      setExpenses(expData);
      setCustomCategories(catData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Search Filter
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(exp => 
        (exp.notes && exp.notes.toLowerCase().includes(q)) || 
        exp.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter(exp => selectedCategories.includes(exp.category));
    }

    // 3. Date Filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const expDate = (d: string) => new Date(d).getTime();
      
      let cutoff = 0;
      if (dateRange === 'THIS_MONTH') {
        cutoff = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      } else if (dateRange === 'LAST_MONTH') {
        const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
        const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        result = result.filter(exp => {
          const t = expDate(exp.date);
          return t >= firstOfLastMonth && t < firstOfThisMonth;
        });
        cutoff = -1; // Handled
      } else if (dateRange === 'LAST_90_DAYS') {
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).getTime();
      }

      if (cutoff > 0) {
        result = result.filter(exp => expDate(exp.date) >= cutoff);
      }
    }

    // 4. Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'DATE_DESC':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'DATE_ASC':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'AMOUNT_DESC':
          return b.amount - a.amount;
        case 'AMOUNT_ASC':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [expenses, debouncedSearchQuery, selectedCategories, dateRange, sort]);

  return {
    expenses: filteredAndSortedExpenses,
    customCategories,
    isLoading,
    error,
    refetch: fetchData
  };
};
