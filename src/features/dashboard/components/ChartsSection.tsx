import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

const spendingData = [
  { name: 'Jan', amount: 12000 },
  { name: 'Feb', amount: 15000 },
  { name: 'Mar', amount: 11000 },
  { name: 'Apr', amount: 18000 },
  { name: 'May', amount: 14000 },
  { name: 'Jun', amount: 11250 },
];

const categoryData = [
  { name: 'Food', value: 4000, color: '#4F46E5' },
  { name: 'Transport', value: 2000, color: '#22C55E' },
  { name: 'Utilities', value: 1500, color: '#F59E0B' },
  { name: 'Entertainment', value: 2000, color: '#EF4444' },
  { name: 'Other', value: 1750, color: '#64748B' },
];

const incomeVsExpenseData = [
  { name: 'Week 1', income: 5000, expense: 2000 },
  { name: 'Week 2', income: 5000, expense: 3500 },
  { name: 'Week 3', income: 5000, expense: 2200 },
  { name: 'Week 4', income: 5000, expense: 3550 },
];

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Spending Trend */}
      <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-text-main">Monthly Spending Trend</h3>
          <select className="text-sm text-text-secondary outline-none bg-transparent cursor-pointer">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
                itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                formatter={(value: any) => [`₹${value}`, 'Amount']}
              />
              <Area type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100">
        <h3 className="font-bold text-text-main mb-6">Expense Categories</h3>
        <div className="flex flex-col md:flex-row items-center h-[250px]">
          <div className="h-full flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 600 }}
                  formatter={(value: any) => [`₹${value}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-xs text-text-secondary font-medium">Total</span>
              <span className="text-xl font-bold text-text-main">₹11.2k</span>
            </div>
          </div>
          <div className="flex-1 w-full pl-0 md:pl-4 flex flex-col gap-3 mt-4 md:mt-0 justify-center">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-text-main font-medium">{cat.name}</span>
                </div>
                <span className="text-text-secondary font-semibold">₹{cat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expenses */}
      <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100">
         <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-text-main">Income vs Expenses</h3>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeVsExpenseData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress (Visual Component instead of chart) */}
      <div className="bg-white rounded-[24px] p-6 shadow-soft border border-gray-100 flex flex-col justify-center">
        <h3 className="font-bold text-text-main mb-6">Budget Progress</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-main">Food & Dining</span>
              <span className="text-text-secondary">₹4,000 / ₹5,000</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-warning rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-main">Transport</span>
              <span className="text-text-secondary">₹2,000 / ₹2,000</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-danger rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-text-main">Entertainment</span>
              <span className="text-text-secondary">₹2,000 / ₹4,000</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
