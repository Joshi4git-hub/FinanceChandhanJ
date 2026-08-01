import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { incomeApi } from '../../income/api/incomeApi';
import { expenseApi } from '../../expense/api/expenseApi';

type Transaction = { id: string; label: string; category: string; date: string; amount: number };

export const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => { void Promise.all([incomeApi.getIncomes(5, 0), expenseApi.getExpenses()]).then(([income, expenses]) => {
    setTransactions([...income.data.map((item) => ({ id: `income-${item.id}`, label: item.sourceLabel, category: item.category, date: item.dateReceived, amount: item.amount })), ...expenses.slice(0, 5).map((item) => ({ id: `expense-${item.id}`, label: item.notes || item.category, category: item.category, date: item.date, amount: -item.amount }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));
  }).catch(() => setTransactions([])); }, []);

  return <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100">
    <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-text-main">Recent Transactions</h3><Link to="/dashboard/expenses" className="text-sm font-medium text-primary hover:text-primary-hover">View expenses</Link></div>
    {transactions.length === 0 ? <p className="py-8 text-center text-sm text-text-secondary">No transactions yet. Add your first income or expense to get started.</p> : <div className="flex flex-col gap-4">{transactions.map((tx) => <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{tx.amount > 0 ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />}</div><div><h4 className="font-semibold text-text-main">{tx.label}</h4><p className="text-xs text-text-secondary">{tx.category} · {new Date(tx.date).toLocaleDateString()}</p></div></div><span className={`font-bold ${tx.amount > 0 ? 'text-success' : 'text-text-main'}`}>{tx.amount > 0 ? '+' : '−'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}</span></div>)}</div>}
  </div>;
};
