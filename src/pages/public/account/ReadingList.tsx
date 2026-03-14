import { useQuery } from '@tanstack/react-query';
import { getBookmarks, toggleBookmark } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { PostCard } from '../../../components/blog/PostCard';
import { Skeleton } from '../../../components/ui/Skeleton';
import { BookmarkMinus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReadingList() {
  const { user } = useAuth();
  
  const { data: savedPosts, isLoading, refetch } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => getBookmarks(user!.id),
    enabled: !!user?.id
  });

  const handleRemove = async (postId: string) => {
    try {
      await toggleBookmark(postId, user!.id);
      toast.success('Removed from reading list');
      refetch();
    } catch {
      toast.error('Failed to remove bookmark.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <h2 className="font-serif font-bold text-2xl text-primary dark:text-white">
          Reading List
        </h2>
        <span className="font-sans text-sm text-gray-500">
          {savedPosts?.length || 0} Saved Articles
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : savedPosts && savedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {savedPosts.map((post: any) => (
            <div key={post.id} className="relative group">
              <PostCard post={post} variant="small" />
              <button 
                onClick={(e) => { e.preventDefault(); handleRemove(post.id); }}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-gray-500 hover:text-accent-red hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Remove from Reading List"
              >
                <BookmarkMinus size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
             <BookmarkMinus size={24} className="text-gray-400" />
           </div>
           <h3 className="font-serif font-bold text-xl text-primary mb-2">Your reading list is empty</h3>
           <p className="font-sans text-gray-500 max-w-sm">
             When you find an article you want to read later, click the bookmark icon to save it here.
           </p>
        </div>
      )}
    </div>
  );
}
