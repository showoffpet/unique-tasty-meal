import React from "react";

type ConnectionStatus = "connected" | "disconnected" | "error" | "pending_auth";

interface StatusBadgeProps {
  status: ConnectionStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
}) => {
  const getConfig = () => {
    switch (status) {
      case "connected":
        return {
          bg: "bg-[#2E7D32]/10",
          text: "text-[#2E7D32]",
          border: "border-[#2E7D32]/20",
          label: "Connected",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case "error":
        return {
          bg: "bg-[#7b2d2d]/10",
          text: "text-[#7b2d2d]",
          border: "border-[#7b2d2d]/20",
          label: "Error",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
        };
      case "pending_auth":
        return {
          bg: "bg-[#F59E0B]/10",
          text: "text-[#D97706]",
          border: "border-[#F59E0B]/20",
          label: "Pending",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case "disconnected":
      default:
        return {
          bg: "bg-[#f3f1f1]",
          text: "text-[#806b6b]",
          border: "border-[#f3f1f1]",
          label: "Disconnected",
          icon: (
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
    }
  };

  const config = getConfig();

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <span className={`${iconSizes[size]}`}>{config.icon}</span>
      {config.label}
    </span>
  );
};
