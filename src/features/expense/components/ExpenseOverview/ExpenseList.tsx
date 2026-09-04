import React from 'react';
import { Plus, Receipt } from 'lucide-react';
import { ExpenseCard } from '../ExpenseCard/ExpenseCard';
import { Button } from '../../../../components/ui/Button';
import type { ExpenseEntry, CustomExpenseCategory } from '../../types';

interface ExpenseListProps {
  expenses: ExpenseEntry[];
  customCategories: CustomExpenseCategory[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onEdit: (entry: ExpenseEntry) => void;
  onDelete: (entry: ExpenseEntry) => void;
  onAdd: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  customCategories,
  isLoading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 h-24 shadow-sm border border-gray-100 flex items-center animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mr-4"></div>
            <div className="flex-1">
              <div className="w-1/3 h-5 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-1/4 h-3 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center">
        <p className="text-danger font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={onRetry}>Try Again</Button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center mt-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Receipt size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">No expenses found</h3>
        <p className="text-text-secondary max-w-sm mb-6">
          Track your spending, upload bills, and manage custom categories to stay on budget.
        </p>
        <Button onClick={onAdd} className="gap-2">
          <Plus size={20} />
          Add First Expense
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map(entry => (
        <ExpenseCard 
          key={entry.id} 
          entry={entry}
          customCategories={customCategories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
