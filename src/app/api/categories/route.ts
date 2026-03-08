import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("meal_categories")
    .select("id, name, description, display_order, is_active")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("display_order", { ascending: true });

  if (error) {
    return apiError("Failed to fetch categories", 500);
  }

  return apiResponse(categories);
});
