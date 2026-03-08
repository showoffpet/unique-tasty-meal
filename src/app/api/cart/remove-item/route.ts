import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const DELETE = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const { searchParams } = new URL(request.url);
  const cartItemId = searchParams.get("id");

  if (!cartItemId) return apiError("Cart item ID is required", 400);

  const { error } = await supabase
    .from("cart_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return apiError("Failed to remove item", 500);
  return apiResponse({ message: "Item removed from cart" });
});
