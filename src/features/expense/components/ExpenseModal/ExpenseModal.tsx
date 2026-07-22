import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import { useExpenseMutation } from '../../hooks/useExpenseMutation';
import type { ExpenseFormData, ExpenseEntry, CustomExpenseCategory } from '../../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ExpenseEntry;
  customCategories: CustomExpenseCategory[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  customCategories
}) => {
  const { addExpense, updateExpense, addCustomCategory, isSubmitting } = useExpenseMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  const handleSubmit = async (data: ExpenseFormData) => {
    if (initialData) {
      await updateExpense(initialData.id, data);
    } else {
      await addExpense(data);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Expense' : 'Add Expense'}
    >
      <ExpenseForm 
        initialData={initialData}
        customCategories={customCategories}
        onSubmit={handleSubmit}
        onAddCustomCategory={addCustomCategory}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
