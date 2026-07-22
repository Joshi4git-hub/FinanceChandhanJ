import React from 'react';
import { Plus, Inbox } from 'lucide-react';
import { IncomeCard } from '../IncomeCard/IncomeCard';
import { Button } from '../../../../components/ui/Button';
import type { IncomeEntry } from '../../types';

interface IncomeListProps {
  incomes: IncomeEntry[];
  isLoading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  onEdit: (entry: IncomeEntry) => void;
  onDelete: (entry: IncomeEntry) => void;
  onAdd: () => void;
}

export const IncomeList: React.FC<IncomeListProps> = ({
  incomes,
  isLoading,
  isFetchingMore,
  error,
  hasMore,
  onLoadMore,
  onRetry,
  onEdit,
  onDelete,
  onAdd
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl p-4 h-24 shadow-sm border border-gray-100 flex animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl mr-4"></div>
            <div className="flex-1">
              <div className="w-1/3 h-5 bg-gray-200 rounded-full mb-2"></div>
              <div className="w-1/4 h-3 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-8 text-center">
        <p className="text-danger font-medium mb-4">{error}</p>
        <Button variant="outline" onClick={onRetry}>Try Again</Button>
      </div>
    );
  }

  if (incomes.length === 0) {
    return (
      <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Inbox size={32} />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">No income entries yet</h3>
        <p className="text-text-secondary max-w-sm mb-6">
          Track your salaries, freelancing gigs, and scholarships to stay on top of your finances.
        </p>
        <Button onClick={onAdd} className="gap-2">
          <Plus size={20} />
          Add First Income
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incomes.map(entry => (
        <IncomeCard 
          key={entry.id} 
          entry={entry} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      
      {hasMore && (
        <div className="pt-6 pb-2 text-center">
          <Button 
            variant="outline" 
            onClick={onLoadMore} 
            isLoading={isFetchingMore}
            className="w-full md:w-auto md:min-w-[200px]"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
