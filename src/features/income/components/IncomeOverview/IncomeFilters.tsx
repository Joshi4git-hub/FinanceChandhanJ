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
                ? 'bg-text-main text-white border-text-main shadow-soft' 
                : 'bg-white text-text-secondary border-gray-200 hover:border-gray-300 hover:text-text-main'
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
