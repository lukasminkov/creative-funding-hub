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
      campaigns: {
        Row: {
          application_deadline: string | null
          application_questions: Json | null
          banner_image: string | null
          brand_id: string | null
          brand_name: string | null
          brief: Json | null
          category: string
          content_type: string
          country_availability: string
          created_at: string | null
          creator_tiers: Json | null
          currency: string
          deliverables: Json | null
          description: string | null
          end_date: string
          example_videos: Json | null
          guidelines: Json
          id: string
          instruction_video: string | null
          max_payout_per_submission: number | null
          platforms: string[]
          prize_pool: Json | null
          rate_per_thousand: number | null
          requested_tracking_link: boolean | null
          requirements: string[] | null
          restricted_access: Json | null
          submission_deadline: string | null
          tiktok_shop_commission: Json | null
          title: string
          total_budget: number
          tracking_link: string | null
          type: string
          visibility: string
        }
        Insert: {
          application_deadline?: string | null
          application_questions?: Json | null
          banner_image?: string | null
          brand_id?: string | null
          brand_name?: string | null
          brief?: Json | null
          category: string
          content_type: string
          country_availability: string
          created_at?: string | null
          creator_tiers?: Json | null
          currency: string
          deliverables?: Json | null
          description?: string | null
          end_date: string
          example_videos?: Json | null
          guidelines: Json
          id?: string
          instruction_video?: string | null
          max_payout_per_submission?: number | null
          platforms: string[]
          prize_pool?: Json | null
          rate_per_thousand?: number | null
          requested_tracking_link?: boolean | null
          requirements?: string[] | null
          restricted_access?: Json | null
          submission_deadline?: string | null
          tiktok_shop_commission?: Json | null
          title: string
          total_budget: number
          tracking_link?: string | null
          type: string
          visibility: string
        }
        Update: {
          application_deadline?: string | null
          application_questions?: Json | null
          banner_image?: string | null
          brand_id?: string | null
          brand_name?: string | null
          brief?: Json | null
          category?: string
          content_type?: string
          country_availability?: string
          created_at?: string | null
          creator_tiers?: Json | null
          currency?: string
          deliverables?: Json | null
          description?: string | null
          end_date?: string
          example_videos?: Json | null
          guidelines?: Json
          id?: string
          instruction_video?: string | null
          max_payout_per_submission?: number | null
          platforms?: string[]
          prize_pool?: Json | null
          rate_per_thousand?: number | null
          requested_tracking_link?: boolean | null
          requirements?: string[] | null
          restricted_access?: Json | null
          submission_deadline?: string | null
          tiktok_shop_commission?: Json | null
          title?: string
          total_budget?: number
          tracking_link?: string | null
          type?: string
          visibility?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          campaign_id: string | null
          campaign_title: string
          content: string
          creator_avatar: string | null
          creator_id: string
          creator_name: string
          id: string
          payment_amount: number
          payment_date: string
          platform: string
          transaction_id: string
          views: number
        }
        Insert: {
          campaign_id?: string | null
          campaign_title: string
          content: string
          creator_avatar?: string | null
          creator_id: string
          creator_name: string
          id?: string
          payment_amount: number
          payment_date?: string
          platform: string
          transaction_id: string
          views?: number
        }
        Update: {
          campaign_id?: string | null
          campaign_title?: string
          content?: string
          creator_avatar?: string | null
          creator_id?: string
          creator_name?: string
          id?: string
          payment_amount?: number
          payment_date?: string
          platform?: string
          transaction_id?: string
          views?: number
        }
        Relationships: []
      }
      submissions: {
        Row: {
          campaign_id: string
          campaign_title: string
          content: string
          creator_avatar: string | null
          creator_id: string
          creator_name: string
          id: string
          payment_amount: number
          platform: string
          status: string
          submitted_date: string
          views: number
        }
        Insert: {
          campaign_id: string
          campaign_title: string
          content: string
          creator_avatar?: string | null
          creator_id: string
          creator_name: string
          id?: string
          payment_amount: number
          platform: string
          status?: string
          submitted_date?: string
          views?: number
        }
        Update: {
          campaign_id?: string
          campaign_title?: string
          content?: string
          creator_avatar?: string | null
          creator_id?: string
          creator_name?: string
          id?: string
          payment_amount?: number
          platform?: string
          status?: string
          submitted_date?: string
          views?: number
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
