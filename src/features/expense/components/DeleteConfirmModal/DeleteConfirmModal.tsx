import React from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { useExpenseMutation } from '../../hooks/useExpenseMutation';
import type { ExpenseEntry } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entry: ExpenseEntry | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  entry
}) => {
  const { deleteExpense, isSubmitting } = useExpenseMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  if (!entry) return null;

  const handleDelete = async () => {
    await deleteExpense(entry.id);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Expense">
      <div className="text-text-main space-y-4">
        <p>Are you sure you want to delete this expense of <strong>₹{entry.amount.toLocaleString()}</strong>?</p>
        
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
