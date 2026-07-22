import type { DebtEntry } from '../../debt/types';
import type { StrategyType, PayoffResult, MonthlySnapshot } from '../types';

interface MutableDebt {
  id: string;
  balance: number;
  apr: number;
  minPayment: number;
}

// Pure function to calculate fallback EMI if missing (2% or 500)
const getEffectiveMinPayment = (debt: DebtEntry): number => {
  if (debt.emi && debt.emi > 0) return debt.emi;
  const twoPercent = debt.remainingAmount * 0.02;
  return Math.max(twoPercent, 500);
};

export const simulatePayoff = (
  initialDebts: DebtEntry[], 
  extraMonthlyPayment: number, 
  strategy: StrategyType
): PayoffResult => {
  
  // Clone and setup mutable state
  let debts: MutableDebt[] = initialDebts.map(d => ({
    id: d.id,
    balance: d.remainingAmount,
    apr: d.interestRate,
    minPayment: getEffectiveMinPayment(d)
  }));

  let totalInterestPaid = 0;
  let monthIndex = 0;
  const schedule: MonthlySnapshot[] = [];
  const MAX_MONTHS = 600; // 50 year cap to prevent infinite loops

  // Initial snapshot (Month 0)
  schedule.push({
    monthIndex: 0,
    totalRemainingBalance: debts.reduce((sum, d) => sum + d.balance, 0),
    totalInterestPaidThisMonth: 0,
    totalPrincipalPaidThisMonth: 0
  });

  // For rollover strategies, the total committed monthly payment remains constant until all debt is gone.
  // We sum the initial minimum payments of all debts.
  const totalBaseMinPayments = debts.reduce((sum, d) => sum + d.minPayment, 0);

  while (debts.length > 0 && monthIndex < MAX_MONTHS) {
    monthIndex++;
    let interestThisMonth = 0;
    let principalThisMonth = 0;

    // 1. Sort active debts to establish target priority for rollover/extra
    if (strategy === 'SNOWBALL') {
      debts.sort((a, b) => a.balance - b.balance); // Smallest balance first
    } else if (strategy === 'AVALANCHE') {
      debts.sort((a, b) => b.apr - a.apr); // Highest APR first
    } 

    // 2. Accrue Interest for all
    debts.forEach(d => {
      const monthlyInterestRate = (d.apr / 100) / 12;
      const interestAdded = d.balance * monthlyInterestRate;
      d.balance += interestAdded;
      interestThisMonth += interestAdded;
      totalInterestPaid += interestAdded;
    });

    // 3. Determine available funds pool
    let extraPool = 0;
    
    if (strategy === 'BASE') {
      // In BASE, there is no extra payment and no rollover. 
      // User just pays the minimum for whatever debts are still active.
    } else {
      // In SNOWBALL/AVALANCHE, the user commits to a fixed total outflow every month.
      // Outflow = (Original Total Minimums) + (User's Extra Payment)
      // We first subtract the minimums for CURRENTLY ACTIVE debts. The rest goes to the extra pool.
      const currentActiveMins = debts.reduce((sum, d) => sum + d.minPayment, 0);
      const totalCommitted = totalBaseMinPayments + extraMonthlyPayment;
      extraPool = totalCommitted - currentActiveMins;
    }

    // First pass: Apply minimum payments to active debts
    for (let i = 0; i < debts.length; i++) {
      const d = debts[i];
      if (d.balance <= d.minPayment) {
        // Debt will be fully paid by minimum payment
        principalThisMonth += d.balance;
        if (strategy !== 'BASE') {
          // The unused portion of THIS debt's min payment goes to the extra pool THIS month
          extraPool += (d.minPayment - d.balance);
        }
        d.balance = 0;
      } else {
        d.balance -= d.minPayment;
        principalThisMonth += d.minPayment;
      }
    }

    // Filter out zeroed debts
    debts = debts.filter(d => d.balance > 0.01);

    // Second pass: Apply extra pool based on priority (only for SNOWBALL/AVALANCHE)
    if (extraPool > 0 && debts.length > 0) {
      for (let i = 0; i < debts.length; i++) {
        const target = debts[i];
        if (extraPool <= 0) break;

        if (target.balance <= extraPool) {
          extraPool -= target.balance;
          principalThisMonth += target.balance;
          target.balance = 0;
        } else {
          target.balance -= extraPool;
          principalThisMonth += extraPool;
          extraPool = 0;
        }
      }
      debts = debts.filter(d => d.balance > 0.01);
    }

    // Record end of month snapshot
    schedule.push({
      monthIndex,
      totalRemainingBalance: debts.reduce((sum, d) => sum + d.balance, 0),
      totalInterestPaidThisMonth: interestThisMonth,
      totalPrincipalPaidThisMonth: principalThisMonth
    });
  }

  return {
    strategy,
    totalInterestPaid,
    totalMonths: monthIndex,
    interestSaved: 0, // Computed later by comparing to BASE
    monthsSaved: 0,   // Computed later by comparing to BASE
    schedule
  };
};
