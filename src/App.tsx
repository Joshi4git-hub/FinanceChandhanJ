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
import { ProfilePage } from './features/profile/ProfilePage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { GoalsPage } from './features/goals/GoalsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AIAssistantPage } from './features/ai-assistant/AIAssistantPage';
import { AuthCallback } from './features/auth/AuthCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/income" element={<ProtectedRoute><IncomeOverview /></ProtectedRoute>} />
        <Route path="/dashboard/expenses" element={<ProtectedRoute><ExpenseOverview /></ProtectedRoute>} />
        <Route path="/dashboard/budgets" element={<ProtectedRoute><BudgetOverview /></ProtectedRoute>} />
        <Route path="/dashboard/debts" element={<ProtectedRoute><DebtOverview /></ProtectedRoute>} />
        <Route path="/dashboard/debt-optimizer" element={<ProtectedRoute><OptimizerDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/health" element={<ProtectedRoute><HealthScoreDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/ai" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
