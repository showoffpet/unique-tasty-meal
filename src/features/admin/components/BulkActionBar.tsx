"use client";

import React from "react";
import Button from "../../../components/ui/Button";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: {
    label: string;
    onClick: () => void | Promise<void>;
    variant?: "primary" | "secondary" | "ghost" | "error"; // using subset mapped to Button
  }[];
  className?: string;
}

export default function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  className = "",
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 fade-in duration-300 ${className}`}
    >
      <div className="bg-[#1e1414] text-white rounded-xl shadow-xl border border-[#D2D2D2]/20 px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-3 border-r border-white/20 pr-6">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#1e1414] text-xs font-bold">
            {selectedCount}
          </span>
          <span className="font-medium text-sm">
            {selectedCount === 1 ? "Order Selected" : "Orders Selected"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={
                action.variant === "primary"
                  ? "primary"
                  : action.variant === "error"
                    ? "primary"
                    : "ghost"
              }
              className={
                action.variant === "error"
                  ? "bg-[#7b2d2d] hover:bg-[#990e18] text-white"
                  : "text-white hover:bg-white/10"
              }
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>

        <button
          onClick={onClear}
          className="ml-2 p-1.5 text-[#999999] hover:text-white transition-colors rounded-full hover:bg-white/10"
          title="Clear Selection"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
