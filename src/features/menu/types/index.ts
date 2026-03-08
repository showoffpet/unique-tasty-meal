// Steps 75-76: Meals, Categories, and Meal Details Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type MealRow = Database["public"]["Tables"]["meals"]["Row"];
export type MealInsert = Database["public"]["Tables"]["meals"]["Insert"];
export type MealUpdate = Database["public"]["Tables"]["meals"]["Update"];

export type MealCategoryRow =
  Database["public"]["Tables"]["meal_categories"]["Row"];
export type MealCategoryInsert =
  Database["public"]["Tables"]["meal_categories"]["Insert"];
export type MealCategoryUpdate =
  Database["public"]["Tables"]["meal_categories"]["Update"];

// ─── Typed JSON Structures ────────────────────────────────────────
export interface PortionOption {
  name: string;
  priceModifier: number;
}

export interface AddOnOption {
  name: string;
  price: number;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  servingSize?: string;
}

// ─── Enums ────────────────────────────────────────────────────────
export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "halal"
  | "kosher"
  | "nut-free"
  | "dairy-free";
export type Allergen =
  | "peanuts"
  | "shellfish"
  | "dairy"
  | "eggs"
  | "soy"
  | "wheat"
  | "sesame"
  | "tree-nuts";
export type SpiceLevel = 1 | 2 | 3 | 4 | 5;

// ─── Extended Types ───────────────────────────────────────────────
export interface Meal extends Omit<
  MealRow,
  "portion_options" | "add_ons" | "nutritional_info"
> {
  portion_options: PortionOption[] | null;
  add_ons: AddOnOption[] | null;
  nutritional_info: NutritionalInfo | null;
  category?: MealCategoryRow;
}

export interface MealCategory extends MealCategoryRow {
  meals?: Meal[];
  mealCount?: number;
}

export interface MealWithReviews extends Meal {
  reviewSummary?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
}

// ─── Filter/Sort Types ────────────────────────────────────────────
export interface MealFilters {
  categoryId?: string;
  dietaryTags?: DietaryTag[];
  allergens?: Allergen[];
  minPrice?: number;
  maxPrice?: number;
  spiceLevel?: SpiceLevel;
  isAvailable?: boolean;
  searchQuery?: string;
  sortBy?: "name" | "price" | "rating" | "newest";
  sortOrder?: "asc" | "desc";
}
