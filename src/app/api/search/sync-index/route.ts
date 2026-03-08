import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async () => {
  const { user } = await requireAuth();

  if (user.role !== "admin") {
    return apiError("Admin access required", 403);
  }

  // In a full implementation, this would trigger a search index rebuild.
  // For now, return success as meals are queried directly from Supabase.
  return apiResponse({
    message: "Search index sync triggered",
    status: "completed",
  });
});
