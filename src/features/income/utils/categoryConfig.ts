import { Briefcase, GraduationCap, Laptop, BookOpen, CircleDollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IncomeCategory } from '../types';

export interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const incomeCategoryConfig: Record<IncomeCategory, CategoryConfig> = {
  SALARY: {
    label: 'Salary',
    icon: Briefcase,
    color: 'bg-primary/10 text-primary',
  },
  INTERNSHIP: {
    label: 'Internship',
    icon: GraduationCap,
    color: 'bg-success/10 text-success',
  },
  FREELANCING: {
    label: 'Freelancing',
    icon: Laptop,
    color: 'bg-warning/10 text-warning',
  },
  SCHOLARSHIP: {
    label: 'Scholarship',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-600',
  },
  OTHERS: {
    label: 'Others',
    icon: CircleDollarSign,
    color: 'bg-gray-100 text-gray-600',
  },
};
