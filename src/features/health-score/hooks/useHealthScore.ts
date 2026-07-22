import { useState, useEffect, useCallback } from 'react';
import { incomeApi } from '../../income/api/incomeApi';
import { expenseApi } from '../../expense/api/expenseApi';
import { debtApi } from '../../debt/api/debtApi';
import { budgetApi } from '../../budget/api/budgetApi';
import { calculateHealthScore } from '../engine/calculateHealthScore';
import type { HealthScoreResult } from '../types';

export const useHealthScore = () => {
  const [result, setResult] = useState<HealthScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentMonth = new Date().toISOString().substring(0, 7);

      // Fetch all required data in parallel
      const [incomesRes, expenses, debts, budgetLimit] = await Promise.all([
        incomeApi.getIncomes(100, 0), // get lots of incomes
        expenseApi.getExpenses(),
        debtApi.getDebts(),
        budgetApi.getBudgetLimit(currentMonth)
      ]);

      // Aggregate Income (Filtering to current month for simplicity, though a real app might average last 3 months)
      const monthlyIncome = incomesRes.data
        .filter(i => i.dateReceived.startsWith(currentMonth))
        .reduce((sum, i) => sum + i.amount, 0);

      // Aggregate Expenses
      const monthlyExpenses = expenses
        .filter(e => e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);

      // Aggregate Debts
      const totalDebtPrincipal = debts.reduce((sum, d) => sum + d.principal, 0);
      const totalMonthlyEmi = debts.reduce((sum, d) => sum + (d.emi || 0), 0);

      // Run pure engine
      const score = calculateHealthScore({
        monthlyIncome,
        monthlyExpenses,
        totalDebtPrincipal,
        totalMonthlyEmi,
        monthlyBudgetLimit: budgetLimit?.overallLimit || 0,
        emergencyFundMonthsSaved: 2.5 // Mock assumption until Mod 11
      });

      setResult(score);

    } catch (err: any) {
      setError(err.message || 'Failed to calculate health score');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    result,
    isLoading,
    error,
    refetch: fetchData
  };
};
