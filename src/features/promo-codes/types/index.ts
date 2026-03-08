// Step 80: Promo Code Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type PromoCodeRow = Database["public"]["Tables"]["promo_codes"]["Row"];
export type PromoCodeInsert =
  Database["public"]["Tables"]["promo_codes"]["Insert"];
export type PromoCodeUpdate =
  Database["public"]["Tables"]["promo_codes"]["Update"];

export type PromoUsageRow =
  Database["public"]["Tables"]["user_promo_usage"]["Row"];
export type PromoUsageInsert =
  Database["public"]["Tables"]["user_promo_usage"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type DiscountType = "fixed" | "percentage";
export type PromoStatus = "active" | "inactive" | "expired";

// ─── Extended Types ───────────────────────────────────────────────
export interface PromoCode extends PromoCodeRow {
  isValid?: boolean;
  remainingUses?: number;
}

export interface ApplyPromoResult {
  valid: boolean;
  discountAmount: number;
  message: string;
  promoCode?: PromoCode;
}

export interface CreatePromoData {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountCap?: number;
  minimumOrderAmount?: number;
  maxUsages: number;
  usagePerUserLimit?: number;
  expiresAt: string;
  applicableMeals?: string[];
  applicableCuisines?: string[];
  applicableDietaryTags?: string[];
  excludedMeals?: string[];
  requiresNewUser?: boolean;
  requiresMinimumItems?: number;
  stackable?: boolean;
  metadata?: Record<string, unknown>;
}
