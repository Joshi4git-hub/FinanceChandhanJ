import { db } from '../../../services/db';
import type { DebtEntry, DebtFormData } from '../types';

type StoredDebt = DebtEntry & {
  userId: string;
  debtName?: string;
  minimumMonthlyPayment?: number;
  dueDateDay?: number;
  type?: string;
  totalAmount?: number;
};

const currentUserId = () => {
  const userId = localStorage.getItem('finpilot_user_id') || sessionStorage.getItem('finpilot_user_id');
  if (!userId) throw new Error('Please sign in to manage debts.');
  return userId;
};

const normalizeDebt = (record: StoredDebt): DebtEntry => {
  return {
    id: record.id,
    name: record.name || record.debtName || 'Unknown Debt',
    type: (record.type as any) || 'PERSONAL_LOAN',
    principal: record.principal ?? record.totalAmount ?? 0,
    remainingAmount: record.remainingAmount ?? 0,
    interestRate: record.interestRate ?? 0,
    emi: record.emi ?? record.minimumMonthlyPayment,
    dueDayOfMonth: record.dueDayOfMonth ?? record.dueDateDay ?? 1,
  };
};

export const debtApi = {
  async getDebts(): Promise<DebtEntry[]> {
    const records = await db.getAll<StoredDebt>('debts', currentUserId());
    return records.map(normalizeDebt);
  },

  async addDebt(data: DebtFormData): Promise<DebtEntry> {
    const entry: StoredDebt = { id: `debt_${crypto.randomUUID()}`, userId: currentUserId(), ...data };
    await db.put('debts', entry);
    return entry;
  },

  async updateDebt(id: string, data: DebtFormData): Promise<DebtEntry> {
    const existing = await db.get<StoredDebt>('debts', id);
    if (!existing || existing.userId !== currentUserId()) throw new Error('Debt not found');
    const updated: StoredDebt = { ...existing, ...data };
    await db.put('debts', updated);
    return updated;
  },

  async deleteDebt(id: string): Promise<void> {
    const entry = await db.get<StoredDebt>('debts', id);
    if (!entry || entry.userId !== currentUserId()) throw new Error('Debt not found');
    await db.delete('debts', id);
  },
};
