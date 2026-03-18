import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllComments, approveComment, deleteComment } from '../../lib/api';
import { Check, X, Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function Comments() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['adminComments', filter],
    queryFn: () => getAllComments(filter === 'all' ? undefined : { approved: filter === 'approved' }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string, approved: boolean }) => approveComment(id, approved),
    onSuccess: () => {
      toast.success('Comment status updated');
      queryClient.invalidateQueries({ queryKey: ['adminComments'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['adminComments'] });
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-primary dark:text-gray-100 mb-8">Comments</h1>

      <div className="bg-white dark:bg-gray-900 rounded shadow-sm border border-border dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-border dark:border-gray-800 flex space-x-2 bg-gray-50 dark:bg-gray-900/60">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setFilter('all')}
          >All</Button>
          <Button 
             variant={filter === 'pending' ? 'primary' : 'outline'} 
             size="sm" 
             onClick={() => setFilter('pending')}
          >Pending</Button>
          <Button 
             variant={filter === 'approved' ? 'primary' : 'outline'} 
             size="sm" 
             onClick={() => setFilter('approved')}
          >Approved</Button>
        </div>

        <div className="overflow-x-auto">
           <table className="min-w-full divide-y divide-border dark:divide-gray-800">
             <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Author</th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Comment</th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">On Post</th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Status</th>
               <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-border dark:divide-gray-800">
               {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
               ) : comments?.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No comments found.</td></tr>
               ) : comments?.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-primary dark:text-gray-100">{c.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(c.created_at)}</div>
                    </td>
                    <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200 line-clamp-2 w-64 md:w-auto">{c.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate w-40">{c.post?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Badge variant={c.approved ? 'green' : 'red' as any} className={c.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                         {c.approved ? 'Approved' : 'Pending'}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex items-center justify-end space-x-2">
                         {!c.approved && (
                           <button onClick={() => approveMutation.mutate({ id: c.id, approved: true })} className="p-1 rounded text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20" title="Approve">
                             <Check size={18} />
                           </button>
                         )}
                         {c.approved && (
                           <button onClick={() => approveMutation.mutate({ id: c.id, approved: false })} className="p-1 rounded text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20" title="Unapprove">
                             <X size={18} />
                           </button>
                         )}
                         <button onClick={() => { if(window.confirm('Delete comment?')) deleteMutation.mutate(c.id) }} className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
