import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");
  const from = (page - 1) * limit;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
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
