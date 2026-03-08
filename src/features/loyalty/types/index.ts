// Loyalty & Referral Types (part of Step 70/Phase 8 schema, typed in Step 95 area)
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type LoyaltyTierRow =
  Database["public"]["Tables"]["loyalty_tiers"]["Row"];
export type LoyaltyPointLogRow =
  Database["public"]["Tables"]["loyalty_point_logs"]["Row"];
export type LoyaltyPointLogInsert =
  Database["public"]["Tables"]["loyalty_point_logs"]["Insert"];

export type ReferralRow = Database["public"]["Tables"]["referrals"]["Row"];
export type ReferralInsert =
  Database["public"]["Tables"]["referrals"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type PointAction =
  | "earned"
  | "redeemed"
  | "expired"
  | "adjusted"
  | "bonus";
export type ReferralStatus = "pending" | "completed" | "expired";

// ─── Extended Types ───────────────────────────────────────────────
export interface LoyaltyTier extends Omit<LoyaltyTierRow, "benefits"> {
  benefits: Record<string, unknown> | null;
}

export interface UserLoyaltySummary {
  points: number;
  currentTier: LoyaltyTier;
  nextTier?: LoyaltyTier;
  pointsToNextTier: number;
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
}

export interface RedeemPointsData {
  points: number;
  orderId: string;
  description: string;
}
