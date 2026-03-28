import React, { Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

// Lazy-load recharts so the heavy charting library only loads on the admin
// dashboard, and only when needed — not in the main bundle.
const BarChart = lazy(() => import('recharts').then(m => ({ default: m.BarChart })));
const Bar = lazy(() => import('recharts').then(m => ({ default: m.Bar })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const RadialBarChart = lazy(() => import('recharts').then(m => ({ default: m.RadialBarChart })));
const RadialBar = lazy(() => import('recharts').then(m => ({ default: m.RadialBar })));
import { FileText, Eye, MessageSquare, CheckCircle, Activity, TrendingUp, Globe, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, getPostPath } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

export default function Dashboard() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const { data: stats, isLoading, isError: statsError, error: statsErrorObj } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

  React.useEffect(() => {
    if (statsError) {
      toast.error((statsErrorObj as Error)?.message || 'Failed to load admin statistics');
    }
  }, [statsError, statsErrorObj]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-28 bg-white dark:bg-gray-900" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Skeleton className="xl:col-span-8 h-80 bg-white dark:bg-gray-900" />
          <Skeleton className="xl:col-span-4 h-80 bg-white dark:bg-gray-900" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <Skeleton className="xl:col-span-8 h-80 bg-white dark:bg-gray-900" />
          <Skeleton className="xl:col-span-4 h-80 bg-white dark:bg-gray-900" />
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-border dark:border-gray-800 p-8">
        <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-2">Dashboard unavailable</h2>
        <p className="text-sm font-sans text-gray-600 dark:text-gray-300 mb-4">
          We could not load your dashboard stats right now. Please refresh and try again.
        </p>
      </div>
    );
  }

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  const statCards = [
    { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, iconBg: 'bg-blue-50 text-blue-600' },
    { title: 'Published', value: stats?.publishedPosts || 0, icon: CheckCircle, iconBg: 'bg-emerald-50 text-emerald-600' },
    { title: 'Drafts', value: stats?.draftPosts || 0, icon: Activity, iconBg: 'bg-amber-50 text-amber-600' },
    { title: 'Comments', value: stats?.totalComments || 0, icon: MessageSquare, iconBg: 'bg-violet-50 text-violet-600' },
    { title: 'Total Views', value: stats?.totalViews || 0, icon: Eye, iconBg: 'bg-cyan-50 text-cyan-600' },
    { title: "Today's Views", value: stats?.todayViews || 0, icon: TrendingUp, iconBg: 'bg-sky-50 text-sky-600' },
  ];

  const totalPosts = stats?.totalPosts || 0;
  const publishedRate = totalPosts > 0 ? Math.round(((stats?.publishedPosts || 0) / totalPosts) * 100) : 0;
  const draftRate = 100 - publishedRate;

  const publicationHealthData = [
    { name: 'Published', value: publishedRate, fill: '#0284c7' },
  ];

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary dark:text-white">Dashboard</h1>
          <p className="text-sm font-sans text-gray-500 dark:text-gray-400 mt-1">Real-time publishing and audience insights from your live data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-border/70 dark:border-gray-800 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-sans font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-[32px] font-bold font-sans text-primary dark:text-white mt-1.5 leading-none">{compact.format(stat.value)}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-primary dark:text-white">Site Visitors</h2>
            <div className="inline-flex items-center gap-1 text-xs font-sans font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/15 px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              Last 7 Days
            </div>
          </div>
          <div className="h-[260px]">
            <Suspense fallback={<Skeleton className="w-full h-full" />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.viewsData || []} barGap={12}>
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
                  <Bar dataKey="views" fill={isDark ? '#60a5fa' : '#2563eb'} radius={[6, 6, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
            <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Top Countries</h2>
            <div className="space-y-3">
              {(stats?.topCountries || []).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">Country data will appear after new tracked visits.</p>
              ) : (
                (stats?.topCountries || []).slice(0, 5).map((item) => (
                <div key={item.country} className="flex items-center justify-between border-b border-border dark:border-gray-800 last:border-0 pb-2">
                  <span className="font-sans font-medium text-primary dark:text-white inline-flex items-center gap-2"><Globe size={14} className="text-blue-500 dark:text-blue-300" />{item.country}</span>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{compact.format(item.views)}</span>
                </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
            <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Top Traffic Sources</h2>
            <div className="space-y-3">
              {(stats?.topSources || []).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">Source data will appear after new tracked visits.</p>
              ) : (
                (stats?.topSources || []).slice(0, 5).map((sourceItem) => (
                  <div key={sourceItem.source} className="border-b border-border dark:border-gray-800 last:border-0 pb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-sans font-medium text-primary dark:text-white truncate inline-flex items-center gap-2"><Compass size={14} className="text-cyan-600 dark:text-cyan-300" />{sourceItem.source}</p>
                    <p className="text-xs font-sans text-gray-600 dark:text-gray-300 font-bold">{compact.format(sourceItem.views)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-primary dark:text-white">Top Blogs By Country</h2>
          <span className="text-xs font-sans uppercase tracking-widest text-gray-500 dark:text-gray-400">Last tracked traffic</span>
        </div>
        {(stats?.topPostsByCountry || []).length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">No country-level post traffic yet. Once new visits arrive, this section will populate automatically.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {(stats?.topPostsByCountry || []).map((countryBlock) => (
              <div key={countryBlock.country} className="rounded-lg border border-border dark:border-gray-800 p-4">
                <h3 className="text-sm font-sans font-bold uppercase tracking-wide text-primary dark:text-white mb-3">{countryBlock.country}</h3>
                <div className="space-y-2">
                  {countryBlock.posts.map((postItem) => (
                    <Link key={postItem.postId} to={getPostPath(postItem.slug)} className="flex items-center justify-between gap-3 text-sm text-gray-700 dark:text-gray-200 hover:text-accent-blue transition-colors">
                      <span className="truncate font-medium">{postItem.title}</span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{compact.format(postItem.views)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8">
        <div className="xl:col-span-8 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-bold text-primary dark:text-white">Recent Posts</h2>
            <Link to="/admin/posts" className="text-sm font-sans font-bold text-accent-blue hover:underline">Manage</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-border dark:border-gray-800">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Views</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentPosts || []).map((post) => (
                  <tr key={post.id} className="border-b border-border dark:border-gray-800 last:border-0 text-gray-700 dark:text-gray-300">
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

        <div className="xl:col-span-4 bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-border/70 dark:border-gray-800">
          <h2 className="text-xl font-serif font-bold text-primary dark:text-white mb-4">Publishing Health</h2>
          <div className="flex items-center justify-center">
            <div className="relative h-[220px] w-[220px]">
              <Suspense fallback={<Skeleton className="w-full h-full rounded-full" />}>
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
              </Suspense>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-sans font-black text-primary dark:text-white">{publishedRate}%</span>
                <span className="text-xs font-sans uppercase tracking-widest text-gray-500 dark:text-gray-400">Published</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-lg border border-border dark:border-gray-800 p-3">
              <p className="text-xs font-sans uppercase tracking-wider text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-lg font-bold text-emerald-600">{publishedRate}%</p>
            </div>
            <div className="rounded-lg border border-border dark:border-gray-800 p-3">
              <p className="text-xs font-sans uppercase tracking-wider text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-lg font-bold text-amber-600">{draftRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
