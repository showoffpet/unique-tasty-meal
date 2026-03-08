import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    // Get original order
    const { data: order } = await supabase
      .from("orders")
      .select(
        "items, delivery_address_id, delivery_address, delivery_fee, payment_method",
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!order) return apiError("Order not found", 404);

    // Verify items are still available and get current prices
    const items = order.items as Array<{
      mealId: string;
      mealName: string;
      quantity: number;
      portionSize: string;
      spiceLevel: number;
      addOns: Array<{ name: string; price: number }>;
      specialInstructions?: string;
    }>;
    const cartItems = [];

    for (const item of items) {
      const { data: meal } = await supabase
        .from("meals")
        .select("id, name, base_price, is_available, image_url")
        .eq("id", item.mealId)
        .single();

      if (meal && meal.is_available) {
        cartItems.push({
          user_id: user.id,
          meal_id: meal.id,
          quantity: item.quantity,
          portion_size: item.portionSize,
          spice_level: item.spiceLevel,
          add_ons: item.addOns,
          special_instructions: item.specialInstructions,
          base_price: meal.base_price,
          portion_modifier: 1,
          add_ons_total: item.addOns.reduce((s, a) => s + a.price, 0),
          item_price:
            meal.base_price + item.addOns.reduce((s, a) => s + a.price, 0),
          total_price:
            (meal.base_price + item.addOns.reduce((s, a) => s + a.price, 0)) *
            item.quantity,
          meal_name: meal.name,
          meal_image_url: meal.image_url,
        });
      }
    }

    if (cartItems.length === 0)
      return apiError("No items from this order are currently available", 400);

    // Add to cart
    const { error } = await supabase.from("cart_items").insert(cartItems);
    if (error) return apiError("Failed to add items to cart", 500);

    return apiResponse({
      message: "Items added to cart",
      itemsAdded: cartItems.length,
    });
  },
);
