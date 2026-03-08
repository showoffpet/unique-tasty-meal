import React from "react";
import Button from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`p-4 rounded-lg bg-[#7b2d2d]/10 border border-[#7b2d2d]/20 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[#7b2d2d] shrink-0 mt-0.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div>
          <h4 className="text-sm font-semibold text-[#7b2d2d]">{title}</h4>
          <p className="text-sm text-[#7b2d2d]/90 mt-1">{message}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          className="shrink-0 bg-white border-[#7b2d2d] text-[#7b2d2d] hover:bg-[#7b2d2d]/5 focus:ring-[#7b2d2d]"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
