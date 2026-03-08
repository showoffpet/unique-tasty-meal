import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const DELETE = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data, error } = await supabase
    .from("cart_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id");

  if (error) return apiError("Failed to clear cart", 500);
  return apiResponse({
    message: "Cart cleared",
    itemsRemoved: data?.length || 0,
  });
});
