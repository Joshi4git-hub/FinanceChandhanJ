import { useState } from 'react';
import { budgetApi } from '../api/budgetApi';

interface UseBudgetMutationOptions {
  onSuccess?: () => void;
  onError?: (err: string) => void;
}

export const useBudgetMutation = (options?: UseBudgetMutationOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateOverallLimit = async (monthStr: string, limit: number) => {
    setIsSubmitting(true);
    try {
      const result = await budgetApi.updateOverallLimit(monthStr, limit);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to update overall budget');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategoryLimit = async (monthStr: string, categoryId: string, limit: number) => {
    setIsSubmitting(true);
    try {
      const result = await budgetApi.updateCategoryLimit(monthStr, categoryId, limit);
      options?.onSuccess?.();
      return result;
    } catch (err: any) {
      options?.onError?.(err.message || 'Failed to update category budget');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    updateOverallLimit,
    updateCategoryLimit,
    isSubmitting
  };
};
