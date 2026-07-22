import type { IncomeEntry, IncomeFormData, RecurringIncomeRule } from '../types';

// Mock data storage
let mockIncomes: IncomeEntry[] = [
  { id: '1', amount: 45000, category: 'SALARY', sourceLabel: 'Tech Corp', dateReceived: new Date().toISOString(), recurringRuleId: 'r1' },
  { id: '2', amount: 5000, category: 'FREELANCING', sourceLabel: 'Client Project', dateReceived: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '3', amount: 15000, category: 'INTERNSHIP', sourceLabel: 'Startup Inc', dateReceived: new Date(Date.now() - 86400000 * 15).toISOString(), recurringRuleId: 'r2' },
];

let mockRules: RecurringIncomeRule[] = [
  { id: 'r1', frequency: 'MONTHLY' },
  { id: 'r2', frequency: 'MONTHLY' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const incomeApi = {
  async getIncomes(limit = 10, offset = 0): Promise<{ data: IncomeEntry[], total: number }> {
    await delay(600);
    // Sort descending by date
    const sorted = [...mockIncomes].sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime());
    return {
      data: sorted.slice(offset, offset + limit),
      total: sorted.length
    };
  },

  async getRule(id: string): Promise<RecurringIncomeRule | null> {
    await delay(300);
    return mockRules.find(r => r.id === id) || null;
  },

  async addIncome(data: IncomeFormData): Promise<IncomeEntry> {
    await delay(800);
    
    let ruleId: string | undefined = undefined;
    
    if (data.isRecurring && data.recurringFrequency) {
      const newRule: RecurringIncomeRule = {
        id: `r_${Date.now()}`,
        frequency: data.recurringFrequency,
        endDate: data.recurringEndDate
      };
      mockRules.push(newRule);
      ruleId = newRule.id;
    }

    const newEntry: IncomeEntry = {
      id: `inc_${Date.now()}`,
      amount: data.amount,
      category: data.category as any,
      sourceLabel: data.sourceLabel,
      dateReceived: data.dateReceived,
      notes: data.notes,
      recurringRuleId: ruleId
    };

    mockIncomes.push(newEntry);
    return newEntry;
  },

  async updateIncome(
    id: string, 
    data: IncomeFormData, 
    updateMode: 'SINGLE' | 'SERIES' = 'SINGLE'
  ): Promise<IncomeEntry> {
    await delay(800);
    
    const index = mockIncomes.findIndex(inc => inc.id === id);
    if (index === -1) throw new Error('Income not found');
    
    const existingEntry = mockIncomes[index];

    // Simple single update mock
    if (updateMode === 'SINGLE' || !existingEntry.recurringRuleId) {
      mockIncomes[index] = {
        ...existingEntry,
        amount: data.amount,
        category: data.category as any,
        sourceLabel: data.sourceLabel,
        dateReceived: data.dateReceived,
        notes: data.notes,
      };
      return mockIncomes[index];
    } else {
      // Mocking 'SERIES' update: in a real backend, this would update the rule and all future generated instances
      // For mock, we just update the rule and this single instance for simplicity.
      const ruleIndex = mockRules.findIndex(r => r.id === existingEntry.recurringRuleId);
      if (ruleIndex !== -1 && data.recurringFrequency) {
        mockRules[ruleIndex] = {
          ...mockRules[ruleIndex],
          frequency: data.recurringFrequency,
          endDate: data.recurringEndDate
        };
      }
      
      // Update all past mock entries with this rule id (just to simulate series update visually)
      mockIncomes = mockIncomes.map(inc => {
        if (inc.recurringRuleId === existingEntry.recurringRuleId) {
          return {
            ...inc,
            amount: data.amount,
            category: data.category as any,
            sourceLabel: data.sourceLabel,
          };
        }
        return inc;
      });

      return mockIncomes.find(inc => inc.id === id)!;
    }
  },

  async deleteIncome(
    id: string, 
    deleteMode: 'SINGLE' | 'SERIES' | 'SERIES_FUTURE' = 'SINGLE'
  ): Promise<void> {
    await delay(800);
    
    const entry = mockIncomes.find(inc => inc.id === id);
    if (!entry) throw new Error('Income not found');

    if (deleteMode === 'SINGLE' || !entry.recurringRuleId) {
      mockIncomes = mockIncomes.filter(inc => inc.id !== id);
    } else {
      // Mock SERIES delete: delete all entries with this rule and the rule itself
      mockIncomes = mockIncomes.filter(inc => inc.recurringRuleId !== entry.recurringRuleId);
      mockRules = mockRules.filter(r => r.id !== entry.recurringRuleId);
    }
  }
};
