export type StrategyType = 'BASE' | 'AVALANCHE' | 'SNOWBALL';

export interface MonthlySnapshot {
  monthIndex: number;
  totalRemainingBalance: number;
  totalInterestPaidThisMonth: number;
  totalPrincipalPaidThisMonth: number;
}

export interface PayoffResult {
  strategy: StrategyType;
  totalInterestPaid: number;
  totalMonths: number;
  interestSaved: number; // Compared to BASE
  monthsSaved: number;   // Compared to BASE
  schedule: MonthlySnapshot[];
}

export interface OptimizerData {
  base: PayoffResult;
  avalanche: PayoffResult;
  snowball: PayoffResult;
  bestStrategy: 'AVALANCHE' | 'SNOWBALL' | null;
}
