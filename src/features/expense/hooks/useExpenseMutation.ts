import { useState } from 'react';
import { expenseApi } from '../api/expenseApi';
import type { ExpenseFormData, CustomExpenseCategory } from '../types';

interface UseExpenseMutationOptions {
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const useExpenseMutation = (options?: UseExpenseMutationOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExpense = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      const result = await expenseApi.addExpense(data);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExpense = async (id: string, data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      const result = await expenseApi.updateExpense(id, data);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setIsSubmitting(true);
    try {
      await expenseApi.deleteExpense(id);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomCategory = async (data: Omit<CustomExpenseCategory, 'id'>) => {
    try {
      return await expenseApi.addCustomCategory(data);
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to create custom category');
      throw err;
    }
  };

  return {
    addExpense,
    updateExpense,
    deleteExpense,
    addCustomCategory,
    isSubmitting
  };
};
