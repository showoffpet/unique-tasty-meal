"use client";

import React from "react";

export function SkeletonMetricCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm animate-pulse ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-[#f3f1f1] rounded w-24"></div>
        <div className="w-8 h-8 rounded-lg bg-[#fcfcfc]"></div>
      </div>
      <div className="h-10 bg-[#f3f1f1] rounded w-1/2 mb-3"></div>
      <div className="flex gap-2">
        <div className="h-5 bg-[#f3f1f1] rounded w-16"></div>
        <div className="h-4 bg-[#f3f1f1] rounded w-28 mt-0.5"></div>
      </div>
    </div>
  );
}

export function SkeletonChart({
  height = 300,
  className = "",
}: {
  height?: number | string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-[#f3f1f1] animate-pulse w-full ${className}`}
    >
      <div className="h-5 bg-[#f3f1f1] rounded w-1/3 mb-6"></div>

      {/* Chart grid simulation */}
      <div
        className="flex items-end justify-between gap-1 sm:gap-4 relative"
        style={{ height: typeof height === "number" ? height - 80 : height }}
      >
        {/* Y Axis simulation */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between items-end pr-2 py-4">
          <div className="h-2 bg-[#f3f1f1] rounded w-4"></div>
          <div className="h-2 bg-[#f3f1f1] rounded w-4"></div>
          <div className="h-2 bg-[#f3f1f1] rounded w-4"></div>
        </div>

        {/* Bars simulation */}
        <div className="w-full flex justify-between items-end pl-10 h-full">
          {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
            <div
              key={i}
              className="w-full mx-1 sm:mx-2 bg-[#fcfcfc] rounded-t-sm"
              style={{ height: `${h}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* X Axis simulation */}
      <div className="flex justify-between pl-10 mt-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-2 bg-[#f3f1f1] rounded w-6"></div>
        ))}
      </div>
    </div>
  );
}
