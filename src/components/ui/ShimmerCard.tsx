"use client";

import React from "react";
import Skeleton from "./Skeleton";

interface ShimmerCardProps {
  className?: string;
}

export default function ShimmerCard({ className = "" }: ShimmerCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#f3f1f1] p-4 overflow-hidden ${className}`}
    >
      {/* Image placeholder */}
      <Skeleton className="w-full h-40 mb-4" />

      {/* Content placeholders */}
      <div className="space-y-3">
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />

        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="circular" className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
