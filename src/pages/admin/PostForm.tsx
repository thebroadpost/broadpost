import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { useForm as useRHForm } from 'react-hook-form'; // correct standard import alias below
import { useAdminPosts, useSavePost } from '../../hooks/useAdmin';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Post } from '../../types';

type PostFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string; // We'll handle split to array manually before save
  author_name: string;
  author_bio: string;
  status: 'draft' | 'published';
};

export function PostForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { data: posts, isLoading: postsLoading } = useAdminPosts();
  const { mutateAsync: savePost, isPending: isSaving } = useSavePost();
  
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // We use useRHForm exactly matching standard react-hook-form
  const { register, handleSubmit, control, reset, watch, setValue } = useRHForm<PostFormData>({
    defaultValues: {
      status: 'draft',
      content: '',
      author_name: 'Admin', // default placeholder
    }
  });

  const title = watch('title');

  useEffect(() => {
    if (isEditing && posts) {
      const post = posts.find(p => p.id === id);
      if (post) {
        reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || '',
          tags: post.tags?.join(', ') || '',
          author_name: post.author_name || '',
          author_bio: post.author_bio || '',
          status: post.status,
        });
        setCoverImage(post.cover_image);
      }
    }
  }, [isEditing, posts, reset, id]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  }, [title, isEditing, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `post-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setCoverImage(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Make sure bucket "blog-images" exists and is public.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      const payload: Partial<Post> = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category.toLowerCase(),
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        author_name: data.author_name,
        author_bio: data.author_bio,
        status: data.status,
        cover_image: coverImage,
      };

      if (isEditing) {
        payload.id = id;
      }

      await savePost(payload);
      navigate('/admin/posts');
    } catch (error: any) {
      console.error(error);
      alert('Failed to save post: ' + error.message);
    }
  };

  if (isEditing && postsLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/posts')} className="px-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-black tracking-tighter text-black">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm space-y-6">
              <Input
                label="Post Title"
                placeholder="The amazing title..."
                {...register('title', { required: true })}
                className="text-lg font-bold"
              />
              <Input
                label="URL Slug"
                placeholder="the-amazing-title"
                {...register('slug', { required: true })}
              />
              <Textarea
                label="Excerpt"
                placeholder="A brief summary of the post..."
                {...register('excerpt')}
              />

              <div data-color-mode="light" className="pt-2">
                <label className="text-sm font-medium text-gray-700 block mb-2">Content (Markdown)</label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }: any) => (
                    <MDEditor
                      value={field.value}
                      onChange={field.onChange}
                      height={500}
                      previewOptions={{
                        className: 'prose-custom max-w-none'
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm space-y-6">
              <h3 className="font-bold border-b border-[#E6E6E6] pb-2 text-black">Publishing</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                  <select
                    {...register('status')}
                    className="flex h-10 w-full rounded-md border border-[#E6E6E6] bg-white px-3 py-2 text-sm text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" isLoading={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Post'}
                </Button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm space-y-6">
              <h3 className="font-bold border-b border-[#E6E6E6] pb-2 text-black">Meta Data</h3>
              
              <Input
                label="Category"
                placeholder="e.g. Technology"
                {...register('category')}
              />
              <Input
                label="Tags (comma separated)"
                placeholder="react, frontend, tutorial"
                {...register('tags')}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm space-y-6">
              <h3 className="font-bold border-b border-[#E6E6E6] pb-2 text-black">Cover Image</h3>
              
              {coverImage && (
                <div className="relative group rounded-md overflow-hidden border border-[#E6E6E6]">
                  <img src={coverImage} alt="Cover" className="w-full h-auto" />
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-xs font-bold py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {!coverImage && (
                <div className="border-2 border-dashed border-[#E6E6E6] rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cover-upload"
                    disabled={isUploading}
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm font-medium text-black">
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6E6E6] shadow-sm space-y-6">
              <h3 className="font-bold border-b border-[#E6E6E6] pb-2 text-black">Author Info</h3>
              <Input
                label="Author Name"
                {...register('author_name')}
              />
              <Textarea
                label="Author Bio"
                {...register('author_bio')}
              />
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
