import { useState } from 'react';
import { debtApi } from '../api/debtApi';
import type { DebtFormData } from '../types';

interface UseDebtMutationOptions {
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const useDebtMutation = (options?: UseDebtMutationOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addDebt = async (data: DebtFormData) => {
    setIsSubmitting(true);
    try {
      const result = await debtApi.addDebt(data);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to add debt');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDebt = async (id: string, data: DebtFormData) => {
    setIsSubmitting(true);
    try {
      const result = await debtApi.updateDebt(id, data);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to update debt');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDebt = async (id: string) => {
    setIsSubmitting(true);
    try {
      await debtApi.deleteDebt(id);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to delete debt');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    addDebt,
    updateDebt,
    deleteDebt,
    isSubmitting
  };
};
