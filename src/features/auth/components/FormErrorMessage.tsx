import React from "react";

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

export default function FormErrorMessage({
  message,
  className = "",
}: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className={`text-xs text-[#7b2d2d] mt-1.5 flex items-start gap-1 font-medium ${className}`}
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 shrink-0 mt-0.5"
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
      {message}
    </p>
  );
}
