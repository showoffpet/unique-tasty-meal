// Step 78: Cart Types
import type { Database } from "@/lib/supabase/database.types";
import type {
  CustomizationAddOn,
  IngredientModification,
  PortionSize,
} from "@/features/customization/types";

// ─── Database Row Types ───────────────────────────────────────────
export type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];
export type CartItemInsert =
  Database["public"]["Tables"]["cart_items"]["Insert"];
export type CartItemUpdate =
  Database["public"]["Tables"]["cart_items"]["Update"];

// ─── Extended Types ───────────────────────────────────────────────
export interface CartItem extends Omit<
  CartItemRow,
  "add_ons" | "ingredient_modifications"
> {
  add_ons: CustomizationAddOn[] | null;
  ingredient_modifications: IngredientModification[] | null;
}

export interface AddToCartData {
  mealId: string;
  quantity: number;
  portionSize: PortionSize;
  spiceLevel: number;
  addOns?: CustomizationAddOn[];
  specialInstructions?: string;
  ingredientModifications?: IngredientModification[];
  customizationId?: string;
}

export interface UpdateCartItemData {
  quantity?: number;
  portionSize?: PortionSize;
  spiceLevel?: number;
  addOns?: CustomizationAddOn[];
  specialInstructions?: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  estimatedDeliveryFee: number;
  estimatedTotal: number;
}
