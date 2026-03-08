import {
  requireAuth,
  apiResponse,
  apiError,
  withErrorHandler,
} from "@/lib/api/helpers";
import { parseBody, createOrderSchema } from "@/lib/api/validation";

export const POST = withErrorHandler(async (request: Request) => {
  const { user, supabase } = await requireAuth();
  const body = await request.json();
  const data = parseBody(createOrderSchema, body);

  // Create order
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      items: data.items,
      subtotal: data.subtotal,
      delivery_address_id: data.deliveryAddressId,
      delivery_address: data.deliveryAddress,
      delivery_fee: data.deliveryFee,
      tax_amount: data.taxAmount,
      total: data.total,
      payment_method: data.paymentMethod,
      payment_status: "pending",
      order_status: "pending",
      promo_code_id: data.promoCodeId,
      promo_code: data.promoCode,
      discount_amount: data.discountAmount || 0,
    })
    .select("*")
    .single();

  if (error) return apiError("Failed to create order", 500);

  // Record initial status
  await supabase.from("order_status_history").insert({
    order_id: order.id,
    status: "pending",
    changed_by: user.id,
  });

  // Clear cart items
  await supabase
    .from("cart_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  // Record promo usage if applicable
  if (data.promoCodeId) {
    await supabase.from("user_promo_usage").insert({
      user_id: user.id,
      promo_code_id: data.promoCodeId,
      order_id: order.id,
      discount_applied: data.discountAmount || 0,
    });

    // Increment promo usage count using raw SQL increment
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("usage_count")
      .eq("id", data.promoCodeId)
      .single();

    if (promo) {
      await supabase
        .from("promo_codes")
        .update({ usage_count: (promo.usage_count || 0) + 1 })
        .eq("id", data.promoCodeId);
    }
  }

  return apiResponse(order, 201);
});
