// Step 95: Offline Cache and Sync Queue Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type OfflineCacheRow =
  Database["public"]["Tables"]["offline_cache_metadata"]["Row"];
export type OfflineCacheInsert =
  Database["public"]["Tables"]["offline_cache_metadata"]["Insert"];
export type OfflineCacheUpdate =
  Database["public"]["Tables"]["offline_cache_metadata"]["Update"];

// ─── Enums ────────────────────────────────────────────────────────
export type CacheType = "menu" | "orders" | "profile" | "cart" | "settings";

// ─── Sync Queue Types ─────────────────────────────────────────────
export interface SyncQueueItem {
  id: string;
  action: "create" | "update" | "delete";
  table: string;
  data: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
  status: "pending" | "syncing" | "failed" | "completed";
  errorMessage?: string;
}

export interface CacheStatus {
  type: CacheType;
  lastSyncedAt: string;
  isStale: boolean;
  sizeBytes: number;
  dataVersion: number;
}

export interface SyncStatus {
  isOnline: boolean;
  pendingChanges: number;
  lastSyncAt: string | null;
  cacheStatuses: CacheStatus[];
}
