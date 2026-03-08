// Search Types (related to Steps 76, 99)
import type { Database } from "@/lib/supabase/database.types";

// ─── Database Row Types ───────────────────────────────────────────
export type SearchHistoryRow =
  Database["public"]["Tables"]["search_history"]["Row"];
export type SavedSearchFilterRow =
  Database["public"]["Tables"]["saved_search_filters"]["Row"];
export type SavedSearchFilterInsert =
  Database["public"]["Tables"]["saved_search_filters"]["Insert"];
export type SavedSearchFilterUpdate =
  Database["public"]["Tables"]["saved_search_filters"]["Update"];

export type MealNotificationRow =
  Database["public"]["Tables"]["meal_notifications"]["Row"];
export type MealNotificationInsert =
  Database["public"]["Tables"]["meal_notifications"]["Insert"];

// ─── Enums ────────────────────────────────────────────────────────
export type MealNotificationStatus = "pending" | "notified" | "cancelled";

// ─── Typed JSON Structures ────────────────────────────────────────
export interface SearchFilters {
  query?: string;
  categoryId?: string;
  dietaryTags?: string[];
  allergens?: string[];
  priceRange?: { min: number; max: number };
  spiceLevel?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "newest";
  isAvailable?: boolean;
}

// ─── Extended Types ───────────────────────────────────────────────
export interface SavedSearchFilter extends Omit<
  SavedSearchFilterRow,
  "filters"
> {
  filters: SearchFilters;
}

export interface SearchResult {
  meals: Array<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string | null;
    averageRating: number | null;
    categoryName: string;
  }>;
  totalCount: number;
  hasMore: boolean;
}
