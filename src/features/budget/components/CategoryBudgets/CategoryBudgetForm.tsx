import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface CategoryBudgetFormProps {
  currentLimit: number;
  onSave: (limit: number) => Promise<any> | void;
  onCancel: () => void;
  isUpdating: boolean;
}

export const CategoryBudgetForm: React.FC<CategoryBudgetFormProps> = ({
  currentLimit, onSave, onCancel, isUpdating
}) => {
  const [value, setValue] = useState(currentLimit > 0 ? currentLimit.toString() : '');

  const handleSave = () => {
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      onSave(num);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-1">
      <input 
        type="number" 
        min="0"
        placeholder="Enter limit"
        className="flex-1 w-full bg-background border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isUpdating}
      />
      <Button 
        variant="outline" 
        className="px-3 py-1.5 h-auto text-xs" 
        onClick={onCancel}
        disabled={isUpdating}
      >
        Cancel
      </Button>
      <Button 
        className="px-3 py-1.5 h-auto text-xs" 
        onClick={handleSave}
        isLoading={isUpdating}
      >
        Save
      </Button>
    </div>
  );
};
