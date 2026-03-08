"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import type { OrderItemJson } from "../types";

interface ReorderButtonProps {
  orderId: string;
  items: OrderItemJson[];
  onReorder: (items: OrderItemJson[]) => Promise<void>;
  isLoading?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "social";
}

export default function ReorderButton({
  orderId,
  items,
  onReorder,
  isLoading = false,
  className = "",
  variant = "primary",
}: ReorderButtonProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleReorder = async () => {
    setIsProcessing(true);
    try {
      await onReorder(items);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleReorder}
      isLoading={isLoading || isProcessing}
      className={className}
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Reorder {items.length} {items.length === 1 ? "Item" : "Items"}
    </Button>
  );
}
