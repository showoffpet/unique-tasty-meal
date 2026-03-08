import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const body = await request.json();
  const {
    provider,
    providerName,
    apiKey,
    apiSecret,
    baseUrl,
    webhookUrl,
    webhookSecret,
    syncFrequency,
    dataMapping,
    rateLimitConfig,
    retryPolicy,
    metadata,
  } = body;

  if (!provider || !providerName || !apiKey || !syncFrequency) {
    return apiError(
      "provider, providerName, apiKey, and syncFrequency are required",
      400,
    );
  }

  const { data: integration, error } = await supabase
    .from("integrations")
    .insert({
      provider,
      provider_name: providerName,
      api_key: apiKey,
      api_secret: apiSecret,
      base_url: baseUrl,
      webhook_url: webhookUrl,
      webhook_secret: webhookSecret,
      sync_frequency: syncFrequency,
      data_mapping: dataMapping || {},
      rate_limit_config: rateLimitConfig || {},
      retry_policy: retryPolicy || {},
      metadata: metadata || {},
      configured_by: user.id,
      is_enabled: true,
      connection_status: "pending_auth",
    })
    .select(
      "id, provider, provider_name, is_enabled, connection_status, sync_frequency, created_at",
    )
    .single();

  if (error) return apiError("Failed to configure integration", 500);
  return apiResponse(integration, 201);
});

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const {
    data: integrations,
    count,
    error,
  } = await supabase
    .from("integrations")
    .select(
      "id, provider, provider_name, is_enabled, connection_status, sync_frequency, last_sync_at, last_error_at, last_error_message, created_at, updated_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (error) return apiError("Failed to fetch integrations", 500);
  return apiResponse({ integrations, total: count || 0 });
});
