"use client";

import React from "react";

interface TrendBadgeProps {
  trend: "up" | "down" | "stable";
  percentage: number;
  className?: string;
}

export default function TrendBadge({
  trend,
  percentage,
  className = "",
}: TrendBadgeProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";
  const isStable = trend === "stable";

  let styles = "bg-[#f3f1f1] text-[#806b6b]";
  let Icon = null;

  if (isUp) {
    styles = "bg-[#2E7D32]/10 text-[#2E7D32]";
    Icon = (
      <svg
        className="w-3.5 h-3.5 mr-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    );
  } else if (isDown) {
    styles = "bg-[#7b2d2d]/10 text-[#7b2d2d]";
    Icon = (
      <svg
        className="w-3.5 h-3.5 mr-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
    );
  } else {
    Icon = (
      <svg
        className="w-3.5 h-3.5 mr-1 text-[#999999]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      </svg>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold leading-none ${styles} ${className}`}
    >
      {Icon}
      {isStable
        ? percentage === 0
          ? "0%"
          : `${percentage}%`
        : `${Math.abs(percentage)}%`}
    </span>
  );
}
