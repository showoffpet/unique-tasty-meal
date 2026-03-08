import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, saveFilterSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const data = parseBody(saveFilterSchema, body);

  const { data: filter, error } = await supabase
    .from("saved_search_filters")
    .insert({
      user_id: user.id,
      name: data.name,
      filters: data.filters,
      is_default: data.isDefault,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to save filter", 500);

  // If this filter is default, unset other defaults
  if (data.isDefault && filter) {
    await supabase
      .from("saved_search_filters")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", filter.id);
  }

  return apiResponse(filter, 201);
});
