import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const body = await request.json();
  const { inventoryId, quantity } = body;

  if (!inventoryId || quantity === undefined) {
    return apiError("inventoryId and quantity are required", 400);
  }

  // Get current inventory
  const { data: item } = await supabase
    .from("inventory")
    .select("id, quantity")
    .eq("id", inventoryId)
    .single();

  if (!item) return apiError("Inventory item not found", 404);

  const newQuantity = item.quantity + quantity;
  if (newQuantity < 0)
    return apiError("Cannot reduce quantity below zero", 400);

  const updateData: Record<string, unknown> = { quantity: newQuantity };
  if (quantity > 0) updateData.last_restocked_at = new Date().toISOString();

  const { data: updated, error } = await supabase
    .from("inventory")
    .update(updateData)
    .eq("id", inventoryId)
    .select("*")
    .single();

  if (error) return apiError("Failed to adjust inventory", 500);
  return apiResponse(updated);
});
