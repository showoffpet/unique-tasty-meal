"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import type { Database } from "@/lib/supabase/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface MealCardProps {
  meal: Meal;
  onAddToCart?: (mealId: string) => void;
  onCustomize?: (mealId: string) => void;
  isAddingToCart?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
}

export default function MealCard({
  meal,
  onAddToCart,
  onCustomize,
  isAddingToCart = false,
  className = "",
  viewMode = "grid",
}: MealCardProps) {
  const hasCustomizations = !!(
    meal.spice_level !== null ||
    (meal.add_ons && Object.keys(meal.add_ons as object).length > 0) ||
    (meal.portion_options &&
      Object.keys(meal.portion_options as object).length > 0)
  );

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (hasCustomizations && onCustomize) {
      onCustomize(meal.id);
    } else if (onAddToCart) {
      onAddToCart(meal.id);
    }
  };

  const isListMode = viewMode === "list";

  return (
    <div
      className={`
      bg-white shadow-sm border border-[#f3f1f1] overflow-hidden group
      hover:shadow-md hover:border-[#f3f1f1] transition-all duration-300 flex transform hover:-translate-y-1
      ${isListMode ? "flex-row h-32 sm:h-40 rounded-[24px] p-2" : "flex-col h-full rounded-[32px] p-2"}
      ${!meal.is_available ? "opacity-75 grayscale-[0.2]" : ""}
      ${className}
    `}
    >
      {/* Image Section */}
      <Link
        href={`/meals/${meal.id}`}
        className={`relative block shrink-0 overflow-hidden bg-[#f3f1f1] ${isListMode ? "w-1/3 sm:w-40 rounded-[16px]" : "w-full aspect-[4/3] rounded-[24px]"}`}
      >
        {meal.image_url ? (
          <Image
            src={meal.image_url}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#B3B3B3]">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Overlays */}
        {!meal.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white/95 text-[#806b6b] font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        {/* Rating Badge (Top Right) */}
        {meal.average_rating && meal.average_rating > 0 ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
            <svg
              className="w-3.5 h-3.5 text-[#ED8B00]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-[#1e1414]">
              {meal.average_rating.toFixed(1)}
            </span>
          </div>
        ) : null}
      </Link>

      {/* Content Section */}
      <div
        className={`flex flex-col flex-1 ${isListMode ? "p-3 sm:p-4 min-w-0" : "px-3 py-4"}`}
      >
        <Link
          href={`/meals/${meal.id}`}
          className="block flex-1 group-hover:text-[#5a2222] transition-colors min-w-0"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-xl font-bold text-[#1e1414] leading-tight pr-2">
              {meal.name}
            </h3>
            <PriceDisplay
              amount={meal.base_price}
              className="text-xl font-bold text-[#5a2222] shrink-0"
            />
          </div>
          <p
            className={`text-sm text-[#806b6b] ${isListMode ? "line-clamp-2" : "line-clamp-2"} leading-relaxed`}
          >
            {meal.description}
          </p>
        </Link>

        {/* Categories and Add Button */}
        <div
          className={`mt-4 flex items-center justify-between gap-3 ${!isListMode ? "pt-4 border-t border-[#f3f1f1]" : "mt-auto pt-2 border-t border-[#f3f1f1]"}`}
        >
          <div className="bg-[#f5eaea] px-3 py-1.5 rounded-full">
            <span className="text-[#5a2222] text-sm font-medium">
              {(meal as Meal & { category?: { name: string } }).category
                ?.name || "Rice Dishes"}
            </span>
          </div>

          <button
            onClick={handleActionClick}
            disabled={!meal.is_available || isAddingToCart}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              !meal.is_available
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#f3f1f1] hover:bg-[#e2e2e2] text-[#1e1414]"
            }`}
            aria-label={`Add ${meal.name} to cart`}
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-[#1e1414] border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
