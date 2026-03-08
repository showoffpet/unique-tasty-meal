"use client";

import React from "react";

interface SkeletonCardProps {
  type?: "grid" | "list";
  className?: string;
}

export default function SkeletonCard({
  type = "grid",
  className = "",
}: SkeletonCardProps) {
  if (type === "list") {
    return (
      <div
        className={`flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-xl border border-[#f3f1f1] animate-pulse ${className}`}
      >
        <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 bg-[#f3f1f1]" />

        <div className="flex-1 space-y-3">
          <div className="h-5 bg-[#f3f1f1] rounded-md w-1/3" />
          <div className="flex gap-4">
            <div className="h-4 bg-[#f3f1f1] rounded w-24" />
            <div className="h-4 bg-[#f3f1f1] rounded w-28" />
            <div className="h-4 bg-[#f3f1f1] rounded w-32" />
          </div>
        </div>

        <div className="flex gap-2 mt-4 sm:mt-0">
          <div className="h-8 bg-[#f3f1f1] rounded-md w-20" />
          <div className="h-8 bg-[#f3f1f1] rounded-md w-24" />
        </div>
      </div>
    );
  }

  // Grid style (matches InventoryCard)
  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm animate-pulse ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 bg-[#f3f1f1] rounded w-1/2"></div>
        <div className="h-5 bg-[#f3f1f1] rounded-full w-20"></div>
      </div>
      <div className="h-10 bg-[#f3f1f1] rounded w-24 mb-2"></div>
      <div className="h-3 bg-[#f3f1f1] rounded w-1/3 mt-2"></div>
      <div className="mt-4 pt-4 border-t border-[#f3f1f1] flex gap-2">
        <div className="h-8 bg-[#f3f1f1] rounded w-full"></div>
      </div>
    </div>
  );
}
