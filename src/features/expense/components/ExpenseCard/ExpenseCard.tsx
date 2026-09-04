import React, { useState } from 'react';
import { defaultExpenseCategoryConfig } from '../../utils/categoryConfig';
import { paymentMethodConfig } from '../../utils/paymentMethodConfig';
import type { ExpenseEntry, CustomExpenseCategory } from '../../types';
import { formatRelativeDate } from '../../../../utils/format';
import { LayoutList } from 'lucide-react'; // Generic icon for custom categories

interface ExpenseCardProps {
  entry: ExpenseEntry;
  customCategories: CustomExpenseCategory[];
  onEdit: (entry: ExpenseEntry) => void;
  onDelete: (entry: ExpenseEntry) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  entry, customCategories, onEdit, onDelete 
}) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  // Determine category config
  let label = entry.category;
  let Icon = LayoutList;
  let colorClass = 'bg-gray-100 text-gray-600';

  if (defaultExpenseCategoryConfig[entry.category as keyof typeof defaultExpenseCategoryConfig]) {
    const conf = defaultExpenseCategoryConfig[entry.category as keyof typeof defaultExpenseCategoryConfig];
    label = conf.label;
    Icon = conf.icon;
    colorClass = conf.color;
  } else {
    const custom = customCategories.find(c => c.id === entry.category);
    if (custom) {
      label = custom.label;
      // In a real app we'd map custom.iconName to a real Lucide component dynamically
      colorClass = `bg-[${custom.colorHex}]/10 text-[${custom.colorHex}]`; 
    }
  }

  const paymentConfig = paymentMethodConfig[entry.paymentMethod];
  const PaymentIcon = paymentConfig?.icon;

  const truncateNotes = entry.notes && entry.notes.length > 60;
  const displayNotes = isNotesExpanded ? entry.notes : entry.notes?.substring(0, 60) + (truncateNotes ? '...' : '');

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:shadow-soft hover:border-primary/20 transition-all group gap-4">
      <div className="flex items-start md:items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          <Icon size={24} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-text-main group-hover:text-primary transition-colors">
              {label}
            </h4>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-text-secondary mt-0.5">
            {PaymentIcon && <PaymentIcon size={14} />}
            <span>{paymentConfig?.label}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{formatRelativeDate(entry.date)}</span>
          </div>

          {entry.notes && (
            <p 
              className={`text-sm mt-2 text-text-secondary ${truncateNotes ? 'cursor-pointer hover:text-text-main' : ''}`}
              onClick={() => truncateNotes && setIsNotesExpanded(!isNotesExpanded)}
            >
              {displayNotes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
        <div className="text-left md:text-right">
          <p className="font-bold text-text-main text-lg">₹{entry.amount.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
    </div>
  );
};
