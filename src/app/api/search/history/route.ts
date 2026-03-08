import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data: history, error } = await supabase
    .from("search_history")
    .select("id, query, results_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return apiError("Failed to fetch search history", 500);
  return apiResponse(history);
});

export const DELETE = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { error } = await supabase
    .from("search_history")
    .delete()
    .eq("user_id", user.id);

  if (error) return apiError("Failed to clear search history", 500);
  return apiResponse({ message: "Search history cleared" });
});
