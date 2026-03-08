import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";

export const GET = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (user.role !== "admin") return apiError("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const from = (page - 1) * limit;

  let query = supabase
    .from("users")
    .select(
      "id, name, email, role, phone, loyalty_points, created_at, last_login_at",
      { count: "exact" },
    )
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (search)
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  query = query.range(from, from + limit - 1);

  const { data: customers, count, error } = await query;
  if (error) return apiError("Failed to fetch customers", 500);
  return apiResponse({
    customers,
    total: count || 0,
    page,
    hasMore: (count || 0) > from + limit,
  });
});
