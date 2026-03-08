import { createClient } from "@/lib/supabase/server";
import { apiResponse, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const supabase = await createClient();

  // Get distinct filter values from meals
  const { data: meals } = await supabase
    .from("meals")
    .select("dietary_tags, allergens, spice_level, base_price")
    .is("deleted_at", null)
    .eq("is_available", true);

  const dietaryTags = new Set<string>();
  const allergens = new Set<string>();
  const spiceLevels = new Set<number>();
  let minPrice = Infinity;
  let maxPrice = 0;

  (meals || []).forEach((meal) => {
    ((meal.dietary_tags as string[]) || []).forEach((tag: string) =>
      dietaryTags.add(tag),
    );
    ((meal.allergens as string[]) || []).forEach((a: string) =>
      allergens.add(a),
    );
    if (meal.spice_level) spiceLevels.add(meal.spice_level);
    if (meal.base_price < minPrice) minPrice = meal.base_price;
    if (meal.base_price > maxPrice) maxPrice = meal.base_price;
  });

  return apiResponse({
    dietaryTags: Array.from(dietaryTags).sort(),
    allergens: Array.from(allergens).sort(),
    spiceLevels: Array.from(spiceLevels).sort(),
    priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
  });
});
