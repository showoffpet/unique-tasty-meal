"use client";

import React from "react";

interface QuantityControlProps {
  quantity: number;
  onChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  isLoading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function QuantityControl({
  quantity,
  onChange,
  min = 1,
  max = 99,
  isLoading = false,
  className = "",
  size = "md",
}: QuantityControlProps) {
  const handleDecrement = () => {
    if (quantity > min && !isLoading) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !isLoading) {
      onChange(quantity + 1);
    }
  };

  const sizeStyles = {
    sm: "h-7 w-7 text-sm",
    md: "h-9 w-9 text-base",
    lg: "h-11 w-11 text-lg",
  };

  const buttonClass = `
    inline-flex items-center justify-center rounded-full
    text-[#1e1414] bg-[#f3f1f1] hover:bg-[#f3f1f1]
    transition-colors focus:outline-none focus:ring-2 focus:ring-[#7A2E2E]/30
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min || isLoading}
        className={`${buttonClass} ${sizeStyles[size]}`}
        aria-label="Decrease quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>

      <span
        className={`font-medium min-w-[1.5rem] text-center text-[#1e1414] ${size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"}`}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-[#7A2E2E] border-t-transparent rounded-full animate-spin"></span>
        ) : (
          quantity
        )}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max || isLoading}
        className={`${buttonClass} ${sizeStyles[size]}`}
        aria-label="Increase quantity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
      </button>
    </div>
  );
}
