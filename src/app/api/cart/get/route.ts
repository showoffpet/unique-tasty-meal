import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data: items, error } = await supabase
    .from("cart_items")
    .select("*, meals(id, name, image_url, is_available, base_price)")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("added_at", { ascending: false });

  if (error) return apiError("Failed to fetch cart", 500);

  // Mark unavailable items and calculate subtotal
  const cartItems = (items || []).map((item) => {
    const meal = item.meals as { is_available: boolean } | null;
    return { ...item, isUnavailable: meal ? !meal.is_available : true };
  });

  const subtotal = cartItems
    .filter((i) => !i.isUnavailable)
    .reduce((sum, i) => sum + Number(i.total_price), 0);

  return apiResponse({
    items: cartItems,
    itemCount: cartItems.length,
    subtotal: Math.round(subtotal * 100) / 100,
  });
});
