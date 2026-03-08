"use client";

import React from "react";

interface NotificationBadgeProps {
  children: React.ReactNode;
  count?: number;
  showDot?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function NotificationBadge({
  children,
  count = 0,
  showDot = false,
  className = "",
  onClick,
}: NotificationBadgeProps) {
  const isVisible = count > 0 || showDot;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}

      {isVisible && (
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-10 transition-transform hover:scale-110">
          {count > 0 ? (
            <span className="flex items-center justify-center w-5 h-5 bg-[#7b2d2d] text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm shadow-[#7b2d2d]/20">
              {count > 99 ? "99+" : count}
            </span>
          ) : showDot ? (
            <span className="flex w-3 h-3 bg-[#7b2d2d] rounded-full border-2 border-white shadow-sm shadow-[#7b2d2d]/20" />
          ) : null}
        </div>
      )}
    </div>
  );
}
