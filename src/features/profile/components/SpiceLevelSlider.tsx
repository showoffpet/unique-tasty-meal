"use client";

import React from "react";
import Slider from "../../../components/ui/Slider";

interface SpiceLevelSliderProps {
  value: number; // 1 to 5
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}

export default function SpiceLevelSlider({
  value,
  onChange,
  className = "",
  disabled = false,
}: SpiceLevelSliderProps) {
  const SPICE_LABELS = {
    1: "Mild",
    2: "Medium",
    3: "Hot",
    4: "Very Hot",
    5: "Extreme",
  };

  const getHeatIcon = () => {
    switch (value) {
      case 1:
        return (
          <svg
            className="w-5 h-5 text-[#ED8B00]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        );
      case 2:
      case 3:
      case 4:
        return (
          <svg
            className={`w-5 h-5 ${value >= 3 ? "text-[#7b2d2d]" : "text-[#ED8B00]"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-1.245-1.182-1.896-.192-.62-.25-1.246-.25-1.854V2.553z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 5:
        return (
          <svg
            className="w-5 h-5 text-[#7A2E2E]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-[#1e1414]">
          Default Spice Level
        </label>
        {getHeatIcon()}
      </div>

      <p className="text-sm text-[#806b6b]">
        This will be applied by default to meals that offer customizable spice
        levels. You can always override this on individual meals.
      </p>

      <div className="px-2 pb-4 pt-2">
        <Slider
          value={value}
          onChange={onChange}
          min={1}
          max={5}
          step={1}
          labels={SPICE_LABELS}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
