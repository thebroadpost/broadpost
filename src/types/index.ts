export interface Post {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  cover_image_alt?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  open_graph_title?: string | null;
  open_graph_description?: string | null;
  social_share_image?: string | null;
  category_id?: string;
  author_id?: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  published_at?: string | null;
  scheduled_at?: string | null;
  updated_at?: string | null;
  author_name?: string;
  author_bio?: string | null;
  author_avatar?: string | null;
  author?: {
    name: string;
    avatar_url: string | null;
    bio: string | null;
  };
  category?: Category;
  tags?: string[];
  // Post settings / visibility
  visibility?: 'public' | 'private' | 'password_protected';
  post_password?: string | null;
  allow_comments?: boolean;
  is_featured?: boolean;
  is_pinned?: boolean;
  show_in_homepage?: boolean;
  show_in_newsletter?: boolean;
  // Analytics / content enrichment
  custom_excerpt?: string | null;
  reading_time_override?: number | null;
  cta_block?: string | null;
  reference_links?: string[];
  internal_link_suggestions?: string[];
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

export interface PostAnalytics {
  postId: string;
  postTitle: string;
  postSlug: string;
  totalViews: number;
  publishedAt: string | null;
  viewsData: { date: string; views: number }[];
  countriesData: {
    country: string;
    views: number;
  }[];
  sourcesData: {
    source: string;
    views: number;
  }[];
  recentVisits: {
    timestamp: string;
    country: string;
    source: string;
  }[];
}

export type AnalyticsWindow = '24h' | '7d' | '1m' | '3m';

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  totalViews: number;
  todayViews: number;
  viewsData: { date: string; views: number }[];
  topCountries: {
    country: string;
    views: number;
  }[];
  topSources: {
    source: string;
    views: number;
  }[];
  topPostsByCountry: {
    country: string;
    posts: {
      postId: string;
      title: string;
      slug: string;
      views: number;
    }[];
  }[];
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    category: string;
    views: number;
    status: string;
    created_at: string;
  }[];
  topCategories: {
    slug: string;
    name: string;
    count: number;
  }[];
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
