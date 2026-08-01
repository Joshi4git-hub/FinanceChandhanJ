import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { incomeApi } from '../income/api/incomeApi';
import { expenseApi } from '../expense/api/expenseApi';

export const ReportsPage: React.FC = () => {
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });
  useEffect(() => {
    void Promise.all([incomeApi.getIncomes(1000, 0), expenseApi.getExpenses()]).then(([income, expenses]) => {
      const month = new Date().toISOString().slice(0, 7);
      const totalIncome = income.data
        .filter((item) => typeof item.dateReceived === 'string' && item.dateReceived.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenses
        .filter((item) => typeof item.date === 'string' && item.date.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0);

      setTotals({ income: totalIncome, expenses: totalExpenses });
    });
  }, []);
  const savings = totals.income - totals.expenses;
  return <DashboardLayout><div className="space-y-6"><div><h1 className="text-3xl font-bold text-text-main">Monthly Report</h1><p className="text-text-secondary mt-1">A live summary of your current-month activity.</p></div><div className="grid md:grid-cols-3 gap-6">{[['Income', totals.income, 'text-success'], ['Expenses', totals.expenses, 'text-danger'], ['Net savings', savings, savings >= 0 ? 'text-primary' : 'text-danger']].map(([label, value, color]) => <div key={label as string} className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100"><p className="text-text-secondary text-sm">{label}</p><p className={`text-3xl font-bold mt-2 ${color}`}>₹{Number(value).toLocaleString('en-IN')}</p></div>)}</div><div className="bg-white rounded-[24px] p-6 border border-gray-100"><h2 className="font-bold text-text-main">Spending rate</h2><p className="text-text-secondary mt-2">{totals.income ? `${(totals.expenses / totals.income * 100).toFixed(1)}% of this month's income has been spent.` : 'Add income to calculate your spending rate.'}</p></div></div></DashboardLayout>;
};
