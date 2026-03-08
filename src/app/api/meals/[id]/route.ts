import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, withErrorHandler } from "@/lib/api/helpers";

export const GET = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const supabase = await createClient();

    const { data: meal, error } = await supabase
      .from("meals")
      .select(
        `
      *,
      meal_categories(id, name, description),
      reviews(id, rating, title, comment, created_at, user_id),
      meal_customizations(id, name, portion_size, spice_level, is_favorite)
    `,
      )
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !meal) {
      return apiError("Meal not found", 404);
    }

    // Calculate review summary
    const reviews = (meal.reviews as Array<{ rating: number }>) || [];
    const reviewSummary = {
      averageRating: meal.average_rating,
      totalReviews: meal.total_reviews,
      ratingDistribution: reviews.reduce((acc: Record<number, number>, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1;
        return acc;
      }, {}),
    };

    return apiResponse({ ...meal, reviewSummary });
  },
);
