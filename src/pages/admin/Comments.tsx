import React from 'react';
import { useAllComments, useModerateComment } from '../../hooks/useAdmin';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import { Check, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Comments() {
  const { data: comments, isLoading } = useAllComments();
  const { mutate: moderateComment, isPending } = useModerateComment();

  const handleAction = (id: string, action: 'approve' | 'delete') => {
    moderateComment(
      { id, action },
      {
        onSuccess: () => {
          toast.success(`Comment ${action === 'approve' ? 'approved' : 'deleted'} successfully`);
        },
        onError: () => {
          toast.error(`Failed to ${action} comment`);
        }
      }
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-black">Comments</h1>
        <p className="text-gray-500 mt-1">Moderate reader responses across all posts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm overflow-hidden">
        <ul className="divide-y divide-[#E6E6E6]">
          {isLoading ? (
            <div className="p-8 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No comments have been posted yet.
            </div>
          ) : (
            comments?.map((comment) => (
              <li key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-black">{comment.author_name}</span>
                        <span className="text-sm text-gray-500">on</span>
                        <Link 
                          to={`/blog/${comment.posts?.slug || ''}#comments`}
                          target="_blank"
                          className="text-sm font-medium text-black hover:underline inline-flex items-center"
                        >
                          {comment.posts?.title}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{formatDate(comment.created_at)}</p>
                      <p className="text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {!comment.approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleAction(comment.id, 'approve')}
                        disabled={isPending}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleAction(comment.id, 'delete')}
                      disabled={isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
