import React from 'react';
import { Calendar, Percent, CreditCard } from 'lucide-react';
import { debtTypeConfig } from '../../utils/debtTypeConfig';
import type { DebtEntry } from '../../types';

interface DebtCardProps {
  debt: DebtEntry;
  onEdit: (debt: DebtEntry) => void;
  onDelete: (debt: DebtEntry) => void;
}

export const DebtCard: React.FC<DebtCardProps> = ({ debt, onEdit, onDelete }) => {
  const config = debtTypeConfig[debt.type];
  const Icon = config.icon;

  const progressPercentage = Math.max(0, Math.min(100, ((debt.principal - debt.remainingAmount) / debt.principal) * 100));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-soft hover:border-primary/20 transition-all group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
            <Icon size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-text-main text-lg">{debt.name}</h4>
            <span className="text-sm text-text-secondary">{config.label}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(debt)}
            className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(debt)}
            className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
        <div>
          <p className="text-xs text-text-secondary mb-1">Remaining Balance</p>
          <p className="font-semibold text-text-main">₹{debt.remainingAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <Percent size={12} /> Interest (APR)
          </p>
          <p className="font-semibold text-text-main">{debt.interestRate}%</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <CreditCard size={12} /> Monthly EMI
          </p>
          <p className="font-semibold text-text-main">
            {debt.emi ? `₹${debt.emi.toLocaleString()}` : <span className="text-gray-400">Flexible</span>}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <Calendar size={12} /> Due Date
          </p>
          <p className="font-semibold text-text-main">
            Day {debt.dueDayOfMonth}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-1">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-text-secondary font-medium">Paid off</span>
          <span className="text-primary font-bold">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary text-right mt-1.5">
          of ₹{debt.principal.toLocaleString()} principal
        </p>
      </div>

    </div>
  );
};
