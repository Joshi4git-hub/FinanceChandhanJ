import React, { useState } from 'react';
import { Edit2, LayoutList, AlertCircle } from 'lucide-react';
import { BudgetProgressBar } from '../Shared/BudgetProgressBar';
import { CategoryBudgetForm } from './CategoryBudgetForm';
import { defaultExpenseCategoryConfig } from '../../../expense/utils/categoryConfig';
import type { BudgetProgress } from '../../types';

interface CategoryBudgetListProps {
  categoryProgress: Record<string, BudgetProgress>;
  overallLimit: number;
  onUpdateCategoryLimit: (categoryId: string, limit: number) => Promise<any>;
  isUpdating: boolean;
}

export const CategoryBudgetList: React.FC<CategoryBudgetListProps> = ({
  categoryProgress, overallLimit, onUpdateCategoryLimit, isUpdating
}) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const categoryEntries = Object.entries(categoryProgress);
  if (categoryEntries.length === 0) return null;

  // Calculate sum of category limits to warn if it exceeds overall budget
  const sumOfCategoryLimits = categoryEntries.reduce((sum, [_, prog]) => sum + prog.limit, 0);
  const exceedsOverall = overallLimit > 0 && sumOfCategoryLimits > overallLimit;

  const handleSave = async (categoryId: string, limit: number) => {
    await onUpdateCategoryLimit(categoryId, limit);
    setEditingCategory(null);
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-main">Category Budgets</h3>
          <p className="text-sm text-text-secondary mt-1">Manage limits per spending category</p>
        </div>
      </div>

      {exceedsOverall && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle size={18} className="text-warning mt-0.5 shrink-0" />
          <p className="text-sm text-warning font-medium">
            Warning: The sum of your category budgets (₹{sumOfCategoryLimits.toLocaleString()}) 
            exceeds your overall monthly budget (₹{overallLimit.toLocaleString()}).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryEntries.map(([categoryId, progress]) => {
          
          let label = categoryId;
          let Icon = LayoutList;
          let colorClass = 'bg-gray-100 text-gray-600';
          
          if (defaultExpenseCategoryConfig[categoryId as keyof typeof defaultExpenseCategoryConfig]) {
            const conf = defaultExpenseCategoryConfig[categoryId as keyof typeof defaultExpenseCategoryConfig];
            label = conf.label;
            Icon = conf.icon;
            colorClass = conf.color;
          }

          const isEditing = editingCategory === categoryId;

          return (
            <div key={categoryId} className="border border-gray-100 rounded-2xl p-4 hover:shadow-soft transition-shadow group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-text-main">{label}</span>
                </div>
                
                {!isEditing && (
                  <button 
                    onClick={() => setEditingCategory(categoryId)}
                    className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>

              {isEditing ? (
                 <CategoryBudgetForm 
                   currentLimit={progress.limit}
                   onSave={(limit) => handleSave(categoryId, limit)}
                   onCancel={() => setEditingCategory(null)}
                   isUpdating={isUpdating}
                 />
              ) : (
                <>
                  {progress.limit > 0 ? (
                    <BudgetProgressBar progress={progress} size="sm" />
                  ) : (
                    <div className="text-center py-2">
                       <p className="text-sm text-text-secondary mb-2">No budget limit set</p>
                       <button 
                         onClick={() => setEditingCategory(categoryId)}
                         className="text-xs font-medium text-primary hover:underline"
                       >
                         Set Limit
                       </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
