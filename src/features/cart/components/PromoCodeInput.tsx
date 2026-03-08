"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";

interface PromoCodeInputProps {
  onApply: (
    code: string,
  ) => Promise<{ success: boolean; message: string; discount?: number }>;
  onUpdate?: () => void; // Called after apply completes successfully
  className?: string;
}

export default function PromoCodeInput({
  onApply,
  onUpdate,
  className = "",
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setStatus({ type: null, message: "" });
    try {
      const result = await onApply(code.trim().toUpperCase());
      setStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      });
      if (result.success) {
        setCode("");
        if (onUpdate) onUpdate();
      }
    } catch {
      setStatus({
        type: "error",
        message: "Failed to apply code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleApply} className={`w-full ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[#999999]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className={`
              w-full py-2.5 pl-10 pr-4 block rounded-lg text-sm bg-[#fcfcfc] uppercase
              border transition-colors duration-200
              focus:outline-none focus:ring-1 
              ${
                status.type === "error"
                  ? "border-[#7b2d2d] focus:ring-[#7b2d2d] focus:border-[#7b2d2d]"
                  : status.type === "success"
                    ? "border-[#2E7D32] focus:ring-[#2E7D32] focus:border-[#2E7D32]"
                    : "border-[#f3f1f1] focus:ring-[#7A2E2E] focus:border-[#7A2E2E]"
              }
            `}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          disabled={!code.trim() || isLoading}
          isLoading={isLoading}
          className="whitespace-nowrap px-4 py-2.5 h-[42px] bg-white text-[#1e1414] border-[#f3f1f1] hover:border-[#1e1414] hover:text-[#7A2E2E] shadow-sm font-semibold"
        >
          Apply
        </Button>
      </div>

      {status.message && (
        <p
          className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${
            status.type === "success" ? "text-[#2E7D32]" : "text-[#7b2d2d]"
          }`}
        >
          {status.type === "success" ? (
            <svg
              className="w-3.5 h-3.5 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-3.5 h-3.5 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          )}
          {status.message}
        </p>
      )}
    </form>
  );
}
