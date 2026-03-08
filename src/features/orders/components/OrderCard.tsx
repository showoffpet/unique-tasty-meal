"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import Badge from "../../../components/ui/Badge";
import type { Database } from "@/lib/supabase/database.types";
import type { OrderItemJson } from "../types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface OrderCardProps {
  order: OrderRow;
  onClick?: (id: string) => void;
  onReorder?: (id: string) => void;
  className?: string;
}

export default function OrderCard({
  order,
  onClick,
  onReorder,
  className = "",
}: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { variant: "success" as const, label: "Delivered" };
      case "cancelled":
        return { variant: "error" as const, label: "Cancelled" };
      case "out_for_delivery":
        return { variant: "primary" as const, label: "Out for Delivery" };
      case "preparing":
      case "confirmed":
        return { variant: "warning" as const, label: "In Progress" };
      case "pending":
      default:
        return { variant: "default" as const, label: "Pending" };
    }
  };

  const statusConfig = getStatusConfig(order.order_status);

  // Simplified extraction of first item name from JSON (assuming structure)
  const items: OrderItemJson[] = Array.isArray(order.items)
    ? (order.items as unknown as OrderItemJson[])
    : [];
  const itemCount = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const firstItemName =
    items.length > 0 ? items[0].meal_name ?? "Custom Order" : "Custom Order";
  const moreItemsText = items.length > 1 ? ` + ${items.length - 1} more` : "";

  return (
    <div
      className={`bg-white border text-left border-[#f3f1f1] rounded-xl overflow-hidden hover:border-[#D2D2D2] transition-colors ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={() => onClick && onClick(order.id)}
      role={onClick ? "button" : "region"}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm font-medium text-[#806b6b] mb-1">
              {formatDate(order.created_at)}
            </div>
            <p className="font-semibold text-[#1e1414] text-lg">
              {firstItemName}
              <span className="text-[#999999] font-normal text-sm">
                {moreItemsText}
              </span>
            </p>
            <p className="text-sm text-[#806b6b] mt-1">
              {itemCount} {itemCount === 1 ? "item" : "items"} •{" "}
              <PriceDisplay amount={order.total} className="inline-block" />
            </p>
          </div>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#f3f1f1]">
          <span className="text-xs font-mono text-[#999999]">
            #{order.id.split("-")[0].toUpperCase()}
          </span>

          <div className="flex gap-2">
            {onClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(order.id);
                }}
              >
                View Details
              </Button>
            )}
            {onReorder && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onReorder(order.id);
                }}
              >
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
