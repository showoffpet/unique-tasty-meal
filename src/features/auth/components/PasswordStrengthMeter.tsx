"use client";

import React, { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export default function PasswordStrengthMeter({
  password = "",
  className = "",
}: PasswordStrengthMeterProps) {
  const requirements = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains a number", met: /\d/.test(password) },
      {
        label: "Contains a special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
      {
        label: "Contains uppercase & lowercase",
        met: /[A-Z]/.test(password) && /[a-z]/.test(password),
      },
    ],
    [password],
  );

  const strength = requirements.filter((req) => req.met).length;

  // Calculate width percentage and color based on strength
  const getStrengthData = () => {
    switch (strength) {
      case 0:
        return { width: "0%", color: "bg-[#f3f1f1]", label: "Weak" };
      case 1:
        return { width: "25%", color: "bg-[#7b2d2d]", label: "Weak" };
      case 2:
        return { width: "50%", color: "bg-[#ED8B00]", label: "Fair" };
      case 3:
        return { width: "75%", color: "bg-blue-500", label: "Good" };
      case 4:
        return { width: "100%", color: "bg-[#2E7D32]", label: "Strong" };
      default:
        return { width: "0%", color: "bg-[#f3f1f1]", label: "Weak" };
    }
  };

  const strengthData = getStrengthData();

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#f3f1f1] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthData.color}`}
            style={{ width: strengthData.width }}
          />
        </div>
        <span className="text-xs font-semibold text-[#806b6b] w-12 text-right">
          {strengthData.label}
        </span>
      </div>

      {/* Requirements List */}
      <ul className="text-xs space-y-1.5">
        {requirements.map((req, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-2 ${req.met ? "text-[#2E7D32]" : "text-[#999999]"}`}
          >
            {req.met ? (
              <svg
                className="h-4 w-4 shrink-0"
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
            ) : (
              <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#D2D2D2]" />
              </div>
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
