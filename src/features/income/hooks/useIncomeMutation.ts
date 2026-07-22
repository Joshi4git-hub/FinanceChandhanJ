import { useState } from 'react';
import { incomeApi } from '../api/incomeApi';
import type { IncomeFormData } from '../types';

interface UseIncomeMutationOptions {
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const useIncomeMutation = (options?: UseIncomeMutationOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIncome = async (data: IncomeFormData) => {
    setIsSubmitting(true);
    try {
      const result = await incomeApi.addIncome(data);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to add income');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateIncome = async (id: string, data: IncomeFormData, mode: 'SINGLE' | 'SERIES') => {
    setIsSubmitting(true);
    try {
      const result = await incomeApi.updateIncome(id, data, mode);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to update income');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteIncome = async (id: string, mode: 'SINGLE' | 'SERIES' | 'SERIES_FUTURE') => {
    setIsSubmitting(true);
    try {
      await incomeApi.deleteIncome(id, mode);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to delete income');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addIncome,
    updateIncome,
    deleteIncome,
    isSubmitting
  };
};
