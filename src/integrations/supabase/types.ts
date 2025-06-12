export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          permissions: Json | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      daily_featured_poems: {
        Row: {
          author: string
          background_info: string | null
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          featured_date: string
          id: string
          theme: string | null
          title: string
        }
        Insert: {
          author: string
          background_info?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          featured_date: string
          id?: string
          theme?: string | null
          title: string
        }
        Update: {
          author?: string
          background_info?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          featured_date?: string
          id?: string
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          task_date: string
          task_type: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          task_date: string
          task_type: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          task_date?: string
          task_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      external_poem_sources: {
        Row: {
          api_endpoint: string | null
          created_at: string
          id: string
          is_active: boolean | null
          last_sync: string | null
          name: string
          updated_at: string
          url: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name: string
          updated_at?: string
          url: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      external_poems: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string
          external_id: string
          id: string
          is_active: boolean | null
          original_url: string | null
          source_id: string | null
          sync_date: string | null
          title: string
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string
          external_id: string
          id?: string
          is_active?: boolean | null
          original_url?: string | null
          source_id?: string | null
          sync_date?: string | null
          title: string
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string
          external_id?: string
          id?: string
          is_active?: boolean | null
          original_url?: string | null
          source_id?: string | null
          sync_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_poems_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_poem_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      poem_images: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          image_url: string
          poem_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          poem_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          poem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poem_images_poem_id_fkey"
            columns: ["poem_id"]
            isOneToOne: false
            referencedRelation: "poems"
            referencedColumns: ["id"]
          },
        ]
      }
      poems: {
        Row: {
          audio_url: string | null
          category: string | null
          content: string
          created_at: string
          id: string
          is_audio: boolean | null
          is_featured: boolean | null
          is_published: boolean | null
          is_recording_public: boolean | null
          recording_duration: number | null
          recording_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_audio?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          is_recording_public?: boolean | null
          recording_duration?: number | null
          recording_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_audio?: boolean | null
          is_featured?: boolean | null
          is_published?: boolean | null
          is_recording_public?: boolean | null
          recording_duration?: number | null
          recording_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          google_account_id: string | null
          google_account_linked: boolean | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          total_poems_recorded: number | null
          total_poems_written: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          google_account_id?: string | null
          google_account_linked?: boolean | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          total_poems_recorded?: number | null
          total_poems_written?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          google_account_id?: string | null
          google_account_linked?: boolean | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          total_poems_recorded?: number | null
          total_poems_written?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      all_poems: {
        Row: {
          audio_url: string | null
          category: string | null
          content: string | null
          created_at: string | null
          external_author: string | null
          id: string | null
          is_featured: boolean | null
          is_published: boolean | null
          original_url: string | null
          source_type: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      update_user_streak: {
        Args: { user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
