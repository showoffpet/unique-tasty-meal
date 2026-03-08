import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data: filters, error } = await supabase
    .from("saved_search_filters")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return apiError("Failed to fetch filters", 500);
  return apiResponse(filters);
});
