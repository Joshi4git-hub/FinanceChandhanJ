import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const AICoachCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-[24px] p-1 border border-primary/20 shadow-soft">
      <div className="bg-white rounded-[20px] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle AI BG decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-1">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main mb-1">AI Financial Coach</h3>
            <p className="text-text-secondary leading-relaxed max-w-2xl text-sm md:text-base">
              <strong className="text-text-main">"You spent 18% more on food this month."</strong><br />
              Reducing food delivery by ₹800/month can help you repay your education loan approximately one month earlier.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <button className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-text-main hover:bg-gray-50 transition-colors">
            View Details
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-soft">
            Ask AI <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
