import React, { useState } from 'react';
import { Plus, ArrowUpDown, ShieldAlert, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../../../../features/dashboard/DashboardLayout';
import { DebtList } from './DebtList';
import { useDebtData } from '../../hooks/useDebtData';
import type { DebtSortOption } from '../../hooks/useDebtData';
import { Button } from '../../../../components/ui/Button';
import { DebtModal } from '../DebtModal/DebtModal';
import { DeleteConfirmModal } from '../DeleteConfirmModal/DeleteConfirmModal';
import type { DebtEntry } from '../../types';

import { useNavigate } from 'react-router-dom';

export const DebtOverview: React.FC = () => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState<DebtSortOption>('DUE_DATE_ASC');
  
  const {
    debts,
    totalRemaining,
    totalPrincipal,
    totalEmi,
    isLoading,
    error,
    refetch
  } = useDebtData(sortOption);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DebtEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<DebtEntry | null>(null);

  const handleEdit = (entry: DebtEntry) => setEditingEntry(entry);
  const handleDelete = (entry: DebtEntry) => setDeletingEntry(entry);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Debt Management</h1>
          <p className="text-text-secondary mt-1">Track your loans and plan your payoff.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={() => navigate('/dashboard/debt-optimizer')} variant="outline" className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
            <Sparkles size={18} />
            Optimizer
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus size={20} />
            Add Debt
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm text-text-secondary font-medium mb-1">Total Outstanding</p>
          <p className="text-2xl font-bold text-danger">₹{totalRemaining.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm text-text-secondary font-medium mb-1">Total Original Principal</p>
          <p className="text-2xl font-bold text-text-main">₹{totalPrincipal.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <ShieldAlert size={80} />
           </div>
           <p className="text-sm text-text-secondary font-medium mb-1">Monthly EMI Burden</p>
           <p className="text-2xl font-bold text-text-main relative z-10">
             ₹{totalEmi.toLocaleString()} <span className="text-sm font-normal text-gray-400">/mo</span>
           </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-main pl-2">Your Active Debts ({debts.length})</span>
        </div>

        {/* Sort */}
        <div className="relative flex items-center bg-background border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
          <div className="pl-3 text-text-secondary pointer-events-none absolute">
             <ArrowUpDown size={16} />
          </div>
          <select 
            className="pl-9 pr-4 py-2 bg-transparent text-sm font-medium text-text-main outline-none cursor-pointer appearance-none w-44"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as DebtSortOption)}
          >
            <option value="DUE_DATE_ASC">Due Date (Soonest)</option>
            <option value="REMAINING_DESC">Highest Balance</option>
            <option value="INTEREST_DESC">Highest Interest</option>
          </select>
        </div>
      </div>

      <DebtList
        debts={debts}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DebtModal 
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
