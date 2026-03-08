"use client";

import React from "react";
import Slider from "../../../components/ui/Slider";

interface SpiceLevelPickerProps {
  value: number; // 0 to 4
  onChange: (level: number) => void;
  className?: string;
}

export default function SpiceLevelPicker({
  value,
  onChange,
  className = "",
}: SpiceLevelPickerProps) {
  const spiceLevels = [
    { value: 0, label: "None", color: "text-[#999999]" },
    { value: 1, label: "Mild", color: "text-[#ED8B00]" },
    { value: 2, label: "Medium", color: "text-[#E65100]" },
    { value: 3, label: "Hot", color: "text-[#7b2d2d]" },
    { value: 4, label: "Extra Hot", color: "text-[#7A2E2E]" },
  ];

  const currentLevel = spiceLevels[value] || spiceLevels[0];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-semibold text-[#1e1414]">Spice Level</h3>
          <p className="text-sm text-[#806b6b] mt-0.5">Customize your heat</p>
        </div>
        <div
          className={`font-bold flex items-center gap-1.5 ${currentLevel.color}`}
        >
          {value > 0 && (
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.5 11.5c-1.5-2-3-3.5-3-5.5a4.5 4.5 0 00-6.4-4 6.5 6.5 0 011.9 4.5c0 2-1.5 3.5-3 5.5A6.5 6.5 0 005 16.5c0 3.6 2.9 6.5 6.5 6.5h1A6.5 6.5 0 0019 16.5a6.5 6.5 0 00-1.5-5zM12 21a4.5 4.5 0 01-4-2.5c1.5 0 2.5-1 3-2.5 1.5.5 2 1.5 2 3a2.5 2.5 0 01-1 2z" />
            </svg>
          )}
          {currentLevel.label}
        </div>
      </div>

      <div className="px-1">
        <Slider min={0} max={4} step={1} value={value} onChange={onChange} />

        <div className="flex justify-between mt-2 px-1">
          {spiceLevels.map((level) => (
            <div
              key={level.value}
              className={`text-[10px] font-medium transition-colors ${value === level.value ? level.color : "text-[#B3B3B3]"}`}
            >
              o
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
