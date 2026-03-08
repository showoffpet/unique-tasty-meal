import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const from = (page - 1) * limit;

  const {
    data: items,
    count,
    error,
  } = await supabase
    .from("inventory")
    .select("*, meals(id, name, image_url)", { count: "exact" })
    .order("ingredient_name", { ascending: true })
    .range(from, from + limit - 1);

  if (error) return apiError("Failed to fetch inventory", 500);
  return apiResponse({ items, total: count || 0, page });
});

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const body = await request.json();
  const {
    mealId,
    ingredientName,
    quantity,
    unit,
    costPerUnit,
    reorderLevel,
    supplier,
  } = body;

  const { data: item, error } = await supabase
    .from("inventory")
    .insert({
      meal_id: mealId,
      ingredient_name: ingredientName,
      quantity,
      unit,
      cost_per_unit: costPerUnit,
      reorder_level: reorderLevel,
      supplier,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to create inventory item", 500);
  return apiResponse(item, 201);
});
