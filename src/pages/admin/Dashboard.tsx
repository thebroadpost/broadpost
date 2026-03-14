import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats, getAllComments } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileText, Eye, MessageSquare, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  const { data: comments } = useQuery({
    queryKey: ['dashboardComments'],
    queryFn: () => getAllComments(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28 bg-white" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Skeleton className="xl:col-span-8 h-80 bg-white" />
          <Skeleton className="xl:col-span-4 h-80 bg-white" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Skeleton className="xl:col-span-8 h-80 bg-white" />
          <Skeleton className="xl:col-span-4 h-80 bg-white" />
        </div>
      </div>
    );
  }

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  const statCards = [
    { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, iconBg: 'bg-blue-50 text-blue-600' },
    { title: 'Published', value: stats?.publishedPosts || 0, icon: CheckCircle, iconBg: 'bg-emerald-50 text-emerald-600' },
    { title: 'Drafts', value: stats?.draftPosts || 0, icon: Activity, iconBg: 'bg-amber-50 text-amber-600' },
    { title: 'Comments', value: stats?.totalComments || 0, icon: MessageSquare, iconBg: 'bg-violet-50 text-violet-600' },
    { title: 'Views', value: stats?.totalViews || 0, icon: Eye, iconBg: 'bg-cyan-50 text-cyan-600' },
  ];

  const totalPosts = stats?.totalPosts || 0;
  const publishedRate = totalPosts > 0 ? Math.round(((stats?.publishedPosts || 0) / totalPosts) * 100) : 0;
  const draftRate = 100 - publishedRate;

  const publicationHealthData = [
    { name: 'Published', value: publishedRate, fill: '#0284c7' },
  ];

  const recentComments = (comments || []).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">Dashboard</h1>
          <p className="text-sm font-sans text-gray-500 mt-1">Real-time publishing and audience insights from your live data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-border flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-sans font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <p className="text-3xl font-bold font-sans text-primary mt-2 leading-none">{compact.format(stat.value)}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-primary">Site Visitors</h2>
            <div className="inline-flex items-center gap-1 text-xs font-sans font-bold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              Last 7 Days
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.viewsData || []} barGap={14}>
                <XAxis dataKey="date" stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A9A" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#F5F5F5' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E2E2', fontFamily: 'Inter' }}
                />
                <Bar dataKey="views" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-serif font-bold text-primary mb-4">Top Categories</h2>
            <div className="space-y-3">
              {(stats?.topCategories || []).map((cat) => (
                <div key={cat.slug} className="flex items-center justify-between border-b border-border last:border-0 pb-2">
                  <span className="font-sans font-medium text-primary">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-600">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <h2 className="text-xl font-serif font-bold text-primary mb-4">Recent Comments</h2>
            <div className="space-y-3">
              {recentComments.length === 0 ? (
                <p className="text-sm text-gray-500 font-sans">No comments yet.</p>
              ) : (
                recentComments.map((comment: any) => (
                  <div key={comment.id} className="border-b border-border last:border-0 pb-3">
                    <p className="text-sm font-sans font-bold text-primary">{comment.name || 'Reader'}</p>
                    <p className="text-xs font-sans text-gray-600 line-clamp-2">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
        <div className="xl:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-primary">Recent Posts</h2>
            <Link to="/admin/posts" className="text-sm font-sans font-bold text-accent-blue hover:underline">Manage</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-gray-500 border-b border-border">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Views</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentPosts || []).map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 max-w-[280px] truncate">{post.title}</td>
                    <td className="py-2 pr-4">{post.category}</td>
                    <td className="py-2 pr-4">{post.views}</td>
                    <td className="py-2 pr-4 uppercase text-xs font-bold tracking-wider">{post.status}</td>
                    <td className="py-2">{formatDate(post.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-serif font-bold text-primary mb-4">Publishing Health</h2>
          <div className="flex items-center justify-center">
            <div className="relative h-[220px] w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="72%"
                  outerRadius="100%"
                  barSize={14}
                  data={publicationHealthData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background dataKey="value" cornerRadius={12} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-sans font-black text-primary">{publishedRate}%</span>
                <span className="text-xs font-sans uppercase tracking-widest text-gray-500">Published</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-sans uppercase tracking-wider text-gray-500">Published</p>
              <p className="text-lg font-bold text-emerald-600">{publishedRate}%</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-sans uppercase tracking-wider text-gray-500">Drafts</p>
              <p className="text-lg font-bold text-amber-600">{draftRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
