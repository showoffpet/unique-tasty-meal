import React from "react";
import Toggle from "../../../components/ui/Toggle";

interface NotificationToggleProps {
  id: string;
  label: string;
  description: string;
  emailChecked: boolean;
  smsChecked: boolean;
  pushChecked: boolean;
  onEmailChange: (checked: boolean) => void;
  onSmsChange: (checked: boolean) => void;
  onPushChange: (checked: boolean) => void;
  className?: string;
}

export default function NotificationToggle({
  label,
  description,
  emailChecked,
  smsChecked,
  pushChecked,
  onEmailChange,
  onSmsChange,
  onPushChange,
  className = "",
}: NotificationToggleProps) {
  return (
    <div
      className={`py-4 border-b border-[#f3f1f1] last:border-0 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[#1e1414]">{label}</h4>
          <p className="text-sm text-[#806b6b] mt-1">{description}</p>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[140px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#806b6b]">Email</span>
            <Toggle
              checked={emailChecked}
              onChange={onEmailChange}
              aria-label={`Email ${label}`}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#806b6b]">SMS</span>
            <Toggle
              checked={smsChecked}
              onChange={onSmsChange}
              aria-label={`SMS ${label}`}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#806b6b]">Push</span>
            <Toggle
              checked={pushChecked}
              onChange={onPushChange}
              aria-label={`Push ${label}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
