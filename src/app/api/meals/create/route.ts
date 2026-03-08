import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, createMealSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();

  // Only admins and restaurant owners can create meals
  if (user.role !== "admin" && user.role !== "restaurant_owner") {
    return apiError("Insufficient permissions", 403);
  }

  const body = await request.json();
  const mealData = parseBody(createMealSchema, body);

  // Verify category exists
  const { data: category } = await supabase
    .from("meal_categories")
    .select("id")
    .eq("id", mealData.categoryId)
    .single();

  if (!category) {
    return apiError("Category not found", 404);
  }

  const { data: meal, error } = await supabase
    .from("meals")
    .insert({
      name: mealData.name,
      description: mealData.description,
      category_id: mealData.categoryId,
      base_price: mealData.basePrice,
      preparation_time: mealData.preparationTime,
      spice_level: mealData.spiceLevel || 0,
      dietary_tags: mealData.dietaryTags || [],
      allergens: mealData.allergens || [],
      ingredients: mealData.ingredients || [],
      portion_options: mealData.portionOptions || [],
      add_ons: mealData.addOns || [],
      nutritional_info: mealData.nutritionalInfo || {},
      image_url: mealData.imageUrl,
      is_available: mealData.isAvailable,
    })
    .select("*")
    .single();

  if (error) {
    return apiError("Failed to create meal", 500);
  }

  return apiResponse(meal, 201);
});
