import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const { data: alerts, error } = await supabase
    .from("security_events")
    .select("*")
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return apiError("Failed to fetch alerts", 500);
  return apiResponse(alerts);
});
