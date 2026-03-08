import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const supabase = await createClient();

    // Get the current meal to find similar ones
    const { data: meal } = await supabase
      .from("meals")
      .select("category_id, dietary_tags, spice_level, base_price")
      .eq("id", id)
      .single();

    if (!meal) {
      return apiError("Meal not found", 404);
    }

    // Find meals in same category or with overlapping dietary tags, excluding current meal
    const { data: similar } = await supabase
      .from("meals")
      .select(
        "id, name, description, base_price, image_url, average_rating, dietary_tags",
      )
      .neq("id", id)
      .eq("is_available", true)
      .is("deleted_at", null)
      .eq("category_id", meal.category_id)
      .order("average_rating", { ascending: false, nullsFirst: false })
      .limit(6);

    return apiResponse(similar || []);
  },
);
