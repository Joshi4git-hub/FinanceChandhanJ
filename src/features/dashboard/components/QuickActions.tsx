import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const actions = [
    { label: 'Add Expense', icon: ArrowUpRight, path: '/dashboard/expenses', color: 'text-danger bg-danger/10 group-hover:bg-danger group-hover:text-white' },
    { label: 'Add Income', icon: ArrowDownRight, path: '/dashboard/income', color: 'text-success bg-success/10 group-hover:bg-success group-hover:text-white' },
    { label: 'Add Debt', icon: Plus, path: '/dashboard/debts', color: 'text-warning bg-warning/10 group-hover:bg-warning group-hover:text-white' },
    { label: 'Set Budget', icon: Target, path: '/dashboard/budgets', color: 'text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white' },
  ];
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{actions.map((action) => <button key={action.label} onClick={() => navigate(action.path)} className="group bg-white rounded-2xl p-4 shadow-soft border border-gray-100 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-soft-hover hover:-translate-y-1"><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${action.color}`}><action.icon size={24} /></div><span className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">{action.label}</span></button>)}</div>;
};
