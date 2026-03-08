"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: ToggleProps) {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex h-6 items-center">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7A2E2E] focus:ring-offset-2
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${checked ? "bg-[#7A2E2E]" : "bg-[#D2D2D2]"}
          `}
          role="switch"
          aria-checked={checked}
          aria-label={label}
        >
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${checked ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span
              className={`text-sm font-medium ${disabled ? "text-[#999999]" : "text-[#1e1414]"} cursor-pointer block`}
              onClick={() => !disabled && onChange(!checked)}
            >
              {label}
            </span>
          )}
          {description && (
            <p className="text-sm text-[#806b6b mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
