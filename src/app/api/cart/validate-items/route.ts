import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();

  const { data: items } = await supabase
    .from("cart_items")
    .select(
      "id, meal_id, base_price, total_price, meals(id, is_available, base_price)",
    )
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (!items || items.length === 0) {
    return apiResponse({ isValid: true, items: [], subtotal: 0, issues: [] });
  }

  const issues: string[] = [];
  const validatedItems = items.map((item) => {
    const mealsData = item.meals as unknown as { is_available: boolean; base_price: number } | null;
    const isAvailable = mealsData?.is_available ?? false;
    const priceChanged = mealsData
      ? mealsData.base_price !== item.base_price
      : false;

    if (!isAvailable) issues.push(`"${item.meal_id}" is no longer available`);
    if (priceChanged) issues.push(`Price changed for meal ${item.meal_id}`);

    return { ...item, isAvailable, priceChanged };
  });

  const subtotal = validatedItems
    .filter((i) => i.isAvailable)
    .reduce((sum, i) => sum + Number(i.total_price), 0);

  return apiResponse({
    isValid: issues.length === 0,
    items: validatedItems,
    subtotal: Math.round(subtotal * 100) / 100,
    issues,
  });
});
