import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const UpcomingEMIs: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-main">Upcoming EMIs</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Calendar size={16} />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 justify-center">
        <div className="p-5 border border-gray-100 rounded-2xl bg-background/50 hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-text-main">Education Loan</h4>
              <p className="text-sm text-text-secondary">SBI Student Loan</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-danger">₹4,500</div>
              <p className="text-xs text-text-secondary bg-danger/10 text-danger px-2 py-0.5 rounded-full mt-1 inline-block">Due in 3 days</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Paid: ₹1.2L</span>
              <span>Remaining: ₹3.8L</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>

          <Button fullWidth className="py-2.5">
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};
