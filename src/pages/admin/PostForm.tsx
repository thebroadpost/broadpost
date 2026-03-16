import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, updatePost, getCategories, createCategory } from '../../lib/api';
import { generateSlug } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const MDEditor = lazy(() => import('@uiw/react-md-editor'));

export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
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
      setStatus(postToEdit.status as 'draft' | 'published');
      setTags(postToEdit.tags || []);
      setAuthorName(postToEdit.author_name || '');
      setAuthorBio(postToEdit.author_bio || '');
      setAuthorAvatar(postToEdit.author_avatar || '');
    }
  }, [postToEdit]);

  // Auto-generate slug
  useEffect(() => {
    if (!isEditing && title && !slug) {
      setSlug(generateSlug(title));
    }
  }, [title, isEditing]);

  // If categories load and none is selected yet, default to the first one.
  useEffect(() => {
    if (!categorySlug && categories && categories.length > 0) {
      setCategorySlug(categories[0].slug);
    }
  }, [categories, categorySlug]);

  const saveMutation = useMutation({
    mutationFn: (data: any) => isEditing ? updatePost(id as string, data) : createPost(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Post updated' : 'Post created');
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      navigate('/admin/posts');
    },
    onError: (error: any) => toast.error(error.message || 'Failed to save post')
  });

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => createCategory({ name }),
    onSuccess: (createdCategory) => {
      toast.success('Category created');
      setCategorySlug(createdCategory.slug);
      setNewCategoryName('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category');
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
      category: effectiveCategorySlug,
      status: finalStatus,
      tags,
      author_name: authorName,
      author_bio: authorBio,
      author_avatar: authorAvatar,
    });
  };

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

  if (isEditing && isLoading) return <div className="p-8">Loading post...</div>;

  const editorFallback = <Skeleton className="w-full h-[500px]" />;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column - Main Content (65%) */}
      <div className="flex-1 lg:w-[65%] space-y-6">
        <div className="bg-white p-6 rounded shadow-sm border border-border space-y-6">
          <Input 
             placeholder="Post Title" 
             value={title} 
             onChange={e => setTitle(e.target.value)}
             className="text-4xl font-serif font-bold text-primary border-none p-0 focus:ring-0 placeholder-gray-300 h-auto"
          />
          <div className="flex items-center text-sm text-gray-500 font-sans">
             <span className="bg-gray-100 px-2 min-w-16 py-1 rounded-l border border-border border-r-0">/blog/</span>
             <input 
               type="text" 
               value={slug} 
               onChange={e => setSlug(e.target.value)}
               className="flex-1 bg-white px-2 py-1 rounded-r border border-border focus:outline-none focus:border-primary"
               placeholder="auto-generated-slug"
             />
          </div>

          <div data-color-mode="light">
            <Suspense fallback={editorFallback}>
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={500}
                className="font-sans border-border shadow-none"
              />
            </Suspense>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-sans">Excerpt</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded bg-white text-primary font-sans h-24 focus:outline-none focus:border-primary"
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
        <div className="bg-white p-6 rounded shadow-sm border border-border space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary border-b border-border pb-2">Publishing</h3>
          <div className="flex justify-between items-center text-sm font-sans mb-4">
            <span className="text-gray-600">Status:</span>
            <span className={`font-bold uppercase tracking-wider ${status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
              {status}
            </span>
          </div>
          <div className="flex space-x-3">
             <Button variant="outline" className="flex-1" onClick={() => handleSave(false)} disabled={saveMutation.isPending}>
               Save Draft
             </Button>
             <Button className="flex-1 bg-accent-blue" onClick={() => handleSave(true)} disabled={saveMutation.isPending}>
               Publish
             </Button>
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-white p-6 rounded shadow-sm border border-border space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-sans">Category</label>
            <select
              className="w-full px-3 py-2 border border-border rounded bg-white text-primary font-sans focus:outline-none focus:border-primary"
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
              <p className="text-xs text-amber-700 font-sans">
                No categories found. Create one above, then publish.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 font-sans">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-xs font-sans rounded flex items-center">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 text-gray-500 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <Input 
               placeholder="Add a tag and press Enter" 
               value={tagInput}
               onChange={e => setTagInput(e.target.value)}
               onKeyDown={addTag}
               className="text-sm text-gray-700"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <label className="text-sm font-medium text-gray-700 font-sans">Author Name</label>
            <Input
              placeholder="Author display name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="text-sm"
            />

            <label className="text-sm font-medium text-gray-700 font-sans">Author Bio</label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded bg-white text-primary font-sans h-20 focus:outline-none focus:border-primary"
              value={authorBio}
              onChange={(e) => setAuthorBio(e.target.value)}
              placeholder="Short bio..."
            />

            <label className="text-sm font-medium text-gray-700 font-sans">Author Avatar URL</label>
            <Input
              placeholder="https://..."
              value={authorAvatar}
              onChange={(e) => setAuthorAvatar(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white p-6 rounded shadow-sm border border-border space-y-4">
          <h3 className="font-serif font-bold text-lg text-primary border-b border-border pb-2">Cover Image</h3>

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
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleImageUpload(file);
            }}
          >
            {isUploading ? (
              <p className="text-sm text-gray-500 font-sans animate-pulse">Uploading…</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 font-sans">Click or drag &amp; drop to upload</p>
                <p className="text-xs text-gray-400 font-sans mt-1">PNG, JPG, GIF, WebP — max 5 MB</p>
              </>
            )}
          </div>

          {/* OR paste URL */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-400 font-sans">or paste URL</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Input
             placeholder="Image URL (e.g. https://images.unsplash.com/...)"
             value={coverImage}
             onChange={e => setCoverImage(e.target.value)}
             className="text-sm"
          />
          {coverImage && (
            <div className="aspect-video mt-2 bg-gray-100 overflow-hidden border border-border rounded relative">
              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 shadow text-xs font-bold"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
