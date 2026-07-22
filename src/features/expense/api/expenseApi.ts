import type { ExpenseEntry, ExpenseFormData, CustomExpenseCategory } from '../types';

let mockExpenses: ExpenseEntry[] = [
  { id: '1', amount: 450, category: 'FOOD', paymentMethod: 'UPI', date: new Date().toISOString(), notes: 'Lunch with team' },
  { id: '2', amount: 15000, category: 'RENT', paymentMethod: 'BANK', date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: '3', amount: 2500, category: 'SHOPPING', paymentMethod: 'CARD', date: new Date(Date.now() - 86400000 * 12).toISOString(), notes: 'New shoes' },
];

let mockCustomCategories: CustomExpenseCategory[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseApi = {
  async getExpenses(): Promise<ExpenseEntry[]> {
    await delay(600);
    return [...mockExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getCustomCategories(): Promise<CustomExpenseCategory[]> {
    await delay(200);
    return [...mockCustomCategories];
  },

  async addCustomCategory(category: Omit<CustomExpenseCategory, 'id'>): Promise<CustomExpenseCategory> {
    await delay(400);
    const newCategory = { ...category, id: `cat_${Date.now()}` };
    mockCustomCategories.push(newCategory);
    return newCategory;
  },

  async addExpense(data: ExpenseFormData): Promise<ExpenseEntry> {
    await delay(800);
    const newEntry: ExpenseEntry = {
      id: `exp_${Date.now()}`,
      amount: data.amount,
      category: data.category as any,
      paymentMethod: data.paymentMethod as any,
      date: data.date,
      notes: data.notes,
    };
    mockExpenses.push(newEntry);
    return newEntry;
  },

  async updateExpense(id: string, data: ExpenseFormData): Promise<ExpenseEntry> {
    await delay(800);
    const index = mockExpenses.findIndex(exp => exp.id === id);
    if (index === -1) throw new Error('Expense not found');
    
    mockExpenses[index] = {
      ...mockExpenses[index],
      amount: data.amount,
      category: data.category as any,
      paymentMethod: data.paymentMethod as any,
      date: data.date,
      notes: data.notes,
    };
    
    return mockExpenses[index];
  },

  async deleteExpense(id: string): Promise<void> {
    await delay(800);
    mockExpenses = mockExpenses.filter(exp => exp.id !== id);
  }
};
