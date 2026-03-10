"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CategoryTabs from "../../features/menu/components/CategoryTabs";
import MealCard from "../../features/menu/components/MealCard";
import SearchBar from "../../features/search/components/SearchBar";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import Button from "../../components/ui/Button";
import type { Database } from "@/lib/supabase/database.types";
import { getCategories, getMeals } from "@/lib/supabase/queries";

type MealRow = Database["public"]["Tables"]["meals"]["Row"];
type CategoryRow = Database["public"]["Tables"]["meal_categories"]["Row"];

export default function MenuDisplayPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRestaurantClosed, setIsRestaurantClosed] = useState(false);

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [allMeals, setAllMeals] = useState<MealRow[]>([]);

  // Cart state simulation
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // In a real app, this would be an intersection observer for infinite scroll
  const [displayLimit, setDisplayLimit] = useState(8);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, meals] = await Promise.all([getCategories(), getMeals()]);
        setCategories(cats);
        setAllMeals(meals);
      } catch (err) {
        console.error("Failed to load menu data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDisplayLimit(8); // Reset infinite scroll limit when searching
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleAddToCart = (mealId: string) => {
    const meal = allMeals.find((m) => m.id === mealId);
    if (meal) {
      setCartItemCount((prev) => prev + 1);
      setCartTotal((prev) => prev + meal.base_price);
    }
  };

  // Filter meals based on search OR category
  const filteredMeals = allMeals.filter((meal) => {
    if (searchQuery) {
      return (
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategoryId === "all") return true;
    return meal.category_id === activeCategoryId;
  });

  const visibleMeals = filteredMeals.slice(0, displayLimit);

  // Infinite scroll simulation
  const handleLoadMore = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isLoading &&
        visibleMeals.length < filteredMeals.length
      ) {
        setDisplayLimit((prev) => prev + 4);
      }
    },
    [isLoading, visibleMeals.length, filteredMeals.length],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleLoadMore, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    const target = observerTargetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [handleLoadMore]);

  return (
    <div className="min-h-screen pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Search */}
        <div className="mb-10 text-center relative max-w-3xl mx-auto pt-4 md:pt-8 bg">
          <h1 className="text-4xl md:text-5xl font-black text-[#7b2d2d] tracking-tight mb-4">
            Our Menu
          </h1>
          <p className="text-[#806b6b] text-base md:text-lg mb-10 max-w-xl mx-auto">
            Discover a variety of delicious, customizable meals crafted with
            fresh ingredients and authentic flavors.
          </p>

          <div className="relative z-20 flex flex-col items-center gap-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="What are you craving today? (e.g. Jollof, Egusi, Suya...)"
              liveSearch
            />

            {/* Categories */}
            {!searchQuery && (
              <div className="w-full max-w-3xl mx-auto">
                {isLoading ? (
                  <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-11 w-28 rounded-full flex-shrink-0"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <CategoryTabs
                      tabs={[
                        { id: "all", label: "All Menu" },
                        ...categories.map((c) => ({
                          id: c.id,
                          label: c.name,
                        })),
                      ]}
                      activeTabId={activeCategoryId}
                      onChange={setActiveCategoryId}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[#806b6b]">
              Showing results for{" "}
              <span className="font-semibold text-[#1e1414]">
                &quot;{searchQuery}&quot;
              </span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-[#7b2d2d]"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Meal Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-[380px] p-4 flex flex-col gap-4 border border-[#f3f1f1]"
              >
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-full h-12" />
                <div className="mt-auto flex justify-between items-center">
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMeals.length === 0 ? (
          <EmptyState
            title={
              searchQuery ? "No meals match your search" : "No meals found"
            }
            message={
              searchQuery
                ? "Try adjusting your search terms or filters."
                : "This category is currently empty."
            }
            actionLabel={searchQuery ? "Clear Search" : undefined}
            onAction={searchQuery ? handleClearSearch : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onCustomize={() => {
                    // TODO: Open customization modal
                  }}
                  onAddToCart={() => handleAddToCart(meal.id)}
                />
              ))}
            </div>

            {/* Intersection Observer Target for Infinite Scroll */}
            {visibleMeals.length < filteredMeals.length && (
              <div
                ref={observerTargetRef}
                className="h-20 w-full flex items-center justify-center mt-8"
              >
                <div className="w-6 h-6 border-2 border-[#7A2E2E] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button (Sticky bottom) */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f3f1f1] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 transform transition-transform translate-y-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs text-[#806b6b] uppercase font-bold tracking-wider">
                Your Order
              </span>
              <span className="font-bold text-[#1e1414] flex items-center gap-2">
                {cartItemCount} item{cartItemCount !== 1 ? "s" : ""}
                <span className="text-[#f3f1f1]">|</span>
                <span className="text-[#7b2d2d]">${cartTotal.toFixed(2)}</span>
              </span>
            </div>
            <Button
              variant="primary"
              className="bg-[#7b2d2d] hover:bg-[#561b1b]"
              onClick={() => {
                // TODO: Navigate to checkout
              }}
            >
              Continue to Cart
            </Button>
          </div>
        </div>
      )}

      {/* Closed Overlay */}
      {isRestaurantClosed && (
        <div className="fixed inset-0 bg-[#1e1414]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-[#fcfcfc] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#f3f1f1]">
              <svg
                className="w-8 h-8 text-[#999999]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1e1414] mb-2">
              Currently Closed
            </h2>
            <p className="text-[#806b6b] mb-6">
              We&apos;re not accepting new orders right now. Our operating hours
              will resume tomorrow at 11:00 AM.
            </p>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setIsRestaurantClosed(false)}
            >
              Browse Menu Anyway
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
