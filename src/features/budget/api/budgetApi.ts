import type { BudgetLimit } from '../types';

// Mock storage for budget limits
let mockBudgetLimits: BudgetLimit[] = [
  {
    id: '1',
    month: new Date().toISOString().substring(0, 7), // Current month YYYY-MM
    overallLimit: 25000,
    categoryLimits: {
      'FOOD': 8000,
      'RENT': 10000,
      'TRANSPORT': 3000
    }
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetApi = {
  async getBudgetLimit(monthStr: string): Promise<BudgetLimit | null> {
    await delay(400);
    const limit = mockBudgetLimits.find(b => b.month === monthStr);
    return limit || null;
  },

  async updateOverallLimit(monthStr: string, limit: number): Promise<BudgetLimit> {
    await delay(600);
    const index = mockBudgetLimits.findIndex(b => b.month === monthStr);
    
    if (index >= 0) {
      mockBudgetLimits[index].overallLimit = limit;
      return mockBudgetLimits[index];
    } else {
      const newBudget: BudgetLimit = {
        id: `bud_${Date.now()}`,
        month: monthStr,
        overallLimit: limit,
        categoryLimits: {}
      };
      mockBudgetLimits.push(newBudget);
      return newBudget;
    }
  },

  async updateCategoryLimit(monthStr: string, categoryId: string, limit: number): Promise<BudgetLimit> {
    await delay(600);
    const index = mockBudgetLimits.findIndex(b => b.month === monthStr);
    
    if (index >= 0) {
      if (limit <= 0) {
        delete mockBudgetLimits[index].categoryLimits[categoryId];
      } else {
        mockBudgetLimits[index].categoryLimits[categoryId] = limit;
      }
      return mockBudgetLimits[index];
    } else {
      const newBudget: BudgetLimit = {
        id: `bud_${Date.now()}`,
        month: monthStr,
        overallLimit: 0,
        categoryLimits: limit > 0 ? { [categoryId]: limit } : {}
      };
      mockBudgetLimits.push(newBudget);
      return newBudget;
    }
  },

  // Mocking past history by generating some fake data based on current limit
  async getBudgetHistory(): Promise<BudgetLimit[]> {
    await delay(600);
    return [...mockBudgetLimits];
  }
};
