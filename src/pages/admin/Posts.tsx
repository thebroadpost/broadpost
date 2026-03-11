import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminPosts, useDeletePost } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export function Posts() {
  const { data: posts, isLoading } = useAdminPosts();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-black">Posts</h1>
          <p className="text-gray-500 mt-1">Manage your blog content.</p>
        </div>
        <Link to="/admin/posts/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#E6E6E6] bg-gray-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search posts..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-gray-50">
                <th className="p-4 font-bold text-sm text-gray-900 w-2/3">Post</th>
                <th className="p-4 font-bold text-sm text-gray-900 w-1/6">Status</th>
                <th className="p-4 font-bold text-sm text-gray-900 w-1/6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-4">
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No posts found. Create your first post!
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {post.cover_image ? (
                          <img src={post.cover_image} alt="" className="w-16 h-12 object-cover rounded-md border border-[#E6E6E6]" />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-md border border-[#E6E6E6] flex items-center justify-center">
                            <span className="text-xs text-gray-400">No Img</span>
                          </div>
                        )}
                        <div>
                          <Link to={`/admin/posts/${post.id}/edit`} className="font-bold text-black hover:underline mb-1 line-clamp-1">
                            {post.title}
                          </Link>
                          <div className="flex items-center text-xs text-gray-500 gap-2">
                            {post.category && <span className="font-medium">{post.category.toUpperCase()}</span>}
                            <span>&middot;</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={post.status === 'published' ? 'success' : 'outline'}>
                        {post.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/posts/${post.id}/edit`}>
                          <Button variant="ghost" size="sm" className="px-2">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="px-2 hover:bg-red-50 hover:text-red-600 group"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this post?')) {
                              deletePost(post.id);
                            }
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
