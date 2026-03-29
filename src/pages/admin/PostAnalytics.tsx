import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Globe, Link2, TrendingUp } from 'lucide-react';
import { getPostAnalytics } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';

const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const LineChart = lazy(() => import('recharts').then(m => ({ default: m.LineChart })));
const Line = lazy(() => import('recharts').then(m => ({ default: m.Line })));

export default function PostAnalytics() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const { data: analytics, isLoading, isError, error } = useQuery({
    queryKey: ['postAnalytics', postId],
    queryFn: () => (postId ? getPostAnalytics(postId) : Promise.reject('No post ID')),
    enabled: !!postId,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error((error as Error)?.message || 'Failed to load analytics');
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-80" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-8">
        <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-2">Analytics unavailable</h2>
        <p className="text-sm font-sans text-gray-600 dark:text-gray-300 mb-4">
          Could not load analytics for this post.
        </p>
        <Button onClick={() => navigate('/admin/posts')} className="font-bold">
          Back to Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/posts')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-primary dark:text-white">
            {analytics.postTitle}
          </h1>
          <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mt-1">
            Analytics for the last 30 days
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Total Views
              </p>
              <p className="text-4xl font-bold font-sans text-primary dark:text-white mt-2">
                {analytics.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Countries
              </p>
              <p className="text-4xl font-bold font-sans text-primary dark:text-white mt-2">
                {analytics.countriesData.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-300">
              <Globe size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Traffic Sources
              </p>
              <p className="text-4xl font-bold font-sans text-primary dark:text-white mt-2">
                {analytics.sourcesData.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300">
              <Link2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Views Trend */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
        <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Views Over Time</h2>
        <div className="h-64">
          <Suspense fallback={<Skeleton className="w-full h-full" />}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.viewsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1f2937' : '#f1f5f9'} />
                <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: isDark ? '#111827' : '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '10px',
                    border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                    fontFamily: 'ui-sans-serif',
                    backgroundColor: isDark ? '#0b1220' : '#ffffff',
                    color: isDark ? '#e5e7eb' : '#111827',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke={isDark ? '#60a5fa' : '#2563eb'}
                  strokeWidth={2}
                  dot={{ fill: isDark ? '#60a5fa' : '#2563eb', r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Suspense>
        </div>
      </div>

      {/* Country & Source Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Countries */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Top Countries</h2>
          {analytics.countriesData.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data yet</p>
          ) : (
            <div className="h-80">
              <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.countriesData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1f2937' : '#f1f5f9'} />
                    <XAxis type="number" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="country" type="category" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} width={95} />
                    <Tooltip
                      cursor={{ fill: isDark ? '#111827' : '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '10px',
                        border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                        fontFamily: 'ui-sans-serif',
                        backgroundColor: isDark ? '#0b1220' : '#ffffff',
                        color: isDark ? '#e5e7eb' : '#111827',
                      }}
                    />
                    <Bar dataKey="views" fill={isDark ? '#34d399' : '#10b981'} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Top Traffic Sources</h2>
          {analytics.sourcesData.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No data yet</p>
          ) : (
            <div className="h-80">
              <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.sourcesData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1f2937' : '#f1f5f9'} />
                    <XAxis type="number" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="source" type="category" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={10} tickLine={false} axisLine={false} width={115} />
                    <Tooltip
                      cursor={{ fill: isDark ? '#111827' : '#f8fafc' }}
                      contentStyle={{
                        borderRadius: '10px',
                        border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                        fontFamily: 'ui-sans-serif',
                        backgroundColor: isDark ? '#0b1220' : '#ffffff',
                        color: isDark ? '#e5e7eb' : '#111827',
                      }}
                    />
                    <Bar dataKey="views" fill={isDark ? '#f472b6' : '#ec4899'} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Recent Visits */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
        <div className="p-6 border-b border-border dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold text-primary dark:text-white">Recent Visits (Last 50)</h2>
        </div>
        {analytics.recentVisits.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">No visits yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-sans font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-gray-800">
                {analytics.recentVisits.map((visit, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-sans text-gray-700 dark:text-gray-300">
                      {visit.timestamp}
                    </td>
                    <td className="px-6 py-3 text-sm font-sans text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center gap-2">
                        <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                        {visit.country}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-sans text-gray-700 dark:text-gray-300">
                      <span className="inline-flex items-center gap-2">
                        <Link2 size={14} className="text-purple-600 dark:text-purple-400" />
                        {visit.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
