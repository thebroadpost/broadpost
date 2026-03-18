import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Twitter, Linkedin, Link as LinkIcon, Facebook, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdownIt from 'markdown-it';
import { getPostBySlug, getPostsByCategory, getComments, addComment, incrementViews } from '../../lib/api';
import { formatDate, calculateReadTime, getInitials } from '../../lib/utils';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { PostCard } from '../../components/blog/PostCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookmarkButton } from '../../components/blog/BookmarkButton';

export default function Post() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  
  // Create markdown instance
  const md = useMemo(() => new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  }), []);

  // Fetch Post
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const data = await getPostBySlug(slug!);
      if (data) incrementViews(data.id); // fire and forget
      return data;
    },
    enabled: !!slug
  });

  // Fetch Related
  const { data: relatedPosts } = useQuery({
    queryKey: ['relatedPosts', post?.category?.slug],
    queryFn: () => getPostsByCategory(post?.category?.slug as string),
    enabled: !!post?.category?.slug
  });

  // Fetch Comments
  const { data: comments } = useQuery({
    queryKey: ['comments', post?.id],
    queryFn: () => getComments(post?.id as string),
    enabled: !!post?.id
  });

  // Add Comment Mutation
  const commentMutation = useMutation({
    mutationFn: (data: { post_id: string, name: string, content: string }) => addComment(data),
    onSuccess: () => {
      toast.success('Comment submitted successfully!');
      setCommentText('');
      setCommentName('');
      queryClient.invalidateQueries({ queryKey: ['comments', post?.id] });
    },
    onError: () => {
      toast.error('Failed to submit comment. Try again.');
    }
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!commentName.trim() || !commentText.trim()) return;
     commentMutation.mutate({
       post_id: post!.id,
       name: commentName,
       content: commentText
     });
  };

  if (isLoading) {
    return (
      <div className="max-w-[780px] mx-auto px-4 py-16 animate-pulse">
         <Skeleton className="w-24 h-6 mb-8" />
         <Skeleton className="w-full h-16 mb-4" />
         <Skeleton className="w-3/4 h-16 mb-12" />
         <Skeleton className="w-full h-[400px] mb-12" />
         <div className="space-y-4">
           {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="w-full h-4" />)}
         </div>
      </div>
    );
  }

  if (!post) {
    return <div className="py-32 text-center text-primary dark:text-gray-100 font-serif font-bold text-3xl">Article not found.</div>;
  }

  const readTime = calculateReadTime(post.content);
  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const fallbackUrl = siteOrigin ? `${siteOrigin}/blog/${post.slug}` : '';
  const canonicalUrl = post.canonical_url || fallbackUrl;
  const seoTitle = post.seo_title || post.title;
  const pageTitle = seoTitle.includes('BROADPOST') ? seoTitle : `${seoTitle} | BROADPOST`;
  const metaDescription = post.meta_description || post.excerpt || 'Read this article on BROADPOST.';
  const openGraphTitle = post.open_graph_title || seoTitle;
  const openGraphDescription = post.open_graph_description || metaDescription;
  const socialShareImage = post.social_share_image || post.cover_image;
  const shareUrl = encodeURIComponent(canonicalUrl || (typeof window !== 'undefined' ? window.location.href : ''));
  const shareTitle = encodeURIComponent(openGraphTitle);

  return (
    <article className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {post.focus_keyword && <meta name="keywords" content={post.focus_keyword} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="BROADPOST" />
        <meta property="og:title" content={openGraphTitle} />
        <meta property="og:description" content={openGraphDescription} />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {socialShareImage && <meta property="og:image" content={socialShareImage} />}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}
        <meta name="twitter:card" content={socialShareImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={openGraphTitle} />
        <meta name="twitter:description" content={openGraphDescription} />
        {socialShareImage && <meta name="twitter:image" content={socialShareImage} />}
      </Helmet>

      {/* Header Area */}
      <header className="max-w-[780px] mx-auto px-4 pt-16 pb-8">
        <Link to={`/category/${post.category?.slug}`} className="block mb-6">
          <Badge variant="red" className="text-sm px-3 py-1">{post.category?.name || 'News'}</Badge>
        </Link>
        
        <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-primary mb-6">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="font-sans text-xl md:text-2xl text-gray-500 dark:text-gray-300 leading-snug mb-8">
            {post.excerpt}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-border dark:border-gray-800 py-4 mt-8 mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt={post.author.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg font-sans">
                  {getInitials(post.author?.name || 'Staff')}
                </div>
              )}
            </div>
            <div>
              <div className="font-sans font-bold text-primary flex items-center space-x-2">
                <span>By {post.author?.name || 'Staff'}</span>
                <span className="text-gray-400 dark:text-gray-500 font-normal text-xs uppercase tracking-widest hidden md:inline ml-2">Broadpost Staff</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-sans flex items-center mt-1">
                {formatDate(post.published_at || post.created_at)}
                <span className="mx-2">•</span>
                <Clock size={12} className="mr-1 inline" /> {readTime} min read
              </div>
            </div>
          </div>

           <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500">
             <BookmarkButton postId={post.id} className="p-2 border border-border dark:border-gray-700 rounded-full hover:border-primary transition-colors" size={16} />
             <a
               href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
               target="_blank"
               rel="noreferrer"
               aria-label="Share on X"
               className="p-2 border border-border dark:border-gray-700 rounded-full hover:text-primary hover:border-primary transition-colors"
             ><Twitter size={16} /></a>
             <a
               href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
               target="_blank"
               rel="noreferrer"
               aria-label="Share on LinkedIn"
               className="p-2 border border-border dark:border-gray-700 rounded-full hover:text-primary hover:border-primary transition-colors"
             ><Linkedin size={16} /></a>
             <a
               href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
               target="_blank"
               rel="noreferrer"
               aria-label="Share on Facebook"
               className="p-2 border border-border dark:border-gray-700 rounded-full hover:text-primary hover:border-primary transition-colors"
             ><Facebook size={16} /></a>
             <a
               href={`https://wa.me/?text=${encodeURIComponent(`${openGraphTitle} ${canonicalUrl || ''}`.trim())}`}
               target="_blank"
               rel="noreferrer"
               aria-label="Share on WhatsApp"
               className="p-2 border border-border dark:border-gray-700 rounded-full hover:text-primary hover:border-primary transition-colors"
             ><MessageCircle size={16} /></a>
             <button className="p-2 border border-border dark:border-gray-700 rounded-full hover:text-primary hover:border-primary transition-colors"
                onClick={() => {
                   navigator.clipboard.writeText(canonicalUrl || window.location.href);
                   toast.success("Link copied!");
                }}
             ><LinkIcon size={16} /></button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="max-w-[1000px] mx-auto px-4 mb-12">
          <figure>
            <img src={post.cover_image} alt={post.title} className="w-full h-auto object-cover max-h-[600px] bg-gray-100 dark:bg-gray-800" />
            <figcaption className="text-right text-xs text-gray-400 dark:text-gray-500 mt-2 font-sans italic">
              Image via Broadpost Media
            </figcaption>
          </figure>
        </div>
      )}

      {/* Body Content */}
      <div className="max-w-[780px] mx-auto px-4 pb-16">
         {/* Rendering the rich text from markdown content */}
         <div 
           className="prose prose-lg dark:prose-invert max-w-none
           prose-headings:font-serif prose-headings:font-bold prose-headings:text-primary dark:prose-headings:text-gray-100 prose-headings:mt-8 prose-headings:mb-4
           prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
           prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-8 prose-p:mb-6
           prose-a:text-accent-blue prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
           prose-strong:font-bold prose-strong:text-primary dark:prose-strong:text-gray-100
           prose-em:italic prose-em:text-gray-700 dark:prose-em:text-gray-300
           prose-blockquote:border-l-4 prose-blockquote:border-accent-red prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:pl-6 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6
           prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:mb-2
           prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
           prose-code:bg-gray-100 dark:prose-code:bg-gray-900 prose-code:text-accent-red prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
           prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:mb-6
           prose-img:rounded prose-img:my-8 prose-img:shadow-sm
           prose-hr:border-border dark:prose-hr:border-gray-800 prose-hr:my-8
           prose-table:w-full prose-table:border-collapse prose-table:my-6
           prose-th:bg-gray-50 dark:prose-th:bg-gray-900 prose-th:border prose-th:border-border dark:prose-th:border-gray-700 prose-th:p-3 prose-th:text-left
           prose-td:border prose-td:border-border dark:prose-td:border-gray-700 prose-td:p-3"
           dangerouslySetInnerHTML={{ __html: md.render(post.content) }} 
         />
         
         <div className="mt-16 flex flex-wrap gap-2">
            {post.tags && post.tags.map((tag: string) => (
              <span key={tag} className="px-4 py-2 border border-border dark:border-gray-700 rounded-full text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                 {tag}
              </span>
            ))}
         </div>
      </div>

        <hr className="max-w-[780px] mx-auto border-t border-border dark:border-gray-800 mb-16" />

      {/* Author Bio Box */}
        <div className="max-w-[780px] mx-auto px-4 mb-20 bg-gray-50 dark:bg-gray-900 border border-border dark:border-gray-800 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
           {post.author?.avatar_url ? (
             <img src={post.author.avatar_url} alt={post.author.name} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-3xl font-sans">
               {getInitials(post.author?.name || 'Staff')}
             </div>
           )}
         </div>
         <div>
            <h3 className="font-serif font-bold text-2xl text-primary mb-2">{post.author?.name || 'Staff Contributor'}</h3>
            <p className="font-sans text-gray-600 dark:text-gray-300 mb-4">{post.author?.bio || 'Journalist covering major stories for Broadpost.'}</p>
            <a href="#" className="font-sans text-accent-blue font-bold text-sm uppercase tracking-wider hover:underline">More by {post.author?.name || 'this author'}</a>
         </div>
      </div>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 1 && (
        <div className="bg-gray-50 dark:bg-gray-900 py-16 border-t border-border dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
            <h3 className="font-serif font-bold text-2xl text-primary mb-8 border-b-2 border-primary pb-2 inline-block">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {relatedPosts.filter((p: any) => p.id !== post.id).slice(0,3).map((relatedPost: any) => (
                  <PostCard key={relatedPost.id} post={relatedPost} variant="standard" />
               ))}
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="max-w-[780px] mx-auto px-4 py-20">
        <h3 className="font-serif font-bold text-3xl text-primary dark:text-gray-100 mb-10 pb-4 border-b border-border dark:border-gray-800">
           Comments ({comments?.length || 0})
         </h3>

        <form onSubmit={handleCommentSubmit} className="mb-16 bg-gray-50 dark:bg-gray-900 p-6 border border-border dark:border-gray-800">
            <h4 className="font-sans font-bold text-lg text-primary mb-4">Leave a comment</h4>
            <div className="space-y-4">
              <Input 
                placeholder="Name" 
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
                required
              />
              <textarea 
                placeholder="What are your thoughts?" 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full p-3 border border-border dark:border-gray-700 bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px] resize-y"
                required
              />
              <Button type="submit" disabled={commentMutation.isPending} className="font-bold tracking-widest uppercase">
                 {commentMutation.isPending ? 'Posting...' : 'Submit Comment'}
              </Button>
            </div>
         </form>

         <div className="space-y-8">
           {comments && comments.length > 0 ? (
             comments.map((comment: any) => (
               <div key={comment.id} className="flex space-x-4 border-b border-border dark:border-gray-800 pb-8 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {getInitials(comment.name)}
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-3 mb-2">
                       <span className="font-sans font-bold text-primary">{comment.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>
                      <p className="font-sans text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                       {comment.content}
                    </p>
                  </div>
               </div>
             ))
           ) : (
                 <p className="text-gray-500 dark:text-gray-400 font-sans italic text-center py-8">Be the first to comment on this article.</p>
           )}
         </div>
      </div>
    </article>
  );
}
