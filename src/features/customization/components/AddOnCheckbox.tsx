"use client";

import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface AddOnCheckboxProps {
  id: string;
  label: string;
  price: number;
  isSelected: boolean;
  isDisabled?: boolean;
  onChange: (id: string, price: number) => void;
  className?: string;
}

export default function AddOnCheckbox({
  id,
  label,
  price,
  isSelected,
  isDisabled = false,
  onChange,
  className = "",
}: AddOnCheckboxProps) {
  return (
    <label
      className={`
        flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group
        ${
          isSelected
            ? "border-[#7A2E2E] bg-[#7A2E2E]/5"
            : isDisabled
              ? "border-[#f3f1f1] bg-[#f3f1f1] opacity-70 cursor-not-allowed"
              : "border-[#f3f1f1] bg-white hover:border-[#D2D2D2]"
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onChange(id, price)}
          disabled={isDisabled}
          className="w-4 h-4 text-[#7A2E2E] border-[#D2D2D2] rounded focus:ring-[#7A2E2E]/40"
        />
        <span
          className={`text-sm font-medium ${isSelected ? "text-[#1e1414]" : "text-[#806b6b]"}`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-sm ${isSelected ? "text-[#7A2E2E] font-medium" : "text-[#999999]"}`}
      >
        +<PriceDisplay amount={price} className="inline-block" />
      </span>
    </label>
  );
}
