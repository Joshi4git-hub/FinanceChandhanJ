export type DefaultExpenseCategory = 
  | 'FOOD' | 'TRANSPORT' | 'RENT' | 'UTILITIES' 
  | 'SHOPPING' | 'ENTERTAINMENT' | 'HEALTH' | 'EDUCATION' | 'OTHERS';

export interface CustomExpenseCategory {
  id: string;
  label: string;
  iconName: string; // Refers to a specific lucide icon by name or a generic one
  colorHex: string;
}

export type ExpenseCategory = DefaultExpenseCategory | string; // The string will be the CustomExpenseCategory ID

export type PaymentMethod = 'UPI' | 'CASH' | 'CARD' | 'BANK';

export interface ExpenseEntry {
  id: string;
  amount: number;
  category: ExpenseCategory; 
  paymentMethod: PaymentMethod;
  date: string; // ISO Date String
  notes?: string;
}

export interface ExpenseFormData {
  amount: number;
  category: ExpenseCategory | '';
  paymentMethod: PaymentMethod | '';
  date: string;
  notes: string;
}
