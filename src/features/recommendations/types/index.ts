// Recommendations types
import type { Meal } from "@/features/menu/types";

export interface RecommendedMeal extends Meal {
  score: number;
  reason: string;
}

export interface RecommendationFilters {
  limit?: number;
  excludeMealIds?: string[];
  dietaryTags?: string[];
  maxPrice?: number;
}
