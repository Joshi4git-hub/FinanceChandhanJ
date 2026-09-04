import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { IncomeForm } from './IncomeForm';
import { useIncomeMutation } from '../../hooks/useIncomeMutation';
import type { IncomeFormData, IncomeEntry } from '../../types';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IncomeEntry;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData
}) => {
  const { addIncome, updateIncome, isSubmitting } = useIncomeMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  const handleSubmit = async (data: IncomeFormData, mode: 'SINGLE' | 'SERIES') => {
    if (initialData) {
      await updateIncome(initialData.id, data, mode);
    } else {
      await addIncome(data);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Income' : 'Add Income'}
    >
      <IncomeForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
