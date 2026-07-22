export type IncomeCategory = 'SALARY' | 'INTERNSHIP' | 'FREELANCING' | 'SCHOLARSHIP' | 'OTHERS';

export type RecurringFrequency = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface RecurringIncomeRule {
  id: string;
  frequency: RecurringFrequency;
  endDate?: string; // ISO date string, undefined means no end date
}

export interface IncomeEntry {
  id: string;
  amount: number;
  category: IncomeCategory;
  sourceLabel: string;
  dateReceived: string; // ISO date string
  notes?: string;
  recurringRuleId?: string; // If present, it belongs to a recurring series
}

export interface IncomeFormData {
  amount: number;
  category: IncomeCategory | '';
  sourceLabel: string;
  dateReceived: string;
  notes: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
}
