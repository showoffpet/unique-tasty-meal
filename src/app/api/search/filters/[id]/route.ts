import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    const { data: filter, error } = await supabase
      .from("saved_search_filters")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !filter) return apiError("Filter not found", 404);
    return apiResponse(filter);
  },
);

export const DELETE = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    const { error } = await supabase
      .from("saved_search_filters")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) return apiError("Failed to delete filter", 500);
    return apiResponse({ message: "Filter deleted" });
  },
);
