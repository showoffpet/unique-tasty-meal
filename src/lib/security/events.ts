import { createClient } from "@/lib/supabase/server";

export type SecurityEventType =
  | "login_success"
  | "login_failure"
  | "logout"
  | "password_reset_requested"
  | "password_reset_completed"
  | "email_verified"
  | "account_created"
  | "account_locked"
  | "suspicious_activity"
  | "role_changed";

export interface SecurityEvent {
  user_id: string;
  event_type: SecurityEventType;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log a security event to the security_events table.
 * Falls back silently if the table doesn't exist yet.
 */
export async function logSecurityEvent(event: SecurityEvent) {
  try {
    const supabase = await createClient();
    await supabase.from("security_events").insert({
      ...event,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Silently fail — security logging should never crash the app
    console.warn("[SecurityLog] Failed to log event:", event.event_type);
  }
}

/**
 * Get recent security events for a user (for admin/profile views).
 */
export async function getSecurityEvents(userId: string, limit = 20) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("security_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return data;
  } catch (error) {
    console.error("[SecurityLog] Failed to fetch events:", error);
    return [];
  }
}
