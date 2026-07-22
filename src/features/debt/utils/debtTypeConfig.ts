import { GraduationCap, User, CreditCard, Car, HandCoins } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DebtType } from '../types';

export interface DebtTypeConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  requiresEmi: boolean;
}

export const debtTypeConfig: Record<DebtType, DebtTypeConfig> = {
  EDUCATION_LOAN: { 
    label: 'Education Loan', 
    icon: GraduationCap, 
    color: 'bg-emerald-100 text-emerald-600',
    requiresEmi: true
  },
  PERSONAL_LOAN: { 
    label: 'Personal Loan', 
    icon: User, 
    color: 'bg-purple-100 text-purple-600',
    requiresEmi: true
  },
  CREDIT_CARD: { 
    label: 'Credit Card', 
    icon: CreditCard, 
    color: 'bg-rose-100 text-rose-600',
    requiresEmi: false
  },
  VEHICLE_LOAN: { 
    label: 'Vehicle Loan', 
    icon: Car, 
    color: 'bg-blue-100 text-blue-600',
    requiresEmi: true
  },
  BORROWED_MONEY: { 
    label: 'Borrowed Money', 
    icon: HandCoins, 
    color: 'bg-amber-100 text-amber-600',
    requiresEmi: false
  }
};
