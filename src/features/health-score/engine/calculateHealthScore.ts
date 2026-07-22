import type { HealthScoreInput, HealthScoreResult, FactorBreakdown, FactorStatus } from '../types';

// Helper to determine status color/word
const getStatus = (score: number, maxScore: number): FactorStatus => {
  const ratio = score / maxScore;
  if (ratio >= 0.9) return 'EXCELLENT';
  if (ratio >= 0.7) return 'GOOD';
  if (ratio >= 0.4) return 'FAIR';
  return 'POOR';
};

export const calculateHealthScore = (input: HealthScoreInput): HealthScoreResult => {
  const breakdown: FactorBreakdown[] = [];
  const suggestions: string[] = [];

  const {
    monthlyIncome,
    monthlyExpenses,
    totalDebtPrincipal,
    totalMonthlyEmi,
    monthlyBudgetLimit,
    emergencyFundMonthsSaved
  } = input;

  // Edge Case: If no income, score is 0 by default to avoid NaN/Infinity
  if (monthlyIncome <= 0) {
    return {
      overallScore: 0,
      breakdown: [],
      suggestions: ["Start by recording a reliable source of monthly income."]
    };
  }

  // 1. Savings Rate (Max 25 pts). Target: 20%+
  const savingsAmount = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = savingsAmount / monthlyIncome;
  const savingsScore = Math.min(25, (savingsRate / 0.20) * 25);
  const savingsStatus = getStatus(savingsScore, 25);
  
  breakdown.push({
    id: 'savings',
    name: 'Savings Rate',
    score: Math.round(savingsScore),
    maxScore: 25,
    status: savingsStatus,
    message: savingsStatus === 'EXCELLENT' 
      ? `Great job saving ${(savingsRate * 100).toFixed(1)}% of your income.`
      : `You are saving ${(savingsRate * 100).toFixed(1)}% of your income. Try to reach 20%.`
  });

  if (savingsScore < 15) {
    suggestions.push(`Try to reduce discretionary expenses to boost your savings rate closer to 20%.`);
  }

  // 2. Debt-to-Income Ratio (Max 20 pts). Target: < 36%
  // Using total debt vs annual income, or monthly debt payments vs monthly income? 
  // DTI is traditionally monthly debt obligations / monthly income.
  // We already have EMI Burden for that. So let's use Total Debt / Annual Income for this one to measure overall leverage.
  const annualIncome = monthlyIncome * 12;
  const leverageRatio = totalDebtPrincipal / annualIncome;
  let dtiScore = 20;
  if (leverageRatio > 0.5) {
    dtiScore = 0;
  } else {
    // 0 ratio = 20 pts, 0.5 ratio = 0 pts
    dtiScore = Math.max(0, ((0.5 - leverageRatio) / 0.5) * 20);
  }
  const dtiStatus = getStatus(dtiScore, 20);

  breakdown.push({
    id: 'dti',
    name: 'Overall Leverage',
    score: Math.round(dtiScore),
    maxScore: 20,
    status: dtiStatus,
    message: dtiStatus === 'POOR' 
      ? `High debt relative to income. Prioritize debt repayment.`
      : `Healthy overall debt levels.`
  });

  if (dtiScore < 10) {
    suggestions.push(`Your total debt is quite high compared to your annual income. Avoid taking on new loans.`);
  }

  // 3. Emergency Fund (Max 20 pts). Target: 6 months
  const emergencyScore = Math.min(20, (emergencyFundMonthsSaved / 6) * 20);
  const emergencyStatus = getStatus(emergencyScore, 20);

  breakdown.push({
    id: 'emergency',
    name: 'Emergency Fund',
    score: Math.round(emergencyScore),
    maxScore: 20,
    status: emergencyStatus,
    message: `${emergencyFundMonthsSaved.toFixed(1)} months of expenses saved.`
  });

  if (emergencyScore < 10) {
    suggestions.push(`Build your emergency fund up to 6 months of expenses to protect against unexpected shocks.`);
  }

  // 4. EMI Burden (Max 20 pts). Target: < 30%
  const emiRatio = totalMonthlyEmi / monthlyIncome;
  let emiScore = 20;
  if (emiRatio > 0.4) {
    emiScore = 0;
  } else {
    // 0 ratio = 20 pts, 0.4 ratio = 0 pts
    emiScore = Math.max(0, ((0.4 - emiRatio) / 0.4) * 20);
  }
  const emiStatus = getStatus(emiScore, 20);

  breakdown.push({
    id: 'emi',
    name: 'EMI Burden',
    score: Math.round(emiScore),
    maxScore: 20,
    status: emiStatus,
    message: emiStatus === 'POOR'
      ? `Too much of your monthly income goes to EMI payments.`
      : `Comfortable monthly debt obligations.`
  });

  if (emiScore < 10) {
    suggestions.push(`Consider using the Debt Optimizer to rapidly pay off a loan and free up monthly cash flow.`);
  }

  // 5. Budget Discipline (Max 15 pts). Target: < 100% of budget limit
  let budgetScore = 15;
  let budgetUsage = 0;
  if (monthlyBudgetLimit > 0) {
    budgetUsage = monthlyExpenses / monthlyBudgetLimit;
    if (budgetUsage <= 1) {
      budgetScore = 15;
    } else if (budgetUsage > 1.1) {
      budgetScore = 0;
    } else {
      // Scales down from 15 to 0 between 100% and 110%
      budgetScore = Math.max(0, ((1.1 - budgetUsage) / 0.1) * 15);
    }
  }
  const budgetStatus = getStatus(budgetScore, 15);

  breakdown.push({
    id: 'budget',
    name: 'Budget Discipline',
    score: Math.round(budgetScore),
    maxScore: 15,
    status: budgetStatus,
    message: monthlyBudgetLimit > 0 
      ? `Used ${(budgetUsage * 100).toFixed(1)}% of your monthly budget.`
      : `No budget limit set. Set one to track discipline.`
  });

  if (monthlyBudgetLimit === 0) {
    suggestions.push(`Set a monthly budget limit in the Budgets module to better track your spending discipline.`);
  } else if (budgetScore < 10) {
    suggestions.push(`You are exceeding your monthly budget limit. Review your category limits to see where you're overspending.`);
  }

  // Calculate Overall Score
  const overallScore = Math.round(
    savingsScore + dtiScore + emergencyScore + emiScore + budgetScore
  );

  // Fallback if no suggestions were generated (meaning perfect score)
  if (suggestions.length === 0) {
    suggestions.push("Keep up the excellent work! Your finances are in stellar shape.");
  }

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    breakdown,
    suggestions: suggestions.slice(0, 4) // Max 4 suggestions
  };
};
