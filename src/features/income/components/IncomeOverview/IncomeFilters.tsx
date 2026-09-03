import React from 'react';
import { incomeCategoryConfig } from '../../utils/categoryConfig';

interface IncomeFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const IncomeFilters: React.FC<IncomeFiltersProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'ALL', label: 'All Income' },
    ...Object.entries(incomeCategoryConfig).map(([key, config]) => ({
      id: key,
      label: config.label,
    }))
  ];

  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 gap-2 mb-6">
      {categories.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
              ${isActive 
                ? 'bg-primary text-white border-primary shadow-soft dark:bg-primary/80 dark:hover:bg-primary/90' 
                : 'bg-white dark:bg-slate-800 text-text-secondary dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-text-main dark:hover:text-white'
              }
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
