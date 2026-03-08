// Steps 86-87, 88: Admin Dashboard, Menu Management, and Image Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type PlatformSettingsRow =
  Database["public"]["Tables"]["platform_settings"]["Row"];
export type PlatformSettingsUpdate =
  Database["public"]["Tables"]["platform_settings"]["Update"];

export type AuditLogRow =
  Database["public"]["Tables"]["platform_audit_logs"]["Row"];
export type AuditLogInsert =
  Database["public"]["Tables"]["platform_audit_logs"]["Insert"];

export type CustomerTagRow =
  Database["public"]["Tables"]["customer_tags"]["Row"];
export type CustomerTagInsert =
  Database["public"]["Tables"]["customer_tags"]["Insert"];

export type CampaignRow =
  Database["public"]["Tables"]["engagement_campaigns"]["Row"];
export type CampaignInsert =
  Database["public"]["Tables"]["engagement_campaigns"]["Insert"];
export type CampaignUpdate =
  Database["public"]["Tables"]["engagement_campaigns"]["Update"];

// ─── Enums ────────────────────────────────────────────────────────
export type CampaignType = "email" | "push" | "sms" | "in_app";
export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  heroImageUrl: string;
  logoUrl: string;
  description: string;
  cuisineTypes: string[];
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number;
}

export interface SiteConfig {
  siteName: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
}

export interface CampaignMetrics {
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

// ─── Dashboard Types ──────────────────────────────────────────────
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
}

// ─── Image Management Types ───────────────────────────────────────
export interface ImageUploadResult {
  url: string;
  path: string;
  size: number;
  width: number;
  height: number;
  mimeType: string;
}

export interface ImageUploadOptions {
  bucket: string;
  folder: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}
