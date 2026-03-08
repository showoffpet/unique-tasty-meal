"use client";

import React from "react";
import Image from "next/image";
import Button from "../../../components/ui/Button";
import Toggle from "../../../components/ui/Toggle";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import type { Database } from "@/lib/supabase/database.types";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];

interface MealManagementCardProps {
  meal: MealRow;
  onEdit: (meal: MealRow) => void;
  onToggleStatus: (id: string, newStatus: boolean) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function MealManagementCard({
  meal,
  onEdit,
  onToggleStatus,
  onDelete,
  className = "",
}: MealManagementCardProps) {
  const isAvailable = meal.is_available ?? false;

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] hover:border-[#D2D2D2] transition-colors overflow-hidden flex flex-col ${
        !isAvailable ? "opacity-75" : ""
      } ${className}`}
    >
      <div className="relative h-40 bg-[#f3f1f1] shrink-0">
        {meal.image_url ? (
          <Image
            src={meal.image_url}
            alt={meal.name || "Meal image"}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#999999]">
            <svg
              className="w-8 h-8 opacity-20 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm10 8l-3-4-2.5 3.5L9 11l-3 5h10z" />
            </svg>
            <span className="text-xs uppercase tracking-wider font-semibold">
              No Image
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-1">
          {/* Note: In a real app we'd map to actual columns, assuming they exist or ignoring if not */}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm text-sm font-bold text-[#1e1414]">
          <PriceDisplay amount={meal.base_price} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-bold text-[#1e1414] pr-2 line-clamp-2">
            {meal.name}
          </h3>
        </div>

        <p className="text-sm text-[#806b6b] line-clamp-2 mb-4">
          {meal.description || "No description provided."}
        </p>

        <div className="mt-auto pt-4 border-t border-[#f3f1f1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Toggle
              checked={isAvailable}
              onChange={(checked) => onToggleStatus(meal.id, checked)}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${isAvailable ? "text-[#2E7D32]" : "text-[#999999]"}`}
            >
              {isAvailable ? "Available" : "Hidden"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => onEdit(meal)}>
              Edit
            </Button>
            {onDelete && (
              <button
                onClick={() => onDelete(meal.id)}
                className="p-1.5 text-[#999999] hover:text-[#7b2d2d] transition-colors rounded hover:bg-[#7b2d2d]/10"
                aria-label="Delete meal"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
