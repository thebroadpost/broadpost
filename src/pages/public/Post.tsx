import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePost, useComments, useAddComment, useIncrementViews } from '../../hooks/usePost';
import { PostHeader } from '../../components/blog/PostHeader';
import { Button } from '../../components/ui/Button';
import { Textarea, Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatDate } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading: postLoading } = usePost(slug || '');
  const { data: comments, isLoading: commentsLoading } = useComments(post?.id || '');
  const { mutate: addComment, isPending: addingComment } = useAddComment();
  const { mutate: incrementViews } = useIncrementViews();

  useEffect(() => {
    if (slug && post) {
      incrementViews(slug);
    }
  }, [slug, post?.id]);

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} | BROADPOST`;
    }
  }, [post?.title]);

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const author_name = formData.get('name') as string;
    const content = formData.get('content') as string;

    if (!author_name || !content || !post?.id) return;

    addComment({ post_id: post.id, author_name, content });
    e.currentTarget.reset();
  };

  if (postLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-32 text-2xl font-bold">Post not found</div>;
  }

  return (
    <article className="pb-24">
      <PostHeader post={post} />
      
      {post.cover_image && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <img 
            src={post.cover_image} 
            alt={post.title} 
            className="w-full h-auto max-h-[600px] object-cover rounded-2xl"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Markdown Content */}
        <div className="prose-custom mb-16">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16 pt-8 border-t border-[#E6E6E6]">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio */}
        {post.author_bio && (
          <div className="bg-gray-50 p-8 rounded-2xl flex items-center mb-16">
            <img src={post.author_avatar || ''} alt="" className="w-20 h-20 rounded-full mr-6 object-cover" />
            <div>
              <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-1">Written by</p>
              <h3 className="text-2xl font-bold text-black mb-2">{post.author_name}</h3>
              <p className="text-gray-600">{post.author_bio}</p>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <section id="comments" className="mt-16 pt-16 border-t border-[#E6E6E6]">
          <h3 className="text-2xl font-bold mb-8 text-black">
            Responses ({comments?.length || 0})
          </h3>

          <form onSubmit={handleCommentSubmit} className="mb-12 bg-white p-6 rounded-xl border border-[#E6E6E6] shadow-sm">
            <h4 className="font-bold text-black mb-4">Leave a response</h4>
            <div className="space-y-4">
              <Input name="name" placeholder="Your Name" required />
              <Textarea name="content" placeholder="Share your thoughts..." required />
              <Button type="submit" isLoading={addingComment}>Publish</Button>
            </div>
          </form>

          <div className="space-y-8">
            {commentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : comments?.length === 0 ? (
              <p className="text-gray-500 italic">No responses yet. Be the first to share your thoughts!</p>
            ) : (
              comments?.map((comment) => (
                <div key={comment.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-3">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-black">{comment.author_name}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap pl-13">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
