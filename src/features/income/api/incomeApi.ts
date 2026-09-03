import { db } from '../../../services/db';
import type { IncomeEntry, IncomeFormData, RecurringIncomeRule } from '../types';

type StoredIncome = IncomeEntry & { userId: string };
const currentUserId = () => {
  const userId = localStorage.getItem('finpilot_user_id') || sessionStorage.getItem('finpilot_user_id');
  if (!userId) throw new Error('Please sign in to manage income.');
  return userId;
};

export const incomeApi = {
  async getIncomes(limit = 10, offset = 0): Promise<{ data: IncomeEntry[]; total: number }> {
    const records = await db.getAll<StoredIncome>('incomes', currentUserId());
    const sorted = records.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime());
    return { data: sorted.slice(offset, offset + limit), total: sorted.length };
  },

  async getRule(_id: string): Promise<RecurringIncomeRule | null> {
    return null;
  },

  async addIncome(data: IncomeFormData): Promise<IncomeEntry> {
    const entry: StoredIncome = {
      id: `inc_${crypto.randomUUID()}`,
      userId: currentUserId(),
      amount: data.amount,
      category: data.category as IncomeEntry['category'],
      sourceLabel: data.sourceLabel.trim(),
      dateReceived: data.dateReceived,
      notes: data.notes.trim() || undefined,
      recurringRuleId: data.isRecurring ? `rule_${crypto.randomUUID()}` : undefined,
    };
    await db.put('incomes', entry);
    return entry;
  },

  async updateIncome(id: string, data: IncomeFormData, _mode: 'SINGLE' | 'SERIES' = 'SINGLE'): Promise<IncomeEntry> {
    const existing = await db.get<StoredIncome>('incomes', id);
    if (!existing || existing.userId !== currentUserId()) throw new Error('Income not found');
    const updated: StoredIncome = { ...existing, amount: data.amount, category: data.category as IncomeEntry['category'], sourceLabel: data.sourceLabel.trim(), dateReceived: data.dateReceived, notes: data.notes.trim() || undefined };
    await db.put('incomes', updated);
    return updated;
  },

  async deleteIncome(id: string, _mode: 'SINGLE' | 'SERIES' | 'SERIES_FUTURE' = 'SINGLE'): Promise<void> {
    const entry = await db.get<StoredIncome>('incomes', id);
    if (!entry || entry.userId !== currentUserId()) throw new Error('Income not found');
    await db.delete('incomes', id);
  },
};
