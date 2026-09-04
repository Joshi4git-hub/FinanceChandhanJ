import { useState, useEffect, useMemo, useCallback } from 'react';
import { debtApi } from '../../debt/api/debtApi';
import type { DebtEntry } from '../../debt/types';
import { simulatePayoff } from '../engine/simulatePayoff';
import type { OptimizerData } from '../types';

export const useOptimizer = (extraPayment: number) => {
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
      setError(err.message || 'Failed to fetch debts for optimizer');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const optimizerData: OptimizerData | null = useMemo(() => {
    if (debts.length === 0) return null;

    // Run simulations
    const base = simulatePayoff(debts, 0, 'BASE');
    
    // Safety check: if BASE is infinite loop (600 months cap hit), we shouldn't show exact savings
    const baseHitCap = base.totalMonths === 600;

    let avalanche = simulatePayoff(debts, extraPayment, 'AVALANCHE');
    let snowball = simulatePayoff(debts, extraPayment, 'SNOWBALL');

    // Calculate savings
    avalanche.interestSaved = baseHitCap ? 0 : Math.max(0, base.totalInterestPaid - avalanche.totalInterestPaid);
    avalanche.monthsSaved = baseHitCap ? 0 : Math.max(0, base.totalMonths - avalanche.totalMonths);
    
    snowball.interestSaved = baseHitCap ? 0 : Math.max(0, base.totalInterestPaid - snowball.totalInterestPaid);
    snowball.monthsSaved = baseHitCap ? 0 : Math.max(0, base.totalMonths - snowball.totalMonths);

    // Determine Best Strategy (Highest Interest Saved)
    let bestStrategy: 'AVALANCHE' | 'SNOWBALL' | null = null;
    
    if (avalanche.totalInterestPaid < snowball.totalInterestPaid) {
      bestStrategy = 'AVALANCHE';
    } else if (snowball.totalInterestPaid < avalanche.totalInterestPaid) {
      bestStrategy = 'SNOWBALL';
    } else {
      // If interest paid is equal (e.g. only 1 debt), default to AVALANCHE
      bestStrategy = 'AVALANCHE';
    }

    // If extra payment is 0 and base didn't hit cap, there is no "best" because they are all the same
    if (extraPayment === 0) {
       bestStrategy = null;
    }

    return {
      base,
      avalanche,
      snowball,
      bestStrategy
    };

  }, [debts, extraPayment]);

  return {
    debts,
    optimizerData,
    isLoading,
    error,
    refetch: fetchData
  };
};
