import { createClient } from "@/lib/supabase/server";

export type AuditAction =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "user.role_changed"
  | "restaurant.created"
  | "restaurant.updated"
  | "restaurant.deleted"
  | "menu.updated"
  | "order.status_changed"
  | "order.refunded"
  | "promo.created"
  | "promo.updated"
  | "promo.deleted"
  | "setting.updated"
  | "integration.configured"
  | "integration.removed";

export interface AuditLogEntry {
  actor_id: string;
  action: AuditAction;
  resource_type: string;
  resource_id?: string;
  changes?: Record<string, unknown>;
  ip_address?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create an audit log entry.
 * Falls back silently if the table doesn't exist yet.
 */
export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const supabase = await createClient();
    await supabase.from("platform_audit_logs").insert({
      ...entry,
      created_at: new Date().toISOString(),
    });
  } catch {
    console.warn("[AuditLog] Failed to log action:", entry.action);
  }
}

/**
 * Fetch audit logs with optional filters.
 */
export async function getAuditLogs(options?: {
  actorId?: string;
  action?: AuditAction;
  resourceType?: string;
  limit?: number;
}) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("platform_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (options?.actorId) query = query.eq("actor_id", options.actorId);
    if (options?.action) query = query.eq("action", options.action);
    if (options?.resourceType)
      query = query.eq("resource_type", options.resourceType);

    const { data, error } = await query;
    if (error) return [];
    return data;
  } catch (error) {
    console.error("[AuditLog] Failed to fetch logs:", error);
    return [];
  }
}
