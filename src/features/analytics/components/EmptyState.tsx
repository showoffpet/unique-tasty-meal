"use client";

import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-[#fcfcfc] rounded-xl border border-[#f3f1f1] border-dashed ${className}`}
    >
      <div className="w-12 h-12 bg-white text-[#999999] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#f3f1f1]">
        {icon || (
          <svg
            className="w-6 h-6 opacity-75"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold text-[#1e1414] mb-1">{title}</h3>
      <p className="text-sm text-[#806b6b] max-w-sm mx-auto">{description}</p>
    </div>
  );
}
