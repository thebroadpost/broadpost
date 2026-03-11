// Supabase Database Type Definitions
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          cover_image: string | null
          category: string | null
          tags: string[] | null
          author_name: string | null
          author_bio: string | null
          author_avatar: string | null
          status: 'draft' | 'published'
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          author_name?: string | null
          author_bio?: string | null
          author_avatar?: string | null
          status?: 'draft' | 'published'
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          cover_image?: string | null
          category?: string | null
          tags?: string[] | null
          author_name?: string | null
          author_bio?: string | null
          author_avatar?: string | null
          status?: 'draft' | 'published'
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_name: string
          content: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_name: string
          content: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_name?: string
          content?: string
          approved?: boolean
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          post_count: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          post_count?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          post_count?: number
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
