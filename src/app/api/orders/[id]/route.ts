import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { user, supabase } = await requireAuth();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "*, order_status_history(id, status, notes, created_at, changed_by)",
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !order) return apiError("Order not found", 404);
    return apiResponse(order);
  },
);
