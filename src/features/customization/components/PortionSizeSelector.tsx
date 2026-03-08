"use client";

import React from "react";
import PriceDisplay from "../../../components/ui/PriceDisplay";

interface PortionOption {
  id: string;
  label: string;
  priceModifier: number;
}

interface PortionSizeSelectorProps {
  options: PortionOption[];
  value: string;
  onChange: (id: string, modifier: number) => void;
  className?: string;
}

export default function PortionSizeSelector({
  options,
  value,
  onChange,
  className = "",
}: PortionSizeSelectorProps) {
  if (!options || options.length <= 1) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-semibold text-[#1e1414]">Portion Size</h3>

      <div className="flex bg-[#f3f1f1] p-1 rounded-xl">
        {options.map((option) => {
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id, option.priceModifier)}
              className={`
                flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center
                ${
                  isSelected
                    ? "bg-white text-[#7A2E2E] shadow-sm ring-1 ring-[#f3f1f1]"
                    : "text-[#806b6b] hover:text-[#1e1414] hover:bg-white/50"
                }
              `}
            >
              <span>{option.label}</span>
              {option.priceModifier > 0 && (
                <span
                  className={`text-[10px] ${isSelected ? "text-[#7A2E2E]/80" : "text-[#999999]"}`}
                >
                  +
                  <PriceDisplay
                    amount={option.priceModifier}
                    className="inline-block"
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
