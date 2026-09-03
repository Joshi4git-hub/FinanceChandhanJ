import React, { useEffect, useState } from 'react';
import { Bot, Send } from 'lucide-react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { incomeApi } from '../income/api/incomeApi';
import { expenseApi } from '../expense/api/expenseApi';

export const AIAssistantPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('I can summarize your current-month income, expenses, and savings from the data you add.');
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
  const ask = (event: React.FormEvent) => { event.preventDefault(); if (!question.trim()) return; const balance = totals.income - totals.expenses; setReply(totals.income === 0 ? 'Add your income and expenses first, then I can provide a useful summary.' : `This month you have earned ₹${totals.income.toLocaleString('en-IN')}, spent ₹${totals.expenses.toLocaleString('en-IN')}, and have ₹${balance.toLocaleString('en-IN')} remaining. ${balance < 0 ? 'Your expenses exceed income, so review your largest spending categories.' : 'You are currently spending within your income.'}`); setQuestion(''); };
  return <DashboardLayout><div className="max-w-3xl space-y-6"><div><h1 className="text-3xl font-bold text-text-main">AI Financial Assistant</h1><p className="text-text-secondary mt-1">Ask for a summary of the financial information you have recorded.</p></div><div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100"><div className="flex gap-3"><div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Bot size={20} /></div><p className="text-text-main leading-7">{reply}</p></div></div><form onSubmit={ask} className="flex gap-3"><input value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1 p-4 rounded-2xl border border-gray-200 outline-none focus:border-primary" placeholder="How am I doing this month?" /><button className="bg-primary text-white rounded-2xl px-5" aria-label="Ask assistant"><Send size={20} /></button></form></div></DashboardLayout>;
};
