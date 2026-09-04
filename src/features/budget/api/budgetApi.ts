import { db } from '../../../services/db';
import type { BudgetLimit } from '../types';

type LegacyBudgetRecord = {
  id: string;
  userId: string;
  month: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
};

type StoredBudget = (BudgetLimit & { userId: string }) | LegacyBudgetRecord;
const currentUserId = () => {
  const userId = localStorage.getItem('finpilot_user_id') || sessionStorage.getItem('finpilot_user_id');
  if (!userId) throw new Error('Please sign in to manage budgets.');
  return userId;
};

const isBudgetLimit = (record: StoredBudget): record is BudgetLimit & { userId: string } =>
  'overallLimit' in record && typeof record.overallLimit === 'number';

const isLegacyBudget = (record: StoredBudget): record is LegacyBudgetRecord =>
  'allocatedAmount' in record && typeof record.allocatedAmount === 'number' && 'category' in record;

const normalizeBudget = (record: StoredBudget): BudgetLimit | null => {
  if (isBudgetLimit(record)) {
    return {
      id: record.id,
      month: record.month,
      overallLimit: record.overallLimit,
      categoryLimits: record.categoryLimits || {},
    };
  }

  if (isLegacyBudget(record)) {
    return {
      id: `${record.month}_${record.userId}`,
      month: record.month,
      overallLimit: record.allocatedAmount,
      categoryLimits: { [record.category]: record.allocatedAmount },
    };
  }

  return null;
};

const findBudget = async (month: string) => {
  const budgets = await db.getAll<StoredBudget>('budgets', currentUserId());
  const currentBudget = budgets.find(
    (budget): budget is BudgetLimit & { userId: string } => isBudgetLimit(budget) && budget.month === month
  );
  if (currentBudget) return normalizeBudget(currentBudget);

  // Fallback for legacy category-based budget records.
  const monthlyBudgets = budgets.filter(
    (budget): budget is LegacyBudgetRecord => isLegacyBudget(budget) && budget.month === month
  );
  if (monthlyBudgets.length === 0) return null;

  const categoryLimits: Record<string, number> = {};
  let total = 0;
  monthlyBudgets.forEach((budget) => {
    categoryLimits[budget.category] = (categoryLimits[budget.category] || 0) + budget.allocatedAmount;
    total += budget.allocatedAmount;
  });

  return {
    id: `${month}_${currentUserId()}`,
    month,
    overallLimit: total,
    categoryLimits,
  };
};

export const budgetApi = {
  async getBudgetLimit(month: string): Promise<BudgetLimit | null> {
    return findBudget(month);
  },

  async updateOverallLimit(month: string, overallLimit: number): Promise<BudgetLimit> {
    const existing = await findBudget(month);
    const budget: StoredBudget = {
      id: existing?.id ?? `budget_${crypto.randomUUID()}`,
      userId: currentUserId(),
      month,
      overallLimit,
      categoryLimits: existing?.categoryLimits ?? {},
    };
    await db.put('budgets', budget);
    return budget;
  },

  async updateCategoryLimit(month: string, categoryId: string, limit: number): Promise<BudgetLimit> {
    const existing = await findBudget(month);
    const categoryLimits = { ...(existing?.categoryLimits || {}) };
    if (limit > 0) categoryLimits[categoryId] = limit;
    else delete categoryLimits[categoryId];
    const budget: StoredBudget = {
      id: existing?.id ?? `budget_${crypto.randomUUID()}`,
      userId: currentUserId(),
      month,
      overallLimit: existing?.overallLimit ?? 0,
      categoryLimits,
    };
    await db.put('budgets', budget);
    return budget;
  },

  async getBudgetHistory(): Promise<BudgetLimit[]> {
    const budgets = await db.getAll<StoredBudget>('budgets', currentUserId());
    return budgets
      .map(normalizeBudget)
      .filter((budget): budget is BudgetLimit => budget !== null)
      .sort((a, b) => b.month.localeCompare(a.month));
  },
};
