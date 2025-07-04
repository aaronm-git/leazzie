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
      car_deals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          owner_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          owner_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          owner_id?: string | null
          title?: string
        }
        Relationships: []
      }
      contact_reviews: {
        Row: {
          comment: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_reviews_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          dealership_id: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          dealership_id?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          dealership_id?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      dealerships: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      negotiation_notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          offer_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          offer_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          offer_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_notes_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          additional_fees: number | null
          car_deal_id: string | null
          contact_id: string | null
          created_at: string | null
          dealer_incentives: number | null
          dealership_id: string | null
          down_payment: number | null
          id: string
          interest_rate: number | null
          is_disqualified: boolean | null
          lease_term: number | null
          msrp: number | null
          product_image_url: string | null
          product_link: string | null
          product_specs: string | null
          product_title: string
          residual_value: number | null
          selling_price: number | null
          tax_rate: number | null
        }
        Insert: {
          additional_fees?: number | null
          car_deal_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          dealer_incentives?: number | null
          dealership_id?: string | null
          down_payment?: number | null
          id?: string
          interest_rate?: number | null
          is_disqualified?: boolean | null
          lease_term?: number | null
          msrp?: number | null
          product_image_url?: string | null
          product_link?: string | null
          product_specs?: string | null
          product_title: string
          residual_value?: number | null
          selling_price?: number | null
          tax_rate?: number | null
        }
        Update: {
          additional_fees?: number | null
          car_deal_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          dealer_incentives?: number | null
          dealership_id?: string | null
          down_payment?: number | null
          id?: string
          interest_rate?: number | null
          is_disqualified?: boolean | null
          lease_term?: number | null
          msrp?: number | null
          product_image_url?: string | null
          product_link?: string | null
          product_specs?: string | null
          product_title?: string
          residual_value?: number | null
          selling_price?: number | null
          tax_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_car_deal_id_fkey"
            columns: ["car_deal_id"]
            isOneToOne: false
            referencedRelation: "car_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
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
