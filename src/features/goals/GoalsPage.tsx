import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { db, type GoalRecord } from '../../services/db';

const userId = () => localStorage.getItem('finpilot_user_id') || sessionStorage.getItem('finpilot_user_id');

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const load = useCallback(async () => { const id = userId(); setGoals(id ? await db.getAll<GoalRecord>('goals', id) : []); }, []);
  useEffect(() => { void load(); }, [load]);
  const addGoal = async (event: React.FormEvent) => { event.preventDefault(); const id = userId(); const target = Number(targetAmount); if (!id || !title.trim() || !target || !targetDate) return; await db.put('goals', { id: `goal_${crypto.randomUUID()}`, userId: id, title: title.trim(), targetAmount: target, currentAmount: 0, targetDate, category: 'SAVINGS' }); setTitle(''); setTargetAmount(''); setTargetDate(''); await load(); };
  return <DashboardLayout><div className="space-y-6"><div><h1 className="text-3xl font-bold text-text-main">Financial Goals</h1><p className="text-text-secondary mt-1">Set targets and track your savings progress.</p></div>
    <form onSubmit={addGoal} className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"><label className="flex flex-col gap-1 text-sm font-medium">Goal name<input value={title} onChange={(e) => setTitle(e.target.value)} required className="p-3 rounded-xl border border-gray-200" placeholder="Emergency fund" /></label><label className="flex flex-col gap-1 text-sm font-medium">Target amount<input value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required min="1" type="number" className="p-3 rounded-xl border border-gray-200" placeholder="100000" /></label><label className="flex flex-col gap-1 text-sm font-medium">Target date<input value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required type="date" className="p-3 rounded-xl border border-gray-200" /></label><button className="bg-primary text-white p-3 rounded-xl font-semibold flex justify-center gap-2"><Plus size={18} />Add goal</button></form>
    {goals.length === 0 ? <div className="bg-white rounded-[24px] p-12 text-center text-text-secondary border border-gray-100">No goals yet. Create one above to start planning.</div> : <div className="grid md:grid-cols-2 gap-5">{goals.map((goal) => { const progress = Math.min(100, goal.targetAmount ? goal.currentAmount / goal.targetAmount * 100 : 0); return <div key={goal.id} className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100"><div className="flex justify-between gap-4"><div><Target className="text-primary mb-3" size={22} /><h2 className="font-bold text-text-main">{goal.title}</h2><p className="text-sm text-text-secondary">Due {new Date(goal.targetDate).toLocaleDateString()}</p></div><strong>₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}</strong></div><div className="h-3 bg-gray-100 rounded-full mt-5 overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} /></div><p className="text-right text-xs text-text-secondary mt-2">{progress.toFixed(0)}% complete</p></div>; })}</div>}</div></DashboardLayout>;
};
