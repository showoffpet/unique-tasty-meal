// Step 85: Email Templates and Notification Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type EmailTemplateRow =
  Database["public"]["Tables"]["email_templates"]["Row"];
export type EmailTemplateInsert =
  Database["public"]["Tables"]["email_templates"]["Insert"];
export type EmailTemplateUpdate =
  Database["public"]["Tables"]["email_templates"]["Update"];

export type NotificationLogRow =
  Database["public"]["Tables"]["notification_logs"]["Row"];
export type NotificationLogInsert =
  Database["public"]["Tables"]["notification_logs"]["Insert"];

export type UnsubscribeTokenRow =
  Database["public"]["Tables"]["used_unsubscribe_tokens"]["Row"];

// ─── Enums ────────────────────────────────────────────────────────
export type EmailCategory = "transactional" | "marketing" | "system";
export type NotificationStatus = "pending" | "sent" | "failed" | "bounced";
export type EmailProvider = "resend" | "nodemailer";
export type NotificationType =
  | "order_confirmation"
  | "order_status"
  | "promo"
  | "password_reset"
  | "welcome"
  | "review_reminder"
  | "system_alert";

// ─── Extended Types ───────────────────────────────────────────────
export interface EmailTemplate extends EmailTemplateRow {
  previewHtml?: string;
}

export interface SendEmailData {
  to: string;
  templateId: string;
  variables: Record<string, string>;
  userId?: string;
}

export interface NotificationPreferences {
  emailNotifications: {
    orderUpdates: { enabled: boolean };
    promotionalOffers: { enabled: boolean };
    systemAlerts: { enabled: boolean };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}
