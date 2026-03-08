import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const POST = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();
    const { portionSize, spiceLevel, addOns = [] } = body;
    const supabase = await createClient();

    // Fetch the meal to validate against
    const { data: meal } = await supabase
      .from("meals")
      .select("base_price, portion_options, add_ons, is_available")
      .eq("id", id)
      .single();

    if (!meal) {
      return apiError("Meal not found", 404);
    }

    if (!meal.is_available) {
      return apiResponse({
        valid: false,
        message: "This meal is currently unavailable",
      });
    }

    // Calculate price
    let price = meal.base_price;
    const portionOptions =
      (meal.portion_options as Array<{
        name: string;
        priceModifier: number;
      }>) || [];
    const mealAddOns =
      (meal.add_ons as Array<{ name: string; price: number }>) || [];

    // Apply portion modifier
    const portion = portionOptions.find((p) => p.name === portionSize);
    const portionModifier = portion ? portion.priceModifier : 1;
    price *= portionModifier;

    // Apply add-ons
    let addOnsTotal = 0;
    for (const addOn of addOns) {
      const available = mealAddOns.find((a) => a.name === addOn.name);
      if (!available) {
        return apiResponse({
          valid: false,
          message: `Add-on "${addOn.name}" is not available for this meal`,
        });
      }
      addOnsTotal += available.price * (addOn.quantity || 1);
    }

    return apiResponse({
      valid: true,
      basePrice: meal.base_price,
      portionModifier,
      addOnsTotal,
      totalPrice: price + addOnsTotal,
    });
  },
);
