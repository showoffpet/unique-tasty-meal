"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useOrderRealtimeSubscription } from "@/hooks/useOrderRealtime";

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

export default function ActiveOrderTracker({ userId }: { userId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial active order
  useEffect(() => {
    async function fetchActiveOrder() {
      const supabase = createClient();
      const { data, error } = await supabase
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
        .in("status", ["pending", "confirmed", "preparing", "ready"])
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setOrder(data as any as Order);
      }
      setIsLoading(false);
    }
    fetchActiveOrder();
  }, [userId]);

  // Handle realtime updates
  useOrderRealtimeSubscription(order?.id || null, (payload) => {
    console.log("Order updated:", payload);
    // If the payload has the new record, update the status
    const updatedRecord = payload.new as Partial<Order>;
    if (updatedRecord && updatedRecord.status) {
      setOrder((prev) => {
        if (!prev) return prev;
        return { ...prev, status: updatedRecord.status as string };
      });
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3f1f1] animate-pulse">
        <div className="h-20 bg-gray-100 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#f3f1f1] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#f8f6f6] flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-[#806b6b]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#161313] mb-1">
          No active orders right now
        </h3>
        <p className="text-sm text-[#806b6b] mb-4">
          When you place an order, you'll be able to track its progress here.
        </p>
        <a
          href="/menu"
          className="px-6 py-2 bg-[#161313] text-white text-sm font-bold rounded-lg hover:bg-[#2d2424] transition-colors"
        >
          Browse Menu
        </a>
      </div>
    );
  }

  const itemsCount = order.order_items?.length || 0;
  // Get first item image or default
  const firstItemImage =
    order.order_items?.[0]?.menu_items?.image_url || "/placeholder.jpg";
  const firstItemName =
    order.order_items?.[0]?.menu_items?.name || "Order Items";

  const statusConfig: Record<
    string,
    { label: string; icon: string; progress: string }
  > = {
    pending: {
      label: "Order Received",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      progress: "w-[15%]",
    },
    confirmed: {
      label: "Confirmed",
      icon: "M5 13l4 4L19 7",
      progress: "w-[30%]",
    },
    preparing: {
      label: "Chef is cooking",
      icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z",
      progress: "w-[60%]",
    },
    ready: {
      label: "Ready for Pickup",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10",
      progress: "w-[90%]",
    },
  };

  const currentStatus = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f3f1f1] flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
          Live Update
        </span>
      </div>

      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pr-24">
        <div className="flex gap-4 items-center">
          <div
            className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0 border border-[#f3f1f1]"
            style={{ backgroundImage: `url("${firstItemImage}")` }}
          />
          <div>
            <h3 className="text-lg font-bold text-[#161313]">
              {firstItemName}
              {itemsCount > 1 && ` + ${itemsCount - 1} more`}
            </h3>
            <p className="text-[#806b6b] text-sm mt-1">
              Order #{order.id.slice(0, 8).toUpperCase()} • {itemsCount} Items
            </p>
            <p className="text-[#7b2d2d] text-sm font-bold mt-1">
              {currentStatus.label}
            </p>
          </div>
        </div>
        <a
          href={`/account/orders/${order.id}`}
          className="self-start px-4 py-2 bg-[#f8f6f6] text-[#161313] text-sm font-bold rounded-lg hover:bg-[#eaeaeb] transition-colors border border-[#eaeaeb]"
        >
          View Details
        </a>
      </div>

      <hr className="border-[#f3f1f1]" />

      {/* Progress Tracker */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end mb-1">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#7b2d2d] animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={currentStatus.icon}
              />
            </svg>
            <p className="text-[#161313] font-bold">{currentStatus.label}</p>
          </div>
        </div>
        <div className="w-full bg-[#f8f6f6] rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`bg-[#7b2d2d] h-3 rounded-full relative transition-all duration-1000 ${currentStatus.progress}`}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse w-full h-full"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-[#806b6b] mt-1 px-1 font-medium">
          <span
            className={
              order.status === "pending" || order.status === "confirmed"
                ? "text-[#7b2d2d] font-bold"
                : ""
            }
          >
            Confirmed
          </span>
          <span
            className={
              order.status === "preparing" ? "text-[#7b2d2d] font-bold" : ""
            }
          >
            Cooking
          </span>
          <span
            className={
              order.status === "ready" ? "text-[#7b2d2d] font-bold" : ""
            }
          >
            Ready
          </span>
        </div>
      </div>
    </div>
  );
}
