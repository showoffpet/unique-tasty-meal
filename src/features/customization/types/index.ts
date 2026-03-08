// Step 77: Customization Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type MealCustomizationRow =
  Database["public"]["Tables"]["meal_customizations"]["Row"];
export type MealCustomizationInsert =
  Database["public"]["Tables"]["meal_customizations"]["Insert"];
export type MealCustomizationUpdate =
  Database["public"]["Tables"]["meal_customizations"]["Update"];

// ─── Enums ────────────────────────────────────────────────────────
export type PortionSize = "small" | "regular" | "large";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface CustomizationAddOn {
  addOnId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IngredientModification {
  ingredientId: string;
  action: "remove" | "extra";
  quantity?: number;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface MealCustomization extends Omit<
  MealCustomizationRow,
  "add_ons"
> {
  add_ons: CustomizationAddOn[] | null;
}

export interface CustomizedCartData {
  meal_id: string;
  portion_size: string;
  portion_modifier: number;
  spice_level: number;
  add_ons: string[];
  add_ons_total: number;
  special_instructions: string;
  total_price: number;
}

export interface CreateCustomizationData {
  mealId: string;
  name: string;
  portionSize: PortionSize;
  spiceLevel: number;
  addOns?: CustomizationAddOn[];
  removedIngredients?: string[];
  extraIngredients?: string[];
  specialInstructions?: string;
  isFavorite?: boolean;
}
