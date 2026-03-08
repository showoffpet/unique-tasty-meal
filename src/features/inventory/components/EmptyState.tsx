"use client";

import React from "react";
import Button from "../../../components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  buttonText,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-xl border border-[#f3f1f1] ${className}`}
    >
      <div className="w-16 h-16 bg-[#fcfcfc] text-[#999999] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#f3f1f1]/50">
        {icon || (
          <svg
            className="w-8 h-8 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#1e1414] mb-2">{title}</h3>
      <p className="text-[#806b6b] max-w-md mx-auto mb-8">{description}</p>

      {buttonText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
