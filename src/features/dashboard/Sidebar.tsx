import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, PieChart, CreditCard, Target, FileText, Bot, Settings, LogOut, Activity } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ArrowDownToLine, label: 'Income', path: '/dashboard/income' },
    { icon: ArrowUpFromLine, label: 'Expenses', path: '/dashboard/expenses' },
    { icon: PieChart, label: 'Budgets', path: '/dashboard/budgets' },
    { icon: CreditCard, label: 'Debts', path: '/dashboard/debts' },
    { icon: Activity, label: 'Health Score', path: '/dashboard/health' },
    { icon: Target, label: 'Goals', path: '/dashboard/goals' },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports' },
    { icon: Bot, label: 'AI Assistant', path: '/dashboard/ai' },
  ];

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="flex items-center gap-2 text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
          <span className="font-bold text-xl tracking-tight text-text-main">FinPilot AI</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Main Menu</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'text-text-secondary hover:bg-background hover:text-text-main'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-50 flex flex-col gap-1">
        <NavLink to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-text-secondary hover:bg-background hover:text-text-main">
          <Settings size={20} />
          Settings
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-danger hover:bg-danger/10 text-left w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
