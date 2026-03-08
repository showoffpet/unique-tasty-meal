"use client";

import React from "react";
import Image from "next/image";
import DietaryBadges from "../../menu/components/DietaryBadges";
import PriceDisplay from "../../../components/ui/PriceDisplay";
import type { Database } from "@/lib/supabase/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface MealHeroProps {
  meal: Meal;
  className?: string;
  onBack?: () => void;
}

export default function MealHero({
  meal,
  className = "",
  onBack,
}: MealHeroProps) {
  return (
    <div className={`relative bg-white border-b border-[#f3f1f1] ${className}`}>
      {/* Mobile Back Button Overlay */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden absolute top-4 left-4 z-20 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-[#1e1414] hover:text-[#7A2E2E] transition-colors"
          aria-label="Go back"
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
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-1/2 lg:w-3/5 relative aspect-square md:aspect-auto md:min-h-[400px] lg:min-h-[500px] bg-[#f3f1f1]">
          {meal.image_url ? (
            <Image
              src={meal.image_url}
              alt={meal.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#B3B3B3]">
              <svg
                className="w-24 h-24"
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
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 lg:w-2/5 p-6 md:p-10 lg:p-12 flex flex-col justify-center">
          {onBack && (
            <button
              onClick={onBack}
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#806b6b] hover:text-[#7A2E2E] transition-colors mb-6 w-fit"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Menu
            </button>
          )}

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e1414] tracking-tight">
              {meal.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <PriceDisplay
                amount={meal.base_price}
                className="text-2xl font-semibold text-[#7A2E2E]"
              />

              {meal.average_rating && meal.average_rating > 0 && (
                <div className="flex items-center gap-1.5 bg-[#fcfcfc] px-2.5 py-1 rounded text-sm font-medium text-[#1e1414]">
                  <svg
                    className="w-4 h-4 text-[#ED8B00]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {meal.average_rating.toFixed(1)}
                  <span className="text-[#999999] ml-1">
                    ({meal.total_reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {meal.dietary_tags && meal.dietary_tags.length > 0 && (
              <div className="pt-2">
                <DietaryBadges tags={meal.dietary_tags} size="md" showLabels />
              </div>
            )}

            <p className="text-[#806b6b] leading-relaxed pt-2">
              {meal.description}
            </p>

            <div className="flex items-center gap-6 pt-4 text-sm text-[#806b6b]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#999999]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{meal.preparation_time} mins prep</span>
              </div>

              {meal.allergens && meal.allergens.length > 0 && (
                <div className="flex items-center gap-2 text-[#7b2d2d]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span>Contains allergens</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
