// Steps 73-74: Auth, Users, Profile, and Preferences Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type PasswordResetTokenRow =
  Database["public"]["Tables"]["password_reset_tokens"]["Row"];
export type PasswordResetTokenInsert =
  Database["public"]["Tables"]["password_reset_tokens"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type UserRole = "customer" | "restaurant_owner" | "admin";

// ─── Auth Types ───────────────────────────────────────────────────
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthSession {
  user: UserRow;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// ─── Profile Types ────────────────────────────────────────────────
export interface UserProfile extends UserRow {
  loyaltyTier?: LoyaltyTierInfo;
}

export interface LoyaltyTierInfo {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  multiplier: number;
  badgeIcon: string | null;
}

export interface NotificationSettings {
  orderUpdates: { sms: boolean; email: boolean; push: boolean };
  promotions: { email: boolean; sms: boolean };
  recommendations: { push: boolean };
  digest: { email: boolean; frequency: "daily" | "weekly" | "monthly" };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  dietaryPreferences?: string[];
  allergens?: string[];
  cuisinePreferences?: string[];
  defaultSpiceLevel?: number;
  notificationSettings?: NotificationSettings;
}
