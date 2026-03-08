"use client";

import React, { useRef } from "react";
import type { Database } from "@/lib/supabase/database.types";

type Category = Database["public"]["Tables"]["meal_categories"]["Row"];

interface CategoryListProps {
  categories: Category[];
  activeCategoryId?: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  className?: string;
}

export default function CategoryList({
  categories,
  activeCategoryId,
  onSelectCategory,
  className = "",
}: CategoryListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Optional Left Scroll Button for Desktop */}
      <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white via-white to-transparent pr-4">
        <button
          onClick={() => scroll("left")}
          className="p-1.5 rounded-full bg-white border border-[#f3f1f1] shadow-sm text-[#806b6b] hover:text-[#7A2E2E] hover:border-[#7A2E2E]/30 transition-all"
          aria-label="Scroll left"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-3 overflow-x-auto custom-scrollbar pb-2 md:px-8 snap-x snap-mandatory"
        role="tablist"
        aria-label="Meal Categories"
      >
        <button
          role="tab"
          aria-selected={!activeCategoryId}
          onClick={() => onSelectCategory(null)}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors snap-start
            ${
              !activeCategoryId
                ? "bg-[#7A2E2E] text-white shadow-md"
                : "bg-[#f3f1f1] text-[#806b6b] hover:bg-[#f3f1f1] hover:text-[#1e1414]"
            }
          `}
        >
          All Meals
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(category.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors snap-start
                ${
                  isActive
                    ? "bg-[#7A2E2E] text-white shadow-md"
                    : "bg-[#f3f1f1] text-[#806b6b] hover:bg-[#f3f1f1] hover:text-[#1e1414]"
                }
              `}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Optional Right Scroll Button for Desktop */}
      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white via-white to-transparent pl-4">
        <button
          onClick={() => scroll("right")}
          className="p-1.5 rounded-full bg-white border border-[#f3f1f1] shadow-sm text-[#806b6b] hover:text-[#7A2E2E] hover:border-[#7A2E2E]/30 transition-all"
          aria-label="Scroll right"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
