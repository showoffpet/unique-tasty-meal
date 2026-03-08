import React from "react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-[#fcfcfc] rounded-xl border border-[#f3f1f1] min-h-[300px] ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#f3f1f1] flex items-center justify-center text-[#7A2E2E] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#1e1414] mb-2">{title}</h3>
      {message && (
        <p className="text-[#806b6b] text-sm max-w-sm mb-6">{message}</p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
