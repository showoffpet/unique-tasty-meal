// Step 90: Inventory Types
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type InventoryRow = Database["public"]["Tables"]["inventory"]["Row"];
export type InventoryInsert =
  Database["public"]["Tables"]["inventory"]["Insert"];
export type InventoryUpdate =
  Database["public"]["Tables"]["inventory"]["Update"];

// ─── Component-level Types ────────────────────────────────────────
export interface InventoryItemRow {
  id: string;
  item_name: string;
  current_stock: number;
  reorder_level?: number | null;
  unit: string;
  updated_at: string;
}

export interface AdjustmentData {
  adjustment: number;
  reason: string;
  notes: string;
}

export interface ReorderData {
  reorder_level: number;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface InventoryItem extends InventoryRow {
  mealName?: string;
}

export interface RestockData {
  inventoryId: string;
  quantity: number;
  costPerUnit?: number;
  supplier?: string;
}

export interface LowStockAlert {
  inventoryId: string;
  ingredientName: string;
  currentQuantity: number;
  reorderLevel: number;
  mealId: string;
  mealName: string;
}

export interface InventoryFilters {
  mealId?: string;
  isLowStock?: boolean;
  supplier?: string;
  sortBy?:
    | "ingredient_name"
    | "quantity"
    | "cost_per_unit"
    | "last_restocked_at";
  sortOrder?: "asc" | "desc";
}
