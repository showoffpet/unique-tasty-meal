// Step 92: Security Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type SecurityEventRow =
  Database["public"]["Tables"]["security_events"]["Row"];
export type SecurityEventInsert =
  Database["public"]["Tables"]["security_events"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type SecuritySeverity = "info" | "warning" | "critical";
export type SecurityEventType =
  | "login_attempt"
  | "login_success"
  | "login_failure"
  | "password_change"
  | "password_reset"
  | "account_locked"
  | "suspicious_activity"
  | "role_change"
  | "data_export";

// ─── Extended Types ───────────────────────────────────────────────
export interface SecurityEvent extends Omit<SecurityEventRow, "details"> {
  details: Record<string, unknown> | null;
}

export interface SecurityFilters {
  eventType?: SecurityEventType;
  severity?: SecuritySeverity;
  userId?: string;
  resolved?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "created_at" | "severity";
  sortOrder?: "asc" | "desc";
}

export interface SecurityDashboard {
  totalEvents: number;
  criticalUnresolved: number;
  recentEvents: SecurityEvent[];
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<SecuritySeverity, number>;
}
