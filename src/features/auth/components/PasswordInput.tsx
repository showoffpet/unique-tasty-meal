"use client";

import React, { forwardRef, useState } from "react";
import FormErrorMessage from "./FormErrorMessage";

interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
  showForgotPasswordLink?: boolean;
  onForgotPasswordClick?: () => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      error,
      showForgotPasswordLink,
      onForgotPasswordClick,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || "password-input";

    return (
      <div className="space-y-1.5 w-full">
        <div className="flex justify-between items-end">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-[#1e1414]"
            >
              {label}
            </label>
          )}
          {showForgotPasswordLink && (
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-xs font-semibold text-[#7A2E2E] hover:text-[#561b1b] transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 ${error ? "text-[#7b2d2d]" : "text-[#999999]"}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`
              w-full pl-10 pr-12 py-2.5 rounded-lg border text-sm text-[#1e1414]
              bg-white placeholder-[#B3B3B3]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E]
              ${error ? "border-[#7b2d2d] ring-1 ring-[#7b2d2d]/20" : "border-[#D2D2D2] hover:border-[#7A2E2E]/40"}
              ${className}
            `}
            {...props}
          />

          {/* Toggle Password Visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#999999] hover:text-[#806b6b] transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye off icon
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        <FormErrorMessage message={error} />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
