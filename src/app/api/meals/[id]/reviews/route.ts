import { createClient } from "@/lib/supabase/server";
import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, createReviewSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const {
      data: reviews,
      count,
      error,
    } = await supabase
      .from("reviews")
      .select(
        "id, user_id, rating, title, comment, photo_urls, is_verified_purchase, created_at",
        { count: "exact" },
      )
      .eq("meal_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      return apiError("Failed to fetch reviews", 500);
    }

    return apiResponse({
      reviews,
      total: count || 0,
      page,
      hasMore: (count || 0) > from + limit,
    });
  },
);

export const POST = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    const body = await request.json();
    const reviewData = parseBody(createReviewSchema, body);

    // Check if user already reviewed this meal
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("meal_id", id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return apiError("You have already reviewed this meal", 409);
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        meal_id: id,
        user_id: user.id,
        order_id: reviewData.orderId,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        photo_urls: reviewData.photoUrls || [],
        is_verified_purchase: !!reviewData.orderId,
      })
      .select("*")
      .single();

    if (error) {
      return apiError("Failed to create review", 500);
    }

    // Update meal average rating
    const { data: stats } = await supabase
      .from("reviews")
      .select("rating")
      .eq("meal_id", id)
      .eq("status", "approved");

    if (stats && stats.length > 0) {
      const avg = stats.reduce((sum, r) => sum + r.rating, 0) / stats.length;
      await supabase
        .from("meals")
        .update({
          average_rating: Math.round(avg * 10) / 10,
          total_reviews: stats.length,
        })
        .eq("id", id);
    }

    return apiResponse(review, 201);
  },
);
