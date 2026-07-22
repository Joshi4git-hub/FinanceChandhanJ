import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { IncomeOverview } from './features/income/components/IncomeOverview/IncomeOverview';
import { ExpenseOverview } from './features/expense/components/ExpenseOverview/ExpenseOverview';
import { BudgetOverview } from './features/budget/components/BudgetOverview/BudgetOverview';
import { DebtOverview } from './features/debt/components/DebtOverview/DebtOverview';
import { OptimizerDashboard } from './features/debt-optimizer/components/OptimizerDashboard';
import { HealthScoreDashboard } from './features/health-score/components/HealthScoreDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/income" element={<IncomeOverview />} />
        <Route path="/dashboard/expenses" element={<ExpenseOverview />} />
        <Route path="/dashboard/budgets" element={<BudgetOverview />} />
        <Route path="/dashboard/debts" element={<DebtOverview />} />
        <Route path="/dashboard/debt-optimizer" element={<OptimizerDashboard />} />
        <Route path="/dashboard/health" element={<HealthScoreDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
