import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, createCustomizationSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("meal_customizations")
    .select("*, meals(id, name, image_url)")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return apiError("Failed to fetch customizations", 500);
  return apiResponse(data);
});

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const data = parseBody(createCustomizationSchema, body);

  // Verify meal exists
  const { data: meal } = await supabase
    .from("meals")
    .select("id")
    .eq("id", data.mealId)
    .single();
  if (!meal) return apiError("Meal not found", 404);

  const { data: customization, error } = await supabase
    .from("meal_customizations")
    .insert({
      user_id: user.id,
      meal_id: data.mealId,
      name: data.name,
      portion_size: data.portionSize,
      spice_level: data.spiceLevel,
      add_ons: data.addOns || [],
      removed_ingredients: data.removedIngredients || [],
      extra_ingredients: data.extraIngredients || [],
      special_instructions: data.specialInstructions,
      is_favorite: data.isFavorite,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to create customization", 500);
  return apiResponse(customization, 201);
});
