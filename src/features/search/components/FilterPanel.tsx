"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Slider from "../../../components/ui/Slider";

interface FilterState {
  diets: string[];
  allergens: string[];
  maxPrice: number;
}

interface FilterPanelProps {
  initialFilters?: FilterState;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
  isMobileDrawer?: boolean;
}

const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "gluten_free", label: "Gluten Free" },
  { id: "dairy_free", label: "Dairy Free" },
  { id: "halal", label: "Halal" },
];

const ALLERGEN_OPTIONS = [
  { id: "peanuts", label: "Peanuts" },
  { id: "tree_nuts", label: "Tree Nuts" },
  { id: "milk", label: "Dairy/Milk" },
  { id: "eggs", label: "Eggs" },
  { id: "shellfish", label: "Shellfish" },
];

export default function FilterPanel({
  initialFilters = { diets: [], allergens: [], maxPrice: 50 },
  onApply,
  onReset,
  className = "",
  isMobileDrawer = false,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleFilter = (type: "diets" | "allergens", id: string) => {
    setFilters((prev) => {
      const current = prev[type];
      return {
        ...prev,
        [type]: current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      };
    });
  };

  const clearAll = () => {
    const defaultState = { diets: [], allergens: [], maxPrice: 50 };
    setFilters(defaultState);
    onReset();
  };

  return (
    <div
      className={`
      bg-white flex flex-col h-full
      ${isMobileDrawer ? "pb-24" : "rounded-xl border border-[#f3f1f1] p-5"}
      ${className}
    `}
    >
      <div
        className={`flex items-center justify-between mb-6 ${isMobileDrawer ? "px-6 pt-6" : ""}`}
      >
        <h3 className="font-semibold text-lg text-[#1e1414]">Filters</h3>
        <button
          onClick={clearAll}
          className="text-sm text-[#999999] hover:text-[#7b2d2d] hover:underline font-medium transition-colors"
        >
          Reset All
        </button>
      </div>

      <div
        className={`space-y-8 flex-1 overflow-y-auto ${isMobileDrawer ? "px-6" : ""}`}
      >
        {/* Maximum Price */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-[#1e1414]">Max Price</h4>
            <span className="text-[#7A2E2E] font-semibold">
              ${filters.maxPrice}
            </span>
          </div>
          <div className="px-2">
            <Slider
              min={5}
              max={100}
              step={5}
              value={filters.maxPrice}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, maxPrice: val }))
              }
            />
          </div>
        </div>

        {/* Dietary Preferences */}
        <div>
          <h4 className="font-medium text-[#1e1414] mb-3">
            Dietary Preferences
          </h4>
          <div className="flex flex-col gap-2.5">
            {DIETARY_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex items-center select-none cursor-pointer group"
              >
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#D2D2D2] group-hover:border-[#7A2E2E] transition-colors bg-white mr-3 shrink-0">
                  <input
                    type="checkbox"
                    checked={filters.diets.includes(option.id)}
                    onChange={() => toggleFilter("diets", option.id)}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                  {filters.diets.includes(option.id) && (
                    <svg
                      className="w-3.5 h-3.5 text-[#7A2E2E]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${filters.diets.includes(option.id) ? "text-[#1e1414] font-medium" : "text-[#806b6b]"}`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Avoid Allergens */}
        <div>
          <h4 className="font-medium text-[#1e1414] mb-3">Avoid Allergens</h4>
          <div className="flex flex-col gap-2.5">
            {ALLERGEN_OPTIONS.map((option) => (
              <label
                key={option.id}
                className="flex items-center select-none cursor-pointer group"
              >
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-[#D2D2D2] group-hover:border-[#7b2d2d] transition-colors bg-white mr-3 shrink-0">
                  <input
                    type="checkbox"
                    checked={filters.allergens.includes(option.id)}
                    onChange={() => toggleFilter("allergens", option.id)}
                    className="opacity-0 absolute inset-0 cursor-pointer"
                  />
                  {filters.allergens.includes(option.id) && (
                    <svg
                      className="w-3.5 h-3.5 text-[#7b2d2d]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${filters.allergens.includes(option.id) ? "text-[#7b2d2d] font-medium" : "text-[#806b6b]"}`}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`mt-6 pt-5 border-t border-[#f3f1f1] ${isMobileDrawer ? "absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-md" : ""}`}
      >
        <Button
          variant="primary"
          className="w-full"
          onClick={() => onApply(filters)}
        >
          Show Results
        </Button>
      </div>
    </div>
  );
}
