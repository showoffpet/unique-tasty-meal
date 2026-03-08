"use client";

import React from "react";

interface BulkActionCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function BulkActionCheckbox({
  checked,
  onChange,
  disabled = false,
  className = "",
}: BulkActionCheckboxProps) {
  return (
    <label
      className={`relative flex items-center justify-center cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <input
        type="checkbox"
        className="w-5 h-5 rounded border-2 border-[#D2D2D2] text-[#7A2E2E] focus:ring-[#7A2E2E] focus:ring-offset-1 transition-colors hover:border-[#7A2E2E]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );
}
