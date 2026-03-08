import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ shareToken: string }> },
  ) => {
    const { shareToken } = await params;
    const supabase = await createClient();

    const { data: filter, error } = await supabase
      .from("saved_search_filters")
      .select("id, name, filters, share_token")
      .eq("share_token", shareToken)
      .single();

    if (error || !filter) return apiError("Shared filter not found", 404);
    return apiResponse(filter);
  },
);
