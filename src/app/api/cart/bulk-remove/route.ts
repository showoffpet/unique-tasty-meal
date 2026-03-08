import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { z } from "zod";
import { parseBody } from "@/lib/api/validation";

const bulkRemoveSchema = z.object({
  cartItemIds: z.array(z.string().uuid()).min(1).max(50),
});

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const { cartItemIds } = parseBody(bulkRemoveSchema, body);

  // Verify all items belong to user
  const { data: items } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .in("id", cartItemIds)
    .is("deleted_at", null);

  if (!items || items.length !== cartItemIds.length) {
    return apiError("Some items not found or do not belong to you", 400);
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", cartItemIds)
    .eq("user_id", user.id);

  if (error) return apiError("Failed to remove items", 500);
  return apiResponse({ message: "Items removed", count: cartItemIds.length });
});
