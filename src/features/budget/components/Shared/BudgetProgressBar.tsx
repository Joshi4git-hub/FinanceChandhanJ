import React from 'react';
import type { BudgetProgress } from '../../types';
import { getProgressColorClass } from '../../utils/budgetThresholds';

interface BudgetProgressBarProps {
  progress: BudgetProgress;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({ 
  progress, 
  size = 'md',
  showLabels = true
}) => {
  const colorClass = getProgressColorClass(progress.status);
  
  // Heights
  const hClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[size];

  // Width is capped at 100% for the visual bar itself, even if it goes over
  const widthPercent = Math.min(progress.percentage, 100);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary font-medium">Spent: ₹{progress.spent.toLocaleString()}</span>
          <span className="text-text-main font-semibold">Limit: ₹{progress.limit.toLocaleString()}</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${hClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      {showLabels && (
        <div className="mt-2 text-right">
          {progress.remaining >= 0 ? (
            <span className="text-sm font-medium text-success">
              ₹{progress.remaining.toLocaleString()} left
            </span>
          ) : (
            <span className="text-sm font-bold text-danger">
              ₹{Math.abs(progress.remaining).toLocaleString()} over budget
            </span>
          )}
        </div>
      )}
    </div>
  );
};
