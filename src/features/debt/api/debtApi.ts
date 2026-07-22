import type { DebtEntry, DebtFormData } from '../types';

let mockDebts: DebtEntry[] = [
  {
    id: '1',
    name: 'HDFC Credit Card',
    type: 'CREDIT_CARD',
    principal: 50000,
    remainingAmount: 25000,
    interestRate: 42, // Ouch
    emi: 2000,
    dueDayOfMonth: 15
  },
  {
    id: '2',
    name: 'SBI Education Loan',
    type: 'EDUCATION_LOAN',
    principal: 800000,
    remainingAmount: 650000,
    interestRate: 8.5,
    emi: 12000,
    dueDayOfMonth: 5
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const debtApi = {
  async getDebts(): Promise<DebtEntry[]> {
    await delay(600);
    return [...mockDebts];
  },

  async addDebt(data: DebtFormData): Promise<DebtEntry> {
    await delay(800);
    const newEntry: DebtEntry = {
      id: `debt_${Date.now()}`,
      ...data
    };
    mockDebts.push(newEntry);
    return newEntry;
  },

  async updateDebt(id: string, data: DebtFormData): Promise<DebtEntry> {
    await delay(800);
    const index = mockDebts.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Debt not found');
    
    mockDebts[index] = { ...mockDebts[index], ...data };
    return mockDebts[index];
  },

  async deleteDebt(id: string): Promise<void> {
    await delay(800);
    mockDebts = mockDebts.filter(d => d.id !== id);
  }
};
