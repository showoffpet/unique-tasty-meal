"use client";

import React from "react";

interface StockStatusBadgeProps {
  status: "sufficient" | "low_stock" | "out_of_stock";
  size?: "sm" | "md";
  className?: string;
}

export default function StockStatusBadge({
  status,
  size = "md",
  className = "",
}: StockStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "sufficient":
        return {
          label: "Sufficient",
          bgColor: "bg-[#2E7D32]/10",
          textColor: "text-[#2E7D32]",
          dotColor: "bg-[#2E7D32]",
        };
      case "low_stock":
        return {
          label: "Low Stock",
          bgColor: "bg-[#ED8B00]/10",
          textColor: "text-[#ED8B00]",
          dotColor: "bg-[#ED8B00]",
        };
      case "out_of_stock":
        return {
          label: "Out of Stock",
          bgColor: "bg-[#7b2d2d]/10",
          textColor: "text-[#7b2d2d]",
          dotColor: "bg-[#7b2d2d]",
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full shrink-0 ${config.bgColor} ${config.textColor} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 ${config.dotColor}`}
      />
      {config.label}
    </span>
  );
}
