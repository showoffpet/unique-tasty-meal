"use client";

import React from "react";
import Button from "../../../components/ui/Button";
import type { SearchFilters } from "../types";

interface SavedFilter {
  id: string;
  name: string;
  filterState: SearchFilters;
}

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  onApply: (filterState: SearchFilters) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function SavedFilters({
  savedFilters,
  onApply,
  onDelete,
  className = "",
}: SavedFiltersProps) {
  if (savedFilters.length === 0) return null;

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-5 ${className}`}
    >
      <h3 className="font-semibold text-[#1e1414] mb-4">Saved Preferences</h3>
      <div className="space-y-3">
        {savedFilters.map((sf) => (
          <div
            key={sf.id}
            className="flex flex-col gap-2 p-3 bg-[#f3f1f1] rounded-lg border border-transparent hover:border-[#D2D2D2] transition-colors group"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-[#1e1414] text-sm">{sf.name}</h4>
              <button
                onClick={() => onDelete(sf.id)}
                className="text-[#999999] hover:text-[#7b2d2d] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete ${sf.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onApply(sf.filterState)}
              className="w-full justify-center bg-white"
            >
              Apply Filter
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
