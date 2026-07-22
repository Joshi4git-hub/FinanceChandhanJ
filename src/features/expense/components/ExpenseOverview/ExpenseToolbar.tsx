import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import type { DateRangeFilter, SortOption } from '../../hooks/useExpenseListState';
import { defaultExpenseCategoryConfig } from '../../utils/categoryConfig';
import type { CustomExpenseCategory } from '../../types';

interface ExpenseToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dateRange: DateRangeFilter;
  setDateRange: (d: DateRangeFilter) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
  customCategories: CustomExpenseCategory[];
}

export const ExpenseToolbar: React.FC<ExpenseToolbarProps> = ({
  searchQuery, setSearchQuery, dateRange, setDateRange, 
  sort, setSort, selectedCategories, toggleCategory, customCategories
}) => {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center mb-6 z-10 relative">
      
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-secondary" />
        </div>
        <input 
          type="text" 
          placeholder="Search by notes or category..."
          className="w-full pl-11 pr-4 py-2.5 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        
        {/* Category Filter (Simple Multi-select dropdown simulation) */}
        <div className="relative group">
          <button className="px-4 py-2.5 bg-background border border-gray-200 rounded-2xl text-sm font-medium text-text-main hover:border-gray-300 transition-colors flex items-center gap-2">
            <Filter size={16} className="text-text-secondary" />
            Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </button>
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 hidden group-hover:block z-50 max-h-64 overflow-y-auto">
            {Object.entries(defaultExpenseCategoryConfig).map(([key, conf]) => (
              <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                  checked={selectedCategories.includes(key)}
                  onChange={() => toggleCategory(key)}
                />
                <span className="text-sm font-medium text-text-main">{conf.label}</span>
              </label>
            ))}
            {customCategories.length > 0 && (
              <>
                <div className="h-px bg-gray-100 my-2"></div>
                {customCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                    />
                    <span className="text-sm font-medium text-text-main">{cat.label}</span>
                  </label>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Date Filter */}
        <select 
          className="px-4 py-2.5 bg-background border border-gray-200 rounded-2xl text-sm font-medium text-text-main outline-none cursor-pointer hover:border-gray-300 transition-colors"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
        >
          <option value="ALL">All Time</option>
          <option value="THIS_MONTH">This Month</option>
          <option value="LAST_MONTH">Last Month</option>
          <option value="LAST_90_DAYS">Last 90 Days</option>
        </select>

        {/* Sort */}
        <div className="relative flex items-center bg-background border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
          <div className="pl-3 text-text-secondary pointer-events-none absolute">
             <ArrowUpDown size={16} />
          </div>
          <select 
            className="pl-9 pr-4 py-2.5 bg-transparent text-sm font-medium text-text-main outline-none cursor-pointer appearance-none w-36"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
          >
            <option value="DATE_DESC">Newest First</option>
            <option value="DATE_ASC">Oldest First</option>
            <option value="AMOUNT_DESC">Highest Amount</option>
            <option value="AMOUNT_ASC">Lowest Amount</option>
          </select>
        </div>
      </div>
    </div>
  );
};
