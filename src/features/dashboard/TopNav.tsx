import React from 'react';
import { Search, Bell, Sun, User } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-text-secondary" />
        </div>
        <input 
          type="text" 
          placeholder="Search transactions, goals, AI insights..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-background"></span>
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
          <Sun size={20} />
        </button>
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-text-main leading-tight">John Doe</p>
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
