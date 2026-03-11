import React from 'react';
import { useDashboardStats, useAdminPosts } from '../../hooks/useAdmin';
import { Skeleton } from '../../components/ui/Skeleton';
import { FileText, Eye, MessageSquare, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentPosts, isLoading: postsLoading } = useAdminPosts();

  const statCards = [
    { label: 'Total Posts', value: stats?.totalPosts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Views', value: stats?.totalViews, icon: Eye, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Comments', value: stats?.totalComments, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Drafts', value: stats?.draftPosts, icon: Edit3, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-black">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your publication's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[#E6E6E6] flex items-center shadow-sm">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-3xl font-black text-black mt-1">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts List */}
      <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E6E6E6] flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Recent Posts</h2>
          <Link to="/admin/posts" className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600">
            View All
          </Link>
        </div>
        <div className="divide-y divide-[#E6E6E6]">
          {postsLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : recentPosts?.slice(0, 5).map((post) => (
            <div key={post.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <Link to={`/admin/posts/${post.id}/edit`} className="font-bold text-black hover:underline block mb-1">
                  {post.title}
                </Link>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span>{formatDate(post.created_at)}</span>
                  <span>&middot;</span>
                  <span>{post.views} views</span>
                </div>
              </div>
              <div>
                <Badge variant={post.status === 'published' ? 'success' : 'outline'}>
                  {post.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
