"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import DietaryBadges from "./DietaryBadges";
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
      bg-white rounded-2xl shadow-sm border border-[#f3f1f1] overflow-hidden group
      hover:shadow-lg hover:border-[#f3f1f1] transition-all duration-300 flex transform hover:-translate-y-1
      ${isListMode ? "flex-row h-32 sm:h-40" : "flex-col h-full"}
      ${!meal.is_available ? "opacity-75 grayscale-[0.2]" : ""}
      ${className}
    `}
    >
      {/* Image Section */}
      <Link
        href={`/menu/${meal.id}`}
        className={`relative block shrink-0 overflow-hidden bg-[#f3f1f1] ${isListMode ? "w-1/3 sm:w-40 border-r border-[#f3f1f1]" : "w-full aspect-[4/3]"}`}
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

        {/* Tags Badge (Top Left) */}
        {meal.dietary_tags && meal.dietary_tags.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1 max-w-full pr-2">
            <DietaryBadges tags={meal.dietary_tags} size="sm" />
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div
        className={`flex flex-col flex-1 ${isListMode ? "p-3 sm:p-4 min-w-0" : "p-4"}`}
      >
        <Link
          href={`/menu/${meal.id}`}
          className="block flex-1 group-hover:text-[#7b2d2d] transition-colors min-w-0"
        >
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-semibold text-[#1e1414] truncate">
              {meal.name}
            </h3>
            {meal.average_rating && meal.average_rating > 0 && (
              <div className="flex items-center gap-1 shrink-0 bg-[#fcfcfc] px-1.5 py-0.5 rounded text-xs font-medium text-[#806b6b]">
                <svg
                  className="w-3 h-3 text-[#ED8B00]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {meal.average_rating.toFixed(1)}
              </div>
            )}
          </div>
          <p
            className={`text-sm text-[#806b6b] ${isListMode ? "line-clamp-2" : "line-clamp-2"}`}
          >
            {meal.description}
          </p>
        </Link>

        <div
          className={`mt-3 flex items-center justify-between gap-3 ${!isListMode ? "pt-3 border-t border-[#fcfcfc]" : "mt-auto pt-2"}`}
        >
          <div className="flex flex-col">
            <PriceDisplay
              amount={meal.base_price}
              className="text-lg font-black text-[#1e1414] tracking-tight"
            />
            {hasCustomizations && (
              <span className="text-[10px] text-[#999999] font-medium tracking-wide uppercase">
                Customizable
              </span>
            )}
          </div>

          <Button
            variant={hasCustomizations ? "secondary" : "primary"}
            size={isListMode ? "sm" : "md"}
            onClick={handleActionClick}
            disabled={!meal.is_available || isAddingToCart}
            isLoading={isAddingToCart}
            className={`shrink-0 font-bold ${
              hasCustomizations
                ? "text-[#7b2d2d] border-[#7b2d2d] hover:bg-[#7b2d2d] hover:text-white transition-colors"
                : "bg-[#7b2d2d] hover:bg-[#561b1b] text-white"
            }`}
            aria-label={
              hasCustomizations
                ? `Customize ${meal.name}`
                : `Add ${meal.name} to cart`
            }
          >
            {hasCustomizations ? (
              <span className="flex items-center gap-1.5">
                Customize
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Add
                <svg
                  className="w-4 h-4 hidden sm:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
