"use client";

import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  error,
  className = "",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-[#1e1414]">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm text-left
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#7A2E2E]/40 focus:border-[#7A2E2E]
          ${disabled ? "bg-[#f3f1f1] text-[#999999] cursor-not-allowed border-[#f3f1f1]" : "bg-white cursor-pointer"}
          ${error ? "border-[#7b2d2d] ring-1 ring-[#7b2d2d]/20" : "border-[#D2D2D2] hover:border-[#7A2E2E]/40"}
          ${!selectedOption ? "text-[#999999]" : "text-[#1e1414]"}
        `}
      >
        <span className="truncate block mr-4">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#999999] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute z-50 w-full mt-1 bg-white border border-[#f3f1f1] rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none py-1 custom-scrollbar"
          role="listbox"
        >
          {options.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#999999] text-center">
              No options available
            </li>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={`
                    px-4 py-2.5 text-sm flex items-center justify-between
                    ${
                      option.disabled
                        ? "text-[#999999] cursor-not-allowed bg-white"
                        : "cursor-pointer text-[#1e1414] hover:bg-[#fcfcfc] hover:text-[#7A2E2E]"
                    }
                    ${isSelected ? "bg-[#fcfcfc] font-medium text-[#7A2E2E]" : ""}
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <svg
                      className="h-4 w-4 text-[#7A2E2E]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}

      {error && (
        <p className="text-xs text-[#7b2d2d] mt-1 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
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
          {error}
        </p>
      )}
    </div>
  );
}
