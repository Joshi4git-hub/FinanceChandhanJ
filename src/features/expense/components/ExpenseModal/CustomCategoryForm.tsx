import React, { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import type { CustomExpenseCategory } from '../../types';

interface CustomCategoryFormProps {
  onSuccess: (cat: Omit<CustomExpenseCategory, 'id'>) => void;
  onCancel: () => void;
}

export const CustomCategoryForm: React.FC<CustomCategoryFormProps> = ({ onSuccess, onCancel }) => {
  const [label, setLabel] = useState('');
  const [colorHex, setColorHex] = useState('#4F46E5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSuccess({
      label: label.trim(),
      colorHex,
      iconName: 'LayoutList' // We use a generic icon for now, could add icon picker later
    });
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2">
      <h3 className="font-semibold text-text-main mb-4">Create Custom Category</h3>
      
      <div className="space-y-4">
        <Input 
          label="Category Name"
          required
          placeholder="e.g. Pet Care"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-main">Color</label>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
            />
            <span className="text-sm text-text-secondary uppercase">{colorHex}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="flex-1">
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
