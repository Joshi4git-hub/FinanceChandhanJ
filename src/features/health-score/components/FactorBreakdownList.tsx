import React from 'react';
import type { FactorBreakdown, FactorStatus } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface FactorBreakdownListProps {
  factors: FactorBreakdown[];
}

export const FactorBreakdownList: React.FC<FactorBreakdownListProps> = ({ factors }) => {
  
  const getStatusConfig = (status: FactorStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return { icon: CheckCircle2, color: 'text-success bg-success/10 border-success/20' };
      case 'GOOD':
        return { icon: Info, color: 'text-primary bg-primary/10 border-primary/20' };
      case 'FAIR':
        return { icon: AlertTriangle, color: 'text-warning bg-warning/10 border-warning/20' };
      case 'POOR':
        return { icon: AlertCircle, color: 'text-danger bg-danger/10 border-danger/20' };
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-text-main mb-6">Score Breakdown</h3>
      
      <div className="space-y-4">
        {factors.map(factor => {
          const config = getStatusConfig(factor.status);
          const Icon = config.icon;

          return (
            <div key={factor.id} className="p-4 rounded-2xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-text-main">{factor.name}</h4>
                    <span className="text-xs font-medium text-text-secondary px-2 py-0.5 bg-white rounded-md border border-gray-200 shadow-sm">
                      {factor.score}/{factor.maxScore} pts
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{factor.message}</p>
                </div>
                <div className={`p-2 rounded-xl border ${config.color} shrink-0`}>
                  <Icon size={20} />
                </div>
              </div>
              
              {/* Mini progress bar */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${config.color.split(' ')[0].replace('text-', 'bg-')}`}
                  style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
