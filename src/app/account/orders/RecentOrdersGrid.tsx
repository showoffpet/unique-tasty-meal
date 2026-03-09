import React from "react";
import { createClient } from "@/lib/supabase/server";
import { RefreshCw } from "lucide-react";

interface OrderItem {
  id: string;
  menu_items: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

export default async function RecentOrdersGrid({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      id, status, total_amount, created_at,
      order_items (
        id,
        menu_items ( name, image_url )
      )
    `,
    )
    .eq("user_id", userId)
    .in("status", ["completed", "cancelled"])
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#f3f1f1] flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold text-[#161313] mb-1">
          No past orders yet
        </h3>
        <p className="text-sm text-[#806b6b]">
          Your completed orders will appear here.
        </p>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => {
        const firstItem = order.order_items?.[0]?.menu_items as any;
        const itemName =
          firstItem?.name || `Order #${order.id.slice(0, 8).toUpperCase()}`;
        const itemImage = firstItem?.image_url || "/placeholder.jpg";
        const itemsCount = order.order_items?.length || 0;
        const displayName =
          itemsCount > 1 ? `${itemName} + ${itemsCount - 1}` : itemName;

        return (
          <div
            key={order.id}
            className="group bg-white rounded-xl p-4 shadow-sm border border-[#f3f1f1] hover:shadow-md transition-shadow flex flex-col gap-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-16 h-16 rounded-lg bg-cover bg-center shrink-0 border border-[#f3f1f1]"
                style={{ backgroundImage: `url("${itemImage}")` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#161313] truncate">
                    {displayName}
                  </h4>
                  <span className="text-xs text-[#806b6b] whitespace-nowrap ml-2">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[#806b6b] truncate">
                  {order.status === "completed" ? "Delivered" : "Cancelled"}
                </p>
                <p className="text-sm font-medium text-[#161313] mt-1">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
            <form
              action={`/api/orders/reorder`}
              method="POST"
              className="mt-auto"
            >
              <input type="hidden" name="orderId" value={order.id} />
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg border border-[#7b2d2d] text-[#7b2d2d] hover:bg-[#7b2d2d] hover:text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reorder
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
