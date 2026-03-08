"use client";

import React, { useState, useEffect, useRef } from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labels?: Record<number, string>;
  disabled?: boolean;
  className?: string;
}

export default function Slider({
  value,
  onChange,
  min = 1,
  max = 5,
  step = 1,
  labels,
  disabled = false,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate percentage for styling (0 to 100%)
  const percentage = ((value - min) / (max - min)) * 100;

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (disabled || !trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

    let newPercentage = (clientX - rect.left) / rect.width;
    newPercentage = Math.max(0, Math.min(1, newPercentage));

    let newValue = min + newPercentage * (max - min);
    // Snap to step
    newValue = Math.round(newValue / step) * step;

    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleDrag, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, value]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let newPercentage = (e.clientX - rect.left) / rect.width;
    newPercentage = Math.max(0, Math.min(1, newPercentage));

    let newValue = min + newPercentage * (max - min);
    newValue = Math.round(newValue / step) * step;
    onChange(newValue);
  };

  const getTrackColor = () => {
    // Progressively hotter colors for spice levels, default otherwise
    if (max <= 5 && Object.keys(labels || {}).length > 0) {
      if (value <= 1) return "bg-[#D2D2D2]"; // Mild
      if (value <= 2) return "bg-[#ED8B00]"; // Medium
      if (value <= 3) return "bg-[#7b2d2d]/70"; // Hot
      if (value <= 4) return "bg-[#7b2d2d]"; // Very Hot
      return "bg-[#7A2E2E]"; // Extreme
    }
    return "bg-[#7A2E2E]"; // Default brand color
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      {/* Slider Track */}
      <div
        ref={trackRef}
        className={`relative h-2 w-full bg-[#f3f1f1] rounded-full cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleTrackClick}
      >
        {/* Filled Track */}
        <div
          className={`absolute h-full rounded-full transition-all duration-150 ${getTrackColor()}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -mt-2.5 -ml-2.5 h-5 w-5 rounded-full bg-white border-2 
            shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A2E2E]
            transition-transform duration-100 ease-out z-10
            ${isDragging ? "scale-125 border-[#7A2E2E]" : "border-[#999999] hover:border-[#7A2E2E] hover:scale-110"}
            ${disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
          `}
          style={{ left: `${percentage}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "ArrowRight" || e.key === "ArrowUp")
              onChange(Math.min(max, value + step));
            if (e.key === "ArrowLeft" || e.key === "ArrowDown")
              onChange(Math.max(min, value - step));
          }}
        />

        {/* Notches for steps */}
        {labels && max <= 10 && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {Array.from({ length: (max - min) / step + 1 }).map((_, i) => {
              const val = min + i * step;
              const pos = ((val - min) / (max - min)) * 100;
              return (
                <div
                  key={val}
                  className={`absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full ${val <= value ? "bg-white/50" : "bg-[#B3B3B3]"}`}
                  style={{ left: `calc(${pos}%)` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Labels below track */}
      {labels && (
        <div className="flex justify-between items-start mt-3 px-1 text-xs text-[#806b6b]">
          {Object.entries(labels).map(([key, labelStr]) => {
            const numKey = Number(key);
            const isSelected = value === numKey;
            const pos = ((numKey - min) / (max - min)) * 100;

            // For 5 discrete steps, distributing them evenly creates alignment issues
            // at the edges, so we rely on flex-between for layout if there are exactly min & max labels
            // Otherwise we absolutely position them (complex) or simply map them sequentially.
            // A simple flex layout is usually best for fixed 1-to-5 scales.
            return (
              <div
                key={key}
                className={`text-center font-medium transition-colors ${isSelected ? "text-[#7A2E2E]" : ""}`}
                // Using flex makes them align perfectly without absolute positioning math
                style={{
                  flex: 1,
                  textAlign:
                    numKey === min
                      ? "left"
                      : numKey === max
                        ? "right"
                        : "center",
                }}
              >
                {labelStr}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
