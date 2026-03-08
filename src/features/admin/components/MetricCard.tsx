"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export default function MetricCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  className = "",
  isLoading = false,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl border border-[#f3f1f1] p-5 animate-pulse ${className}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="h-4 bg-[#f3f1f1] rounded w-24"></div>
          <div className="h-10 w-10 bg-[#f3f1f1] rounded-lg"></div>
        </div>
        <div className="h-8 bg-[#f3f1f1] rounded w-32 mb-2"></div>
        <div className="h-4 bg-[#f3f1f1] rounded w-20 mt-4"></div>
      </div>
    );
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-[#2E7D32] bg-[#2E7D32]/10";
      case "down":
        return "text-[#7b2d2d] bg-[#7b2d2d]/10";
      case "neutral":
      default:
        return "text-[#806b6b] bg-[#f3f1f1]";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return (
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-[#f3f1f1] p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-[#806b6b] text-sm uppercase tracking-wider">
          {title}
        </h3>
        {icon && (
          <div className="p-2.5 bg-[#fcfcfc] text-[#7A2E2E] rounded-lg border border-[#f3f1f1]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[#1e1414] tracking-tight">
          {value}
        </span>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold ${getTrendColor()}`}
          >
            {getTrendIcon()}
            {change}
          </span>
          <span className="text-xs text-[#999999] ml-2">vs last period</span>
        </div>
      )}
    </div>
  );
}
