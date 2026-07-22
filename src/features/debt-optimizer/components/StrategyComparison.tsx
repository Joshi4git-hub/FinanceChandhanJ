import React from 'react';
import type { OptimizerData } from '../types';
import { ArrowDownRight, Clock, Target } from 'lucide-react';

interface StrategyComparisonProps {
  data: OptimizerData;
}

export const StrategyComparison: React.FC<StrategyComparisonProps> = ({ data }) => {
  const { avalanche, snowball, bestStrategy } = data;

  const renderCard = (title: string, desc: string, result: typeof avalanche, isBest: boolean) => (
    <div className={`rounded-[24px] p-6 shadow-sm border ${isBest ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-bold text-text-main flex items-center gap-2">
            {title}
            {isBest && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">Recommended</span>}
          </h4>
          <p className="text-xs text-text-secondary mt-1 max-w-[250px]">{desc}</p>
        </div>
        <Target size={24} className={isBest ? 'text-primary' : 'text-gray-300'} />
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100/50">
           <span className="text-sm text-text-secondary flex items-center gap-1"><ArrowDownRight size={14}/> Total Interest</span>
           <span className="font-semibold">₹{result.totalInterestPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-100/50">
           <span className="text-sm text-text-secondary flex items-center gap-1"><Clock size={14}/> Payoff Time</span>
           <span className="font-semibold">{result.totalMonths} months</span>
        </div>
        <div className="flex justify-between items-center">
           <span className="text-sm text-text-secondary font-medium">Interest Saved</span>
           <span className="font-bold text-success">+₹{result.interestSaved.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-text-main mb-4">Compare Strategies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCard(
          'Avalanche Method', 
          'Targets highest interest rates first. Mathematically saves the most money.', 
          avalanche, 
          bestStrategy === 'AVALANCHE'
        )}
        {renderCard(
          'Snowball Method', 
          'Targets smallest balances first. Best for quick psychological wins.', 
          snowball, 
          bestStrategy === 'SNOWBALL'
        )}
      </div>
    </div>
  );
};
