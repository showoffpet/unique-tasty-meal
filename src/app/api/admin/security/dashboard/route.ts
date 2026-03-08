import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const [eventsResult, criticalResult, recentResult] = await Promise.all([
    supabase
      .from("security_events")
      .select("event_type, severity", { count: "exact" }),
    supabase
      .from("security_events")
      .select("id", { count: "exact" })
      .eq("severity", "critical")
      .eq("resolved", false),
    supabase
      .from("security_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const byType: Record<string, number> = {};
  const bySeverity: Record<string, number> = {
    info: 0,
    warning: 0,
    critical: 0,
  };
  (eventsResult.data || []).forEach((e) => {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
    bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
  });

  return apiResponse({
    totalEvents: eventsResult.count || 0,
    criticalUnresolved: criticalResult.count || 0,
    recentEvents: recentResult.data || [],
    eventsByType: byType,
    eventsBySeverity: bySeverity,
  });
});
