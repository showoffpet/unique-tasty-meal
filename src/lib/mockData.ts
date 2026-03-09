import type { Database } from "@/lib/supabase/database.types";

export type MealRow = Database["public"]["Tables"]["meals"]["Row"];

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Rice Dishes", display_order: 1 },
  { id: "cat-2", name: "Pasta", display_order: 2 },
  { id: "cat-3", name: "Beans", display_order: 3 },
  { id: "cat-4", name: "Soups", display_order: 4 },
  { id: "cat-5", name: "Stews", display_order: 5 },
  { id: "cat-6", name: "Proteins", display_order: 6 },
  { id: "cat-7", name: "Pastries", display_order: 7 },
  { id: "cat-8", name: "Sauces", display_order: 8 },
  { id: "cat-9", name: "Others", display_order: 9 },
];

export const MOCK_MEALS: MealRow[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `meal-${i}`,
  name: `Delicious Meal ${i + 1}`,
  description:
    "A wonderful description of this fantastic dish, full of flavor and made with the freshest ingredients.",
  base_price: 12.99 + (i % 5) * 5,
  image_url: `https://picsum.photos/seed/${i + 100}/800/600`,
  category_id: `cat-${(i % 4) + 1}`,
  is_available: i % 7 !== 0,
  preparation_time: 15 + (i % 3) * 5,
  spice_level: i % 4,
  dietary_tags: i % 3 === 0 ? ["vegetarian", "gluten-free"] : ["dairy-free"],
  add_ons: {
    "Extra Protein": 4.5,
    "Extra Sauce": 1.0,
    "Side Salad": 3.0,
    Plantain: 2.5,
  },
  allergens: i % 4 === 0 ? ["peanuts", "dairy"] : null,
  average_rating: 4.0 + (i % 10) / 10,
  created_at: new Date().toISOString(),
  display_order: i,
  ingredients: ["Rice", "Tomatoes", "Onions", "Spices"],
  nutritional_info: { calories: 450, protein: 25, carbs: 45 },
  portion_options: null,
  total_reviews: 12 + i * 3,
  updated_at: new Date().toISOString(),
}));
