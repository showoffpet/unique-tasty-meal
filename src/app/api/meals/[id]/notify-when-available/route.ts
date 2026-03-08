import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const POST = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("meal_notifications")
      .select("id")
      .eq("meal_id", id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single();

    if (existing) {
      return apiResponse({
        message: "Already subscribed to notifications for this meal",
        alreadySubscribed: true,
      });
    }

    const { error } = await supabase
      .from("meal_notifications")
      .insert({ meal_id: id, user_id: user.id });

    if (error) {
      return apiError("Failed to subscribe to notifications", 500);
    }

    return apiResponse(
      { message: "You will be notified when this meal becomes available" },
      201,
    );
  },
);
