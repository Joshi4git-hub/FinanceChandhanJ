export type DebtType = 
  | 'EDUCATION_LOAN' 
  | 'PERSONAL_LOAN' 
  | 'CREDIT_CARD' 
  | 'VEHICLE_LOAN' 
  | 'BORROWED_MONEY';

export interface DebtEntry {
  id: string;
  name: string;             // e.g., "HDFC Credit Card"
  type: DebtType;
  principal: number;        // Original amount borrowed
  remainingAmount: number;  // Current outstanding balance
  interestRate: number;     // Annual Percentage Rate (APR)
  emi?: number;             // Optional for Credit Cards/Borrowed Money
  dueDayOfMonth: number;    // 1-31
}

export type DebtFormData = Omit<DebtEntry, 'id'>;
