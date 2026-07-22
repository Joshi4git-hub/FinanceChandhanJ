import React, { useState } from 'react';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { useIncomeMutation } from '../../hooks/useIncomeMutation';
import type { IncomeEntry } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entry: IncomeEntry | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  entry
}) => {
  const [deleteMode, setDeleteMode] = useState<'SINGLE' | 'SERIES'>('SINGLE');

  const { deleteIncome, isSubmitting } = useIncomeMutation({
    onSuccess: () => {
      onSuccess();
      onClose();
    }
  });

  if (!entry) return null;

  const isRecurring = !!entry.recurringRuleId;

  const handleDelete = async () => {
    await deleteIncome(entry.id, deleteMode);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Income">
      <div className="text-text-main space-y-4">
        <p>Are you sure you want to delete <strong>{entry.sourceLabel}</strong> (₹{entry.amount.toLocaleString()})?</p>
        
        {isRecurring && (
          <div className="bg-danger/10 border border-danger/20 p-4 rounded-xl text-sm">
            <p className="font-semibold text-danger mb-2">This is a recurring income.</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-text-main">
                <input 
                  type="radio" 
                  name="deleteMode" 
                  className="accent-danger"
                  checked={deleteMode === 'SINGLE'}
                  onChange={() => setDeleteMode('SINGLE')}
                />
                Delete this occurrence only
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-text-main">
                <input 
                  type="radio" 
                  name="deleteMode" 
                  className="accent-danger"
                  checked={deleteMode === 'SERIES'}
                  onChange={() => setDeleteMode('SERIES')}
                />
                Delete the entire series (all past and future)
              </label>
            </div>
          </div>
        )}

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
