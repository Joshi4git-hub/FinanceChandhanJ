import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '../../../../features/dashboard/DashboardLayout';
import { ExpenseList } from './ExpenseList';
import { ExpenseToolbar } from './ExpenseToolbar';
import { useExpenseListState } from '../../hooks/useExpenseListState';
import { useExpenseData } from '../../hooks/useExpenseData';
import { Button } from '../../../../components/ui/Button';
import { ExpenseModal } from '../ExpenseModal/ExpenseModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal/DeleteConfirmModal';
import type { ExpenseEntry } from '../../types';

export const ExpenseOverview: React.FC = () => {
  const listState = useExpenseListState();
  
  const {
    expenses,
    customCategories,
    isLoading,
    error,
    refetch
  } = useExpenseData({
    debouncedSearchQuery: listState.debouncedSearchQuery,
    dateRange: listState.dateRange,
    sort: listState.sort,
    selectedCategories: listState.selectedCategories
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ExpenseEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<ExpenseEntry | null>(null);

  const handleEdit = (entry: ExpenseEntry) => setEditingEntry(entry);
  const handleDelete = (entry: ExpenseEntry) => setDeletingEntry(entry);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Expenses</h1>
          <p className="text-text-secondary mt-1">Track where your money goes.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus size={20} />
          Add Expense
        </Button>
      </div>

      <ExpenseToolbar 
        {...listState}
        customCategories={customCategories}
      />

      <ExpenseList
        expenses={expenses}
        customCategories={customCategories}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ExpenseModal 
        isOpen={isAddModalOpen || !!editingEntry}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEntry(null);
        }}
        onSuccess={refetch}
        initialData={editingEntry || undefined}
        customCategories={customCategories}
      />

      <DeleteConfirmModal
        isOpen={!!deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onSuccess={refetch}
        entry={deletingEntry}
      />
    </DashboardLayout>
  );
};
