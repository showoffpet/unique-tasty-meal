"use client";

import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface PortionOption {
  id: string;
  label: string;
  priceModifier: number; // e.g., 0 for regular, 2.50 for large
  description?: string;
}

interface PortionSelectorProps {
  options?: PortionOption[];
  value: string; // The selected portion id
  onChange: (id: string, modifier: number) => void;
  className?: string;
}

export default function PortionSelector({
  options = [
    {
      id: "regular",
      label: "Regular",
      priceModifier: 0,
      description: "Standard serving size",
    },
    {
      id: "large",
      label: "Large",
      priceModifier: 3.5,
      description: "Approximately 50% more",
    },
  ],
  value,
  onChange,
  className = "",
}: PortionSelectorProps) {
  if (!options || options.length <= 1) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-[#1e1414]">Portion Size</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id, option.priceModifier)}
              className={`
                relative flex items-center p-4 rounded-xl border text-left transition-all duration-200
                ${
                  isSelected
                    ? "bg-[#7A2E2E]/5 border-[#7A2E2E] ring-1 ring-[#7A2E2E]"
                    : "bg-white border-[#f3f1f1] hover:border-[#D2D2D2]"
                }
              `}
            >
              <div className="flex-1">
                <div className="font-medium text-[#1e1414] flex justify-between items-center">
                  {option.label}
                  {option.priceModifier > 0 && (
                    <span className="text-[#7A2E2E] text-sm">
                      +
                      <PriceDisplay
                        amount={option.priceModifier}
                        className="inline-block"
                      />
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-sm text-[#806b6b] mt-1">
                    {option.description}
                  </p>
                )}
              </div>

              {/* Custom Radio Button Indicator */}
              <div
                className={`
                ml-4 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                ${isSelected ? "border-[#7A2E2E] bg-[#7A2E2E]" : "border-[#D2D2D2]"}
              `}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
