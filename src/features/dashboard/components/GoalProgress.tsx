import React from 'react';
import { Target } from 'lucide-react';

export const GoalProgress: React.FC = () => {
  const goals = [
    { name: 'MacBook Pro', target: 120000, saved: 80000, color: 'text-primary', bg: 'bg-primary' },
    { name: 'Emergency Fund', target: 100000, saved: 25000, color: 'text-success', bg: 'bg-success' },
    { name: 'Goa Trip', target: 30000, saved: 15000, color: 'text-warning', bg: 'bg-warning' }
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-main">Goal Progress</h3>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Target size={16} />
        </div>
      </div>

      <div className="space-y-6">
        {goals.map((goal, i) => {
          const pct = Math.round((goal.saved / goal.target) * 100);
          return (
            <div key={i}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-semibold text-text-main text-sm">{goal.name}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}</p>
                </div>
                <div className={`font-bold text-sm ${goal.color}`}>
                  {pct}%
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${goal.bg} rounded-full`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
