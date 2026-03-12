export interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  category_id: string;
  author_id: string;
  status: 'published' | 'draft';
  views: number;
  published_at: string | null;
  author?: {
    name: string;
    avatar_url: string | null;
    bio: string | null;
  };
  category?: Category;
  tags?: string[];
}

export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  name: string;
  content: string;
  approved: boolean;
  avatar_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  viewsData: { date: string; views: number }[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}
