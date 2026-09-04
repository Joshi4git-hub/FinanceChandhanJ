export interface HealthScoreInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalDebtPrincipal: number; 
  totalMonthlyEmi: number;
  monthlyBudgetLimit: number;
  emergencyFundMonthsSaved: number; // Mocked for now until Mod 11
}

export type FactorStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface FactorBreakdown {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: FactorStatus;
  message: string;
}

export interface HealthScoreResult {
  overallScore: number;
  breakdown: FactorBreakdown[];
  suggestions: string[];
}
