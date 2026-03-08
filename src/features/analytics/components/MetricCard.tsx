"use client";

import React from "react";
import TrendBadge from "./TrendBadge";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  trend: number;
  trendDirection: "up" | "down" | "stable";
  icon?: React.ReactNode;
  className?: string;
  isCurrency?: boolean;
}

export default function MetricCard({
  title,
  value,
  unit = "",
  trend,
  trendDirection,
  icon,
  className = "",
  isCurrency = false,
}: MetricCardProps) {
  // Format the main value
  const formattedValue = isCurrency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: unit === "M" || unit === "k" ? 1 : 2,
        maximumFractionDigits: 2,
      }).format(value)
    : new Intl.NumberFormat("en-US").format(value);

  return (
    <div
      className={`bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-[#806b6b] uppercase tracking-wider">
          {title}
        </h3>
        {icon && (
          <div className="p-2 bg-[#fcfcfc] rounded-lg text-[#7A2E2E]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-[#1e1414] tracking-tight">
          {formattedValue}
        </span>
        {unit && !isCurrency && (
          <span className="text-sm font-medium text-[#999999] uppercase tracking-wider">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <TrendBadge trend={trendDirection} percentage={trend} />
        <span className="text-xs text-[#999999]">vs previous period</span>
      </div>
    </div>
  );
}
