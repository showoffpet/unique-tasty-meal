import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, updateMealSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner")
    return apiError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const from = (page - 1) * limit;

  const {
    data: meals,
    count,
    error,
  } = await supabase
    .from("meals")
    .select("*, meal_categories(id, name)", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return apiError("Failed to fetch meals", 500);
  return apiResponse({
    meals,
    total: count || 0,
    page,
    hasMore: (count || 0) > from + limit,
  });
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner")
    return apiError("Forbidden", 403);

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return apiError("Meal ID is required", 400);

  const data = parseBody(updateMealSchema, updates);
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
  if (data.basePrice !== undefined) updateData.base_price = data.basePrice;
  if (data.preparationTime !== undefined)
    updateData.preparation_time = data.preparationTime;
  if (data.spiceLevel !== undefined) updateData.spice_level = data.spiceLevel;
  if (data.dietaryTags !== undefined)
    updateData.dietary_tags = data.dietaryTags;
  if (data.allergens !== undefined) updateData.allergens = data.allergens;
  if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
  if (data.portionOptions !== undefined)
    updateData.portion_options = data.portionOptions;
  if (data.addOns !== undefined) updateData.add_ons = data.addOns;
  if (data.nutritionalInfo !== undefined)
    updateData.nutritional_info = data.nutritionalInfo;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.isAvailable !== undefined)
    updateData.is_available = data.isAvailable;

  const { data: meal, error } = await supabase
    .from("meals")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return apiError("Failed to update meal", 500);
  return apiResponse(meal);
});

export const DELETE = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner")
    return apiError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Meal ID is required", 400);

  const { error } = await supabase
    .from("meals")
    .update({ deleted_at: new Date().toISOString(), is_available: false })
    .eq("id", id);

  if (error) return apiError("Failed to delete meal", 500);
  return apiResponse({ message: "Meal deleted" });
});
