"use client";

import React from "react";
import type { Database } from "@/lib/supabase/database.types";
import BulkActionCheckbox from "./BulkActionCheckbox";
import Button from "../../../components/ui/Button";

export interface InventoryItemRow {
  id: string;
  item_name: string;
  current_stock: number;
  reorder_level?: number | null;
  unit: string;
  updated_at: string;
}

interface AlertCardProps {
  item: InventoryItemRow;
  isSelected?: boolean;
  onToggleSelect?: (checked: boolean) => void;
  onDismiss: (item: InventoryItemRow) => void;
  onAdjustReorder: (item: InventoryItemRow) => void;
  onOrderNow: (item: InventoryItemRow) => void;
  className?: string;
}

export default function AlertCard({
  item,
  isSelected = false,
  onToggleSelect,
  onDismiss,
  onAdjustReorder,
  onOrderNow,
  className = "",
}: AlertCardProps) {
  const stock = item.current_stock;
  const reorder = item.reorder_level || 0;

  // Calculate Urgency Indicator
  const isCritical = stock === 0;
  const isWarning = stock > 0 && stock <= reorder;

  const getUrgencyClasses = () => {
    if (isCritical) return "bg-[#7b2d2d] shadow-[#7b2d2d]/20";
    if (isWarning) return "bg-[#ED8B00] shadow-[#ED8B00]/20";
    return "bg-[#ED8B00] shadow-[#ED8B00]/20"; // default for alerts
  };

  // Mock days until stockout for visual UI
  const daysUntilStockout = isCritical ? 0 : Math.max(1, Math.floor(stock / 5));

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-xl border transition-colors ${isSelected ? "border-[#7A2E2E] bg-[#fcfcfc]" : "border-[#f3f1f1] hover:border-[#D2D2D2]"} ${className}`}
    >
      {/* Left side: Checkbox & Status Indicator */}
      <div className="flex items-start gap-4">
        {onToggleSelect && (
          <div className="pt-1">
            <BulkActionCheckbox
              checked={isSelected}
              onChange={onToggleSelect}
            />
          </div>
        )}

        <div
          className={`w-3 h-3 rounded-full mt-1.5 shrink-0 shadow-lg ${getUrgencyClasses()}`}
        />
      </div>

      {/* Center: Details */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-[#1e1414] mb-1">
          {item.item_name}
        </h3>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-[#999999]">Current Stock:</span>{" "}
            <span
              className={`font-bold ${isCritical ? "text-[#7b2d2d]" : "text-[#ED8B00]"}`}
            >
              {stock} {item.unit}
            </span>
          </div>
          <div>
            <span className="text-[#999999]">Reorder Level:</span>{" "}
            <span className="font-semibold text-[#806b6b]">
              {reorder} {item.unit}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#7b2d2d] font-medium bg-[#7b2d2d]/5 px-2 py-0.5 rounded">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {daysUntilStockout === 0
              ? "Stockout Now"
              : `~${daysUntilStockout} days until stockout`}
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:justify-end mt-4 sm:mt-0">
        <button
          onClick={() => onDismiss(item)}
          className="text-sm font-medium text-[#999999] hover:text-[#806b6b] px-3 py-2 transition-colors"
        >
          Dismiss
        </button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAdjustReorder(item)}
        >
          Adjust Levels
        </Button>
        <Button variant="primary" size="sm" onClick={() => onOrderNow(item)}>
          Order Now
        </Button>
      </div>
    </div>
  );
}
