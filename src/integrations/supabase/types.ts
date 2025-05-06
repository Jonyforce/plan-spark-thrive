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
      daily_summaries: {
        Row: {
          completed_items: number | null
          created_at: string
          date: string
          deleted_at: string | null
          energy_level: number | null
          id: string
          is_deleted: boolean | null
          metadata: Json | null
          mood: string | null
          motivation_level: number | null
          notes: string | null
          productivity_score: number | null
          total_time_spent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_items?: number | null
          created_at?: string
          date: string
          deleted_at?: string | null
          energy_level?: number | null
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mood?: string | null
          motivation_level?: number | null
          notes?: string | null
          productivity_score?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_items?: number | null
          created_at?: string
          date?: string
          deleted_at?: string | null
          energy_level?: number | null
          id?: string
          is_deleted?: boolean | null
          metadata?: Json | null
          mood?: string | null
          motivation_level?: number | null
          notes?: string | null
          productivity_score?: number | null
          total_time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      learning_retention: {
        Row: {
          confidence_level: number | null
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean | null
          last_reviewed_at: string | null
          metadata: Json | null
          next_review_at: string | null
          review_count: number | null
          study_item_id: string
          study_item_name: string
          tags: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          confidence_level?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          last_reviewed_at?: string | null
          metadata?: Json | null
          next_review_at?: string | null
          review_count?: number | null
          study_item_id: string
          study_item_name: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          confidence_level?: number | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          last_reviewed_at?: string | null
          metadata?: Json | null
          next_review_at?: string | null
          review_count?: number | null
          study_item_id?: string
          study_item_name?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type_enum"]
          created_at: string
          deleted_at: string | null
          id: string
          is_deleted: boolean | null
          item_id: string
          item_name: string
          metadata: Json | null
          progress: number | null
          project_id: string | null
          status: Database["public"]["Enums"]["status_enum"]
          tags: string[] | null
          time_spent: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type_enum"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          item_id: string
          item_name: string
          metadata?: Json | null
          progress?: number | null
          project_id?: string | null
          status: Database["public"]["Enums"]["status_enum"]
          tags?: string[] | null
          time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type_enum"]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_deleted?: boolean | null
          item_id?: string
          item_name?: string
          metadata?: Json | null
          progress?: number | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["status_enum"]
          tags?: string[] | null
          time_spent?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          created_at: string
          device_info: Json | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          location: string | null
          login_at: string | null
          logout_at: string | null
          metadata: Json | null
          os: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          metadata?: Json | null
          os?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          location?: string | null
          login_at?: string | null
          logout_at?: string | null
          metadata?: Json | null
          os?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type_enum:
        | "project"
        | "study"
        | "gate"
        | "time_tracking"
        | "learning_review"
      status_enum:
        | "not-started"
        | "in-progress"
        | "completed"
        | "cancelled"
        | "postponed"
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
    Enums: {
      activity_type_enum: [
        "project",
        "study",
        "gate",
        "time_tracking",
        "learning_review",
      ],
      status_enum: [
        "not-started",
        "in-progress",
        "completed",
        "cancelled",
        "postponed",
      ],
    },
  },
} as const
