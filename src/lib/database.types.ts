export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'editor' | 'operator';
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'editor' | 'operator';
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          organization_id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'editor' | 'operator';
          avatar_url?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          date: string;
          status: 'draft' | 'ready' | 'live' | 'archived';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          date: string;
          status?: 'draft' | 'ready' | 'live' | 'archived';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          date?: string;
          status?: 'draft' | 'ready' | 'live' | 'archived';
          updated_at?: string;
        };
      };
      service_sections: {
        Row: {
          id: string;
          service_id: string;
          title: string;
          type: 'song' | 'scripture' | 'custom' | 'media' | 'announcement';
          order_index: number;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          title: string;
          type: 'song' | 'scripture' | 'custom' | 'media' | 'announcement';
          order_index: number;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          type?: 'song' | 'scripture' | 'custom' | 'media' | 'announcement';
          order_index?: number;
          metadata?: Json | null;
        };
      };
      slides: {
        Row: {
          id: string;
          section_id: string;
          order_index: number;
          content: Json;
          theme_id: string | null;
          background_url: string | null;
          background_color: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          order_index: number;
          content: Json;
          theme_id?: string | null;
          background_url?: string | null;
          background_color?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_index?: number;
          content?: Json;
          theme_id?: string | null;
          background_url?: string | null;
          background_color?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      themes: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          font_family: string;
          font_size: number;
          font_color: string;
          font_weight: string;
          text_align: 'left' | 'center' | 'right';
          text_shadow: boolean;
          background_color: string | null;
          background_image_url: string | null;
          padding: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          font_family?: string;
          font_size?: number;
          font_color?: string;
          font_weight?: string;
          text_align?: 'left' | 'center' | 'right';
          text_shadow?: boolean;
          background_color?: string | null;
          background_image_url?: string | null;
          padding?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          font_family?: string;
          font_size?: number;
          font_color?: string;
          font_weight?: string;
          text_align?: 'left' | 'center' | 'right';
          text_shadow?: boolean;
          background_color?: string | null;
          background_image_url?: string | null;
          padding?: string;
          is_default?: boolean;
        };
      };
      live_sessions: {
        Row: {
          id: string;
          service_id: string;
          current_slide_id: string | null;
          is_live: boolean;
          started_at: string;
          started_by: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          current_slide_id?: string | null;
          is_live?: boolean;
          started_at?: string;
          started_by: string;
        };
        Update: {
          current_slide_id?: string | null;
          is_live?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
