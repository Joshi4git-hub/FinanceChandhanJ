import { useState, useEffect, useCallback } from 'react';
import { incomeApi } from '../api/incomeApi';
import type { IncomeEntry } from '../types';

export const useIncomeData = () => {
  const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const fetchIncomes = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      setError(null);
      
      const offset = reset ? 0 : incomes.length;
      const { data, total: fetchedTotal } = await incomeApi.getIncomes(10, offset);
      
      setIncomes(prev => reset ? data : [...prev, ...data]);
      setTotal(fetchedTotal);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch income entries');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [incomes.length]);

  // Initial load
  useEffect(() => {
    fetchIncomes(true);
  }, []);

  const hasMore = incomes.length < total;

  const loadMore = () => {
    if (!isLoading && !isFetchingMore && hasMore) {
      fetchIncomes(false);
    }
  };

  const filteredIncomes = incomes.filter(inc => {
    if (categoryFilter === 'ALL') return true;
    return inc.category === categoryFilter;
  });

  return {
    incomes: filteredIncomes,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchIncomes(true),
    categoryFilter,
    setCategoryFilter,
  };
};
