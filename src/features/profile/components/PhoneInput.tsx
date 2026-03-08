"use client";

import React, { forwardRef } from "react";
import FormErrorMessage from "../../auth/components/FormErrorMessage";

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label = "Phone Number",
      error,
      countryCode = "+1",
      onCountryCodeChange,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || "phone-input";

    // Most common country codes for quick selection
    const countryCodes = [
      { code: "+1", label: "US/CA" },
      { code: "+234", label: "NG" },
      { code: "+44", label: "UK" },
    ];

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

        <div className="relative flex rounded-lg shadow-sm">
          {onCountryCodeChange ? (
            <select
              title="Country Code"
              value={countryCode}
              onChange={(e) => onCountryCodeChange(e.target.value)}
              className={`
                flex-shrink-0 z-10 inline-flex items-center py-2.5 px-3 text-sm font-medium text-center text-[#1e1414] 
                bg-[#f3f1f1] border border-r-0 rounded-l-lg hover:bg-[#f3f1f1] focus:ring-2 focus:outline-none focus:ring-[#7A2E2E]/40
                ${error ? "border-[#7b2d2d]" : "border-[#D2D2D2]"}
              `}
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.label})
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`
               inline-flex items-center px-3.5 text-sm text-[#806b6b] bg-[#f3f1f1] border border-r-0 rounded-l-md
               ${error ? "border-[#7b2d2d]" : "border-[#D2D2D2]"}
            `}
            >
              {countryCode}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type="tel"
            autoComplete="tel-national"
            placeholder="(555) 000-0000"
            className={`
              rounded-none rounded-r-lg bg-white border text-[#1e1414] focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E] block flex-1 min-w-0 w-full text-sm p-2.5
              transition-all duration-200 focus:outline-none focus:ring-2
              ${error ? "border-[#7b2d2d] z-10" : "border-[#D2D2D2] hover:border-[#7A2E2E]/40"}
              ${className}
            `}
            {...props}
          />
        </div>

        <FormErrorMessage message={error} />
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";
export default PhoneInput;
