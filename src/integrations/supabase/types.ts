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
      github_accounts: {
        Row: {
          access_token: string
          created_at: string
          id: string
          installation_id: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          installation_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          installation_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      github_reports: {
        Row: {
          content: Json
          created_at: string
          file_sha: string | null
          id: string
          pushed_at: string | null
          report_file_url: string | null
          report_type: string
          repository_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          file_sha?: string | null
          id?: string
          pushed_at?: string | null
          report_file_url?: string | null
          report_type: string
          repository_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          file_sha?: string | null
          id?: string
          pushed_at?: string | null
          report_file_url?: string | null
          report_type?: string
          repository_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_reports_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "github_repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      github_repositories: {
        Row: {
          commit_count: number | null
          created_at: string
          default_branch: string | null
          description: string | null
          forks_count: number | null
          github_account_id: string
          id: string
          is_private: boolean | null
          issue_count: number | null
          language: string | null
          last_synced: string | null
          open_issues_count: number | null
          owner: string
          pr_count: number | null
          repo_name: string
          stars_count: number | null
          updated_at: string
          user_id: string
          watchers_count: number | null
        }
        Insert: {
          commit_count?: number | null
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          github_account_id: string
          id?: string
          is_private?: boolean | null
          issue_count?: number | null
          language?: string | null
          last_synced?: string | null
          open_issues_count?: number | null
          owner: string
          pr_count?: number | null
          repo_name: string
          stars_count?: number | null
          updated_at?: string
          user_id: string
          watchers_count?: number | null
        }
        Update: {
          commit_count?: number | null
          created_at?: string
          default_branch?: string | null
          description?: string | null
          forks_count?: number | null
          github_account_id?: string
          id?: string
          is_private?: boolean | null
          issue_count?: number | null
          language?: string | null
          last_synced?: string | null
          open_issues_count?: number | null
          owner?: string
          pr_count?: number | null
          repo_name?: string
          stars_count?: number | null
          updated_at?: string
          user_id?: string
          watchers_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "github_repositories_github_account_id_fkey"
            columns: ["github_account_id"]
            isOneToOne: false
            referencedRelation: "github_accounts"
            referencedColumns: ["id"]
          },
        ]
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
      routine_daily_instances: {
        Row: {
          created_at: string
          date: string
          id: string
          is_override: boolean | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_override?: boolean | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_override?: boolean | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_daily_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "routine_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_pending_tasks: {
        Row: {
          created_at: string
          id: string
          is_resolved: boolean | null
          original_date: string
          priority: number | null
          reschedule_date: string | null
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          original_date: string
          priority?: number | null
          reschedule_date?: string | null
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_resolved?: boolean | null
          original_date?: string
          priority?: number | null
          reschedule_date?: string | null
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_pending_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "routine_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_reflections: {
        Row: {
          achievements: string | null
          blockers: string | null
          created_at: string
          daily_instance_id: string | null
          date: string
          energy_rating: number | null
          id: string
          mood_rating: number | null
          productivity_rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string | null
          blockers?: string | null
          created_at?: string
          daily_instance_id?: string | null
          date: string
          energy_rating?: number | null
          id?: string
          mood_rating?: number | null
          productivity_rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string | null
          blockers?: string | null
          created_at?: string
          daily_instance_id?: string | null
          date?: string
          energy_rating?: number | null
          id?: string
          mood_rating?: number | null
          productivity_rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_reflections_daily_instance_id_fkey"
            columns: ["daily_instance_id"]
            isOneToOne: false
            referencedRelation: "routine_daily_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_task_completions: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          created_at: string
          daily_instance_id: string | null
          date: string
          energy_level: number | null
          id: string
          is_completed: boolean | null
          is_skipped: boolean | null
          mood: number | null
          notes: string | null
          skip_reason: string | null
          task_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          daily_instance_id?: string | null
          date: string
          energy_level?: number | null
          id?: string
          is_completed?: boolean | null
          is_skipped?: boolean | null
          mood?: number | null
          notes?: string | null
          skip_reason?: string | null
          task_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          daily_instance_id?: string | null
          date?: string
          energy_level?: number | null
          id?: string
          is_completed?: boolean | null
          is_skipped?: boolean | null
          mood?: number | null
          notes?: string | null
          skip_reason?: string | null
          task_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_task_completions_daily_instance_id_fkey"
            columns: ["daily_instance_id"]
            isOneToOne: false
            referencedRelation: "routine_daily_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routine_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "routine_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_tasks: {
        Row: {
          color: string | null
          created_at: string
          day_of_week: number
          description: string | null
          duration: number
          icon: string | null
          id: string
          is_recurring: boolean | null
          name: string
          start_time: number
          task_order: number
          task_type: Database["public"]["Enums"]["routine_task_type"]
          template_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          day_of_week: number
          description?: string | null
          duration: number
          icon?: string | null
          id?: string
          is_recurring?: boolean | null
          name: string
          start_time: number
          task_order: number
          task_type?: Database["public"]["Enums"]["routine_task_type"]
          template_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          duration?: number
          icon?: string | null
          id?: string
          is_recurring?: boolean | null
          name?: string
          start_time?: number
          task_order?: number
          task_type?: Database["public"]["Enums"]["routine_task_type"]
          template_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "routine_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "routine_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
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
      routine_task_type:
        | "regular"
        | "break"
        | "custom"
        | "disruption"
        | "pending"
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
      routine_task_type: [
        "regular",
        "break",
        "custom",
        "disruption",
        "pending",
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
