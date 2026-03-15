import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { checkIsBookmarked, toggleBookmark } from '../../lib/api';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
  postId: string;
  className?: string;
  size?: number;
}

export function BookmarkButton({ postId, className = '', size = 18 }: BookmarkButtonProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && postId) {
      checkIsBookmarked(postId, user.id).then(setIsBookmarked);
    } else {
      setIsBookmarked(false);
    }
  }, [user, postId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Navigation if inside a Link
    
    if (!user) {
      toast('Sign in to save articles', { icon: '🔒' });
      return;
    }

    setLoading(true);
    try {
      const { bookmarked } = await toggleBookmark(postId, user.id);
      setIsBookmarked(bookmarked);
      queryClient.invalidateQueries({ queryKey: ['bookmarks', user.id] });
      if (bookmarked) {
        toast.success('Saved to Reading List');
      } else {
        toast.success('Removed from Reading List');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`transition-colors ${isBookmarked ? 'text-accent-red' : 'text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-white'} ${className}`}
      title={isBookmarked ? "Remove bookmark" : "Save article"}
    >
      <BookmarkIcon 
         size={size} 
         strokeWidth={isBookmarked ? 3 : 2} 
         fill={isBookmarked ? 'currentColor' : 'none'} 
      />
    </button>
  );
}
