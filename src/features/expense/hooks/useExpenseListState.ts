import { useSearchParams } from 'react-router-dom';
import { useDebounce } from './useDebounce';

export type DateRangeFilter = 'ALL' | 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_90_DAYS';
export type SortOption = 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC';

export const useExpenseListState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const dateRange = (searchParams.get('date') as DateRangeFilter) || 'THIS_MONTH';
  const sort = (searchParams.get('sort') as SortOption) || 'DATE_DESC';
  
  // Categories are stored as comma-separated string
  const categoriesParam = searchParams.get('categories') || '';
  const selectedCategories = categoriesParam ? categoriesParam.split(',') : [];

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  const setSearchQuery = (q: string) => updateParams({ q });
  const setDateRange = (date: DateRangeFilter) => updateParams({ date: date === 'ALL' ? null : date });
  const setSort = (s: SortOption) => updateParams({ sort: s === 'DATE_DESC' ? null : s });
  
  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
      
    updateParams({ categories: newCategories.length ? newCategories.join(',') : null });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return {
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    sort,
    setSort,
    selectedCategories,
    toggleCategory,
    clearFilters
  };
};
