import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { defaultExpenseCategoryConfig } from '../../utils/categoryConfig';
import { paymentMethodConfig } from '../../utils/paymentMethodConfig';
import { CustomCategoryForm } from './CustomCategoryForm';
import type { ExpenseFormData, ExpenseEntry, CustomExpenseCategory } from '../../types';

interface ExpenseFormProps {
  initialData?: ExpenseEntry;
  customCategories: CustomExpenseCategory[];
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onAddCustomCategory: (data: Omit<CustomExpenseCategory, 'id'>) => Promise<CustomExpenseCategory>;
  isSubmitting: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  customCategories,
  onSubmit,
  onAddCustomCategory,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: 0,
    category: '',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [isCreatingCustomCat, setIsCreatingCustomCat] = useState(false);
  const [isCreatingCatLoading, setIsCreatingCatLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        paymentMethod: initialData.paymentMethod,
        date: initialData.date.split('T')[0],
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  // Restrict far future dates (7 days grace period)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.paymentMethod) return;
    
    await onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString()
    });
  };

  const handleCustomCategoryCreate = async (catData: Omit<CustomExpenseCategory, 'id'>) => {
    try {
      setIsCreatingCatLoading(true);
      const newCat = await onAddCustomCategory(catData);
      setFormData(prev => ({ ...prev, category: newCat.id }));
      setIsCreatingCustomCat(false);
    } finally {
      setIsCreatingCatLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          <label className="text-sm font-medium text-text-main">Payment Method</label>
          <select 
            required
            className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as any})}
          >
            <option value="" disabled>Select Method</option>
            {Object.entries(paymentMethodConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main">Category</label>
        
        {isCreatingCustomCat ? (
          <CustomCategoryForm 
             onSuccess={handleCustomCategoryCreate}
             onCancel={() => setIsCreatingCustomCat(false)}
          />
        ) : (
          <select 
            required
            className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            value={formData.category}
            onChange={(e) => {
              if (e.target.value === 'ADD_CUSTOM') {
                setIsCreatingCustomCat(true);
              } else {
                setFormData({...formData, category: e.target.value});
              }
            }}
          >
            <option value="" disabled>Select Category</option>
            <optgroup label="Default Categories">
              {Object.entries(defaultExpenseCategoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </optgroup>
            
            {customCategories.length > 0 && (
              <optgroup label="Custom Categories">
                {customCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </optgroup>
            )}
            
            <optgroup label="Actions">
              <option value="ADD_CUSTOM">+ Add Custom Category</option>
            </optgroup>
          </select>
        )}
      </div>

      <Input 
        label="Date" 
        type="date" 
        required
        max={maxDateStr}
        value={formData.date}
        onChange={(e) => setFormData({...formData, date: e.target.value})}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main">Notes (Optional)</label>
        <textarea
          className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none h-24"
          placeholder="Add any extra details here..."
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting || isCreatingCatLoading}>
        {initialData ? 'Save Changes' : 'Add Expense'}
      </Button>
    </form>
  );
};
