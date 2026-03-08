"use client";

import React, { ReactNode } from "react";
import Button from "../../../components/ui/Button";
import { SkeletonChart } from "./LoadingSkeletons";

interface ChartContainerProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  height?: number | string;
  children: ReactNode;
  className?: string;
  actionMenu?: ReactNode;
}

export default function ChartContainer({
  title,
  description,
  isLoading = false,
  error = null,
  onRetry,
  height = 300,
  children,
  className = "",
  actionMenu,
}: ChartContainerProps) {
  // Loading State
  if (isLoading) {
    return <SkeletonChart height={height} className={className} />;
  }

  // Error State
  if (error) {
    return (
      <div
        className={`bg-white rounded-xl p-6 border border-[#f3f1f1] shadow-sm flex flex-col items-center justify-center text-center ${className}`}
        style={{ minHeight: typeof height === "number" ? height + 60 : height }}
      >
        <div className="w-12 h-12 bg-[#7b2d2d]/5 text-[#7b2d2d] rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="font-bold text-[#1e1414] mb-2 cursor-pointer">
          {title || "Failed to load chart"}
        </h3>
        <p className="text-sm text-[#806b6b] max-w-sm mb-4">
          {error.message ||
            "An unexpected error occurred while fetching the analytics data."}
        </p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry} size="sm">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Success State
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-[#f3f1f1] shadow-sm ${className}`}
    >
      {/* Header Area */}
      {(title || description || actionMenu) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            {title && <h3 className="font-bold text-[#1e1414]">{title}</h3>}
            {description && (
              <p className="text-xs text-[#806b6b] mt-1">{description}</p>
            )}
          </div>
          {actionMenu && <div>{actionMenu}</div>}
        </div>
      )}

      {/* Chart Layout */}
      <div className="w-full relative" style={{ height }}>
        {children}
      </div>
    </div>
  );
}
