import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, BarChart3 } from 'lucide-react';
import { getPosts, deletePost } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function Posts() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  // In a real implementation we would debounce search, here we simplify
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminPosts', page],
    queryFn: () => getPosts(undefined, { page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
    },
    onError: () => toast.error('Failed to delete post'),
  });

  const handleDeleteConfirm = () => {
    if (!postToDelete) return;
    deleteMutation.mutate(postToDelete.id, {
      onSuccess: () => setPostToDelete(null),
    });
  };

  const filteredPosts = data?.data?.filter((post) => {
    const haystack = [post.title, post.focus_keyword, post.seo_title]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-serif font-bold text-primary dark:text-gray-100">Posts</h1>
        <Link to="/admin/posts/new">
          <Button className="font-bold tracking-widest uppercase flex items-center shadow-sm">
            <Plus size={18} className="mr-2" /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-border dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-border dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/60">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 dark:text-gray-500" />
            </div>
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pb-2 pt-2 h-9 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">SEO</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Views</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-border dark:divide-gray-800">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">Loading...</td></tr>
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No posts found.</td></tr>
              ) : (
                filteredPosts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-16 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-sm mr-4">
                          {post.cover_image && <img src={post.cover_image} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="text-sm font-bold text-primary dark:text-gray-100 font-serif truncate max-w-[200px] lg:max-w-xs">{post.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-sans">
                      {post.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={post.status === 'published' ? 'primary' : 'outline'}
                        className={`text-[10px] ${
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={post.seo_title || post.meta_description || post.open_graph_title || post.social_share_image || post.canonical_url ? 'primary' : 'outline'}
                        className="text-[10px]"
                      >
                        {post.seo_title || post.meta_description || post.open_graph_title || post.social_share_image || post.canonical_url ? 'Ready' : 'Missing'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-sans">
                      <div>{formatDate(post.created_at)}</div>
                      {post.scheduled_at && post.status === 'scheduled' && (
                        <div className="text-xs text-blue-600 mt-0.5">⏰ {formatDate(post.scheduled_at)}</div>
                      )}
                      {post.published_at && post.status === 'published' && (
                        <div className="text-xs text-green-600 mt-0.5">Published {formatDate(post.published_at)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-sans flex items-center">
                      <Eye size={14} className="mr-1" /> {post.views || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <Link to={`/admin/posts/${post.id}/analytics`} className="text-accent-green hover:text-green-900 transition-colors" title="View Analytics">
                          <BarChart3 size={16} />
                        </Link>
                        <Link to={`/admin/posts/${post.id}/edit`} className="text-accent-blue hover:text-blue-900 transition-colors">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => setPostToDelete(post)}
                          disabled={deleteMutation.isPending}
                          className="text-accent-red hover:text-red-900 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-t border-border dark:border-gray-800 flex items-center justify-between sm:px-6">
           <div className="flex-1 flex justify-between sm:hidden">
             <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))}>Previous</Button>
             <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)}>Next</Button>
           </div>
           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
             <div>
               <p className="text-sm text-gray-700 dark:text-gray-300 font-sans">Showing page <span className="font-bold">{page}</span></p>
             </div>
             <div>
               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                 <button onClick={() => setPage(p => Math.max(1, p-1))} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Previous</button>
                 <button onClick={() => setPage(p => p+1)} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
               </nav>
             </div>
           </div>
        </div>

      </div>

      <Modal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        title="Delete Post"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 font-sans mb-6">
          Are you sure you want to delete <span className="font-semibold">{postToDelete?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPostToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
