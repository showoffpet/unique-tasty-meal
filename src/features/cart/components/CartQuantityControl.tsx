"use client";

import React from "react";

interface CartQuantityControlProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  className?: string;
  size?: "sm" | "md";
}

export default function CartQuantityControl({
  quantity,
  min = 1,
  max = 99,
  onChange,
  className = "",
  size = "md",
}: CartQuantityControlProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const handleDecrease = () => {
    if (!isMin) onChange(quantity - 1);
  };

  const handleIncrease = () => {
    if (!isMax) onChange(quantity + 1);
  };

  const paddingClass = size === "sm" ? "p-1.5" : "p-2";
  const textClass = size === "sm" ? "text-sm w-6" : "text-base w-8";

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-[#f3f1f1] bg-white text-[#1e1414] shadow-sm ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isMin}
        className={`${paddingClass} text-[#806b6b] hover:text-[#7A2E2E] hover:bg-[#f3f1f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg`}
        aria-label="Decrease quantity"
      >
        <svg
          className={size === "sm" ? "w-3 h-3" : "w-4 h-4"}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>

      <span className={`${textClass} text-center font-semibold select-none`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={isMax}
        className={`${paddingClass} text-[#806b6b] hover:text-[#7A2E2E] hover:bg-[#f3f1f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg`}
        aria-label="Increase quantity"
      >
        <svg
          className={size === "sm" ? "w-3 h-3" : "w-4 h-4"}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
