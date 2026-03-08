import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, updateOrderStatusSchema } from "@/lib/api/validation";

export const GET = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner")
    return apiError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");
  const from = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*, users(id, name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) query = query.eq("order_status", status);
  query = query.range(from, from + limit - 1);

  const { data: orders, count, error } = await query;
  if (error) return apiError("Failed to fetch orders", 500);

  return apiResponse({
    orders,
    total: count || 0,
    page,
    hasMore: (count || 0) > from + limit,
  });
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner")
    return apiError("Forbidden", 403);

  const body = await request.json();
  const { orderId, ...statusData } = body;
  if (!orderId) return apiError("Order ID is required", 400);

  const data = parseBody(updateOrderStatusSchema, statusData);

  const updateData: Record<string, unknown> = { order_status: data.status };
  if (data.status === "confirmed")
    updateData.confirmed_at = new Date().toISOString();
  if (data.status === "delivered")
    updateData.delivered_at = new Date().toISOString();
  if (data.status === "cancelled") {
    updateData.cancelled_at = new Date().toISOString();
    updateData.cancellation_reason = data.notes;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) return apiError("Failed to update order", 500);

  // Record status change
  await supabase.from("order_status_history").insert({
    order_id: orderId,
    status: data.status,
    notes: data.notes,
    changed_by: user.id,
  });

  return apiResponse(order);
});
