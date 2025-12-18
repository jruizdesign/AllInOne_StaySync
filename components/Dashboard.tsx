import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { DollarSign, Users, BedDouble, TrendingUp, CalendarCheck } from 'lucide-react';
import { Booking } from '../types';

const data = [
  { name: 'Mon', revenue: 4000, occupancy: 65 },
  { name: 'Tue', revenue: 3000, occupancy: 58 },
  { name: 'Wed', revenue: 2000, occupancy: 45 },
  { name: 'Thu', revenue: 2780, occupancy: 60 },
  { name: 'Fri', revenue: 5890, occupancy: 85 },
  { name: 'Sat', revenue: 8390, occupancy: 95 },
  { name: 'Sun', revenue: 7490, occupancy: 90 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
      <span className="text-emerald-500 font-medium">{trend}</span>
      <span className="text-slate-400 ml-1">vs last week</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$34,500" 
          trend="+12%" 
          icon={<DollarSign />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Active Bookings" 
          value="42" 
          trend="+8%" 
          icon={<CalendarCheck />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value="78%" 
          trend="+5%" 
          icon={<BedDouble />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Total Guests" 
          value="128" 
          trend="+15%" 
          icon={<Users />} 
          color="bg-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Analytics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Occupancy Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="occupancy" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};