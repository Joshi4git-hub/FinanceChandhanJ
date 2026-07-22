import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { incomeCategoryConfig } from '../../utils/categoryConfig';
import type { IncomeFormData, IncomeEntry, IncomeCategory, RecurringFrequency } from '../../types';

interface IncomeFormProps {
  initialData?: IncomeEntry;
  onSubmit: (data: IncomeFormData, mode: 'SINGLE' | 'SERIES') => Promise<void>;
  isSubmitting: boolean;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<IncomeFormData>({
    amount: 0,
    category: '',
    sourceLabel: '',
    dateReceived: new Date().toISOString().split('T')[0],
    notes: '',
    isRecurring: false,
    recurringFrequency: 'MONTHLY',
    recurringEndDate: ''
  });

  const [editMode, setEditMode] = useState<'SINGLE' | 'SERIES'>('SINGLE');

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        sourceLabel: initialData.sourceLabel,
        dateReceived: initialData.dateReceived.split('T')[0],
        notes: initialData.notes || '',
        isRecurring: !!initialData.recurringRuleId,
        recurringFrequency: 'MONTHLY', // In a real app, fetch the rule details
        recurringEndDate: ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return; // Validation handled by browser but safe check
    
    // Ensure date is ISO string
    const submitData = {
      ...formData,
      dateReceived: new Date(formData.dateReceived).toISOString()
    };
    
    await onSubmit(submitData, editMode);
  };

  const isEditing = !!initialData;
  const isEditingRecurring = isEditing && !!initialData.recurringRuleId;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {isEditingRecurring && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl text-sm mb-4">
          <p className="font-semibold text-warning mb-2">This is a recurring income.</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-text-main">
              <input 
                type="radio" 
                name="editMode" 
                className="accent-primary"
                checked={editMode === 'SINGLE'}
                onChange={() => setEditMode('SINGLE')}
              />
              Update this occurrence only
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-text-main">
              <input 
                type="radio" 
                name="editMode" 
                className="accent-primary"
                checked={editMode === 'SERIES'}
                onChange={() => setEditMode('SERIES')}
              />
              Update the entire series
            </label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Amount (₹)" 
          type="number" 
          min="1"
          step="any"
          required
          value={formData.amount || ''}
          onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-main">Category</label>
          <select 
            required
            className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as IncomeCategory})}
          >
            <option value="" disabled>Select Category</option>
            {Object.entries(incomeCategoryConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Source / Label" 
          type="text" 
          placeholder="e.g. TCS Salary"
          required
          value={formData.sourceLabel}
          onChange={(e) => setFormData({...formData, sourceLabel: e.target.value})}
        />
        <Input 
          label="Date Received" 
          type="date" 
          required
          value={formData.dateReceived}
          onChange={(e) => setFormData({...formData, dateReceived: e.target.value})}
        />
      </div>

      {!isEditing && (
        <div className="bg-background rounded-2xl p-4 border border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-text-main mb-4">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
            />
            This is a recurring income
          </label>

          {formData.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-main">Frequency</label>
                <select 
                  className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  value={formData.recurringFrequency}
                  onChange={(e) => setFormData({...formData, recurringFrequency: e.target.value as RecurringFrequency})}
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              <Input 
                label="End Date (Optional)" 
                type="date" 
                min={formData.dateReceived}
                value={formData.recurringEndDate}
                onChange={(e) => setFormData({...formData, recurringEndDate: e.target.value})}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main">Notes (Optional)</label>
        <textarea
          className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none h-24"
          placeholder="Add any extra details here..."
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {isEditing ? 'Save Changes' : 'Add Income'}
      </Button>
    </form>
  );
};
