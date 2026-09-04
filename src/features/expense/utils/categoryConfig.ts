import { 
  Utensils, Car, Home, Zap, ShoppingBag, Gamepad2, 
  HeartPulse, GraduationCap, CircleDollarSign
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DefaultExpenseCategory } from '../types';

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const defaultExpenseCategoryConfig: Record<DefaultExpenseCategory, CategoryConfig> = {
  FOOD: { label: 'Food & Dining', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  TRANSPORT: { label: 'Transport', icon: Car, color: 'bg-blue-100 text-blue-600' },
  RENT: { label: 'Rent', icon: Home, color: 'bg-indigo-100 text-indigo-600' },
  UTILITIES: { label: 'Utilities', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  SHOPPING: { label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600' },
  ENTERTAINMENT: { label: 'Entertainment', icon: Gamepad2, color: 'bg-purple-100 text-purple-600' },
  HEALTH: { label: 'Health', icon: HeartPulse, color: 'bg-red-100 text-red-600' },
  EDUCATION: { label: 'Education', icon: GraduationCap, color: 'bg-emerald-100 text-emerald-600' },
  OTHERS: { label: 'Others', icon: CircleDollarSign, color: 'bg-gray-100 text-gray-600' },
};
