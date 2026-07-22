import { useState, useEffect, useCallback, useMemo } from 'react';
import { debtApi } from '../api/debtApi';
import type { DebtEntry } from '../types';

export type DebtSortOption = 'DUE_DATE_ASC' | 'REMAINING_DESC' | 'INTEREST_DESC';

export const useDebtData = (sortOption: DebtSortOption) => {
  const [debts, setDebts] = useState<DebtEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await debtApi.getDebts();
      setDebts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch debts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedDebts = useMemo(() => {
    const result = [...debts];
    
    result.sort((a, b) => {
      switch (sortOption) {
        case 'DUE_DATE_ASC':
          // Sort by day of month (1-31). In a real app this might need to map to nearest absolute future date
          return a.dueDayOfMonth - b.dueDayOfMonth;
        case 'REMAINING_DESC':
          return b.remainingAmount - a.remainingAmount;
        case 'INTEREST_DESC':
          return b.interestRate - a.interestRate;
        default:
          return 0;
      }
    });

    return result;
  }, [debts, sortOption]);

  const totalRemaining = useMemo(() => debts.reduce((sum, d) => sum + d.remainingAmount, 0), [debts]);
  const totalPrincipal = useMemo(() => debts.reduce((sum, d) => sum + d.principal, 0), [debts]);
  const totalEmi = useMemo(() => debts.reduce((sum, d) => sum + (d.emi || 0), 0), [debts]);

  return {
    debts: sortedDebts,
    totalRemaining,
    totalPrincipal,
    totalEmi,
    isLoading,
    error,
    refetch: fetchData
  };
};
