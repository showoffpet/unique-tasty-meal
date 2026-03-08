"use client";

import React from "react";
import type { Database } from "@/lib/supabase/database.types";
import StockStatusBadge from "./StockStatusBadge";
import Button from "../../../components/ui/Button";

export interface InventoryItemRow {
  id: string;
  item_name: string;
  current_stock: number;
  reorder_level?: number | null;
  unit: string;
  updated_at: string;
}

interface InventoryCardProps {
  item: InventoryItemRow;
  onAdjust: (item: InventoryItemRow) => void;
  onMarkUnavailable: (item: InventoryItemRow) => void;
  onViewHistory: (item: InventoryItemRow) => void;
  isLoading?: boolean;
  className?: string;
}

export default function InventoryCard({
  item,
  onAdjust,
  onMarkUnavailable,
  onViewHistory,
  isLoading = false,
  className = "",
}: InventoryCardProps) {
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm animate-pulse ${className}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="h-5 bg-[#f3f1f1] rounded w-1/2"></div>
          <div className="h-5 bg-[#f3f1f1] rounded-full w-20"></div>
        </div>
        <div className="h-10 bg-[#f3f1f1] rounded w-24 mb-2"></div>
        <div className="h-3 bg-[#f3f1f1] rounded w-1/3 mt-2"></div>
        <div className="mt-4 pt-4 border-t border-[#f3f1f1] flex gap-2">
          <div className="h-8 bg-[#f3f1f1] rounded w-full"></div>
        </div>
      </div>
    );
  }

  const getStatus = (): "sufficient" | "low_stock" | "out_of_stock" => {
    if (item.current_stock <= 0) return "out_of_stock";
    if (item.current_stock <= (item.reorder_level || 0)) return "low_stock";
    return "sufficient";
  };

  return (
    <div
      className={`group bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm hover:shadow-md hover:border-[#D2D2D2] transition-all relative overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3
          className="font-bold text-[#1e1414] pr-2 line-clamp-1 truncate"
          title={item.item_name}
        >
          {item.item_name}
        </h3>
        <StockStatusBadge status={getStatus()} size="sm" />
      </div>

      <div className="mb-1">
        <span className="text-3xl font-bold text-[#1e1414] tracking-tight">
          {item.current_stock}
        </span>
        <span className="text-sm text-[#999999] ml-1.5 font-medium uppercase tracking-wider">
          {item.unit}
        </span>
      </div>

      <p className="text-xs text-[#806b6b]">
        Reorder at:{" "}
        <span className="font-semibold">{item.reorder_level || 0}</span>{" "}
        {item.unit}
      </p>

      <p className="text-[10px] text-[#999999] mt-3">
        Last updated: {new Date(item.updated_at).toLocaleDateString()}
      </p>

      {/* Quick Actions overlay */}
      <div className="mt-4 pt-4 border-t border-[#f3f1f1] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur p-4 shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)] translate-y-2 group-hover:translate-y-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onAdjust(item)}
          className="flex-1"
        >
          Adjust
        </Button>
        <button
          onClick={() => onViewHistory(item)}
          className="p-1.5 text-[#999999] hover:text-[#1e1414] transition-colors rounded hover:bg-[#f3f1f1]"
          title="View History"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </button>
        <button
          onClick={() => onMarkUnavailable(item)}
          className="p-1.5 text-[#999999] hover:text-[#7b2d2d] transition-colors rounded hover:bg-[#7b2d2d]/10"
          title="Mark Unavailable"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
