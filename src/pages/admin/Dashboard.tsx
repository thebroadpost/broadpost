import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileText, Eye, MessageSquare, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 bg-white" />)}
        </div>
        <Skeleton className="h-96 w-full bg-white mt-8" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Posts', value: stats?.totalPosts, icon: FileText, color: 'text-blue-500' },
    { title: 'Published', value: stats?.publishedPosts, icon: CheckCircle, color: 'text-green-500' },
    { title: 'Drafts', value: stats?.draftPosts, icon: Eye, color: 'text-yellow-500' },
    { title: 'Total Comments', value: stats?.totalComments, icon: MessageSquare, color: 'text-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded shadow-sm border border-border flex items-center justify-between">
              <div>
                <p className="text-sm font-sans font-medium text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-bold font-sans text-primary mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 bg-gray-50 rounded-full ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded shadow-sm border border-border">
        <h2 className="text-xl font-serif font-bold text-primary mb-6">Views Overview (Last 7 Days)</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.viewsData || []}>
              <XAxis dataKey="date" stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                cursor={{ fill: '#F5F5F5' }}
                contentStyle={{ borderRadius: '4px', border: '1px solid #E2E2E2', fontFamily: 'Inter' }}
              />
              <Bar dataKey="views" fill="#000000" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
