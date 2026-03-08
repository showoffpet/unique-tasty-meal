export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          add_ons: Json | null
          add_ons_total: number
          added_at: string
          base_price: number
          customization_id: string | null
          id: string
          ingredient_modifications: Json | null
          item_price: number
          meal_id: string
          meal_image_url: string | null
          meal_name: string
          portion_modifier: number
          portion_size: string
          quantity: number
          special_instructions: string | null
          spice_level: number
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          add_ons?: Json | null
          add_ons_total?: number
          added_at?: string
          base_price: number
          customization_id?: string | null
          id?: string
          ingredient_modifications?: Json | null
          item_price: number
          meal_id: string
          meal_image_url?: string | null
          meal_name: string
          portion_modifier?: number
          portion_size?: string
          quantity?: number
          special_instructions?: string | null
          spice_level?: number
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          add_ons?: Json | null
          add_ons_total?: number
          added_at?: string
          base_price?: number
          customization_id?: string | null
          id?: string
          ingredient_modifications?: Json | null
          item_price?: number
          meal_id?: string
          meal_image_url?: string | null
          meal_name?: string
          portion_modifier?: number
          portion_size?: string
          quantity?: number
          special_instructions?: string | null
          spice_level?: number
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_customization_id_fkey"
            columns: ["customization_id"]
            isOneToOne: false
            referencedRelation: "meal_customizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_tags: {
        Row: {
          assigned_by: string | null
          auto_assigned: boolean | null
          created_at: string
          id: string
          tag_name: string
          tag_value: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          auto_assigned?: boolean | null
          created_at?: string
          id?: string
          tag_name: string
          tag_value?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          auto_assigned?: boolean | null
          created_at?: string
          id?: string
          tag_name?: string
          tag_value?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tags_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          html_body: string
          id: string
          is_active: boolean
          name: string
          subject: string
          text_body: string | null
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          html_body: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          text_body?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          html_body?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          text_body?: string | null
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_campaigns: {
        Row: {
          campaign_type: string
          completed_at: string | null
          content: Json
          created_at: string
          created_by: string
          description: string | null
          id: string
          metrics: Json | null
          name: string
          scheduled_at: string | null
          started_at: string | null
          status: string
          target_segment: Json | null
          updated_at: string
        }
        Insert: {
          campaign_type: string
          completed_at?: string | null
          content?: Json
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          metrics?: Json | null
          name: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          target_segment?: Json | null
          updated_at?: string
        }
        Update: {
          campaign_type?: string
          completed_at?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          scheduled_at?: string | null
          started_at?: string | null
          status?: string
          target_segment?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_code: string | null
          error_message: string | null
          id: string
          integration_id: string
          log_type: string
          method: string
          operation: string
          records_processed: number
          response_time: number | null
          retry_count: number
          status: string
          status_code: number | null
          timestamp: string
          triggered_by: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          integration_id: string
          log_type: string
          method: string
          operation: string
          records_processed?: number
          response_time?: number | null
          retry_count?: number
          status?: string
          status_code?: number | null
          timestamp?: string
          triggered_by?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string
          log_type?: string
          method?: string
          operation?: string
          records_processed?: number
          response_time?: number | null
          retry_count?: number
          status?: string
          status_code?: number | null
          timestamp?: string
          triggered_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key: string | null
          api_secret: string | null
          base_url: string | null
          configured_by: string | null
          connection_status: string
          created_at: string
          data_mapping: Json | null
          id: string
          is_enabled: boolean
          last_error_at: string | null
          last_error_message: string | null
          last_sync_at: string | null
          metadata: Json | null
          provider: string
          provider_name: string
          rate_limit_config: Json | null
          retry_policy: Json | null
          sync_frequency: string
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          base_url?: string | null
          configured_by?: string | null
          connection_status?: string
          created_at?: string
          data_mapping?: Json | null
          id?: string
          is_enabled?: boolean
          last_error_at?: string | null
          last_error_message?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider: string
          provider_name: string
          rate_limit_config?: Json | null
          retry_policy?: Json | null
          sync_frequency?: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          base_url?: string | null
          configured_by?: string | null
          connection_status?: string
          created_at?: string
          data_mapping?: Json | null
          id?: string
          is_enabled?: boolean
          last_error_at?: string | null
          last_error_message?: string | null
          last_sync_at?: string | null
          metadata?: Json | null
          provider?: string
          provider_name?: string
          rate_limit_config?: Json | null
          retry_policy?: Json | null
          sync_frequency?: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_configured_by_fkey"
            columns: ["configured_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          id: string
          ingredient_name: string
          is_low_stock: boolean
          last_restocked_at: string | null
          meal_id: string
          quantity: number
          reorder_level: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          ingredient_name: string
          is_low_stock?: boolean
          last_restocked_at?: string | null
          meal_id: string
          quantity?: number
          reorder_level?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          ingredient_name?: string
          is_low_stock?: boolean
          last_restocked_at?: string | null
          meal_id?: string
          quantity?: number
          reorder_level?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_point_logs: {
        Row: {
          action: string
          balance_after: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          source: string
          user_id: string
        }
        Insert: {
          action: string
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          source: string
          user_id: string
        }
        Update: {
          action?: string
          balance_after?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_point_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_point_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_tiers: {
        Row: {
          badge_icon: string | null
          benefits: Json | null
          created_at: string
          display_order: number
          id: string
          max_points: number | null
          min_points: number
          multiplier: number
          name: string
          updated_at: string
        }
        Insert: {
          badge_icon?: string | null
          benefits?: Json | null
          created_at?: string
          display_order?: number
          id?: string
          max_points?: number | null
          min_points?: number
          multiplier?: number
          name: string
          updated_at?: string
        }
        Update: {
          badge_icon?: string | null
          benefits?: Json | null
          created_at?: string
          display_order?: number
          id?: string
          max_points?: number | null
          min_points?: number
          multiplier?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_customizations: {
        Row: {
          add_ons: Json | null
          created_at: string
          extra_ingredients: string[] | null
          id: string
          is_favorite: boolean | null
          last_used_at: string | null
          meal_id: string
          name: string
          portion_size: string
          removed_ingredients: string[] | null
          special_instructions: string | null
          spice_level: number
          updated_at: string
          use_count: number | null
          user_id: string
        }
        Insert: {
          add_ons?: Json | null
          created_at?: string
          extra_ingredients?: string[] | null
          id?: string
          is_favorite?: boolean | null
          last_used_at?: string | null
          meal_id: string
          name: string
          portion_size?: string
          removed_ingredients?: string[] | null
          special_instructions?: string | null
          spice_level?: number
          updated_at?: string
          use_count?: number | null
          user_id: string
        }
        Update: {
          add_ons?: Json | null
          created_at?: string
          extra_ingredients?: string[] | null
          id?: string
          is_favorite?: boolean | null
          last_used_at?: string | null
          meal_id?: string
          name?: string
          portion_size?: string
          removed_ingredients?: string[] | null
          special_instructions?: string | null
          spice_level?: number
          updated_at?: string
          use_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_customizations_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_customizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_notifications: {
        Row: {
          created_at: string
          email: string | null
          id: string
          meal_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          meal_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          meal_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_notifications_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          add_ons: Json | null
          allergens: string[] | null
          average_rating: number | null
          base_price: number
          category_id: string
          created_at: string
          description: string
          dietary_tags: string[] | null
          display_order: number
          id: string
          image_url: string | null
          ingredients: string[] | null
          is_available: boolean
          name: string
          nutritional_info: Json | null
          portion_options: Json | null
          preparation_time: number
          spice_level: number | null
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          add_ons?: Json | null
          allergens?: string[] | null
          average_rating?: number | null
          base_price: number
          category_id: string
          created_at?: string
          description: string
          dietary_tags?: string[] | null
          display_order?: number
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          name: string
          nutritional_info?: Json | null
          portion_options?: Json | null
          preparation_time: number
          spice_level?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          add_ons?: Json | null
          allergens?: string[] | null
          average_rating?: number | null
          base_price?: number
          category_id?: string
          created_at?: string
          description?: string
          dietary_tags?: string[] | null
          display_order?: number
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          is_available?: boolean
          name?: string
          nutritional_info?: Json | null
          portion_options?: Json | null
          preparation_time?: number
          spice_level?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "meal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          bounce_reason: string | null
          created_at: string
          delivered_at: string | null
          email: string
          email_provider: string | null
          id: string
          metadata: Json | null
          notification_type: string
          status: string
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          bounce_reason?: string | null
          created_at?: string
          delivered_at?: string | null
          email: string
          email_provider?: string | null
          id?: string
          metadata?: Json | null
          notification_type: string
          status?: string
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          bounce_reason?: string | null
          created_at?: string
          delivered_at?: string | null
          email?: string
          email_provider?: string | null
          id?: string
          metadata?: Json | null
          notification_type?: string
          status?: string
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      offline_cache_metadata: {
        Row: {
          cache_key: string
          cache_type: string
          created_at: string
          data_version: number
          expires_at: string | null
          id: string
          is_stale: boolean
          last_synced_at: string
          size_bytes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cache_key: string
          cache_type: string
          created_at?: string
          data_version?: number
          expires_at?: string | null
          id?: string
          is_stale?: boolean
          last_synced_at?: string
          size_bytes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cache_key?: string
          cache_type?: string
          created_at?: string
          data_version?: number
          expires_at?: string | null
          id?: string
          is_stale?: boolean
          last_synced_at?: string
          size_bytes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offline_cache_metadata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string
          delivered_at: string | null
          delivery_address: Json | null
          delivery_address_id: string | null
          delivery_fee: number
          discount_amount: number | null
          estimated_delivery_time: number | null
          estimated_prep_time: number | null
          id: string
          items: Json
          order_status: string
          payment_intent_id: string | null
          payment_method: string
          payment_status: string
          promo_code: string | null
          promo_code_id: string | null
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_address_id?: string | null
          delivery_fee?: number
          discount_amount?: number | null
          estimated_delivery_time?: number | null
          estimated_prep_time?: number | null
          id?: string
          items?: Json
          order_status?: string
          payment_intent_id?: string | null
          payment_method?: string
          payment_status?: string
          promo_code?: string | null
          promo_code_id?: string | null
          subtotal: number
          tax_amount?: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_address?: Json | null
          delivery_address_id?: string | null
          delivery_fee?: number
          discount_amount?: number | null
          estimated_delivery_time?: number | null
          estimated_prep_time?: number | null
          id?: string
          items?: Json
          order_status?: string
          payment_intent_id?: string | null
          payment_method?: string
          payment_status?: string
          promo_code?: string | null
          promo_code_id?: string | null
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "user_delivery_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          billing_address: Json | null
          card_brand: string | null
          created_at: string
          display_name: string
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_active: boolean
          is_default: boolean
          last_four: string | null
          payment_type: string
          provider: string
          provider_payment_method_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          card_brand?: string | null
          created_at?: string
          display_name: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          last_four?: string | null
          payment_type: string
          provider?: string
          provider_payment_method_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          card_brand?: string | null
          created_at?: string
          display_name?: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          last_four?: string | null
          payment_type?: string
          provider?: string
          provider_payment_method_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          metadata: Json | null
          order_id: string
          payment_method_id: string | null
          payment_provider: string
          payment_provider_id: string
          refund_amount: number | null
          refund_reason: string | null
          refunded_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          payment_method_id?: string | null
          payment_provider: string
          payment_provider_id: string
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          payment_method_id?: string | null
          payment_provider?: string
          payment_provider_id?: string
          refund_amount?: number | null
          refund_reason?: string | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_audit_logs: {
        Row: {
          action: string
          admin_id: string
          changes: Json | null
          created_at: string
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applicable_cuisines: string[] | null
          applicable_dietary_tags: string[] | null
          applicable_meals: string[] | null
          code: string
          created_at: string
          created_by: string
          description: string | null
          discount_type: string
          discount_value: number
          excluded_meals: string[] | null
          expires_at: string
          id: string
          max_discount_cap: number | null
          max_usages: number
          metadata: Json | null
          minimum_order_amount: number | null
          requires_minimum_items: number | null
          requires_new_user: boolean | null
          stackable: boolean | null
          status: string
          updated_at: string
          usage_count: number
          usage_per_user_limit: number | null
        }
        Insert: {
          applicable_cuisines?: string[] | null
          applicable_dietary_tags?: string[] | null
          applicable_meals?: string[] | null
          code: string
          created_at?: string
          created_by: string
          description?: string | null
          discount_type: string
          discount_value: number
          excluded_meals?: string[] | null
          expires_at: string
          id?: string
          max_discount_cap?: number | null
          max_usages?: number
          metadata?: Json | null
          minimum_order_amount?: number | null
          requires_minimum_items?: number | null
          requires_new_user?: boolean | null
          stackable?: boolean | null
          status?: string
          updated_at?: string
          usage_count?: number
          usage_per_user_limit?: number | null
        }
        Update: {
          applicable_cuisines?: string[] | null
          applicable_dietary_tags?: string[] | null
          applicable_meals?: string[] | null
          code?: string
          created_at?: string
          created_by?: string
          description?: string | null
          discount_type?: string
          discount_value?: number
          excluded_meals?: string[] | null
          expires_at?: string
          id?: string
          max_discount_cap?: number | null
          max_usages?: number
          metadata?: Json | null
          minimum_order_amount?: number | null
          requires_minimum_items?: number | null
          requires_new_user?: boolean | null
          stackable?: boolean | null
          status?: string
          updated_at?: string
          usage_count?: number
          usage_per_user_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_given: boolean
          reward_points: number | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referrer_id: string
          reward_given?: boolean
          reward_points?: number | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referrer_id?: string
          reward_given?: boolean
          reward_points?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      review_moderation_log: {
        Row: {
          id: string
          reason: string
          reported_at: string
          reported_by: string | null
          review_id: string
          status: string
        }
        Insert: {
          id?: string
          reason: string
          reported_at?: string
          reported_by?: string | null
          review_id: string
          status?: string
        }
        Update: {
          id?: string
          reason?: string
          reported_at?: string
          reported_by?: string | null
          review_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_moderation_log_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_moderation_log_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          deleted_at: string | null
          helpful: number | null
          helpful_by: string[] | null
          id: string
          is_reported: boolean | null
          is_verified_purchase: boolean | null
          meal_id: string | null
          order_id: string | null
          photo_urls: string[] | null
          rating: number
          report_count: number | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          deleted_at?: string | null
          helpful?: number | null
          helpful_by?: string[] | null
          id?: string
          is_reported?: boolean | null
          is_verified_purchase?: boolean | null
          meal_id?: string | null
          order_id?: string | null
          photo_urls?: string[] | null
          rating: number
          report_count?: number | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          deleted_at?: string | null
          helpful?: number | null
          helpful_by?: string[] | null
          id?: string
          is_reported?: boolean | null
          is_verified_purchase?: boolean | null
          meal_id?: string | null
          order_id?: string | null
          photo_urls?: string[] | null
          rating?: number
          report_count?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_metrics: {
        Row: {
          average_order_value: number | null
          created_at: string
          customer_segments: Json | null
          id: string
          payment_method_breakdown: Json | null
          peak_hours: Json | null
          period_end: string
          period_start: string
          period_type: string
          top_categories: Json | null
          top_meals: Json | null
          total_items_sold: number
          total_orders: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          average_order_value?: number | null
          created_at?: string
          customer_segments?: Json | null
          id?: string
          payment_method_breakdown?: Json | null
          peak_hours?: Json | null
          period_end: string
          period_start: string
          period_type: string
          top_categories?: Json | null
          top_meals?: Json | null
          total_items_sold?: number
          total_orders?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          average_order_value?: number | null
          created_at?: string
          customer_segments?: Json | null
          id?: string
          payment_method_breakdown?: Json | null
          peak_hours?: Json | null
          period_end?: string
          period_start?: string
          period_type?: string
          top_categories?: Json | null
          top_meals?: Json | null
          total_items_sold?: number
          total_orders?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      saved_search_filters: {
        Row: {
          created_at: string
          filters: Json
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_search_filters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          meal_id: string | null
          search_query: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          meal_id?: string | null
          search_query?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          meal_id?: string | null
          search_query?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      used_unsubscribe_tokens: {
        Row: {
          expires_at: string
          token: string
          used_at: string
          user_id: string | null
        }
        Insert: {
          expires_at: string
          token: string
          used_at?: string
          user_id?: string | null
        }
        Update: {
          expires_at?: string
          token?: string
          used_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "used_unsubscribe_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_delivery_addresses: {
        Row: {
          apartment: string | null
          city: string
          created_at: string
          deleted_at: string | null
          delivery_instructions: string | null
          delivery_zones: Json | null
          formatted_address: string
          google_places_id: string | null
          id: string
          is_default: boolean
          is_verified: boolean
          label: string
          latitude: number
          longitude: number
          postal_code: string
          street_address: string
          updated_at: string
          usage_count: number
          user_id: string
          verification_status: string
        }
        Insert: {
          apartment?: string | null
          city: string
          created_at?: string
          deleted_at?: string | null
          delivery_instructions?: string | null
          delivery_zones?: Json | null
          formatted_address: string
          google_places_id?: string | null
          id?: string
          is_default?: boolean
          is_verified?: boolean
          label?: string
          latitude: number
          longitude: number
          postal_code: string
          street_address: string
          updated_at?: string
          usage_count?: number
          user_id: string
          verification_status?: string
        }
        Update: {
          apartment?: string | null
          city?: string
          created_at?: string
          deleted_at?: string | null
          delivery_instructions?: string | null
          delivery_zones?: Json | null
          formatted_address?: string
          google_places_id?: string | null
          id?: string
          is_default?: boolean
          is_verified?: boolean
          label?: string
          latitude?: number
          longitude?: number
          postal_code?: string
          street_address?: string
          updated_at?: string
          usage_count?: number
          user_id?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_delivery_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_promo_usage: {
        Row: {
          created_at: string
          discount_applied: number
          id: string
          order_id: string | null
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_applied?: number
          id?: string
          order_id?: string | null
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_applied?: number
          id?: string
          order_id?: string | null
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          allergens: string[] | null
          avatar_url: string | null
          created_at: string
          cuisine_preferences: string[] | null
          default_spice_level: number | null
          deleted_at: string | null
          dietary_preferences: string[] | null
          email: string
          id: string
          is_deleted: boolean
          is_email_verified: boolean
          language: string | null
          last_login_at: string | null
          loyalty_points: number | null
          loyalty_tier_id: string | null
          name: string
          notification_settings: Json | null
          phone: string | null
          preferences_updated_at: string | null
          referral_code: string | null
          referred_by: string | null
          role: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          avatar_url?: string | null
          created_at?: string
          cuisine_preferences?: string[] | null
          default_spice_level?: number | null
          deleted_at?: string | null
          dietary_preferences?: string[] | null
          email: string
          id: string
          is_deleted?: boolean
          is_email_verified?: boolean
          language?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          loyalty_tier_id?: string | null
          name: string
          notification_settings?: Json | null
          phone?: string | null
          preferences_updated_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          avatar_url?: string | null
          created_at?: string
          cuisine_preferences?: string[] | null
          default_spice_level?: number | null
          deleted_at?: string | null
          dietary_preferences?: string[] | null
          email?: string
          id?: string
          is_deleted?: boolean
          is_email_verified?: boolean
          language?: string | null
          last_login_at?: string | null
          loyalty_points?: number | null
          loyalty_tier_id?: string | null
          name?: string
          notification_settings?: Json | null
          phone?: string | null
          preferences_updated_at?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_loyalty_tier_id_fkey"
            columns: ["loyalty_tier_id"]
            isOneToOne: false
            referencedRelation: "loyalty_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          average_response_time: number | null
          created_at: string
          delivery_status: string
          event_type: string
          failure_count: number
          id: string
          integration_id: string
          is_active: boolean
          last_delivery_at: string | null
          last_failure_at: string | null
          last_success_at: string | null
          secret: string | null
          success_count: number
          total_deliveries: number
          updated_at: string
          url: string
        }
        Insert: {
          average_response_time?: number | null
          created_at?: string
          delivery_status?: string
          event_type: string
          failure_count?: number
          id?: string
          integration_id: string
          is_active?: boolean
          last_delivery_at?: string | null
          last_failure_at?: string | null
          last_success_at?: string | null
          secret?: string | null
          success_count?: number
          total_deliveries?: number
          updated_at?: string
          url: string
        }
        Update: {
          average_response_time?: number | null
          created_at?: string
          delivery_status?: string
          event_type?: string
          failure_count?: number
          id?: string
          integration_id?: string
          is_active?: boolean
          last_delivery_at?: string | null
          last_failure_at?: string | null
          last_success_at?: string | null
          secret?: string | null
          success_count?: number
          total_deliveries?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_endpoints_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_restaurant_owner: {
        Args: { restaurant_uuid: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

