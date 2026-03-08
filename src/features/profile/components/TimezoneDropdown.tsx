"use client";

import React, { useMemo } from "react";
import Dropdown from "../../../components/ui/Dropdown";

interface TimezoneDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export default function TimezoneDropdown({
  value,
  onChange,
  label = "Timezone",
  error,
  className = "",
  disabled = false,
}: TimezoneDropdownProps) {
  // A curated list of common timezones, specifically focusing on target demographics
  // (e.g., US, UK, West Africa for an African food app)
  const timezones = useMemo(
    () => [
      { value: "America/New_York", label: "Eastern Time (US & Canada)" },
      { value: "America/Chicago", label: "Central Time (US & Canada)" },
      { value: "America/Denver", label: "Mountain Time (US & Canada)" },
      { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
      { value: "America/Anchorage", label: "Alaska" },
      { value: "Pacific/Honolulu", label: "Hawaii" },
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Africa/Lagos", label: "West Africa Time (Lagos)" },
      { value: "Africa/Johannesburg", label: "South Africa Standard Time" },
      { value: "Europe/Paris", label: "Central European Time" },
      { value: "Asia/Dubai", label: "Gulf Standard Time (Dubai)" },
    ],
    [],
  );

  // Ensure current value exists in options, if not, append it temporarily
  const options = useMemo(() => {
    if (value && !timezones.some((tz) => tz.value === value)) {
      return [...timezones, { value, label: value }];
    }
    return timezones;
  }, [value, timezones]);

  return (
    <Dropdown
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select your timezone"
      error={error}
      className={className}
      disabled={disabled}
    />
  );
}
