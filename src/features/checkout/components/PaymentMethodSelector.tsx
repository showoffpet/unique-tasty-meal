"use client";

import React from "react";
import Image from "next/image";

interface PaymentMethod {
  id: string;
  brand:
    | "visa"
    | "mastercard"
    | "amex"
    | "discover"
    | "apple_pay"
    | "google_pay"
    | "unknown";
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
}

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddNew?: () => void;
  className?: string;
}

export default function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
  onAddNew,
  className = "",
}: PaymentMethodSelectorProps) {
  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case "visa":
        return (
          <div className="text-xl font-bold italic text-[#1434CB]">VISA</div>
        );
      case "mastercard":
        return (
          <div className="relative w-8 h-5">
            <div className="absolute left-0 w-5 h-5 bg-[#EB001B] rounded-full opacity-80 mix-blend-multiply"></div>
            <div className="absolute right-0 w-5 h-5 bg-[#F79E1B] rounded-full opacity-80 mix-blend-multiply"></div>
          </div>
        );
      case "amex":
        return (
          <div className="text-sm font-bold bg-[#2671B9] text-white px-1 rounded uppercase">
            Amex
          </div>
        );
      case "apple_pay":
        return (
          <div className="font-semibold text-black tracking-tighter"> Pay</div>
        );
      case "google_pay":
        return (
          <div className="font-semibold text-[#5F6368] tracking-tighter">
            G Pay
          </div>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-[#999999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-[#1e1414]">Payment Method</h3>

      <div className="space-y-2">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          const isCard = ["visa", "mastercard", "amex", "discover"].includes(
            method.brand,
          );

          return (
            <label
              key={method.id}
              className={`
                relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                ${
                  isSelected
                    ? "bg-[#7A2E2E]/5 border-[#7A2E2E] shadow-sm ring-1 ring-[#7A2E2E]"
                    : "bg-white border-[#f3f1f1] hover:border-[#D2D2D2]"
                }
              `}
            >
              <div className="flex items-center h-5 mr-4 shrink-0">
                <div
                  className={`
                  w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                  ${isSelected ? "border-[#7A2E2E] bg-[#7A2E2E]" : "border-[#D2D2D2]"}
                `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-[#f3f1f1] rounded flex items-center justify-center border border-[#f3f1f1] shrink-0">
                    {getBrandIcon(method.brand)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${isSelected ? "text-[#1e1414]" : "text-[#1e1414]"}`}
                      >
                        {isCard
                          ? `${method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• ${method.last4}`
                          : method.brand === "apple_pay"
                            ? "Apple Pay"
                            : method.brand === "google_pay"
                              ? "Google Pay"
                              : "Card"}
                      </span>
                      {method.isDefault && (
                        <span className="text-[10px] bg-[#f3f1f1] text-[#806b6b] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    {isCard && method.expMonth && method.expYear && (
                      <span className="text-xs text-[#806b6b]">
                        Expires {method.expMonth.toString().padStart(2, "0")}/
                        {method.expYear.toString().slice(-2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Invisible radio input for accessibility and native form handling */}
              <input
                type="radio"
                name="payment_method"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
            </label>
          );
        })}

        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="w-full flex items-center p-4 rounded-xl border border-dashed border-[#D2D2D2] text-left hover:border-[#7A2E2E] hover:bg-[#fcfcfc] transition-colors group"
          >
            <div className="w-5 h-5 mr-4 shrink-0 flex items-center justify-center text-[#999999] group-hover:text-[#7A2E2E]">
              <svg
                className="w-5 h-5"
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
            </div>
            <span className="font-medium text-[#806b6b] group-hover:text-[#7A2E2E]">
              Add New Payment Method
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
