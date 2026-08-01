import React from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const TopNav: React.FC = () => {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-secondary" />
        </div>
        <input 
          type="text" 
          placeholder="Search transactions, goals, AI insights..."
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 dark:text-gray-100"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background"></span>
        </button>
        <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label="Toggle color theme" className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
          {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
        <button onClick={() => navigate('/dashboard/settings')} aria-label="Open account settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-text-main leading-tight">{user?.fullName || 'User'}</p>
            <p className="text-xs text-text-secondary">Premium User</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <User size={20} />
          </div>
        </button>
      </div>
    </header>
  );
};
