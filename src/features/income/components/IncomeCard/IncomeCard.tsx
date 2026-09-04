import React from 'react';
import { Repeat } from 'lucide-react';
import { incomeCategoryConfig } from '../../utils/categoryConfig';
import type { IncomeEntry } from '../../types';
import { formatRelativeDate } from '../../../../utils/format'; // Assuming format utility exists from Module 2

interface IncomeCardProps {
  entry: IncomeEntry;
  onEdit: (entry: IncomeEntry) => void;
  onDelete: (entry: IncomeEntry) => void;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({ entry, onEdit, onDelete }) => {
  const config = incomeCategoryConfig[entry.category];
  const Icon = config.icon;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-soft hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
          <Icon size={24} />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-text-main group-hover:text-primary transition-colors">
              {entry.sourceLabel}
            </h4>
            {entry.recurringRuleId && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full" title="Recurring Income">
                <Repeat size={10} />
                Recurring
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary mt-0.5">
            <span>{config.label}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{formatRelativeDate(entry.dateReceived)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-bold text-success text-lg">+₹{entry.amount.toLocaleString()}</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(entry)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(entry)}
            className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Mobile action button placeholder, usually a 3-dot menu or swipe action in production */}
      <div className="md:hidden">
        <button 
           onClick={() => onEdit(entry)}
           className="text-text-secondary p-2"
        >
          ...
        </button>
      </div>
    </div>
  );
};
