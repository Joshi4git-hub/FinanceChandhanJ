import React from 'react';
import { Rocket, Clock, Landmark } from 'lucide-react';
import type { PayoffResult } from '../types';

interface BestStrategyHighlightProps {
  bestResult: PayoffResult;
  extraPayment: number;
}

export const BestStrategyHighlight: React.FC<BestStrategyHighlightProps> = ({ 
  bestResult, extraPayment 
}) => {
  const strategyName = bestResult.strategy === 'AVALANCHE' ? 'Avalanche Method' : 'Snowball Method';

  if (extraPayment === 0) {
    return (
      <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-6 md:p-8 flex items-center justify-center text-center">
         <div>
           <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-500">
             <Landmark size={32} />
           </div>
           <h3 className="text-xl font-bold text-indigo-900 mb-2">Want to save money?</h3>
           <p className="text-indigo-700/80 max-w-md mx-auto">
             Enter an extra monthly payment above to see how much interest and time you could save using the optimal payoff strategy.
           </p>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
             <Rocket size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Recommended Strategy</h2>
            <p className="text-2xl font-bold">{strategyName}</p>
          </div>
        </div>

        <p className="text-lg md:text-xl font-medium leading-relaxed max-w-3xl mb-8">
          If you pay <span className="bg-white/20 px-2 py-1 rounded-lg">₹{extraPayment.toLocaleString()} extra</span> every month using the {strategyName}, 
          you'll become debt-free <span className="bg-white/20 px-2 py-1 rounded-lg">{bestResult.monthsSaved} months earlier</span> and 
          save <span className="text-emerald-300 font-bold">₹{bestResult.interestSaved.toLocaleString()}</span> in interest.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
             <p className="text-sm text-white/70 mb-1">Interest Saved</p>
             <p className="text-2xl font-bold text-emerald-300">₹{bestResult.interestSaved.toLocaleString()}</p>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
             <p className="text-sm text-white/70 mb-1 flex items-center gap-1.5"><Clock size={14}/> Time Saved</p>
             <p className="text-2xl font-bold text-amber-300">{bestResult.monthsSaved} Months</p>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
             <p className="text-sm text-white/70 mb-1">New Payoff Time</p>
             <p className="text-xl font-semibold text-white">{bestResult.totalMonths} Months</p>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
             <p className="text-sm text-white/70 mb-1">Total Interest</p>
             <p className="text-xl font-semibold text-white">₹{bestResult.totalInterestPaid.toLocaleString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
