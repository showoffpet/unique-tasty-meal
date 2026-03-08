import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async () => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin" && user.role !== "restaurant_owner") {
    return apiError("Insufficient permissions", 403);
  }

  // Fetch dashboard stats in parallel
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersResult, revenueResult, customersResult, todayOrdersResult] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact" }),
      supabase.from("orders").select("total").eq("payment_status", "completed"),
      supabase
        .from("users")
        .select("id", { count: "exact" })
        .eq("role", "customer"),
      supabase
        .from("orders")
        .select("id, total", { count: "exact" })
        .gte("created_at", today.toISOString()),
    ]);

  const totalOrders = ordersResult.count || 0;
  const totalRevenue = (revenueResult.data || []).reduce(
    (s, o) => s + Number(o.total),
    0,
  );
  const totalCustomers = customersResult.count || 0;
  const todayOrders = todayOrdersResult.count || 0;
  const todayRevenue = (todayOrdersResult.data || []).reduce(
    (s, o) => s + Number(o.total),
    0,
  );

  const pendingResult = await supabase
    .from("orders")
    .select("id", { count: "exact" })
    .eq("order_status", "pending");

  return apiResponse({
    totalOrders,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCustomers,
    averageOrderValue:
      totalOrders > 0
        ? Math.round((totalRevenue / totalOrders) * 100) / 100
        : 0,
    pendingOrders: pendingResult.count || 0,
    todayOrders,
    todayRevenue: Math.round(todayRevenue * 100) / 100,
  });
});
