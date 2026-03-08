// Favorites/Saved Items types
export interface FavoriteItem {
  id: string;
  userId: string;
  mealId: string;
  mealName: string;
  mealImageUrl: string | null;
  basePrice: number;
  categoryName: string;
  addedAt: string;
}

export interface ToggleFavoriteResult {
  isFavorite: boolean;
  message: string;
}
