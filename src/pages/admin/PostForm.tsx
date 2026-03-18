import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, updatePost, getCategories, createCategory, deletePost } from '../../lib/api';
import { formatDate, generateSlug } from '../../lib/utils';
import { CATEGORY_META } from '../../lib/categories';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { AlertTriangle, Calendar, CheckCircle2, Clock, Eye, Trash2 } from 'lucide-react';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

const PRESET_CATEGORIES = CATEGORY_META.map(({ name, slug }) => ({ name, slug }));

export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const draftKey = isEditing ? `broadpost_draft_${id}` : 'broadpost_draft_new';

  // We fetch by slug generally but here we have ID in URL, we need to adapt our API or just assume we fetch all and find it
  // For simplicity since getPostBySlug is available, let's fetch by ID if we can. 
  // Wait, I didn't write getPostById in API. I'll mock the fetch or adapt getPostBySlug. 
  // Actually, wait, the API has a gap for getPostById. Let's just create a generic supabase call here.
  const { data: postToEdit, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [coverImageAltText, setCoverImageAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(false);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [openGraphTitle, setOpenGraphTitle] = useState('');
  const [openGraphDescription, setOpenGraphDescription] = useState('');
  const [socialShareImage, setSocialShareImage] = useState('');
  // Post settings
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password_protected'>('public');
  const [postPassword, setPostPassword] = useState('');
  const [allowComments, setAllowComments] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showInHomepage, setShowInHomepage] = useState(true);
  const [showInNewsletter, setShowInNewsletter] = useState(true);
  // Schedule & editor view
  const [scheduledAt, setScheduledAt] = useState('');
  const [editorPreviewMode, setEditorPreviewMode] = useState<'edit' | 'live' | 'preview'>('live');
  // Analytics / content enrichment
  const [customExcerpt, setCustomExcerpt] = useState('');
  const [readingTimeOverride, setReadingTimeOverride] = useState<string>('');
  const [ctaBlock, setCtaBlock] = useState('');
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [referenceLinkInput, setReferenceLinkInput] = useState('');
  const [internalLinkSuggestions, setInternalLinkSuggestions] = useState<string[]>([]);
  const [internalLinkInput, setInternalLinkInput] = useState('');
  // Embed URL
  const [embedUrl, setEmbedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSnapshotRef = useRef<any>(null);
  const { actualTheme } = useTheme();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5 MB');
      return;
    }
    setIsUploading(true);
    try {
      const { supabase } = await import('../../lib/supabase');
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('post-images').getPublicUrl(fileName);
      setCoverImage(data.publicUrl);
      toast.success('Image uploaded');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setSlug(postToEdit.slug);
      setContent(postToEdit.content);
      setExcerpt(postToEdit.excerpt || '');
      setCoverImage(postToEdit.cover_image || '');
      setCategorySlug(generateSlug(postToEdit.category || ''));
      setStatus(postToEdit.status as 'draft' | 'published' | 'scheduled');
      setTags(postToEdit.tags || []);
      setAuthorName(postToEdit.author_name || '');
      setAuthorBio(postToEdit.author_bio || '');
      setAuthorAvatar(postToEdit.author_avatar || '');
      setCoverImageAltText(postToEdit.cover_image_alt || '');
      setSeoTitle(postToEdit.seo_title || '');
      setMetaDescription(postToEdit.meta_description || '');
      setFocusKeyword(postToEdit.focus_keyword || '');
      setCanonicalUrl(postToEdit.canonical_url || '');
      setOpenGraphTitle(postToEdit.open_graph_title || '');
      setOpenGraphDescription(postToEdit.open_graph_description || '');
      setSocialShareImage(postToEdit.social_share_image || '');
      setVisibility((postToEdit.visibility as 'public' | 'private' | 'password_protected') || 'public');
      setPostPassword(postToEdit.post_password || '');
      setAllowComments(postToEdit.allow_comments ?? true);
      setIsFeatured(postToEdit.is_featured ?? false);
      setIsPinned(postToEdit.is_pinned ?? false);
      setShowInHomepage(postToEdit.show_in_homepage ?? true);
      setShowInNewsletter(postToEdit.show_in_newsletter ?? true);
      setScheduledAt(postToEdit.scheduled_at ? new Date(postToEdit.scheduled_at).toISOString().slice(0, 16) : '');
      setCustomExcerpt(postToEdit.custom_excerpt || '');
      setReadingTimeOverride(postToEdit.reading_time_override != null ? String(postToEdit.reading_time_override) : '');
      setCtaBlock(postToEdit.cta_block || '');
      setReferenceLinks(postToEdit.reference_links || []);
      setInternalLinkSuggestions(postToEdit.internal_link_suggestions || []);
      setEmbedUrl(''); // not persisted on post row
      savedSnapshotRef.current = postToEdit;
    }
  }, [postToEdit]);

  useEffect(() => {
    if (isEditing && !postToEdit) return;
    const draft = localStorage.getItem(draftKey);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      if (parsed?.title || parsed?.content) {
        setHasRecoverableDraft(true);
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey, isEditing, postToEdit]);

  const isDirty = useMemo(() => {
    const saved = savedSnapshotRef.current;
    if (!saved) {
      return Boolean(title.trim() || content.trim() || excerpt.trim() || coverImage.trim());
    }

    return (
      title !== (saved.title || '') ||
      slug !== (saved.slug || '') ||
      content !== (saved.content || '') ||
      excerpt !== (saved.excerpt || '') ||
      coverImage !== (saved.cover_image || '') ||
      categorySlug !== generateSlug(saved.category || '') ||
      status !== saved.status ||
      JSON.stringify(tags) !== JSON.stringify(saved.tags || []) ||
      authorName !== (saved.author_name || '') ||
      authorBio !== (saved.author_bio || '') ||
      authorAvatar !== (saved.author_avatar || '') ||
      coverImageAltText !== (saved.cover_image_alt || '') ||
      seoTitle !== (saved.seo_title || '') ||
      metaDescription !== (saved.meta_description || '') ||
      focusKeyword !== (saved.focus_keyword || '') ||
      canonicalUrl !== (saved.canonical_url || '') ||
      openGraphTitle !== (saved.open_graph_title || '') ||
      openGraphDescription !== (saved.open_graph_description || '') ||
      socialShareImage !== (saved.social_share_image || '') ||
      visibility !== (saved.visibility || 'public') ||
      postPassword !== (saved.post_password || '') ||
      allowComments !== (saved.allow_comments ?? true) ||
      isFeatured !== (saved.is_featured ?? false) ||
      isPinned !== (saved.is_pinned ?? false) ||
      showInHomepage !== (saved.show_in_homepage ?? true) ||
      showInNewsletter !== (saved.show_in_newsletter ?? true) ||
      customExcerpt !== (saved.custom_excerpt || '') ||
      ctaBlock !== (saved.cta_block || '') ||
      JSON.stringify(referenceLinks) !== JSON.stringify(saved.reference_links || []) ||
      JSON.stringify(internalLinkSuggestions) !== JSON.stringify(saved.internal_link_suggestions || [])
    );
  }, [title, slug, content, excerpt, coverImage, categorySlug, status, tags, authorName, authorBio, authorAvatar, coverImageAltText, seoTitle, metaDescription, focusKeyword, canonicalUrl, openGraphTitle, openGraphDescription, socialShareImage, visibility, postPassword, allowComments, isFeatured, isPinned, showInHomepage, showInNewsletter, customExcerpt, ctaBlock, referenceLinks, internalLinkSuggestions]);



  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!title && !content && !excerpt) return;

    setDraftStatus('saving');
    const timeoutId = window.setTimeout(() => {
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          coverImage,
          categorySlug,
          status,
          tags,
          authorName,
          authorBio,
          authorAvatar,
          coverImageAltText,
          seoTitle,
          metaDescription,
          focusKeyword,
          canonicalUrl,
          openGraphTitle,
          openGraphDescription,
          socialShareImage,
          visibility,
          postPassword,
          allowComments,
          isFeatured,
          isPinned,
          showInHomepage,
          showInNewsletter,
          scheduledAt,
          customExcerpt,
          readingTimeOverride,
          ctaBlock,
          referenceLinks,
          internalLinkSuggestions,
        })
      );
      setDraftStatus('saved');
      window.setTimeout(() => setDraftStatus('idle'), 2000);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [draftKey, title, slug, content, excerpt, coverImage, categorySlug, status, tags, authorName, authorBio, authorAvatar, coverImageAltText, seoTitle, metaDescription, focusKeyword, canonicalUrl, openGraphTitle, openGraphDescription, socialShareImage, visibility, postPassword, allowComments, isFeatured, isPinned, showInHomepage, showInNewsletter, scheduledAt, customExcerpt, readingTimeOverride, ctaBlock, referenceLinks, internalLinkSuggestions]);

  // Auto-generate slug
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing, slug]);

  // If categories load and none is selected yet, default to the first one.
  useEffect(() => {
    if (!categorySlug && categories && categories.length > 0) {
      setCategorySlug(categories[0].slug);
    }
  }, [categories, categorySlug]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => isEditing ? updatePost(id as string, data) : createPost(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Post updated' : 'Post created');
      localStorage.removeItem(draftKey);
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      navigate('/admin/posts');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to save post';
      toast.error(message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(id as string),
    onSuccess: () => {
      toast.success('Post deleted');
      localStorage.removeItem(draftKey);
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      navigate('/admin/posts');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to delete post';
      toast.error(message);
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: (createdCategory) => {
      toast.success('Category created');
      setCategorySlug(createdCategory.slug);
      setNewCategoryName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      toast.error(message);
    },
  });

  const handleSave = (isPublish: boolean = false) => {
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const effectiveCategorySlug = categorySlug || categories?.[0]?.slug || '';

    if (!normalizedTitle || !normalizedContent || !effectiveCategorySlug) {
      const missing: string[] = [];
      if (!normalizedTitle) missing.push('Title');
      if (!normalizedContent) missing.push('Content');
      if (!effectiveCategorySlug) missing.push('Category');
      toast.error(`${missing.join(', ')} are required`);
      return;
    }
    
    // Convert status
    let finalStatus = status;
    if (isPublish) {
      finalStatus = 'published';
    }

    saveMutation.mutate({
      title: normalizedTitle,
      slug,
      content: normalizedContent,
      excerpt,
      cover_image: coverImage,
      cover_image_alt: coverImageAltText,
      category: effectiveCategorySlug,
      status: finalStatus,
      tags,
      author_name: authorName,
      author_bio: authorBio,
      author_avatar: authorAvatar,
      seo_title: seoTitle,
      meta_description: metaDescription,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      open_graph_title: openGraphTitle,
      open_graph_description: openGraphDescription,
      social_share_image: socialShareImage,
      visibility,
      post_password: postPassword || null,
      allow_comments: allowComments,
      is_featured: isFeatured,
      is_pinned: isPinned,
      show_in_homepage: showInHomepage,
      show_in_newsletter: showInNewsletter,
      scheduled_at: scheduledAt || null,
      custom_excerpt: customExcerpt || null,
      reading_time_override: readingTimeOverride ? Number(readingTimeOverride) : null,
      cta_block: ctaBlock || null,
      reference_links: referenceLinks,
      internal_link_suggestions: internalLinkSuggestions,
    });
  };

  const buildPayload = (overrides: Record<string, unknown> = {}) => ({
    title: title.trim(),
    slug,
    content: content.trim(),
    excerpt,
    cover_image: coverImage,
    cover_image_alt: coverImageAltText,
    category: categorySlug || categories?.[0]?.slug || '',
    tags,
    author_name: authorName,
    author_bio: authorBio,
    author_avatar: authorAvatar,
    seo_title: seoTitle,
    meta_description: metaDescription,
    focus_keyword: focusKeyword,
    canonical_url: canonicalUrl,
    open_graph_title: openGraphTitle,
    open_graph_description: openGraphDescription,
    social_share_image: socialShareImage,
    visibility,
    post_password: postPassword || null,
    allow_comments: allowComments,
    is_featured: isFeatured,
    is_pinned: isPinned,
    show_in_homepage: showInHomepage,
    show_in_newsletter: showInNewsletter,
    scheduled_at: scheduledAt || null,
    custom_excerpt: customExcerpt || null,
    reading_time_override: readingTimeOverride ? Number(readingTimeOverride) : null,
    cta_block: ctaBlock || null,
    reference_links: referenceLinks,
    internal_link_suggestions: internalLinkSuggestions,
    ...overrides,
  });

  const handleUnpublish = () => {
    saveMutation.mutate(buildPayload({ status: 'draft', scheduled_at: null }));
  };

  const handleSchedule = () => {
    if (!scheduledAt) { toast.error('Select a schedule date first'); return; }
    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const effectiveCategorySlug = categorySlug || categories?.[0]?.slug || '';
    if (!normalizedTitle || !normalizedContent || !effectiveCategorySlug) {
      const missing: string[] = [];
      if (!normalizedTitle) missing.push('Title');
      if (!normalizedContent) missing.push('Content');
      if (!effectiveCategorySlug) missing.push('Category');
      toast.error(`${missing.join(', ')} are required`);
      return;
    }
    saveMutation.mutate(buildPayload({ status: 'scheduled', scheduled_at: scheduledAt }));
  };

  const handleRecoverDraft = () => {
    const draft = localStorage.getItem(draftKey);
    if (!draft) return;

    try {
      const parsed = JSON.parse(draft);
      setTitle(parsed.title || '');
      setSlug(parsed.slug || '');
      setContent(parsed.content || '');
      setExcerpt(parsed.excerpt || '');
      setCoverImage(parsed.coverImage || '');
      setCategorySlug(parsed.categorySlug || '');
      setStatus(parsed.status || 'draft');
      setTags(parsed.tags || []);
      setAuthorName(parsed.authorName || '');
      setAuthorBio(parsed.authorBio || '');
      setAuthorAvatar(parsed.authorAvatar || '');
      setCoverImageAltText(parsed.coverImageAltText || '');
      setSeoTitle(parsed.seoTitle || '');
      setMetaDescription(parsed.metaDescription || '');
      setFocusKeyword(parsed.focusKeyword || '');
      setCanonicalUrl(parsed.canonicalUrl || '');
      setOpenGraphTitle(parsed.openGraphTitle || '');
      setOpenGraphDescription(parsed.openGraphDescription || '');
      setSocialShareImage(parsed.socialShareImage || '');
      setVisibility(parsed.visibility || 'public');
      setPostPassword(parsed.postPassword || '');
      if (parsed.allowComments !== undefined) setAllowComments(parsed.allowComments);
      if (parsed.isFeatured !== undefined) setIsFeatured(parsed.isFeatured);
      if (parsed.isPinned !== undefined) setIsPinned(parsed.isPinned);
      if (parsed.showInHomepage !== undefined) setShowInHomepage(parsed.showInHomepage);
      if (parsed.showInNewsletter !== undefined) setShowInNewsletter(parsed.showInNewsletter);
      setScheduledAt(parsed.scheduledAt || '');
      setCustomExcerpt(parsed.customExcerpt || '');
      setReadingTimeOverride(parsed.readingTimeOverride || '');
      setCtaBlock(parsed.ctaBlock || '');
      setReferenceLinks(parsed.referenceLinks || []);
      setInternalLinkSuggestions(parsed.internalLinkSuggestions || []);
      setHasRecoverableDraft(false);
      toast.success('Draft recovered');
    } catch {
      toast.error('Unable to recover draft');
      localStorage.removeItem(draftKey);
      setHasRecoverableDraft(false);
    }
  };

  const hotkeySaveRef = useRef(handleSave);
  hotkeySaveRef.current = handleSave;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod || saveMutation.isPending) return;

      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        hotkeySaveRef.current(false);
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        hotkeySaveRef.current(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [saveMutation.isPending]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('Enter a category name first');
      return;
    }

    createCategoryMutation.mutate(name);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isEditing && isLoading) return <div className="p-8 text-gray-700 dark:text-gray-300">Loading post...</div>;

  const editorFallback = <Skeleton className="w-full h-[500px]" />;

  return (
    <>
    {hasRecoverableDraft && (
      <div className="mb-4 rounded-lg border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm font-sans text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
        <span>A recoverable local draft was found.</span>
        <div className="flex items-center gap-3">
          <button type="button" className="font-bold underline" onClick={handleRecoverDraft}>Restore</button>
          <button type="button" onClick={() => { localStorage.removeItem(draftKey); setHasRecoverableDraft(false); }}>Dismiss</button>
        </div>
      </div>
    )}
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column - Main Content (65%) */}
      <div className="flex-1 lg:w-[65%] space-y-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-6">
          <Input 
             id="post-title"
             label="Post Title"
             placeholder="Post Title" 
             value={title} 
             onChange={e => setTitle(e.target.value)}
             className="text-4xl font-serif font-bold text-primary border-none p-0 focus:ring-0 placeholder-gray-300 h-auto"
          />
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-sans">
             <label htmlFor="post-slug" className="bg-gray-100 dark:bg-gray-800 px-2 min-w-16 py-1 rounded-l border border-border dark:border-gray-700 border-r-0">/blog/</label>
             <input 
               id="post-slug"
               type="text" 
               value={slug} 
               onChange={e => setSlug(e.target.value)}
               className="flex-1 bg-white dark:bg-gray-900 text-primary dark:text-gray-100 px-2 py-1 rounded-r border border-border dark:border-gray-700 focus:outline-none focus:border-primary"
               placeholder="auto-generated-slug"
               aria-label="Post slug"
             />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">
            Tip: use Markdown image syntax with alt text, for example: <span className="font-mono">![A descriptive image](https://...)</span>
          </p>

          {/* Write / Split / Preview tabs */}
          <div className="flex border-b border-border dark:border-gray-800 -mb-px">
            {(['edit', 'live', 'preview'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setEditorPreviewMode(mode)}
                className={`px-4 py-2 text-sm font-sans transition-colors border-b-2 ${
                  editorPreviewMode === mode
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {mode === 'edit' ? 'Write' : mode === 'live' ? 'Split' : 'Preview'}
              </button>
            ))}
          </div>

          <div data-color-mode={actualTheme}>
            <Suspense fallback={editorFallback}>
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={500}
                preview={editorPreviewMode}
                className="font-sans border-border shadow-none"
              />
            </Suspense>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 font-sans">
            <span>{wordCount.toLocaleString()} words</span>
            <span>~{readingTime} min read</span>
          </div>

          <div className="space-y-2">
            <label htmlFor="post-excerpt" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Excerpt</label>
            <textarea
              id="post-excerpt"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-24 focus:outline-none focus:border-primary"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Brief summary of the article..."
            />
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar (35%) */}
      <div className="w-full lg:w-[35%] space-y-6">
        {/* Publish Panel */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">Publishing</h3>
          <div className="text-xs font-sans flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Autosave</span>
            {draftStatus === 'saving' && <span className="text-amber-600 flex items-center gap-1"><Clock size={12} />Saving...</span>}
            {draftStatus === 'saved' && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} />Saved</span>}
            {draftStatus === 'idle' && isDirty && <span className="text-amber-600">Unsaved changes</span>}
            {draftStatus === 'idle' && !isDirty && <span className="text-gray-400 dark:text-gray-500">Up to date</span>}
          </div>
          <div className="flex justify-between items-center text-sm font-sans">
            <span className="text-gray-600 dark:text-gray-300">Status:</span>
            <span className={`font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded-full ${
              status === 'published' ? 'bg-green-100 text-green-700'
              : status === 'scheduled' ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
            }`}>{status}</span>
          </div>
          {isEditing && (postToEdit?.published_at || postToEdit?.updated_at) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-sans space-y-1 border-t border-border dark:border-gray-800 pt-3">
              {postToEdit?.published_at && (
                <div className="flex justify-between">
                  <span>Published:</span>
                  <span>{formatDate(postToEdit.published_at)}</span>
                </div>
              )}
              {postToEdit?.updated_at && (
                <div className="flex justify-between">
                  <span>Last updated:</span>
                  <span>{formatDate(postToEdit.updated_at)}</span>
                </div>
              )}
            </div>
          )}
          <div className="space-y-1.5 border-t border-border dark:border-gray-800 pt-3">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans flex items-center gap-1.5">
              <Calendar size={12} /> Schedule Publish Date
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-3 py-1.5 border border-border dark:border-gray-700 rounded text-sm font-sans focus:outline-none focus:border-primary bg-white dark:bg-gray-900 text-primary dark:text-gray-100"
            />
            {scheduledAt && (
              <p className="text-xs text-blue-600 font-sans">Will be scheduled for this date/time.</p>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">Cmd/Ctrl+S to save · Cmd/Ctrl+Enter to publish.</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 text-sm" onClick={() => handleSave(false)} disabled={saveMutation.isPending}>
                Save Draft
              </Button>
              {isEditing && status === 'published' && (
                <Button variant="outline" className="flex-1 text-sm text-amber-700 border-amber-300 hover:bg-amber-50" onClick={handleUnpublish} disabled={saveMutation.isPending}>
                  Unpublish
                </Button>
              )}
            </div>
            {scheduledAt ? (
              <Button className="w-full" onClick={handleSchedule} disabled={saveMutation.isPending}>
                <Calendar size={14} className="mr-2" /> Schedule Post
              </Button>
            ) : (
              <Button className="w-full bg-accent-blue" onClick={() => setShowPublishConfirm(true)} disabled={saveMutation.isPending}>
                {isEditing && status === 'published' ? 'Update Post' : 'Publish Now'}
              </Button>
            )}
            {isEditing && slug && (
              <a
                href={`/blog/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-sans border border-border dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Eye size={14} /> Preview Post
              </a>
            )}
          </div>
          {isEditing && (
            <Button variant="danger" className="w-full" onClick={() => setShowDeleteConfirm(true)} disabled={deleteMutation.isPending}>
              <Trash2 size={14} className="mr-2" /> Delete Post
            </Button>
          )}
        </div>

        {/* Category & Tags */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-6">
          <div className="space-y-2">
            <label htmlFor="post-category" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Category</label>
            {/* Preset category chips */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {PRESET_CATEGORIES.map((preset) => {
                const existsInDb = categories?.some(c => c.slug === preset.slug);
                const isSelected = categorySlug === preset.slug;
                return (
                  <button
                    key={preset.slug}
                    type="button"
                    onClick={() => {
                      if (existsInDb) {
                        setCategorySlug(preset.slug);
                      } else {
                        createCategoryMutation.mutate(preset.name, {
                          onSuccess: () => setCategorySlug(preset.slug),
                        });
                      }
                    }}
                    className={`text-xs px-2 py-1 rounded border font-sans transition-colors ${
                      isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
            <select
              id="post-category"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans focus:outline-none focus:border-primary"
              value={categorySlug}
              onChange={e => setCategorySlug(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <div className="flex gap-2 pt-1">
              <Input
                aria-label="Create category"
                placeholder="Create category (e.g. Other)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCreateCategory}
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
            </div>
            {(!categories || categories.length === 0) && (
              <p className="text-xs text-amber-700 dark:text-amber-300 font-sans">
                No categories found. Create one above, then publish.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-sans rounded flex items-center text-gray-700 dark:text-gray-200">
                  {tag}
                  <button type="button" aria-label={`Remove tag ${tag}`} onClick={() => removeTag(tag)} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <Input 
               id="post-tags"
               label="Add Tag"
               placeholder="Add a tag and press Enter" 
               value={tagInput}
               onChange={e => setTagInput(e.target.value)}
               onKeyDown={addTag}
               className="text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border dark:border-gray-800">
            <label htmlFor="author-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Author Name</label>
            <Input
              id="author-name"
              placeholder="Author display name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="text-sm"
            />

            <label htmlFor="author-bio" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Author Bio</label>
            <textarea
              id="author-bio"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-20 focus:outline-none focus:border-primary"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              placeholder="Short bio..."
            />

            <label htmlFor="author-avatar" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Author Avatar URL</label>
            <Input
              id="author-avatar"
              placeholder="https://..."
              value={authorAvatar}
              onChange={(e) => setAuthorAvatar(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">Cover Image</h3>

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
          <div
            className="border-2 border-dashed border-border dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload cover image"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleImageUpload(file);
            }}
          >
            {isUploading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans animate-pulse">Uploading…</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 font-sans">Click or drag &amp; drop to upload</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-1">PNG, JPG, GIF, WebP - max 5 MB</p>
              </>
            )}
          </div>

          {/* OR paste URL */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border dark:bg-gray-700" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-sans">or paste URL</span>
            <div className="flex-1 h-px bg-border dark:bg-gray-700" />
          </div>
          <Input
             placeholder="Image URL (e.g. https://images.unsplash.com/...)"
             value={coverImage}
             onChange={e => setCoverImage(e.target.value)}
             className="text-sm"
          />
          <Input
             id="cover-image-alt"
             label="Cover Image Alt Text"
             placeholder="Describe the image for screen readers"
             value={coverImageAltText}
             onChange={e => setCoverImageAltText(e.target.value)}
             className="text-sm"
          />
          {coverImage && (
            <div className="aspect-video mt-2 bg-gray-100 dark:bg-gray-800 overflow-hidden border border-border dark:border-gray-700 rounded relative">
              <img src={coverImage} alt={coverImageAltText || 'Cover preview'} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-500 shadow text-xs font-bold"
                title="Remove image"
                aria-label="Remove cover image"
              >
                &times;
              </button>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">SEO</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="seo-title" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">SEO Title</label>
              <Input id="seo-title" placeholder="Page title for search engines" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="text-sm" />
              <p className="text-xs text-right font-sans" style={{ color: seoTitle.length > 60 ? '#ef4444' : '#9ca3af' }}>{seoTitle.length}/60</p>
            </div>
            <div className="space-y-1">
              <label htmlFor="meta-desc" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Meta Description</label>
              <textarea id="meta-desc" className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-16 text-sm focus:outline-none focus:border-primary" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Brief description for search engines..." />
              <p className="text-xs text-right font-sans" style={{ color: metaDescription.length > 160 ? '#ef4444' : '#9ca3af' }}>{metaDescription.length}/160</p>
            </div>
            <div className="space-y-1">
              <label htmlFor="focus-kw" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Focus Keyword</label>
              <Input id="focus-kw" placeholder="Main keyword to target" value={focusKeyword} onChange={e => setFocusKeyword(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1">
              <label htmlFor="canonical-url" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Canonical URL</label>
              <Input id="canonical-url" placeholder="https://..." value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="border-t border-border dark:border-gray-800 pt-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 font-sans">Open Graph / Social Preview</h4>
            <div className="space-y-1">
              <label htmlFor="og-title" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">OG Title</label>
              <Input id="og-title" placeholder="Title shown on social shares" value={openGraphTitle} onChange={e => setOpenGraphTitle(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1">
              <label htmlFor="og-desc" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">OG Description</label>
              <textarea id="og-desc" className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-16 text-sm focus:outline-none focus:border-primary" value={openGraphDescription} onChange={e => setOpenGraphDescription(e.target.value)} placeholder="Description for WhatsApp, Twitter, LinkedIn..." />
            </div>
            <div className="space-y-1">
              <label htmlFor="social-img" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Social Share Image URL</label>
              <Input id="social-img" placeholder="https:// (1200×630 px recommended)" value={socialShareImage} onChange={e => setSocialShareImage(e.target.value)} className="text-sm" />
              {socialShareImage && (
                <img src={socialShareImage} alt="Social share preview" className="w-full aspect-[1200/630] object-cover rounded border border-border dark:border-gray-700 mt-1" />
              )}
            </div>
          </div>
        </div>

        {/* Post Settings */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">Post Settings</h3>
          <div className="space-y-2">
            <label htmlFor="post-visibility" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Visibility</label>
            <select
              id="post-visibility"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans text-sm focus:outline-none focus:border-primary"
              value={visibility}
              onChange={e => setVisibility(e.target.value as 'public' | 'private' | 'password_protected')}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="password_protected">Password Protected</option>
            </select>
            {visibility === 'password_protected' && (
              <Input
                placeholder="Post password"
                type="password"
                value={postPassword}
                onChange={e => setPostPassword(e.target.value)}
                className="text-sm"
              />
            )}
          </div>
          <div className="space-y-3 border-t border-border dark:border-gray-800 pt-3">
            {([
              { label: 'Allow Comments', value: allowComments, setter: setAllowComments },
              { label: 'Featured Post', value: isFeatured, setter: setIsFeatured },
              { label: 'Pinned Post', value: isPinned, setter: setIsPinned },
              { label: 'Show in Homepage', value: showInHomepage, setter: setShowInHomepage },
              { label: 'Show in Newsletter', value: showInNewsletter, setter: setShowInNewsletter },
            ] as { label: string; value: boolean; setter: (v: boolean) => void }[]).map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-sans">{label}</span>
                <button
                  type="button"
                  onClick={() => setter(!value)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={value}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      value ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Embed Media */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">Embed Media</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">Paste a YouTube, Twitter/X, or Instagram URL to embed it in the post.</p>
          <Input
            id="embed-url"
            label="Embed URL"
            placeholder="https://youtube.com/watch?v=... or https://twitter.com/..."
            value={embedUrl}
            onChange={e => setEmbedUrl(e.target.value)}
            className="text-sm"
          />
          {embedUrl && (() => {
            const isYouTube = /youtube\.com\/watch|youtu\.be\//.test(embedUrl);
            const isTwitter = /twitter\.com|x\.com/.test(embedUrl);
            if (isYouTube) {
              const ytId = embedUrl.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1];
              return ytId ? (
                <div className="aspect-video rounded overflow-hidden border border-border dark:border-gray-700">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="YouTube embed preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null;
            }
            if (isTwitter) {
              return (
                <p className="text-xs text-blue-600 dark:text-blue-300 font-sans bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded p-3">
                  Twitter/X embed detected. Copy the Markdown snippet below into your content:<br />
                  <span className="font-mono">{`<blockquote class="twitter-tweet"><a href="${embedUrl}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js"></script>`}</span>
                </p>
              );
            }
            return <p className="text-xs text-gray-500 dark:text-gray-400 font-sans">URL saved — use it in your content via Markdown image/link syntax.</p>;
          })()}
          <p className="text-xs text-gray-400 dark:text-gray-500 font-sans">Tip: in the editor, use <span className="font-mono">![alt](url)</span> for images or <span className="font-mono">[label](url)</span> for links. Open-in-new-tab: add <span className="font-mono">{"{{target=_blank}}"}</span> in your post or just paste the URL as plain text.</p>
        </div>

        {/* Analytics / Content Enrichment */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-sm border border-border dark:border-gray-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary dark:text-gray-100 border-b border-border dark:border-gray-800 pb-2">Analytics &amp; Enrichment</h3>

          <div className="space-y-1">
            <label htmlFor="custom-excerpt" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Custom Excerpt</label>
            <textarea
              id="custom-excerpt"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-20 text-sm focus:outline-none focus:border-primary"
              value={customExcerpt}
              onChange={e => setCustomExcerpt(e.target.value)}
              placeholder="Overrides auto-generated excerpt for analytics/feeds..."
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reading-time-override" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">
              Reading Time Override (minutes)
              <span className="ml-2 text-gray-400 dark:text-gray-500">— auto: ~{readingTime} min</span>
            </label>
            <Input
              id="reading-time-override"
              type="number"
              min={1}
              placeholder={String(readingTime)}
              value={readingTimeOverride}
              onChange={e => setReadingTimeOverride(e.target.value)}
              className="text-sm w-28"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cta-block" className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Custom CTA Block</label>
            <textarea
              id="cta-block"
              className="w-full px-3 py-2 border border-border dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-primary dark:text-gray-100 font-sans h-20 text-sm focus:outline-none focus:border-primary"
              value={ctaBlock}
              onChange={e => setCtaBlock(e.target.value)}
              placeholder="Call-to-action text shown at the end of the post..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Source / Reference Links</label>
            <div className="flex flex-wrap gap-1.5">
              {referenceLinks.map((link, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-sans rounded max-w-full">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:underline max-w-[180px]">{link}</a>
                  <button type="button" aria-label={`Remove reference link ${link}`} onClick={() => setReferenceLinks(referenceLinks.filter((_, j) => j !== i))} className="text-gray-400 dark:text-gray-500 hover:text-red-500 flex-shrink-0">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://source.example.com"
                value={referenceLinkInput}
                onChange={e => setReferenceLinkInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && referenceLinkInput.trim()) {
                    e.preventDefault();
                    if (!referenceLinks.includes(referenceLinkInput.trim())) {
                      setReferenceLinks([...referenceLinks, referenceLinkInput.trim()]);
                    }
                    setReferenceLinkInput('');
                  }
                }}
                className="text-sm flex-1"
                aria-label="Add reference link"
              />
              <Button type="button" variant="outline" onClick={() => {
                if (referenceLinkInput.trim() && !referenceLinks.includes(referenceLinkInput.trim())) {
                  setReferenceLinks([...referenceLinks, referenceLinkInput.trim()]);
                  setReferenceLinkInput('');
                }
              }}>Add</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300 font-sans">Internal Link Suggestions</label>
            <div className="flex flex-wrap gap-1.5">
              {internalLinkSuggestions.map((link, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs font-sans rounded max-w-full">
                  <span className="truncate max-w-[180px] text-gray-700 dark:text-gray-200">{link}</span>
                  <button type="button" aria-label={`Remove internal link ${link}`} onClick={() => setInternalLinkSuggestions(internalLinkSuggestions.filter((_, j) => j !== i))} className="text-gray-400 dark:text-gray-500 hover:text-red-500 flex-shrink-0">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="/blog/related-post-slug"
                value={internalLinkInput}
                onChange={e => setInternalLinkInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && internalLinkInput.trim()) {
                    e.preventDefault();
                    if (!internalLinkSuggestions.includes(internalLinkInput.trim())) {
                      setInternalLinkSuggestions([...internalLinkSuggestions, internalLinkInput.trim()]);
                    }
                    setInternalLinkInput('');
                  }
                }}
                className="text-sm flex-1"
                aria-label="Add internal link suggestion"
              />
              <Button type="button" variant="outline" onClick={() => {
                if (internalLinkInput.trim() && !internalLinkSuggestions.includes(internalLinkInput.trim())) {
                  setInternalLinkSuggestions([...internalLinkSuggestions, internalLinkInput.trim()]);
                  setInternalLinkInput('');
                }
              }}>Add</Button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <Modal isOpen={showPublishConfirm} onClose={() => setShowPublishConfirm(false)} title="Publish Post">
      <p className="text-sm font-sans text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to publish this post now?</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowPublishConfirm(false)}>Cancel</Button>
        <Button className="bg-accent-blue" onClick={() => { setShowPublishConfirm(false); handleSave(true); }} disabled={saveMutation.isPending}>Confirm Publish</Button>
      </div>
    </Modal>

    <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Post">
      <div className="flex items-start gap-2 mb-6 text-sm font-sans text-gray-700 dark:text-gray-300">
        <AlertTriangle size={16} className="text-red-500 mt-0.5" />
        <span>This action is permanent. Are you sure you want to delete this post?</span>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
        <Button variant="danger" onClick={() => { setShowDeleteConfirm(false); deleteMutation.mutate(); }} disabled={deleteMutation.isPending}>Delete</Button>
      </div>
    </Modal>

    </>
  );
}
