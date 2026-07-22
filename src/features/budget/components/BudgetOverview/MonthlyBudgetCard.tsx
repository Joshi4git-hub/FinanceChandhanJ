import React, { useState } from 'react';
import { Target, Edit2 } from 'lucide-react';
import { BudgetProgressBar } from '../Shared/BudgetProgressBar';
import { Button } from '../../../../components/ui/Button';
import type { BudgetProgress } from '../../types';

interface MonthlyBudgetCardProps {
  progress: BudgetProgress;
  onUpdateLimit: (limit: number) => Promise<any>;
  isUpdating: boolean;
}

export const MonthlyBudgetCard: React.FC<MonthlyBudgetCardProps> = ({ 
  progress, onUpdateLimit, isUpdating 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(progress.limit.toString());

  const handleSave = async () => {
    const num = Number(editValue);
    if (!isNaN(num) && num >= 0) {
      await onUpdateLimit(num);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden mb-6">
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white/90">Monthly Budget</h2>
              <p className="text-sm text-white/60">Overall Spending Limit</p>
            </div>
          </div>
          
          {!isEditing && (
            <button 
              onClick={() => {
                setEditValue(progress.limit.toString());
                setIsEditing(true);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-md"
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md mb-4 flex items-end gap-4 animate-in fade-in">
            <div className="flex-1">
              <label className="text-sm text-white/70 font-medium mb-1.5 block">New Limit (₹)</label>
              <input 
                type="number"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white/30"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating} className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isUpdating} className="bg-white text-indigo-950 hover:bg-gray-100">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-4xl font-bold mb-1">
              ₹{progress.spent.toLocaleString()}
            </p>
            <p className="text-white/60">
              spent out of ₹{progress.limit.toLocaleString()}
            </p>
          </div>
        )}

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
           <BudgetProgressBar progress={progress} size="lg" showLabels={false} />
           
           <div className="flex justify-between items-center mt-3 text-sm">
             <span className="font-medium">
               {progress.percentage.toFixed(1)}% Used
             </span>
             <span className={`font-bold ${progress.remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
               {progress.remaining < 0 
                 ? `₹${Math.abs(progress.remaining).toLocaleString()} Over` 
                 : `₹${progress.remaining.toLocaleString()} Left`}
             </span>
           </div>
        </div>
      </div>
    </div>
  );
};
