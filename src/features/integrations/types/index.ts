// Step 93: Integration Types — derived from Supabase database schema
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type IntegrationRow =
  Database["public"]["Tables"]["integrations"]["Row"];
export type IntegrationInsert =
  Database["public"]["Tables"]["integrations"]["Insert"];
export type IntegrationUpdate =
  Database["public"]["Tables"]["integrations"]["Update"];

export type IntegrationLogRow =
  Database["public"]["Tables"]["integration_logs"]["Row"];
export type IntegrationLogInsert =
  Database["public"]["Tables"]["integration_logs"]["Insert"];

export type WebhookEndpointRow =
  Database["public"]["Tables"]["webhook_endpoints"]["Row"];
export type WebhookEndpointInsert =
  Database["public"]["Tables"]["webhook_endpoints"]["Insert"];
export type WebhookEndpointUpdate =
  Database["public"]["Tables"]["webhook_endpoints"]["Update"];

// ─── Enums ────────────────────────────────────────────────────────
export type IntegrationProvider =
  | "logistics_partner"
  | "accounting_software"
  | "crm_system"
  | "marketing_platform"
  | "analytics_service"
  | "custom_api";

export type ConnectionStatus =
  | "connected"
  | "disconnected"
  | "error"
  | "pending_auth";
export type SyncFrequency =
  | "realtime"
  | "hourly"
  | "daily"
  | "weekly"
  | "manual";

export type IntegrationLogType =
  | "api_call"
  | "webhook_delivery"
  | "sync_operation"
  | "auth_failure"
  | "rate_limit"
  | "data_mapping_error";

export type LogMethod = "GET" | "POST" | "PATCH" | "DELETE" | "WEBHOOK";
export type LogStatus =
  | "success"
  | "failure"
  | "pending"
  | "retry"
  | "rate_limited";
export type LogTrigger =
  | "scheduled_sync"
  | "manual_trigger"
  | "webhook"
  | "admin_action"
  | "system";
export type DeliveryStatus = "healthy" | "degraded" | "failing";

// ─── Frontend-safe type (excludes sensitive fields) ───────────────
export type Integration = Omit<
  IntegrationRow,
  | "api_key"
  | "api_secret"
  | "webhook_secret"
  | "data_mapping"
  | "rate_limit_config"
  | "retry_policy"
>;

// ─── Extended Types ───────────────────────────────────────────────
export type IntegrationLog = IntegrationLogRow;

/** secret is excluded — never sent to the frontend */
export type WebhookEndpoint = Omit<WebhookEndpointRow, "secret">;

// ─── API Request/Response Types ───────────────────────────────────
export interface IntegrationListResponse {
  integrations: Integration[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface IntegrationLogsResponse {
  logs: IntegrationLog[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface WebhookConfigResponse {
  webhooks: WebhookEndpoint[];
}

export interface TestConnectionResponse {
  connected: boolean;
  message: string;
  statusCode: number | null;
  responseTime: number | null;
}

// ─── Component-level Types ────────────────────────────────────────
export interface IntegrationConfigData {
  providerName: string;
  apiKey: string;
  syncFrequency: string;
  baseUrl: string;
  webhookSecret: string;
  rateLimitCount: string;
}

export interface IntegrationLogFilters {
  range?: string;
  status?: string;
  type?: string;
}

export interface ConfigureIntegrationRequest {
  provider: IntegrationProvider;
  providerName: string;
  apiKey: string;
  apiSecret?: string;
  baseUrl?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  syncFrequency: SyncFrequency;
  dataMapping?: Record<string, unknown>;
  rateLimitConfig?: Record<string, unknown>;
  retryPolicy?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
