import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { useDebtMutation } from '../../hooks/useDebtMutation';
import type { DebtEntry } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entry: DebtEntry | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  entry
}) => {
  const { deleteDebt, isSubmitting } = useDebtMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  if (!entry) return null;

  const handleDelete = async () => {
    await deleteDebt(entry.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Debt">
      <div className="text-text-main space-y-4">
        <p>Are you sure you want to delete your <strong>{entry.name}</strong> record?</p>
        <p className="text-sm text-text-secondary">This will remove it from all calculations and cannot be undone.</p>
        
        <div className="pt-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
             className="bg-danger hover:bg-red-600 shadow-soft" 
             onClick={handleDelete}
             isLoading={isSubmitting}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
