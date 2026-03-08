"use client";

import React, { forwardRef } from "react";
import FormErrorMessage from "./FormErrorMessage";

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    { label = "Email address", error, isValid, className = "", id, ...props },
    ref,
  ) => {
    const inputId = id || "email-input";

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#1e1414]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className={`h-5 w-5 ${error ? "text-[#7b2d2d]" : isValid ? "text-[#2E7D32]" : "text-[#999999]"}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            ref={ref}
            id={inputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            className={`
              w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm text-[#1e1414]
              bg-white placeholder-[#B3B3B3]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E]
              ${error ? "border-[#7b2d2d] ring-1 ring-[#7b2d2d]/20" : "border-[#D2D2D2] hover:border-[#7A2E2E]/40"}
              ${className}
            `}
            {...props}
          />

          {/* Validation Status Icon */}
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            {error ? (
              <svg
                className="h-5 w-5 text-[#7b2d2d]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : isValid ? (
              <svg
                className="h-5 w-5 text-[#2E7D32]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : null}
          </div>
        </div>
        <FormErrorMessage message={error} />
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";
export default EmailInput;
