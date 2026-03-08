import React from "react";
import Badge from "./Badge";
type OrderStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusBadge({
  status,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const statusConfig: Record<
    OrderStatus,
    {
      label: string;
      variant: "warning" | "primary" | "success" | "default" | "error";
    }
  > = {
    draft: { label: "Draft", variant: "default" },
    pending: { label: "Pending", variant: "warning" },
    confirmed: { label: "Confirmed", variant: "primary" },
    preparing: { label: "Preparing", variant: "primary" },
    ready_for_pickup: { label: "Ready", variant: "success" },
    out_for_delivery: { label: "On the way", variant: "warning" },
    delivered: { label: "Delivered", variant: "success" },
    cancelled: { label: "Cancelled", variant: "error" },
    refunded: { label: "Refunded", variant: "default" },
  };

  const config = statusConfig[status] || { label: status, variant: "default" };

  return (
    <Badge variant={config.variant} size={size} dot className={className}>
      {config.label}
    </Badge>
  );
}
