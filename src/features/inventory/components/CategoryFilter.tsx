"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
  className?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
  className = "",
}: CategoryFilterProps) {
  const allCategories = ["All", ...categories];

  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x ${className}`}
    >
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              isSelected
                ? "bg-[#1e1414] text-white border-[#1e1414]"
                : "bg-white text-[#806b6b] border-[#f3f1f1] hover:border-[#D2D2D2] hover:bg-[#fcfcfc]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
