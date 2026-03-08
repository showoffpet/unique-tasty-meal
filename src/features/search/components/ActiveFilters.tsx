"use client";

import React from "react";

interface ActiveFilter {
  id: string;
  type: "diet" | "allergen" | "price" | "category" | "other";
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (filterId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export default function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className = "",
}: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-[#806b6b] mr-1">Active Filters:</span>

      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-[#f3f1f1] text-[#1e1414] border border-[#f3f1f1]"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.id)}
            className="text-[#999999] hover:text-[#7b2d2d] hover:bg-white rounded-full transition-colors flex items-center justify-center p-0.5"
            aria-label={`Remove filter ${filter.label}`}
          >
            <svg
              className="w-3.5 h-3.5"
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
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-sm text-[#7A2E2E] hover:underline font-medium ml-2"
      >
        Clear All
      </button>
    </div>
  );
}
