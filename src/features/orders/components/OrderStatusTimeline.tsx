"use client";

import React from "react";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  className?: string;
}

const STATUS_STAGES = [
  { id: "pending", label: "Received", icon: "clipboard" },
  { id: "preparing", label: "Preparing", icon: "fire" },
  { id: "out_for_delivery", label: "On the Way", icon: "truck" },
  { id: "delivered", label: "Delivered", icon: "check" },
];

export default function OrderStatusTimeline({
  currentStatus,
  createdAt,
  deliveredAt,
  cancelledAt,
  className = "",
}: OrderStatusTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <div
        className={`bg-[#7b2d2d]/5 border border-[#7b2d2d]/20 rounded-xl p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 bg-[#7b2d2d]/10 text-[#7b2d2d] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-[#7b2d2d] mb-1">Order Cancelled</h3>
        {cancelledAt && (
          <p className="text-sm text-[#7b2d2d]/80">
            on {new Date(cancelledAt).toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  // Determine current active index based on status mapping
  let activeIndex = 0;
  if (currentStatus === "confirmed" || currentStatus === "preparing") {
    activeIndex = 1;
  } else if (currentStatus === "out_for_delivery") {
    activeIndex = 2;
  } else if (currentStatus === "delivered") {
    activeIndex = 3;
  }

  const getIcon = (
    iconName: string,
    isCompleted: boolean,
    isActive: boolean,
  ) => {
    const defaultClasses = `w-5 h-5 ${isCompleted || isActive ? "text-white" : "text-[#999999]"}`;

    switch (iconName) {
      case "clipboard":
        return (
          <svg
            className={defaultClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case "fire":
        return (
          <svg
            className={defaultClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 7.105 10m0 0A8.997 8.997 0 0111 14c1.669 0 3.218-.51 4.5-1.383 1.282.873 2.831 1.383 4.5 1.383a8.997 8.997 0 00-2.895-3.895z"
            />
          </svg>
        );
      case "truck":
        return (
          <svg
            className={defaultClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              focusable="false"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        );
      case "check":
        return (
          <svg
            className={defaultClasses}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`py-6 px-2 ${className}`}>
      <div className="relative">
        {/* Connecting Lines Context */}
        <div className="absolute top-6 left-0 right-0 max-w-[calc(100%-4rem)] mx-auto h-1 bg-[#f3f1f1] -z-10 rounded-full" />

        {/* Dynamic Progress Line */}
        <div
          className="absolute top-6 left-0 h-1 bg-[#2E7D32] -z-10 transition-all duration-500 rounded-full"
          style={{
            width: `calc(${activeIndex * (100 / (STATUS_STAGES.length - 1))}% - ${activeIndex === 0 ? "0px" : "2rem"})`,
            marginLeft: "2rem",
          }}
        />

        <div className="flex justify-between items-start relative z-10 w-full">
          {STATUS_STAGES.map((stage, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            const isPending = index > activeIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300
                    ${isCompleted ? "bg-[#2E7D32]" : ""}
                    ${isActive ? "bg-[#7A2E2E] ring-4 ring-[#7A2E2E]/20" : ""}
                    ${isPending ? "bg-[#f3f1f1]" : ""}
                  `}
                >
                  {getIcon(stage.icon, isCompleted, isActive)}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isActive
                        ? "text-[#7A2E2E]"
                        : isCompleted
                          ? "text-[#1e1414]"
                          : "text-[#999999]"
                    }`}
                  >
                    {stage.label}
                  </p>
                  {index === 0 && createdAt && (
                    <p className="text-[10px] text-[#806b6b] mt-1 hidden sm:block">
                      {new Date(createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                  {index === 3 && deliveredAt && (
                    <p className="text-[10px] text-[#2E7D32] font-semibold mt-1">
                      {new Date(deliveredAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
