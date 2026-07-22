import React from 'react';
import { Plus, PiggyBank } from 'lucide-react';
import { DebtCard } from '../DebtCard/DebtCard';
import { Button } from '../../../../components/ui/Button';
import type { DebtEntry } from '../../types';

interface DebtListProps {
  debts: DebtEntry[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (entry: DebtEntry) => void;
  onDelete: (entry: DebtEntry) => void;
  onAdd: () => void;
}

export const DebtList: React.FC<DebtListProps> = ({
  debts,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-6 h-48 shadow-sm border border-gray-100 flex flex-col justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="w-1/3 h-5 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-1/4 h-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
               <div className="h-12 bg-gray-100 rounded-xl"></div>
               <div className="h-12 bg-gray-100 rounded-xl"></div>
               <div className="h-12 bg-gray-100 rounded-xl"></div>
               <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center mt-6">
        <p className="text-danger font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={onRetry}>Try Again</Button>
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-6">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <PiggyBank size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">You are debt-free!</h3>
        <p className="text-text-secondary max-w-sm mb-6">
          You don't have any active loans or credit cards to track.
        </p>
        <Button onClick={onAdd} className="gap-2">
          <Plus size={20} />
          Add a Debt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {debts.map(entry => (
        <DebtCard 
          key={entry.id} 
          debt={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
