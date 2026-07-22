import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '../../../../features/dashboard/DashboardLayout';
import { IncomeList } from './IncomeList';
import { IncomeFilters } from './IncomeFilters';
import { useIncomeData } from '../../hooks/useIncomeData';
import { Button } from '../../../../components/ui/Button';
import { IncomeModal } from '../IncomeModal/IncomeModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal/DeleteConfirmModal';
import type { IncomeEntry } from '../../types';

export const IncomeOverview: React.FC = () => {
  const {
    incomes,
    isLoading,
    isFetchingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    categoryFilter,
    setCategoryFilter
  } = useIncomeData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<IncomeEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<IncomeEntry | null>(null);

  const handleEdit = (entry: IncomeEntry) => {
    setEditingEntry(entry);
    // the actual modal opening is implied if editingEntry is not null
  };

  const handleDelete = (entry: IncomeEntry) => {
    setDeletingEntry(entry);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Income</h1>
          <p className="text-text-secondary mt-1">Manage and track your incoming cash flow.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0">
          <Plus size={20} />
          Add Income
        </Button>
      </div>

      <IncomeFilters 
        activeCategory={categoryFilter} 
        onCategoryChange={setCategoryFilter} 
      />

      <IncomeList
        incomes={incomes}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRetry={refetch}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <IncomeModal 
        isOpen={isAddModalOpen || !!editingEntry}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEntry(null);
        }}
        onSuccess={refetch}
        initialData={editingEntry || undefined}
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
