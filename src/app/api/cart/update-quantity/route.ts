import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, updateCartQuantitySchema } from "@/lib/api/validation";

export const PATCH = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const { cartItemId, quantity } = parseBody(updateCartQuantitySchema, body);

  // Verify ownership
  const { data: item } = await supabase
    .from("cart_items")
    .select("id, item_price, user_id")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!item) return apiError("Cart item not found", 404);

  const totalPrice = item.item_price * quantity;

  const { data: updated, error } = await supabase
    .from("cart_items")
    .update({ quantity, total_price: totalPrice })
    .eq("id", cartItemId)
    .select("*")
    .single();

  if (error) return apiError("Failed to update quantity", 500);
  return apiResponse(updated);
});
