import React, { useState, useEffect } from 'react';
import { History, Calendar } from 'lucide-react';
import { budgetApi } from '../../api/budgetApi';
import type { BudgetLimit } from '../../types';

export const BudgetHistory: React.FC = () => {
  const [history, setHistory] = useState<BudgetLimit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await budgetApi.getBudgetHistory();
        setHistory(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-full mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <History size={20} className="text-text-secondary" />
        <h3 className="text-xl font-bold text-text-main">Budget History</h3>
      </div>

      <div className="space-y-4">
        {history.map(entry => (
          <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-text-secondary">
                <Calendar size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-main">
                  {new Date(entry.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </h4>
                <p className="text-sm text-text-secondary">Overall Limit: ₹{entry.overallLimit.toLocaleString()}</p>
              </div>
            </div>
            
            {/* In a real app we'd fetch historical expenses too to show actual vs limit here */}
            <div className="text-right">
              <span className="text-sm font-medium text-primary cursor-pointer hover:underline">
                View Details
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
