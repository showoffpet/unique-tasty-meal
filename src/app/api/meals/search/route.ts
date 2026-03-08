import { createClient } from "@/lib/supabase/server";
import {
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseQuery, searchSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(async (request: Request) => {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(`search:${ip}`, 60, 60 * 1000)) {
    return rateLimitError();
  }

  const { searchParams } = new URL(request.url);
  const { query, page, limit } = parseQuery(searchSchema, searchParams);

  const supabase = await createClient();

  // Search meals by name and description using ILIKE
  const from = (page - 1) * limit;
  const {
    data: meals,
    count,
    error,
  } = await supabase
    .from("meals")
    .select(
      "id, name, description, base_price, image_url, average_rating, is_available, meal_categories(id, name)",
      { count: "exact" },
    )
    .is("deleted_at", null)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("average_rating", { ascending: false, nullsFirst: false })
    .range(from, from + limit - 1);

  if (error) {
    return apiError("Search failed", 500);
  }

  // Log search history for authenticated users
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("search_history").insert({
      user_id: user.id,
      query,
      results_count: count || 0,
    });
  }

  return apiResponse({
    meals,
    totalCount: count || 0,
    page,
    hasMore: (count || 0) > from + limit,
  });
});
