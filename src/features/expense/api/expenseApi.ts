import { db } from '../../../services/db';
import type { ExpenseEntry, ExpenseFormData, CustomExpenseCategory } from '../types';

type StoredExpense = ExpenseEntry & { userId: string };
const currentUserId = () => {
  const userId = localStorage.getItem('finpilot_user_id') || sessionStorage.getItem('finpilot_user_id');
  if (!userId) throw new Error('Please sign in to manage expenses.');
  return userId;
};
const categoryKey = (userId: string) => `finpilot_expense_categories_${userId}`;

const normalizeExpense = (record: StoredExpense): ExpenseEntry => {
  const date = record.date || (record as any).dateSpent || new Date().toISOString();
  return {
    id: record.id,
    amount: record.amount,
    category: record.category,
    paymentMethod: record.paymentMethod,
    date,
    notes: record.notes,
  };
};

export const expenseApi = {
  async getExpenses(): Promise<ExpenseEntry[]> {
    const records = await db.getAll<StoredExpense>('expenses', currentUserId());
    return records
      .map(normalizeExpense)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getCustomCategories(): Promise<CustomExpenseCategory[]> {
    return JSON.parse(localStorage.getItem(categoryKey(currentUserId())) || '[]') as CustomExpenseCategory[];
  },

  async addCustomCategory(category: Omit<CustomExpenseCategory, 'id'>): Promise<CustomExpenseCategory> {
    const userId = currentUserId();
    const categories = await this.getCustomCategories();
    const created = { ...category, id: `cat_${crypto.randomUUID()}` };
    localStorage.setItem(categoryKey(userId), JSON.stringify([...categories, created]));
    return created;
  },

  async addExpense(data: ExpenseFormData): Promise<ExpenseEntry> {
    const entry: StoredExpense = { id: `exp_${crypto.randomUUID()}`, userId: currentUserId(), amount: data.amount, category: data.category, paymentMethod: data.paymentMethod as ExpenseEntry['paymentMethod'], date: data.date, notes: data.notes.trim() || undefined };
    await db.put('expenses', entry);
    return entry;
  },

  async updateExpense(id: string, data: ExpenseFormData): Promise<ExpenseEntry> {
    const existing = await db.get<StoredExpense>('expenses', id);
    if (!existing || existing.userId !== currentUserId()) throw new Error('Expense not found');
    const updated: StoredExpense = { ...existing, amount: data.amount, category: data.category, paymentMethod: data.paymentMethod as ExpenseEntry['paymentMethod'], date: data.date, notes: data.notes.trim() || undefined };
    await db.put('expenses', updated);
    return updated;
  },

  async deleteExpense(id: string): Promise<void> {
    const entry = await db.get<StoredExpense>('expenses', id);
    if (!entry || entry.userId !== currentUserId()) throw new Error('Expense not found');
    await db.delete('expenses', id);
  },
};
