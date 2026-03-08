"use client";

import React from "react";
import type { Database } from "@/lib/supabase/database.types";
import Badge from "../../../components/ui/Badge";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import type { OrderItemJson } from "@/features/orders/types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface OrderQueueWidgetProps {
  orders: OrderRow[];
  onViewOrder: (orderId: string) => void;
  className?: string;
}

export default function OrderQueueWidget({
  orders,
  onViewOrder,
  className = "",
}: OrderQueueWidgetProps) {
  // Sort orders by oldest first (longest waiting)
  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="error" dot>
            NEW
          </Badge>
        );
      case "confirmed":
        return <Badge variant="warning">Confirmed</Badge>;
      case "preparing":
        return <Badge variant="warning">Prep</Badge>;
      case "out_for_delivery":
        return <Badge variant="primary">En Route</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getWaitTime = (createdAt: string) => {
    const minDiff = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / 60000,
    );
    if (minDiff < 60) return `${minDiff}m`;
    const hrs = Math.floor(minDiff / 60);
    const mins = minDiff % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-[#f3f1f1] bg-[#fcfcfc] flex justify-between items-center">
        <h3 className="font-bold text-[#1e1414]">Live Order Queue</h3>
        <Badge variant="default">{orders.length} Active</Badge>
      </div>

      <div className="divide-y divide-[#f3f1f1] max-h-[400px] overflow-y-auto">
        {sortedOrders.length === 0 ? (
          <div className="p-8 text-center text-[#999999] text-sm italic">
            No active orders right now.
          </div>
        ) : (
          sortedOrders.map((order) => {
            const items: OrderItemJson[] = Array.isArray(order.items)
              ? (order.items as unknown as OrderItemJson[])
              : [];
            const itemCount = items.reduce(
              (acc, item) => acc + (item.quantity || 1),
              0,
            );
            const firstItem = items[0];

            return (
              <div
                key={order.id}
                onClick={() => onViewOrder(order.id)}
                className="p-4 hover:bg-[#fcfcfc] transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#1e1414]">
                      #{order.id.split("-")[0].toUpperCase()}
                    </span>
                    {getStatusBadge(order.order_status)}
                    {order.order_status === "pending" && (
                      <span className="text-[10px] text-[#7b2d2d] font-bold animate-pulse">
                        Wait: {getWaitTime(order.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#1e1414]">
                    {firstItem?.meal_name || "Custom Order"}{" "}
                    {items.length > 1 && `+${items.length - 1}`}
                  </p>
                  <p className="text-xs text-[#999999] mt-0.5">
                    {itemCount} items •{" "}
                    <PriceDisplay
                      amount={order.total}
                      className="inline-block"
                    />
                  </p>
                </div>

                <div className="text-[#f3f1f1] group-hover:text-[#7A2E2E] transition-colors pl-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
