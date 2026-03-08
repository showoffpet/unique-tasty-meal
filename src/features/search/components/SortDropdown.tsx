"use client";

import React from "react";
import Dropdown from "../../../components/ui/Dropdown";

export type SortOption =
  | "recommended"
  | "price_low"
  | "price_high"
  | "rating"
  | "newest"
  | "prep_time";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export default function SortDropdown({
  value,
  onChange,
  className = "",
}: SortDropdownProps) {
  const options = [
    { value: "recommended", label: "Recommended" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "prep_time", label: "Fastest Prep Time" },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-[#806b6b] whitespace-nowrap">
        Sort by:
      </span>
      <div className="w-48">
        <Dropdown
          value={value}
          options={options}
          onChange={(val) => onChange(val as SortOption)}
        />
      </div>
    </div>
  );
}
