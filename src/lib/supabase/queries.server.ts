import { createClient } from "./server";
import type { Database } from "./database.types";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];
type CategoryRow = Database["public"]["Tables"]["meal_categories"]["Row"];

// ============================================
// Server-only query functions
// These use the server Supabase client (next/headers)
// and must only be imported from Server Components.
// ============================================

export async function getCategoriesServer() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;
  return data as CategoryRow[];
}

export async function getMealByIdServer(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as MealRow;
}

export async function getSimilarMealsServer(
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  const supabase = await createClient();

  // First try same category
  const { data: sameCat } = await supabase
    .from("meals")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .eq("is_available", true)
    .limit(limit);

  if (sameCat && sameCat.length > 0) return sameCat as MealRow[];

  // Fallback to any other meals
  const { data: fallback } = await supabase
    .from("meals")
    .select("*")
    .neq("id", excludeId)
    .eq("is_available", true)
    .limit(limit);

  return (fallback ?? []) as MealRow[];
}

export async function getMealsServer(options?: {
  categoryId?: string;
  availableOnly?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase.from("meals").select("*");

  if (options?.availableOnly !== false) {
    query = query.eq("is_available", true);
  }
  if (options?.categoryId) {
    query = query.eq("category_id", options.categoryId);
  }

  const { data, error } = await query.order("display_order");
  if (error) throw error;
  return data as MealRow[];
}
