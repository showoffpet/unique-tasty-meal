-- Migration 10: Integrations, Integration Logs, Webhook Endpoints

-- 1. Integrations
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('logistics_partner', 'accounting_software', 'crm_system', 'marketing_platform', 'analytics_service', 'custom_api')),
  provider_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  connection_status TEXT NOT NULL DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error', 'pending_auth')),
  api_key TEXT,
  api_secret TEXT,
  base_url TEXT,
  webhook_url TEXT,
  webhook_secret TEXT,
  sync_frequency TEXT NOT NULL DEFAULT 'manual' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
  data_mapping JSONB DEFAULT '{}',
  rate_limit_config JSONB DEFAULT '{}',
  retry_policy JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  last_error_at TIMESTAMPTZ,
  last_error_message TEXT,
  configured_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_integrations_provider ON public.integrations(provider);
CREATE INDEX idx_integrations_status ON public.integrations(connection_status);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage integrations" ON public.integrations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER set_integrations_updated_at BEFORE UPDATE ON public.integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. Integration Logs
CREATE TABLE public.integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN ('api_call', 'webhook_delivery', 'sync_operation', 'auth_failure', 'rate_limit', 'data_mapping_error')),
  operation TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PATCH', 'DELETE', 'WEBHOOK')),
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('success', 'failure', 'pending', 'retry', 'rate_limited')),
  status_code INTEGER,
  response_time INTEGER,
  error_message TEXT,
  error_code TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  records_processed INTEGER NOT NULL DEFAULT 0,
  triggered_by TEXT NOT NULL DEFAULT 'system' CHECK (triggered_by IN ('scheduled_sync', 'manual_trigger', 'webhook', 'admin_action', 'system')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_integration_logs_integration ON public.integration_logs(integration_id, created_at DESC);
CREATE INDEX idx_integration_logs_status ON public.integration_logs(status, created_at DESC);
CREATE INDEX idx_integration_logs_type ON public.integration_logs(log_type);

ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage integration logs" ON public.integration_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Webhook Endpoints
CREATE TABLE public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  delivery_status TEXT NOT NULL DEFAULT 'healthy' CHECK (delivery_status IN ('healthy', 'degraded', 'failing')),
  last_delivery_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  total_deliveries INTEGER NOT NULL DEFAULT 0,
  average_response_time INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_webhook_endpoints_integration ON public.webhook_endpoints(integration_id);
CREATE INDEX idx_webhook_endpoints_status ON public.webhook_endpoints(delivery_status);

ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage webhook endpoints" ON public.webhook_endpoints
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER set_webhook_endpoints_updated_at BEFORE UPDATE ON public.webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
