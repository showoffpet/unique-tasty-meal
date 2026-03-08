"use client";

import React from "react";
import Dropdown from "../../../components/ui/Dropdown";

interface SortDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}

export default function SortDropdown({
  value,
  options,
  onChange,
  className = "",
}: SortDropdownProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-[#806b6b]">Sort by:</span>
      <Dropdown
        value={value}
        onChange={onChange}
        options={options}
        className="w-40 border-none shadow-none bg-transparent hover:bg-[#fcfcfc] focuse:ring-0"
      />
    </div>
  );
}
