import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { DebtForm } from './DebtForm';
import { useDebtMutation } from '../../hooks/useDebtMutation';
import type { DebtFormData, DebtEntry } from '../../types';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: DebtEntry;
}

export const DebtModal: React.FC<DebtModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData
}) => {
  const { addDebt, updateDebt, isSubmitting } = useDebtMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  const handleSubmit = async (data: DebtFormData) => {
    if (initialData) {
      await updateDebt(initialData.id, data);
    } else {
      await addDebt(data);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Debt' : 'Add Debt'}
    >
      <DebtForm 
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
};
