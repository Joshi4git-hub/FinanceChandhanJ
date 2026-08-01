import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { incomeApi } from '../../income/api/incomeApi';
import { expenseApi } from '../../expense/api/expenseApi';
import { debtApi } from '../../debt/api/debtApi';

export const HeroSection: React.FC = () => {
  const [metrics, setMetrics] = useState({ income: 0, expenses: 0, debt: 0 });
  useEffect(() => { void Promise.all([incomeApi.getIncomes(1000, 0), expenseApi.getExpenses(), debtApi.getDebts()]).then(([incomes, expenses, debts]) => {
    const month = new Date().toISOString().slice(0, 7);
    setMetrics({
      income: incomes.data
        .filter((item) => typeof item.dateReceived === 'string' && item.dateReceived.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0),
      expenses: expenses
        .filter((item) => typeof item.date === 'string' && item.date.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0),
      debt: debts.reduce((sum, item) => sum + item.remainingAmount, 0)
    });
  }).catch(() => setMetrics({ income: 0, expenses: 0, debt: 0 })); }, []);
  const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const balance = metrics.income - metrics.expenses;
  return <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-hover rounded-[24px] p-8 text-white shadow-soft flex flex-col justify-between min-h-52"><div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1.5 rounded-full text-sm font-medium"><Wallet size={16} />This month's balance</div><div><h2 className="text-5xl font-bold tracking-tight">{money(balance)}</h2><p className="text-white/80 font-medium mt-2">Income minus expenses for the current month</p></div></div>
    <Metric title="Monthly Income" value={money(metrics.income)} icon={<ArrowDownRight size={20} />} color="text-success bg-success/10" />
    <Metric title="Monthly Expenses" value={money(metrics.expenses)} icon={<ArrowUpRight size={20} />} color="text-danger bg-danger/10" />
    <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex items-center justify-between"><div><p className="text-text-secondary text-sm font-medium">Total outstanding debt</p><h3 className="text-2xl font-bold text-text-main mt-1">{money(metrics.debt)}</h3></div><p className="text-sm text-text-secondary">Add debt accounts to track repayment progress.</p></div>
  </div>;
};

const Metric: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex flex-col justify-center"><div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div><p className="text-text-secondary text-sm font-medium mt-4">{title}</p><h3 className="text-2xl font-bold text-text-main mt-1">{value}</h3></div>;
