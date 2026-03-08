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

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!order) return apiError("Order not found", 404);

    return apiResponse({
      receiptId: `UTM-${order.id.slice(0, 8).toUpperCase()}`,
      orderId: order.id,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      taxAmount: order.tax_amount,
      discountAmount: order.discount_amount,
      promoCode: order.promo_code,
      total: order.total,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      deliveryAddress: order.delivery_address,
      orderDate: order.created_at,
      status: order.order_status,
    });
  },
);
