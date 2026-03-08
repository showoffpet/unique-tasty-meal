import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const { data: items, error } = await supabase
    .from("inventory")
    .select(
      "id, meal_id, ingredient_name, quantity, unit, reorder_level, meals(id, name)",
    );

  if (error) return apiError("Failed to fetch low stock items", 500);

  // Filter to low stock items where quantity is at or below reorder level
  const lowStock = (items || []).filter(
    (item) => item.quantity <= (item.reorder_level || 0),
  );

  return apiResponse(lowStock);
});
