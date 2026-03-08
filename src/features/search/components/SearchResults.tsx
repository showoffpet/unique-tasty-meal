"use client";

import React from "react";
import MealCard from "../../menu/components/MealCard";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import type { Database } from "@/lib/supabase/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface SearchResultsProps {
  query: string;
  results: Meal[];
  isLoading: boolean;
  onAddToCart?: (mealId: string) => void;
  onCustomize?: (mealId: string) => void;
  className?: string;
  viewMode?: "grid" | "list";
}

export default function SearchResults({
  query,
  results,
  isLoading,
  onAddToCart,
  onCustomize,
  className = "",
  viewMode = "grid",
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"} ${className}`}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl border border-[#f3f1f1] overflow-hidden ${viewMode === "list" ? "flex h-32 sm:h-40" : "flex-col"}`}
          >
            <Skeleton
              variant="rectangular"
              className={`${viewMode === "list" ? "w-1/3 sm:w-40 h-full" : "w-full aspect-[4/3] rounded-none"}`}
            />
            <div
              className={`flex flex-col flex-1 p-4 ${viewMode === "list" ? "" : ""}`}
            >
              <Skeleton
                variant="text"
                width="70%"
                height={24}
                className="mb-2"
              />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton
                variant="text"
                width="80%"
                height={16}
                className="mb-4"
              />
              <div className="mt-auto flex justify-between items-center">
                <Skeleton variant="text" width="60px" height={24} />
                <Skeleton
                  variant="rectangular"
                  width="80px"
                  height={36}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title={query ? "No meals found" : "Looking for something specific?"}
        message={
          query
            ? `We couldn't find any meals matching "${query}". Try adjusting your search or filters.`
            : "Start typing above to search our entire menu."
        }
        icon={
          <svg
            className="w-12 h-12 text-[#999999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      />
    );
  }

  return (
    <div
      className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"} ${className}`}
    >
      {results.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          viewMode={viewMode}
          onAddToCart={onAddToCart}
          onCustomize={onCustomize}
        />
      ))}
    </div>
  );
}
