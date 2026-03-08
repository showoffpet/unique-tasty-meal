import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";
import { parseQuery, mealFiltersSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const filters = parseQuery(mealFiltersSchema, searchParams);
  const supabase = await createClient();

  let query = supabase
    .from("meals")
    .select("*, meal_categories(id, name)", { count: "exact" })
    .is("deleted_at", null);

  // Apply filters
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.isAvailable !== undefined)
    query = query.eq("is_available", filters.isAvailable);
  if (filters.minPrice) query = query.gte("base_price", filters.minPrice);
  if (filters.maxPrice) query = query.lte("base_price", filters.maxPrice);
  if (filters.spiceLevel) query = query.eq("spice_level", filters.spiceLevel);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);
  if (filters.dietaryTags && filters.dietaryTags.length > 0) {
    query = query.overlaps("dietary_tags", filters.dietaryTags);
  }

  // Sorting
  const sortColumn =
    filters.sortBy === "price"
      ? "base_price"
      : filters.sortBy === "rating"
        ? "average_rating"
        : filters.sortBy === "newest"
          ? "created_at"
          : "name";
  query = query.order(sortColumn, { ascending: filters.sortOrder === "asc" });

  // Pagination
  const from = (filters.page - 1) * filters.limit;
  query = query.range(from, from + filters.limit - 1);

  const { data: meals, count, error } = await query;

  if (error) {
    return apiError("Failed to fetch meals", 500);
  }

  return apiResponse({
    meals,
    total: count || 0,
    page: filters.page,
    limit: filters.limit,
    hasMore: (count || 0) > from + filters.limit,
  });
});
