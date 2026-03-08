import {
  requireAuth,
  apiResponse,
  apiError,
  checkRateLimit,
  rateLimitError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, applyPromoSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  if (!checkRateLimit(`promo:${user.id}`, 10, 60 * 60 * 1000))
    return rateLimitError();

  const body = await request.json();
  const { code } = parseBody(applyPromoSchema, body);

  // Get promo code
  const { data: promo } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code)
    .eq("status", "active")
    .single();

  if (!promo) return apiError("Invalid promo code", 400);

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return apiError("Promo code has expired", 400);
  }

  // Check max usages
  if (promo.usage_count >= promo.max_usages) {
    return apiError("Promo code has reached its usage limit", 400);
  }

  // Check per-user limit
  if (promo.usage_per_user_limit) {
    const { count } = await supabase
      .from("user_promo_usage")
      .select("id", { count: "exact" })
      .eq("promo_code_id", promo.id)
      .eq("user_id", user.id);

    if ((count || 0) >= promo.usage_per_user_limit) {
      return apiError(
        "You have already used this promo code the maximum number of times",
        400,
      );
    }
  }

  // Check new user requirement
  if (promo.requires_new_user) {
    const { count: orderCount } = await supabase
      .from("orders")
      .select("id", { count: "exact" })
      .eq("user_id", user.id);

    if ((orderCount || 0) > 0) {
      return apiError("This promo code is for new customers only", 400);
    }
  }

  // Get cart subtotal for discount calculation
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("total_price")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  const subtotal = (cartItems || []).reduce(
    (s, i) => s + Number(i.total_price),
    0,
  );

  // Check minimum order
  if (promo.minimum_order_amount && subtotal < promo.minimum_order_amount) {
    return apiError(
      `Minimum order of $${promo.minimum_order_amount} required`,
      400,
    );
  }

  // Calculate discount
  let discountAmount = 0;
  if (promo.discount_type === "percentage") {
    discountAmount = subtotal * (promo.discount_value / 100);
    if (promo.max_discount_cap)
      discountAmount = Math.min(discountAmount, promo.max_discount_cap);
  } else {
    discountAmount = promo.discount_value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return apiResponse({
    valid: true,
    promoCodeId: promo.id,
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discountAmount: Math.round(discountAmount * 100) / 100,
    newTotal: Math.round((subtotal - discountAmount) * 100) / 100,
  });
});
