import React, { useMemo } from 'react';
import { UserProfile } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { Users, DollarSign, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  data: UserProfile[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  // KPI Calculations
  const totalUsers = data.length;
  const avgSpending = data.reduce((acc, curr) => acc + curr.totalSpending, 0) / totalUsers;
  const avgOrderValue = data.reduce((acc, curr) => acc + curr.averageOrderValue, 0) / totalUsers;
  const activeUsers = data.filter(u => u.lastLoginDaysAgo <= 14).length;

  // Chart Data Preparation
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(u => {
      counts[u.productCategoryPreference] = (counts[u.productCategoryPreference] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [data]);

  const locationIncomeData = useMemo(() => {
    const locs: Record<string, { totalIncome: number, count: number }> = {};
    data.forEach(u => {
      if (!locs[u.location]) locs[u.location] = { totalIncome: 0, count: 0 };
      locs[u.location].totalIncome += u.income;
      locs[u.location].count += 1;
    });
    return Object.keys(locs).map(key => ({
      name: key,
      avgIncome: Math.round(locs[key].totalIncome / locs[key].count)
    }));
  }, [data]);

  const spendingVsIncomeData = useMemo(() => {
    return data.map(u => ({
      x: u.income,
      y: u.totalSpending,
      z: u.age // Bubble size based on age (or could be purchase freq)
    }));
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Users" value={totalUsers.toString()} icon={<Users size={20} />} change="+12% from last month" />
        <KpiCard title="Avg Total Spending" value={`₹${Math.round(avgSpending).toLocaleString()}`} icon={<DollarSign size={20} />} change="+5.4% from last month" />
        <KpiCard title="Avg Order Value" value={`₹${Math.round(avgOrderValue).toLocaleString()}`} icon={<TrendingUp size={20} />} change="-1.2% from last month" />
        <KpiCard title="Active Users (14d)" value={activeUsers.toString()} icon={<Activity size={20} />} change="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Preference */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Category Preferences</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income by Location */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Average Income by Location</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationIncomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="avgIncome" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Spending vs Income */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending Correlation (Income vs Total Spend)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="Income" unit="₹" />
                <YAxis type="number" dataKey="y" name="Total Spending" unit="₹" />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Age" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Users" data={spendingVsIncomeData} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string }> = ({ title, value, icon, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      </div>
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        {icon}
      </div>
    </div>
    <span className={`text-xs font-medium ${change.includes('+') ? 'text-green-600' : change.includes('-') ? 'text-red-600' : 'text-slate-500'}`}>
      {change}
    </span>
  </div>
);