"use client";

import React from "react";
import FormErrorMessage from "../../auth/components/FormErrorMessage";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectCheckboxesProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function MultiSelectCheckboxes({
  options,
  value,
  onChange,
  label,
  error,
  columns = 2,
  className = "",
}: MultiSelectCheckboxesProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <span className="block text-sm font-medium text-[#1e1414]">
          {label}
        </span>
      )}

      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {options.map((option) => {
          const isChecked = value.includes(option.value);

          return (
            <label
              key={option.value}
              className={`
                relative flex items-center p-3 cursor-pointer rounded-lg border transition-all duration-200
                ${
                  isChecked
                    ? "bg-[#7A2E2E]/5 border-[#7A2E2E]"
                    : "bg-white border-[#f3f1f1] hover:bg-[#fcfcfc] hover:border-[#D2D2D2]"
                }
              `}
            >
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#7A2E2E] bg-white border-[#D2D2D2] rounded focus:ring-[#7A2E2E]/40 focus:ring-2"
                  checked={isChecked}
                  onChange={() => toggleOption(option.value)}
                />
              </div>
              <div className="ml-3 text-sm">
                <span
                  className={`font-medium ${isChecked ? "text-[#7A2E2E]" : "text-[#1e1414]"}`}
                >
                  {option.label}
                </span>
              </div>
            </label>
          );
        })}
      </div>

      <FormErrorMessage message={error} />
    </div>
  );
}
