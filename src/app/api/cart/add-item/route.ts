import {
  requireAuth,
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, addToCartSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();

  if (!checkRateLimit(`cart-add:${user.id}`, 50, 60 * 60 * 1000))
    return rateLimitError();

  const body = await request.json();
  const data = parseBody(addToCartSchema, body);

  // Verify meal exists and is available
  const { data: meal } = await supabase
    .from("meals")
    .select(
      "id, name, image_url, base_price, is_available, portion_options, add_ons",
    )
    .eq("id", data.mealId)
    .single();

  if (!meal) return apiError("Meal not found", 404);
  if (!meal.is_available) return apiError("Meal is currently unavailable", 400);

  // Calculate prices
  const portionOptions =
    (meal.portion_options as Array<{ name: string; priceModifier: number }>) ||
    [];
  const portion = portionOptions.find((p) => p.name === data.portionSize);
  const portionModifier = portion?.priceModifier || 1;
  const basePrice = meal.base_price;

  let addOnsTotal = 0;
  if (data.addOns) {
    for (const addOn of data.addOns) {
      addOnsTotal += addOn.price * (addOn.quantity || 1);
    }
  }

  const itemPrice = basePrice * portionModifier + addOnsTotal;
  const totalPrice = itemPrice * data.quantity;

  const { data: cartItem, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: user.id,
      meal_id: data.mealId,
      quantity: data.quantity,
      portion_size: data.portionSize,
      spice_level: data.spiceLevel,
      add_ons: data.addOns || [],
      special_instructions: data.specialInstructions,
      customization_id: data.customizationId,
      base_price: basePrice,
      portion_modifier: portionModifier,
      add_ons_total: addOnsTotal,
      item_price: itemPrice,
      total_price: totalPrice,
      meal_name: meal.name,
      meal_image_url: meal.image_url,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to add item to cart", 500);
  return apiResponse(cartItem, 201);
});
