"use client";

import React from "react";
import Dropdown from "../../../components/ui/Dropdown";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface StatusUpdateDropdownProps {
  currentStatus: string;
  onUpdate: (newStatus: string) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function StatusUpdateDropdown({
  currentStatus,
  onUpdate,
  disabled = false,
  className = "",
}: StatusUpdateDropdownProps) {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdate = async (val: string) => {
    if (val === currentStatus || disabled) return;

    setIsUpdating(true);
    try {
      await onUpdate(val);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Dropdown
        value={currentStatus}
        onChange={handleUpdate}
        options={STATUS_OPTIONS}
        disabled={disabled || isUpdating}
      />
      {isUpdating && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <svg
            className="w-4 h-4 text-[#7A2E2E] animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
