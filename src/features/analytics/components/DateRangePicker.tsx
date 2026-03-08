"use client";

import React, { useState } from "react";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  label: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Custom", days: 0 },
];

export default function DateRangePicker({
  value,
  onChange,
  className = "",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [error, setError] = useState("");

  const handlePresetSelect = (preset: { label: string; days: number }) => {
    if (preset.label === "Custom") {
      onChange({ startDate: null, endDate: null, label: "Custom" });
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - preset.days);

      onChange({
        startDate: start,
        endDate: end,
        label: preset.label,
      });
      setIsOpen(false);
    }
  };

  const handleCustomApply = () => {
    setError("");
    if (!customStart || !customEnd) {
      setError("Please select both dates");
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);

    if (start > end) {
      setError("Start date must be before end date");
      return;
    }

    onChange({
      startDate: start,
      endDate: end,
      label: "Custom Range",
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f3f1f1] rounded-lg text-sm font-medium text-[#1e1414] hover:border-[#D2D2D2] hover:bg-[#fcfcfc] transition-colors shadow-sm"
      >
        <svg
          className="w-4 h-4 text-[#999999]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {value.label}
        {value.label === "Custom Range" && value.startDate && value.endDate && (
          <span className="text-[#806b6b] font-normal ml-1">
            ({value.startDate.toLocaleDateString()} -{" "}
            {value.endDate.toLocaleDateString()})
          </span>
        )}
        <svg
          className={`w-4 h-4 text-[#999999] ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 w-72 bg-white border border-[#f3f1f1] rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-[#f3f1f1]">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetSelect(preset)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    value.label === preset.label ||
                    (preset.label === "Custom" &&
                      value.label === "Custom Range")
                      ? "bg-[#fcfcfc] text-[#7A2E2E] font-bold"
                      : "text-[#1e1414] hover:bg-[#f3f1f1]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {(value.label === "Custom" || value.label === "Custom Range") && (
              <div className="p-4 bg-[#fcfcfc] space-y-3">
                {error && (
                  <p className="text-xs text-[#7b2d2d] font-medium">{error}</p>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full border border-[#f3f1f1] rounded-md text-sm p-2 focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#806b6b] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full border border-[#f3f1f1] rounded-md text-sm p-2 focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  className="w-full bg-[#1e1414] text-white text-sm font-bold py-2 rounded-md hover:bg-black transition-colors mt-2"
                >
                  Apply Range
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
