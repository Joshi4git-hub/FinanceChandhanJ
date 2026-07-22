import React from 'react';
import { ShoppingBag, Coffee, Smartphone, Car, Home } from 'lucide-react';

export const RecentTransactions: React.FC = () => {
  const transactions = [
    { id: 1, merchant: 'Swiggy', category: 'Food', method: 'UPI', amount: -420, date: 'Today', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
    { id: 2, merchant: 'Amazon Prime', category: 'Subscription', method: 'Credit Card', amount: -1499, date: 'Yesterday', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { id: 3, merchant: 'Uber', category: 'Transport', method: 'UPI', amount: -250, date: 'Yesterday', icon: Car, color: 'bg-gray-100 text-gray-800' },
    { id: 4, merchant: 'Salary', category: 'Income', method: 'Bank Transfer', amount: 45000, date: 'Mon, 12 Jul', icon: Home, color: 'bg-success/10 text-success' },
    { id: 5, merchant: 'Airtel', category: 'Bills', method: 'Credit Card', amount: -799, date: 'Sun, 11 Jul', icon: Smartphone, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-main">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary hover:text-primary-hover">View All</button>
      </div>

      <div className="flex flex-col gap-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.color}`}>
                <tx.icon size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-main mb-0.5 group-hover:text-primary transition-colors">{tx.merchant}</h4>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{tx.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>{tx.method}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`font-bold mb-0.5 ${tx.amount > 0 ? 'text-success' : 'text-text-main'}`}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
              </div>
              <div className="text-xs text-text-secondary">{tx.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
