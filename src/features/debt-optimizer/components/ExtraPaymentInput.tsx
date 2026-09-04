import React from 'react';
import { IndianRupee } from 'lucide-react';

interface ExtraPaymentInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const ExtraPaymentInput: React.FC<ExtraPaymentInputProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-xl font-bold text-text-main mb-2">Extra Monthly Payment</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-2xl">
        How much extra can you afford to pay each month beyond your minimums? 
        The optimizer will use this extra cash to aggressively attack your debt.
      </p>

      <div className="flex flex-col gap-6">
        {/* Large Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
             <IndianRupee size={24} className="text-text-secondary" />
          </div>
          <input 
            type="number"
            min="0"
            step="100"
            className="w-full md:w-2/3 lg:w-1/2 bg-gray-50 border-2 border-transparent focus:border-primary/50 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-2xl font-bold text-text-main outline-none transition-all shadow-inner"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        {/* Quick select chips */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-text-secondary mr-2">Quick amounts:</span>
          {[0, 1000, 2000, 5000, 10000, 20000].map(amt => (
            <button
              key={amt}
              onClick={() => onChange(amt)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                value === amt 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-primary/5 text-primary hover:bg-primary/10'
              }`}
            >
              ₹{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
