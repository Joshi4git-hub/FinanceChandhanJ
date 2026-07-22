import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { debtTypeConfig } from '../../utils/debtTypeConfig';
import type { DebtFormData, DebtEntry, DebtType } from '../../types';

interface DebtFormProps {
  initialData?: DebtEntry;
  onSubmit: (data: DebtFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const DebtForm: React.FC<DebtFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<DebtFormData>>({
    name: '',
    type: 'PERSONAL_LOAN',
    principal: undefined,
    remainingAmount: undefined,
    interestRate: undefined,
    emi: undefined,
    dueDayOfMonth: 1
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        principal: initialData.principal,
        remainingAmount: initialData.remainingAmount,
        interestRate: initialData.interestRate,
        emi: initialData.emi,
        dueDayOfMonth: initialData.dueDayOfMonth
      });
    }
  }, [initialData]);

  const selectedTypeConfig = formData.type ? debtTypeConfig[formData.type] : null;
  const requiresEmi = selectedTypeConfig?.requiresEmi ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.principal || !formData.remainingAmount || formData.interestRate === undefined || !formData.dueDayOfMonth) {
      return;
    }
    
    // Validate EMI if required
    if (requiresEmi && !formData.emi) {
      alert('Monthly EMI is required for this type of loan.');
      return;
    }

    await onSubmit(formData as DebtFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input 
        label="Debt Name / Label" 
        type="text" 
        placeholder="e.g. HDFC Credit Card"
        required
        value={formData.name || ''}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main">Debt Type</label>
        <select 
          required
          className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value as DebtType})}
        >
          {Object.entries(debtTypeConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Original Principal (₹)" 
          type="number" 
          min="1"
          step="any"
          required
          value={formData.principal || ''}
          onChange={(e) => setFormData({...formData, principal: Number(e.target.value)})}
        />
        <Input 
          label="Current Remaining Balance (₹)" 
          type="number" 
          min="0"
          step="any"
          required
          value={formData.remainingAmount || ''}
          onChange={(e) => setFormData({...formData, remainingAmount: Number(e.target.value)})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Interest Rate (APR %)" 
          type="number" 
          min="0"
          step="0.01"
          required
          value={formData.interestRate === undefined ? '' : formData.interestRate}
          onChange={(e) => setFormData({...formData, interestRate: Number(e.target.value)})}
        />
        <Input 
          label={`Monthly EMI (₹) ${!requiresEmi ? '(Optional)' : ''}`}
          type="number" 
          min="0"
          step="any"
          required={requiresEmi}
          value={formData.emi || ''}
          onChange={(e) => setFormData({...formData, emi: Number(e.target.value)})}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-main">Due Date (Day of Month)</label>
        <select 
          required
          className="px-4 py-3 bg-background border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
          value={formData.dueDayOfMonth}
          onChange={(e) => setFormData({...formData, dueDayOfMonth: Number(e.target.value)})}
        >
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>Day {day}</option>
          ))}
        </select>
      </div>

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {initialData ? 'Save Changes' : 'Add Debt'}
      </Button>
    </form>
  );
};
